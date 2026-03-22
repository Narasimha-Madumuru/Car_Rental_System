import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import CarRecommendationML from "../utils/mlRecommendation";

function CarResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { budget, fuel, type, preferredFeatures = [] } = location.state || {};
  const [cars, setCars] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("all");

  useEffect(() => {
    if (!budget || !fuel || !type) {
      navigate("/home");
      return;
    }
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await axios.post("https://car-rental-system-bd19.onrender.com/api/cars/filter", { budget, fuel, type });
      if (response.data.success && response.data.cars.length > 0) {
        setCars(response.data.cars);
        const mlRecs = CarRecommendationML.getRecommendations(response.data.cars, { budget, fuel, type, preferredFeatures }, 5);
        setRecommendations(mlRecs);
      } else {
        setError("No cars found");
      }
    } catch (error) {
      setError("Failed to connect");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (car) => {
    navigate("/booking", { state: { car, budget, fuel, type, preferredFeatures } });
  };

  const displayCars = viewMode === "recommended" ? recommendations : cars;

  if (loading) return <div style={styles.loadingContainer}><div style={styles.loader}></div><h2>Finding cars...</h2></div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.headerSection}>
        <h1 style={styles.mainTitle}>Available Cars</h1>
        <div style={styles.filterTags}>
          <span style={styles.filterTag}>💰 {budget}</span>
          <span style={styles.filterTag}>⛽ {fuel}</span>
          <span style={styles.filterTag}>🚘 {type}</span>
        </div>
        <div style={styles.toggleContainer}>
          <button onClick={() => setViewMode("all")} style={{...styles.toggleBtn, background: viewMode === "all" ? "#ff4d4d" : "rgba(255,255,255,0.2)"}}>All Cars ({cars.length})</button>
          <button onClick={() => setViewMode("recommended")} style={{...styles.toggleBtn, background: viewMode === "recommended" ? "#ff4d4d" : "rgba(255,255,255,0.2)"}}>🤖 AI Picks ({recommendations.length})</button>
        </div>
      </div>

      <div style={styles.resultsSection}>
        {error && <div style={styles.errorBox}><p>{error}</p><button onClick={() => navigate("/home")}>Try Again</button></div>}
        {displayCars.length > 0 ? (
          <div style={styles.cardsGrid}>
            {displayCars.map((car, index) => (
              <div key={index} style={styles.carCard}>
                {car.recommendationBadge && <div style={{...styles.aiBadge, backgroundColor: car.recommendationBadge.color}}>{car.recommendationBadge.icon} {car.recommendationBadge.text} ({Math.round(car.mlScore * 100)}%)</div>}
                <div style={styles.imageContainer}><img src={car.image} alt={car.model} style={styles.carImage} /><div style={styles.availabilityBadge}>{car.isAvailable ? "Available" : "Booked"}</div></div>
                <div style={styles.cardContent}>
                  <h3 style={styles.carName}>{car.model}</h3>
                  <p style={styles.carBrand}>{car.brand}</p>
                  <div style={styles.specsRow}>
                    <span>⛽ {car.fuelType}</span> <span>⚙️ {car.transmission}</span> <span>👥 {car.seats} Seats</span>
                  </div>
                  <div style={styles.featuresRow}>{car.features?.slice(0,3).map((f,i) => <span key={i} style={styles.featurePill}>{f}</span>)}</div>
                  <div style={styles.footerRow}><span style={styles.price}>₹{car.pricePerDay}<span style={styles.perDay}>/day</span></span><button style={styles.bookBtn} onClick={() => handleBookNow(car)}>Book Now →</button></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.noResults}><h2>No cars found</h2><button onClick={() => navigate("/home")}>Search Again</button></div>
        )}
      </div>
      <div style={styles.bottomBackButton}><button onClick={() => navigate("/home")} style={styles.backButton}>← Back to Home</button></div>
    </div>
  );
}

const styles = {
  pageContainer: { minHeight: "100vh", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "30px 40px 100px 40px" },
  headerSection: { maxWidth: "1200px", margin: "0 auto 40px auto", textAlign: "center" },
  mainTitle: { fontSize: "48px", fontWeight: "700", color: "white", marginBottom: "20px" },
  filterTags: { display: "flex", justifyContent: "center", gap: "15px", marginBottom: "30px", flexWrap: "wrap" },
  filterTag: { padding: "8px 24px", background: "rgba(255,255,255,0.2)", borderRadius: "30px", color: "white" },
  toggleContainer: { display: "flex", justifyContent: "center", gap: "15px", marginTop: "20px" },
  toggleBtn: { padding: "12px 28px", border: "none", borderRadius: "30px", color: "white", cursor: "pointer", fontWeight: "600" },
  resultsSection: { maxWidth: "1200px", margin: "0 auto" },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "30px" },
  carCard: { background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 15px 35px rgba(0,0,0,0.2)", position: "relative" },
  aiBadge: { position: "absolute", top: "15px", right: "15px", padding: "5px 12px", borderRadius: "20px", color: "white", fontSize: "11px", fontWeight: "bold", zIndex: 2 },
  imageContainer: { position: "relative", height: "220px" },
  carImage: { width: "100%", height: "100%", objectFit: "cover" },
  availabilityBadge: { position: "absolute", bottom: "15px", left: "15px", padding: "5px 12px", background: "#4caf50", borderRadius: "20px", color: "white", fontSize: "11px" },
  cardContent: { padding: "20px" },
  carName: { fontSize: "22px", fontWeight: "700", margin: "0 0 5px 0" },
  carBrand: { fontSize: "14px", color: "#666", marginBottom: "15px" },
  specsRow: { display: "flex", gap: "15px", marginBottom: "15px", fontSize: "13px", color: "#555" },
  featuresRow: { display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" },
  featurePill: { padding: "4px 12px", background: "#f0f0f0", borderRadius: "20px", fontSize: "11px" },
  footerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #eee", paddingTop: "15px" },
  price: { fontSize: "28px", fontWeight: "800", color: "#ff4d4d" },
  perDay: { fontSize: "12px", color: "#888" },
  bookBtn: { padding: "10px 24px", background: "linear-gradient(45deg, #ff416c, #ff4b2b)", border: "none", borderRadius: "30px", color: "white", fontWeight: "600", cursor: "pointer" },
  bottomBackButton: { textAlign: "center", marginTop: "60px" },
  backButton: { padding: "14px 40px", background: "white", border: "none", borderRadius: "40px", cursor: "pointer", fontSize: "16px", fontWeight: "600", color: "#ff4d4d" },
  loadingContainer: { width: "100vw", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "white" },
  loader: { width: "50px", height: "50px", border: "3px solid rgba(255,255,255,0.3)", borderTop: "3px solid white", borderRadius: "50%", animation: "spin 1s linear infinite", marginBottom: "20px" },
  errorBox: { textAlign: "center", padding: "40px", background: "white", borderRadius: "20px", maxWidth: "500px", margin: "0 auto" },
  noResults: { textAlign: "center", padding: "60px", background: "white", borderRadius: "20px", maxWidth: "500px", margin: "0 auto" }
};

const styleSheet = document.createElement("style");
styleSheet.textContent = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;
document.head.appendChild(styleSheet);

export default CarResults;