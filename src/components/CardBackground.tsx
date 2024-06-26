import { cn } from "@/styles/helpers";
import { ComponentProps } from "react";

export const CardBackground = ({
  children,
  className,
}: ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "w-full rounded-lg border border-gray-light bg-white p-[40px]",
        className,
      )}
    >
      {children}
    </div>
  );
};
