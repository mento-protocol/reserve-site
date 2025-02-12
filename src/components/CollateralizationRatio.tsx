import { useReserveTotals } from "@/hooks/useReserveTotals";
import { Skeleton } from "./TextSkeleton";
import { CardBackground } from "./CardBackground";
import Heading from "./Heading";

export function CollateralizationRatio() {
  const { collateralisationRatio, isLoading } = useReserveTotals();

  return (
    <CardBackground className="p-0">
      <div className="mx-auto flex h-full w-full flex-col items-center justify-between px-4 py-6 md:flex-row md:items-center md:px-[125px] md:py-10">
        <div className="mb-6 flex max-w-[700px] flex-col justify-between">
          <Heading className="mb-4 md:mb-6 md:text-left">
            Collateralization ratio
          </Heading>
          <p className="mx-1 inline-block text-center md:mb-0 md:text-left md:text-[18px]/[1.2]">
            The ratio of the value of the reserve
            <br className="md:hidden" /> in USD to the value of all outstanding
            <br className="md:hidden" /> stablecoins. Mento stablecoins are{" "}
            <br className="md:hidden" /> backed by a basket of Reserve assets.
          </p>
        </div>

        <div className="flex h-full flex-1 items-center justify-center">
          {!isLoading && collateralisationRatio ? (
            <span className="flex font-fg text-6xl font-medium md:m-0 ">
              {collateralisationRatio}
            </span>
          ) : (
            <Skeleton className="h-[60px] w-[112px] bg-black/10" />
          )}
        </div>
      </div>
    </CardBackground>
  );
}
