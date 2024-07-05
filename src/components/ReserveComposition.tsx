import PieChart, { ChartData } from "@/components/PieChart";
import useHoldings from "@/hooks/useHoldings";
import { HoldingsApi } from "@/service/holdings";
import { Head } from "next/document";

export function sumCeloTotal(holdings: HoldingsApi) {
  const { custody, frozen, unfrozen } = holdings.celo;
  return custody.value + unfrozen.value + frozen.value;
}

export function sumNonCelo({ otherAssets }: HoldingsApi) {
  return otherAssets.reduce((prev, current) => current.value + prev, 0);
}

function getPercents(holdings: HoldingsApi): ChartData[] {
  const celoTotal = sumCeloTotal(holdings);
  const total = celoTotal + sumNonCelo(holdings);

  function toPercent(value: number) {
    return (value / total) * 100;
  }

  return [{ token: "CELO", percent: toPercent(celoTotal) }].concat(
    holdings.otherAssets
      .map((asset) => {
        return {
          token: asset.token,
          percent: toPercent(asset.value),
        };
      })
      .filter((asset) => asset.percent > 0)
      .sort((a, b) => b.percent - a.percent),
  );
}

function findOldestValueUpdatedAt(data?: HoldingsApi): number {
  if (!data) {
    return 0;
  }

  return Math.min(
    ...data.otherAssets
      .map((token) => token.updated)
      .concat([
        data.celo.custody.updated,
        data.celo.frozen.updated,
        data.celo.unfrozen.updated,
      ]),
  );
}

export const ReserveComposition = () => {
  const { data, isLoadingCelo, isLoadingOther } = useHoldings();
  const percentages = getPercents(data);

  return (
    <article>
      <h2 className="mb-8 text-center font-fg text-[32px] font-medium">
        Current reserve composition
      </h2>
      <section className="flex flex-col-reverse items-center justify-center *:w-[50%] md:flex-row md:justify-between">
        <div>Ratios</div>
        <PieChart
          slices={percentages}
          isLoading={isLoadingCelo || isLoadingOther}
        />
      </section>
    </article>
  );
};
