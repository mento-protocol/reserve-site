import { css } from "@emotion/react"
import { BreakPoints } from "src/components/styles"
import colors from "./colors"
import { loadingStyle } from "./loadingKeyframes"
interface AmountProps {
  label: string
  units: number
  value?: number
  gridArea: string
  context?: string
  loading?: boolean
  iconSrc?: string
}

const formatter = new Intl.NumberFormat(undefined, {
  style: "decimal",
  maximumFractionDigits: 2,
})

export default function Amount({
  iconSrc,
  label,
  units,
  gridArea,
  context,
  value,
  loading,
}: AmountProps) {
  const display = formatter.format(units)

  const id = `a-${dasherize(label)}`

  return (
    <div css={css(amountStyle, { gridArea })}>
      <div css={labelAreaCss}>
        {iconSrc && <img width={30} height={30} src={iconSrc} css={iconStyle} alt="" />}
        <p id={id} css={labelCss}>
          <abbr css={abbrCSS} title={context}>
            {label}
          </abbr>
        </p>
      </div>
      <span
        aria-labelledby={id}
        css={css(
          !loading && value ? secondaryNumberStyle : numberStyle,
          loading && amountLoadingStyle
        )}
      >
        {display}
      </span>
      <DollarDisplay css={primaryNumberStyle} value={value} loading={loading} label={label} />
    </div>
  )
}

interface DollarDisplayProps {
  value: number
  loading: boolean
  label: string
  className?: string
}

export function DollarDisplay({ value, loading, label, className }: DollarDisplayProps) {
  const displayValue = value && Math.round(value).toLocaleString()

  return (
    <span
      className={className}
      aria-label={`Value of ${label} in USD`}
      css={css(dollarValueStyle, loading && amountLoadingStyle)}
    >
      {loading ? " " : !!value && `$${displayValue}`}
    </span>
  )
}

const abbrCSS = css({
  textDecoration: "none",
  cursor: "help",
})

const amountLoadingStyle = css(loadingStyle, {
  backgroundColor: colors.gray,
  borderTopRightRadius: 6,
  color: "transparent",
  minHeight: "1.1em",
})

const labelCss = css({
  textAlign: "left",
  alignItems: "flex-end",
  marginBottom: 0,
  lineHeight: 1,
})

function dasherize(str: string) {
  return str.toLowerCase().split(" ").join("-")
}

const labelAreaCss = css({
  display: "inline-flex",
  flexDirection: "row",
  marginBottom: 12,
  marginTop: 12,
  alignItems: "flex-end",
  [BreakPoints.tablet]: {
    flex: 1,
  },
})

const numberStyle = css({
  textAlign: "left",
  display: "block",
  transitionProperty: "opacity",
  transitionDuration: "500ms",
  opacity: 1,
  fontSize: 36,
  [BreakPoints.tablet]: {
    flex: 1,
    fontSize: 28,
    marginBottom: 8,
  },
})

const primaryNumberStyle = css(numberStyle, {
  [BreakPoints.tablet]: {
    textAlign: "right",
    flex: 1,
  },
})

const secondaryNumberStyle = css(numberStyle, {
  textAlign: "left",
  paddingleft: "2em",
  [BreakPoints.phablet]: {
    display: "none",
  },
  ["@media (min-width: 597px) and (max-width: 699px)"]: {
    display: "none",
  },
})

const dollarValueStyle = css(numberStyle, {
  color: colors.gray,
  marginTop: 16,
  marginBottom: 16,
})

const amountStyle = css({
  [BreakPoints.tablet]: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
})
const iconStyle = css({ height: 30, width: 30, marginRight: 8 })
