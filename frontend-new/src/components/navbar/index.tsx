import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { SelectedPage } from "../shared/types";
import useMediaQuery from "../../../public/hooks/useMediaQuery";
import Link from "next/link";

import LandingNavbarLink from "./links";

interface NavbarProps {
  children: React.ReactNode
}
type Props = {
  isTopOfPage: boolean;
  selectedPage: SelectedPage;
  setSelectedPage: (value: SelectedPage) => void;
  children: React.ReactNode;
};



const Navbar = ({ isTopOfPage, selectedPage, setSelectedPage, children }: Props) => {
  const flexBetween = "flex items-center justify-between";
  const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
  const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
  const navbarBackground = isTopOfPage ? "bg-white" : "bg-white drop-shadow";

  return (
    <nav>
      <div
        className={`${navbarBackground} ${flexBetween} fixed top-0 z-30 w-full py-6`}
      >
        <div className={`${flexBetween} mx-auto w-5/6`}>
          <div className={`${flexBetween} w-full gap-16`}>
            {/* LEFT SIDE */}
            <Link href="/"><img alt="logo" src="/assets/Logo.png" /></Link>

            {/* RIGHT SIDE */}
            {isAboveMediumScreens ? (
              <div className={`${flexBetween} gap-8 text-sm font-bold`}>


                <LandingNavbarLink
                  page="Home"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}

                />
                <LandingNavbarLink
                  page="About Us"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />
                <LandingNavbarLink
                  page="Help"
                  selectedPage={selectedPage}
                  setSelectedPage={setSelectedPage}
                />

              </div>
            ) : (
              <button
                className="rounded-full bg-secondary-500 p-2"
                onClick={() => setIsMenuToggled(!isMenuToggled)}
              >
                <Bars3Icon className="h-6 w-6 text-white" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE MENU MODAL */}
      {!isAboveMediumScreens && isMenuToggled && (
        <div className="fixed right-0 bottom-0 z-40 h-full w-[300px] bg-gray-20 drop-shadow-xl">
          {/* CLOSE ICON */}
          <div className="flex justify-end p-12">
            <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
              <XMarkIcon className="h-6 w-6 text-gray-400" />
            </button>
          </div>

          {/* MENU ITEMS */}
          <div className="ml-[33%] flex flex-col gap-10 text-xl ">
            <LandingNavbarLink
              page="Home"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <LandingNavbarLink
              page="About Us"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />
            <LandingNavbarLink
              page="Help"
              selectedPage={selectedPage}
              setSelectedPage={setSelectedPage}
            />

          </div>
        </div>
      )}
      <div>
        {children}
      </div>
    </nav>
  );

};

export default Navbar;
