import Head from "next/head";
import { useMemo } from "react";
import Amount from "src/components/Amount";
import useHoldings from "src/hooks/useHoldings";
import { HoldingsApi } from "src/service/holdings";
import { skipZeros } from "src/utils/skipZeros";

export function sumCeloTotal(holdings: HoldingsApi) {
  const { custody, frozen, unfrozen } = holdings.celo;
  return custody.value + unfrozen.value + frozen.value;
}

export function sumNonCelo({ otherAssets }: HoldingsApi) {
  return otherAssets.reduce((prev, current) => current.value + prev, 0);
}

export default function Holdings() {
  const { data } = useHoldings();
  const isLoadingCelo = useMemo(() => {
    return data.celo.frozen.updated === 0 || data.celo.unfrozen.updated === 0;
  }, [data.celo.frozen.updated, data.celo.unfrozen.updated]);

  const isLoadingOther = useMemo(() => {
    return !data.otherAssets.findIndex((coin) => coin.updated === 0);
  }, [data.otherAssets]);

  const celo = useMemo(() => {
    return data.celo;
  }, [data.celo]);

  const totalValue = useMemo(() => {
    if (!data) return 0;

    const celoTotal =
      data.celo.frozen.value +
      data.celo.unfrozen.value +
      data.celo.custody.value;
    const otherAssetsTotal = data.otherAssets.reduce(
      (sum, asset) => sum + asset.value,
      0,
    );

    return celoTotal + otherAssetsTotal;
  }, [data]);

  return (
    <>
      <Head>
        <link
          rel="preload"
          href="/api/holdings/celo"
          as="fetch"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/api/holdings/other"
          as="fetch"
          crossOrigin="anonymous"
        />
      </Head>
      <article>
        <h2 className="mx-auto mb-6 text-center font-fg text-[32px] font-medium">
          Current reserve holdings
        </h2>
        <section className="mb-[32px]">
          <div className="mx-auto text-center font-fg text-[26px]">
            Total reserve holdings:{" "}
            {totalValue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
        </section>
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Amount
            iconSrc={"/assets/tokens/CELO.svg"}
            context="Funds in on-chain Reserve contract and in custody"
            loading={isLoadingCelo}
            label={celo.frozen.value > 0 ? "Unfrozen" : "CELO"}
            units={celo.unfrozen.units + celo.custody.units}
            value={celo.unfrozen.value + celo.custody.value}
          />
          {data?.otherAssets
            ?.filter(skipZeros)
            ?.map((asset) => (
              <Amount
                key={asset.token}
                loading={isLoadingOther}
                label={asset.token}
                units={asset.units}
                value={asset.value}
              />
            ))}
        </section>
      </article>
    </>
  );
}
