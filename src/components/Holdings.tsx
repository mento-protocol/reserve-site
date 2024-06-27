import { useReserveTotals } from "@/lib/hooks/use-reserve-totals";
import { cn } from "@/styles/helpers";
import Head from "next/head";
import { useMemo } from "react";
import Amount from "src/components/Amount";
import useHoldings from "src/hooks/useHoldings";
import { skipZeros } from "src/utils/skipZeros";
import { Skeleton } from "./TextSkeleton";
import { CardBackground } from "./CardBackground";

export default function Holdings() {
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
      <CardBackground className="hidden flex-col gap-8 md:flex">
        <div className="flex flex-col items-center justify-center gap-8">
          <Heading />
          <TotalReserveHoldings />
        </div>
        <ReserveAssetGrid />
      </CardBackground>
      <article className="flex flex-col gap-8 md:hidden">
        <div className="flex flex-col items-center justify-center gap-8">
          <Heading />
          <TotalReserveHoldings />
        </div>
        <ReserveAssetGrid />
      </article>
    </>
  );
}

const Heading = () => {
  return (
    <h2 className="mx-auto text-center font-fg text-[32px] font-medium">
      Current Reserve Holdings
    </h2>
  );
};

const ReserveAssetGrid = () => {
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

  return (
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
  );
};

const TotalReserveHoldings = () => {
  const { isLoading, totalReserveValue } = useReserveTotals();

  return (
    <span
      className={cn(
        "inline-flex h-[58px] w-full items-center justify-between gap-5 rounded-md border-[1px] border-black bg-mento-mint p-4 font-fg text-[22px] md:h-[58px] md:w-[530px] md:gap-[90px] md:text-[26px]",
      )}
    >
      <span>Total reserve holdings:</span>
      {isLoading || !totalReserveValue ? (
        <Skeleton className="h-[18px] w-[148px] bg-[#d8e9d0] md:h-[26px] md:w-[10.3rem]" />
      ) : (
        <span className="font-medium">{`${totalReserveValue.toFixed(2)} $`}</span>
      )}
    </span>
  );
};
