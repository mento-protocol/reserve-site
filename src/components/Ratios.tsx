import useSWR from "swr";
import StableValueTokensAPI from "src/interfaces/stable-value-tokens";
import { fetcher } from "src/utils/fetcher";
import { sumTotalHoldings } from "./sumTotalHoldings";
import useHoldings from "src/hooks/useHoldings";
import { useMemo } from "react";

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

  // const unfrozenReserveValue = useMemo(() => {
  //   return holdings.data ? sumLiquidHoldings(holdings.data) : 1;
  // }, [holdings, sumLiquidHoldings]);

  return (
    <article className="mx-auto flex w-full max-w-[872px] flex-col items-center justify-between sm:flex-row">
      {/* <Amount
        loading={isLoading}
        label="Total"
        units={totalReserveValue / outstanding}
      />
      <Amount
        loading={isLoading}
        label="Unfrozen"
        units={unfrozenReserveValue / outstanding}
      /> */}

      <section>
        <h2 className="mb-6 text-center text-[32px] font-medium sm:text-left">
          Collateralisation ratio
        </h2>
        <p className="text-[16px]">
          Mento Stable Assets are backed by the basket of reserve assets. Ratio
          of the value of the reserve in USD to the value of all outstanding
          stable assets.
        </p>
      </section>
      <section className="mt-6 sm:mt-0 sm:pl-[72px]">
        <span className="text-[60px] font-medium">
          {isLoading ? "Loading..." : totalReserveValue / outstanding}
        </span>
      </section>
    </article>
  );
}
