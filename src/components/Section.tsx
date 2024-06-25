import * as React from "react";
import Markdown from "src/components/Markdown";

interface Props {
  title: string;
  content?: string;
  children?: React.ReactNode;
}

export default function Section({ title, content, children }: Props) {
  return (
    <section>
      <header>
        <h2>{title}</h2>
      </header>
      <div>
        {content && <Markdown source={content} />}
        {children}
      </div>
    </section>
  );
}
