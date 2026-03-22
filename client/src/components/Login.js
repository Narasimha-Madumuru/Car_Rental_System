import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login({ showSignup }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {

    if (!username.trim() || !password.trim()) {
      setMessage("⚠️ Please enter username and password");
      setType("error");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
      setUsername("");
      setPassword("");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
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
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />

        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />

        <button 
          style={{...styles.button, opacity: isLoading ? 0.6 : 1}} 
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
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
    width: "100vw",
    height: "100vh",
    margin: 0,
    padding: 0,
    backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  card: {
    background: "rgba(0,0,0,0.75)",
    padding: "45px",
    borderRadius: "20px",
    textAlign: "center",
    width: "380px",
    color: "white",
    boxShadow: "0 15px 45px rgba(0,0,0,0.6)"
  },

  heading: {
    marginBottom: "25px",
    fontSize: "26px",
    fontWeight: "600"
  },

  input: {
    width: "100%",
    padding: "14px",
    margin: "12px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "15px",
    background: "rgba(255,255,255,0.15)",
    color: "white"
  },

  button: {
    width: "100%",
    padding: "14px",
    marginTop: "15px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#ff4d4d",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
    transition: "0.3s"
  },

  message: {
    marginTop: "15px",
    fontWeight: "bold",
    fontSize: "14px"
  },

  text: {
    marginTop: "20px",
    fontSize: "14px"
  },

  link: {
    color: "#00c3ff",
    cursor: "pointer",
    fontWeight: "bold"
  }

};