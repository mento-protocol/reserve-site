import { Tokens } from "@/service/Data";
import * as Sentry from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import StableValueTokensAPI from "src/interfaces/stable-value-tokens";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const response = await fetch(
        "https://mento-analytics-api-12390052758.us-central1.run.app/api/v1/stablecoins",
      );
      const result = await response.json();

      // Convert the result to the StableValueTokensAPI interface
      const convertedResult: StableValueTokensAPI = {
        totalStableValueInUSD: result.total_supply_usd,
        tokens: result.stablecoins.map((stablecoin) => ({
          token: stablecoin.symbol as Tokens,
          units: Number(stablecoin.supply.amount),
          value: stablecoin.supply.usd_value,
          updated: Date.now(),
          hasError: false,
        })),
      };

      res.json(convertedResult);
    } else {
      res.status(405);
    }
  } catch (error) {
    Sentry.captureException(error);
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "unknownError" });
  }
}
