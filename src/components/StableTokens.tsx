import useSWR from "swr";
import Amount from "src/components/Amount";
import Heading from "src/components/Heading";
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
    <div className="tablet:[grid-template-areas:_'title'] tablet:grid-cols-[100%] grid grid-flow-dense grid-cols-3 gap-x-[20px] gap-y-[12px] [grid-template-areas:_'title_title_title']">
      <Heading title="Outstanding Supply" gridArea="title" />
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
  );
}
