import React from "react";
import { cn } from "@/styles/helpers";

export const SkeletonPie = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "relative flex h-full w-full animate-pulse items-center justify-center rounded-full bg-gray-300",
        className,
      )}
      {...props}
    >
      <div className="absolute h-[60%] w-[60%] rounded-full bg-white"></div>
    </div>
  );
};
