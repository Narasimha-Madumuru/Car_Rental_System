import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { car, budget, fuel, type, preferredFeatures } = location.state || {};
  
  const [days, setDays] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Get current user from localStorage (set after login)
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!car) {
      navigate("/home");
      return;
    }
    setTotalPrice(car.pricePerDay * days);
    window.scrollTo(0, 0);
    
    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/");
    }
    setCurrentUser(user);
  }, [days, car, navigate]);

  const handleConfirmBooking = async () => {
    if (!currentUser) {
      alert("Please login again");
      navigate("/");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    const newBookingId = "BOOK" + Math.random().toString(36).substr(2, 8).toUpperCase();
    setBookingId(newBookingId);
    
    const bookingData = {
      bookingId: newBookingId,
      car: car,
      userId: currentUser.username,
      userName: currentUser.firstName + " " + currentUser.lastName,
      days: days,
      totalPrice: totalPrice
    };
    
    try {
      const response = await axios.post(
        "https://car-rental-system-bd19.onrender.com/api/bookings/create",
        bookingData
      );
      
      if (response.data.success) {
        setBookingConfirmed(true);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to save booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (bookingConfirmed) {
    return (
      <div style={styles.container}>
        <div style={styles.overlay}></div>
        <div style={styles.confirmationBox}>
          <div style={styles.successIcon}>🎉</div>
          <h1 style={styles.confirmTitle}>Booking Confirmed!</h1>
          <p style={styles.confirmText}>Booking ID: <strong>{bookingId}</strong></p>
          <p style={styles.confirmText}>Your {car.model} has been booked for {days} days</p>
          <p style={styles.confirmPrice}>Total Amount: <strong>₹{totalPrice}</strong></p>
          <div style={styles.confirmButtons}>
            <button style={styles.confirmHomeBtn} onClick={() => navigate("/home")}>
              Book Another Car
            </button>
            <button style={styles.confirmBookingsBtn} onClick={() => navigate("/mybookings")}>
              View My Bookings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>📝 Complete Your Booking</h1>
          <p style={styles.subtitle}>Review and confirm your car rental details</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <p>{error}</p>
          </div>
        )}

        <div style={styles.bookingCard}>
          <div style={styles.carImageContainer}>
            <img 
              src={car.image || "https://via.placeholder.com/600x300?text=Car"} 
              alt={car.model}
              style={styles.carImage}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/600x300?text=" + car.model;
              }}
            />
            <div style={styles.availabilityTag}>
              {car.isAvailable ? "Available" : "Booked"}
            </div>
          </div>
          
          <div style={styles.carInfo}>
            <h2 style={styles.carModel}>{car.model}</h2>
            <p style={styles.carBrand}>{car.brand}</p>
            
            <div style={styles.specsGrid}>
              <div style={styles.specCard}>
                <span style={styles.specIcon}>⛽</span>
                <span>{car.fuelType}</span>
              </div>
              <div style={styles.specCard}>
                <span style={styles.specIcon}>⚙️</span>
                <span>{car.transmission}</span>
              </div>
              <div style={styles.specCard}>
                <span style={styles.specIcon}>👥</span>
                <span>{car.seats} Seats</span>
              </div>
              {car.rating && (
                <div style={styles.specCard}>
                  <span style={styles.specIcon}>⭐</span>
                  <span>{car.rating}</span>
                </div>
              )}
            </div>
            
            <div style={styles.featuresSection}>
              <h4 style={styles.featuresTitle}>✨ Key Features</h4>
              <div style={styles.featuresList}>
                {car.features && car.features.map((feature, i) => (
                  <span key={i} style={styles.featureBadge}>{feature}</span>
                ))}
              </div>
            </div>
          </div>
          
          <div style={styles.rentalSection}>
            <h3 style={styles.rentalTitle}>Rental Details</h3>
            
            <div style={styles.daysSelector}>
              <label style={styles.daysLabel}>Number of Days:</label>
              <div style={styles.daysControls}>
                <button 
                  style={styles.daysBtn}
                  onClick={() => setDays(Math.max(1, days - 1))}
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="1" 
                  max="30"
                  value={days}
                  onChange={(e) => setDays(Math.max(1, parseInt(e.target.value) || 1))}
                  style={styles.daysInput}
                />
                <button 
                  style={styles.daysBtn}
                  onClick={() => setDays(Math.min(30, days + 1))}
                >
                  +
                </button>
              </div>
            </div>
            
            <div style={styles.priceBreakdown}>
              <div style={styles.priceRow}>
                <span>Price per day:</span>
                <span style={styles.priceAmount}>₹{car.pricePerDay}</span>
              </div>
              <div style={styles.priceRow}>
                <span>Total for {days} day{days !== 1 ? 's' : ''}:</span>
                <span style={styles.totalAmount}>₹{totalPrice}</span>
              </div>
            </div>
          </div>
          
          <button 
            style={{...styles.confirmBtn, opacity: isLoading ? 0.6 : 1}}
            onClick={handleConfirmBooking}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Confirm Booking →"}
          </button>
        </div>

        <div style={styles.bottomBackButton}>
          <button 
            onClick={() => navigate("/carresults", { 
              state: { budget, fuel, type, preferredFeatures } 
            })} 
            style={styles.backButton}
          >
            ← Back to Cars
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    position: "relative",
    overflowX: "hidden"
  },
  
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    zIndex: 0
  },
  
  content: {
    position: "relative",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 30px 100px 30px",
    zIndex: 1,
    minHeight: "100vh"
  },
  
  header: {
    textAlign: "center",
    marginBottom: "40px"
  },
  
  title: {
    fontSize: "42px",
    fontWeight: "700",
    color: "white",
    marginBottom: "10px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
  },
  
  subtitle: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.8)"
  },
  
  errorBox: {
    textAlign: "center",
    padding: "15px",
    background: "rgba(255,0,0,0.9)",
    borderRadius: "10px",
    color: "white",
    marginBottom: "20px"
  },
  
  bookingCard: {
    background: "white",
    borderRadius: "25px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
  },
  
  carImageContainer: {
    position: "relative",
    height: "280px",
    overflow: "hidden"
  },
  
  carImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  
  availabilityTag: {
    position: "absolute",
    bottom: "20px",
    left: "20px",
    padding: "6px 16px",
    background: "#4caf50",
    borderRadius: "25px",
    color: "white",
    fontSize: "12px",
    fontWeight: "600"
  },
  
  carInfo: {
    padding: "25px"
  },
  
  carModel: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 5px 0",
    color: "#1a1a2e"
  },
  
  carBrand: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "20px"
  },
  
  specsGrid: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "25px"
  },
  
  specCard: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    background: "#f5f5f5",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#555"
  },
  
  specIcon: {
    fontSize: "16px"
  },
  
  featuresSection: {
    marginBottom: "25px",
    paddingTop: "15px",
    borderTop: "1px solid #eee"
  },
  
  featuresTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "12px"
  },
  
  featuresList: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap"
  },
  
  featureBadge: {
    padding: "5px 12px",
    background: "#f0f0f0",
    borderRadius: "20px",
    fontSize: "12px",
    color: "#666"
  },
  
  rentalSection: {
    background: "#f8f9fa",
    padding: "25px",
    margin: "0 25px 25px 25px",
    borderRadius: "15px"
  },
  
  rentalTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "20px"
  },
  
  daysSelector: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "15px"
  },
  
  daysLabel: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#555"
  },
  
  daysControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  
  daysBtn: {
    width: "36px",
    height: "36px",
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "10px",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    color: "#ff4d4d",
    margin: "0"
  },
  
  daysInput: {
    width: "80px",
    padding: "8px",
    textAlign: "center",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "10px"
  },
  
  priceBreakdown: {
    borderTop: "1px solid #e0e0e0",
    paddingTop: "15px"
  },
  
  priceRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
    fontSize: "16px"
  },
  
  priceAmount: {
    fontWeight: "600",
    color: "#ff4d4d"
  },
  
  totalAmount: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#ff4d4d"
  },
  
  confirmBtn: {
    width: "calc(100% - 50px)",
    margin: "0 25px 25px 25px",
    padding: "14px",
    background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "18px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.3s"
  },
  
  bottomBackButton: {
    textAlign: "center",
    marginTop: "50px",
    paddingTop: "20px"
  },
  
  backButton: {
    display: "inline-block",
    width: "auto",
    padding: "12px 35px",
    background: "white",
    border: "none",
    borderRadius: "40px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    color: "#ff4d4d",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
    transition: "0.3s"
  },
  
  confirmationBox: {
    position: "relative",
    maxWidth: "500px",
    margin: "100px auto",
    background: "white",
    borderRadius: "25px",
    padding: "50px 40px",
    textAlign: "center",
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
    zIndex: 1
  },
  
  successIcon: {
    fontSize: "80px",
    marginBottom: "20px"
  },
  
  confirmTitle: {
    fontSize: "32px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "20px"
  },
  
  confirmText: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "10px"
  },
  
  confirmPrice: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#ff4d4d",
    margin: "20px 0"
  },
  
  confirmButtons: {
    display: "flex",
    gap: "15px",
    justifyContent: "center",
    marginTop: "30px"
  },
  
  confirmHomeBtn: {
    padding: "12px 24px",
    background: "#fff",
    border: "2px solid #ff4d4d",
    borderRadius: "10px",
    color: "#ff4d4d",
    fontWeight: "600",
    cursor: "pointer"
  },
  
  confirmBookingsBtn: {
    padding: "12px 24px",
    background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
  }
};

export default Booking;