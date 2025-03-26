export const STATUS_CONFIG = {
  // Set to empty string to hide the banner
  message: process.env.NEXT_PUBLIC_STATUS_MESSAGE || "",
  // Can be "error", "warning", or "info"
  type: (process.env.NEXT_PUBLIC_STATUS_TYPE || "error") as
    | "error"
    | "warning"
    | "info",
};
