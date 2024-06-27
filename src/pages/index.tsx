import { FrontMatterResult } from "front-matter";
import Head from "src/components/Head";
import Holdings from "src/components/Holdings";
import { StableTokens } from "@/components/StableTokens";
import { Ratios } from "src/components/Ratios";
import ReserveAddresses from "src/components/ReserveAddresses";
import Section from "src/components/Section";
import PieChart from "src/components/PieChart";
import useTargets from "src/hooks/useTargets";
import {
  combineTokenAddressesByLabel,
  ReserveAssetByLabel,
} from "src/addresses.config";
import { cn } from "@/styles/helpers";
import { Header } from "@/components/header";
import { Footer } from "@/components/Footer";
import { CardBackground } from "@/components/CardBackground";

interface ContentShape {
  title: string;
}

interface Props {
  INTRO: FrontMatterResult<ContentShape>;
  INITIAL_TARGET: FrontMatterResult<ContentShape>;
  ABOUT: FrontMatterResult<ContentShape>;
  ATTESTATIONS: FrontMatterResult<ContentShape>;
  RFP: FrontMatterResult<ContentShape>;
  year: string;
  reserveCryptos: ReserveAssetByLabel;
}

export default function Home(props: Props) {
  return (
    <>
      <Head />
      <div
        className={cn(
          "min-h-screen w-full overscroll-none bg-white text-base antialiased dark:bg-black",
          "[background-origin:border-box,_border-box]",
          "[background-position:_0_0,_0_0]",
          "[background-repeat:_repeat]",
          "[background-size:_100vw_200vh]",
          "[background-image:radial-gradient(circle_at_calc(100%+210px)_37.5%,_#4D62F0_0%,_transparent_540px),radial-gradient(circle_at_calc(0%-210px)_75%,_#4D62F0_0%,_transparent_540px)]",
        )}
      >
        <main className="mx-auto w-full max-w-[calc(100vw_-_32px)] content:max-w-[1120px]">
          <Header />
          <section className="mb-[56px] flex flex-col items-center justify-center">
            <h1 className="text-center font-fg text-[56px] font-bold leading-[56px] md:flex md:gap-1 md:text-[56px] md:leading-[56px]">
              <span className="text-transparent [-webkit-text-stroke:1.2px_black] dark:[-webkit-text-stroke:1.2px_white]">
                THE MENTO
              </span>
              <br className="md:hidden" />
              <span className={``}>RESERVE</span>
            </h1>
            <p className="mb-0 mt-[32px] max-w-[690px] text-center font-inter text-lg">
              A diversified portfolio of cryptoassets supporting the ability of
              the Mento protocol to expand and contract the supply of Mento
              stable assets.
            </p>
          </section>
          <div className="flex flex-col gap-14">
            <CardBackground>
              <StableTokens />
            </CardBackground>
            <Ratios />
            <Holdings />
          </div>
          <Section title="Reserve Ratio"></Section>
          <Section title={"Reserve Addresses"}>
            <ReserveAddresses reserveAssets={props.reserveCryptos} />
          </Section>
          <Section
            title={props.INITIAL_TARGET.attributes.title}
            content={props.INITIAL_TARGET.body}
          />
          <Section
            title={props.ABOUT.attributes.title}
            content={props.ABOUT.body}
          />
          <Section
            title={props.RFP.attributes.title}
            content={props.RFP.body}
          />
          <Section
            title={props.ATTESTATIONS.attributes.title}
            content={props.ATTESTATIONS.body}
          />
          <Footer />
        </main>
      </div>
    </>
  );
}

// function_ Allocation() {
//   const targets = useTargets()
//   return (
//     <>
//       <PieChart
//         label={"Target Allocation"}
//         slices={targets.data}
//         showFinePrint={true}
//         isLoading={targets.isLoading}
//       />
//     </>
//   )
// }

export async function getStaticProps() {
  try {
    const [
      about,
      attestations,
      rfp,
      initialTarget,
      intro,
      matter,
      fetchAddresses,
    ] = await Promise.all([
      import("src/content/home/about.md").then((mod) => mod.default),
      import("src/content/home/attestations.md").then((mod) => mod.default),
      import("src/content/home/rfp.md").then((mod) => mod.default),
      import("src/content/home/initial-target.md").then((mod) => mod.default),
      import("src/content/home/intro.md").then((mod) => mod.default),
      import("front-matter").then((mod) => mod.default),
      import("src/service/addresses").then((mod) => mod.default),
    ]);
    const addresses = await fetchAddresses();

    const tokensCombinedByLabels = combineTokenAddressesByLabel(addresses);

    const INTRO = matter<ContentShape>(intro);
    const INITIAL_TARGET = matter<ContentShape>(initialTarget);
    const ABOUT = matter<ContentShape>(about);
    const ATTESTATIONS = matter<ContentShape>(attestations);
    const RFP = matter<ContentShape>(rfp);
    return {
      props: {
        reserveCryptos: tokensCombinedByLabels,
        INTRO,
        INITIAL_TARGET,
        ABOUT,
        ATTESTATIONS,
        RFP,
      },
    };
  } catch (e) {
    console.error(e);
    return {
      revalidate: 1,
    };
  }
}
