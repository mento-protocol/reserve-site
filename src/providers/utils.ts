import BigNumber from "bignumber.js";

export function formatNumber(value: string | number, decimals = 18) {
  return new BigNumber(value)
    .dividedBy(new BigNumber(10).pow(decimals))
    .toNumber();
}
