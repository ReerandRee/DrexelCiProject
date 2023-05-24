//import Navbar from "@/scenes/navbar";
import { Component, useEffect, useState } from "react";
import { SelectedPage } from "@/shared/types";
import Home from "../../pages";
import Navbar from '@/components/Navbar'
import type { AppProps } from 'next/app'

function Page() {
  const [selectedPage, setSelectedPage] = useState<SelectedPage>(
    SelectedPage.Home
  );
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
        setSelectedPage(SelectedPage.Home);
      }
      if (window.scrollY !== 0) setIsTopOfPage(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app bg-gray-20">
      
      
        <Home {...Home} />
      
      
    </div>
  );
}

export default Page;