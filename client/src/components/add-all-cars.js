const mongoose = require("mongoose");
const axios = require("axios");

// Connect to your database
mongoose.connect("mongodb+srv://Narasimha:Narasimha_962004@car-rental-cluster.znbvw7h.mongodb.net/carRentalDB?retryWrites=true&w=majority");

// Car Schema
const carSchema = new mongoose.Schema({
  model: String,
  brand: String,
  carType: String,
  fuelType: String,
  transmission: String,
  seats: Number,
  pricePerDay: Number,
  image: String,
  isAvailable: Boolean,
  features: [String]
});

const Car = mongoose.model("cars", carSchema);

// All combinations
const budgets = [
  { range: "₹500 - ₹1000", min: 500, max: 1000 },
  { range: "₹1000 - ₹2000", min: 1000, max: 2000 },
  { range: "₹2000 - ₹4000", min: 2000, max: 4000 },
  { range: "₹4000 - ₹8000", min: 4000, max: 8000 }
];

const fuels = ["Petrol", "Diesel", "Electric"];
const carTypes = ["Hatchback", "Sedan", "SUV", "Luxury", "Sports"];

// Car models database for each type
const carModels = {
  Hatchback: [
    { brand: "Maruti Suzuki", models: ["Swift", "Baleno", "Ignis", "Wagon R", "Celerio"] },
    { brand: "Hyundai", models: ["i10", "i20", "Grand i10 Nios"] },
    { brand: "Tata", models: ["Altroz", "Tiago"] },
    { brand: "Honda", models: ["Jazz", "Brio"] },
    { brand: "Ford", models: ["Figo", "Freestyle"] }
  ],
  Sedan: [
    { brand: "Honda", models: ["City", "Amaze"] },
    { brand: "Hyundai", models: ["Verna", "Aura"] },
    { brand: "Maruti Suzuki", models: ["Ciaz", "Dzire"] },
    { brand: "Skoda", models: ["Slavia", "Octavia"] },
    { brand: "Volkswagen", models: ["Virtus", "Vento"] }
  ],
  SUV: [
    { brand: "Hyundai", models: ["Creta", "Tucson", "Venue"] },
    { brand: "Kia", models: ["Seltos", "Sonet"] },
    { brand: "Tata", models: ["Harrier", "Safari", "Nexon"] },
    { brand: "Mahindra", models: ["XUV700", "Thar", "Scorpio"] },
    { brand: "MG", models: ["Hector", "Astor"] }
  ],
  Luxury: [
    { brand: "Mercedes-Benz", models: ["E-Class", "C-Class", "S-Class", "GLA", "GLE"] },
    { brand: "BMW", models: ["3 Series", "5 Series", "X1", "X3", "X5"] },
    { brand: "Audi", models: ["A4", "A6", "Q3", "Q5", "Q7"] },
    { brand: "Jaguar", models: ["XF", "XE", "F-Pace"] },
    { brand: "Volvo", models: ["XC40", "XC60", "S60", "S90"] }
  ],
  Sports: [
    { brand: "Porsche", models: ["911", "Cayman", "Panamera"] },
    { brand: "Ferrari", models: ["Roma", "Portofino", "F8 Tributo"] },
    { brand: "Lamborghini", models: ["Urus", "Huracan", "Aventador"] },
    { brand: "Audi", models: ["R8", "RS7"] },
    { brand: "BMW", models: ["M4", "M5", "Z4"] }
  ]
};

// Images for cars (you can replace with actual image URLs)
const images = [
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2",
  "https://images.unsplash.com/photo-1580274455191-1c62238fa333",
  "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a",
  "https://images.unsplash.com/photo-1599819811279-d5ad9ccf8387",
  "https://images.unsplash.com/photo-1617469767053-d3b523a0b982",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8",
  "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d"
];

function getRandomImage() {
  return images[Math.floor(Math.random() * images.length)];
}

function getRandomFeatures() {
  const allFeatures = [
    "Sunroof", "Touchscreen", "Reverse Camera", "Bluetooth", "USB Port",
    "Leather Seats", "Navigation", "Cruise Control", "Parking Sensors",
    "Keyless Entry", "Push Start", "Climate Control", "Premium Sound System",
    "LED Headlamps", "Alloy Wheels", "Fog Lamps", "Airbags", "ABS"
  ];
  
  const numFeatures = Math.floor(Math.random() * 4) + 2; // 2-5 features
  const shuffled = [...allFeatures].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numFeatures);
}

function getTransmission(fuelType) {
  if (fuelType === "Electric") return "Automatic";
  return Math.random() > 0.6 ? "Automatic" : "Manual";
}

function getSeats(carType) {
  if (carType === "SUV") return [5, 7][Math.floor(Math.random() * 2)];
  if (carType === "Luxury") return [4, 5][Math.floor(Math.random() * 2)];
  return 5;
}

async function generateAllCars() {
  try {
    // Clear existing cars
    await Car.deleteMany({});
    console.log("Cleared existing cars");

    const allCars = [];

    for (const budget of budgets) {
      for (const fuel of fuels) {
        for (const carType of carTypes) {
          // Get car models for this type
          const typeModels = carModels[carType];
          
          // Generate 5 cars for this combination
          for (let i = 0; i < 5; i++) {
            // Select random brand and model
            const brandData = typeModels[Math.floor(Math.random() * typeModels.length)];
            const modelName = brandData.models[Math.floor(Math.random() * brandData.models.length)];
            
            // Generate price within budget range
            const price = Math.floor(Math.random() * (budget.max - budget.min + 1) + budget.min);
            
            const car = {
              model: `${brandData.brand} ${modelName}`,
              brand: brandData.brand,
              carType: carType,
              fuelType: fuel,
              transmission: getTransmission(fuel),
              seats: getSeats(carType),
              pricePerDay: price,
              image: getRandomImage(),
              isAvailable: true,
              features: getRandomFeatures()
            };
            
            allCars.push(car);
          }
        }
      }
    }

    // Insert all cars
    await Car.insertMany(allCars);
    console.log(`✅ Successfully added ${allCars.length} cars to database!`);
    console.log(`Expected: 4 budgets × 3 fuels × 5 types × 5 cars = 300 cars`);
    console.log(`Actual: ${allCars.length} cars added`);
    
    mongoose.connection.close();
    
  } catch (error) {
    console.error("Error generating cars:", error);
    mongoose.connection.close();
  }
}

// Run the generator
generateAllCars();