import { CardBackground } from "@/components/CardBackground";
import PieChart, { SliceData, TokenColor } from "@/components/PieChart";
import { TokenModel } from "@/types";
import Heading from "./Heading";
import { Skeleton } from "./TextSkeleton";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";

export const ReserveComposition = () => {
  const {
    data: slices,
    error,
    isLoading,
  } = useSWR<SliceData[]>("/api/reserve-composition", fetcher);

  if (isLoading || error || !slices) {
    return (
      <ReserveCompositionSkeleton
        assets={[
          { token: "CELO", units: 0, value: 0, updated: Date.now() },
          { token: "BTC", units: 0, value: 0, updated: Date.now() },
          { token: "ETH", units: 0, value: 0, updated: Date.now() },
        ]}
      />
    );
  }

  return (
    <div>
      <Heading className="mb-4 lg:hidden">
        Current Reserve <br /> composition
      </Heading>
      <CardBackground className="mt-0 p-4 md:p-10">
        <article>
          <Heading className="mb-8 hidden lg:block">
            Current Reserve composition
          </Heading>
          <section className="flex flex-col-reverse items-center justify-center md:flex-row">
            <div className="grid grid-cols-2 gap-x-16 gap-y-4">
              {slices.map((item) => (
                <div
                  key={item.token}
                  className="flex flex-row items-center justify-start"
                >
                  <div
                    className="mr-[10px] h-[18px] w-[18px] rounded"
                    style={{ backgroundColor: TokenColor[item.token] }}
                  />
                  <div className="font-fg text-[18px] md:text-[22px]">
                    <span className="font-medium">{`${item.percent.toFixed(2)}%`}</span>{" "}
                    {item.token}
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-8 ml-0 max-h-[300px] max-w-[300px] md:mb-0 md:ml-[64px] lg:ml-[128px]">
              <PieChart slices={slices} isLoading={isLoading} />
            </div>
          </section>
        </article>
      </CardBackground>
    </div>
  );
};

interface ReserveCompositionSkeletonProps {
  assets: TokenModel[];
}
const ReserveCompositionSkeleton: React.FC<ReserveCompositionSkeletonProps> = ({
  assets,
}) => {
  return (
    <>
      <h2 className="mb-4 mt-8 block text-center font-fg text-[32px] font-medium lg:hidden">
        Current Reserve <br /> composition
      </h2>
      <CardBackground className="mt-0 p-10 lg:mt-14">
        <article>
          <h2 className="mb-8 hidden text-center font-fg text-[32px] font-medium lg:block">
            Current Reserve composition
          </h2>
          <section className="flex flex-col-reverse items-center justify-center md:flex-row">
            <div className="grid grid-cols-2 gap-x-16 gap-y-6">
              {assets.map((item) => (
                <div
                  key={item.token}
                  className="flex flex-row items-center justify-start gap-4"
                >
                  <Skeleton className="h-[18px] w-[18px] rounded" />
                  <Skeleton className="h-[22px] w-[107px]" />
                </div>
              ))}
            </div>
            <div className="mb-8 ml-0 max-h-[300px] max-w-[300px] md:mb-0 md:ml-[64px] lg:ml-[128px]">
              <Skeleton className="flex h-[300px] w-[300px] items-center justify-center rounded-full bg-black/10">
                <div className="h-[150px] w-[150px] rounded-full bg-white" />
              </Skeleton>
            </div>
          </section>
        </article>
      </CardBackground>
    </>
  );
};
