import NextHead from "next/head";
import description from "src/content/meta-description.md";

export default function Head() {
  const title = "Mento Reserve";
  const metaImage = "/assets/open-graph.png";
  return (
    <>
      <NextHead>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content={description} />

        <meta property="og:url" content={`https://reserve.mento.org/`} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={metaImage} />
        <meta property="og:description" content={description} />

        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={metaImage} />
        <meta name="twitter:site" content={"@MentoProtocol"} />
        <meta name="twitter:card" content="summary_large_image" />
      </NextHead>
    </>
  );
}
