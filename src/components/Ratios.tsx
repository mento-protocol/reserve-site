import useSWR from "swr";
import StableValueTokensAPI from "src/interfaces/stable-value-tokens";
import { fetcher } from "src/utils/fetcher";
import useHoldings from "src/hooks/useHoldings";
import { useMemo } from "react";
import { sumTotalHoldings } from "@/lib/utils/holdings";

export function Ratios() {
  const stables = useSWR<StableValueTokensAPI>(
    "/api/stable-value-tokens",
    fetcher,
  );
  const holdings = useHoldings();
  const isLoading = useMemo(() => {
    return !holdings.data || !stables.data;
  }, [holdings.data, stables.data]);

  const outstanding = useMemo(() => {
    return stables.data?.totalStableValueInUSD || 1;
  }, [stables.data]);

  const totalReserveValue = useMemo(() => {
    return holdings.data ? sumTotalHoldings(holdings.data) : 1;
  }, [holdings, sumTotalHoldings]);

  const result = useMemo(() => {
    if (isLoading) return;
    const processed = totalReserveValue / outstanding;
    if (!Number.isNaN(processed)) return processed.toFixed(2);
  }, [totalReserveValue, isLoading, outstanding]);

  return (
    <article className="mx-auto flex w-full max-w-[872px] flex-col items-center justify-between sm:flex-row">
      <section>
        <h2 className="mb-6 text-center text-[32px] font-medium sm:text-left font-fg">
          Collateralisation ratio
        </h2>
        <p className="text-[16px]">
          Mento Stable Assets are backed by the basket of reserve assets. Ratio
          of the value of the reserve in USD to the value of all outstanding
          stable assets.
        </p>
      </section>
      <section className="mt-6 sm:mt-0 sm:pl-[72px]">
        {!isLoading && result ? (
          <span className="text-[60px] font-medium">{result}</span>
        ) : (
          <RatioLoadingSkeleton />
        )}
      </section>
    </article>
  );
}

const RatioLoadingSkeleton = () => {
  return (
    <span className="animate-pulse rounded-md bg-gray-300 text-[60px]  font-medium text-gray-300">
      0.00
    </span>
  );
};
