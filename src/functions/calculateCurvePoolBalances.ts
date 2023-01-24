import { Contract } from "ethers"
import { JsonRpcProvider } from "@ethersproject/providers"

import {
  CURVE_FACTORY_POOL_ADDRESS,
  CUSD_ADDRESS,
  GOVERNANCE_CELO,
  GOVERNANCE_SAFE_CELO,
} from "src/contract-addresses"
import { CURVE_FACTORY_POOL_ABI, USDC_ABI, CUSD_ABI } from "src/constants/abis"

const celoProvider = new JsonRpcProvider("https://forno.celo.org")

/**
 * @returns This function returns the total number of CUSD tokens owned by governance
 *          that is deployed in the Curve pool.
 */
export async function calculateCurveCUSD(): Promise<number> {
  // Init contracts
  const curvePoolContract = new Contract(
    CURVE_FACTORY_POOL_ADDRESS,
    CURVE_FACTORY_POOL_ABI,
    celoProvider
  )
  const cusdContract = new Contract(CUSD_ADDRESS, CUSD_ABI, celoProvider)

  // Get the total amount of CUSD in the pool
  const cusdPoolBalance = await cusdContract.balanceOf(CURVE_FACTORY_POOL_ADDRESS)

  // Get the total number of LP tokens owned by governance/GSC
  const gscBalance = await curvePoolContract.balanceOf(GOVERNANCE_SAFE_CELO)
  const governanceBalance = await curvePoolContract.balanceOf(GOVERNANCE_CELO)
  const totalLPTokens = gscBalance.add(governanceBalance)

  // Get the total supply of LP tokens
  const totalLpSupply = await curvePoolContract.totalSupply()

  // Get fraction of curve pool owned by governance/GSC
  const LPTokenFraction = totalLPTokens / totalLpSupply

  return cusdPoolBalance * LPTokenFraction
}
