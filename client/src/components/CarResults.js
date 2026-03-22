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
      setError("");
      
      const response = await axios.post(
        "https://car-rental-system-bd19.onrender.com/api/cars/filter",
        { budget, fuel, type }
      );
      
      if (response.data.success && response.data.cars.length > 0) {
        setCars(response.data.cars);
        const mlRecs = CarRecommendationML.getRecommendations(
          response.data.cars,
          { budget, fuel, type, preferredFeatures },
          5
        );
        setRecommendations(mlRecs);
      } else {
        setCars([]);
        setRecommendations([]);
        setError("No cars found for your selection");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (car) => {
    navigate("/booking", { state: { car } });
  };

  const displayCars = viewMode === "recommended" ? recommendations : cars;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <h2>Finding your perfect ride...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      
      <div style={styles.content}>
        <button style={styles.backButton} onClick={() => navigate("/home")}>
          ← Back to Search
        </button>

        <h1 style={styles.title}>🚗 Available Cars</h1>
        
        <div style={styles.filters}>
          <span style={styles.filterBadge}>💰 {budget}</span>
          <span style={styles.filterBadge}>⛽ {fuel}</span>
          <span style={styles.filterBadge}>🚘 {type}</span>
        </div>
        
        <div style={styles.viewToggle}>
          <button 
            style={{...styles.toggleBtn, ...(viewMode === "all" ? styles.activeToggle : {})}}
            onClick={() => setViewMode("all")}
          >
            All Cars ({cars.length})
          </button>
          <button 
            style={{...styles.toggleBtn, ...(viewMode === "recommended" ? styles.activeToggle : {})}}
            onClick={() => setViewMode("recommended")}
          >
            🤖 AI Recommendations ({recommendations.length})
          </button>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <p>{error}</p>
            <button onClick={() => navigate("/home")}>Try Different Filters</button>
          </div>
        )}

        {!error && displayCars.length === 0 && (
          <div style={styles.noResults}>
            <h2>No cars match your criteria</h2>
            <p>Try adjusting your budget, fuel type, or car category</p>
            <button onClick={() => navigate("/home")}>Search Again</button>
          </div>
        )}

        {displayCars.length > 0 && (
          <>
            <p style={styles.resultCount}>
              {viewMode === "recommended" ? "🤖 AI Recommended for You" : `Found ${displayCars.length} car${displayCars.length !== 1 ? 's' : ''}`}
            </p>
            <div style={styles.grid}>
              {displayCars.map((car, index) => (
                <div key={index} style={styles.carCard}>
                  {car.recommendationBadge && (
                    <div style={{...styles.mlBadge, backgroundColor: car.recommendationBadge.color}}>
                      {car.recommendationBadge.icon} {car.recommendationBadge.text} ({Math.round(car.mlScore * 100)}%)
                    </div>
                  )}
                  <img 
                    src={car.image || "https://via.placeholder.com/400x250?text=Car"} 
                    alt={car.model}
                    style={styles.carImage}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x250?text=" + car.model;
                    }}
                  />
                  <div style={styles.carDetails}>
                    <h3 style={styles.carModel}>{car.model}</h3>
                    <p style={styles.carBrand}>{car.brand}</p>
                    
                    <div style={styles.specs}>
                      <span>⛽ {car.fuelType}</span>
                      <span>⚙️ {car.transmission}</span>
                      <span>👥 {car.seats} seats</span>
                      {car.rating && <span>⭐ {car.rating}</span>}
                    </div>
                    
                    <div style={styles.features}>
                      {car.features && car.features.slice(0, 3).map((feature, i) => (
                        <span key={i} style={styles.featureTag}>{feature}</span>
                      ))}
                    </div>
                    
                    <div style={styles.priceSection}>
                      <div>
                        <span style={styles.price}>₹{car.pricePerDay}</span>
                        <span style={styles.perDay}>/day</span>
                      </div>
                      <button 
                        style={styles.bookButton}
                        onClick={() => handleBookNow(car)}
                      >
                        Book Now →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    position: "relative"
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    zIndex: 0
  },
  content: {
    position: "relative",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    zIndex: 1
  },
  backButton: {
    padding: "10px 20px",
    background: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "30px"
  },
  title: {
    textAlign: "center",
    color: "white",
    fontSize: "42px",
    marginBottom: "20px"
  },
  filters: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },
  filterBadge: {
    padding: "8px 20px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "25px",
    color: "white",
    fontSize: "14px"
  },
  viewToggle: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "30px"
  },
  toggleBtn: {
    padding: "10px 25px",
    background: "rgba(255,255,255,0.2)",
    border: "none",
    borderRadius: "25px",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold"
  },
  activeToggle: {
    background: "#ff4d4d"
  },
  resultCount: {
    textAlign: "center",
    color: "white",
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "30px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "30px"
  },
  carCard: {
    background: "white",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    position: "relative"
  },
  mlBadge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    padding: "5px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "11px",
    fontWeight: "bold",
    zIndex: 2
  },
  carImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover"
  },
  carDetails: {
    padding: "20px"
  },
  carModel: {
    fontSize: "22px",
    margin: "0 0 5px 0",
    color: "#333"
  },
  carBrand: {
    color: "#666",
    marginBottom: "15px",
    fontSize: "14px"
  },
  specs: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
    fontSize: "13px",
    color: "#555",
    flexWrap: "wrap"
  },
  features: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "20px"
  },
  featureTag: {
    padding: "4px 10px",
    background: "#f0f0f0",
    borderRadius: "15px",
    fontSize: "11px",
    color: "#666"
  },
  priceSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #eee",
    paddingTop: "15px"
  },
  price: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#ff4d4d"
  },
  perDay: {
    fontSize: "12px",
    color: "#666"
  },
  bookButton: {
    padding: "10px 20px",
    background: "#ff4d4d",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold",
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
  },
  errorBox: {
    textAlign: "center",
    padding: "40px",
    background: "rgba(255,255,255,0.9)",
    borderRadius: "15px",
    maxWidth: "500px",
    margin: "0 auto"
  },
  noResults: {
    textAlign: "center",
    padding: "60px",
    background: "rgba(255,255,255,0.9)",
    borderRadius: "15px",
    maxWidth: "500px",
    margin: "0 auto"
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

export default CarResults;