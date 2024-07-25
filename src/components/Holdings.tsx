import { useReserveTotals } from "@/hooks/useReserveTotals";
import { cn } from "@/styles/helpers";
import Head from "next/head";
import Amount from "src/components/Amount";
import useHoldings from "src/hooks/useHoldings";
import { skipZeros } from "src/utils/skipZeros";
import { Skeleton } from "./TextSkeleton";
import { CardBackground } from "./CardBackground";
import Heading from "./Heading";

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
      <DesktopReserveAssetGrid />
      <MobileReserveAssetGrid />
    </>
  );
}

const ReserveAssetGrid = () => {
  const {
    data: { celo, otherAssets },
    isLoadingOther,
    isLoadingCelo,
  } = useHoldings();

  return (
    <section className="grid grid-cols-2 gap-2 md:gap-x-4 md:gap-y-8 lg:grid-cols-4">
      <Amount
        iconSrc={"/assets/tokens/CELO.svg"}
        context="Funds in on-chain Reserve contract and in custodyy"
        loading={isLoadingCelo}
        label={"CELO"}
        units={celo.unfrozen.units + celo.custody.units}
        value={celo.unfrozen.value + celo.custody.value}
      />
      {otherAssets
        ?.filter(skipZeros)
        .sort((a, b) => b.value - a.value)
        ?.map((asset) => (
          <Amount
            iconSrc={`/assets/tokens/${asset.token}.svg`}
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
  const displayValue =
    totalReserveValue && Math.round(totalReserveValue).toLocaleString();

  return (
    <span
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md border-[1px] border-black bg-mento-mint p-4 font-fg md:h-[58px] md:w-[530px] md:text-[26px]",
      )}
    >
      <span>Total reserve holdings:</span>
      {isLoading || !totalReserveValue ? (
        <Skeleton className="h-[18px] w-[148px] bg-[#d8e9d0] md:h-[26px] md:w-[10.3rem]" />
      ) : (
        <span className="font-medium">{`$${displayValue}`}</span>
      )}
    </span>
  );
};

const DesktopReserveAssetGrid = () => {
  return (
    <CardBackground className="hidden flex-col gap-8 md:flex">
      <div className="flex flex-col items-center justify-center gap-8">
        <Heading>Current Reserve holdings</Heading>
        <TotalReserveHoldings />
      </div>
      <ReserveAssetGrid />
    </CardBackground>
  );
};

const MobileReserveAssetGrid = () => {
  return (
    <div className="flex flex-col gap-2 md:hidden">
      <div className="flex flex-col items-center justify-center gap-3">
        <Heading>
          Current Reserve <br /> holdings
        </Heading>
        <TotalReserveHoldings />
      </div>
      <ReserveAssetGrid />
    </div>
  );
};
