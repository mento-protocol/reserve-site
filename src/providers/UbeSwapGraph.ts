import { request, gql } from "graphql-request";
import { CMCO2_ADDRESS } from "src/contract-addresses";
import { Providers } from "./Providers";
import {
  ProviderResult,
  providerError,
  providerOk,
} from "src/utils/ProviderResult";

const query = gql`
{

  token(id: "${CMCO2_ADDRESS}") {
    id
    symbol
    derivedCUSD
  }
}
`;

interface Token {
  id: string;
  symbol: string;
  derivedCUSD: number;
}

export async function getCMC02Price(): Promise<ProviderResult> {
  try {
    const { token } = await request<{ token: Token }>(
      "https://api.thegraph.com/subgraphs/name/ubeswap/ubeswap",
      query,
    );
    return providerOk(Number(token.derivedCUSD), Providers.ubeswap);
  } catch (error) {
    console.error(error);
    return providerError(error, Providers.ubeswap);
  }
}
