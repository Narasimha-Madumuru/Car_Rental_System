const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* MongoDB Connection */

mongoose.connect("mongodb+srv://Narasimha:Narasimhaking123123@car-rental-cluster.znbvw7h.mongodb.net/carRentalDB")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
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


/* SIGNUP API */

app.post("/signup", async (req, res) => {

    const { firstName, lastName, username, age, dob, email, password } = req.body;

    try {

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: "⚠️ Username already exists" });
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

        res.json({
            message: "✅ Signup Successful"
        });

    } catch (error) {

        res.status(500).json({
            message: "⚠️ Error creating account"
        });

    }

});


/* LOGIN API */

app.post("/login", async (req, res) => {

  const { username, password } = req.body;

  try {

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid Username"
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Invalid Password"
      });
    }

    res.json({
      message: "Login Successful"
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    });

  }

});
/* SERVER PORT */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});