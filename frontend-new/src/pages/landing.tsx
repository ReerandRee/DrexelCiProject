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
        <div className="app bg-gray-200">
            <LandingNavbar
                isTopOfPage={isTopOfPage}
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}

            />
            {/* <Home setSelectedPage={setSelectedPage} />
            <About setSelectedPage={setSelectedPage} /> */}
        </div>
    );
}