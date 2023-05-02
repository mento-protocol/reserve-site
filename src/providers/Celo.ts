import { newKit, StableToken } from "@celo/contractkit"
import BigNumber from "bignumber.js"
import { Tokens } from "src/service/Data"
import {
  AXELAR_USDC_ADDRESS,
  CMCO2_ADDRESS,
  CURVE_FACTORY_POOL_ADDRESS,
  CUSD_ADDRESS,
  GOVERNANCE_SAFE_CELO,
  PARTIAL_RESERVE_ADDRESS,
  RESERVE_CMCO2_ADDRESS,
  WORMHOLE_USDC_ADDRESS,
} from "src/contract-addresses"
import Allocation, { AssetTypes } from "src/interfaces/allocation"
import { Providers } from "./Providers"
import { ProviderResult, providerError, providerOk } from "src/utils/ProviderResult"
import { ReserveCrypto } from "src/addresses.config"
import { CurvePoolBalanceCalculator } from "src/helpers/CurvePoolBalanceCalculator"
const MIN_ABI_FOR_GET_BALANCE = [
  {
    constant: true,

    inputs: [{ name: "_owner", type: "address" }],

    name: "balanceOf",

    outputs: [{ name: "balance", type: "uint256" }],

    type: "function" as const,
  },
]

const kit = newKit(process.env.CELO_NODE_RPC_URL)
const curveBalanceCalculator = CurvePoolBalanceCalculator.Instance

export async function getCeloPrice(): Promise<ProviderResult> {
  try {
    const exchange = await kit.contracts.getExchange()
    const rate = await exchange.quoteGoldSell(WEI_PER)
    return providerOk(formatNumber(rate), Providers.celoNode)
  } catch (error) {
    return providerError(error, Providers.celoNode)
  }
}

export async function getFrozenBalance(): Promise<ProviderResult> {
  try {
    const [reserve, nativeToken] = await Promise.all([
      kit.contracts.getReserve(),
      kit.contracts.getGoldToken(),
    ])
    const [total, unfrozen] = await Promise.all([
      nativeToken.balanceOf(reserve.address),
      reserve.getUnfrozenBalance(),
    ])

    return providerOk(formatNumber(total.minus(unfrozen)), Providers.celoNode)
  } catch (error) {
    return providerError(error, Providers.celoNode)
  }
}

export async function getUnFrozenBalance() {
  try {
    const reserve = await kit.contracts.getReserve()
    const reserveBalance = await reserve.getUnfrozenBalance()

    // Get the balance of celo in the partial reserve
    const partialReserveBalances = await kit.celoTokens.balancesOf(PARTIAL_RESERVE_ADDRESS)
    const partialReserveCelo = partialReserveBalances.CELO

    const balance = reserveBalance.plus(partialReserveCelo)

    return providerOk(formatNumber(balance), Providers.celoNode)
  } catch (error) {
    return providerError(error, Providers.celoNode)
  }
}

export async function getcMC02Balance() {
  return getERC20Balance(CMCO2_ADDRESS, RESERVE_CMCO2_ADDRESS)
}

async function getERC20Balance(contractAddress: string, walletAddress: string) {
  try {
    const erc20 = new kit.web3.eth.Contract(MIN_ABI_FOR_GET_BALANCE, contractAddress)

    const balance: string = await erc20.methods.balanceOf(walletAddress).call()

    return providerOk(formatNumber(new BigNumber(balance)), Providers.celoNode)
  } catch (error) {
    console.error(error)
    return providerError(error, Providers.celoNode)
  }
}

export async function getInCustodyBalance(): Promise<ProviderResult> {
  try {
    const [reserve, nativeToken] = await Promise.all([
      kit.contracts.getReserve(),
      kit.contracts.getGoldToken(),
    ])
    const contractBalance = await nativeToken.balanceOf(reserve.address)
    const totalBalance = await reserve.getReserveCeloBalance()

    // reserveCeloBalance includes both in contract and other address balances. need to subtract out
    return providerOk(formatNumber(totalBalance.minus(contractBalance)), Providers.celoNode)
  } catch (error) {
    return providerError(error, Providers.celoNode)
  }
}

export async function getCStableSupply(token: StableToken): Promise<ProviderResult> {
  try {
    const stableToken = await kit.contracts.getStableToken(token)
    const totalSupply = await stableToken.totalSupply()
    return providerOk(formatNumber(totalSupply), Providers.celoNode)
  } catch (error) {
    return providerError(error, Providers.celoNode)
  }
}

