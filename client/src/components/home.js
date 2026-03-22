import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/* 🔥 CUSTOM DROPDOWN COMPONENT */
function CustomDropdown({ label, options, value, setValue }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ margin: "12px 0", position: "relative", height: "50px" }}>

      <div
        style={dropdownStyles.box}
        onClick={() => setOpen(!open)}
      >
        {value || label}
      </div>

      {open && (
        <div style={dropdownStyles.menu}>
          {options.map((item, index) => (
            <div
              key={index}
              style={dropdownStyles.item}
              onClick={() => {
                setValue(item);
                setOpen(false);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

/* 🚗 MAIN COMPONENT */
function Home() {

  const navigate = useNavigate();

  const [budget, setBudget] = useState("");
  const [fuel, setFuel] = useState("");
  const [type, setType] = useState("");
  const [preferredFeatures, setPreferredFeatures] = useState([]);
  const [showML, setShowML] = useState(false);

  // Available features for AI preferences
  const availableFeatures = [
    "Sunroof",
    "Automatic",
    "Leather Seats",
    "Navigation",
    "Premium Sound",
    "Reverse Camera",
    "Bluetooth",
    "4x4"
  ];

  return (
    <div style={styles.container}>

      <div style={styles.overlay}></div>

      <div style={styles.card}>

        <h2 style={styles.heading}>🚗 Find Your Perfect Ride</h2>
        <p style={styles.subheading}>Choose your preferences and explore the best cars</p>

        {/* Budget */}
        <CustomDropdown
          label="Select Budget"
          options={[
            "₹500 - ₹1000",
            "₹1000 - ₹2000",
            "₹2000 - ₹4000",
            "₹4000 - ₹8000"
          ]}
          value={budget}
          setValue={setBudget}
        />

        {/* Fuel */}
        <CustomDropdown
          label="Fuel Type"
          options={[
            "Petrol",
            "Diesel",
            "Electric"
          ]}
          value={fuel}
          setValue={setFuel}
        />

        {/* Car Type */}
        <CustomDropdown
          label="Car Type"
          options={[
            "Hatchback",
            "Sedan",
            "SUV",
            "Luxury",
            "Sports"
          ]}
          value={type}
          setValue={setType}
        />

        {/* ML Preferences Toggle Button */}
        <button
          onClick={() => setShowML(!showML)}
          style={{
            ...styles.mlToggle,
            background: showML ? "#ff4d4d" : "rgba(255,255,255,0.2)"
          }}
        >
          {showML ? "Hide" : "Show"} 🤖 AI Recommendations
        </button>

        {/* ML Preferences Section - Shows when toggled */}
        {showML && (
          <div style={styles.mlSection}>
            <h4 style={styles.mlTitle}>✨ Select Your Preferred Features</h4>
            <p style={styles.mlSubtitle}>AI will recommend cars based on these preferences</p>
            <div style={styles.featuresGrid}>
              {availableFeatures.map(feature => (
                <button
                  key={feature}
                  style={{
                    ...styles.featureBtn,
                    background: preferredFeatures.includes(feature) ? "#ff4d4d" : "rgba(255,255,255,0.2)"
                  }}
                  onClick={() => {
                    if (preferredFeatures.includes(feature)) {
                      setPreferredFeatures(preferredFeatures.filter(f => f !== feature));
                    } else {
                      setPreferredFeatures([...preferredFeatures, feature]);
                    }
                  }}
                >
                  {feature}
                </button>
              ))}
            </div>
            {preferredFeatures.length > 0 && (
              <div style={styles.selectedCount}>
                Selected: {preferredFeatures.length} feature{preferredFeatures.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}

        {/* Explore Cars Button */}
        <button
          style={styles.button}
          onClick={() => {
            // Validate at least one selection
            if (!budget || !fuel || !type) {
              alert("Please select Budget, Fuel Type, and Car Type");
              return;
            }
            navigate("/carresults", {
              state: { 
                budget, 
                fuel, 
                type,
                preferredFeatures: preferredFeatures
              }
            });
          }}
        >
          🚀 Explore Cars
        </button>

        {/* My Bookings Link */}
        <div style={styles.bookingsLink}>
          <span 
            style={styles.linkText}
            onClick={() => navigate("/mybookings")}
          >
            📋 View My Bookings
          </span>
        </div>

      </div>

    </div>
  );
}

export default Home;

/* 🎨 STYLES */
const styles = {

  container: {
    width: "100vw",
    height: "100vh",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    fontFamily: "'Poppins', sans-serif"
  },

  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(0,0,40,0.8))"
  },

  card: {
    position: "relative",
    width: "450px",
    maxWidth: "90%",
    padding: "40px",
    borderRadius: "25px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(15px)",
    boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
    textAlign: "center",
    color: "white",
    border: "1px solid rgba(255,255,255,0.2)",
    maxHeight: "90vh",
    overflowY: "auto"
  },

  heading: {
    marginBottom: "10px",
    fontSize: "28px",
    fontWeight: "700",
    letterSpacing: "1px",
    background: "linear-gradient(45deg, #fff, #ff4b2b)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  subheading: {
    marginBottom: "30px",
    fontSize: "14px",
    opacity: 0.8
  },

  button: {
    width: "100%",
    padding: "14px",
    marginTop: "25px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(45deg, #ff416c, #ff4b2b)",
    color: "white",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    transition: "transform 0.3s, box-shadow 0.3s",
    boxShadow: "0 10px 25px rgba(255,75,43,0.4)"
  },

  // ML Toggle Button
  mlToggle: {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    borderRadius: "10px",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "0.3s"
  },

  // ML Section
  mlSection: {
    marginTop: "20px",
    padding: "15px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "12px",
    textAlign: "left",
    border: "1px solid rgba(255,255,255,0.2)"
  },

  mlTitle: {
    margin: "0 0 5px 0",
    fontSize: "14px",
    fontWeight: "600"
  },

  mlSubtitle: {
    margin: "0 0 12px 0",
    fontSize: "11px",
    opacity: 0.7
  },

  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "8px",
    marginTop: "10px"
  },

  featureBtn: {
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    transition: "0.2s",
    textAlign: "center"
  },

  selectedCount: {
    marginTop: "12px",
    fontSize: "11px",
    textAlign: "center",
    opacity: 0.8,
    padding: "5px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "15px"
  },

  bookingsLink: {
    marginTop: "20px",
    paddingTop: "15px",
    borderTop: "1px solid rgba(255,255,255,0.2)"
  },

  linkText: {
    color: "#00c3ff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "0.2s"
  }

};

/* 🔽 DROPDOWN STYLES */
const dropdownStyles = {

  box: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.15)",
    color: "white",
    cursor: "pointer",
    backdropFilter: "blur(5px)",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    transition: "0.3s",
    border: "1px solid rgba(255,255,255,0.2)"
  },

  menu: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    background: "rgba(0,0,0,0.95)",
    borderRadius: "12px",
    marginTop: "5px",
    zIndex: 999,
    maxHeight: "200px",
    overflowY: "auto",
    boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
    border: "1px solid rgba(255,255,255,0.1)"
  },

  item: {
    padding: "12px",
    color: "white",
    cursor: "pointer",
    transition: "0.2s"
  }

};