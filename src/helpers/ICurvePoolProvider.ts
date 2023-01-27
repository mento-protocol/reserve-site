export interface ICurvePoolProvider {
  getLPBalanceOf: (address: string) => Promise<any>
  getTotalLPSupply: () => Promise<any>
  getCUSDBalanceOf: (address: string) => Promise<any>
  getUSDCBalanceOf: (address: string) => Promise<any>
  getUSDCDecimals: () => Promise<any>
}
