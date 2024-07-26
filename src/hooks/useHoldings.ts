import { useMemo } from "react";
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

const INITAL_DATA: HoldingsApi = {
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
  ],
};

export default function useHoldings(): {
  data: HoldingsApi;
  error: any;
  isLoadingCelo: boolean;
  isLoadingOther: boolean;
} {
  const celoHoldings = useSWR<Pick<HoldingsApi, "celo">>(
    "/api/holdings/celo",
    fetcher,
    {
      initialData: { celo: INITAL_DATA.celo },
      revalidateOnMount: true,
    },
  );
  const otherHoldings = useSWR<Pick<HoldingsApi, "otherAssets">>(
    "/api/holdings/other",
    fetcher,
    {
      initialData: { otherAssets: INITAL_DATA.otherAssets },
      revalidateOnMount: true,
    },
  );
  const error = celoHoldings.error || otherHoldings.error;

  const data: HoldingsApi = { ...celoHoldings.data, ...otherHoldings.data };

  const isLoadingCelo = useMemo(() => {
    return data?.celo?.frozen?.updated === 0 || data?.celo?.unfrozen?.updated === 0;
  }, [data?.celo?.frozen?.updated, data?.celo?.unfrozen?.updated]);

  const isLoadingOther = useMemo(() => {
    return !data?.otherAssets?.findIndex((coin) => coin.updated === 0) ?? true;
  }, [data.otherAssets]);

  return { data, error, isLoadingCelo, isLoadingOther };
}
