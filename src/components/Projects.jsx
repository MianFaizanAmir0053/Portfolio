import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Button from "./helper/Button";
// import useFetchProjects from "./custom-hooks/useFetchProjects";

function Projects() {
  // const [projects, loading, error] = useFetchProjects();
  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;
  // console.log(projects);
  const [projects, setProjects] = useState([]);
  const [clicked, setClicked] = useState(false);

  const url =
    "https://api.github.com/users/MianFaizanAmir0053/repos?sort=created";

  useEffect(() => {
    axios.get(url).then((response) => {
      setProjects(
        () => response.data.filter((project) => project.homepage !== null)
        // response.data.slice(0, 4)
      );
    });
  }, []);

  const [selectedId, setSelectedId] = useState(null);
  const [filtered, setFiltered] = useState(null);
  useEffect(() => {
    setFiltered(projects.filter((project) => project.id === selectedId));
    setClicked((pre) => !pre);
  }, [selectedId]);

  return (
    <div className=" text-slate-200  w-full h-full relative p-8 rounded-sm  ">
      <motion.div className="grid w-full h-full  grid-cols-2 grid-rows-2 gap-4 ">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ scale: 1 }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.2, ease: "easeInOut" },
            }}
            className="p-[0.1rem] bg-[url('/tesla1.png')]   bg-no-repeat bg-cover bg-center min-[430px]:p-4  min-[620px]:text-md min-[728px]:text-lg  border border-[rgba(30,41,59,1)] hover:border-[rgba(30,41,59,.5)] hover:bg-[rgba(30,41,59,.5)] transition-[background-color] w-full cursor-pointer rounded-md h-full flex flex-col justify-center items-center"
            layoutId={project.id}
            onClick={() => {
              setSelectedId(project.id);
            }}
          >
            <span className="flex  min-[620px]:text-md min-[728px]:text-lg px-2 pt-2 mb-4 w-full  items-center ">
              <motion.h1 className=" transition-all hover:underline hover:text-teal-500 font-semibold tracking-wider">
                {project.name}
              </motion.h1>
              <motion.div className="ml-2 w-2">
                <img className="w-full" src="up-right-arrow.png" alt="" />
              </motion.div>
            </span>

            <div className="flex  min-[620px]:text-md min-[728px]:text-lg text-[rgba(94,234,212,1)]  min-[820px]:mt-8 flex-wrap w-full h-full">
              {project.topics.map((topic) => (
                <motion.p className="px-2  min-[720px]:m-2 min-[620px]:px-4 min-[620px]:py-2 flex-auto text-center self-center py-1 m-1 bg-[rgba(45,212,191,.2)]  text-xs rounded-3xl">
                  {topic}
                </motion.p>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedId && (
          <motion.div className="z-10 p-[3rem] min-[720px]:text-lg text-sm min-[620px]:p-[6rem] min-[440px]:p-[4rem]  absolute top-0 left-0 right-0 bottom-0  w-full h-full">
            <motion.div
              className=" bg-slate-800 py-4 pr-4  rounded-lg w-full h-full grid grid-cols-12 grid-rows-6 "
              onClick={() => setSelectedId(null)}
              layoutId={selectedId}
            >
              <motion.h1 className="col-[2/12] pt-4 text-teal-500 row-[1/2] font-semibold tracking-wider">
                {filtered[0]?.name}
              </motion.h1>
              <motion.p className="col-[2/13] row-[2/5]">
                {filtered[0]?.description}
              </motion.p>
              <motion.div className=" col-[2/12] row-[6/6] text-[rgba(94,234,212,1)] ">
                <Button link={filtered[0]?.clone_url} text="source code" />
              </motion.div>
              <motion.div className="col-[2/12] row-[7/7]  text-[rgba(94,234,212,1)] ">
                <Button link={filtered[0]?.homepage} text="view live" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Projects;
