function Button({ link, text }) {
  return (
    <div>
      <a
        src={link}
        className="btn btn-primary transition-[all] cursor-pointer text-white hover:text-teal-500 hover:underline"
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
