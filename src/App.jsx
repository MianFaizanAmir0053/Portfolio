import EmailForm from "./components/EmailForm";
import Footer from "./components/Footer";
import GetToKnow from "./components/GetToKnow";
import HeaderSection from "./components/HeaderSection";
import Navbar from "./components/Navbar";
import Navbar1 from "./components/Navbar1";
import Projects from "./components/Projects";
import TimeLine from "./components/TimeLine";

function App() {
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

export default App;
