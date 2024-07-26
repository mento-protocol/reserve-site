import React, { useMemo } from "react";
import Amount from "src/components/Amount";
import { skipZeros } from "../utils/skipZeros";
import { useStableTokens } from "@/hooks/useStableTokens";
import { cn } from "@/styles/helpers";
import { Skeleton } from "./TextSkeleton";
import { CardBackground } from "./CardBackground";
import Heading from "./Heading";

const TotalStableTokenValue = ({ className }: { className?: string }) => {
  const { stables, isLoading } = useStableTokens();
  const totalValue = useMemo(() => {
    return stables.reduce((sum, token) => sum + token.value, 0);
  }, [stables]);

  const displayValue = Math.round(totalValue).toLocaleString();

  return (
    <div
      className={cn(
        "mx-auto flex w-full items-center justify-between gap-2 rounded-md border-[1px] border-black bg-mento-mint p-4 font-fg md:h-[58px] md:w-[530px] md:text-[26px]",
        className,
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

const StableTokenContent = () => {
  const { stables, isLoading } = useStableTokens();

  return (
    <section>
      <div className="grid grid-cols-2 gap-2 md:gap-4 lg:grid-cols-4">
        {stables
          .filter(skipZeros)
          .sort((a, b) => b.value - a.value)
          ?.map((token) => {
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
};

export function StableTokens() {
  return (
    <>
      <CardBackground className="hidden flex-col md:flex">
        <Heading className="mb-8">
          Outstanding supply of Mento stablecoins
        </Heading>
        <TotalStableTokenValue className="mb-6" />
        <StableTokenContent />
      </CardBackground>

      <div className="flex flex-col gap-2 md:hidden">
        <div className="flex flex-col items-center justify-center gap-3">
          <Heading>
            Outstanding supply of <br className="md:hidden" /> Mento stablecoins
          </Heading>
          <TotalStableTokenValue />
        </div>
        <StableTokenContent />
      </div>
    </>
  );
}
