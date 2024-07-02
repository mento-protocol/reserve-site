import { CardBackground } from "@/components/CardBackground";
import { cn } from "@/styles/helpers";
import { Skeleton } from "./TextSkeleton";
interface AmountProps {
  label: string;
  units: number;
  value?: number;
  context?: string;
  loading?: boolean;
  iconSrc?: string;
}

const formatter = new Intl.NumberFormat(undefined, {
  style: "decimal",
  maximumFractionDigits: 2,
});

export default function Amount({
  iconSrc,
  label,
  units,
  context,
  value,
  loading,
}: AmountProps) {
  const display = formatter.format(units);

  const id = `a-${dasherize(label)}`;

  if (loading) {
    return <AmountSkeleton />;
  }

  return (
    <CardBackground className="min-w-[220px] px-6 py-4">
      <div className="flex flex-row items-center">
        {iconSrc && (
          <img
            width={32}
            height={32}
            src={iconSrc}
            className="mr-2 h-[32px] w-[32px]"
            alt=""
          />
        )}
        <p id={id} className="mb-0 items-end text-left text-[22px] font-medium">
          <abbr className="cursor-help font-fg no-underline" title={context}>
            {label}
          </abbr>
        </p>
      </div>
      {/* TODO: CVA */}
      <span
        aria-labelledby={id}
        className={cn(
          "my-6 block text-left font-fg text-[32px] font-medium opacity-100 transition-opacity duration-500",
        )}
      >
        {display}
      </span>
      <DollarDisplay
        className="block text-left font-fg text-[22px] opacity-100 transition-opacity duration-500"
        value={value}
        label={label}
      />
    </CardBackground>
  );
}

interface DollarDisplayProps {
  value: number;
  label: string;
  className?: string;
}

export function DollarDisplay({ value, label, className }: DollarDisplayProps) {
  const displayValue = value && Math.round(value).toLocaleString();

  return (
    <span
      className={cn(className, "text-[22px] text-mento-blue")}
      aria-label={`Value of ${label} in USD`}
    >
      {`$${displayValue}`}
    </span>
  );
}

function dasherize(str: string) {
  return str.toLowerCase().split(" ").join("-");
}

const AmountSkeleton = () => {
  return (
    <CardBackground className="flex min-w-[220px] flex-col gap-6 px-6 py-4">
      <div className="flex flex-row items-center gap-2">
        <Skeleton className="h-[32px] w-[32px] rounded-full bg-black/10 " />
        <Skeleton className="h-[22px] w-[65px]  bg-black/10" />
      </div>
      <Skeleton className="h-[22px] w-[198px] bg-black/10" />
      <Skeleton className="h-[22px] w-[105px] bg-black/10" />
    </CardBackground>
  );
};
