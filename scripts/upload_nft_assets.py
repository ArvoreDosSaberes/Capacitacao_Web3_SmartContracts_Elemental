#!/usr/bin/env python3
"""
Upload Automatizado de Assets NFT para IPFS
Script para fazer upload das versões de alta resolução e atualizar metadados no contrato
"""

import os
import sys
import json
import asyncio
from pathlib import Path
from web3 import Web3
from ipfs_uploader import IPFSUploader, load_config, create_metadata_json

# Configuração dos NFTs
NFT_CONFIG = [
    {"id": 0, "name": "Fire Elemental", "gif": "/NFT/nft_01_fire_elemental.gif", "high_res": "high_res/fire_elemental.png"},
    {"id": 1, "name": "Water Spirit", "gif": "/NFT/nft_02_water_spirit.gif", "high_res": "high_res/water_spirit.png"},
    {"id": 2, "name": "Earth Golem", "gif": "/NFT/nft_03_earth_golem.gif", "high_res": "high_res/earth_golem.png"},
    {"id": 3, "name": "Lightning Bolt", "gif": "/NFT/nft_04_lightning_bolt.gif", "high_res": "high_res/lightning_bolt.png"},
    {"id": 4, "name": "Shadow Phantom", "gif": "/NFT/nft_05_shadow_phantom.gif", "high_res": "high_res/shadow_phantom.png"},
    {"id": 5, "name": "Crystal Gem", "gif": "/NFT/nft_06_crystal_gem.gif", "high_res": "high_res/crystal_gem.png"},
    {"id": 6, "name": "Solar Flare", "gif": "/NFT/nft_07_solar_flare.gif", "high_res": "high_res/solar_flare.png"},
    {"id": 7, "name": "Toxic Slime", "gif": "/NFT/nft_08_toxic_slime.gif", "high_res": "high_res/toxic_slime.png"},
    {"id": 8, "name": "Frost Shard", "gif": "/NFT/nft_09_frost_shard.gif", "high_res": "high_res/frost_shard.png"},
    {"id": 9, "name": "Magma Core", "gif": "/NFT/nft_10_magma_core.gif", "high_res": "high_res/magma_core.png"},
]

