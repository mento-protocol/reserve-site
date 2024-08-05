import { IUniV3PoolProvider } from "./IUniV3PoolProvider";
import { BigNumber } from "ethers";
import { UniV3PoolBalanceCalculator } from "./UniV3PoolBalanceCalculator";

class FakeUniV3PoolProvider implements IUniV3PoolProvider {
  public positionTokenIds = [BigNumber.from(3115), BigNumber.from(3113)];

  public cUSD = "0x765DE816845861e75A25fCA122bb6898B8B1282a";
  public axlWBTC = "0x1a35EE4640b0A3B87705B0A4B45D227Ba60Ca2ad";
  public wormholeWBTC = "0xd71Ffd0940c920786eC4DbB5A12306669b5b81EF";

  //data comes from:
  //https://app.uniswap.org/pool/3115?chain=celo
  public position1 = [
    0,
    "0",
    this.axlWBTC, // token0
    this.cUSD, // token1
    3000, // fee
    330120, // tickLower
    333900, // tickUpper
    BigNumber.from(4040728375888), // liquidity
  ];

  //data comes from:
  //https://app.uniswap.org/pool/3113?chain=celo
  public position2 = [
    0,
    "0",
    this.cUSD, // token0
    this.wormholeWBTC, // token1
    3001, // fee
    -332580, // tickLower
    -331800, // tickUpper
    BigNumber.from(89923569515171), // liquidity
  ];
  public slot01 = [
    BigNumber.from("1770416090971842202582039427480271301"), // sqrtPriceX96
    0,
    0,
    0,
    0,
    0,
    true,
  ];

  public slot02 = [
    BigNumber.from("4295128740"), // sqrtPriceX96
    0,
    0,
    0,
    0,
    0,
    true,
  ];

  public pool1Address = "pool1";
  public pool2Address = "pool2";

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getPositionTokenIds(address: string): Promise<BigNumber[]> {
    return this.positionTokenIds;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getPosition(tokenId: number): Promise<any> {
    if (tokenId === 3115) return this.position1;
    if (tokenId === 3113) return this.position2;
  }

  public async getPoolAddress(
    token0: string,
    token1: string,
    fee: number,
  ): Promise<string> {
    if (fee == 3000) return this.pool1Address;
    if (fee == 3001) return this.pool2Address;
  }

  public async getSlot0(poolAddress: string): Promise<any> {
    if (poolAddress === this.pool1Address) return this.slot01;
    if (poolAddress === this.pool2Address) return this.slot02;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async getERC20Decimals(tokenAddress: string): Promise<number> {
    if (tokenAddress === this.cUSD) return 18;
    if (tokenAddress === this.axlWBTC) return 8;
    if (tokenAddress === this.wormholeWBTC) return 8;
    return 0;
  }
}

let fakeUniV3PoolProvider: FakeUniV3PoolProvider;
let uniV3PoolBalanceCalculator: UniV3PoolBalanceCalculator;

describe("CurvePoolBalanceCalculator", () => {
  beforeEach(async function () {
    fakeUniV3PoolProvider = new FakeUniV3PoolProvider();
    uniV3PoolBalanceCalculator = new UniV3PoolBalanceCalculator(
      fakeUniV3PoolProvider,
    );
  });

  it("should return the correct number of balances for multiple positions", async () => {
    const balances =
      await uniV3PoolBalanceCalculator.calculateUniV3PoolBalance("0x1234");
    expect(balances.size).toEqual(3);
  });
  it("should correctly calculate the balance for multiple positions", async () => {
    const balances =
      await uniV3PoolBalanceCalculator.calculateUniV3PoolBalance("0x1234");
    expect(balances.get(fakeUniV3PoolProvider.cUSD)).toEqual(69.65842801756224);
    expect(balances.get(fakeUniV3PoolProvider.axlWBTC)).toEqual(0);
    expect(balances.get(fakeUniV3PoolProvider.wormholeWBTC)).toEqual(0);
  });
});
