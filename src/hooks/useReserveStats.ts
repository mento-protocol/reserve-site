import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

interface ReserveStats {
  collateralization_ratio: number;
  total_reserve_value: number;
  total_stables_value: number;
}

export const useReserveStats = () => {
  const { data, isLoading } = useSWR<ReserveStats>(
    "/api/reserve-stats",
    fetcher,
  );

  return {
    collateralisationRatio: data?.collateralization_ratio.toFixed(2),
    totalReserveValue: data?.total_reserve_value || 1,
    isLoading: isLoading || !data,
  };
};