class NFTAssetManager:
    """Gerenciador de assets NFT com IPFS e Blockchain"""
    
    def __init__(self, config_path: str = "scripts/ipfs_config.json"):
        # Carregar configurações
        self.ipfs_config = load_config(config_path)
        
        # Inicializar uploader IPFS
        self.uploader = IPFSUploader(
            api_key=self.ipfs_config['infura_api_key'],
            api_key_secret=self.ipfs_config['infura_api_key_secret']
        )
        
        # Configuração Web3 (será carregada depois)
        self.w3 = None
        self.contract = None
        self.account = None
    
    def setup_web3(self, rpc_url: str, private_key: str, contract_address: str):
        """Configura conexão com blockchain"""
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        
        if not self.w3.is_connected():
            raise Exception("Não foi possível conectar à blockchain")
        
        # Configurar conta
        self.account = self.w3.eth.account.from_key(private_key)
        self.w3.eth.default_account = self.account.address
        
        # Carregar ABI do contrato
        abi_path = "artifacts/ElemNFT.json"
        if not os.path.exists(abi_path):
            # Tentar encontrar em ignition/modules
            ignition_path = "ignition/modules/ElemNFT.json"
            if os.path.exists(ignition_path):
                abi_path = ignition_path
            else:
                raise FileNotFoundError(f"ABI não encontrada em {abi_path} ou {ignition_path}")
        
        with open(abi_path, 'r') as f:
            contract_data = json.load(f)
            abi = contract_data['abi'] if 'abi' in contract_data else contract_data
        
        # Instanciar contrato
        self.contract = self.w3.eth.contract(
            address=Web3.to_checksum_address(contract_address),
            abi=abi
        )
        
        print(f"Conectado à blockchain com conta {self.account.address}")
        print(f"Contrato NFT: {contract_address}")
    
    def upload_nft_assets(self, nft_config: dict, base_path: str = ".") -> dict:
        """Faz upload dos assets de um NFT para IPFS"""
        print(f"\n=== Upload NFT #{nft_config['id']} - {nft_config['name']} ===")
        
        results = {}
        
        # Upload da imagem GIF (se existir localmente)
        gif_path = os.path.join(base_path, nft_config['gif'].lstrip('/'))
        if os.path.exists(gif_path):
            print(f"Fazendo upload do GIF: {gif_path}")
            gif_result = self.uploader.upload_file(gif_path)
            results['gif'] = gif_result
            print(f"GIF uploadado: {gif_result['ipfs_url']}")
        else:
            print(f"GIF não encontrado: {gif_path}")
            results['gif'] = None
        
        # Upload da imagem de alta resolução
        high_res_path = os.path.join(base_path, nft_config['high_res'].lstrip('/'))
        if os.path.exists(high_res_path):
            print(f"Fazendo upload da alta resolução: {high_res_path}")
            high_res_result = self.uploader.upload_file(high_res_path)
            results['high_res'] = high_res_result
            print(f"Alta resolução uploadada: {high_res_result['ipfs_url']}")
        else:
            print(f"Arquivo de alta resolução não encontrado: {high_res_path}")
            results['high_res'] = None
        
        # Criar e upload dos metadados
        if results['gif'] and results['high_res']:
            print("Criando metadados...")
            metadata = create_metadata_json(
                nft_id=nft_config['id'],
                name=nft_config['name'],
                image_hash=results['gif']['hash'],
                high_res_hash=results['high_res']['hash']
            )
            
            # Salvar metadados localmente
            metadata_file = f"metadata_nft_{nft_config['id']}.json"
            with open(metadata_file, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            # Upload dos metadados
            print(f"Fazendo upload dos metadados: {metadata_file}")
            metadata_result = self.uploader.upload_file(metadata_file)
            results['metadata'] = metadata_result
            print(f"Metadados uploadados: {metadata_result['ipfs_url']}")
        else:
            print("Não foi possível criar metadados - faltam arquivos")
            results['metadata'] = None
        
        return results
    
    def update_contract_metadata(self, token_id: int, upload_results: dict):
        """Atualiza metadados no contrato inteligente"""
        if not self.contract:
            raise Exception("Contrato não configurado")
        
        gif_hash = upload_results['gif']['hash'] if upload_results['gif'] else ""
        high_res_hash = upload_results['high_res']['hash'] if upload_results['high_res'] else ""
        metadata_hash = upload_results['metadata']['hash'] if upload_results['metadata'] else ""
        
        if not gif_hash or not high_res_hash or not metadata_hash:
            print(f" Pulando atualização do NFT #{token_id} - metadados incompletos")
            return False
        
        print(f"Atualizando metadados do NFT #{token_id} no contrato...")
        
        try:
            # Construir transação
            tx_hash = self.contract.functions.updateIPFSMetadata(
                token_id,
                gif_hash,
                high_res_hash,
                metadata_hash
            ).transact({
                'from': self.account.address,
                'gas': 200000
            })
            
            # Aguardar confirmação
            receipt = self.w3.eth.wait_for_transaction_receipt(tx_hash)
            
            if receipt['status'] == 1:
                print(f" Metadados atualizados com sucesso! Tx: {tx_hash.hex()}")
                return True
            else:
                print(f" Falha na atualização dos metadados")
                return False
                
        except Exception as e:
            print(f" Erro ao atualizar metadados: {str(e)}")
            return False
    
    def process_all_nfts(self, base_path: str = ".", update_contract: bool = False):
        """Processa todos os NFTs"""
        print("=== Processamento de todos os NFTs ===")
        
        all_results = {}
        
        for nft in NFT_CONFIG:
            try:
                # Upload dos assets
                upload_results = self.upload_nft_assets(nft, base_path)
                all_results[nft['id']] = upload_results
                
                # Atualizar contrato se solicitado
                if update_contract and upload_results['gif'] and upload_results['high_res'] and upload_results['metadata']:
                    self.update_contract_metadata(nft['id'], upload_results)
                
                print(f" NFT #{nft['id']} processado com sucesso!")
                
            except Exception as e:
                print(f" Erro ao processar NFT #{nft['id']}: {str(e)}")
                all_results[nft['id']] = {'error': str(e)}
        
        # Salvar resultados
        results_file = "nft_upload_results.json"
        with open(results_file, 'w') as f:
            json.dump(all_results, f, indent=2)
        
        print(f"\nResultados salvos em: {results_file}")
        return all_results

def main():
    import argparse
    
    parser = argparse.ArgumentParser(description="Upload automatizado de assets NFT")
    parser.add_argument("--base-path", default=".", help="Caminho base dos arquivos")
    parser.add_argument("--config", default="scripts/ipfs_config.json", help="Configuração IPFS")
    parser.add_argument("--rpc-url", help="URL RPC da blockchain")
    parser.add_argument("--private-key", help="Chave privada (ou variável PRIVATE_KEY)")
    parser.add_argument("--contract-address", help="Endereço do contrato NFT")
    parser.add_argument("--update-contract", action="store_true", help="Atualiza metadados no contrato")
    parser.add_argument("--nft-id", type=int, help="Processa apenas um NFT específico")
    
    args = parser.parse_args()
    
    try:
        # Inicializar gerenciador
        manager = NFTAssetManager(args.config)
        
        # Configurar Web3 se necessário
        if args.update_contract:
            if not all([args.rpc_url, args.private_key, args.contract_address]):
                private_key = os.getenv('PRIVATE_KEY', args.private_key)
                
                if not all([args.rpc_url, private_key, args.contract_address]):
                    print("Para atualizar contrato, informe --rpc-url, --private-key e --contract-address")
                    sys.exit(1)
            
            manager.setup_web3(args.rpc_url, private_key, args.contract_address)
        
        # Processar NFTs
        if args.nft_id is not None:
            # Processar NFT específico
            nft_config = next((n for n in NFT_CONFIG if n['id'] == args.nft_id), None)
            if not nft_config:
                print(f"NFT #{args.nft_id} não encontrado")
                sys.exit(1)
            
            upload_results = manager.upload_nft_assets(nft_config, args.base_path)
            
            if args.update_contract:
                manager.update_contract_metadata(args.nft_id, upload_results)
        else:
            # Processar todos
            manager.process_all_nfts(args.base_path, args.update_contract)
        
        print("\n=== Processamento concluído! ===")
        
    except Exception as e:
        print(f"Erro: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
