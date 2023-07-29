import { motion } from "framer-motion";
import TimelineCard from "./helper/TimelineCard";

const calculateTotalMonths = (startDate, endDate) => {
  let diff = endDate - startDate;
  if (diff === 0) {
    diff = 1;
  }
  return diff < 0 ? diff + 12 : diff;
};

function TimeLine() {
  const d = new Date();
  let month = d.getMonth();
  const cardData = [
    {
      title: "NextJs Inter",
      company: "Bytewise Limited",
      startDate: "Mar 2023",
      date: `Mar 2023 - Present · ${calculateTotalMonths(2, month)} months`,
      description: [
        "Developed and implemented React + Next.js components, pages, and applications.",
        "Written clean, efficient, and well-documented code using best practices.",
        "Collaborated with the development team and other stakeholders to gather requirements, troubleshoot issues, and ensure timely delivery of projects.",
      ],
    },
    {
      title: "Web Developer Intern",
      company: "CodSoft",
      date: `July 2023 - Present · ${calculateTotalMonths(6, month)} months`,
      description: [
        "Developing and maintaining robust web applications with clean code and efficient functionality.",
        "Collaborating with the team to implement new features and enhancements.",
        "Participating in design and development discussions.",
        "Learning and applying new technologies in web development.",
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1 }}
      class="w-10/12 mt-[6rem] md:w-7/12 lg:6/12 mx-auto relative min-[720px]:text-base text-sm py-20"
    >
      <h1 class="text-3xl text-center font-extrabold text-white">Experience</h1>
      <div class="border-l-2 mt-10">
        {/* <!-- Cards --> */}
        {cardData.map((data, i) => (
          <TimelineCard
            title={data.title}
            i={i}
            company={data.company}
            date={data.date}
            description={data.description}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default TimeLine;
