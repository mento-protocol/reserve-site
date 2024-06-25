export type AssetTypes =
  | "stable-value"
  | "stable-value-eur"
  | "natural-capital"
  | "other-crypto-assets"
  | "celo-native-asset";

interface Allocation {
  percent: number;
  token: string;
  type: AssetTypes;
}

export default Allocation;
