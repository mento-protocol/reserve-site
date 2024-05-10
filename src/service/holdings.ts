import { Token } from "@celo/contractkit"
import { BigNumber } from "bignumber.js"
import addressesConfig, { AssetType, ERC20ReserveAsset, Network } from "src/addresses.config"
import {
  BTC_AXELAR_ADDRESS,
  BTC_WORMHOLE_ADDRESS,
  CELO_ADDRESS,
  ETH_AXELAR_ADDRESS,
  ETH_WORMHOLE_ADDRESS,
  RESERVE_MULTISIG_CELO,
  STAKED_CELO_ERC20_ADDRESS,
} from "src/contract-addresses"
import { StakedCeloProvider } from "src/helpers/StakedCeloProvider"
import { getBTCBalance as getBlockChainBTCBalance } from "src/providers/BlockchainDotCom"
import getBlockStreamBTCBalance from "src/providers/Blockstream"
import {
  getCurveUSDC,
  getFrozenBalance,
  getInCustodyBalance,
  getMultisigUSDC,
  getMultisigEUROC,
  getReserveUSDC,
  getReserveEUROC,
  getUnFrozenBalance,
  getUniV3Holdings,
  getERC20Balance as getERC20BalanceCelo,
} from "src/providers/Celo"
import * as ethereum from "src/providers/EthereumRPC"
import { getOrSave } from "src/service/cache"
import { DuelResult, sumMerge } from "src/utils/DuelResult"
import { ProviderResult } from "src/utils/ProviderResult"
import { ResultOk, allOkOrThrow, valueOrThrow } from "src/utils/Result"
import { MINUTE } from "src/utils/TIME"
import { TokenModel, Tokens } from "./Data"
import { duel } from "./duel"
import getRates, { celoPrice } from "./rates"

export async function getGroupedNonCeloAddresses() {
  const groupedByToken = addressesConfig.reduce((groups, current) => {
    if (current.network === Network.CELO) {
      return groups
    }
    groups[current.token] = current.addresses
    return groups
  }, {})
  return groupedByToken as Record<Tokens, string[]>
}

async function fetchBTCBalance() {
  const btc = getTokenConfig("BTC", Network.BTC)
  return getSumBalance(btc.addresses, (address) => {
    return duel(getBlockChainBTCBalance(address), getBlockStreamBTCBalance(address))
  })
}

async function getSumBalance(
  addresses: string[],
  balanceFetcher: (address: string) => Promise<DuelResult>
) {
  const balances = await Promise.all(addresses.map(balanceFetcher))
  return balances.reduce(sumMerge)
}

export async function btcBalance() {
  return getOrSave<DuelResult>("btc-balance", fetchBTCBalance, 10 * MINUTE)
}

const getTokenConfig = (token: Tokens, network: Network) => {
  return addressesConfig.find((tc) => tc.token == token && tc.network == network)
}

async function fetchETHBalance() {
  const token = getTokenConfig("ETH", Network.ETH)
  return getSumBalance(token.addresses, (address) => {
    return ethereum.getETHBalance(address)
  })
}

export async function ethBalance() {
  return getOrSave<DuelResult>("eth-balance", fetchETHBalance, 10 * MINUTE)
}

export const erc20BalanceFetcher = (
  asset: ERC20ReserveAsset
): ((holder: string) => Promise<ProviderResult<number>>) => {
  return (holder) => {
    if (asset.network == Network.ETH) {
      return ethereum.getERC20onEthereumMainnetBalance(asset.tokenAddress, holder, asset.decimals)
    } else if (asset.network == Network.CELO) {
      return getERC20BalanceCelo(asset.tokenAddress, holder, asset.decimals)
    } else {
      throw Error(`no ERC20 fetcher for network: ${asset.network}`)
    }
  }
}

function fetchERC20Balance(token_: Tokens, network: Network) {
  const token = getTokenConfig(token_, network)
  if (token.assetType !== AssetType.ERC20) {
    throw Error("fetching ERC20 balance for a non-ERC20 asset")
  }
  return getSumBalance(token.addresses, erc20BalanceFetcher(token))
}

