import { GetStaticPaths } from "next";
import { Footer } from "@/components/Footer";
import Head from "src/components/Head";
import { Header } from "@/components/header";
import Markdown from "src/components/Markdown";

interface Props {
  body: string;
  title: string;
  updated: string;
  year: string;
}

export default function Page(props: Props) {
  return (
    <>
      <Head />
      <div>
        <main className="mx-auto w-full max-w-[calc(100vw_-_32px)] content:max-w-[1120px]">
          <Header />
          <section className="mb-[56px] flex flex-col items-center justify-center">
            <h1 className="text-center font-fg text-[56px] font-bold leading-[56px] md:flex md:gap-1 md:text-[56px] md:leading-[56px]">
              <span>{props.title}</span>
              <br className="md:hidden" />
            </h1>
            <span>Last updated: {props.updated}</span>
            <br />

            <Markdown source={props.body} />
          </section>

          <Footer />
        </main>
      </div>
    </>
  );
}

export async function getStaticProps({ params }) {
  const doc = await import(`src/content/legal/${params.doc}.md`).then(
    (mod) => mod.default,
  );
  const matter = await import("front-matter").then((mod) => mod.default);
  const document = matter<{ title: string; updated: string }>(doc);
  return {
    props: {
      year: new Date().getFullYear(),
      body: document.body,
      title: document.attributes.title,
      updated: document.attributes.updated,
    },
  };
}

export const getStaticPaths: GetStaticPaths = async function getStaticPaths() {
  return {
    paths: [{ params: { doc: "privacy" } }, { params: { doc: "terms" } }],
    fallback: false,
  };
};
