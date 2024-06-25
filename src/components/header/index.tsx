import { MobileHeader } from "./mobile-header";
import HeaderNav from "./header-nav";

import { MentoLogoIcon } from "@/components/icons/mento-logo.icon";
import Link from "next/link";

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
    <header className="mx-auto hidden h-32 w-full items-center justify-center bg-white py-10 dark:border-[#343437] dark:bg-black lg:flex">
      <div className="flex w-full items-center justify-between">
        <Link href="/">
          <a>
            <MentoLogoIcon className="h-6 w-[108px]" />
          </a>
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
};
