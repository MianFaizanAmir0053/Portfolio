import { useState } from "react";
import About from "./About";
import TechIcons from "./TechIcons";

function GetToKnow() {
  const [select, setSelect] = useState("about");

  return (
    <section id="About">
      <div className="flex text-xl  font-extrabold pt-[5rem] cursor-pointer justify-center text-white items-center">
        <div
          className={` border-b-2 px-4 py-2 hover:text-teal-500 ${
            select === "about" && "border-b-teal-500  text-teal-500"
          }`}
          onClick={() => setSelect(() => "about")}
        >
          About
        </div>
        <div
          className={`ml-1 cursor-pointer border-b-2 px-4 py-2 hover:text-teal-500  ${
            select === "tech" && "border-b-teal-500 text-teal-500"
          }`}
          onClick={() => setSelect(() => "tech")}
        >
          Skills
        </div>
      </div>

      {select === "tech" ? <TechIcons /> : <About />}
    </section>
  );
}

export default GetToKnow;
