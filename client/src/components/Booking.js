import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { car } = location.state || {};

  const [days, setDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  useEffect(() => {
    if (!car) {
      navigate("/home");
      return;
    }
    setTotalPrice(car.pricePerDay * days);
  }, [days, car, navigate]);

  const handleConfirmBooking = () => {
    const newBookingId = "BOOK" + Math.random().toString(36).substr(2, 8).toUpperCase();
    setBookingId(newBookingId);
    
    const booking = {
      id: newBookingId,
      car: car,
      days: days,
      totalPrice: totalPrice,
      bookingDate: new Date().toISOString(),
      status: "Confirmed"
    };
    
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(booking);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    setBookingConfirmed(true);
  };

  if (bookingConfirmed) {
    return (
      <div style={styles.container}>
        <div style={styles.confirmationBox}>
          <div style={styles.successIcon}>🎉</div>
          <h1>Booking Confirmed!</h1>
          <p>Booking ID: <strong>{bookingId}</strong></p>
          <p>Your {car.model} has been booked for {days} days</p>
          <p>Total: <strong>₹{totalPrice}</strong></p>
          <div style={styles.buttonGroup}>
            <button onClick={() => navigate("/home")}>Book Another Car</button>
            <button onClick={() => navigate("/mybookings")}>View My Bookings</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        
        <h1 style={styles.title}>Complete Your Booking</h1>
        
        <div style={styles.bookingCard}>
          <img src={car.image} alt={car.model} style={styles.carImage} />
          <h2>{car.model}</h2>
          <p>{car.brand} • {car.fuelType} • {car.transmission}</p>
          
          <div style={styles.rentalSection}>
            <label>Number of Days:</label>
            <input 
              type="number" 
              min="1" 
              max="30"
              value={days}
              onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
              style={styles.daysInput}
            />
            <p>Price per day: ₹{car.pricePerDay}</p>
            <h3>Total: ₹{totalPrice}</h3>
          </div>
          
          <button style={styles.confirmBtn} onClick={handleConfirmBooking}>
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "40px"
  },
  content: {
    maxWidth: "600px",
    margin: "0 auto"
  },
  backBtn: {
    padding: "10px 20px",
    background: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "30px"
  },
  title: {
    textAlign: "center",
    color: "white",
    marginBottom: "30px"
  },
  bookingCard: {
    background: "white",
    borderRadius: "15px",
    padding: "30px",
    textAlign: "center"
  },
  carImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "20px"
  },
  rentalSection: {
    marginTop: "20px",
    padding: "20px",
    background: "#f5f5f5",
    borderRadius: "10px"
  },
  daysInput: {
    padding: "10px",
    fontSize: "16px",
    width: "100px",
    margin: "10px 0",
    textAlign: "center",
    border: "1px solid #ddd",
    borderRadius: "8px"
  },
  confirmBtn: {
    marginTop: "20px",
    padding: "12px 30px",
    background: "#ff4d4d",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%"
  },
  confirmationBox: {
    background: "white",
    borderRadius: "15px",
    padding: "40px",
    textAlign: "center",
    maxWidth: "500px",
    margin: "0 auto"
  },
  successIcon: {
    fontSize: "60px",
    marginBottom: "20px"
  },
  buttonGroup: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginTop: "25px"
  }
};

export default Booking;