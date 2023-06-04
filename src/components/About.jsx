import { animate, motion } from "framer-motion";

function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="text-white py-6 bg-slate-800 p-10 rounded-md mt-8"
    >
      <p>
        Experienced Full Stack web developer specializing in React, Next,
        Typescript, Prisma, PostgreSQL, Node.js, Express.js, MongoDB, Firebase,
        Tailwind CSS, Sass, and WordPress. Passionate about blockchain
        technology and creating innovative solutions. Strong problem-solving
        skills, attention to detail, and collaborative mindset. Committed to
        staying ahead of industry trends and delivering high-quality, performant
        web applications. Open to exciting career opportunities. Let's connect
        and build something exceptional!
      </p>
      <a
        href="https://drive.google.com/file/d/1jDNztoIo9Av6tw3Ls3YDcj6TrsJkJe6r/view?usp=sharing"
        target="_blank"
      >
        <button className="bg-teal-500 transition-all hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-md mt-4">
          Download Resume
        </button>
      </a>
    </motion.div>
  );
}

export default About;
