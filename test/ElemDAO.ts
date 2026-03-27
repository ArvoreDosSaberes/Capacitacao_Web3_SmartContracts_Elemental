import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";
import { parseEther, numberToHex } from "viem";

describe("ElemDAO", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, voter1, voter2] = await viem.getWalletClients();

  /**
   * Helper: deploy ElemToken + ElemDAO, distribuir tokens para voters.
   */
  async function deployDAOFixture() {
    const token = await viem.deployContract("ElemToken", [owner.account.address]);
    const dao = await viem.deployContract("ElemDAO", [token.address, owner.account.address]);

    // Distribuir tokens para voters
    await token.write.transfer([voter1.account.address, parseEther("200000")]);
    await token.write.transfer([voter2.account.address, parseEther("100000")]);

    return { token, dao };
  }

  it("Should allow token holder to create a proposal", async function () {
    const { dao } = await deployDAOFixture();

    await dao.write.createProposal(["Aumentar recompensa de staking para 2%"], {
      account: voter1.account,
    });

    const count = await dao.read.proposalCount();
    assert.equal(count, 1n);

    const proposal = await dao.read.proposals([0n]);
    assert.equal(proposal[0], 0n); // id
    assert.equal(proposal[1].toLowerCase(), voter1.account.address.toLowerCase()); // proposer
    assert.equal(proposal[2], "Aumentar recompensa de staking para 2%"); // description
  });

  it("Should not allow non-holder to create proposal", async function () {
    const { dao } = await deployDAOFixture();
    const [, , , noTokenUser] = await viem.getWalletClients();

    let failed = false;
    try {
      await dao.write.createProposal(["Proposta sem tokens"], {
        account: noTokenUser.account,
      });
    } catch {
      failed = true;
    }
    assert.ok(failed, "Non-holder should not create proposal");
  });

  it("Should allow voting on active proposal", async function () {
    const { dao } = await deployDAOFixture();

    await dao.write.createProposal(["Test proposal"], {
      account: voter1.account,
    });

    // voter1 vota a favor
    await dao.write.vote([0n, true], { account: voter1.account });

    const proposal = await dao.read.proposals([0n]);
    assert.equal(proposal[3], parseEther("200000")); // forVotes

    // voter2 vota contra
    await dao.write.vote([0n, false], { account: voter2.account });

    const updated = await dao.read.proposals([0n]);
    assert.equal(updated[4], parseEther("100000")); // againstVotes
  });

  it("Should not allow double voting", async function () {
    const { dao } = await deployDAOFixture();

    await dao.write.createProposal(["Test proposal"], {
      account: voter1.account,
    });

    await dao.write.vote([0n, true], { account: voter1.account });

    let failed = false;
    try {
      await dao.write.vote([0n, true], { account: voter1.account });
    } catch {
      failed = true;
    }
    assert.ok(failed, "Should not allow double voting");
  });

  it("Should track hasVoted correctly", async function () {
    const { dao } = await deployDAOFixture();

    await dao.write.createProposal(["Test proposal"], {
      account: voter1.account,
    });

    const beforeVote = await dao.read.hasVoted([0n, voter1.account.address]);
    assert.equal(beforeVote, false);

    await dao.write.vote([0n, true], { account: voter1.account });

    const afterVote = await dao.read.hasVoted([0n, voter1.account.address]);
    assert.equal(afterVote, true);
  });

  it("Should approve proposal that meets quorum and majority", async function () {
    const { dao } = await deployDAOFixture();

    // Reduzir período de votação para 1 segundo
    await dao.write.setVotingPeriod([1n]);

    await dao.write.createProposal(["Approved proposal"], {
      account: voter1.account,
    });

    // voter1 (200k) vota a favor — mais de 10% quórum
    await dao.write.vote([0n, true], { account: voter1.account });

    // Avançar tempo para encerrar votação
    await publicClient.request({
      method: "evm_increaseTime" as any,
      params: [numberToHex(10)],
    } as any);
    await publicClient.request({
      method: "evm_mine" as any,
      params: [],
    } as any);

    const proposalState = await dao.read.state([0n]);
    assert.equal(proposalState, 1); // Approved
  });

  it("Should reject proposal that doesn't meet quorum", async function () {
    const { token, dao } = await deployDAOFixture();

    // Reduzir período de votação
    await dao.write.setVotingPeriod([1n]);

    // Criar um voter com pouquíssimos tokens (não atinge 10% quórum)
    const [, , , smallVoter] = await viem.getWalletClients();
    await token.write.transfer([smallVoter.account.address, parseEther("1")]);

    await dao.write.createProposal(["Low quorum proposal"], {
      account: smallVoter.account,
    });

    await dao.write.vote([0n, true], { account: smallVoter.account });

    // Avançar tempo
    await publicClient.request({
      method: "evm_increaseTime" as any,
      params: [numberToHex(10)],
    } as any);
    await publicClient.request({
      method: "evm_mine" as any,
      params: [],
    } as any);

    const proposalState = await dao.read.state([0n]);
    assert.equal(proposalState, 2); // Rejected
  });

  it("Should allow executing approved proposal", async function () {
    const { dao } = await deployDAOFixture();

    await dao.write.setVotingPeriod([1n]);

    await dao.write.createProposal(["Execute me"], {
      account: voter1.account,
    });

    await dao.write.vote([0n, true], { account: voter1.account });

    await publicClient.request({
      method: "evm_increaseTime" as any,
      params: [numberToHex(10)],
    } as any);
    await publicClient.request({
      method: "evm_mine" as any,
      params: [],
    } as any);

    await dao.write.executeProposal([0n], { account: voter1.account });

    const proposalState = await dao.read.state([0n]);
    assert.equal(proposalState, 3); // Executed
  });

  it("Should emit ProposalCreated and Voted events", async function () {
    const { dao } = await deployDAOFixture();
    const deployBlock = await publicClient.getBlockNumber();

    await dao.write.createProposal(["Event test"], {
      account: voter1.account,
    });

    const createdEvents = await publicClient.getContractEvents({
      address: dao.address,
      abi: dao.abi,
      eventName: "ProposalCreated",
      fromBlock: deployBlock,
      strict: true,
    });
    assert.equal(createdEvents.length, 1);
    assert.equal(createdEvents[0].args.description, "Event test");

    await dao.write.vote([0n, true], { account: voter1.account });

    const votedEvents = await publicClient.getContractEvents({
      address: dao.address,
      abi: dao.abi,
      eventName: "Voted",
      fromBlock: deployBlock,
      strict: true,
    });
    assert.equal(votedEvents.length, 1);
    assert.equal(votedEvents[0].args.support, true);
  });

  it("Should allow owner to update quorum percentage", async function () {
    const { dao } = await deployDAOFixture();

    await dao.write.setQuorumPercentage([20n]);
    const quorum = await dao.read.quorumPercentage();
    assert.equal(quorum, 20n);
  });

  it("Should reject invalid quorum (> 100)", async function () {
    const { dao } = await deployDAOFixture();

    let failed = false;
    try {
      await dao.write.setQuorumPercentage([101n]);
    } catch {
      failed = true;
    }
    assert.ok(failed, "Should reject quorum > 100");
  });
});
