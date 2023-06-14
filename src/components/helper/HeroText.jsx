import { motion } from "framer-motion";
const text1 = "Hi, I'm";
const text2 = "Faizan Amir.";
const text3 = "Full-Stack web developer";
const text4 = "based in pakistan";

function HeroText() {
  const container = {
    hidden: { opacity: 1, scale: 0 },
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
    hidden: { y: 10, opacity: 0 },
    show: {
      transition: {
        ease: "easeInOut",
        duration: 0.4,
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
      className="text-left min-[600px]:p-[2rem] min-[780px]:p-[5rem] min-[865px]:text-2xl  my-[2rem] uppercase overflow-hidden min-[600px]:leading-[2.5rem]  text-white font-semibold min-[600px]:text-xl min-[865px]:leading-[3rem] text-sm min-[600px]:tracking-widest "
    >
      <div>
        {text1.split(" ").map((char, index) => (
          <motion.span
            style={{ marginRight: "0.5rem" }}
            key={char + "-" + index}
            variants={item}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </div>

      <div>
        {text2.split(" ").map((char, index) => (
          <motion.span
            style={{ marginRight: "0.5rem" }}
            key={char + "-" + index}
            variants={item}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </div>
      <div>
        {text3.split(" ").map((char, index) => (
          <motion.span
            style={{ marginRight: "0.5rem" }}
            key={char + "-" + index}
            variants={item}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </div>
      <div>
        {text4.split(" ").map((char, index) => (
          <motion.span
            style={{ marginRight: "0.5rem" }}
            key={char + "-" + index}
            variants={item}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default HeroText;
