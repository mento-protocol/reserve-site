import { CardBackground } from "@/components/CardBackground";
import PieChart, { SliceData, TokenColor } from "@/components/PieChart";
import useHoldings from "@/hooks/useHoldings";
import { HoldingsApi } from "@/service/holdings";

export function sumCeloTotal(holdings: HoldingsApi) {
  const { custody, frozen, unfrozen } = holdings.celo;
  return custody.value + unfrozen.value + frozen.value;
}

export function sumNonCelo({ otherAssets }: HoldingsApi) {
  return otherAssets.reduce((prev, current) => current.value + prev, 0);
}

function getPercents(holdings: HoldingsApi): SliceData[] {
  const celoTotal = sumCeloTotal(holdings);
  const total = celoTotal + sumNonCelo(holdings);

  function toPercent(value: number) {
    return (value * 100) / total;
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

export const ReserveComposition = () => {
  const { data, isLoadingCelo, isLoadingOther } = useHoldings();
  const percentages = getPercents(data);

  return (
    <>
      <h2 className="mb-4 mt-8 block text-center font-fg text-[32px] font-medium lg:hidden">
        Current reserve composition
      </h2>
      <CardBackground className="mt-0 p-10 lg:mt-14">
        <article>
          <h2 className="mb-8 hidden text-center font-fg text-[32px] font-medium lg:block">
            Current reserve composition
          </h2>
          <section className="flex flex-col-reverse items-center justify-center md:flex-row">
            <div className="grid grid-cols-2 gap-x-16 gap-y-6">
              {percentages.map((item) => (
                <div
                  key={item.token}
                  className="flex flex-row items-center justify-start"
                >
                  <div
                    className="mr-[10px] h-[18px] w-[18px] rounded"
                    style={{ backgroundColor: TokenColor[item.token] }}
                  ></div>
                  <div>
                    <span className="font-medium">{`${item.percent.toFixed(2)}%`}</span>{" "}
                    {item.token}
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-8 ml-0 max-h-[300px] max-w-[300px] md:mb-0 md:ml-[64px] lg:ml-[128px]">
              <PieChart
                slices={percentages}
                isLoading={isLoadingCelo || isLoadingOther}
              />
            </div>
          </section>
        </article>
      </CardBackground>
    </>
  );
};
