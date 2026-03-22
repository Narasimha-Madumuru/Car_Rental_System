import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("bookings") || "[]");
    setBookings(saved.reverse());
  }, []);

  const cancelBooking = (id) => {
    const updated = bookings.filter(b => b.id !== id);
    setBookings(updated);
    localStorage.setItem("bookings", JSON.stringify(updated));
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <button onClick={() => navigate("/home")} style={styles.backBtn}>
          ← Back to Home
        </button>
        
        <h1 style={styles.title}>My Bookings</h1>
        
        {bookings.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📅</div>
            <h2>No bookings yet</h2>
            <button onClick={() => navigate("/home")}>Explore Cars</button>
          </div>
        ) : (
          <div style={styles.bookingsList}>
            {bookings.map((booking) => (
              <div key={booking.id} style={styles.bookingCard}>
                <div style={styles.bookingHeader}>
                  <span style={styles.bookingId}>{booking.id}</span>
                  <span style={styles.bookingStatus}>{booking.status}</span>
                </div>
                <div style={styles.bookingBody}>
                  <img src={booking.car.image} alt={booking.car.model} style={styles.carImage} />
                  <div>
                    <h3>{booking.car.model}</h3>
                    <p>{booking.car.brand} • {booking.car.fuelType}</p>
                    <p>📅 {new Date(booking.bookingDate).toLocaleDateString()}</p>
                    <p>⏱️ {booking.days} days • ₹{booking.totalPrice}</p>
                  </div>
                </div>
                <button style={styles.cancelBtn} onClick={() => cancelBooking(booking.id)}>
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
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
    maxWidth: "800px",
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
  emptyState: {
    textAlign: "center",
    padding: "60px",
    background: "white",
    borderRadius: "15px"
  },
  emptyIcon: {
    fontSize: "60px",
    marginBottom: "20px"
  },
  bookingsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  bookingCard: {
    background: "white",
    borderRadius: "15px",
    padding: "20px"
  },
  bookingHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    paddingBottom: "10px",
    borderBottom: "1px solid #eee"
  },
  bookingId: {
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#666"
  },
  bookingStatus: {
    color: "#4caf50",
    fontWeight: "bold"
  },
  bookingBody: {
    display: "flex",
    gap: "20px",
    marginBottom: "15px"
  },
  carImage: {
    width: "100px",
    height: "70px",
    objectFit: "cover",
    borderRadius: "8px"
  },
  cancelBtn: {
    padding: "8px 20px",
    background: "#ff4d4d",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    width: "100%"
  }
};

export default MyBookings;