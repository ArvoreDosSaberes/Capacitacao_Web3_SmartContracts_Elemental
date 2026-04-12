#!/usr/bin/env python3
"""
IPFS Uploader for Elemental NFTs
Upload de arquivos para IPFS público via Pinata API (Bearer JWT)
https://docs.pinata.cloud/api-reference/endpoint/ipfs/pin-file-to-ipfs
"""

import os
import sys
import json
import requests
import hashlib
import mimetypes
from pathlib import Path
from typing import Dict
import argparse

PINATA_API_URL = "https://api.pinata.cloud"
PINATA_GATEWAY  = "https://gateway.pinata.cloud/ipfs"


class PinataUploader:
    """Cliente para upload de arquivos para IPFS via Pinata (Bearer JWT)."""

    def __init__(self, jwt: str):
        """
        Args:
            jwt: JSON Web Token gerado no dashboard Pinata
                 (Keys → New Key → copie o campo JWT).
        """
        if not jwt:
            raise ValueError("JWT do Pinata não fornecido. "
                             "Gere em https://app.pinata.cloud/developers/api-keys")
        self.jwt = jwt
        self._headers = {"Authorization": f"Bearer {jwt}"}

    # ------------------------------------------------------------------ #
    #  Upload de arquivo único                                            #
    # ------------------------------------------------------------------ #
    def upload_file(self, file_path: str, name: str = None) -> Dict:
        """
        Faz upload e pin de um arquivo no IPFS via Pinata.

        Args:
            file_path: Caminho do arquivo local.
            name: Nome amigável (aparece no dashboard Pinata).

        Returns:
            Dicionário com CID, tamanho e URLs de acesso.
        """
        file_path = Path(file_path)
        if not file_path.exists():
            raise FileNotFoundError(f"Arquivo não encontrado: {file_path}")

        display_name = name or file_path.name
        url = f"{PINATA_API_URL}/pinning/pinFileToIPFS"

        with open(file_path, "rb") as f:
            files  = {"file": (file_path.name, f)}
            data   = {
                "pinataMetadata": json.dumps({"name": display_name}),
                "pinataOptions":  json.dumps({"cidVersion": 1}),
            }
            resp = requests.post(url, files=files, data=data,
                                 headers=self._headers, timeout=120)

        if resp.status_code != 200:
            raise Exception(f"Pinata upload falhou ({resp.status_code}): {resp.text}")

        result = resp.json()
        cid    = result["IpfsHash"]

        return {
            "cid":        cid,
            "size":       result["PinSize"],
            "name":       display_name,
            "local_path": str(file_path),
            "ipfs_url":   f"https://ipfs.io/ipfs/{cid}",
            "gateway_url": f"{PINATA_GATEWAY}/{cid}",
            "dweb_url":   f"https://{cid}.ipfs.dweb.link",
        }

    # ------------------------------------------------------------------ #
    #  Upload de diretório (cada arquivo individualmente)                 #
    # ------------------------------------------------------------------ #
    def upload_directory(self, dir_path: str) -> Dict:
        """Faz upload de todos os arquivos de um diretório."""
        dir_path = Path(dir_path)
        if not dir_path.is_dir():
            raise NotADirectoryError(f"Diretório não encontrado: {dir_path}")

        uploaded = []
        for fp in sorted(dir_path.rglob("*")):
            if not fp.is_file():
                continue
            try:
                result = self.upload_file(str(fp))
                uploaded.append(result)
                print(f"  ✔ {fp.name} → {result['cid']}")
            except Exception as e:
                print(f"  ✘ {fp.name}: {e}")

        return {"files": uploaded, "count": len(uploaded)}

    # ------------------------------------------------------------------ #
    #  Listar pins existentes                                             #
    # ------------------------------------------------------------------ #
    def list_pins(self, limit: int = 10) -> list:
        """Lista os arquivos pinados na conta Pinata."""
        url  = f"{PINATA_API_URL}/data/pinList?pageLimit={limit}&status=pinned"
        resp = requests.get(url, headers=self._headers, timeout=30)
        if resp.status_code != 200:
            raise Exception(f"Erro ao listar pins: {resp.text}")
        return resp.json().get("rows", [])

    # ------------------------------------------------------------------ #
    #  Remover pin                                                        #
    # ------------------------------------------------------------------ #
    def unpin(self, cid: str) -> bool:
        """Remove pin de um CID."""
        url  = f"{PINATA_API_URL}/pinning/unpin/{cid}"
        resp = requests.delete(url, headers=self._headers, timeout=30)
        return resp.status_code == 200

    # ------------------------------------------------------------------ #
    #  Testar autenticação                                                #
    # ------------------------------------------------------------------ #
    def test_auth(self) -> bool:
        """Verifica se o JWT é válido."""
        url  = f"{PINATA_API_URL}/data/testAuthentication"
        resp = requests.get(url, headers=self._headers, timeout=10)
        if resp.status_code == 200:
            msg = resp.json().get("message", "")
            print(f"Autenticação OK: {msg}")
            return True
        print(f"Autenticação falhou: {resp.status_code} – {resp.text}")
        return False


