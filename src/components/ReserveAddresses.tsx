import * as React from "react";
import {
  generateLink,
  ReserveAssetByLabel,
  ReserveCrypto,
} from "src/addresses.config";
import Button from "src/components/Button";
import CopyIcon from "src/components/CopyIcon";

interface Props {
  reserveAssets: ReserveAssetByLabel;
}

export default function ReserveAddresses(props: Props) {
  return (
    <>
      {Object.entries(props.reserveAssets).map(([label, assets]) => {
        return <AssetDisplay key={label} label={label} assets={assets} />;
      })}
      <Button href="https://docs.celo.org/command-line-interface/reserve">
        Query Reserve Holdings
      </Button>
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
    <div className="mb-[30px]">
      <h5 className="mb-[5px] mt-[10px] [&_a]:no-underline">{label}</h5>
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
  const { onPress, justCopied } = useCopy(hex);

  return (
    <div className="mx-0 my-[8px]">
      <a
        className="text-wrap no-underline"
        href={generateLink(asset, hex)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {hex}
        {asset.isWrappedAsset === true ? ` (as ${asset.token})` : null}
      </a>
      {/* TODO: check if all works as expected */}
      <span
        className="hover:[&_.info]:opacity-1 [&.info]:transitionProperty-[opacity] [&.info]:transitionDuration-[400ms] active:[&_svg]:transform-[scale(1.1)] ml-[0.5em] cursor-pointer p-[1px] [&.info]:ml-[3px] [&.info]:opacity-0"
        onClick={onPress}
      >
        <CopyIcon />
        <span className="info">{justCopied ? "Copied" : "Copy"}</span>
      </span>
    </div>
  );
}

async function onCopy(text: string) {
  await navigator.clipboard.writeText(text);
}
