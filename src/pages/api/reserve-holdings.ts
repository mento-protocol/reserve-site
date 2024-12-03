import * as Sentry from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { Tokens } from "src/service/Data";
import { HoldingsApi } from "src/service/holdings";

interface AnalyticsApiResponse {
  total_holdings_usd: number;
  assets: {
    symbol: string;
    totalBalance: string;
    usdValue: number;
  }[];
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      console.log("Reserve holdings API called at:", Date.now());
      const start = Date.now();

      // Send request to analytics API
      const response = await fetch(
        "https://mento-analytics-api-12390052758.us-central1.run.app/api/v1/reserve/holdings/grouped",
      );
      const result: AnalyticsApiResponse = await response.json();

      // Convert the result to the HoldingsApi interface
      const analyticsHoldings: HoldingsApi = {
        celo: {
          unfrozen: {
            token: "CELO",
            units: Number(
              result.assets.find((a) => a.symbol === "CELO")?.totalBalance || 0,
            ),
            value:
              result.assets.find((a) => a.symbol === "CELO")?.usdValue || 0,
            updated: Date.now(),
          },
          frozen: {
            token: "CELO",
            units: 0,
            value: 0,
            updated: Date.now(),
          },
          custody: {
            token: "CELO",
            units: 0,
            value: 0,
            updated: Date.now(),
          },
        },
        totalReserveValue: result.total_holdings_usd,
        otherAssets: result.assets
          .filter((asset) => asset.symbol !== "CELO")
          .map((asset) => ({
            token: asset.symbol as Tokens,
            units: Number(asset.totalBalance),
            value: asset.usdValue,
            updated: Date.now(),
          })),
      };

      res.setHeader("Server-Timing", `ms;dur=${Date.now() - start}`);
      res.json(analyticsHoldings);
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