export async function erc20Balance(token: Tokens, network: Network) {
  return getOrSave<DuelResult>(
    `${token}-${network}-balance`,
    () => fetchERC20Balance(token, network),
    10 * MINUTE
  )
}

export async function celoCustodiedBalance() {
  return getOrSave<ProviderResult>("celo-custody-balance", getInCustodyBalance, 5 * MINUTE)
}

export async function celoFrozenBalance() {
  return getOrSave<ProviderResult>("celo-frozen-balance", getFrozenBalance, 5 * MINUTE)
}

export async function celoUnfrozenBalance() {
  return getOrSave<ProviderResult>("celo-unfrozen-balance", getUnFrozenBalance, 2 * MINUTE)
}

export async function getCurvePoolUSDC() {
  return getOrSave<ProviderResult>("curve-pool-usdc", getCurveUSDC, 5 * MINUTE)
}

export async function multisigUSDC() {
  return getOrSave<ProviderResult>("multisig-usdc", getMultisigUSDC, 5 * MINUTE)
}

export async function multisigEUROC() {
  return getOrSave<ProviderResult>("multisig-euroc", getMultisigEUROC, 5 * MINUTE)
}

export async function uniV3Holdings(address: string) {
  return getOrSave<ProviderResult<Map<string, number>>>(
    address,
    async () => getUniV3Holdings(address),
    5 * MINUTE
  )
}

export async function uniV3HoldingsForToken(address: string, token: string) {
  const univ3Holdings = valueOrThrow(await uniV3Holdings(address))
  return univ3Holdings.get(token) || 0
}

export async function reserveUSDC() {
  return getOrSave<ProviderResult>("reserve-usdc", getReserveUSDC, 5 * MINUTE)
}

export async function reserveEUROC() {
  return getOrSave<ProviderResult>("reserve-euroc", getReserveEUROC, 5 * MINUTE)
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
  const [celoRate, celoCustodied, frozen, unfrozen] = allOkOrThrow(
    await Promise.all([
      celoPrice(),
      celoCustodiedBalance(),
      celoFrozenBalance(),
      celoUnfrozenBalance(),
    ])
  )

  celoCustodied.value += await uniV3StakedCeloInCelo(RESERVE_MULTISIG_CELO)
  celoCustodied.value += await uniV3HoldingsForToken(RESERVE_MULTISIG_CELO, CELO_ADDRESS)

  const response = { celo: toCeloShape(frozen, unfrozen, celoCustodied, celoRate) }
  return response
}

async function uniV3StakedCeloInCelo(address: string): Promise<number> {
  const stCeloBalance = await uniV3HoldingsForToken(address, STAKED_CELO_ERC20_ADDRESS)
  const stCeloBalanceInCelo = await StakedCeloProvider.Instance.stCeloToCelo(
    new BigNumber(stCeloBalance).multipliedBy(new BigNumber(10).pow(18))
  )
  return stCeloBalanceInCelo.div(new BigNumber(10).pow(18)).toNumber()
}

function toCeloShape(
  frozen: ResultOk<number>,
  unfrozen: ResultOk<number>,
  celoCustodied: ResultOk<number>,
  celoRate: ResultOk<number>
): {
  frozen: TokenModel
  unfrozen: TokenModel
  custody: TokenModel
} {
  return {
    frozen: toToken(Token.CELO, frozen, celoRate),
    unfrozen: toToken(Token.CELO, unfrozen, celoRate),
    custody: toToken(Token.CELO, celoCustodied, celoRate),
  } as const
}

