import EmailForm from "./components/EmailForm";
import HeaderSection from "./components/HeaderSection";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import TechIcons from "./components/TechIcons";
import TimeLine from "./components/TimeLine";

function App() {
  return (
    <div className="block mx-auto bg-gradient-to-b from-slate-900 to-slate-900  overflow-x-hidden">
      <Navbar />
      <div className="mx-auto pt-[3rem] min-[500px]:pt-[1rem] max-w-4xl">
        <HeaderSection />
        <TechIcons />

        {/* <AllFlipCards /> */}
        <TimeLine />
        <Projects />
        <EmailForm />
      </div>
    </div>
  );
}

export default App;
