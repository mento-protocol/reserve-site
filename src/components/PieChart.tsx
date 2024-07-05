import { useMemo } from "react";
import colors from "src/components/colors";
import { Chart, ArcElement, ChartData } from "chart.js";
import { Doughnut } from "react-chartjs-2";

export enum TokenColor {
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
}

interface Props {
  slices: SliceData[];
  isLoading?: boolean;
}

export default function PieChart({ slices, isLoading }: Props) {
  Chart.register(ArcElement);
  const data: ChartData<"doughnut", number[], string> = useMemo(
    () => ({
      labels: slices.map((i) => i.token),
      datasets: [
        {
          label: "My First Dataset",
          data: slices.map((i) => i.percent),
          backgroundColor: slices.map((i) => TokenColor[i.token]),
          hoverOffset: 0,
          borderRadius: 10,
          offset: 0,
          spacing: 5,
          borderWidth: 1,
          borderColor: "#FFF",
        },
      ],
    }),
    [slices],
  );

  return <Doughnut data={data} />;
}

export interface SliceData {
  token: string;
  percent: number;
}
