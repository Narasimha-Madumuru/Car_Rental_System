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

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {

    try {

      const response = await axios.post(
        "https://car-rental-system-bd19.onrender.com/signup",
        user
      );

      setMessage(response.data.message);

      if (response.data.message === "✅ Signup Successful") {
        setMessageType("success");
        setTimeout(() => {
          goLogin();
        }, 1500);
      } else {
        setMessageType("error");
      }

    } catch (error) {

      setMessage("⚠️ Server not responding");
      setMessageType("error");

    }

    setTimeout(() => {
      setMessage("");
    }, 3000);

  };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h2 style={styles.heading}>Create Account</h2>

        <div style={styles.formRow}>
          <input style={styles.inputHalf} name="firstName" placeholder="First Name" onChange={handleChange}/>
          <input style={styles.inputHalf} name="lastName" placeholder="Last Name" onChange={handleChange}/>
        </div>

        <input style={styles.input} name="username" placeholder="Username" onChange={handleChange}/>

        <div style={styles.formRow}>
          <input style={styles.inputHalf} name="age" type="number" placeholder="Age" onChange={handleChange}/>
          <input style={styles.inputHalf} name="dob" type="date" placeholder="DOB" onChange={handleChange}/>
        </div>

        <input style={styles.input} name="email" type="email" placeholder="Email" onChange={handleChange}/>
        <input style={styles.input} name="password" type="password" placeholder="Password" onChange={handleChange}/>

        <button style={styles.button} onClick={handleSignup}>Sign Up</button>

        {message && (
          <div style={{
            ...styles.message,
            color: messageType === "success" ? "#4caf50" : "#ff4d4d"
          }}>
            {message}
          </div>
        )}

        <p style={styles.text}>
          Already have an account ? <span style={styles.link} onClick={goLogin}>Login</span>
        </p>

      </div>

    </div>

  );
}

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
    padding: "40px",
    borderRadius: "20px",
    textAlign: "center",
    width: "450px",
    maxWidth: "90%",
    color: "white",
    boxShadow: "0 15px 45px rgba(0,0,0,0.6)",
    maxHeight: "90vh",
    overflowY: "auto"
  },

  heading: {
    marginBottom: "25px",
    fontSize: "28px",
    fontWeight: "600"
  },

  formRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "0"
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "rgba(255,255,255,0.15)",
    color: "white"
  },

  inputHalf: {
    width: "50%",
    padding: "12px",
    margin: "10px 0",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "rgba(255,255,255,0.15)",
    color: "white"
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "15px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#ff4d4d",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer"
  },

  message: {
    marginTop: "15px",
    fontWeight: "bold",
    fontSize: "13px"
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

export default Signup;