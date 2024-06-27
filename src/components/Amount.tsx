import { CardBackground } from "@/components/CardBackground";
import { cn } from "@/styles/helpers";
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
          <abbr className="cursor-help no-underline font-fg" title={context}>
            {label}
          </abbr>
        </p>
      </div>
      {/* TODO: CVA */}
      <span
        aria-labelledby={id}
        className={cn(
          "my-6 block text-left text-[32px] font-medium opacity-100 transition-opacity duration-500 font-fg",
          !loading && value ? "" : "",
          loading && "amountLoadingStyle",
        )}
      >
        {display}
      </span>
      <DollarDisplay
        className="block text-left text-[22px] opacity-100 transition-opacity duration-500 font-fg"
        value={value}
        loading={loading}
        label={label}
      />
    </CardBackground>
  );
}

interface DollarDisplayProps {
  value: number;
  loading: boolean;
  label: string;
  className?: string;
}

export function DollarDisplay({
  value,
  loading,
  label,
  className,
}: DollarDisplayProps) {
  const displayValue = value && Math.round(value).toLocaleString();

  return (
    <span
      className={cn(
        className,
        loading && "animate-loading",
        "text-[22px] text-mento-blue",
      )}
      aria-label={`Value of ${label} in USD`}
    >
      {loading ? " " : !!value && `$${displayValue}`}
    </span>
  );
}

function dasherize(str: string) {
  return str.toLowerCase().split(" ").join("-");
}

// const secondaryNumberStyle = css({
//   ["@media (min-width: 597px) and (max-width: 699px)"]: {
//     display: "none",
//   },
// });

// cn(
//   "block pl-[2em] text-left text-[36px] opacity-100 transition-opacity duration-500 tablet:mb-[8px] phablet:hidden tablet:flex-1 tablet:text-right tablet:text-[28px]",
// );
