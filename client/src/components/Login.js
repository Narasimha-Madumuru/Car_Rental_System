import React, { useState } from "react";
import axios from "axios";

function Login({ showSignup }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const response = await axios.post("https://car-rental-system-bd19.onrender.com/login", {
        username: username,
        password: password
      });

      alert("✅ Login Successful");

    } catch (error) {

  if (error.response) {

    const message = error.response.data.message;

    if (message === "Invalid Username") {
      alert("⚠️ Invalid Username");
    }

    else if (message === "Invalid Password") {
      alert("⚠️ Invalid Password");
    }

    else {
      alert("❌ Login Failed");
    }

  } else {

    alert("⚠️ Server not responding");

  }

}

    setUsername("");
    setPassword("");

  };

  return (

    <div className="container">

      <h2>Car Rental System</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      <p>
        New user ?
        <span onClick={showSignup}> Sign Up</span>
      </p>

    </div>

  );

}

export default Login;