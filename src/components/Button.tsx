import Chevron from "./Chevron";

export default function Button({ children, href }) {
  return (
    <a
      className="active:[&_span]:transform-[translateX(50%)] hover:[&_span]:transform-[translateX(15%)] mb-[12px] mt-[8px] block text-[20px] font-bold text-reserve-dark no-underline [&_span]:inline-block [&_span]:pl-[4px] [&_span]:transition-transformOpacity [&_span]:duration-300 hover:[&_span]:opacity-85 active:[&_span]:opacity-65"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span>
        <Chevron size={12} />
      </span>
    </a>
  );
}
