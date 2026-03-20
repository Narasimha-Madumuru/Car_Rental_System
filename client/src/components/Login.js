import React, { useState } from "react";
import axios from "axios";

function Login({ showSignup }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // ✅ NEW STATES
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const handleLogin = async () => {

    try {

      const response = await axios.post("https://car-rental-system-bd19.onrender.com/login", {
        username,
        password
      });

      const msg = response.data.message;

      // ✅ REPLACED ALERTS WITH UI MESSAGE
      if (msg === "Login Successful") {
        setMessage("✅ Login Successful 🎉");
        setType("success");
      }
      else if (msg === "Invalid Username") {
        setMessage("⚠️ Invalid Username");
        setType("error");
      }
      else if (msg === "Invalid Password") {
        setMessage("⚠️ Invalid Password");
        setType("error");
      }
      else if (msg === "Invalid Credentials") {
  setMessage("❌ Invalid Credentials");
  setType("error");
}
      else {
        setMessage("❌ Login Failed");
        setType("error");
      }

    } catch (error) {

      setMessage("⚠️ Server not responding");
      setType("error");

    }

    setUsername("");
    setPassword("");

    // ✅ AUTO HIDE MESSAGE
    setTimeout(() => {
      setMessage("");
    }, 3000);
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

      {/* ✅ NEW MESSAGE BOX */}
      {message && (
        <div className={`message-box ${type}`}>
          {message}
        </div>
      )}

      <p>
        New user ? <span onClick={showSignup}>Sign Up</span>
      </p>

    </div>

  );
}

export default Login;