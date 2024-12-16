import * as Sentry from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { SliceData } from "@/components/PieChart";
import { getAnalyticsUrl } from "src/config/endpoints";
interface CompositionResponse {
  composition: {
    symbol: string;
    percentage: number;
    usd_value: number;
  }[];
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const start = Date.now();

      const response = await fetch(getAnalyticsUrl("reserveComposition"));
      const result: CompositionResponse = await response.json();

      const slices: SliceData[] = result.composition.map((item) => ({
        token: item.symbol,
        percent: item.percentage,
      }));

      res.setHeader("Server-Timing", `ms;dur=${Date.now() - start}`);
      res.json(slices);
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
