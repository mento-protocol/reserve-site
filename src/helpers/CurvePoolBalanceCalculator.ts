import {
  CURVE_FACTORY_POOL_ADDRESS,
  GOVERNANCE_CELO,
  GOVERNANCE_SAFE_CELO,
} from "src/contract-addresses"
import { CurvePoolProvider } from "./CurvePoolProvider"
import { ICurvePoolProvider } from "./ICurvePoolProvider"

export class CurvePoolBalanceCalculator {
  private static _instance: CurvePoolBalanceCalculator
  private curvePoolProvider: ICurvePoolProvider

  constructor(_curvePoolProvider: ICurvePoolProvider) {
    this.curvePoolProvider = _curvePoolProvider
  }

  public static get Instance() {
    return this._instance || (this._instance = this.create())
  }

  private static create(): CurvePoolBalanceCalculator {
    return new CurvePoolBalanceCalculator(new CurvePoolProvider())
  }

  /**
   * @returns The fraction of liquidity in the pool that is owned by Mento
   */
  private async getGovernancePoolFraction(): Promise<number> {
    const gscBalance = await this.curvePoolProvider.getLPBalanceOf(GOVERNANCE_SAFE_CELO)
    const governanceBalance = await this.curvePoolProvider.getLPBalanceOf(GOVERNANCE_CELO)

    const totalLPTokens = gscBalance.add(governanceBalance)

    const totalLpSupply = await this.curvePoolProvider.getTotalLPSupply()

    return totalLPTokens / totalLpSupply
  }

  /**
   * @returns The total amount of CUSD in the Curve pool owned by Mento
   */
  public async calculateCurveCUSD(): Promise<number> {
    const CUSDPoolBalance = await this.curvePoolProvider.getCUSDBalanceOf(
      CURVE_FACTORY_POOL_ADDRESS
    )
    const lpTokenFraction = await this.getGovernancePoolFraction()
    return CUSDPoolBalance * lpTokenFraction
  }

  /**
   * @returns The total amount of USDC in the Curve pool owned by Mento
   */
  public async calculateCurveUSDC(): Promise<number> {
    const usdcPoolBalance = await this.curvePoolProvider.getUSDCBalanceOf(
      CURVE_FACTORY_POOL_ADDRESS
    )

    // Get decimal places of USDC
    const decimals = await this.curvePoolProvider.getUSDCDecimals()

    const lpTokenFraction = await this.getGovernancePoolFraction()

    const usdcBalance = usdcPoolBalance * lpTokenFraction

    return usdcBalance / 10 ** decimals
  }
}
