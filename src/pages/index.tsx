import { FrontMatterResult } from "front-matter";
import Footer from "src/components/Footer";
import Head from "src/components/Head";
import Holdings from "src/components/Holdings";
import { StableTokens } from "src/components/StableTokens";
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
          "min-h-screen w-full overscroll-none bg-white font-fg text-base antialiased dark:bg-black",
          "[background-origin:border-box,_border-box]",
          "[background-position:_0_0,_0_0]",
          "[background-repeat:_repeat]",
          "[background-size:_100vw_200vh]",
          "[background-image:radial-gradient(circle_at_calc(100%+210px)_37.5%,_#4D62F0_0%,_transparent_540px),radial-gradient(circle_at_calc(0%-210px)_75%,_#4D62F0_0%,_transparent_540px)]",
        )}
      >
        <main className="content:max-w-[1120px] mx-auto w-full max-w-[calc(100vw_-_32px)]">
          <Header />
          <CardBackground>
            <Section
              title={props.INTRO.attributes.title}
              content={props.INTRO.body}
            />
          </CardBackground>

          <Holdings />
          <Section title="Stable Value Assets">
            <StableTokens />
          </Section>
          <Section title="Reserve Ratio">
            <Ratios />
          </Section>
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
          <Footer year={props.year} />
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
        year: new Date().getFullYear(),
      },
    };
  } catch (e) {
    console.error(e);
    return {
      revalidate: 1,
    };
  }
}
