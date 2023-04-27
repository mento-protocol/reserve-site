import { JsonRpcProvider } from "@ethersproject/providers"
import BigNumber from "bignumber.js"
import { ethers } from "ethers"

const STAKED_CELO_MANAGER_ADDRESS = "0x0239b96D10a434a56CC9E09383077A0490cF9398"
const STAKED_CELO_ERC20_ADDRESS = "0xC668583dcbDc9ae6FA3CE46462758188adfdfC24"

const STAKED_CELO_ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint256)",
]

const STAKED_CELO_MANAGER_ABI = ["function toCelo(uint256 amount) external view returns (uint256)"]

export class StakedCeloProvider {
  private static _instance: StakedCeloProvider
  private stakedCelo: ethers.Contract
  private stakedCeloManager: ethers.Contract

  constructor() {
    const provider = new JsonRpcProvider(process.env.CELO_NODE_RPC_URL)
    this.stakedCelo = new ethers.Contract(
      STAKED_CELO_ERC20_ADDRESS,
      STAKED_CELO_ERC20_ABI,
      provider
    )
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

  public async getCeloBalance(address: string): Promise<BigNumber> {
    const stCeloBalance = await this.stakedCelo.balanceOf(address)
    const ethersBNResult: ethers.BigNumber = await this.stakedCeloManager.toCelo(stCeloBalance)
    return new BigNumber(ethersBNResult.toString())
  }
}
