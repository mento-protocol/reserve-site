import { cn } from "@/styles/helpers";
interface AmountProps {
  label: string;
  units: number;
  value?: number;
  gridArea: string;
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
  gridArea,
  context,
  value,
  loading,
}: AmountProps) {
  const display = formatter.format(units);

  const id = `a-${dasherize(label)}`;

  return (
    <div
      className={cn(
        "tablet:flex tablet:items-end tablet:justify-between",
        gridArea,
      )}
    >
      <div className="my-[12px] inline-flex flex-row items-end tablet:flex-1">
        {iconSrc && (
          <img
            width={30}
            height={30}
            src={iconSrc}
            className="mr-[8px] h-[30px] w-[30px]"
            alt=""
          />
        )}
        <p id={id} className="mb-0 items-end text-left leading-[1]">
          <abbr className="cursor-help no-underline" title={context}>
            {label}
          </abbr>
        </p>
      </div>
      {/* TODO: CVA */}
      <span
        aria-labelledby={id}
        className={cn(
          "block text-left text-[36px] opacity-100 transition-opacity duration-500 tablet:mb-[8px]",
          !loading && value
            ? "pl-[2em] tablet:text-right tablet:text-[28px]"
            : "tablet:flex-1 tablet:text-[28px]",
          loading && "amountLoadingStyle",
        )}
      >
        {display}
      </span>
      <DollarDisplay
        className="block text-left text-[36px] opacity-100 transition-opacity duration-500 tablet:mb-[8px] tablet:flex-1 tablet:text-right tablet:text-[28px]"
        value={value}
        loading={loading}
        label={label}
      />
    </div>
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
        "my-[16px] block text-left text-[36px] text-reserve-gray opacity-100 transition-opacity duration-500 tablet:mb-[8px] tablet:flex-1 tablet:text-[28px]",
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
