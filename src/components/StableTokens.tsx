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
    <div
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md border-[1px] border-black bg-mento-mint p-4 font-fg text-[18px] sm:text-[16px] md:h-[58px] md:w-[530px] md:text-[22px]",
      )}
    >
      <span className="whitespace-nowrap">Total stablecoin supply:</span>
      {isLoading || !totalValue ? (
        <Skeleton className="h-[18px] w-[100px] bg-[#d8e9d0] md:h-[26px] md:w-[10.3rem]" />
      ) : (
        <span className="whitespace-nowrap font-medium">{`$${displayValue}`}</span>
      )}
    </div>
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
