import { Tokens } from "src/service/Data";
import { HoldingsApi } from "src/service/holdings";
import { fetcher } from "src/utils/fetcher";
import useSWR from "swr";

const initialToken = {
  value: NaN,
  units: NaN,
  hasError: false,
  token: "CELO" as Tokens,
  updated: 0,
};

const initialOtherToken = {
  value: NaN,
  units: NaN,
  hasError: false,
  token: "BTC",
  updated: 0,
} as const;

const INITIAL_DATA: HoldingsApi = {
  celo: {
    custody: initialToken,
    unfrozen: initialToken,
    frozen: initialToken,
  },
  otherAssets: [
    initialOtherToken,
    { ...initialOtherToken, token: "ETH" },
    { ...initialOtherToken, token: "DAI" },
    { ...initialOtherToken, token: "USDC" },
    { ...initialOtherToken, token: "EUROC" },
    { ...initialOtherToken, token: "stEUR" },
    { ...initialOtherToken, token: "sDAI" },
    { ...initialOtherToken, token: "stETH" },
    { ...initialOtherToken, token: "USDT" },
    { ...initialOtherToken, token: "USDGLO" },
  ],
  totalReserveValue: 0,
};

export default function useHoldings(): {
  data: HoldingsApi;
  error: any;
  isLoadingCelo: boolean;
  isLoadingOther: boolean;
} {
  const { data, error, isLoading } = useSWR<HoldingsApi>(
    "/api/reserve-holdings",
    fetcher,
    {
      fallbackData: INITIAL_DATA,
      revalidateOnMount: true,
    },
  );

  return {
    data: data || INITIAL_DATA,
    error,
    isLoadingCelo: isLoading,
    isLoadingOther: isLoading,
  };
}
