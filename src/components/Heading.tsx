import { cn } from "@/styles/helpers";

interface HeadingProps {
  children?: React.ReactNode;
  className?: string;
}
export default function Heading({ className, children }: HeadingProps) {
  return (
    <h2
      className={cn(
        "text-center font-fg text-[26px] font-medium md:text-[32px]",
        className,
      )}
    >
      {children}
    </h2>
  );
}
