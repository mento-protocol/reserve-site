import { Contract } from "ethers";
import { JsonRpcProvider } from "@ethersproject/providers";

import {
  UNIV3_POSITION_TOKEN_ADDRESS,
  UNIV3_FACTORY_ADDRESS,
} from "src/contract-addresses";
import {
  UNIV3_POOL_ABI,
  ERC20_ABI,
  UNIV3_POSITION_TOKEN_ABI,
  UNIV3_FACTORY_ABI,
} from "src/constants/abis";
import { IUniV3PoolProvider } from "./IUniV3PoolProvider";
export class UniV3PoolProvider implements IUniV3PoolProvider {
  private celoProvider: JsonRpcProvider;
  private UniV3PositionToken: Contract;
  private UniV3FactoryContract: Contract;

  constructor() {
    this.celoProvider = new JsonRpcProvider(process.env.CELO_NODE_RPC_URL);
    this.UniV3PositionToken = new Contract(
      UNIV3_POSITION_TOKEN_ADDRESS,
      UNIV3_POSITION_TOKEN_ABI,
      this.celoProvider,
    );
    this.UniV3FactoryContract = new Contract(
      UNIV3_FACTORY_ADDRESS,
      UNIV3_FACTORY_ABI,
      this.celoProvider,
    );
  }

  public async getPositionTokenIds(address: string): Promise<number[]> {
    const numOfPositions = await this.UniV3PositionToken.balanceOf(address);
    const tokenIds: number[] = [];
    for (let i = 0; i < numOfPositions; i++) {
      const tokenId = await this.UniV3PositionToken.tokenOfOwnerByIndex(
        address,
        i,
      );
      tokenIds.push(tokenId);
    }
    return tokenIds;
  }

  public async getPosition(tokenId: number): Promise<any> {
    return await this.UniV3PositionToken.positions(tokenId);
  }

  public async getSlot0(poolAddress: string): Promise<any> {
    const UniV3PoolContract: Contract = new Contract(
      poolAddress,
      UNIV3_POOL_ABI,
      this.celoProvider,
    );
    return await UniV3PoolContract.slot0();
  }

  public async getPoolAddress(
    token0: string,
    token1: string,
    fee: number,
  ): Promise<string> {
    return await this.UniV3FactoryContract.getPool(token0, token1, fee);
  }

  public async getERC20Decimals(tokenAddress: string): Promise<number> {
    const tokenContract: Contract = new Contract(
      tokenAddress,
      ERC20_ABI,
      this.celoProvider,
    );
    return await tokenContract.decimals();
  }
}
