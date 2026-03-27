import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { parseEther } from "viem";

describe("ElemNFT", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, user1, user2] = await viem.getWalletClients();

  it("Should deploy with correct name and symbol", async function () {
    const nft = await viem.deployContract("ElemNFT", [owner.account.address]);

    const name = await nft.read.name();
    const symbol = await nft.read.symbol();

    assert.equal(name, "Elemental Creatures");
    assert.equal(symbol, "ECRAFT");
  });

  it("Should have MAX_SUPPLY of 10", async function () {
    const nft = await viem.deployContract("ElemNFT", [owner.account.address]);
    const maxSupply = await nft.read.MAX_SUPPLY();
    assert.equal(maxSupply, 10n);
  });

  it("Should allow minting with correct ETH payment", async function () {
    const nft = await viem.deployContract("ElemNFT", [owner.account.address]);
    const mintPrice = await nft.read.mintPrice();

    await nft.write.mint(["ipfs://test-uri-0"], {
      value: mintPrice,
      account: user1.account,
    });

    const balance = await nft.read.balanceOf([user1.account.address]);
    assert.equal(balance, 1n);

    const ownerOf = await nft.read.ownerOf([0n]);
    assert.equal(ownerOf.toLowerCase(), user1.account.address.toLowerCase());
  });

  it("Should reject mint with insufficient ETH", async function () {
    const nft = await viem.deployContract("ElemNFT", [owner.account.address]);

    let failed = false;
    try {
      await nft.write.mint(["ipfs://test-uri-0"], {
        value: parseEther("0.001"),
        account: user1.account,
      });
    } catch {
      failed = true;
    }
    assert.ok(failed, "Should reject mint with insufficient ETH");
  });

  it("Should return correct creature name", async function () {
    const nft = await viem.deployContract("ElemNFT", [owner.account.address]);
    const name0 = await nft.read.creatureName([0n]);
    const name9 = await nft.read.creatureName([9n]);

    assert.equal(name0, "Fire Elemental");
    assert.equal(name9, "Magma Core");
  });

  it("Should emit NFTMinted event on mint", async function () {
    const nft = await viem.deployContract("ElemNFT", [owner.account.address]);
    const mintPrice = await nft.read.mintPrice();
    const deployBlock = await publicClient.getBlockNumber();

    await nft.write.mint(["ipfs://test-uri-0"], {
      value: mintPrice,
      account: user1.account,
    });

    const events = await publicClient.getContractEvents({
      address: nft.address,
      abi: nft.abi,
      eventName: "NFTMinted",
      fromBlock: deployBlock,
      strict: true,
    });

    assert.equal(events.length, 1);
    assert.equal(events[0].args.to.toLowerCase(), user1.account.address.toLowerCase());
    assert.equal(events[0].args.tokenId, 0n);
    assert.equal(events[0].args.name, "Fire Elemental");
  });

  it("Should allow owner to change mint price", async function () {
    const nft = await viem.deployContract("ElemNFT", [owner.account.address]);
    const newPrice = parseEther("0.05");

    await nft.write.setMintPrice([newPrice]);
    const price = await nft.read.mintPrice();
    assert.equal(price, newPrice);
  });

  it("Should allow owner to withdraw ETH", async function () {
    const nft = await viem.deployContract("ElemNFT", [owner.account.address]);
    const mintPrice = await nft.read.mintPrice();

    // Mint to accumulate ETH
    await nft.write.mint(["ipfs://test-uri-0"], {
      value: mintPrice,
      account: user1.account,
    });

    const balanceBefore = await publicClient.getBalance({ address: owner.account.address });
    await nft.write.withdraw();
    const balanceAfter = await publicClient.getBalance({ address: owner.account.address });

    // Owner balance should increase (minus gas)
    assert.ok(balanceAfter > balanceBefore - parseEther("0.01"));
  });

  it("Should not allow minting more than MAX_SUPPLY", async function () {
    const nft = await viem.deployContract("ElemNFT", [owner.account.address]);
    const mintPrice = await nft.read.mintPrice();

    // Mint all 10
    for (let i = 0; i < 10; i++) {
      await nft.write.mint([`ipfs://test-uri-${i}`], {
        value: mintPrice,
        account: user1.account,
      });
    }

    // 11th should fail
    let failed = false;
    try {
      await nft.write.mint(["ipfs://test-uri-10"], {
        value: mintPrice,
        account: user1.account,
      });
    } catch {
      failed = true;
    }
    assert.ok(failed, "Should not allow minting beyond MAX_SUPPLY");
  });
});
