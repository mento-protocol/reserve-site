import { TokenModel } from "@/types";

export const skipZeros = (token: TokenModel) => token.value != 0;
