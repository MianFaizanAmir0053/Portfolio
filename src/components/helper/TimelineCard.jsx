import { motion } from "framer-motion";

const TimelineCard = ({ title, company, date, description, i }) => {
  return (
    <motion.div
      initial={{ right: -30, opacity: 0 }}
      whileInView={{ right: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: i * 0.3 }}
      class="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-slate-800 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0"
    >
      {/* <!-- Dot Follwing the Left Vertical Line --> */}
      <div class="w-5 h-5 bg-teal-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

      {/* <!-- Line that connecting the box with the vertical line --> */}
      <div class="w-10 h-1 bg-slate-300 absolute -left-10 z-0"></div>

      {/* <!-- Content that showing in the box --> */}
      <div class="flex-auto">
        {/* <h1 class="text-lg">Experience</h1> */}
        <div className="flex justify-between items-baseline ">
          <h1 class="text-xl font-bold">{title}</h1>
          {/* <p className="text-teal-400 ">Remote</p> */}
        </div>
        <h3 className=" text-slate-300">{company}</h3>
        <p>{date}</p>
        <ul className="list-disc">
          {description.map((desc) => (
            <li className="text-slate-300">{desc}</li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default TimelineCard;
