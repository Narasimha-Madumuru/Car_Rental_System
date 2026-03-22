import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/signup";
import Home from "./components/home";
import CarResults from "./components/CarResults";
import Booking from "./components/Booking";
import MyBookings from "./components/MyBookings";

function App() {
  const [showSignup, setShowSignup] = React.useState(false);

  if (showSignup) {
    return <Signup goLogin={() => setShowSignup(false)} />;
  }

  return (
    <Router basename="/Car_Rental_System">
      <Routes>
        <Route path="/" element={<Login showSignup={() => setShowSignup(true)} />} />
        <Route path="/signup" element={<Signup goLogin={() => setShowSignup(false)} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/carresults" element={<CarResults />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/mybookings" element={<MyBookings />} />
      </Routes>
    </Router>
  );
}

export default App;