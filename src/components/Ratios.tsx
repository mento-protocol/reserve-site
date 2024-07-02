import { useReserveTotals } from "@/lib/hooks/use-reserve-totals";
import { Skeleton } from "./TextSkeleton";
import { CardBackground } from "./CardBackground";

export function Ratios() {
  const { collateralisationRatio, isLoading } = useReserveTotals();

  return (
    <CardBackground className="mx-auto flex w-full flex-col items-center justify-between gap-6 px-4 py-6 md:flex-row md:px-[125px] md:py-10">
      <div className="flex flex-col justify-between gap-6">
        <h2 className="text-center font-fg text-[32px] font-medium md:text-left">
          Collateralisation ratio
        </h2>
        <p className="mx-1 inline-block text-center leading-[19.2px] md:text-left">
          Mento Stable Assets are backed by
          <br className="md:hidden" /> the basket of reserve assets.
          <br className="hidden md:inline-block" />
          Ratio of
          <br className="md:hidden" /> the value of the reserve in USD to the
          <br className="md:hidden" /> value of all outstanding stable assets.
        </p>
      </div>
      <span className="-mt-3 font-fg text-6xl font-medium md:m-0">
        {!isLoading && collateralisationRatio ? (
          <>{collateralisationRatio}</>
        ) : (
          <Skeleton className="h-[60px] w-[112px] bg-black/10" />
        )}
      </span>
    </CardBackground>
  );
}
