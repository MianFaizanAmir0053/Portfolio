import Test from "./Test";
import HeroImg from "./helper/HeroImg";
import HeroText from "./helper/HeroText";
import InfoSection from "./helper/InfoSection";

function HeaderSection() {
  return (
    <div className="text-center flex flex-col mt-6 h-[auto]">
      <div className="flex justify-between min-[600px]:flex-row flex-col  border-l-lime-300 border-l items-center">
        <HeroText />
        {/* <Test /> */}
        <HeroImg />
      </div>
      <InfoSection />
    </div>
  );
}

export default HeaderSection;
