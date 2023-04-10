import { Lato } from 'next/font/google'
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';

const lato = Lato({
    weight: '400',
    subsets: ['latin'],
})

enum Paths {
    HOME = '/',
    TOP_JOBS = '/topjobs',
    TOP_CITIES = '/topcities',
    SALARIES = '/salaries'
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
        console.log(path);
    }, [path])

    return (
        <nav className="text-center md:text-left mx-16 py-8 flex flex-col gap-4 ">
            <p className={`${lato.className} text-3xl pl-2`}>Indeed Data Analyzer</p>
            <div className='flex gap-16 justify-center md:justify-normal py-6 pb-2'>
                <Link href={Paths.HOME} className={`${selected == Paths.HOME ? 'bg-cyan-200 rounded-full' : ''} p-1 px-2 transition-all duration-300 scale-100 `}>Job Counts</Link>
                <Link href={Paths.TOP_JOBS} className={`${selected == Paths.TOP_JOBS ? 'bg-cyan-200 rounded-full' : ''} p-1 px-2 transition-all duration-300 scale-100`}>Top 10 Jobs by City</Link>
                <Link href={Paths.TOP_CITIES} className={`${selected == Paths.TOP_CITIES ? 'bg-cyan-200 rounded-full' : ''} p-1 px-2 transition-all duration-300 scale-100`}>Top 10 Cities by Job</Link>
                <Link href={Paths.SALARIES} className={`${selected == Paths.SALARIES ? 'bg-cyan-200 rounded-full' : ''} p-1 px-2 transition-all duration-300 scale-100`}>Salaries</Link>
            </div>
            <div className=' w-full h-full'>
                {props.children}
            </div>
        </nav>
    )
}

export default Navbar;