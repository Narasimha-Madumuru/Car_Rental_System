import React, { useState } from "react";
import axios from "axios";

function Signup({ goLogin }) {

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    age: "",
    dob: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {

    try {

      const response = await axios.post(
        "https://car-rental-system-bd19.onrender.com/signup",
        user
      );

      alert(response.data.message);

      if (response.data.message === "✅ Signup Successful") {
        goLogin();
      }

    } catch (error) {

      alert("⚠️ Server not responding");

    }

  };

  return (

    <div className="container">

      <h2>Create Account</h2>

      <input name="firstName" placeholder="First Name" onChange={handleChange}/>
      <input name="lastName" placeholder="Last Name" onChange={handleChange}/>
      <input name="username" placeholder="Username" onChange={handleChange}/>
      <input name="age" placeholder="Age" onChange={handleChange}/>
      <input name="dob" type="date" onChange={handleChange}/>
      <input name="email" placeholder="Email" onChange={handleChange}/>
      <input name="password" type="password" placeholder="Password" onChange={handleChange}/>

      <button onClick={handleSignup}>Sign Up</button>

      <p>
        Already have an account ? <span onClick={goLogin}>Login</span>
      </p>

    </div>

  );
}

export default Signup;