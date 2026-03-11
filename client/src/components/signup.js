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

  let missingFields = [];

  if(!user.firstName) missingFields.push("First Name");
  if(!user.lastName) missingFields.push("Last Name");
  if(!user.username) missingFields.push("Username");
  if(!user.age) missingFields.push("Age");
  if(!user.dob) missingFields.push("Date of Birth");
  if(!user.email) missingFields.push("Email");
  if(!user.password) missingFields.push("Password");

  if(missingFields.length > 0){

    alert("⚠️ Please fill the following fields:\n\n" + missingFields.join("\n"));

    return;
  }

  try {

    const response = await axios.post("https://car-rental-system.onrender.com/signup", user);

    alert("✅ Signup Successful\n✔ Account Created Successfully");

    goLogin();

  } catch (error) {

    alert("⚠️ " + error.response.data.message);

  }

};

  return (

    <div className="container">

      <h2>Create Account</h2>

      <input name="firstName" placeholder="First Name" onChange={handleChange} />
      <input name="lastName" placeholder="Last Name" onChange={handleChange} />
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input name="age" placeholder="Age" onChange={handleChange} />
      <input name="dob" type="date" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <button onClick={handleSignup}>Sign Up</button>

      <p>
        Already have an account ?
        <span onClick={goLogin}> Login</span>
      </p>

    </div>

  );
}

export default Signup;