import { TokenModel } from "@/types";

export const skipZeros = (token: TokenModel) => token.units > 50;
