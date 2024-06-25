export default function NavBar() {
  return (
    <nav className="box-border flex w-full max-w-[1280px] items-center justify-between self-center px-[20px] py-[10px] phablet:pl-0">
      <a
        className="[&_span]:transform-[scale(0)] hover:[&_span]:transform-[scale(1)] mx-[10px] cursor-pointer p-[10px] pl-[5px]  text-[24px] font-medium tracking-[-0.02em] text-reserve-dark no-underline [&_span]:inline-block [&_span]:h-[1px] [&_span]:w-full [&_span]:bg-reserve-dark [&_span]:transition-transform [&_span]:duration-300"
        href="/"
      >
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
