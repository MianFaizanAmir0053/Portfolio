import { motion } from "framer-motion";
const text1 = "Hi, I'm";
const text2 = "Faizan Amir.";
const text3 = "Full-Stack web developer";
const text4 = "based in pakistan";

function Test() {
  const container = {
    hidden: { opacity: 0, scale: 1 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0,
        staggerChildren: 0,
      },
    },
  };

  const item = {
    hidden: { y: 0, opacity: 0 },
    show: {
      transition: {
        ease: "easeInOut",
        duration: 1,
      },
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      variants={container}
      whileInView="show"
      initial="hidden"
      className="text-left font-bold relative mr-auto text-white w-full h-full min-[500px]:mt-[5rem] mt-[2rem] min-[375px]:text-2xl text-xl min-[600px]:text-4xl  mb-[12rem] ml-10 "
    >
      <motion.div variants={item} className="">
        <motion.span variants={item} className=" absolute top-0 left-0">
          {text1}
        </motion.span>
        <motion.span
          initial={{ opacity: 1, top: 0 }}
          whileInView={{ opacity: 1, top: 33 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          exit={{ opacity: 1, top: 0 }}
          className=" bg-slate-900 text-slate-900  left-0 absolute"
        >
          {text1}
        </motion.span>
      </motion.div>

      <motion.div variants={item} className="font-bold">
        <motion.span variants={item} className="absolute top-10 left-0">
          {text2}
        </motion.span>
        <motion.span
          initial={{ opacity: 1, top: 40 }}
          whileInView={{ opacity: 1, top: 75 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className=" bg-slate-900 text-slate-900 absolute top-10 left-0"
        >
          {text2}
        </motion.span>
      </motion.div>

      <motion.div variants={item} className="">
        <motion.span variants={item} className="absolute top-20 left-0">
          {text3}
        </motion.span>
        <motion.span
          initial={{ opacity: 1, top: 80 }}
          whileInView={{ opacity: 1, top: 115 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className=" bg-slate-900  text-slate-900 absolute top-20 left-0"
        >
          {text3}
        </motion.span>
      </motion.div>

      <motion.div variants={item} className="">
        <motion.span variants={item} className="absolute top-[7.5rem] left-0">
          {text4}
        </motion.span>
        <motion.span
          initial={{ opacity: 1, top: 120 }}
          whileInView={{ opacity: 1, top: 165 }}
          transition={{ duration: 0.8, delay: 2 }}
          className=" bg-slate-900  text-slate-900 absolute top-[5rem] left-0"
        >
          {text4}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

export default Test;
