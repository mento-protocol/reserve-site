import * as coinbase from "src/providers/Coinbase";
import { ISO427SYMBOLS } from "src/interfaces/ISO427SYMBOLS";
import currencyInUSD from "src/providers/ExchangeRateAPI";
import { getEthPrice } from "src/providers/Etherscan";
import { getOrSave, Cachable } from "src/service/cache";
import { HOUR, MINUTE } from "src/utils/TIME";
import { duel, providerToDuel } from "./duel";
import { DuelResult } from "src/utils/DuelResult";
import getCoinMarketCapPrice from "src/providers/CoinMarketCap";
import { Tokens } from "./Data";
import { allOkOrThrow } from "src/utils/Result";

async function fetchBTCPrice() {
  const price = await duel(
    coinbase.getBTCInUSD(),
    getCoinMarketCapPrice("BTC"),
  );
  return price;
}

export async function btcPrice() {
  return getOrSave<DuelResult>("btc-price", fetchBTCPrice, 4 * MINUTE);
}

async function fetchUSDCPrice() {
  const price = await duel(
    getCoinMarketCapPrice("USDC"),
    getCoinMarketCapPrice("USDC"),
  );
  return price;
}

async function fetchUSDTPrice() {
  const price = await duel(
    getCoinMarketCapPrice("USDT"),
    getCoinMarketCapPrice("USDT"),
  );
  return price;
}

async function fetchEUROCPrice() {
  const price = await duel(
    getCoinMarketCapPrice("EURC"),
    getCoinMarketCapPrice("EURC"),
  );
  return price;
}

export async function usdcPrice() {
  return getOrSave<DuelResult>("usdc-price", fetchUSDCPrice, 4 * MINUTE);
}

export async function eurocPrice() {
  return getOrSave<DuelResult>("euroc-price", fetchEUROCPrice, 4 * MINUTE);
}

async function fetchDAIPrice() {
  const price = await duel(
    getCoinMarketCapPrice("DAI"),
    coinbase.getDAIInUSD(),
  );
  return price;
}

export async function daiPrice() {
  return getOrSave<DuelResult>("dai-price", fetchDAIPrice, 4 * MINUTE);
}

async function fetchSDaiPrice() {
  return getCoinMarketCapPrice("SDAI");
}

export async function sDaiPrice() {
  return getOrSave<DuelResult>("sDai-price", fetchSDaiPrice, 4 * MINUTE);
}

async function fetchStETHPrice() {
  return getCoinMarketCapPrice("stETH");
}

export async function stEthPrice() {
  return getOrSave<DuelResult>("stEth-price", fetchStETHPrice, 4 * MINUTE);
}

export async function usdtPrice() {
  return getOrSave<DuelResult>("usdt-price", fetchUSDTPrice, 4 * MINUTE);
}

async function fetchETHPrice() {
  const price = await duel(coinbase.getETHInUSD(), getEthPrice());
  return price;
}

export async function ethPrice() {
  return getOrSave<DuelResult>("eth-price", fetchETHPrice, 4 * MINUTE);
}

export async function fiatPrices() {
  return getOrSave<Cachable<ISO427SYMBOLS>>(
    "fiat-prices",
    currencyInUSD,
    12 * HOUR,
  );
}

async function fetchCELOPrice() {
  return await duel(getCoinMarketCapPrice("CELO"), coinbase.getCELOPrice());
}

export async function celoPrice() {
  return getOrSave<DuelResult>("celo-price", fetchCELOPrice, 1 * MINUTE);
}

async function fetchCStablePrice(currencySymbol: Tokens): Promise<DuelResult> {
  return providerToDuel(await getCoinMarketCapPrice(currencySymbol));
}

export async function tokenPriceInUSD(currencySymbol: Tokens) {
  return getOrSave<DuelResult>(
    `token-price=${currencySymbol}`,
    () => fetchCStablePrice(currencySymbol),
    10 * MINUTE,
  );
}

export default async function rates() {
  const [btc, eth, celo, usdc, euroc, dai, sDai, stEth, usdt] = allOkOrThrow(
    await Promise.all([
      btcPrice(),
      ethPrice(),
      celoPrice(),
      usdcPrice(),
      eurocPrice(),
      daiPrice(),
      sDaiPrice(),
      stEthPrice(),
      usdtPrice(),
    ]),
  );

  return {
    btc,
    eth,
    celo,
    usdc,
    euroc,
    dai,
    sDai,
    stEth,
    usdt,
  };
}
