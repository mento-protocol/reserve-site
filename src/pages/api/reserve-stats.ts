import * as Sentry from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { getAnalyticsUrl } from "src/config/endpoints";
interface ReserveTotalsResponse {
  collateralization_ratio: number;
  total_reserve_value_usd: number;
  total_outstanding_stables_usd: number;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const start = Date.now();

      const response = await fetch(getAnalyticsUrl("reserveStats"));
      const result: ReserveTotalsResponse = await response.json();

      res.setHeader("Server-Timing", `ms;dur=${Date.now() - start}`);
      res.json(result);
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
