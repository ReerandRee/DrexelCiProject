
// import { AboutType, SelectedPage } from "@/shared/types";
import {
    BriefcaseIcon,
    ChartBarIcon,
    AcademicCapIcon,
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import AboutTemplate from "./AboutTemplate";


const aboutType: Array<any> = [
    {
        icon: <BriefcaseIcon className="h-6 w-6 fill-white" />,
        title: "What we do?",
        description:
            "This job data portal involves an analysis of jobs in the U.S. cities and provides a good analysis of job market",
    },
    {
        icon: <ChartBarIcon className="h-6 w-6 fill-white" />,
        title: "How we do it?",
        description:
            "We have used a variety of easy to understand visualizations involving charts, data analysis and statistics",
    },
    {
        icon: <AcademicCapIcon className="h-6 w-6 fill-white" />,
        title: "Who does it?",
        description:
            "This project is being developed and maintained by Drexel University Students with help of Drexel's faculty members",
    },
];

const container = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.2 },
    },
};

type Props = {
    setSelectedPage: (value: any) => void;
};

const LandingAbout = ({ setSelectedPage }: Props) => {
    return (
        <section id="about" className="mx-auto min-h-full w-5/6 py-20">
            <motion.div
            // onViewportEnter={() => setSelectedPage(SelectedPage.AboutUs)}
            >

                {/* HEADER */}
                <motion.div
                    className="md:my-5 md:w-3/5"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.5 }}
                    variants={{
                        hidden: { opacity: 0, x: -50 },
                        visible: { opacity: 1, x: 0 },
                    }}
                >
                    {/* <HText>About this Project</HText> */}

                </motion.div>

                {/* Abouts */}
                <motion.div
                    className="mt-5 items-center justify-between gap-8 md:flex"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    variants={container}
                >
                    {aboutType.map((aboutType: any) => (
                        <AboutTemplate
                            key={aboutType.title}
                            icon={aboutType.icon}
                            title={aboutType.title}
                            description={aboutType.description}
                            setSelectedPage={setSelectedPage}
                        />
                    ))}
                </motion.div>

                {/* GRAPHICS AND DESCRIPTION */}
                <div className="mt-16 items-center justify-between gap-20 md:mt-28 md:flex">
                    {/* GRAPHIC */}
                    <img
                        className="mx-auto"
                        alt="Abouts-page-graphic"
                        src="/AboutPageGraphic.png"
                    />

                    {/* DESCRIPTION */}
                    <div>
                        {/* TITLE */}
                        <div className="relative">
                            <div className="before:absolute before:-top-20 before:-left-20 before:z-[1] before:content-abstractwaves">
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, amount: 0.5 }}
                                    transition={{ duration: 0.5 }}
                                    variants={{
                                        hidden: { opacity: 0, x: 50 },
                                        visible: { opacity: 1, x: 0 },
                                    }}
                                >
                                    <h1 className="basis-3/5 font-montserrat text-3xl font-bold">
                                        Benefits OF OUR {" "}
                                        <span className="text-primary-500">PROJECT</span>
                                    </h1>
                                </motion.div>
                            </div>
                        </div>

                        {/* DESCRIPT */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            variants={{
                                hidden: { opacity: 0, x: 50 },
                                visible: { opacity: 1, x: 0 },
                            }}
                        >
                            <p className="my-5">
                                Our project provides access to data analysis of job related data and the
                                ability to compare a variety of job data between the largest U.S. cities.
                                By analyzing job postings and industry trends, one can identify in-demand skills and technologies.
                                Users can gain insights into the skills that are sought after in the job market, enabling them to focus on
                                developing relevant competencies and staying competitive.
                            </p>
                            <p className="mb-5">
                                The website can provide users with valuable insights into the job market, including trends,
                                demand, and growth in different industries and regions. Users can access data on popular job
                                titles, salary ranges, required skills, and employment prospects, helping them make informed
                                decisions about their careers. By presenting data analysis and visualizations, the website
                                encourages users to make data-driven decisions regarding their careers.
                            </p>
                        </motion.div>

                        {/* BUTTON */}
                        <div className="relative mt-16">
                            <div className="before:absolute before:-bottom-20 before:right-40 before:z-[-1] before:content-sparkles">
                                <button className="rounded-md bg-primary-500 px-10 py-2 text-white hover:bg-primary-100 hover:text-white">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};

export default LandingAbout;
