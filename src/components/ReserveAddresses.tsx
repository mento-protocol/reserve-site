import { CardBackground } from "@/components/CardBackground";
import { centerEllipsis } from "@/helpers/Strings";
import * as React from "react";
import {
  generateLink,
  ReserveAssetByLabel,
  ReserveCrypto,
} from "src/addresses.config";
import CopyIcon from "src/components/CopyIcon";

interface Props {
  reserveAssets: ReserveAssetByLabel;
}

export default function ReserveAddresses(props: Props) {
  return (
    <CardBackground className="mt-8">
      <h2 className="mb-8 text-center font-fg text-[32px] font-medium">
        Reserve addresses
      </h2>
      <section className="flex flex-row flex-wrap justify-between *:w-full lg:*:w-[50%]">
        {Object.entries(props.reserveAssets).map(([label, assets]) => {
          return <AssetDisplay key={label} label={label} assets={assets} />;
        })}
      </section>
    </CardBackground>
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
    <div className="mb-[30px]">
      <h5 className="mb-6 mt-[10px] font-fg text-[22px] font-medium [&_a]:no-underline">
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
    <div className="mx-0 mb-[8px] flex flex-row items-center justify-start">
      <a
        className="text-wrap font-fg text-[22px] font-normal text-mento-blue no-underline hover:underline"
        href={generateLink(asset, hex)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {hex}
        {asset.isWrappedAsset === true ? ` (as ${asset.token})` : null}
      </a>
      <span
        className="hover:[&_.info]:opacity-1 [&.info]:transitionProperty-[opacity] [&.info]:transitionDuration-[400ms] active:[&_svg]:transform-[scale(1.1)] ml-[0.5em] cursor-pointer p-[1px] [&.info]:ml-[3px] [&.info]:opacity-0"
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
