import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ showSignup }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const response = await axios.post(
        "https://car-rental-system-bd19.onrender.com/login",
        { username, password }
      );

      const msg = response.data.message;

      if (msg === "Login Successful") {
        setMessage("✅ Login Successful 🎉");
        setType("success");

        setTimeout(() => {
          navigate("/home");
        }, 1000);
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

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h2 style={styles.heading}> Car Rental System</h2>

        <input
          style={styles.input}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>

        {message && (
          <div style={{
            ...styles.message,
            color: type === "success" ? "#4caf50" : "#ff4d4d"
          }}>
            {message}
          </div>
        )}

        <p style={styles.text}>
          New user ?{" "}
          <span style={styles.link} onClick={showSignup}>
            Sign Up
          </span>
        </p>

      </div>

    </div>
  );
}

export default Login;

const styles = {
  container: {
    width: "100vw",        // 🔥 IMPORTANT
    height: "100vh",
    margin: "0",           // 🔥 IMPORTANT
    padding: "0",
    backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    background: "rgba(0,0,0,0.7)",
    padding: "35px",
    borderRadius: "15px",
    textAlign: "center",
    width: "300px",
    color: "white",
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
  },

  heading: {
    marginBottom: "20px"
  },

  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "none",
    outline: "none"
  },

  button: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#ff4d4d",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },

  message: {
    marginTop: "10px",
    fontWeight: "bold"
  },

  text: {
    marginTop: "15px"
  },

  link: {
    color: "#00c3ff",
    cursor: "pointer",
    fontWeight: "bold"
  }

};