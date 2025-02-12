import { UniV3PoolProvider } from "./UniV3PoolProvider";
import { IUniV3PoolProvider } from "./IUniV3PoolProvider";
import { BigNumber } from "bignumber.js";

export class UniV3PoolBalanceCalculator {
  private static _instance: UniV3PoolBalanceCalculator;
  private uniV3PoolProvider: IUniV3PoolProvider;

  constructor(_uniV3PoolProvider: IUniV3PoolProvider) {
    this.uniV3PoolProvider = _uniV3PoolProvider;
  }

  public static get Instance() {
    return this._instance || (this._instance = this.create());
  }
  public async calculateUniV3PoolBalance(
    address,
  ): Promise<Map<string, number>> {
    const positions = await this.uniV3PoolProvider.getPositionTokenIds(address);
    return await this.queryPositions(positions);
  }

  private static create(): UniV3PoolBalanceCalculator {
    return new UniV3PoolBalanceCalculator(new UniV3PoolProvider());
  }

  // Iterate through all the positions and calculate the holdings for each:
  // In order to calculate the holdings, we need to get the following information:
  // - liquidity l: from the NonfungiblePositionManager -> positions(tokenId)
  // - tickLower, tickUpper: from the NonfungiblePositionManager -> positions(tokenId)
  //   these two are the ticks that define the trading range of the position
  // - sqrtPriceX96: from the Pool -> slot0
  //   this is the square root of the current price of the pool
  //
  // In UniswapV3 liquidity is provided in a certain price range.
  // The price range is defined by two ticks. If the current price of the pool is
  // in that range then the holdings of the LP are in both assets.
  // If the current price is outside that range the LP's holdings are in only one asset.
  //
  // Step 1: Get the current tick of the pool
  // - Formula: currentTick = log((sqrtPrice / Q96) ** 2) / log(1.0001)
  // - with being Q96 = 2 ** 96
  //
  // Step 2: Depending on the current tick calculate the amount
  // of each asset the LP holds
  // For all cases the formula needs sqrtRatioLower and sqrtRatioUpper which are
  // - sqrtRatioLower = sqrt(1.0001 ** tickLower)
  // - sqrtRatioUpper = sqrt(1.0001 ** tickUpper)
  //
  // Case 1: currentTick < tickLower:
  // - amount0 = liquidity * (sqrtRatioUpper - sqrtRatioLower) / (sqrtRatioUpper * sqrtRatioLower)
  // - amount1 = 0
  //
  // Case 2: tickLower <= currentTick < tickUpper (position is in range):
  // - amount0 = liquidity * (sqrtRatioUpper - sqrtPrice) / (sqrtPrice * sqrtRatioUpper)
  // - amount1 = liquidity * (sqrtPrice - sqrtRatioLower)
  // with sqrtPrice = sqrtPriceX96 / Q96
  //
  // Case 3: tickUpper <= currentTick:
  // - amount0 = 0
  // - amount1 = liquidity * (sqrtRatioUpper - sqrtRatioLower)
  //
  private async queryPositions(
    positions: BigNumber[],
  ): Promise<Map<string, number>> {
    const holdings = new Map<string, number>();

    for (let i = 0; i < positions.length; i++) {
      const positionData = await this.uniV3PoolProvider.getPosition(
        positions[i].toNumber(),
      );
      if (!positionData) {
        continue;
      }

      // Get the information for the position
      const positionAsset0 = positionData[2];
      const positionAsset1 = positionData[3];
      const positionFee = positionData[4];
      const positionLiquidity = new BigNumber(positionData[7]._hex);
      if (positionLiquidity.isEqualTo(0)) {
        continue;
      }

      const tickLower = positionData[5];
      const tickUpper = positionData[6];

      const poolAddress = await this.uniV3PoolProvider.getPoolAddress(
        positionAsset0,
        positionAsset1,
        positionFee,
      );

      const poolSlot0 = await this.uniV3PoolProvider.getSlot0(poolAddress);
      const sqrtPriceX96 = new BigNumber(poolSlot0[0]._hex);
      const Q96 = new BigNumber(2).exponentiatedBy(96);

      // Step 1: Calculate the current tick
      const currentTick = Math.floor(
        Math.log((sqrtPriceX96.toNumber() / Q96.toNumber()) ** 2) /
          Math.log(1.0001),
      );

      // Calculate values that are used to calculate the amounts
      const sqrtRatioLower = Math.sqrt(1.0001 ** tickLower);
      const sqrtRatioUpper = Math.sqrt(1.0001 ** tickUpper);
      const sqrtPrice = sqrtPriceX96.dividedBy(Q96);

      let amount0 = new BigNumber(0);
      let amount1 = new BigNumber(0);

      // Step 2: Calculate the amounts
      if (currentTick < tickLower) {
        const amount0Numerator = new BigNumber(sqrtRatioUpper).minus(
          sqrtRatioLower,
        );
        const amount0Denominator = new BigNumber(sqrtRatioUpper).multipliedBy(
          sqrtRatioLower,
        );
        amount0 = positionLiquidity.multipliedBy(
          amount0Numerator.dividedBy(amount0Denominator),
        );
      }
      if (tickLower <= currentTick && currentTick < tickUpper) {
        const amount0Numerator = new BigNumber(sqrtRatioUpper).minus(sqrtPrice);
        const amount0Denominator = sqrtPrice.multipliedBy(sqrtRatioUpper);

        amount0 = positionLiquidity.multipliedBy(
          amount0Numerator.dividedBy(amount0Denominator),
        );
        amount1 = positionLiquidity.multipliedBy(
          sqrtPrice.minus(sqrtRatioLower),
        );
      }
      if (tickUpper <= currentTick) {
        amount1 = positionLiquidity.multipliedBy(
          new BigNumber(sqrtRatioUpper).minus(sqrtRatioLower),
        );
      }

      // floor the amounts because we can't have fractions of wei
      amount0 = amount0.integerValue(BigNumber.ROUND_DOWN);
      amount1 = amount1.integerValue(BigNumber.ROUND_DOWN);

      const positionAsset0Decimals = new BigNumber(
        await this.uniV3PoolProvider.getERC20Decimals(positionAsset0),
      );
      const positionAsset1Decimals = new BigNumber(
        await this.uniV3PoolProvider.getERC20Decimals(positionAsset1),
      );

      holdings.set(
        positionAsset0,
        (holdings.get(positionAsset0) || 0) +
          amount0
            .dividedBy(
              new BigNumber(10).exponentiatedBy(positionAsset0Decimals),
            )
            .toNumber(),
      );
      holdings.set(
        positionAsset1,
        (holdings.get(positionAsset1) || 0) +
          amount1
            .dividedBy(
              new BigNumber(10).exponentiatedBy(positionAsset1Decimals),
            )
            .toNumber(),
      );
    }
    return holdings;
  }
}
