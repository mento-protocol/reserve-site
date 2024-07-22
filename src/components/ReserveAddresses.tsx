import { CardBackground } from "@/components/CardBackground";
import { centerEllipsis } from "@/helpers/Strings";
import * as React from "react";
import {
  generateLink,
  ReserveAssetByLabel,
  ReserveCrypto,
} from "src/addresses.config";
import CopyIcon from "src/components/CopyIcon";
import { cn } from "@/styles/helpers";
import Heading from "./Heading";

interface Props {
  reserveAssets: ReserveAssetByLabel;
}

export default function ReserveAddresses(props: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Heading className="md:hidden">Reserve addresses</Heading>
      <CardBackground className="px-4 pb-6 pt-4 md:p-[40px]">
        <Heading className="mb-8 hidden md:block">Reserve addresses</Heading>
        <section className="grid md:grid-cols-2 md:gap-8">
          {Object.entries(props.reserveAssets).map(([label, assets]) => {
            return <AssetDisplay key={label} label={label} assets={assets} />;
          })}
        </section>
      </CardBackground>
    </div>
  );
}

const MILLISECONDS = 5000;

function useCopy(hex: string) {
  const [justCopied, setCopied] = React.useState(false);

  function onPress() {
    onCopy(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), MILLISECONDS);
  }

  return { onPress, justCopied };
}

const AssetDisplay = React.memo(function _TokenDisplay({
  label,
  assets,
}: {
  label: string;
  assets: ReserveCrypto[];
}) {
  return (
    <div className="md:mb-4">
      <h5 className="mb-2.5 mt-[10px] font-fg text-[18px] font-medium md:mb-4 md:text-[22px] [&_a]:no-underline">
        {label}
      </h5>
      {assets
        .map((asset) =>
          asset.addresses.map((address) => (
            <AddressDisplay
              key={`${asset.label}-${address}-${asset.token}`}
              asset={asset}
              hex={address}
            />
          )),
        )
        .flat()}
    </div>
  );
});

function AddressDisplay({ hex, asset }: { asset: ReserveCrypto; hex: string }) {
  const { onPress } = useCopy(hex);

  return (
    <div className="mb-4 flex justify-between">
      <a
        className="block font-fg text-mento-blue no-underline hover:underline md:hidden md:text-[22px]"
        href={generateLink(asset, hex)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {centerEllipsis(hex, 16, 16)}
        {asset.isWrappedAsset === true ? ` (as ${asset.token})` : null}
      </a>
      <a
        className="hidden font-fg text-mento-blue no-underline hover:underline md:block md:text-[22px]"
        href={generateLink(asset, hex)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {hex}
      </a>
      <span
        className={cn(
          "hover:[&_.info]:opacity-1 [&.info]:transitionProperty-[opacity] [&.info]:transitionDuration-[400ms] active:[&_svg]:transform-[scale(1.1)] cursor-pointer p-[1px] [&.info]:ml-[3px] [&.info]:opacity-0",
        )}
        onClick={onPress}
      >
        <CopyIcon />
      </span>
    </div>
  );
}

async function onCopy(text: string) {
  await navigator.clipboard.writeText(text);
}
