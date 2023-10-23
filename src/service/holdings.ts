import { Token } from "@celo/contractkit"
import { BigNumber } from "bignumber.js"
import addressesConfig from "src/addresses.config"
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
  getPartialReserveUSDC,
  getPartialReserveEUROC,
  getUnFrozenBalance,
  getUniV3Holdings,
  getcMC02Balance,
} from "src/providers/Celo"
import * as etherscan from "src/providers/Etherscan"
import * as ethplorer from "src/providers/Ethplorerer"
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

export async function partialReserveUSDC() {
  return getOrSave<ProviderResult>("partial-reserve-usdc", getPartialReserveUSDC, 5 * MINUTE)
}

export async function partialReserveEUROC() {
  return getOrSave<ProviderResult>("partial-reserve-euroc", getPartialReserveEUROC, 5 * MINUTE)
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
  const [btcHeld, ethHeld, daiHeld, usdcHeld, eurocHeld, cmco2Held, wethHeld, wbtcHeld] =
    allOkOrThrow(
      await Promise.all([
        btcBalance(),
        ethBalance(),
        erc20OnEthereumBalance("DAI"),
        erc20OnEthereumBalance("USDC"),
        partialReserveEUROC(),
        cMC02Balance(),
        erc20OnEthereumBalance("WETH"),
        erc20OnEthereumBalance("WBTC"),
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
  usdcHeld.value += valueOrThrow(await partialReserveUSDC())

  const otherAssets: TokenModel[] = [
    toToken("BTC", btcHeld, rates.btc),
    toToken("ETH", ethHeld, rates.eth),
    toToken("DAI", daiHeld, rates.dai),
    toToken("USDC", usdcHeld, rates.usdc),
    toToken("EUROC", eurocHeld, rates.euroc),
    toToken("cMCO2", cmco2Held, rates.cmco2),
  ]

  return { otherAssets }
}

export default async function getHoldings(): Promise<HoldingsApi> {
  const rates = await getRates()

  const [
    btcHeld,
    ethHeld,
    daiHeld,
    usdcHeld,
    eurocHeld,
    celoCustodied,
    frozen,
    unfrozen,
    cmco2Held,
    wethHeld,
    wbtcHeld,
  ] = allOkOrThrow(
    await Promise.all([
      btcBalance(),
      ethBalance(),
      erc20OnEthereumBalance("DAI"),
      erc20OnEthereumBalance("USDC"),
      partialReserveEUROC(),
      celoCustodiedBalance(),
      celoFrozenBalance(),
      celoUnfrozenBalance(),
      cMC02Balance(),
      erc20OnEthereumBalance("WETH"),
      erc20OnEthereumBalance("WBTC"),
    ])
  )

  usdcHeld.value += valueOrThrow(await getCurvePoolUSDC())
  usdcHeld.value += valueOrThrow(await multisigUSDC())
  usdcHeld.value += valueOrThrow(await partialReserveUSDC())
  btcHeld.value += wbtcHeld.value
  ethHeld.value += wethHeld.value

  const otherAssets: TokenModel[] = [
    toToken("BTC", btcHeld, rates.btc),
    toToken("ETH", ethHeld, rates.eth),
    toToken("DAI", daiHeld, rates.dai),
    toToken("USDC", usdcHeld, rates.usdc),
    toToken("EUROC", eurocHeld, rates.euroc),
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
