import Amount from "src/components/Amount";
import { skipZeros } from "../utils/skipZeros";
import { useStableTokens } from "@/lib/hooks/use-stable-tokens";

export function StableTokens() {
  const { stables, isLoading, error } = useStableTokens();
  return (
    <section>
      <h2 className="mb-8 text-center font-fg text-[32px] font-medium">
        Outstanding supply of Mento stablecoins
      </h2>
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
