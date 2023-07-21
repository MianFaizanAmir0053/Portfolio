import EmailForm from "./EmailForm";
import Footer from "./Footer";
import GetToKnow from "./GetToKnow";
import HeaderSection from "./HeaderSection";
import Navbar from "./Navbar";
import Navbar1 from "./Navbar1";
import Projects from "./Projects";
import TimeLine from "./TimeLine";

function Home() {
  return (
    <div className="relative block mx-auto bg-gradient-to-b from-slate-900 to-slate-900  overflow-x-hidden">
      <Navbar />
      <Navbar1 />
      <div className="mx-auto pt-[3rem] min-[500px]:pt-[1rem] max-w-4xl">
        <HeaderSection />
        <GetToKnow />
        <TimeLine />
        <Projects />
        <EmailForm />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
