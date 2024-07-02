import StableValueTokensAPI from "@/interfaces/stable-value-tokens";
import { SECOND } from "@/utils/TIME";
import { fetcher } from "@/utils/fetcher";
import { useMemo } from "react";
import useSWR from "swr";

export const useStableTokens = () => {
  const initalOtherToken = {
    value: NaN,
    units: NaN,
    hasError: false,
    token: "BTC",
    updated: 0,
  } as const;

  const { data, error, isValidating } = useSWR<StableValueTokensAPI>(
    "/api/stable-value-tokens",
    fetcher,
    {
      refreshInterval: SECOND * 10,
      initialData: {
        totalStableValueInUSD: 0,
        tokens: [
          { ...initalOtherToken, token: "cUSD" },
          { ...initalOtherToken, token: "cEUR" },
          { ...initalOtherToken, token: "cREAL" },
          { ...initalOtherToken, token: "eXOF" },
          { ...initalOtherToken, token: "cKES" },
        ],
      },
    },
  );

  const isLoading = useMemo(() => {
    return !data?.tokens?.findIndex((coin) => coin.updated === 0);
  }, [data.tokens]);

  console.log({ data });

  return { stables: data?.tokens, isLoading, error };
};
