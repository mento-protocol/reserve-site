import { Fragment } from "react";
import colors from "src/components/colors";
import { cn } from "src/styles/helpers";

enum KeyAsHuman {
  "stable-value" = "Stable Value Assets*",
  "natural-capital" = "Natural Capital Backed Assets**",
}

enum TokenColor {
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
  slices: ChartData[];
  label: string;
  showFinePrint?: boolean;
  isLoading?: boolean;
}

const RADIUS = 10;
const CIRCUMFERENCE = Math.PI * 2 * RADIUS;

export default function PieChart({
  slices,
  label,
  showFinePrint,
  isLoading,
}: Props) {
  const dataWithOffsets = slices.map((data, index) => {
    let offset = 0;
    let i = index - 1;

    while (i >= 0) {
      offset = offset + (slices[i].percent || 0);
      --i;
    }
    return { offset, ...data };
  });

  return (
    <figure className="m-0 flex w-[670px] max-w-full flex-wrap pt-[48px]">
      <figcaption className="min-w-[260px] flex-[3]">
        <h3 className="mb-[24px] block w-full text-[28px] leading-[48px]">
          {label}
        </h3>
        {slices.map(({ token, percent }) => (
          <ChartKey
            key={token}
            token={token}
            percent={isLoading ? NaN : percent}
          />
        ))}
        {showFinePrint && (
          <>
            <br />
            <small>
              Target allocation is dynamic and a function of cStables in
              circulation.{" "}
              <a
                href="https://celo.stake.id/#/proposal/62"
                target="_blank"
                rel="noreferrer"
              >
                More info
              </a>
            </small>
          </>
        )}
      </figcaption>
      <div
        className={cn(
          "flex min-w-[250px] flex-[3]",
          isLoading && "animate-loading",
        )}
      >
        <svg
          viewBox="-20 -20 40 40"
          transform="rotate(-90)"
          width="100%"
          height="100%"
        >
          {dataWithOffsets.map(({ percent, offset, token }) => {
            const displayedPercent = percent < 0.1 ? 0.1 : percent;
            return (
              <Fragment key={token}>
                <circle
                  cx="0"
                  cy="0"
                  opacity={0.8}
                  r={RADIUS}
                  fill="transparent"
                  stroke={isLoading ? colors.gray : TokenColor[token]}
                  strokeWidth={RADIUS - 1}
                  strokeDasharray={`${CIRCUMFERENCE * (displayedPercent / 100)} ${
                    CIRCUMFERENCE * (1 - displayedPercent / 100)
                  }`}
                  transform={`rotate(${(offset * 360) / 100})`}
                />
                <line
                  x1="0"
                  x2={RADIUS + 1}
                  y1="0"
                  y2={RADIUS + 1}
                  stroke="white"
                  strokeWidth="0.1"
                  transform={`rotate(${((offset - 12.5) * 360) / 100})`}
                />
              </Fragment>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}

export interface ChartData {
  token: string;
  percent: number;
}

const formatter = new Intl.NumberFormat(undefined, {
  style: "decimal",
  maximumFractionDigits: 2,
});

function ChartKey({ token, percent }: ChartData) {
  return (
    <div className="mb-[10px] flex text-[20px]">
      <div
        className="h-[20px] w-[20px] rounded-[3px]"
        style={{ backgroundColor: TokenColor[token] }}
      />
      <span className="pl-[10px] pr-[8px] font-bold">
        {isNaN(percent) ? "??" : formatter.format(percent)}%
      </span>
      <span>{KeyAsHuman[token] || token}</span>
    </div>
  );
}
