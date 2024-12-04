import { Network } from "@/types";
import * as Sentry from "@sentry/nextjs";
import { NextApiRequest, NextApiResponse } from "next";
import { getAnalyticsUrl } from "src/config/endpoints";

interface AnalyticsApiResponse {
  addresses: {
    network: string;
    category: string;
    addresses: {
      address: string;
      label: string;
    }[];
  }[];
}

interface TransformedAddress {
  label: string;
  addresses: Array<{
    address: string;
    network: Network;
  }>;
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const start = Date.now();

      const response = await fetch(getAnalyticsUrl("reserveAddresses"));
      const result: AnalyticsApiResponse = await response.json();

      const transformedAddresses: Record<string, TransformedAddress> = {};

      result.addresses.forEach((group) => {
        const displayName = `${group.category} on ${group.network.charAt(0).toUpperCase() + group.network.slice(1)}`;

        if (!transformedAddresses[displayName]) {
          transformedAddresses[displayName] = {
            label: displayName,
            addresses: [],
          };
        }

        group.addresses.forEach((addr) => {
          const network = group.network.toLowerCase() as Network;
          if (
            !transformedAddresses[displayName].addresses.some(
              (a) => a.address === addr.address,
            )
          ) {
            transformedAddresses[displayName].addresses.push({
              address: addr.address,
              network,
            });
          }
        });
      });

      res.setHeader("Server-Timing", `ms;dur=${Date.now() - start}`);
      res.json(transformedAddresses);
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
