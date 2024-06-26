import useSWR from "swr";
import Amount from "src/components/Amount";
import StableValueTokensAPI from "src/interfaces/stable-value-tokens";
import { fetcher } from "src/utils/fetcher";
import { skipZeros } from "../utils/skipZeros";
import { SECOND } from "src/utils/TIME";

export function StableTokens() {
  const { data } = useSWR<StableValueTokensAPI>(
    "/api/stable-value-tokens",
    fetcher,
    {
      refreshInterval: SECOND * 10,
    },
  );

  return (
    <section>
      <h2 className="mb-8 text-center text-[32px] font-medium font-fg">
        Outstanding supply of Mento stablecoins
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {data?.tokens?.filter(skipZeros).map((token) => {
          return (
            <Amount
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
