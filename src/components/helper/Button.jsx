function Button({ link, text }) {
  return (
    <div className=" text-sm">
      <a
        target="_blank"
        href={link}
        className="text-xs min-[570px]:text-sm transition-[all] cursor-pointer ml-2 items-center flex"
      >
        {text}
        <img
          className="w-3 h-3 ml-2 inline-block"
          src="up-right-arrow.png"
          alt=""
        />
      </a>
    </div>
  );
}

export default Button;
