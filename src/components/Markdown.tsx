import MarkdownJSX from "markdown-to-jsx";
import Button from "./Button";

export interface Attributes {
  title: string;
  description?: string;
}

function Paragraph({ children }) {
  return <p className="mb-[24px]">{children}</p>;
}

function H3({ children }) {
  return <h3 className="my-3.5 font-fg text-3xl font-[600]	">{children}</h3>;
}

function H4({ children }) {
  return <h4 className="my-3.5 font-fg text-3xl font-[600]	">{children}</h4>;
}

function UL({ children }) {
  return <ul className="mb-3.5 list-inside list-disc">{children}</ul>;
}

const OPTIONS = {
  overrides: {
    p: Paragraph,
    h3: H3,
    h4: H4,
    button: Button,
    ul: UL,
  },
};

export default function Markdown({ source }) {
  return <MarkdownJSX children={source} options={OPTIONS} />;
}
