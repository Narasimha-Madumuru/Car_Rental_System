import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/");
      return;
    }
    setCurrentUser(user);
    fetchBookings(user.username);
  }, [navigate]);

  const fetchBookings = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://car-rental-system-bd19.onrender.com/api/bookings/user",
        { userId }
      );
      
      if (response.data.success) {
        setBookings(response.data.bookings);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      const response = await axios.post(
        "https://car-rental-system-bd19.onrender.com/api/bookings/cancel",
        { bookingId, userId: currentUser.username }
      );
      
      if (response.data.success) {
        // Refresh bookings list
        fetchBookings(currentUser.username);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Failed to cancel booking");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <h2>Loading your bookings...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      
      <div style={styles.content}>
        <div style={styles.header}>
          <h1 style={styles.title}>📋 My Bookings</h1>
          <p style={styles.subtitle}>Manage your car rental reservations</p>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <p>{error}</p>
          </div>
        )}

        {bookings.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🚗💨</div>
            <h2 style={styles.emptyTitle}>No Bookings Yet</h2>
            <p style={styles.emptyText}>You haven't made any car bookings yet.</p>
            <button onClick={() => navigate("/home")} style={styles.exploreBtn}>
              Explore Cars
            </button>
          </div>
        ) : (
          <>
            <div style={styles.statsBar}>
              <span style={styles.statsCount}>📊 Total Bookings: {bookings.length}</span>
              <span style={styles.statsActive}>✅ Active: {bookings.filter(b => b.status === "Confirmed").length}</span>
            </div>
            
            <div style={styles.grid}>
              {bookings.map((booking) => (
                <div key={booking.bookingId} style={styles.bookingCard}>
                  <div style={styles.statusBadge}>
                    <span style={styles.statusIcon}>✅</span>
                    <span style={styles.statusText}>{booking.status}</span>
                  </div>
                  
                  <div style={styles.bookingId}>
                    <span style={styles.idLabel}>Booking ID:</span>
                    <span style={styles.idValue}>{booking.bookingId}</span>
                  </div>
                  
                  <div style={styles.carInfo}>
                    <img 
                      src={booking.car.image || "https://via.placeholder.com/120x80?text=Car"} 
                      alt={booking.car.model}
                      style={styles.carImage}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/120x80?text=" + booking.car.model;
                      }}
                    />
                    <div style={styles.carDetails}>
                      <h3 style={styles.carModel}>{booking.car.model}</h3>
                      <p style={styles.carBrand}>{booking.car.brand}</p>
                      <div style={styles.carSpecs}>
                        <span>⛽ {booking.car.fuelType}</span>
                        <span>⚙️ {booking.car.transmission}</span>
                        <span>👥 {booking.car.seats} seats</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.bookingDetails}>
                    <div style={styles.detailRow}>
                      <span style={styles.detailIcon}>📅</span>
                      <span style={styles.detailLabel}>Booking Date:</span>
                      <span style={styles.detailValue}>{formatDate(booking.bookingDate)}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailIcon}>⏱️</span>
                      <span style={styles.detailLabel}>Duration:</span>
                      <span style={styles.detailValue}>{booking.days} day{booking.days !== 1 ? 's' : ''}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span style={styles.detailIcon}>💰</span>
                      <span style={styles.detailLabel}>Total Price:</span>
                      <span style={styles.priceValue}>₹{booking.totalPrice}</span>
                    </div>
                  </div>
                  
                  <div style={styles.actionButtons}>
                    <button 
                      style={styles.cancelBtn}
                      onClick={() => cancelBooking(booking.bookingId)}
                    >
                      Cancel Booking
                    </button>
                    <button 
                      style={styles.rebookBtn}
                      onClick={() => navigate("/home")}
                    >
                      Book Similar →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={styles.bottomBackButton}>
          <button onClick={() => navigate("/home")} style={styles.backButton}>
            ← Back to Home
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
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px 30px 100px 30px",
    zIndex: 1,
    minHeight: "100vh"
  },
  
  header: {
    textAlign: "center",
    marginBottom: "50px"
  },
  
  title: {
    fontSize: "48px",
    fontWeight: "700",
    color: "white",
    marginBottom: "10px",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)"
  },
  
  subtitle: {
    fontSize: "18px",
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
  
  statsBar: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "40px",
    flexWrap: "wrap"
  },
  
  statsCount: {
    padding: "12px 25px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "30px",
    color: "white",
    fontSize: "16px",
    fontWeight: "500",
    backdropFilter: "blur(10px)"
  },
  
  statsActive: {
    padding: "12px 25px",
    background: "rgba(76, 175, 80, 0.3)",
    borderRadius: "30px",
    color: "#4caf50",
    fontSize: "16px",
    fontWeight: "500",
    backdropFilter: "blur(10px)"
  },
  
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
    gap: "30px"
  },
  
  bookingCard: {
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    position: "relative"
  },
  
  statusBadge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    background: "rgba(76, 175, 80, 0.15)",
    padding: "5px 12px",
    borderRadius: "20px",
    zIndex: 2
  },
  
  statusIcon: {
    fontSize: "12px"
  },
  
  statusText: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#4caf50"
  },
  
  bookingId: {
    background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
    padding: "12px 20px",
    borderBottom: "1px solid #e0e0e0"
  },
  
  idLabel: {
    fontSize: "12px",
    color: "#666",
    marginRight: "8px"
  },
  
  idValue: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#333",
    fontFamily: "monospace"
  },
  
  carInfo: {
    display: "flex",
    padding: "20px",
    gap: "15px",
    borderBottom: "1px solid #f0f0f0"
  },
  
  carImage: {
    width: "100px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "12px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
  },
  
  carDetails: {
    flex: 1
  },
  
  carModel: {
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 4px 0",
    color: "#333"
  },
  
  carBrand: {
    fontSize: "13px",
    color: "#666",
    marginBottom: "8px"
  },
  
  carSpecs: {
    display: "flex",
    gap: "12px",
    fontSize: "11px",
    color: "#888"
  },
  
  bookingDetails: {
    padding: "15px 20px",
    background: "#fafafa"
  },
  
  detailRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "13px"
  },
  
  detailIcon: {
    width: "25px",
    fontSize: "14px"
  },
  
  detailLabel: {
    width: "95px",
    color: "#666"
  },
  
  detailValue: {
    color: "#333",
    fontWeight: "500"
  },
  
  priceValue: {
    color: "#ff4d4d",
    fontWeight: "700",
    fontSize: "16px"
  },
  
  actionButtons: {
    display: "flex",
    gap: "12px",
    padding: "15px 20px",
    background: "white",
    borderTop: "1px solid #f0f0f0"
  },
  
  cancelBtn: {
    flex: 1,
    padding: "10px",
    background: "#fff",
    border: "1.5px solid #ff4d4d",
    borderRadius: "10px",
    color: "#ff4d4d",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s"
  },
  
  rebookBtn: {
    flex: 1,
    padding: "10px",
    background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "600",
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
  
  emptyState: {
    textAlign: "center",
    padding: "80px 40px",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "30px",
    maxWidth: "500px",
    margin: "0 auto",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
  },
  
  emptyIcon: {
    fontSize: "80px",
    marginBottom: "20px"
  },
  
  emptyTitle: {
    fontSize: "28px",
    color: "#333",
    marginBottom: "10px"
  },
  
  emptyText: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "30px"
  },
  
  exploreBtn: {
    padding: "12px 30px",
    background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
    border: "none",
    borderRadius: "12px",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer"
  },
  
  loadingContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white"
  },
  
  loader: {
    width: "50px",
    height: "50px",
    border: "3px solid rgba(255,255,255,0.3)",
    borderTop: "3px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px"
  }
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default MyBookings;