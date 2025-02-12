import { Providers } from "./Providers";
import {
  ProviderResult,
  providerOk,
  providerError,
} from "src/utils/ProviderResult";

interface CMCQuote {
  data?: Record<
    string, //will be whatever id/symbol/slug was used to lookup the quote
    {
      id: number;
      name: string;
      symbol: string;
      slug: string;
      is_active: 1 | 0;
      is_fiat: 1 | 0;
      circulating_supply: number;
      total_supply: number;
      max_supply: number;
      date_added: string;
      num_market_pairs: number;
      cmc_rank: number;
      last_updated: string;
      tags: Array<string>;
      platform: null;
      quote: {
        USD: {
          price: number;
          volume_24h: number;
          percent_change_1h: number;
          percent_change_24h: number;
          percent_change_7d: number;
          percent_change_30d: number;
          market_cap: number;
          market_cap_dominance: number;
          fully_diluted_market_cap: number;
          last_updated: string; // "2018-08-09T21:56:28.000Z"
        };
      };
    }
  >;
  status: {
    timestamp: string;
    error_code: 0 | 400 | 1002 | 1006 | 1008 | 500;
    error_message: string;
    elapsed: 10;
    credit_count: 1;
  };
}

export default async function getCoinMarketCapPrice(
  symbol: string,
): Promise<ProviderResult<number>> {
  try {
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,
      {
        method: "GET",
        headers: new Headers({
          "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_KEY,
          Accept: "application/json",
        }),
      },
    );

    const body = (await response.json()) as CMCQuote;

    if (body.data?.[symbol]) {
      const data = body.data[symbol].quote.USD;
      if (!data.price) {
        return providerError(
          new Error("price not found"),
          Providers.coinmarketcap,
        );
      }
      return providerOk(
        data.price,
        Providers.coinmarketcap,
        new Date(data.last_updated).valueOf(),
      );
    } else {
      return providerError(
        new Error(body.status.error_message),
        Providers.coinmarketcap,
      );
    }
  } catch (error) {
    return providerError(error, Providers.coinmarketcap);
  }
}