export async function getAddresses(): Promise<{ value: ReserveCrypto[] | null }> {
  try {
    const reserve = await kit.contracts.getReserve()
    const addresses = await reserve.getOtherReserveAddresses()

    // TODO: clean up these hard coded inclusions (curve pool & multisig)
    return {
      value: [
        { label: "Celo Reserve", token: "CELO" as Tokens, addresses: [reserve.address] },
        {
          label: "Partial Reserve",
          token: "Partial Reserve" as Tokens,
          addresses: [PARTIAL_RESERVE_ADDRESS],
        },
        { label: "CELO with Custodian", token: "CELO" as Tokens, addresses: addresses },
        {
          label: "USDC in Curve Pool",
          token: "USDC in Curve Pool" as Tokens,
          addresses: [CURVE_FACTORY_POOL_ADDRESS],
        },
        {
          label: "cUSD in Curve Pool",
          token: "cUSD in Curve Pool" as Tokens,
          addresses: [CURVE_FACTORY_POOL_ADDRESS],
        },
        {
          label: "cUSD in Multisig",
          token: "cUSD in Curve Pool" as Tokens,
          addresses: [GOVERNANCE_SAFE_CELO],
        },
        {
          label: "USDC in Multisig",
          token: "cUSD in Curve Pool" as Tokens,
          addresses: [GOVERNANCE_SAFE_CELO],
        },
      ],
    }
  } catch {
    return { value: null }
  }
}

export async function getTargetAllocations(): Promise<ProviderResult<Allocation[]>> {
  try {
    const reserve = await kit.contracts.getReserve()

    const [symbols, weights]: [string[], BigNumber[]] = await Promise.all([
      reserve.getAssetAllocationSymbols(),
      reserve.getAssetAllocationWeights(),
    ])

    const value = symbols.map((symbol, index) => {
      // remove non unicode chars like \u0000 which was showing up

      const token = symbol.replace(/[^\x20-\x7E]/g, "")
      return {
        token: token === "cGLD" ? "CELO" : token,
        // show weight as number; 50 means 50%
        percent: weights[index].dividedBy(WEI_PER * 10000).toNumber(),
        type: getType(token),
      }
    })

    return providerOk(value, Providers.celoNode)
  } catch (error) {
    return providerError(error, Providers.celoNode)
  }
}

export async function getCurveCUSD(): Promise<ProviderResult> {
  try {
    const poolcUSDBalance = new BigNumber(await curveBalanceCalculator.calculateCurveCUSD())
    return providerOk(formatNumber(poolcUSDBalance), Providers.celoNode)
  } catch (error) {
    return providerError(error, Providers.celoNode)
  }
}

export async function getCurveUSDC(): Promise<ProviderResult> {
  try {
    const poolUSDCBalance = await curveBalanceCalculator.calculateCurveUSDC()
    return providerOk(poolUSDCBalance, Providers.celoNode)
  } catch (error) {
    return providerError(error, Providers.celoNode)
  }
}

export async function getMultisigCUSD() {
  return getERC20Balance(CUSD_ADDRESS, GOVERNANCE_SAFE_CELO)
}

export async function getMultisigUSDC() {
  return getERC20Balance(WORMHOLE_USDC_ADDRESS, GOVERNANCE_SAFE_CELO)
}

export async function getPartialReserveCUSD() {
  return getERC20Balance(CUSD_ADDRESS, PARTIAL_RESERVE_ADDRESS)
}

export async function getPartialReserveUSDC() {
  try {
    const wormholeUSDC = new kit.web3.eth.Contract(MIN_ABI_FOR_GET_BALANCE, WORMHOLE_USDC_ADDRESS)
    const axelarUSDC = new kit.web3.eth.Contract(MIN_ABI_FOR_GET_BALANCE, AXELAR_USDC_ADDRESS)

    const wormholeBalance = await wormholeUSDC.methods.balanceOf(PARTIAL_RESERVE_ADDRESS).call()
    const axelarBalance = await axelarUSDC.methods.balanceOf(PARTIAL_RESERVE_ADDRESS).call()

    const totalUSDC = wormholeBalance + axelarBalance

    return providerOk(totalUSDC, Providers.celoNode)
  } catch (error) {
    return providerError(error, Providers.celoNode)
  }
}

export const WEI_PER = 1_000_000_000_000_000_000

function formatNumber(value: BigNumber) {
  return value.dividedBy(WEI_PER).toNumber()
}

function getType(symbol: string): AssetTypes {
  switch (symbol) {
    case "DAI":
      return "stable-value"
    case "cMCO2":
      return "natural-capital"
    case "cGLD":
      return "celo-native-asset"
    default:
      return "other-crypto-assets"
  }
}
