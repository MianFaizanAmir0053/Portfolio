import NewButton from "./helper/NewButton";

function Navbar() {
  return (
    <div className="block fixed p-1  backdrop-blur-lg w-full z-50">
      <div className="w-[8rem]">
        <img className="w-full h-ful" src="name-logo-removebg.png" alt="" />
      </div>
      <div className="min-[600px]:text-sm text-xs top-0 pt-[1.25rem] right-0  justify-between text-white rounded-full  min-[600px]:right-0 fixed pr-2">
        <NewButton text1={"faizanamir0053@gmail.com"} text2={"Let's connect"} />
      </div>
    </div>
  );
}

export default Navbar;
