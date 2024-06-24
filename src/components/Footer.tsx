import ChangeStory from "./ChangeStory";
import { fineStyle } from "./styles";

export default function Footer({ year }) {
  return (
    <footer className="box-border flex w-full max-w-[1280px] flex-wrap items-end justify-between px-[16px] pb-[24px]">
      <div className="max-w-[380px]">
        <div className="pb-[12px] text-[20px]">Mento Reserve</div>
        <div className={fineStyle()}>
          <strong>Disclaimer</strong> Nothing herein constitutes an offer to
          sell, or the solicitation of an offer to buy, any securities or
          tokens.
        </div>
        <div className={fineStyle("mt-[15px]")}>
          © {year} AP Reserve Foundation
        </div>
      </div>
      <div>
        <a
          className="ml-[10px] p-[10px]"
          href="https://github.com/mento-protocol/reserve-site"
        >
          Source
        </a>
        <a className="ml-[10px] p-[10px]" href="/legal/terms">
          Terms
        </a>
        <a className="ml-[10px] p-[10px]" href="/legal/privacy">
          Privacy
        </a>
        <ChangeStory />
      </div>
    </footer>
  );
}
