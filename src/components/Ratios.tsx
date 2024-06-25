import useSWR from "swr";
import Amount from "src/components/Amount";
import StableValueTokensAPI from "src/interfaces/stable-value-tokens";
import { fetcher } from "src/utils/fetcher";
import { sumLiquidHoldings } from "./sumLiquidHoldings";
import { sumTotalHoldings } from "./sumTotalHoldings";
import useHoldings from "src/hooks/useHoldings";

export function Ratios() {
  const stables = useSWR<StableValueTokensAPI>(
    "/api/stable-value-tokens",
    fetcher,
  );
  const holdings = useHoldings();
  const isLoading = !holdings.data || !stables.data;

  const outstanding = stables.data?.totalStableValueInUSD || 1;
  const totalReserveValue = holdings.data ? sumTotalHoldings(holdings.data) : 1;
  const unfrozenReserveValue = holdings.data
    ? sumLiquidHoldings(holdings.data)
    : 1;

  return (
    <div className="grid-y-[12px] grid-areas-ratio-desktop tablet:grid-areas-ratio-mobile grid grid-cols-1 gap-x-[20px]">
      <Amount
        loading={isLoading}
        label="Total"
        units={totalReserveValue / outstanding}
      />
      <Amount
        loading={isLoading}
        label="Unfrozen"
        units={unfrozenReserveValue / outstanding}
      />

      <div className="[grid-area:'info']">
        <div className="pb-[24px]">
          <small>
            Ratios of the value of the reserve in USD (for total and for
            unfrozen) to the value of all outstanding stable assets (cUSD, cEUR,
            as well as other future stabilized tokens supported by the reserve)
          </small>
        </div>
      </div>
    </div>
  );
}
