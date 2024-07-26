import useHoldings from "@/hooks/useHoldings";
import StableValueTokensAPI from "@/interfaces/stable-value-tokens";
import { fetcher } from "@/utils/fetcher";
import { useMemo } from "react";
import useSWR from "swr";
import { sumTotalHoldings } from "@/helpers/holdings";

export const useReserveTotals = () => {
  const stables = useSWR<StableValueTokensAPI>(
    "/api/stable-value-tokens",
    fetcher,
  );
  const holdings = useHoldings();

  const isLoading = useMemo(() => {
    return !holdings.data || !stables.data;
  }, [holdings.data, stables.data]);

  const outstanding: number | null = useMemo(() => {
    return stables?.data?.totalStableValueInUSD || null;
  }, [stables.data]);

  const totalReserveValue = useMemo(() => {
    return holdings.data ? sumTotalHoldings(holdings.data) : 1;
  }, [holdings, sumTotalHoldings]);

  const collateralisationRatio = useMemo(() => {
    if (isLoading) return;
    const processed = totalReserveValue / outstanding;

    if (!Number.isNaN(processed)) return processed.toFixed(2);
  }, [totalReserveValue, isLoading, outstanding]);

  return { collateralisationRatio, isLoading, totalReserveValue };
};
