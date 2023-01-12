import { getBTCBalance as getBlockChainBTCBalance } from "src/providers/BlockchainDotCom"
import getBlockStreamBTCBalance from "src/providers/Blockstream"
import {
  getFrozenBalance,
  getInCustodyBalance,
  getUnFrozenBalance,
  getcMC02Balance,
} from "src/providers/Celo"
import * as etherscan from "src/providers/Etherscan"
import * as ethplorer from "src/providers/Ethplorerer"
import duel, { Duel, sumMerge } from "./duel"
import getRates, { celoPrice } from "./rates"
import { getOrSave } from "src/service/cache"
import { MINUTE } from "src/utils/TIME"
import { TokenModel, Tokens } from "./Data"
import ProviderSource from "src/providers/ProviderSource"
import { Token } from "@celo/contractkit"
import addressesConfig from "src/addresses.config"

export async function getGroupedNonCeloAddresses() {
  const groupedByToken = addressesConfig.reduce((groups, current) => {
    groups[current.token] = current.addresses
    return groups
  }, {})
  return groupedByToken as Record<Tokens, string[]>
}

async function fetchBTCBalance() {
  return getSumBalance("BTC", (address) => {
    return duel(getBlockChainBTCBalance(address), getBlockStreamBTCBalance(address))
  })
}

async function getSumBalance(token: Tokens, balanceFetcher: (address: string) => Promise<Duel>) {
  const addresses = await getGroupedNonCeloAddresses()
  const balances = await Promise.all(addresses[token].map(balanceFetcher))
  return balances.reduce(sumMerge)
}

export async function btcBalance() {
  return getOrSave<Duel>("btc-balance", fetchBTCBalance, 10 * MINUTE)
}

async function fetchETHBalance() {
  return getSumBalance("ETH", (address) => {
    return duel(etherscan.getETHBalance(address), ethplorer.getETHBalance(address))
  })
}

export async function ethBalance() {
  return getOrSave<Duel>("eth-balance", fetchETHBalance, 10 * MINUTE)
}

function fetchERC20OnEthereumBalance(token: Tokens) {
  const tokenOnEthereum = addressesConfig.find((coin) => coin.token === token)
  return getSumBalance(token, (address) => {
    return duel(
      etherscan.getERC20onEthereumMainnetBalance(
        tokenOnEthereum.tokenAddress,
        address,
        tokenOnEthereum.decimals
      ),
      ethplorer.getERC20OnEthereumBalance(tokenOnEthereum.tokenAddress, address)
    )
  })
}

export async function erc20OnEthereumBalance(token: Tokens) {
  return getOrSave<Duel>(`${token}-balance`, () => fetchERC20OnEthereumBalance(token), 10 * MINUTE)
}

export async function celoCustodiedBalance() {
  return getOrSave<ProviderSource>("celo-custody-balance", getInCustodyBalance, 5 * MINUTE)
}

export async function cMC02Balance() {
  return getOrSave<ProviderSource>("cmc02-balance", getcMC02Balance, 10 * MINUTE)
}

export async function celoFrozenBalance() {
  return getOrSave<ProviderSource>("celo-frozen-balance", getFrozenBalance, 5 * MINUTE)
}

export async function celoUnfrozenBalance() {
  return getOrSave<ProviderSource>("celo-unfrozen-balance", getUnFrozenBalance, 2 * MINUTE)
}

export interface HoldingsApi {
  celo: {
    unfrozen: TokenModel
    frozen: TokenModel
    custody: TokenModel
  }
  otherAssets: TokenModel[]
}

export async function getHoldingsCelo() {
  const [celoRate, celoCustodied, frozen, unfrozen] = await Promise.all([
    celoPrice(),
    celoCustodiedBalance(),
    celoFrozenBalance(),
    celoUnfrozenBalance(),
  ])

  return { celo: toCeloShape(frozen, celoRate, unfrozen, celoCustodied) }
}

function toCeloShape(
  frozen: ProviderSource,
  celoRate: Duel,
  unfrozen: ProviderSource,
  celoCustodied: ProviderSource
) {
  return {
    frozen: {
      token: Token.CELO,
      units: frozen.value,
      value: frozen.value * celoRate.value,
      hasError: frozen.hasError,
      updated: frozen.time,
    },
    unfrozen: {
      token: Token.CELO,
      units: unfrozen.value,
      value: unfrozen.value * celoRate.value,
      hasError: unfrozen.hasError,
      updated: unfrozen.time,
    },
    custody: {
      token: Token.CELO,
      units: celoCustodied.value,
      value: celoCustodied.value * celoRate.value,
      hasError: celoCustodied.hasError,
      updated: celoCustodied.time,
    },
  } as const
}

export async function getCurvePoolUSDC(): Promise<number> {
  // TODO:
  // - Get balance of governance LP tokens from the curver pool contract
  // - Get the total supply of LP tokens from the curve pool contract
  // - Calculate the percentage of total supply that the governance holds
  // - Calculate the value of the governance LP tokens in USD
  return 10_000_000
}

export async function getHoldingsOther() {
  try {
    const [rates, btcHeld, ethHeld, daiHeld, usdcHeld, cmco2Held] = await Promise.all([
      getRates(),
      btcBalance(),
      ethBalance(),
      erc20OnEthereumBalance("DAI"),
      erc20OnEthereumBalance("USDC"),
      cMC02Balance(),
    ])

    // TODO: implement function to correctly retrieve the value of the governance LP tokens
    usdcHeld.value += await getCurvePoolUSDC()

    const otherAssets: TokenModel[] = [
      toToken("BTC", btcHeld, rates.btc),
      toToken("ETH", ethHeld, rates.eth),
      toToken("DAI", daiHeld),
      toToken("USDC", usdcHeld),
      toToken("cMCO2", cmco2Held, rates.cmco2),
    ]

    return { otherAssets }
  } catch (e) {
    console.error(e)
  }
}

export default async function getHoldings(): Promise<HoldingsApi> {
  const [rates, btcHeld, ethHeld, daiHeld, usdcHeld, celoCustodied, frozen, unfrozen, cmco2Held] =
    await Promise.all([
      getRates(),
      btcBalance(),
      ethBalance(),
      erc20OnEthereumBalance("DAI"),
      erc20OnEthereumBalance("USDC"),
      celoCustodiedBalance(),
      celoFrozenBalance(),
      celoUnfrozenBalance(),
      cMC02Balance(),
    ])

  const otherAssets: TokenModel[] = [
    toToken("BTC", btcHeld, rates.btc),
    toToken("ETH", ethHeld, rates.eth),
    toToken("DAI", daiHeld),
    toToken("USDC", usdcHeld),
    toToken("cMCO2", cmco2Held, rates.cmco2),
  ]

  return {
    celo: toCeloShape(frozen, rates.celo, unfrozen, celoCustodied),
    otherAssets,
  }
}

function toToken(label: Tokens, tokenData: Duel | ProviderSource, rate?: Duel): TokenModel {
  return {
    token: label,
    units: tokenData.value,
    value: (tokenData.value || 0) * (rate?.value || 1),
    hasError: !tokenData.value,
    updated: tokenData.time,
  }
}
