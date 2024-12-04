import { CardBackground } from "@/components/CardBackground";
import { centerEllipsis } from "@/helpers/Strings";
import { cn } from "@/styles/helpers";
import * as React from "react";
import CopyIcon from "src/components/CopyIcon";
import Heading from "./Heading";
import { useReserveAddresses } from "src/hooks/useReserveAddresses";
import { Network } from "@/types";

export default function ReserveAddresses() {
  const { addresses, isLoading } = useReserveAddresses();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <Heading className="md:hidden">Reserve addresses</Heading>
      <CardBackground className="px-4 pb-6 pt-4 md:p-[40px]">
        <Heading className="mb-8 hidden md:block">Reserve addresses</Heading>
        <section className="grid md:grid-cols-2 md:gap-x-8">
          {Object.entries(addresses).map(([label, asset]) => (
            <AssetDisplay
              key={label}
              label={label}
              addresses={asset.addresses}
            />
          ))}
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
  addresses,
}: {
  label: string;
  addresses: Array<{ address: string; network: Network }>;
}) {
  return (
    <div>
      <h5 className="mb-2.5 mt-[10px] font-fg text-[18px] font-medium md:mb-4 md:text-[22px] [&_a]:no-underline">
        {label}
      </h5>
      {addresses.map((addr) => (
        <AddressDisplay
          key={`${label}-${addr.address}`}
          hex={addr.address}
          network={addr.network}
        />
      ))}
    </div>
  );
});

function AddressDisplay({ hex, network }: { hex: string; network: Network }) {
  const { onPress } = useCopy(hex);

  const explorerLink =
    network === Network.BTC
      ? `https://blockchain.info/address/${hex}`
      : network === Network.ETH
        ? `https://etherscan.io/address/${hex}`
        : `https://celoscan.io/address/${hex}`;

  return (
    <div className="mb-2 flex justify-between">
      <a
        className="block font-fg text-mento-blue no-underline hover:underline md:hidden md:text-[22px]"
        href={explorerLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        {centerEllipsis(hex, 16, 16)}
      </a>
      <a
        className="hidden font-fg text-mento-blue no-underline hover:underline md:block md:text-[22px]"
        href={explorerLink}
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
