import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const notify = (msg) => toast(msg);

  const registerUser = async (ev) => {
    ev.preventDefault(); // Prevent default form submission

    try {
      if (!name || !email || !password) {
        notify("Please fill all the fields");
        return;
      }

      const response = await axios.post("/user/register", {
        name,
        email,
        password,
      });

      console.log(response.data);
      notify("User created successfully");
      navigate("/Login"); // Redirect to login page after successful registration
    } catch (err) {
      console.error(err);
      notify("User already exists or registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-2">
      <h1 className="text-6xl text-center mb-4 text-white">REGISTER</h1>
      <form action="" className="max-w-xl mx-auto" onSubmit={registerUser}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button
          type="submit"
          className="bg-[#F5385D] p-2 w-full text-white rounded-2xl"
        >
          Register
        </button>
        <div className="text-center py-2 text-gray-100">
          Already a member?{" "}
          <Link className="underline text-white" to={"/Login"}>
            Login Now
          </Link>{" "}
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
