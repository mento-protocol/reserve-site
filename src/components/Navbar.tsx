import { css } from "@emotion/react";
import colors from "src/components/colors";

export default function NavBar() {
  return (
    <nav className="phablet:pl-0 box-border flex w-full max-w-[1280px] items-center justify-between self-center px-[20px] py-[10px]">
      <a css={linkStyle} href="/">
        <img
          src={"/assets/mento-logo.svg"}
          alt="Home"
          height={60}
          className="w-[40%]"
        />
      </a>
      <div className="links flex content-center items-center"></div>
    </nav>
  );
}

const linkStyle = {
  marginLeft: 10,
  marginRight: 10,
  padding: 10,
  paddingLeft: 5,
  fontSize: 24,
  letterSpacing: "-0.02em",
  fontWeight: 500,
  color: colors.dark,
  cursor: "pointer",
  textDecoration: "none",
  span: {
    transitionProperty: "transform",
    transitionDuration: "300ms",
    display: "inline-block",
    width: "100%",
    height: 1,
    backgroundColor: colors.dark,
    transform: "scale(0)",
  },
  "&:hover": {
    span: {
      transform: "scale(1)",
    },
  },
};

cn(
  "[&_span]:transition-du text-reserve-dark spacing mx-[10px] cursor-pointer p-[10px] pl-[5px] text-[24px] font-medium tracking-[-0.02em] no-underline [&_span]:[transition-property:_'transform']",
);
