import FlipCard from "./FlipCard";

function AllFlipCards() {
  const data = [
    {
      Front: "About",
      Back: "Hi, I’m Sharjeel Yunus, a Software Engineer, React - NextJS developer and a Technical Writer. I’m a former Google DSC Lead and also worked with multiple tech communities. I’m currently pursuing Computer Science Major at The Islamia University of Bahawalpur 💻 Software Engineer ",
    },

    {
      Front: "Contact",
      Back: "Contact Back",
    },
  ];

  const Result = data.map((item) => {
    return <FlipCard Front={item.Front} Back={item.Back} />;
  });
  return <div className="flex justify-between">{Result}</div>;
}

export default AllFlipCards;
