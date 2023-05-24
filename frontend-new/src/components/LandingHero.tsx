// import { SelectedPage } from "@/shared/types";
// import HomePageGraphic from "@/assets/HomePageGraphic.png";

import { motion } from "framer-motion";

type Props = {
    setSelectedPage: (value: any) => void;
};

const LandingHero = ({ setSelectedPage }: Props) => {

    //   const goToPage = () => {

    //     // This will navigate to second component
    //     navigate('/page'); 
    //   };

    return (
        <section id="home" className="gap-16 bg-green-20 py-10 md:h-screen md:pb-0">
            {/* IMAGE AND MAIN HEADER */}
            <motion.div
                className="mx-auto w-5/6 items-center justify-center md:flex md:h-5/6"
            // onViewportEnter={() => setSelectedPage(SelectedPage.Home)}
            >
                {/* MAIN HEADER */}
                <div className="z-10 mt-32 md:basis-3/5">
                    {/* HEADINGS */}
                    <motion.div
                        className="md:-mt-20"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5 }}
                        variants={{
                            hidden: { opacity: 0, x: -50 },
                            visible: { opacity: 1, x: 0 },
                        }}
                    >
                        <div className="relative">
                            <div className="before:absolute before:-top-20 before:-left-20 before:z-[-1] md:before:content-homebackground">
                                <h1 className="text-6xl text-primary-500">Job Data Analysis</h1>
                            </div>
                        </div>

                        <p className="mt-8 text-lg text-secondary-500">
                            We provide the analysis of job opportunities all over the United States. To learn more about it, please click below
                        </p>
                    </motion.div>

                    {/* ACTIONS */}
                    <motion.div
                        className="mt-8 flex items-center gap-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        variants={{
                            hidden: { opacity: 0, x: -50 },
                            visible: { opacity: 1, x: 0 },
                        }}
                    >
                        <button
                            // onClick={goToPage} 
                            className="rounded-md bg-primary-500 px-10 py-2 text-white hover:bg-primary-100 hover:text-white"
                        >
                            Get Started
                        </button>

                    </motion.div>
                </div>

                {/* IMAGE */}

                <div
                    className="flex basis-3/5 justify-center md:z-10 md:ml-40 mt-16 md:justify-items-end"
                >
                    <img alt="home-pageGraphic" src='/HomePageGraphic.png' />
                </div>
            </motion.div>

        </section>
    );
};

export default LandingHero;
