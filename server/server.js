const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ========== MONGODB CONNECTION ==========
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
    res.json({ message: "✅ Signup Successful" });
  } catch (error) {
    console.log(error);
    res.json({ message: "⚠️ Error creating account" });
  }
});

// ========== LOGIN API ==========
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.json({ message: "Invalid Username" });
    if (user.password !== password) return res.json({ message: "Invalid Password" });
    res.json({ message: "Login Successful", user: { username: user.username, email: user.email } });
  } catch (error) {
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

// ========== ADD 300 CARS TO DATABASE (RUN ONCE) ==========
app.post("/api/cars/add-all", async (req, res) => {
  try {
    // Clear existing cars
    await Car.deleteMany({});
    console.log("Cleared existing cars");
    
    const allCars = [];
    
    // Budget Ranges
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
          { name: "Tata", models: ["Altroz", "Tiago"] },
          { name: "Honda", models: ["Jazz"] }
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
          { name: "Maruti Suzuki", models: ["Ciaz", "Dzire"] },
          { name: "Skoda", models: ["Slavia"] }
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
          { name: "Mahindra", models: ["XUV700", "Thar"] },
          { name: "MG", models: ["Hector"] }
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
          { name: "Audi", models: ["A4", "A6", "Q3"] },
          { name: "Jaguar", models: ["XF", "F-Pace"] }
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
          { name: "Lamborghini", models: ["Urus", "Huracan"] },
          { name: "Audi", models: ["R8"] },
          { name: "BMW", models: ["M4", "Z4"] }
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
      "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a",
      "https://images.unsplash.com/photo-1599819811279-d5ad9ccf8387",
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8"
    ];
    
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
          
          // Take first 5 models for this combination
          const selectedModels = allModels.slice(0, 5);
          
          for (let i = 0; i < selectedModels.length; i++) {
            const carData = selectedModels[i];
            
            let price = Math.floor(Math.random() * (budget.max - budget.min + 1) + budget.min);
            
            let seats = typeData.seats;
            if (Array.isArray(typeData.seats)) {
              seats = typeData.seats[0];
            }
            
            const features = [...(typeData.features[fuel] || typeData.features["Petrol"])];
            const extraFeatures = ["Sunroof", "Touchscreen", "Reverse Camera", "Bluetooth"];
            const randomFeature = extraFeatures[Math.floor(Math.random() * extraFeatures.length)];
            if (!features.includes(randomFeature)) features.push(randomFeature);
            
            let transmission = fuel === "Electric" ? "Automatic" : (Math.random() > 0.5 ? "Manual" : "Automatic");
            const image = images[carId % images.length] + `?w=600&h=350&fit=crop&id=${carId}`;
            const rating = 3.5 + Math.random() * 1.5;
            
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
              rating: parseFloat(rating.toFixed(1))
            });
            carId++;
          }
        }
      }
    }
    
    await Car.insertMany(allCars);
    console.log(`✅ Added ${allCars.length} cars to database`);
    
    res.json({ 
      success: true, 
      message: `Successfully added ${allCars.length} cars to database!`,
      count: allCars.length
    });
    
  } catch (error) {
    console.error("Error:", error);
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

// ========== GET ALL CARS ==========
app.get("/api/cars/all", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json({ success: true, cars, count: cars.length });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});