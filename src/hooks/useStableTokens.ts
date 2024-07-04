import StableValueTokensAPI from "@/interfaces/stable-value-tokens";
import { SECOND } from "@/utils/TIME";
import { fetcher } from "@/utils/fetcher";
import { useMemo } from "react";
import useSWR from "swr";

export const useStableTokens = () => {
  const initialOtherToken = {
    value: NaN,
    units: NaN,
    hasError: false,
    token: "BTC",
    updated: 0,
  } as const;

  const { data, error } = useSWR<StableValueTokensAPI>(
    "/api/stable-value-tokens",
    fetcher,
    {
      refreshInterval: SECOND * 10,
      initialData: {
        totalStableValueInUSD: 0,
        tokens: [
          { ...initialOtherToken, token: "cUSD" },
          { ...initialOtherToken, token: "cEUR" },
          { ...initialOtherToken, token: "cREAL" },
          { ...initialOtherToken, token: "eXOF" },
          { ...initialOtherToken, token: "cKES" },
        ],
      },
    },
  );

  const isLoading = useMemo(() => {
    return !data?.tokens?.findIndex((coin) => coin.updated === 0) ?? true;
  }, [data.tokens]);

  return { stables: data?.tokens, isLoading, error };
};
