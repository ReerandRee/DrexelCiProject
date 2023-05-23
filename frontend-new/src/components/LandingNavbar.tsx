import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
// import Logo from "@/assets/Logo.png";

// import { SelectedPage } from "@/shared/types";
// import useMediaQuery from "@/hooks/useMediaQuery";

// import Link from "./links";

type Props = {
    isTopOfPage: boolean;
    selectedPage: any;
    setSelectedPage: (value: any) => void;
};

const LandingNavbar = ({ isTopOfPage, selectedPage, setSelectedPage }: Props) => {
    const flexBetween = "flex items-center justify-between";
    const [isMenuToggled, setIsMenuToggled] = useState<boolean>(false);
    // const isAboveMediumScreens = useMediaQuery("(min-width: 1060px)");
    const navbarBackground = isTopOfPage ? "bg-white" : "bg-white drop-shadow";

    return (
        <nav>
            <div
                className={`${navbarBackground} ${flexBetween} fixed top-0 z-30 w-full py-6`}
            >
                <div className={`${flexBetween} mx-auto w-5/6`}>
                    {/* LEFT SIDE */}
                    <img alt="logo" src="/Logo.png" />

                    {/* RIGHT SIDE */}

                    {/* TODO: Change tailwind breakpoint to 1060px */}
                    <div className={`${flexBetween} gap-8 text-sm font-bold hidden lg:flex `}>
                        <Link href="/">Home</Link>
                        <Link href="/about">About Us</Link>
                        <Link href="/help">Help</Link>
                    </div>

                    {/* MOBILE MENU BUTTON */}
                    <button
                        className="rounded-full p-2 lg:hidden"
                        onClick={() => setIsMenuToggled(!isMenuToggled)}
                    >
                        <Bars3Icon className="h-6 w-6 text-black" />
                    </button>

                    {/* MOBILE MENU MODAL */}
                    {isMenuToggled && (
                        <div className="fixed right-0 bottom-0 z-40 h-full w-[300px] bg-gray-20 drop-shadow-xl">
                            {/* CLOSE ICON */}
                            <div className="flex justify-end p-12">
                                <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
                                    <XMarkIcon className="h-6 w-6 text-gray-400" />
                                </button>
                            </div>

                            {/* MENU ITEMS */}
                            <div className="ml-[33%] flex flex-col gap-10 text-xl ">
                                <Link href="/">Home</Link>
                                <Link href="/about">About Us</Link>
                                <Link href="/help">Help</Link>
                            </div>
                        </div>
                    )}



                </div>

            </div>


        </nav>
    );
};

export default LandingNavbar;
