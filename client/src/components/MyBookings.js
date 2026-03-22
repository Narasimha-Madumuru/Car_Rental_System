import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      navigate("/");
      return;
    }
    setCurrentUser(user);
    fetchBookings(user.username);
  }, []);

  const fetchBookings = async (userId) => {
    try {
      const response = await axios.post("https://car-rental-system-bd19.onrender.com/api/bookings/user", { userId });
      if (response.data.success) setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      const response = await axios.post("https://car-rental-system-bd19.onrender.com/api/bookings/cancel", { bookingId, userId: currentUser.username });
      if (response.data.success) fetchBookings(currentUser.username);
      else alert("Failed to cancel");
    } catch (error) {
      alert("Error cancelling");
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>My Bookings</h1>
        {bookings.length === 0 ? (
          <div style={styles.emptyState}>
            <h2>No Bookings Yet</h2>
            <button onClick={() => navigate("/home")}>Explore Cars</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {bookings.map((booking) => (
              <div key={booking.bookingId} style={styles.bookingCard}>
                <div style={styles.bookingHeader}>
                  <span>{booking.bookingId}</span>
                  <span style={styles.status}>{booking.status}</span>
                </div>
                <div style={styles.carInfo}>
                  <img src={booking.car.image} alt={booking.car.model} style={styles.carImage} />
                  <div>
                    <h3>{booking.car.model}</h3>
                    <p>{booking.car.brand}</p>
                    <p>📅 {formatDate(booking.bookingDate)}</p>
                    <p>⏱️ {booking.days} days • ₹{booking.totalPrice}</p>
                  </div>
                </div>
                <button style={styles.cancelBtn} onClick={() => cancelBooking(booking.bookingId)}>Cancel Booking</button>
              </div>
            ))}
          </div>
        )}
        <div style={styles.bottomBackButton}>
          <button onClick={() => navigate("/home")} style={styles.backButton}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: "100vh", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "40px" },
  content: { maxWidth: "800px", margin: "0 auto" },
  title: { textAlign: "center", color: "white", marginBottom: "30px" },
  grid: { display: "grid", gap: "20px" },
  bookingCard: { background: "white", borderRadius: "15px", padding: "20px" },
  bookingHeader: { display: "flex", justifyContent: "space-between", marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "10px" },
  status: { color: "#4caf50", fontWeight: "bold" },
  carInfo: { display: "flex", gap: "15px", marginBottom: "15px" },
  carImage: { width: "100px", height: "70px", objectFit: "cover", borderRadius: "8px" },
  cancelBtn: { padding: "8px 20px", background: "#ff4d4d", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", width: "100%" },
  bottomBackButton: { textAlign: "center", marginTop: "30px" },
  backButton: { padding: "10px 30px", background: "white", border: "none", borderRadius: "25px", cursor: "pointer", fontSize: "14px", fontWeight: "bold", color: "#ff4d4d" },
  emptyState: { textAlign: "center", padding: "60px", background: "white", borderRadius: "15px" },
  loading: { textAlign: "center", padding: "100px", color: "white", fontSize: "24px" }
};

export default MyBookings;