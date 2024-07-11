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
    <>
      <h2 className="mb-8 block pt-8 text-center font-fg text-[32px] font-medium md:hidden">
        Reserve addresses
      </h2>
      <CardBackground className="mt-8 px-4 pb-6 pt-4 md:p-[40px]">
        <h2 className="mb-8 hidden text-center font-fg text-[32px] font-medium md:block">
          Reserve addresses
        </h2>
        <section className="flex flex-row flex-wrap justify-between *:w-full lg:*:w-[50%]">
          {Object.entries(props.reserveAssets).map(([label, assets]) => {
            return <AssetDisplay key={label} label={label} assets={assets} />;
          })}
        </section>
      </CardBackground>
    </>
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
    <div className="mb-[16px] md:mb-[30px]">
      <h5 className="mb-2.5 mt-[10px] font-fg text-[18px] font-medium md:mb-6 md:text-[22px] [&_a]:no-underline">
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
        className="flex-grow text-wrap font-fg text-[16px] font-normal text-mento-blue no-underline hover:underline md:text-[22px]"
        href={generateLink(asset, hex)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* Shorten addresses on mobile screens */}
        <span className="block md:hidden">
          {centerEllipsis(hex, 16, 16)}
          {asset.isWrappedAsset === true ? ` (as ${asset.token})` : null}
        </span>

        {/* Show full address on larger screens */}
        <span className="hidden md:block">
          {hex}
          {asset.isWrappedAsset === true ? ` (as ${asset.token})` : null}
        </span>
      </a>

      {asset.isWrappedAsset ? (
        <span
          className="hover:[&_.info]:opacity-1 [&.info]:transitionProperty-[opacity] [&.info]:transitionDuration-[400ms] active:[&_svg]:transform-[scale(1.1)] mr-[5em] flex-shrink-0 cursor-pointer p-[1px] md:mr-[1em] [&.info]:ml-[3px] [&.info]:opacity-0"
          onClick={onPress}
        >
          <CopyIcon />
        </span>
      ) : (
        <span
          className="hover:[&_.info]:opacity-1 [&.info]:transitionProperty-[opacity] [&.info]:transitionDuration-[400ms] active:[&_svg]:transform-[scale(1.1)] mr-[9em] flex-shrink-0 cursor-pointer p-[1px] md:mr-[1em] [&.info]:ml-[3px] [&.info]:opacity-0"
          onClick={onPress}
        >
          <CopyIcon />
        </span>
      )}
    </div>
  );
}

async function onCopy(text: string) {
  await navigator.clipboard.writeText(text);
}
