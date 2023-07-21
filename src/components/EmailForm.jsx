import emailjs from "emailjs-com";
import { Formik, Form, Field } from "formik";
import { motion } from "framer-motion";
import { useState } from "react";
import NewButton from "./helper/NewButton";

function EmailForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: name,
      from_email: email,
      to_name: "Faizan Amir",
      message: message,
    };

    console.log(templateParams);
    emailjs
      .send(
        "service_u0g7ujt",
        "template_4xc95xp",
        templateParams,
        "oxm7yZQQohuXVrFlg"
      )
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
          setEmail("");
          setName("");
          setMessage("");
        },
        function (error) {
          console.log("FAILED...", error);
        }
      );
  };

  return (
    <section
      id="Contact"
      className=" min-h-[100vh] py-[5rem] max-w-sm px-8  min-[1000px]:max-w-2xl mx-auto text-center text-lg bg-sl-200 text-white"
    >
      <h5 className="text-md min-[600px]:text-2xl font-semibold">
        Get in Touch
      </h5>
      <h2 className="text-3xl tracking-wide min-[600px]:text-4xl font-extrabold text-teal-500 pb-12">
        Contact Me
      </h2>
      <div className="flex flex-col min-[1000px]:gap-12 min-[1000px]:justify-between   min-[1000px]:flex-row">
        <div className="">
          <article className="border-2 py-4 px-6 font-bold min-[600px]:text-md text-sm border-slate-700 bg-slate-700  rounded">
            <h4>Email</h4>
            <h5>faizanamir0053@gmail.com</h5>
            <a
              target="_blank"
              className="font-normal text-teal-500"
              href="mailto:faizanamir0053@gmail.com"
            >
              Send a Message
            </a>
          </article>
          <article className="border-2 min-[600px]:text-md text-sm border-slate-700 bg-slate-700 py-4 px-6 my-4 rounded ">
            <h4 className="font-bold">WhatsApp</h4>
            <h5 className="font-bold">+92 303 0649009</h5>
            <a
              target="_blank"
              className=" text-teal-500"
              href="https://wa.me/+923030649009"
            >
              Send a Message
            </a>
          </article>
        </div>

        <Formik initialValues={{ name: "", email: "" }}>
          <Form
            onSubmit={handleSubmit}
            className="flex w-full  min-[600px]:text-md text-sm justify-between text-center flex-col"
          >
            <Field
              type="text"
              name="name"
              placeholder="Your Full Name"
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800   rounded py-4 px-4"
              required="true"
              value={name}
            />
            <Field
              type="email"
              name="email"
              placeholder="Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800 my-4 rounded py-4 px-4"
              required="true"
              value={email}
            />
            <Field
              name="message"
              as="textarea"
              rows="5"
              placeholder="Your Message"
              onChange={(e) => setMessage(e.target.value)}
              required="true"
              className="bg-slate-800 rounded py-4 px-4"
              value={message}
            />
            <motion.button type="submit" className="mt-4">
              <NewButton
                href={"#"}
                text1={"Let's connect"}
                text2={"Send Message"}
              />
            </motion.button>
          </Form>
        </Formik>
      </div>
    </section>
  );
}

export default EmailForm;
