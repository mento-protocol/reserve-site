import { UniV3PoolProvider } from "./UniV3PoolProvider"
import { IUniV3PoolProvider } from "./IUniV3PoolProvider"
import { BigNumber } from "bignumber.js"

export class UniV3PoolBalanceCalculator {
  private static _instance: UniV3PoolBalanceCalculator
  private uniV3PoolProvider: IUniV3PoolProvider

  constructor(_uniV3PoolProvider: IUniV3PoolProvider) {
    this.uniV3PoolProvider = _uniV3PoolProvider
  }

  public static get Instance() {
    return this._instance || (this._instance = this.create())
  }
  public async calculateUniV3PoolBalance(address): Promise<Map<string, BigNumber>> {
    const positions = await this.uniV3PoolProvider.getPositionTokenIds(address)
    return await this.queryPositions(positions)
  }

  private static create(): UniV3PoolBalanceCalculator {
    return new UniV3PoolBalanceCalculator(new UniV3PoolProvider())
  }

  private async queryPositions(positions: number[]): Promise<Map<string, BigNumber>> {
    const holdings = new Map<string, BigNumber>()
    for (let i = 0; i < positions.length; i++) {
      const positionData = await this.uniV3PoolProvider.getPosition(positions[i])
      if (!positionData) {
        continue
      }
      const positionAsset0 = positionData[2]
      const positionAsset1 = positionData[3]
      const positionFee = positionData[4]
      const positionliquidity = new BigNumber(positionData[7]._hex)
      const poolAddress = await this.uniV3PoolProvider.getPoolAddress(
        positionAsset0,
        positionAsset1,
        positionFee
      )
      const poolLiquidty = new BigNumber(
        (await this.uniV3PoolProvider.getTotalLiquidityForPool(poolAddress))._hex
      )
      const poolBalances = await this.uniV3PoolProvider.getPoolBalance(
        poolAddress,
        positionAsset0,
        positionAsset1
      )
      const positionAsset0Decimals = new BigNumber(
        await this.uniV3PoolProvider.getERC20Decimals(positionAsset0)
      )
      const positionAsset1Decimals = new BigNumber(
        await this.uniV3PoolProvider.getERC20Decimals(positionAsset1)
      )
      const liquidityFraction = positionliquidity.dividedBy(poolLiquidty)
      holdings.set(
        positionAsset0,
        (holdings.get(positionAsset0) || new BigNumber(0)).plus(
          new BigNumber(poolBalances[0]._hex)
            .multipliedBy(liquidityFraction)
            .dividedBy(new BigNumber(10).exponentiatedBy(positionAsset0Decimals))
        )
      )
      holdings.set(
        positionAsset1,
        (holdings.get(positionAsset1) || new BigNumber(0)).plus(
          new BigNumber(poolBalances[1]._hex)
            .multipliedBy(liquidityFraction)
            .dividedBy(new BigNumber(10).exponentiatedBy(positionAsset1Decimals))
        )
      )
    }
    return holdings
  }
}
