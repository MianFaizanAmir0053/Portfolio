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
        delayChildren: 0.1,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { y: 0, opacity: 0 },
    show: {
      transition: {
        ease: "easeInOut",
        duration: 0.3,
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
      className="text-left relative min-[600px]:p-[2rem]  min-[780px]:p-[5rem] min-[865px]:text-2xl  my-[2rem] uppercase overflow-hidden min-[600px]:leadin-[2.5rem]  text-white font-semibold min-[600px]:text-xl text-sm min-[600px]:tracking-widest "
    >
      <motion.div variants={item} className="">
        <motion.span variants={item} className="absolute top-0 left-0">
          {text1}
        </motion.span>
        <motion.span
          initial={{ opacity: 1, top: 0 }}
          whileInView={{ opacity: 1, top: 30 }}
          transition={{ duration: 2 }}
          className=" bg-slate-900 text-slate-900 absolute top-10 left-0"
        >
          {text1}
        </motion.span>
      </motion.div>

      <motion.div variants={item} className="">
        <motion.span variants={item} className="absolute top-10 left-0">
          {text2}
        </motion.span>
        <motion.span
          initial={{ opacity: 1, top: 30 }}
          whileInView={{ opacity: 1, top: 90 }}
          transition={{ duration: 2.3 }}
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
          initial={{ opacity: 1, top: 70 }}
          whileInView={{ opacity: 1, top: 130 }}
          transition={{ duration: 2.9 }}
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
          initial={{ opacity: 1, top: 107 }}
          whileInView={{ opacity: 1, top: 160 }}
          transition={{ duration: 3.3 }}
          className=" bg-slate-900  text-slate-900 absolute top-[5rem] left-0"
        >
          {text4}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

export default Test;
