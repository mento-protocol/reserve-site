import * as React from "react";
import Markdown from "src/components/Markdown";

interface Props {
  title: string;
  content?: string;
  children?: React.ReactNode;
  subHeading?: React.ReactNode;
}

export default function Section({
  title,
  content,
  children,
  subHeading,
}: Props) {
  return (
    <section className="mb-[60px] flex flex-1 flex-wrap px-[16px]">
      <div className="mt-[5px] min-w-[220px] pr-[20px]">
        <h2 className="smallTablet:text-[26px] smallTablet:leading-[1.5]">
          {title}
        </h2>
        {subHeading}
      </div>
      <div className="smallPhone:min-w-full min-w-[320px] flex-1">
        {content && <Markdown source={content} />}
        {children}
      </div>
    </section>
  );
}
