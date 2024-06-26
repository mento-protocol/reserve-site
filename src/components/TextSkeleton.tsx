import { cn } from "@/styles/helpers";
import { PropsWithChildren } from "react";

export const TextSkeleton = ({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <span
      className={cn(
        "animate-pulse rounded-md bg-gray-300 font-medium text-gray-300",
        className,
      )}
    >
      {children}
    </span>
  );
};
