import StableValueTokensAPI from "@/interfaces/stable-value-tokens";
import { SECOND } from "@/utils/TIME";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";

export const useStableTokens = () => {
  const initialOtherToken = {
    value: NaN,
    units: NaN,
    hasError: false,
    token: "BTC",
    updated: 0,
  } as const;

  const { data, error, isLoading } = useSWR<StableValueTokensAPI>(
    "/api/stable-value-tokens",
    fetcher,
    {
      refreshInterval: SECOND * 10,
      fallbackData: {
        totalStableValueInUSD: 0,
        tokens: [
          { ...initialOtherToken, token: "cUSD" },
          { ...initialOtherToken, token: "cEUR" },
          { ...initialOtherToken, token: "cREAL" },
          { ...initialOtherToken, token: "eXOF" },
          { ...initialOtherToken, token: "cKES" },
          { ...initialOtherToken, token: "PUSO" },
        ],
      },
    },
  );

  return { stables: data.tokens, isLoading, error };
};
