import { MentoLogoIcon } from "@/components/icons/mento-logo.icon";
import HeaderNav from "./header-nav";
import { MobileHeader } from "./mobile-header";

export const Header = () => {
  return (
    <>
      <DesktopHeader />
      <MobileHeader />
    </>
  );
};

const DesktopHeader = () => {
  return (
    <header className="mx-auto hidden h-32 w-full items-center justify-center py-10 dark:border-[#343437] dark:bg-black lg:flex">
      <div className="flex w-full items-center justify-between">
        <a rel="noopener noreferrer" href="https://mento.org" target="_blank">
          <MentoLogoIcon className="h-6 w-[108px]" />
        </a>
        <HeaderNav />
      </div>
    </header>
  );
};
