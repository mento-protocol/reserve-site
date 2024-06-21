import Footer from "src/components/Footer";
import Head from "src/components/Head";
import NavBar from "src/components/Navbar";
import { flexCol, mainStyle, rootStyle } from "src/components/styles";
interface Props {
  year: string;
}

export default function Page(props: Props) {
  return (
    <>
      <Head />
      <div className={rootStyle()}>
        <div className={flexCol("flex w-full items-center")}>
          <NavBar />
          <main  className={mainStyle("flex flex-col justify-center items-center content-center")}>
            <img className="max-w-[400px] p-[24px]" src="assets/unique.png" />
            <h1 className="text-center mt-[30px]">Page Not Found</h1>
          </main>
        </div>
        <Footer year={props.year} />
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: {
      year: new Date().getFullYear(),
    },
    revalidate: 86400, // day
  };
}
