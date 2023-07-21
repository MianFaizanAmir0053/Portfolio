import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "./helper/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const url =
    "https://api.github.com/users/MianFaizanAmir0053/repos?sort=created";
  useEffect(() => {
    axios.get(url).then((response) => {
      setProjects(() =>
        response.data.filter((project) => project.homepage).slice(0, 4)
      );
    });
  }, []);

  return (
    <section id="Portfolio" className="min-[570px]:py-[7rem] py-[4rem]">
      <h1 className="text-3xl mb-8 min-[570px]:py-4 text-white  font-extrabold text-center">
        Latest Projects
      </h1>
      <div className=" text-slate-200 pt-6 w-full h-full relative p-1 min-[570px]:p-8 rounded-sm">
        <motion.div className="grid w-full h-full  grid-cols-2 min-[570px]:grid-cols-2 grid-rows-2 gap-4 ">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ scale: 1 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2, ease: "easeIn" },
              }}
              className=" relative p-[0.1rem] bg-no-repeat bg-cover bg-center min-[430px]:p-4  min-[570px]:text-md min-[728px]:text-lg  hover:border-[rgba(30,41,59,.5)] hover:bg-[rgba(30,41,59,.5)] transition-[background-color] w-full cursor-pointer rounded-md h-full flex flex-col justify-center items-center"
              layoutId={project.id}
              onClick={() => {
                setSelectedProject(project);
                setSelectedId(project.id);
              }}
            >
              <div className="flex relative min-[570px]:text-md min-[728px]:text-lg  text-sm px-2 pt-2 mb-4 w-full  items-center ">
                <motion.h1 className="transition-all line-clamp-1 hover:underline hover:text-teal-500 font-semibold tracking-wider">
                  {project.name}
                </motion.h1>
                <motion.div className="ml-2 w-2">
                  <img className="w-full" src="up-right-arrow.png" alt="" />
                </motion.div>
              </div>

              <div>
                <img
                  className="w-full h-full object-cover"
                  src={`https://raw.githubusercontent.com/MianFaizanAmir0053/${
                    project.name
                  }/${
                    project.default_branch
                  }/${project.name.toLowerCase()}.png`}
                  alt=""
                />
              </div>
            </motion.div>
          ))}

          <AnimatePresence>
            {selectedId && (
              <motion.div
                layoutId={selectedId}
                className="absolute flex flex-col justify-between left-[0%] p-2 min-[570px]:p-6 min-[570px]:top-[calc(24%)] min-[570px]:left-[calc(12%)] top-[0%] bg-slate-800 overflow-y-auto min-[570px]:w-[75%] min-[570px]:h-[60%] h-[100%] w-[100%]"
              >
                <div
                  onClick={() => setSelectedId(null)}
                  className=" z-10 fixed top-0 left-0 h-[100%] w-[100%]"
                />

                <h1 className="z-10  transition-all hover:underline hover:text-teal-500 font-semibold tracking-wider">
                  {selectedProject?.name}
                </h1>
                <p className="z-10  py-4 text-sm min-[728px]:text-base">
                  {selectedProject?.description}
                </p>

                <div className="z-10  flex justify-evenly pb-2">
                  <a
                    href={selectedProject?.clone_url}
                    target="_blank"
                    className="w-fit flex items-center hover:text-teal-500 hover:underline"
                  >
                    <GitHubIcon />
                    <Button text="source code" />
                  </a>

                  <a
                    href={selectedProject?.homepage}
                    target="_blank"
                    className="w-fit flex items-center hover:text-teal-500 hover:underline"
                  >
                    <VisibilityIcon />
                    <Button text="view live" />
                  </a>
                </div>
                <div className="z-10  flex min-[520px]-mt-2  min-[570px]:text-md text-[rgba(94,234,212,1)] min-[820px]:mt-4 flex-wrap">
                  {selectedProject.topics.map((topic, i) => (
                    <p
                      key={i}
                      className="px-1 min-[720px]:m-2 min-[570px]:px-2 min-[570px]:py-1 text-xs flex-auto text-center self-center min-[520px]-py-1 m-1 bg-[rgba(45,212,191,.2)]  rounded-3xl"
                    >
                      {topic}
                    </p>
                  ))}
                </div>
                <button
                  className=" w-7 z-20 absolute top-1 right-1"
                  onClick={() => setSelectedId(null)}
                >
                  <img
                    className=" w-full h-full object-cover"
                    src="close.png"
                    alt=""
                  />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <div className="flex mt-4 justify-center">
        <Link
          to={"/projects"}
          className="text-sm uppercase w-fit flex min-[570px]:text-base transition-[all] cursor-pointer ml-2 items-center hover:text-teal-500 hover:underline text-white"
        >
          See All
          <img className="w-3 h-3 ml-2" src="up-right-arrow.png" alt="" />
        </Link>
      </div>
    </section>
  );
}

export default Projects;

//  {
//    mouseEnter === project.id && (
//      <motion.div className=" bg-slate-900/70 m-auto w-full h-full absolute">
//        <motion.div className=" top-[calc(50%-1rem)] left-[calc(50%-5rem)] absolute">
//          <motion.a
//            href={project?.clone_url}
//            target="_blank"
//            className="flex items-center hover:text-teal-500 hover:underline"
//          >
//            <GitHubIcon />
//            <Button text="source code" />
//          </motion.a>

//          <motion.a
//            href={project?.homepage}
//            target="_blank"
//            className="flex items-center hover:text-teal-500 hover:underline"
//          >
//            <VisibilityIcon />
//            <Button text="view live" />
//          </motion.a>
//        </motion.div>
//      </motion.div>
//    );
//  }
