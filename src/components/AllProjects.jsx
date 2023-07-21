import axios from "axios";
import { useEffect, useState } from "react";
import Project from "./helper/Project";

function AllProjects() {
  const [projects, setProjects] = useState([]);

  const url =
    "https://api.github.com/users/MianFaizanAmir0053/repos?sort=created";
  useEffect(() => {
    axios.get(url).then((response) => {
      setProjects(() => response.data.filter((project) => project.homepage));
    });
  }, []);
  return (
    <section>
      <h1 className="mt-[4.5rem] min-[570px]:text-3xl text-2xl mb-4 min-[570px]:py-4 text-white  font-extrabold text-center">
        All Projects
      </h1>
      <div>
        {projects.map((project, i) => (
          <Project key={i} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}

export default AllProjects;
