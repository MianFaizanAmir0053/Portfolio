import React from "react";
import "../../App.css";
import Svg2 from "./Svg2";
import Svg3 from "./Svg3";
import Svg4 from "./Svg4";
import { motion } from "framer-motion";
function HeroImg() {
  const container = {
    hidden: { opacity: 1, scale: 0 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.5,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: {
      opacity: 0,
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)",
      // clipPath: "circle(0.0% at 50% 50%)",
    },
    show: {
      transition: {
        ease: "easeInOut",
        duration: 1.5,
      },
      clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 0)",
      // clipPath: "circle(100.0% at 50% 50%)",
      opacity: 1,
    },
  };

  return (
    <div className="relative ">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        className="flex max-w-[18rem] rounded-sm w-[auto] clip  bg-gradient-to-br from-gray-700 to-gray-500"
      >
        <motion.img
          variants={item}
          className=" w-full h-full z-[1]"
          src="myself.png"
          alt="myself"
        />
      </motion.div>
      <div className="w-1 h-1">
        <Svg3 />
      </div>
      <div className="w-1 h-1">
        <Svg2 />
      </div>
      <div className="w-1 h-1">
        <Svg4 />
      </div>
    </div>
  );
}

export default HeroImg;
