import { bottomBorder } from "src/styles/bottomBorder";
import { cn } from "src/styles/helpers";

interface HeadingProps {
  title: string;
  gridArea: string;
  className?: string;
  iconSrc?: string;
}
export default function Heading({
  title,
  gridArea,
  iconSrc,
  className,
}: HeadingProps) {
  return (
    <div className={cn(bottomBorder(className), gridArea)}>
      <h2 className="mb-[16px] inline-flex items-center text-[28px] font-normal leading-[36px] ">
        {iconSrc && (
          <img
            src={iconSrc}
            width={30}
            height={30}
            className="mr-[8px] h-[30px] w-[30px]"
            alt={`${title} token icon`}
          />
        )}
        {title}
      </h2>
    </div>
  );
}
