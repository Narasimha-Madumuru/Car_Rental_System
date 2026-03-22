const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://Narasimha:Narasimha_962004@car-rental-cluster.znbvw7h.mongodb.net/carRentalDB?retryWrites=true&w=majority";

mongoose.connect(MONGODB_URI)
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch((err) => console.log("MongoDB Error:", err));

// ========== USER SCHEMA ==========
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

// ========== CAR SCHEMA ==========
const carSchema = new mongoose.Schema({
  model: String,
  brand: String,
  carType: String,
  fuelType: String,
  transmission: String,
  seats: Number,
  pricePerDay: Number,
  image: String,
  isAvailable: { type: Boolean, default: true },
  features: [String],
  rating: { type: Number, default: 4.5 }
});
const Car = mongoose.model("cars", carSchema);

// ========== BOOKING SCHEMA ==========
const bookingSchema = new mongoose.Schema({
  bookingId: { type: String, required: true, unique: true },
  car: {
    model: String,
    brand: String,
    carType: String,
    fuelType: String,
    transmission: String,
    seats: Number,
    pricePerDay: Number,
    image: String,
    features: [String]
  },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  days: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  status: { type: String, default: "Confirmed" }
});
const Booking = mongoose.model("bookings", bookingSchema);

// ========== SIGNUP API ==========
app.post("/signup", async (req, res) => {
  const { firstName, lastName, username, age, dob, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.json({ message: "⚠️ Username already exists" });
    }
    const newUser = new User({ firstName, lastName, username, age, dob, email, password });
    await newUser.save();
    res.json({ message: "✅ Signup Successful", user: { username, email } });
  } catch (error) {
    console.log(error);
    res.json({ message: "⚠️ Error creating account" });
  }
});

// ========== LOGIN API ==========
// ========== LOGIN API ==========
// ========== LOGIN API ==========
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  
  console.log("Login attempt:", username); // Debug log
  
  try {
    // Find user by username
    const user = await User.findOne({ username });
    
    // Case 1: User not found
    if (!user) {
      console.log("User not found:", username);
      return res.json({ message: "Invalid Username" });
    }
    
    // Case 2: Password incorrect
    if (user.password !== password) {
      console.log("Wrong password for:", username);
      return res.json({ message: "Invalid Password" });
    }
    
    // Case 3: Login successful
    console.log("Login successful:", username);
    res.json({ 
      message: "Login Successful", 
      user: { 
        username: user.username, 
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      } 
    });
    
  } catch (error) {
    console.error("Login error:", error);
    res.json({ message: "Server Error" });
  }
});

// ========== CAR FILTER API ==========
app.post("/api/cars/filter", async (req, res) => {
  const { budget, fuel, type } = req.body;
  try {
    let minPrice, maxPrice;
    if (budget === "₹500 - ₹1000") { minPrice = 500; maxPrice = 1000; }
    else if (budget === "₹1000 - ₹2000") { minPrice = 1000; maxPrice = 2000; }
    else if (budget === "₹2000 - ₹4000") { minPrice = 2000; maxPrice = 4000; }
    else { minPrice = 4000; maxPrice = 8000; }
    
    const cars = await Car.find({
      pricePerDay: { $gte: minPrice, $lte: maxPrice },
      fuelType: fuel,
      carType: type,
      isAvailable: true
    });
    
    res.json({ success: true, cars, count: cars.length });
  } catch (error) {
    res.json({ success: false, message: error.message, cars: [] });
  }
});

