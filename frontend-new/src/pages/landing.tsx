import LandingAbout from "@/components/LandingAbout";
import LandingHero from "@/components/LandingHero";
import LandingNavbar from "@/components/LandingNavbar";
import { useEffect, useState } from "react";

export default function Main() {

    const [selectedPage, setSelectedPage] = useState<any>(
        "Home"
    );
    const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

    useEffect(() => {
        // const handleScroll = () => {
        //     if (window.scrollY === 0) {
        //         setIsTopOfPage(true);
        //         setSelectedPage(SelectedPage.Home);
        //     }
        //     if (window.scrollY !== 0) setIsTopOfPage(false);
        // };
        // window.addEventListener("scroll", handleScroll);
        // return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="app">
            <LandingNavbar
                isTopOfPage={isTopOfPage}
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
            />
            <LandingHero setSelectedPage={setSelectedPage} />
            <LandingAbout setSelectedPage={setSelectedPage} />
        </div>
    );
}