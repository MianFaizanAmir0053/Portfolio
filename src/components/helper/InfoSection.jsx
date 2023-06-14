import { motion } from "framer-motion";

function InfoSection() {
  const container = {
    hidden: { opacity: 1, scale: 0 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { x: -10, y: 5, opacity: 0 },
    show: {
      transition: {
        ease: "easeInOut",
        duration: 0.4,
      },
      x: 0,
      y: 0,
      opacity: 1,
    },
  };

  const text =
    "Highly skilled at progressive enhancement, design systems & UI Engineering.";
  const text2 =
    "Proven experience building successful products for clients across several countries.";
  return (
    <div className="flex  justify-center w-full mt-[1rem] flex-col">
      <motion.div
        variants={container}
        whileInView="show"
        initial="hidden"
        className=" font-light justify-center  w-full max-[600px]:w-[18rem] max-[600px]:mx-[auto]  max-[600px]:text-right max-[600px]:flex-col  flex my-6"
      >
        <div className=" text-xs min-[600px]:text-sm text-white ">
          {text.split(" ").map((char, index) => (
            <motion.p
              style={{ marginRight: "0.5rem" }}
              key={char + "-" + index}
              variants={item}
              className="inline-block"
            >
              {char}
            </motion.p>
          ))}
        </div>

        <div className=" text-xs min-[600px]:text-sm text-white  ">
          {text2.split(" ").map((char, index) => (
            <motion.p
              style={{ marginRight: "0.5rem" }}
              key={char + "-" + index}
              variants={item}
              className="inline-block"
            >
              {char}
            </motion.p>
          ))}
        </div>
      </motion.div>

      <motion.div className=" flex justify-center">
        <motion.img
          initial={{ opacity: 1, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            duration: 0.8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
          src="arrow-final.png"
          className="w-8"
          alt=""
        />
      </motion.div>
    </div>
  );
}

export default InfoSection;
