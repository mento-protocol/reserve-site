export interface IUniV3PoolProvider {
  getPositionTokenIds: (address: string) => Promise<any>
  getPosition: (tokenId: number) => Promise<any>
  getPoolAddress: (token0: string, token1: string, fee: number) => Promise<any>
  getTotalLiquidityForPool: (poolAddress: string) => Promise<any>
  getPoolBalance: (poolAddress: string, asset0: string, asset1: string) => Promise<any>
}
