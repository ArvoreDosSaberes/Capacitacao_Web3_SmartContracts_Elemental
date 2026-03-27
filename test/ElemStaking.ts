import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { parseEther, numberToHex } from "viem";

describe("ElemStaking", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, user1] = await viem.getWalletClients();

  /**
   * Helper: deploy ElemToken + PriceFeed + ElemStaking e transfere tokens para user1.
   * PriceFeed usa endereço EOA (fallback price = 2000 USD).
   */
  async function deployStakingFixture() {
    const token = await viem.deployContract("ElemToken", [owner.account.address]);
    const mockAgg = await viem.deployContract("MockAggregator", [2000n * 10n ** 8n, 8]);
    const priceFeed = await viem.deployContract("PriceFeed", [
      mockAgg.address,
      owner.account.address,
    ]);
    const staking = await viem.deployContract("ElemStaking", [
      token.address,
      priceFeed.address,
      owner.account.address,
    ]);

    // Transferir tokens para user1 para staking
    await token.write.transfer([user1.account.address, parseEther("10000")]);

    // Transferir tokens para o contrato de staking (fundo de recompensas)
    await token.write.transfer([staking.address, parseEther("50000")]);

    return { token, priceFeed, staking };
  }

  it("Should allow user to stake tokens", async function () {
    const { token, staking } = await deployStakingFixture();
    const stakeAmount = parseEther("1000");

    // Approve
    await token.write.approve([staking.address, stakeAmount], {
      account: user1.account,
    });

    // Stake
    await staking.write.stake([stakeAmount], { account: user1.account });

    const stakeInfo = await staking.read.stakes([user1.account.address]);
    assert.equal(stakeInfo[0], stakeAmount); // amount

    const totalStaked = await staking.read.totalStaked();
    assert.equal(totalStaked, stakeAmount);
  });

  it("Should reject stake of 0 tokens", async function () {
    const { staking } = await deployStakingFixture();

    let failed = false;
    try {
      await staking.write.stake([0n], { account: user1.account });
    } catch {
      failed = true;
    }
    assert.ok(failed, "Should reject 0 amount stake");
  });

  it("Should allow user to withdraw staked tokens", async function () {
    const { token, staking } = await deployStakingFixture();
    const stakeAmount = parseEther("1000");

    await token.write.approve([staking.address, stakeAmount], {
      account: user1.account,
    });
    await staking.write.stake([stakeAmount], { account: user1.account });

    // Withdraw half
    await staking.write.withdraw([parseEther("500")], { account: user1.account });

    const stakeInfo = await staking.read.stakes([user1.account.address]);
    assert.equal(stakeInfo[0], parseEther("500"));
  });

  it("Should reject withdraw more than staked", async function () {
    const { token, staking } = await deployStakingFixture();
    const stakeAmount = parseEther("1000");

    await token.write.approve([staking.address, stakeAmount], {
      account: user1.account,
    });
    await staking.write.stake([stakeAmount], { account: user1.account });

    let failed = false;
    try {
      await staking.write.withdraw([parseEther("2000")], { account: user1.account });
    } catch {
      failed = true;
    }
    assert.ok(failed, "Should reject withdraw exceeding staked amount");
  });

  it("Should accumulate rewards over time", async function () {
    const { token, staking } = await deployStakingFixture();
    const stakeAmount = parseEther("1000");

    await token.write.approve([staking.address, stakeAmount], {
      account: user1.account,
    });
    await staking.write.stake([stakeAmount], { account: user1.account });

    // Avançar tempo (1 dia)
    await publicClient.request({
      method: "evm_increaseTime" as any,
      params: [numberToHex(86400)],
    } as any);
    await publicClient.request({
      method: "evm_mine" as any,
      params: [],
    } as any);

    const pending = await staking.read.pendingReward([user1.account.address]);
    assert.ok(pending > 0n, "Should have pending rewards after 1 day");
  });

  it("Should allow claiming rewards", async function () {
    const { token, staking } = await deployStakingFixture();
    const stakeAmount = parseEther("1000");

    await token.write.approve([staking.address, stakeAmount], {
      account: user1.account,
    });
    await staking.write.stake([stakeAmount], { account: user1.account });

    // Avançar tempo
    await publicClient.request({
      method: "evm_increaseTime" as any,
      params: [numberToHex(86400)],
    } as any);
    await publicClient.request({
      method: "evm_mine" as any,
      params: [],
    } as any);

    const balanceBefore = await token.read.balanceOf([user1.account.address]);
    await staking.write.claimReward({ account: user1.account });
    const balanceAfter = await token.read.balanceOf([user1.account.address]);

    assert.ok(balanceAfter > balanceBefore, "Balance should increase after claiming");
  });

  it("Should emit Staked and Withdrawn events", async function () {
    const { token, staking } = await deployStakingFixture();
    const stakeAmount = parseEther("1000");
    const deployBlock = await publicClient.getBlockNumber();

    await token.write.approve([staking.address, stakeAmount], {
      account: user1.account,
    });
    await staking.write.stake([stakeAmount], { account: user1.account });

    const stakedEvents = await publicClient.getContractEvents({
      address: staking.address,
      abi: staking.abi,
      eventName: "Staked",
      fromBlock: deployBlock,
      strict: true,
    });
    assert.equal(stakedEvents.length, 1);
    assert.equal(stakedEvents[0].args.amount, stakeAmount);

    await staking.write.withdraw([stakeAmount], { account: user1.account });

    const withdrawnEvents = await publicClient.getContractEvents({
      address: staking.address,
      abi: staking.abi,
      eventName: "Withdrawn",
      fromBlock: deployBlock,
      strict: true,
    });
    assert.equal(withdrawnEvents.length, 1);
  });

  it("Should allow owner to update base rate", async function () {
    const { staking } = await deployStakingFixture();

    await staking.write.setBaseRate([200n]);
    const rate = await staking.read.baseRate();
    assert.equal(rate, 200n);
  });
});
