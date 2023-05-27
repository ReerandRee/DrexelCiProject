
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/navbar/index'
import { useState, useEffect } from 'react';
import { SelectedPage } from '../components/shared/types';

export default function App({ Component, pageProps }: AppProps) {
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
    <>

      <Navbar isTopOfPage={isTopOfPage} selectedPage={selectedPage} setSelectedPage={setSelectedPage}>
        <Component {...pageProps} />
      </Navbar>

    </>
  )
}
