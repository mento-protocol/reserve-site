import React, { useMemo } from "react";
import Amount from "src/components/Amount";
import { skipZeros } from "../utils/skipZeros";
import { useStableTokens } from "@/hooks/useStableTokens";
import { cn } from "@/styles/helpers";
import { Skeleton } from "./TextSkeleton";

const TotalStableTokenValue = ({ stables, isLoading }) => {
  const totalValue = useMemo(() => {
    return stables.reduce((sum, token) => sum + token.value, 0);
  }, [stables]);

  const displayValue = Math.round(totalValue).toLocaleString();

  return (
    <span
      className={cn(
        "inline-flex h-[58px] w-full items-center justify-between gap-5 rounded-md border-[1px] border-black bg-mento-mint p-4 font-fg text-[22px] md:h-[58px] md:w-[530px] md:gap-[90px] md:text-[26px]",
      )}
    >
      <span>Total stablecoin supply:</span>
      {isLoading || !totalValue ? (
        <Skeleton className="h-[18px] w-[148px] bg-[#d8e9d0] md:h-[26px] md:w-[10.3rem]" />
      ) : (
        <span className="font-medium">{`$${displayValue}`}</span>
      )}
    </span>
  );
};

export function StableTokens() {
  const { stables, isLoading, error } = useStableTokens();

  return (
    <section>
      <h2 className="mb-8 text-center font-fg text-[32px] font-medium">
        Outstanding supply of Mento stablecoins
      </h2>
      <div className="mb-8 flex flex-col items-center justify-center gap-8">
        <TotalStableTokenValue stables={stables} isLoading={isLoading} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stables.filter(skipZeros).map((token) => {
          return (
            <Amount
              loading={isLoading}
              key={token.token}
              iconSrc={`/assets/tokens/${token.token}.svg`}
              label={token.token}
              units={token.units}
              value={token.value}
            />
          );
        })}
      </div>
    </section>
  );
}
