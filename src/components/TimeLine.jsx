function TimeLine() {
  return (
    <div class="w-10/12  md:w-7/12 lg:6/12 mx-auto relative min-[720px]:text-base text-sm py-20">
      <h1 class="text-2xl text-center font-bold text-white">Experience </h1>
      <div class="border-l-2 mt-10">
        {/* <!-- Card 1 --> */}
        <div class="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-slate-600 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">
          {/* <!-- Dot Follwing the Left Vertical Line --> */}
          <div class="w-5 h-5 bg-teal-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

          {/* <!-- Line that connecting the box with the vertical line --> */}
          <div class="w-10 h-1 bg-slate-300 absolute -left-10 z-0"></div>

          {/* <!-- Content that showing in the box --> */}
          <div class="flex-auto">
            {/* <h1 class="text-lg">Experience</h1> */}
            <div className="flex justify-between items-baseline ">
              <h1 class="text-xl font-bold">NextJs Inter</h1>
              <p className="text-teal-400 ">Remote</p>
            </div>
            <h3 className=" text-slate-300">Bytewise Limited</h3>
            <p>Mar 2023 - Present · 6 mos</p>
            <ul className="list-disc">
              <li>
                Developing and implementing React + Next.js components, pages,
                and applications.
              </li>
              <li>
                Writing clean, efficient, and well-documented code using best
                practices.
              </li>
              <li>Learning and growing as part of the Bytewise team.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TimeLine;
