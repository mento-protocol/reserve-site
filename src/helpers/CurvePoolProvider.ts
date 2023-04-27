import { BigNumber, Contract } from "ethers"
import { JsonRpcProvider } from "@ethersproject/providers"

import {
  CURVE_FACTORY_POOL_ADDRESS,
  CUSD_ADDRESS,
  WORMHOLE_USDC_ADDRESS,
} from "src/contract-addresses"
import { CURVE_FACTORY_POOL_ABI, ERC20_ABI } from "src/constants/abis"
import { ICurvePoolProvider } from "./ICurvePoolProvider"
export class CurvePoolProvider implements ICurvePoolProvider {
  private celoProvider: JsonRpcProvider
  private CUSDContract: Contract
  private USDCContract: Contract
  private CurvePoolContract: Contract

  constructor() {
    this.celoProvider = new JsonRpcProvider(process.env.CELO_NODE_RPC_URL)
    this.CUSDContract = new Contract(CUSD_ADDRESS, ERC20_ABI, this.celoProvider)
    this.USDCContract = new Contract(WORMHOLE_USDC_ADDRESS, ERC20_ABI, this.celoProvider)
    this.CurvePoolContract = new Contract(
      CURVE_FACTORY_POOL_ADDRESS,
      CURVE_FACTORY_POOL_ABI,
      this.celoProvider
    )
  }

  public async getLPBalanceOf(address: string): Promise<BigNumber> {
    return await this.CurvePoolContract.balanceOf(address)
  }

  public async getTotalLPSupply(): Promise<BigNumber> {
    return await this.CurvePoolContract.totalSupply()
  }

  public async getCUSDBalanceOf(address: string): Promise<BigNumber> {
    return await this.CUSDContract.balanceOf(address)
  }

  public async getUSDCBalanceOf(address: string): Promise<BigNumber> {
    return await this.USDCContract.balanceOf(address)
  }
  public async getUSDCDecimals(): Promise<number> {
    return await this.USDCContract.decimals()
  }
}
