import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "./helper/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import VisibilityIcon from "@mui/icons-material/Visibility";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [mouseEnter, setMouseEnter] = useState(null);

  const handleMouseEnter = ({ projectId }) => {
    setMouseEnter(() => projectId);
  };
  const handleMouseLeave = () => {
    setMouseEnter(null);
  };

  const url =
    "https://api.github.com/users/MianFaizanAmir0053/repos?sort=created";
  useEffect(() => {
    axios.get(url).then((response) => {
      setProjects(() => {
        console.log(projects);
        return response.data.filter((project) => project.homepage);
      });
    });
  }, []);

  return (
    <section id="Portfolio" className="pt-2">
      <h1 className="text-2xl py-4 tracking-widest text-white font-bold text-center">
        Portfolio
      </h1>
      <div className=" text-slate-200  w-full h-full relative p-8 rounded-sm  ">
        <motion.div className="grid w-full h-full  grid-cols-1 min-[620px]:grid-cols-2 grid-rows-2 gap-4 ">
          {projects.map((project, i) => (
            <motion.div
              onMouseEnter={() => handleMouseEnter({ projectId: project.id })}
              onMouseLeave={handleMouseLeave}
              key={i}
              initial={{ scale: 1 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2, ease: "easeIn" },
              }}
              className=" relative p-[0.1rem] bg-no-repeat bg-cover bg-center min-[430px]:p-4  min-[620px]:text-md min-[728px]:text-lg   hover:border-[rgba(30,41,59,.5)] hover:bg-[rgba(30,41,59,.5)] transition-[background-color] w-full cursor-pointer rounded-md h-full flex flex-col justify-center items-center"
              layoutId={project.id}
              onClick={() => {
                setSelectedId(project.id);
              }}
            >
              <div className="flex relative min-[620px]:text-md min-[728px]:text-lg px-2 pt-2 mb-4 w-full  items-center ">
                <motion.h1 className="transition-all hover:underline hover:text-teal-500 font-semibold tracking-wider">
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

              {mouseEnter === project.id && (
                <motion.div className=" bg-slate-900/70 m-auto w-full h-full absolute">
                  <motion.div className=" top-[calc(50%-1rem)] left-[calc(50%-5rem)] absolute">
                    <motion.a
                      href={project?.clone_url}
                      target="_blank"
                      className="flex items-center hover:text-teal-500 hover:underline"
                    >
                      <GitHubIcon />
                      <Button text="source code" />
                    </motion.a>

                    <motion.a
                      href={project?.homepage}
                      target="_blank"
                      className="flex items-center hover:text-teal-500 hover:underline"
                    >
                      <VisibilityIcon />
                      <Button text="view live" />
                    </motion.a>
                  </motion.div>
                </motion.div>
              )}

              <div className="flex  min-[620px]:text-md min-[728px]:text-lg text-[rgba(94,234,212,1)]  min-[820px]:mt-8 flex-wrap w-full h-full">
                {project.topics.map((topic, i) => (
                  <motion.p
                    key={i}
                    className="px-2  min-[720px]:m-2 min-[620px]:px-4 min-[620px]:py-2 flex-auto text-center self-center py-1 m-1 bg-[rgba(45,212,191,.2)]  text-xs rounded-3xl"
                  >
                    {topic}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Projects;
