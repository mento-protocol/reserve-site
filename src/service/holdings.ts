import { getBTCBalance as getBlockChainBTCBalance } from "src/providers/BlockchainDotCom"
import getBlockStreamBTCBalance from "src/providers/Blockstream"
import {
  getFrozenBalance,
  getInCustodyBalance,
  getUnFrozenBalance,
  getcMC02Balance,
  getMultisigUSDC,
  getCurveUSDC,
  getUniV3Holdings,
  getPartialReserveUSDC,
} from "src/providers/Celo"
import * as etherscan from "src/providers/Etherscan"
import * as ethplorer from "src/providers/Ethplorerer"
import { duel } from "./duel"
import { DuelResult, sumMerge } from "src/utils/DuelResult"
import getRates, { celoPrice } from "./rates"
import { getOrSave } from "src/service/cache"
import { MINUTE } from "src/utils/TIME"
import { TokenModel, Tokens } from "./Data"
import { ProviderResult } from "src/utils/ProviderResult"
import { Token } from "@celo/contractkit"
import addressesConfig from "src/addresses.config"
import { allOkOrThrow, ResultOk, valueOrThrow } from "src/utils/Result"
import { BigNumber } from "bignumber.js"
import { StakedCeloProvider } from "src/helpers/StakedCeloProvider"
import {
  BTC_AXELAR_ADDRESS,
  BTC_WORMHOLE_ADDRESS,
  CELO_ADDRESS,
  ETH_AXELAR_ADDRESS,
  ETH_WORMHOLE_ADDRESS,
  RESERVE_MULTISIG_CELO,
  STAKED_CELO_ERC20_ADDRESS,
} from "src/contract-addresses"

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

async function getSumBalance(
  token: Tokens,
  balanceFetcher: (address: string) => Promise<DuelResult>
) {
  const addresses = await getGroupedNonCeloAddresses()
  const balances = await Promise.all(addresses[token].map(balanceFetcher))
  return balances.reduce(sumMerge)
}

export async function btcBalance() {
  return getOrSave<DuelResult>("btc-balance", fetchBTCBalance, 10 * MINUTE)
}

async function fetchETHBalance() {
  return getSumBalance("ETH", (address) => {
    return duel(etherscan.getETHBalance(address), ethplorer.getETHBalance(address))
  })
}

export async function ethBalance() {
  return getOrSave<DuelResult>("eth-balance", fetchETHBalance, 10 * MINUTE)
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
  return getOrSave<DuelResult>(
    `${token}-balance`,
    () => fetchERC20OnEthereumBalance(token),
    10 * MINUTE
  )
}

export async function celoCustodiedBalance() {
  return getOrSave<ProviderResult>("celo-custody-balance", getInCustodyBalance, 5 * MINUTE)
}

export async function cMC02Balance() {
  return getOrSave<ProviderResult>("cmc02-balance", getcMC02Balance, 10 * MINUTE)
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

export async function partialReserveUSDC() {
  return getOrSave<ProviderResult>("partial-reserve-usdc", getPartialReserveUSDC, 5 * MINUTE)
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
  const [btcHeld, ethHeld, daiHeld, usdcHeld, cmco2Held] = allOkOrThrow(
    await Promise.all([
      btcBalance(),
      ethBalance(),
      erc20OnEthereumBalance("DAI"),
      erc20OnEthereumBalance("USDC"),
      cMC02Balance(),
    ])
  )

  ethHeld.value += await uniV3HoldingsForToken(RESERVE_MULTISIG_CELO, ETH_AXELAR_ADDRESS)
  ethHeld.value += await uniV3HoldingsForToken(RESERVE_MULTISIG_CELO, ETH_WORMHOLE_ADDRESS)
  btcHeld.value += await uniV3HoldingsForToken(RESERVE_MULTISIG_CELO, BTC_AXELAR_ADDRESS)
  btcHeld.value += await uniV3HoldingsForToken(RESERVE_MULTISIG_CELO, BTC_WORMHOLE_ADDRESS)

  usdcHeld.value += valueOrThrow(await getCurvePoolUSDC())
  usdcHeld.value += valueOrThrow(await multisigUSDC())
  usdcHeld.value += valueOrThrow(await partialReserveUSDC())

  const otherAssets: TokenModel[] = [
    toToken("BTC", btcHeld, rates.btc),
    toToken("ETH", ethHeld, rates.eth),
    toToken("DAI", daiHeld, rates.dai),
    toToken("USDC", usdcHeld, rates.usdc),
    toToken("cMCO2", cmco2Held, rates.cmco2),
  ]

  return { otherAssets }
}

export default async function getHoldings(): Promise<HoldingsApi> {
  const rates = await getRates()
  const [btcHeld, ethHeld, daiHeld, usdcHeld, celoCustodied, frozen, unfrozen, cmco2Held] =
    allOkOrThrow(
      await Promise.all([
        btcBalance(),
        ethBalance(),
        erc20OnEthereumBalance("DAI"),
        erc20OnEthereumBalance("USDC"),
        celoCustodiedBalance(),
        celoFrozenBalance(),
        celoUnfrozenBalance(),
        cMC02Balance(),
      ])
    )

  usdcHeld.value += valueOrThrow(await getCurvePoolUSDC())
  usdcHeld.value += valueOrThrow(await multisigUSDC())
  usdcHeld.value += valueOrThrow(await partialReserveUSDC())

  const otherAssets: TokenModel[] = [
    toToken("BTC", btcHeld, rates.btc),
    toToken("ETH", ethHeld, rates.eth),
    toToken("DAI", daiHeld, rates.dai),
    toToken("USDC", usdcHeld, rates.usdc),
    toToken("cMCO2", cmco2Held, rates.cmco2),
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
