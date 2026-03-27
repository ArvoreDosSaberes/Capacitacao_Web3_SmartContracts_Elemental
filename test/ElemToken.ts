import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { parseEther, formatEther } from "viem";

describe("ElemToken", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, user1, user2] = await viem.getWalletClients();

  it("Should deploy with correct name, symbol and max supply", async function () {
    const token = await viem.deployContract("ElemToken", [owner.account.address]);

    const name = await token.read.name();
    const symbol = await token.read.symbol();
    const totalSupply = await token.read.totalSupply();
    const maxSupply = await token.read.MAX_SUPPLY();

    assert.equal(name, "Elemental Token");
    assert.equal(symbol, "ELEM");
    assert.equal(totalSupply, maxSupply);
    assert.equal(totalSupply, parseEther("1000000"));
  });

  it("Should mint entire supply to owner on deploy", async function () {
    const token = await viem.deployContract("ElemToken", [owner.account.address]);
    const balance = await token.read.balanceOf([owner.account.address]);
    assert.equal(balance, parseEther("1000000"));
  });

  it("Should allow owner to pause and unpause", async function () {
    const token = await viem.deployContract("ElemToken", [owner.account.address]);

    await token.write.pause();

    // Transfer should fail while paused
    let failed = false;
    try {
      await token.write.transfer([user1.account.address, parseEther("100")]);
    } catch {
      failed = true;
    }
    assert.ok(failed, "Transfer should fail when paused");

    await token.write.unpause();

    // Transfer should succeed after unpause
    await token.write.transfer([user1.account.address, parseEther("100")]);
    const balance = await token.read.balanceOf([user1.account.address]);
    assert.equal(balance, parseEther("100"));
  });

  it("Should allow burning tokens", async function () {
    const token = await viem.deployContract("ElemToken", [owner.account.address]);
    const initialSupply = await token.read.totalSupply();

    await token.write.burn([parseEther("1000")]);

    const newSupply = await token.read.totalSupply();
    assert.equal(newSupply, initialSupply - parseEther("1000"));
  });

  it("Should not allow non-owner to mint", async function () {
    const token = await viem.deployContract("ElemToken", [owner.account.address]);

    let failed = false;
    try {
      await token.write.mint([user1.account.address, parseEther("100")], {
        account: user1.account,
      });
    } catch {
      failed = true;
    }
    assert.ok(failed, "Non-owner should not be able to mint");
  });

  it("Should not allow minting beyond max supply", async function () {
    const token = await viem.deployContract("ElemToken", [owner.account.address]);

    let failed = false;
    try {
      await token.write.mint([user1.account.address, 1n]);
    } catch {
      failed = true;
    }
    assert.ok(failed, "Should not mint beyond max supply");
  });

  it("Should allow transfers between users", async function () {
    const token = await viem.deployContract("ElemToken", [owner.account.address]);

    await token.write.transfer([user1.account.address, parseEther("500")]);
    await token.write.transfer([user2.account.address, parseEther("500")], {
      account: user1.account,
    });

    const balance2 = await token.read.balanceOf([user2.account.address]);
    assert.equal(balance2, parseEther("500"));
  });
});
