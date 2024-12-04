import { TokenModel } from "@/types";

export default interface StableValueTokensAPI {
  totalStableValueInUSD: number;
  tokens: TokenModel[];
}
