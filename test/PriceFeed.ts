import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { network } from "hardhat";

describe("PriceFeed", async function () {
  const { viem } = await network.connect();
  const publicClient = await viem.getPublicClient();
  const [owner, user1] = await viem.getWalletClients();

  /**
   * Helper: deploy MockAggregator + PriceFeed para testes locais.
   */
  async function deployPriceFeedFixture(initialPrice = 2500n * 10n ** 8n) {
    const mockAgg = await viem.deployContract("MockAggregator", [initialPrice, 8]);
    const priceFeed = await viem.deployContract("PriceFeed", [
      mockAgg.address,
      owner.account.address,
    ]);
    return { mockAgg, priceFeed };
  }

  it("Should return correct price from mock aggregator", async function () {
    const { priceFeed } = await deployPriceFeedFixture(2500n * 10n ** 8n);

    const price = await priceFeed.read.getLatestPrice();
    assert.equal(price, 2500n * 10n ** 8n);
  });

  it("Should return fallback price when aggregator reverts", async function () {
    const { mockAgg, priceFeed } = await deployPriceFeedFixture(2500n * 10n ** 8n);

    // Forçar revert no mock
    await mockAgg.write.setShouldRevert([true]);

    const price = await priceFeed.read.getLatestPrice();
    const fallback = await priceFeed.read.FALLBACK_PRICE();
    assert.equal(price, fallback);
    assert.equal(price, 2000n * 10n ** 8n);
  });

  it("Should return fallback when aggregator returns price <= 0", async function () {
    const { mockAgg, priceFeed } = await deployPriceFeedFixture(0n);

    const price = await priceFeed.read.getLatestPrice();
    assert.equal(price, 2000n * 10n ** 8n);
  });

  it("Should allow owner to update feed address", async function () {
    const { priceFeed } = await deployPriceFeedFixture(2500n * 10n ** 8n);

    // Deploy novo mock com preço diferente
    const newMock = await viem.deployContract("MockAggregator", [3000n * 10n ** 8n, 8]);
    await priceFeed.write.setFeed([newMock.address]);

    const price = await priceFeed.read.getLatestPrice();
    assert.equal(price, 3000n * 10n ** 8n);
  });

  it("Should not allow non-owner to update feed", async function () {
    const { priceFeed } = await deployPriceFeedFixture();

    let failed = false;
    try {
      await priceFeed.write.setFeed(["0x0000000000000000000000000000000000000001"], {
        account: user1.account,
      });
    } catch {
      failed = true;
    }
    assert.ok(failed, "Non-owner should not update feed");
  });
});
