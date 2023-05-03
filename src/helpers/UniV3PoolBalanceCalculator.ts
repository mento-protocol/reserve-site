import { UniV3PoolProvider } from "./UniV3PoolProvider"
import { IUniV3PoolProvider } from "./IUniV3PoolProvider"
import BigNumber from "bignumber.js"

export class UniV3PoolBalanceCalculator {
  private static _instance: UniV3PoolBalanceCalculator
  private uniV3PoolProvider: IUniV3PoolProvider

  constructor(_uniV3PoolProvider: IUniV3PoolProvider) {
    this.uniV3PoolProvider = _uniV3PoolProvider
  }

  public static get Instance() {
    return this._instance || (this._instance = this.create())
  }
  public async calculateUniV3PoolBalance(address): Promise<Map<string, number>> {
    const positions = await this.uniV3PoolProvider.getPositionTokenIds(address)
    return await this.queryPositions(positions)
  }

  private static create(): UniV3PoolBalanceCalculator {
    return new UniV3PoolBalanceCalculator(new UniV3PoolProvider())
  }

  private async queryPositions(positions: number[]): Promise<Map<string, number>> {
    const holdings = new Map<string, number>()
    for (let i = 0; i < positions.length; i++) {
      const positionData = await this.uniV3PoolProvider.getPosition(positions[i])
      if (!positionData) {
        continue
      }
      const positionAsset0 = positionData[2]
      const positionAsset1 = positionData[3]
      const positionFee = positionData[4]
      const positionliquidity = positionData[7]
      const poolAddress = await this.uniV3PoolProvider.getPoolAddress(
        positionAsset0,
        positionAsset1,
        positionFee
      )
      const poolLiquidty = await this.uniV3PoolProvider.getTotalLiquidityForPool(poolAddress)
      const poolBalances = await this.uniV3PoolProvider.getPoolBalance(
        poolAddress,
        positionAsset0,
        positionAsset1
      )
      const positionAsset0Decimals = await this.uniV3PoolProvider.getERC20Decimals(positionAsset0)
      const positionAsset1Decimals = await this.uniV3PoolProvider.getERC20Decimals(positionAsset1)
      holdings.set(
        positionAsset0,
        (holdings.get(positionAsset0) || 0) +
          (poolBalances[0] * positionliquidity) / poolLiquidty / 10 ** positionAsset0Decimals
      )
      holdings.set(
        positionAsset1,
        (holdings.get(positionAsset1) || 0) +
          (poolBalances[1] * positionliquidity) / poolLiquidty / 10 ** positionAsset1Decimals
      )
    }
    return holdings
  }
}
