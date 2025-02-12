import { HoldingsApi } from "@/service/holdings";

export function sumCeloTotal(holdings: HoldingsApi) {
  const { custody, frozen, unfrozen } = holdings.celo;
  return custody.value + unfrozen.value + frozen.value;
}

export function sumNonCelo({ otherAssets }: HoldingsApi) {
  return otherAssets.reduce((prev, current) => current.value + prev, 0);
}

export function sumLiquidHoldings(holdings: HoldingsApi) {
  const { custody, unfrozen } = holdings.celo;
  const celoTotal = custody.value + unfrozen.value;
  return celoTotal + sumNonCelo(holdings);
}

export function sumTotalHoldings(holdings: HoldingsApi) {
  return sumCeloTotal(holdings) + sumNonCelo(holdings);
}
