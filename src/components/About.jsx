import { animate, motion } from "framer-motion";
import NewButton from "./helper/NewButton";

function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-white py-6 bg-slate-800 p-10 rounded mt-8"
    >
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg font-light mb-4"
      >
        Experienced Full Stack web developer specializing in React, Next,
        Typescript, Prisma, PostgreSQL, Node.js, Express.js, MongoDB, Firebase,
        Tailwind CSS, Sass, and WordPress. Passionate about blockchain
        technology and creating innovative solutions. Strong problem-solving
        skills, attention to detail, and collaborative mindset. Committed to
        staying ahead of industry trends and delivering high-quality, performant
        web applications. Open to exciting career opportunities. Let's connect
        and build something exceptional!
      </motion.p>
      <NewButton
        target={"_blank"}
        href={
          "https://drive.google.com/file/d/1Yhjje557eRmgdTvMBgcEurdTaDA4_e2S/view?usp=sharing"
        }
        text1={"Resume"}
        text2={"Download"}
      />
    </motion.div>
  );
}

export default About;
