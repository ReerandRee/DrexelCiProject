import { Lato } from 'next/font/google'
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';

const lato = Lato({
    weight: '400',
    subsets: ['latin'],
})

enum Paths {
    JOB_COUNTS = '/jobcounts',
    TOP_JOBS = '/topjobs',
    TOP_CITIES = '/topcities',
    SALARIES = '/salaries',
    RADAR = "/radar",
    WORD_CLOUD = "/wordcloud",
    MAP = "/geo"
}

interface NavbarProps {
    children: React.ReactNode
}

const Navbar = (props: NavbarProps) => {

    const router = useRouter();
    let path = router.pathname;

    const [selected, setSelected] = useState(path);

    useEffect(() => {
        setSelected(path);
    }, [path])

    const navbarStyle = ' p-1 px-2 transition-all duration-300 scale-100 pr-5 pl-5 drop-shadow border';
    const selectedBackground = 'bg-primary-500';
    const unselectedBackground = 'bg-gray-700 hover:bg-gray-500';
    return (
        <nav className="md:text-left mx-16 py-8 flex flex-col gap-1 items-center justify-center whitespace-normal">
            <p className={`${lato.className} text-3xl pl-2`}>Indeed Data Analyzer</p>
            <div className='flex pr-10 justify-center md:justify-normal py-6 pb-2 text-white'>
                <Link href={Paths.JOB_COUNTS} className={`${selected == Paths.JOB_COUNTS ? selectedBackground : unselectedBackground} ${navbarStyle} rounded-l-full`}>Job Counts</Link>
                <Link href={Paths.TOP_JOBS} className={`${selected == Paths.TOP_JOBS ? selectedBackground : unselectedBackground} ${navbarStyle}`}>Top 10 Jobs by City</Link>
                <Link href={Paths.TOP_CITIES} className={`${selected == Paths.TOP_CITIES ? selectedBackground : unselectedBackground} ${navbarStyle}`}>Top 10 Cities by Job</Link>
                <Link href={Paths.SALARIES} className={`${selected == Paths.SALARIES ? selectedBackground : unselectedBackground} ${navbarStyle}`}>Salaries</Link>
                <Link href={Paths.RADAR} className={`${selected == Paths.RADAR ? selectedBackground : unselectedBackground} ${navbarStyle}`}>Radar</Link>
                <Link href={Paths.MAP} className={`${selected == Paths.MAP ? selectedBackground : unselectedBackground} ${navbarStyle} rounded-r-full`}>Map</Link>
            </div>
            <div className=' w-full h-full max-h-screen items-center justify-center'>
                {props.children}
            </div>

        </nav>
    )
}

export default Navbar;
