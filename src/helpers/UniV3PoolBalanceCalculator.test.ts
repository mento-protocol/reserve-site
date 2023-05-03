import { IUniV3PoolProvider } from "./IUniV3PoolProvider"
import { BigNumber } from "ethers"
import { UniV3PoolBalanceCalculator } from "./UniV3PoolBalanceCalculator"

class FakeUniV3PoolProvider implements IUniV3PoolProvider {
  public positionTokenIds = [2630, 2428]
  public position1 = [
    0,
    "0",
    "0x765DE816845861e75A25fCA122bb6898B8B1282a", // token0
    "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73", // token1
    500, // fee
    -970,
    -100,
    BigNumber.from(50), // liquidity
  ]
  public position2 = [
    0,
    "0",
    "0x765DE816845861e75A25fCA122bb6898B8B1282a", // token0
    "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73", // token1
    700, // fee
    -970,
    -100,
    BigNumber.from(50), // liquidity
  ]
  public pool1Address = "pool1"
  public pool2Address = "pool2"
  public pool1TotalLiqudity = BigNumber.from(100)
  public pool2TotalLiqudity = BigNumber.from(100)
  public pool1Token0Balance = BigNumber.from(1000)
  public pool1Token1Balance = BigNumber.from(1000)
  public pool2Token0Balance = BigNumber.from(1000)
  public pool2Token1Balance = BigNumber.from(1000)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getPositionTokenIds(address: string): Promise<number[]> {
    return this.positionTokenIds
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getPosition(tokenId: number): Promise<any> {
    if (tokenId === 2630) return this.position1
    if (tokenId === 2428) return this.position2
  }

  public async getPoolAddress(token0: string, token1: string, fee: number): Promise<string> {
    if (fee == 500) return this.pool1Address
    if (fee == 700) return this.pool2Address
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getPoolBalance(
    poolAddress: string,
    _asset0: string,
    _asset1: string
  ): Promise<BigNumber[]> {
    if (poolAddress === this.pool1Address) return [this.pool1Token0Balance, this.pool1Token1Balance]
    if (poolAddress === this.pool2Address) return [this.pool2Token0Balance, this.pool2Token1Balance]
  }

  public async getTotalLiquidityForPool(poolAddress: string): Promise<BigNumber> {
    if (poolAddress === this.pool1Address) return this.pool1TotalLiqudity
    if (poolAddress === this.pool2Address) return this.pool2TotalLiqudity
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getERC20Decimals(tokenAddress: string): Promise<number> {
    return 0
  }
}

let fakeUniV3PoolProvider: FakeUniV3PoolProvider
let uniV3PoolBalanceCalculator: UniV3PoolBalanceCalculator

describe("CurvePoolBalanceCalculator", () => {
  beforeEach(async function () {
    fakeUniV3PoolProvider = new FakeUniV3PoolProvider()
    uniV3PoolBalanceCalculator = new UniV3PoolBalanceCalculator(fakeUniV3PoolProvider)
  })

  it("should return the correct number of balances for multiple positions", async () => {
    const balances = await uniV3PoolBalanceCalculator.calculateUniV3PoolBalance("0x1234")
    expect(balances.size).toEqual(2)
  })
  it("should correctly calculate the balance for multiple positions each 50% of total liquidity", async () => {
    const balances = await uniV3PoolBalanceCalculator.calculateUniV3PoolBalance("0x1234")
    expect(balances.get("0x765DE816845861e75A25fCA122bb6898B8B1282a").toNumber()).toEqual(1000) // (1000* 0.5 / 10 ** 0 ) * 2
    expect(balances.get("0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73").toNumber()).toEqual(1000) // (1000* 0.5 / 10 ** 0 ) * 2
  })
})