# ====================================================================== #
#  Helpers                                                                #
# ====================================================================== #

def load_config(config_path: str = "scripts/ipfs_config.json") -> Dict:
    """Carrega configuração do arquivo."""
    with open(config_path, "r") as f:
        return json.load(f)


def create_metadata_json(nft_id: int, name: str, image_cid: str,
                         high_res_cid: str, description: str = "") -> Dict:
    """Cria metadados JSON para NFT seguindo padrão ERC-721."""
    return {
        "name": name,
        "description": description or f"{name} – Elemental Creatures Collection",
        "image": f"https://ipfs.io/ipfs/{image_cid}",
        "external_url": "https://elemental-creatures.com",
        "attributes": [
            {"trait_type": "Collection", "value": "Elemental Creatures"},
            {"trait_type": "Rarity",     "value": "Legendary"},
            {"trait_type": "Element",    "value": name.split()[0] if " " in name else "Unknown"},
        ],
        "properties": {
            "files": [
                {"uri": f"https://ipfs.io/ipfs/{image_cid}",    "type": "image/gif"},
                {"uri": f"https://ipfs.io/ipfs/{high_res_cid}", "type": "image/png",
                 "display_type": "high_resolution"},
            ],
            "category": "image",
        },
        "high_resolution_download": f"https://ipfs.io/ipfs/{high_res_cid}",
        "token_id": nft_id,
    }


# ====================================================================== #
#  CLI                                                                    #
# ====================================================================== #

def main():
    parser = argparse.ArgumentParser(description="Upload de arquivos para IPFS via Pinata")
    parser.add_argument("--file",   help="Arquivo específico para upload")
    parser.add_argument("--dir",    help="Diretório para upload")
    parser.add_argument("--test",   action="store_true", help="Testar autenticação")
    parser.add_argument("--list",   action="store_true", help="Listar pins existentes")
    parser.add_argument("--nft-id", type=int, help="ID do NFT (para gerar metadados)")
    parser.add_argument("--name",   help="Nome do NFT (para gerar metadados)")
    parser.add_argument("--config", default="scripts/ipfs_config.json")
    parser.add_argument("--output", default="ipfs_uploads.json")
    args = parser.parse_args()

    try:
        config = load_config(args.config)

        # JWT pode vir do config ou da env var PINATA_JWT
        jwt = config.get("pinata_jwt") or os.environ.get("PINATA_JWT", "")
        if not jwt:
            print("ERRO: Campo 'pinata_jwt' não encontrado em", args.config)
            print("Gere um JWT em https://app.pinata.cloud/developers/api-keys")
            print("e adicione ao config como:  \"pinata_jwt\": \"eyJ...\"")
            sys.exit(1)

        uploader = PinataUploader(jwt)

        # --test
        if args.test:
            uploader.test_auth()
            return

        # --list
        if args.list:
            pins = uploader.list_pins()
            for p in pins:
                print(f"  {p['ipfs_pin_hash']}  {p['metadata']['name']}  "
                      f"({p['size']} bytes)")
            return

        uploads = []

        # --file
        if args.file:
            print(f"Fazendo upload: {args.file}")
            result = uploader.upload_file(args.file)
            uploads.append(result)
            print(f"✔ CID: {result['cid']}")
            print(f"  IPFS:    {result['ipfs_url']}")
            print(f"  Gateway: {result['gateway_url']}")

        # --dir
        elif args.dir:
            print(f"Fazendo upload do diretório: {args.dir}")
            result = uploader.upload_directory(args.dir)
            uploads = result["files"]
            print(f"\n{result['count']} arquivo(s) enviados.")

        # Gerar metadados ERC-721 se --nft-id e --name fornecidos
        if args.nft_id is not None and args.name and len(uploads) >= 1:
            image_cid    = uploads[0]["cid"]
            high_res_cid = uploads[1]["cid"] if len(uploads) >= 2 else image_cid
            metadata = create_metadata_json(args.nft_id, args.name,
                                            image_cid, high_res_cid)
            meta_file = f"metadata_nft_{args.nft_id}.json"
            with open(meta_file, "w") as f:
                json.dump(metadata, f, indent=2)
            print(f"\nMetadados ERC-721 salvos: {meta_file}")

            # Upload dos metadados para IPFS também
            meta_result = uploader.upload_file(meta_file,
                                               name=f"metadata_nft_{args.nft_id}")
            uploads.append(meta_result)
            print(f"✔ Metadados no IPFS: {meta_result['ipfs_url']}")

        # Salvar log
        if uploads:
            with open(args.output, "w") as f:
                json.dump(uploads, f, indent=2)
            print(f"\nLog salvo em: {args.output}")

    except Exception as e:
        print(f"Erro: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
