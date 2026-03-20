const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* MongoDB Connection */

mongoose.connect("mongodb+srv://Narasimha:Narasimha_962004@car-rental-cluster.znbvw7h.mongodb.net/carRentalDB?retryWrites=true&w=majority")
.then(() => {
  console.log("MongoDB Atlas Connected");
})
.catch((err) => {
  console.log("MongoDB Error:", err);
});

/* User Schema */

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  age: Number,
  dob: String,
  email: String,
  password: String
});

const User = mongoose.model("users", userSchema);

/* SIGNUP */

app.post("/signup", async (req, res) => {

  const { firstName, lastName, username, age, dob, email, password } = req.body;

  try {

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.json({ message: "⚠️ Username already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      username,
      age,
      dob,
      email,
      password
    });

    await newUser.save();

    res.json({ message: "✅ Signup Successful" });

  } catch (error) {

    console.log(error);
    res.json({ message: "⚠️ Error creating account" });

  }

});

/* LOGIN */

app.post("/login", async (req, res) => {

  const { username, password } = req.body;

  try {

    const userByUsername = await User.findOne({ username });
    const userByPassword = await User.findOne({ password });

    // ❌ BOTH WRONG
    if (!userByUsername && !userByPassword) {
      return res.json({
        message: "Login Failed"
      });
    }

    // ❌ USERNAME WRONG
    if (!userByUsername) {
      return res.json({
        message: "Invalid Username"
      });
    }

    // ❌ PASSWORD WRONG
    if (userByUsername.password !== password) {
      return res.json({
        message: "Invalid Password"
      });
    }

    // ✅ SUCCESS
    res.json({
      message: "Login Successful"
    });

  } catch (error) {

    res.json({
      message: "Server Error"
    });

  }

});

/* Server */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});