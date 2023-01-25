import { ICurvePoolProvider } from "./ICurvePoolProvider"
import { BigNumber } from "ethers"
import { CurvePoolBalanceCalculator } from "./CurvePoolBalanceCalculator"

class FakeCurvePoolProvider implements ICurvePoolProvider {
  public lpBalanceOf = BigNumber.from(25)
  public lpSupply = BigNumber.from(100)
  public cusdBalanceOF = BigNumber.from(1000)
  public usdcBalanceOf = BigNumber.from(1000)
  public usdcDecimals = BigNumber.from(0)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getLPBalanceOf(address: string): Promise<any> {
    return this.lpBalanceOf
  }
  public async getTotalLPSupply(): Promise<any> {
    return this.lpSupply
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getCUSDBalanceOf(address: string): Promise<any> {
    return this.cusdBalanceOF
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getUSDCBalanceOf(address: string): Promise<any> {
    return this.usdcBalanceOf
  }
  public async getUSDCDecimals(): Promise<any> {
    return this.usdcDecimals
  }
}

let fakeCurvePoolProvider: FakeCurvePoolProvider
let curvePoolBalanceCalculator: CurvePoolBalanceCalculator

describe("CurvePoolBalanceCalculator", () => {
  beforeEach(async function () {
    fakeCurvePoolProvider = new FakeCurvePoolProvider()
    curvePoolBalanceCalculator = new CurvePoolBalanceCalculator(fakeCurvePoolProvider)
  })

  describe("calculateCurveCUSD: ", () => {
    it("should returns 500 when pool fraction is 50%", async () => {
      const result = await curvePoolBalanceCalculator.calculateCurveCUSD()
      expect(result).toEqual(500)
    })

    it("should returns 0 when zero LP tokens are not owned by Mento", async () => {
      fakeCurvePoolProvider.lpBalanceOf = BigNumber.from(0)
      const result = await curvePoolBalanceCalculator.calculateCurveCUSD()
      expect(result).toEqual(0)
    })
  })

  describe("calculateCurveUSDC: ", () => {
    it("should return 0 if no LP tokens are owned by Mento", async () => {
      fakeCurvePoolProvider.lpBalanceOf = BigNumber.from(0)
      const result = await curvePoolBalanceCalculator.calculateCurveUSDC()
      expect(result).toEqual(0)
    })
    it("should return 500 if fraction is 50% and 1000 USDC in pool ", async () => {
      const result = await curvePoolBalanceCalculator.calculateCurveUSDC()
      expect(result).toEqual(500)
    })
    it("should correctly scale down based on the decimals ", async () => {
      fakeCurvePoolProvider.usdcDecimals = BigNumber.from(1)
      // 1000 * 0.5 / 10 ** 1 = 50
      const result = await curvePoolBalanceCalculator.calculateCurveUSDC()
      expect(result).toEqual(50)
    })
  })
})