export async function getHoldingsOther() {
  const rates = await getRates()
  const [
    btcHeld,
    ethHeld,
    daiHeld,
    usdcHeld,
    eurocHeld,
    wethHeld,
    wbtcHeld,
    stEurHeld,
    sDaiHeld,
    stEthHeld,
    usdtHeld,
  ] = allOkOrThrow(
    await Promise.all([
      btcBalance(),
      ethBalance(),
      erc20Balance("DAI", Network.ETH),
      erc20Balance("USDC", Network.ETH),
      erc20Balance("EUROC", Network.ETH),
      erc20Balance("WETH", Network.ETH),
      erc20Balance("WBTC", Network.ETH),
      erc20Balance("stEUR", Network.CELO),
      erc20Balance("sDAI", Network.ETH),
      erc20Balance("stETH", Network.ETH),
      erc20Balance("USDT", Network.CELO),
    ])
  )

  ethHeld.value += await uniV3HoldingsForToken(RESERVE_MULTISIG_CELO, ETH_AXELAR_ADDRESS)
  ethHeld.value += await uniV3HoldingsForToken(RESERVE_MULTISIG_CELO, ETH_WORMHOLE_ADDRESS)
  btcHeld.value += await uniV3HoldingsForToken(RESERVE_MULTISIG_CELO, BTC_AXELAR_ADDRESS)
  btcHeld.value += await uniV3HoldingsForToken(RESERVE_MULTISIG_CELO, BTC_WORMHOLE_ADDRESS)
  btcHeld.value += wbtcHeld.value
  ethHeld.value += wethHeld.value

  usdcHeld.value += valueOrThrow(await getCurvePoolUSDC())
  usdcHeld.value += valueOrThrow(await multisigUSDC())
  usdcHeld.value += valueOrThrow(await reserveUSDC())

  eurocHeld.value += valueOrThrow(await multisigEUROC())
  eurocHeld.value += valueOrThrow(await reserveEUROC())

  const otherAssets: TokenModel[] = [
    toToken("BTC", btcHeld, rates.btc),
    toToken("ETH", ethHeld, rates.eth),
    toToken("DAI", daiHeld, rates.dai),
    toToken("USDC", usdcHeld, rates.usdc),
    toToken("EUROC", eurocHeld, rates.euroc),
    toToken("stEUR", stEurHeld, rates.euroc),
    toToken("sDAI", sDaiHeld, rates.sDai),
    toToken("stETH", stEthHeld, rates.stEth),
    toToken("USDT", usdtHeld, rates.usdt),
  ]

  return { otherAssets }
}

export default async function getHoldings(): Promise<HoldingsApi> {
  const rates = await getRates()
  const [daiHeld, usdcHeld, eurocHeld, wethHeld, wbtcHeld, stEurHeld, sDaiHeld, stEthHeld] =
    allOkOrThrow(
      await Promise.all([
        erc20Balance("DAI", Network.ETH),
        erc20Balance("USDC", Network.ETH),
        erc20Balance("EUROC", Network.ETH),
        erc20Balance("WETH", Network.ETH),
        erc20Balance("WBTC", Network.ETH),
        erc20Balance("stEUR", Network.CELO),
        erc20Balance("sDAI", Network.ETH),
        erc20Balance("stETH", Network.ETH),
      ])
    )
  const [btcHeld, ethHeld, celoCustodied, frozen, unfrozen] = allOkOrThrow(
    await Promise.all([
      btcBalance(),
      ethBalance(),
      celoCustodiedBalance(),
      celoFrozenBalance(),
      celoUnfrozenBalance(),
    ])
  )

  usdcHeld.value += valueOrThrow(await getCurvePoolUSDC())
  usdcHeld.value += valueOrThrow(await multisigUSDC())
  usdcHeld.value += valueOrThrow(await reserveUSDC())

  eurocHeld.value += valueOrThrow(await reserveEUROC())
  eurocHeld.value += valueOrThrow(await multisigEUROC())

  btcHeld.value += wbtcHeld.value
  ethHeld.value += wethHeld.value

  const otherAssets: TokenModel[] = [
    toToken("BTC", btcHeld, rates.btc),
    toToken("ETH", ethHeld, rates.eth),
    toToken("DAI", daiHeld, rates.dai),
    toToken("USDC", usdcHeld, rates.usdc),
    toToken("EUROC", eurocHeld, rates.euroc),
    toToken("stEUR", stEurHeld, rates.euroc),
    toToken("sDAI", sDaiHeld, rates.sDai),
    toToken("stETH", stEthHeld, rates.stEth),
  ]

  return {
    celo: toCeloShape(frozen, unfrozen, celoCustodied, rates.celo),
    otherAssets,
  }
}

function toToken(token: Tokens, units: ResultOk<number>, rate?: ResultOk<number>): TokenModel {
  let rateValue = 1
  if (rate) {
    rateValue = rate.value
  }

  return {
    token,
    units: units.value,
    value: units.value * rateValue,
    updated: units.time,
  }
}
