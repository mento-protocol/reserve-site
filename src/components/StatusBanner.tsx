import { FC } from "react";
import { cn } from "@/styles/helpers";

interface StatusBannerProps {
  message: string;
  type?: "error" | "warning" | "info";
  className?: string;
}

const StatusBanner: FC<StatusBannerProps> = ({
  message,
  type = "error",
  className,
}) => {
  if (!message) return null;

  const bgColors = {
    error: "bg-error-light",
    warning: "bg-warning-light",
    info: "bg-info-light",
  };

  const textColors = {
    error: "text-error-dark",
    warning: "text-black",
    info: "text-info-dark",
  };

  return (
    <div
      className={cn(
        "w-full px-4 py-3 text-center font-medium",
        bgColors[type],
        textColors[type],
        className,
      )}
    >
      {message}
    </div>
  );
};

export default StatusBanner;
