import { motion } from "framer-motion";

function TechIcons() {
  const icons = [
    "nextjs",
    "tailwind",
    "react",
    "node-js",
    "express-js",
    "mongodb",
    "redux",
    "git",
    "css",
    "javascript",
    "typescript",
    "postgresql",
    "github",
    "firebase",
    "sass",
    "postman",
  ];

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: {
      y: 10,
      opacity: 0,
      clipPath: "circle(0.0% at 50% 50%)",
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
      clipPath: "circle(100.0% at 50% 50%)",
    },
  };

  return (
    <div className="my-[10rem]">
      <div className=" text-2xl text-center font-bold tracking-widest my-[4rem] pt-8 text-gray-100">
        <h1>Skills</h1>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        className="flex flex-wrap items-center justify-center border-l border-r border-r-green-400  border-l-green-400"
      >
        {icons.map((icon, i) => (
          <motion.div
            variants={item}
            key={Math.random()}
            className="text-center text-sm py-2 uppercase"
          >
            <div
              key={Math.random()}
              className={`${
                i % 2 == 0 ? " bg-slate-200" : "bg-slate-800"
              } m-2 rounded p-4 `}
            >
              <img
                src={`${icon}.png`}
                alt={icon}
                className="
               max-sm:h-6
               max-sm:w-6
               h-12
               w-12
              object-contain
              object-center
              "
              />
            </div>

            <div className=" text-gray-200">
              <p>{icon}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

export default TechIcons;
