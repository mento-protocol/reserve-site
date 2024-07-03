import { links } from "@/lib/constants/links";
import { MentoLogoIcon } from "@/components/icons/mento-logo.icon";
import { MobileAccordionMenu } from "@/components/mobile-accordion-menu";
import { TwitterIcon } from "@/components/icons/twitter.icon";
import { GithubIcon } from "@/components/icons/github.icon";
import { DiscordIcon } from "@/components/icons/discord.icon";
import { cn } from "@/styles/helpers";

export const Footer = () => {
  return (
    <>
      <DesktopFooter />
      <MobileFooter />
    </>
  );
};

const DesktopFooter = () => {
  return (
    <footer className="mx-auto mt-36 hidden items-start justify-between gap-16 border-t border-black px-4 pb-20 pt-20 dark:border-[#343437] lg:mx-10 lg:flex xl:mx-auto xl:max-w-[1120px] xl:gap-36">
      <div>
        <MentoLogoIcon />
        <CopyrightNotice className="pt-3" />
      </div>
      <FooterNav />
      <SocialLinks />
    </footer>
  );
};

const MobileFooter = () => {
  return (
    <footer className="pb-8 pt-10 lg:hidden">
      <div className="border-t border-black dark:border-gray-light">
        <MobileAccordionMenu classNames="bg-transparent" />
        <div className="mt-6 flex justify-between">
          <div className="flex flex-col">
            <MentoLogoIcon className="h-5 w-[90px]" />
            <CopyrightNotice className="pt-4" />
          </div>
          <SocialLinks />
        </div>
      </div>
    </footer>
  );
};

const FooterNav = () => {
  return (
    <nav className="flex flex-1 justify-between">
      {Object.entries(footerMenuItems).map(([heading, links]) => {
        return (
          <div key={heading}>
            <h4 className="mb-[10px] font-fg text-[20px] font-medium leading-none text-[#636768] dark:text-[#8F9394]">
              {heading}
            </h4>
            <ul className="flex flex-col gap-2 font-inter text-[15px]">
              {links.map(
                ({
                  title,
                  href,
                  isDownloadable,
                }: {
                  title: string;
                  href: string;
                  isDownloadable?: boolean;
                }) => {
                  return (
                    <a
                      key={title}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={href}
                      download={isDownloadable}
                    >
                      {title}
                    </a>
                  );
                },
              )}
            </ul>
          </div>
        );
      })}
    </nav>
  );
};

const SocialLinks = () => {
  return (
    <nav className="dark:text-clean-white -mt-[10px] flex items-center justify-center">
      <a target="_blank" rel="noopener noreferrer" href={links.twitter}>
        <TwitterIcon className="text-black dark:text-white" />
      </a>
      <a
        className="p-2.5"
        target="_blank"
        rel="noopener noreferrer"
        href={links.github}
      >
        <GithubIcon className="dark:text-clean-white" />
      </a>
      <a
        className="p-2.5"
        target="_blank"
        rel="noopener noreferrer"
        href={links.discord}
      >
        <DiscordIcon className="dark:text-clean-white" />
      </a>
    </nav>
  );
};

const footerMenuItems = {
  Developers: [
    { title: "Docs", href: links.docs },
    { title: "Github", href: links.github },
    { title: "Source", href: links.reserveSiteSource },
  ],
  Community: [
    { title: "Forum", href: links.forum },
    { title: "Discord", href: links.discord },
    { title: "Twitter", href: links.twitter },
  ],
  Other: [
    { title: "Team", href: links.mentoLabsTeam },
    { title: "Privacy", href: links.privacy },
  ],
};

const CopyrightNotice = ({ className }) => {
  const year = new Date().getFullYear();
  return (
    <p className={cn("text-[#636768]", className)}>
      Mento © {year}. <br />
      All rights reserved.
    </p>
  );
};
