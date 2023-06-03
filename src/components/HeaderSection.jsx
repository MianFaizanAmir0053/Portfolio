import HeroImg from "./helper/HeroImg";
import HeroText from "./helper/HeroText";
import InfoSection from "./helper/InfoSection";

function HeaderSection() {
  return (
    <div className="text-center flex flex-col justify-evenly mt-[7rem] h-[100vh]">
      <div className="flex justify-between min-[600px]:flex-row flex-col  border-l-lime-300 border-l items-center">
        <HeroText />
        <HeroImg />
      </div>
      <InfoSection />
    </div>
  );
}

export default HeaderSection;
