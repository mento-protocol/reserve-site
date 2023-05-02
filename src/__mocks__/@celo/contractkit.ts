import mockBigNumber from "bignumber.js"
export * from "@celo/contractkit"
const mockWEI = 1_000_000_000_000_000_000

class Contract {
  methods = {
    balanceOf: () => () => (500000 * mockWEI).toString(),
    decimals: () => () => 18,
  }
}

export const newKit = jest.fn(() => {
  return {
    web3: {
      eth: {
        Contract,
      },
    },
    contracts: {
      getExchange: async () => ({
        quoteGoldSell: jest.fn(async () => new mockBigNumber(3.892 * mockWEI)),
      }),
      getReserve: async () => ({
        getReserveCeloBalance: jest.fn(
          async () => new mockBigNumber("1.19589497940550414165549272e+26")
        ),
        getUnfrozenBalance: jest.fn(
          async () => new mockBigNumber("7.533063107819435353416241e+25")
        ),
        getAssetAllocationSymbols: jest.fn(async () => ["cGLD", "BTC", "ETH", "DAI", "cMCO2"]),
        getAssetAllocationWeights: jest.fn(async () => [
          new mockBigNumber(50 * mockWEI * 10000), //the value seems to be one thousand times larger than id expect
          new mockBigNumber(29.5 * mockWEI * 10000), //the value seems to be one thousand times larger than id expect
          new mockBigNumber(15 * mockWEI * 10000), //the value seems to be one thousand times larger than id expect
          new mockBigNumber(5 * mockWEI * 10000), //the value seems to be one thousand times larger than id expect
          new mockBigNumber(0.5 * mockWEI * 10000), //the value seems to be one thousand times larger than id expect
        ]),
      }),
      getGoldToken: async () => ({
        balanceOf: jest.fn(async () => new mockBigNumber("1.16644499691333039665549272e+26")),
      }),
      getStableToken: async () => ({
        totalSupply: jest.fn(async () => new mockBigNumber("4.1557073455407045025690923e+25")),
      }),
    },
  }
})
