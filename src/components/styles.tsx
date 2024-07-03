import { cn } from "src/styles/helpers";

export const flexCol = (classNames: string = "") =>
  cn(`${classNames} flex flex-col`);

export const fineStyle = (classNames: string = "") =>
  cn(`${classNames} font-[16px] leading-[1.25]`);

export enum BreakPoints {
  smallPhone = "@media (max-width: 320px)",
  mediumPhone = "@media (max-width: 420px)",
  phablet = "@media (max-width: 500px)",
  smallTablet = "@media (max-width: 590px)",
  tablet = "@media (max-width: 890px)",
}

export const rootStyle = (classNames: string = "") =>
  cn(
    `${classNames} flex min-h-screen flex-1 flex-col items-center justify-between`,
  );

export const mainStyle = (classNames: string = "") =>
  cn(`${classNames} w-full max-w-[960px]`);
