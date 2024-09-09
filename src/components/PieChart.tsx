import { ArcElement, Chart, ChartData } from "chart.js";
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import colors from "src/components/colors";
import { SkeletonPie } from "./PieSkeleton";

export enum TokenColor {
  /* eslint-disable @typescript-eslint/prefer-literal-enum-member */
  BTC = colors.orange,
  ETH = colors.purpleGray,
  CELO = colors.gold,
  "stable-value" = colors.blue,
  DAI = colors.blue,
  USDC = colors.lightBlue,
  EUROC = colors.violet,
  stEUR = colors.red,
  "stable-value-eur" = colors.violet,
  "natural-capital" = colors.green,
  cMCO2 = colors.green,
  sDAI = colors.blue,
  stETH = colors.green,
  USDT = colors.darkolivegreen,
  /* eslint-enable @typescript-eslint/prefer-literal-enum-member */
}

interface Props {
  slices: SliceData[];
  isLoading?: boolean;
}

export default function PieChart({ slices, isLoading }: Props) {
  Chart.register(ArcElement);
  // Inconsistent spacing due to high numbers & borders,
  // so injection of pseudo slices was done here with flat maps
  const data: ChartData<"doughnut", number[], string> = useMemo(
    () => ({
      labels: slices.map((i) => i.token),
      datasets: [
        {
          label: "Current Reserve composition",
          data: slices.flatMap((i) => [1, i.percent]),
          backgroundColor: slices.flatMap((i) => [
            "transparent",
            TokenColor[i.token],
          ]),
          hoverOffset: 0,
          borderRadius: 10,
          offset: 0,
          spacing: 0,
          borderAlign: "center",
          borderWidth: slices.flatMap(() => [0, 1]),
          borderColor: "rgba(0,0,0,0.6)",
        },
      ],
    }),
    [slices],
  );

  return <Doughnut data={data} />;
}

export function PieChartSkeleton() {
  return (
    <div className="flex h-[300px] w-[300px] items-center justify-center">
      <SkeletonPie className="h-full w-full" />
    </div>
  );
}

export interface SliceData {
  token: string;
  percent: number;
}
