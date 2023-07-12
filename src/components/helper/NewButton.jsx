import { motion } from "framer-motion";
import { useState } from "react";

function NewButton({ text1, text2, href, target }) {
  const [mouseEnter, setMouseEnter] = useState(false);
  const [mouseLeave, setMouseLeave] = useState(false);

  const handleMouseEnter = () => {
    setMouseEnter(true);
    setMouseLeave(false);
  };
  const handleMouseLeave = () => {
    setMouseEnter(false);
    setMouseLeave(true);
  };

  return (
    <motion.a
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer text-center relative overflow-hidden w-fit text-white flex flex-col"
      href={`${href ? href : "#Contact"}`}
      target={target}
    >
      <motion.div className="px-4 py-2 font-extralight text-white tracking-wider rounded border border-slate-600">
        <p>{text1}</p>
      </motion.div>
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: mouseEnter ? 0 : 60 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute w-full border border-teal-900 text-teal-300 bg-teal-900 py-2 font-semibold rounded"
      >
        <h3>{text2}</h3>
      </motion.div>
    </motion.a>
  );
}

export default NewButton;
