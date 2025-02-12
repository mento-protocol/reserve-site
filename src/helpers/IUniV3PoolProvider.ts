export interface IUniV3PoolProvider {
  getPositionTokenIds: (address: string) => Promise<any>;
  getPosition: (tokenId: number) => Promise<any>;
  getPoolAddress: (token0: string, token1: string, fee: number) => Promise<any>;
  getSlot0: (poolAddress: string) => Promise<any>;
  getERC20Decimals: (tokenAddress: string) => Promise<any>;
}
