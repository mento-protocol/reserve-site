import { JsonRpcProvider } from "@ethersproject/providers"
import BigNumber from "bignumber.js"
import { ethers } from "ethers"
import { STAKED_CELO_ERC20_ADDRESS, STAKED_CELO_MANAGER_ADDRESS } from "src/contract-addresses"
import { ERC20_ABI, STAKED_CELO_MANAGER_ABI } from "src/constants/abis"

export class StakedCeloProvider {
  private static _instance: StakedCeloProvider
  private stakedCelo: ethers.Contract
  private stakedCeloManager: ethers.Contract

  constructor() {
    const provider = new JsonRpcProvider(process.env.CELO_NODE_RPC_URL)
    this.stakedCelo = new ethers.Contract(STAKED_CELO_ERC20_ADDRESS, ERC20_ABI, provider)
    this.stakedCeloManager = new ethers.Contract(
      STAKED_CELO_MANAGER_ADDRESS,
      STAKED_CELO_MANAGER_ABI,
      provider
    )
  }

  public static get Instance() {
    return this._instance || (this._instance = this.create())
  }

  private static create(): StakedCeloProvider {
    return new StakedCeloProvider()
  }

  public async stCeloToCelo(stCelo: BigNumber): Promise<BigNumber> {
    const ethersBNResult: ethers.BigNumber = await this.stakedCeloManager.toCelo(stCelo)
    return new BigNumber(ethersBNResult.toString())
  }

  public async getCeloBalance(address: string): Promise<BigNumber> {
    const stCeloBalance = await this.stakedCelo.balanceOf(address)
    return await this.stCeloToCelo(stCeloBalance)
  }
}
