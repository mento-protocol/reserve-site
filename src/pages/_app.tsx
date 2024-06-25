import { Analytics } from "@vercel/analytics/react";
import "@/styles/global.scss";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
