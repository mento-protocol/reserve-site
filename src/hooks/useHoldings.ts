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
    { ...initialOtherToken, token: "USDGLO" },
  ],
};

export default function useHoldings(): {
  data: HoldingsApi;
  error: any;
  isLoadingCelo: boolean;
  isLoadingOther: boolean;
} {
  const {
    data: celoHoldings,
    error: celoError,
    isLoading: isLoadingCelo,
  } = useSWR<Pick<HoldingsApi, "celo">>("/api/holdings/celo", fetcher, {
    fallbackData: { celo: INITAL_DATA.celo },
    revalidateOnMount: true,
  });
  const {
    data: otherHoldings,
    error: otherError,
    isLoading: isLoadingOther,
  } = useSWR<Pick<HoldingsApi, "otherAssets">>("/api/holdings/other", fetcher, {
    fallbackData: { otherAssets: INITAL_DATA.otherAssets },
    revalidateOnMount: true,
  });
  const error = celoError || otherError;
  //TODO: Refactor holdings data return to avoid conditional chaining & undefined values
  // See: https://github.com/mento-protocol/reserve-site/issues/107
  const data: HoldingsApi = { ...celoHoldings, ...otherHoldings };

  return { data, error, isLoadingCelo, isLoadingOther };
}
