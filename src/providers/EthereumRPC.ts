import * as ethers from "ethers";
import { ERC20_ABI } from "src/constants/abis";
import { Contract } from "ethers";
import {
  providerError,
  providerOk,
  ProviderResult,
} from "src/utils/ProviderResult";
import { formatNumber } from "./utils";
import { Providers } from "./Providers";

let _provider: ethers.providers.JsonRpcProvider | null = null;
const RPC_URL = process.env.ETHEREUM_RPC_URL;

function getProvider(): ethers.providers.JsonRpcProvider {
  if (_provider === null) {
    _provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  }
  return _provider;
}

export async function getETHBalance(
  address: string,
): Promise<ProviderResult<number>> {
  try {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return providerOk(formatNumber(balance._hex), Providers.ethereumNode);
  } catch (e) {
    return providerError(e, Providers.ethereumNode);
  }
}

export async function getERC20onEthereumMainnetBalance(
  tokenAddress: string,
  accountAddress: string,
  decimals?: number,
): Promise<ProviderResult<number>> {
  try {
    const provider = getProvider();
    const contract = new Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(accountAddress);
    return providerOk(
      formatNumber(balance._hex, decimals),
      Providers.ethereumNode,
    );
  } catch (e) {
    return providerError(e, Providers.ethereumNode);
  }
}
