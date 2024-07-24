import { ChevronIcon } from "./icons/chevron.icon";
import { DiscordIcon } from "./icons/discord.icon";
import { LearnMoreIcon } from "./icons/learn-more.icon";

export const LearnMore = () => {
  return (
    <div className="mx-auto max-w-[1120px] bg-black px-4 pb-[24px] dark:bg-[#121316]  lg:max-h-[354px] xl:px-16">
      <div className="flex max-w-[1120px] flex-col items-center md:justify-between lg:flex-row lg:px-10 xl:gap-40 xl:px-0  ">
        <div className="flex-col items-center justify-center pt-16">
          <Heading />
          <CommunityText />
          <DiscordLink />
        </div>
        <LearnMoreIcon className="h-auto max-w-full" />
      </div>
    </div>
  );
};

const DiscordLink = () => {
  return (
    <a
      href="https://discord.com/invite/Zszgng9NdF"
      className="flex justify-center sm:mb-[42px] md:w-full lg:justify-start"
    >
      <span className="group inline-block w-[298px] cursor-pointer select-none rounded-lg border-b border-black bg-[#2A326A] pb-[4px] font-inter font-medium outline-offset-4 sm:w-[260px] md:w-[260px]">
        <span className="text-clean-white flex w-full items-center justify-center rounded-lg border border-black bg-[#4D62F0] py-[18px] text-center text-[15px] font-medium leading-5 transition-transform delay-[250] hover:-translate-y-[2px] group-hover:brightness-110 group-active:-translate-y-[2px] group-active:brightness-90">
          <span className="flex items-center gap-3 text-white">
            <DiscordIcon className="fill-white" />
            <span>Join the community</span>
            <ChevronIcon direction="right" />
          </span>
        </span>
      </span>
    </a>
  );
};

const Heading = () => {
  return (
    <h2 className="text-center font-fg text-[40px] font-semibold leading-[90%] -tracking-[0.01em] text-white md:text-[56px] lg:whitespace-nowrap lg:text-left ">
      Learn more
    </h2>
  );
};

const CommunityText = () => {
  return (
    <p className="mb-8 mt-4 max-w-[456px] text-center text-[15px] leading-[147%] text-gray-light md:text-left md:text-base lg:leading-[162%]">
      If you're interested in learning more about Mento, finding out what the
      team is working on now, or would like to contribute, please join our
      Discord server
    </p>
  );
};