// ========== ADD 300 CARS API ==========
app.post("/api/cars/add-all", async (req, res) => {
  try {
    await Car.deleteMany({});
    
    const budgets = [
      { name: "₹500 - ₹1000", min: 500, max: 1000 },
      { name: "₹1000 - ₹2000", min: 1000, max: 2000 },
      { name: "₹2000 - ₹4000", min: 2000, max: 4000 },
      { name: "₹4000 - ₹8000", min: 4000, max: 8000 }
    ];
    
    const fuels = ["Petrol", "Diesel", "Electric"];
    
    const carTypes = {
      "Hatchback": {
        brands: [
          { name: "Maruti Suzuki", models: ["Swift", "Baleno", "Ignis", "Wagon R"] },
          { name: "Hyundai", models: ["i10", "i20"] },
          { name: "Tata", models: ["Altroz", "Tiago"] }
        ],
        seats: 5,
        features: {
          "Petrol": ["Fuel Efficient", "Compact Size", "Easy Parking"],
          "Diesel": ["Torquey Engine", "High Mileage"],
          "Electric": ["Zero Emission", "Silent Drive"]
        }
      },
      "Sedan": {
        brands: [
          { name: "Honda", models: ["City", "Amaze"] },
          { name: "Hyundai", models: ["Verna", "Aura"] },
          { name: "Maruti Suzuki", models: ["Ciaz", "Dzire"] }
        ],
        seats: 5,
        features: {
          "Petrol": ["Smooth Ride", "Spacious Boot", "Premium Interior"],
          "Diesel": ["Excellent Mileage", "Highway Cruiser"],
          "Electric": ["Long Range", "Fast Charging", "Silent Cabin"]
        }
      },
      "SUV": {
        brands: [
          { name: "Hyundai", models: ["Creta", "Venue"] },
          { name: "Kia", models: ["Seltos", "Sonet"] },
          { name: "Tata", models: ["Harrier", "Nexon"] },
          { name: "Mahindra", models: ["XUV700", "Thar"] }
        ],
        seats: 5,
        features: {
          "Petrol": ["Sunroof", "Adventure Ready", "Spacious"],
          "Diesel": ["Powerful Engine", "Off-Road Capable"],
          "Electric": ["Eco-Friendly", "Smart Technology"]
        }
      },
      "Luxury": {
        brands: [
          { name: "Mercedes-Benz", models: ["E-Class", "C-Class", "GLA"] },
          { name: "BMW", models: ["3 Series", "5 Series", "X1"] },
          { name: "Audi", models: ["A4", "A6", "Q3"] }
        ],
        seats: 5,
        features: {
          "Petrol": ["Leather Seats", "Ambient Lighting", "Premium Audio"],
          "Diesel": ["Silent Cabin", "Long Range", "Superior Comfort"],
          "Electric": ["State of Art Tech", "Ultra Quiet", "Luxury Finish"]
        }
      },
      "Sports": {
        brands: [
          { name: "Porsche", models: ["911", "Cayman"] },
          { name: "Ferrari", models: ["Roma", "Portofino"] },
          { name: "Lamborghini", models: ["Urus", "Huracan"] }
        ],
        seats: 4,
        features: {
          "Petrol": ["Sport Mode", "Performance Tyres", "Launch Control"],
          "Diesel": ["High Torque", "Sporty Handling"],
          "Electric": ["Instant Acceleration", "Futuristic Design"]
        }
      }
    };
    
    const images = [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
      "https://images.unsplash.com/photo-1580274455191-1c62238fa333",
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a"
    ];
    
    const allCars = [];
    let carId = 0;
    
    for (const budget of budgets) {
      for (const fuel of fuels) {
        for (const [carType, typeData] of Object.entries(carTypes)) {
          const allModels = [];
          for (const brand of typeData.brands) {
            for (const model of brand.models) {
              allModels.push({ brand: brand.name, model });
            }
          }
          
          const selectedModels = allModels.slice(0, 5);
          
          for (let i = 0; i < selectedModels.length; i++) {
            const carData = selectedModels[i];
            const price = Math.floor(Math.random() * (budget.max - budget.min + 1) + budget.min);
            const seats = typeData.seats;
            const features = [...(typeData.features[fuel] || typeData.features["Petrol"])];
            const extraFeatures = ["Sunroof", "Touchscreen", "Reverse Camera", "Bluetooth"];
            features.push(extraFeatures[Math.floor(Math.random() * extraFeatures.length)]);
            const transmission = fuel === "Electric" ? "Automatic" : (Math.random() > 0.5 ? "Manual" : "Automatic");
            const image = images[carId % images.length];
            
            allCars.push({
              model: `${carData.brand} ${carData.model}`,
              brand: carData.brand,
              carType: carType,
              fuelType: fuel,
              transmission: transmission,
              seats: seats,
              pricePerDay: price,
              image: image,
              isAvailable: true,
              features: features.slice(0, 4),
              rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1))
            });
            carId++;
          }
        }
      }
    }
    
    await Car.insertMany(allCars);
    res.json({ success: true, message: `Added ${allCars.length} cars`, count: allCars.length });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// ========== GET CARS COUNT ==========
app.get("/api/cars/count", async (req, res) => {
  try {
    const count = await Car.countDocuments();
    res.json({ success: true, count });
  } catch (error) {
    res.json({ success: false, count: 0 });
  }
});

// ========== CREATE BOOKING API ==========
app.post("/api/bookings/create", async (req, res) => {
  const { bookingId, car, userId, userName, days, totalPrice } = req.body;
  
  try {
    const newBooking = new Booking({
      bookingId,
      car,
      userId,
      userName,
      days,
      totalPrice,
      bookingDate: new Date(),
      status: "Confirmed"
    });
    
    await newBooking.save();
    res.json({ success: true, message: "Booking saved to database", booking: newBooking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.json({ success: false, message: error.message });
  }
});

// ========== GET USER BOOKINGS API ==========
app.post("/api/bookings/user", async (req, res) => {
  const { userId } = req.body;
  
  try {
    const bookings = await Booking.find({ userId }).sort({ bookingDate: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.json({ success: false, message: error.message, bookings: [] });
  }
});

// ========== CANCEL BOOKING API ==========
app.post("/api/bookings/cancel", async (req, res) => {
  const { bookingId, userId } = req.body;
  
  try {
    const deleted = await Booking.findOneAndDelete({ bookingId, userId });
    
    if (deleted) {
      res.json({ success: true, message: "Booking cancelled successfully" });
    } else {
      res.json({ success: false, message: "Booking not found" });
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.json({ success: false, message: error.message });
  }
});

// ========== GET ALL BOOKINGS (Admin) ==========
app.get("/api/bookings/all", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ bookingDate: -1 });
    res.json({ success: true, bookings, count: bookings.length });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});