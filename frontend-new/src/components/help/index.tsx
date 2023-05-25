import { SelectedPage, SectionType } from "../shared/types";

import { motion } from "framer-motion";
import HText from "../shared/HText";
import Section from "./Section";

const sections: Array<SectionType> = [
  {
    name: "Job Counts By City/Category ",
    description:
      "View the number of jobs grouped by City/Category",
    image: "/assets/JobCounts.gif",
  },
  {
    name: "Top Ten Jobs in your City",
    description:
      "Find the top job categories in your city",
    image: "/assets/TopJobs.gif",
  },
  {
    name: "Top Cities for your Job",
    description:
      "Looking for your ideal Job? Find out which city has the most opportunities for it.",
    image: "/assets/TopCities.gif",
  },
  {
    name: "Find out the Salaray Ranges",
    description:
      "Want to know which Jobs pay the most? We have got you covered!",
    image: "/assets/Salaries.gif",
  },
  {
    name: "Get the Job Distribution",
    description:
      "Radar Charts by the city provide a sophisticated view of the job distribution",
    image: "/assets/Salaries.gif",
  },
  {
    name: "View the Job Map",
    description:
      "This map provides the view (needs to be updated)",
    image: "/assets/Salaries.gifr",
  },
];

type Props = {
  setSelectedPage: (value: SelectedPage) => void;
};

const Help = ({ setSelectedPage }: Props) => {
  return (
    <section id="help" className="gap-16 bg-gray-20 py-10 md:h-screen md:pb-0">
      <motion.div
        onViewportEnter={() => setSelectedPage(SelectedPage.Help)}
      >
        <motion.div
          className="mx-auto w-5/6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          variants={{
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
          }}
        >
          <div className="md:w-3/5">
            <HText>How to get the best out of our website?</HText>
          </div>
        </motion.div>
        <div className="mt-10 h-[353px] w-full overflow-x-auto overflow-y-hidden">
          <ul className="w-[2800px] whitespace-nowrap">
            {sections.map((item: SectionType, index) => (
              <Section
                key={`${item.name}-${index}`}
                name={item.name}
                description={item.description}
                image={item.image}
              />
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
};

export default Help;
