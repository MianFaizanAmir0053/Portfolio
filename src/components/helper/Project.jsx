import GitHubIcon from "@mui/icons-material/GitHub";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";

function Project({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.3 }}
      className="py-4 my-4 px-4 text-white flex min-[930px]:flex-row flex-col items-center justify-center hover:bg-[rgba(30,41,59,.5)] transition-[background-color] cursor-pointer rounded"
    >
      <img
        className="w-[500px] h-[300px] object-contain"
        src={`https://raw.githubusercontent.com/MianFaizanAmir0053/${
          project.name
        }/${project.default_branch}/${project.name.toLowerCase()}.png`}
        alt=""
      />
      <div className="flex min-[570px]:ml-10 flex-col max-w-lg px-6 items-center justify-center">
        <motion.div className="flex relative min-[570px]:text-md min-[728px]:text-lg  text-sm pt-2 w-full  items-center ">
          <h1 className="transition-all text-white line-clamp-1 hover:underline hover:text-teal-500 font-semibold tracking-wider">
            {project.name}
          </h1>
          <div className="ml-2 w-2">
            <img className="w-full" src="up-right-arrow.png" alt="" />
          </div>
        </motion.div>
        <p className="z-10 py-4 text-sm min-[728px]:text-base">
          {project.description}
        </p>

        <div className="z-10 flex min-[570px]:justify-start min min-[930px]:mt-4 min-[570px]:text-left w-full pt-2 pb-4">
          <a
            href={project?.clone_url}
            target="_blank"
            className="w-fit flex items-center hover:text-teal-500 hover:underline"
          >
            <GitHubIcon className="pl-1" />
            <Button text="source code" />
          </a>
          <a
            href={project?.homepage}
            target="_blank"
            className="w-fit ml-4 flex items-center hover:text-teal-500 hover:underline"
          >
            <VisibilityIcon className="pl-1" />
            <Button text="view live" />
          </a>
        </div>

        <div className="z-10 mt-2 justify-start w-full  flex min-[520px]-mt-2  min-[570px]:text-md text-[rgba(94,234,212,1)] min-[820px]:mt-4 flex-wrap">
          {project.topics.map((topic, i) => (
            <p
              key={i}
              className="px-3 font-semibold py-1 min-[570px]:px-3 min-[570px]:py-1 min-[570px]:text-base text-xs text-center self-center min-[520px]-py-1 mr-1 my-1 bg-[rgba(45,212,191,.2)]  rounded-3xl"
            >
              {topic}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default Project;
