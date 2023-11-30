import BigNumber from "bignumber.js"

export function formatNumber(value, decimals?: number) {
  if (decimals) {
    return new BigNumber(value).dividedBy(new BigNumber(10).pow(decimals)).toNumber()
  } else {
    return new BigNumber(value).dividedBy(1_000_000_000_000_000_000).toNumber()
  }
}
