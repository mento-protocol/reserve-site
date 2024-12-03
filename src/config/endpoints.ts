export const API_ENDPOINTS = {
  analytics: {
    base: (() => {
      const url = process.env.NEXT_PUBLIC_ANALYTICS_API_URL;
      if (!url) {
        throw new Error(
          "NEXT_PUBLIC_ANALYTICS_API_URL environment variable is not set",
        );
      }
      return url;
    })(),
    paths: {
      reserveAddresses: "/api/v1/reserve/addresses",
      stablecoins: "/api/v1/stablecoins",
      reserveComposition: "/api/v1/reserve/composition",
      reserveHoldings: "/api/v1/reserve/holdings/grouped",
      reserveStats: "/api/v1/reserve/stats",
    },
  },
} as const;

export const getAnalyticsUrl = (
  path: keyof typeof API_ENDPOINTS.analytics.paths,
): string => {
  return `${API_ENDPOINTS.analytics.base}${API_ENDPOINTS.analytics.paths[path]}`;
};
