import Head from 'next/head'

import { useEffect, useState } from 'react';

import { SelectedPage } from './shared/types';
import Home from './home';
import About from './about';




export default function Landing() {

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
      <Head>
        <title>Indeed Data Analyzer </title>
        <meta name="description" content="Indeed Data Analyzer Project" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>


      <Home setSelectedPage={setSelectedPage} />
      <About setSelectedPage={setSelectedPage} />
      </main >
    </>
  )
}
