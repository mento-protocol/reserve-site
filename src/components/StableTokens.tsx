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

  console.log(data?.tokens);
  return (
    <section>
      <h2 className="text-center text-[32px] font-medium">
        Outstanding supply of Mento stablecoins
      </h2>
      <div className="">
        {data?.tokens?.filter(skipZeros)?.map((token) => {
          return (
            <Amount
              key={token.token}
              iconSrc={`/assets/tokens/${token.token}.svg`}
              label={token.token}
              units={token.units}
              value={token.value}
              gridArea={""}
            />
          );
        })}
      </div>
    </section>
  );
}
