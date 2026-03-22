import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CustomDropdown({ label, options, value, setValue }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ margin: "12px 0", position: "relative", height: "50px" }}>
      <div style={dropdownStyles.box} onClick={() => setOpen(!open)}>{value || label}</div>
      {open && (
        <div style={dropdownStyles.menu}>
          {options.map((item, index) => (
            <div key={index} style={dropdownStyles.item} onClick={() => { setValue(item); setOpen(false); }}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [budget, setBudget] = useState("");
  const [fuel, setFuel] = useState("");
  const [type, setType] = useState("");
  const [preferredFeatures, setPreferredFeatures] = useState([]);
  const [showML, setShowML] = useState(false);
  const availableFeatures = ["Sunroof", "Automatic", "Leather Seats", "Navigation", "Premium Sound", "Reverse Camera", "Bluetooth", "4x4"];

  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.card}>
        <h2 style={styles.heading}>🚗 Find Your Perfect Ride</h2>
        <p style={styles.subheading}>Choose your preferences and explore the best cars</p>
        <CustomDropdown label="Select Budget" options={["₹500 - ₹1000", "₹1000 - ₹2000", "₹2000 - ₹4000", "₹4000 - ₹8000"]} value={budget} setValue={setBudget} />
        <CustomDropdown label="Fuel Type" options={["Petrol", "Diesel", "Electric"]} value={fuel} setValue={setFuel} />
        <CustomDropdown label="Car Type" options={["Hatchback", "Sedan", "SUV", "Luxury", "Sports"]} value={type} setValue={setType} />
        
        <button onClick={() => setShowML(!showML)} style={{...styles.mlToggle, background: showML ? "#ff4d4d" : "rgba(255,255,255,0.2)"}}>
          {showML ? "Hide" : "Show"} 🤖 AI Recommendations
        </button>
        
        {showML && (
          <div style={styles.mlSection}>
            <h4>✨ Select Your Preferred Features</h4>
            <div style={styles.featuresGrid}>
              {availableFeatures.map(feature => (
                <button key={feature} style={{...styles.featureBtn, background: preferredFeatures.includes(feature) ? "#ff4d4d" : "rgba(255,255,255,0.2)"}} onClick={() => {
                  if (preferredFeatures.includes(feature)) setPreferredFeatures(preferredFeatures.filter(f => f !== feature));
                  else setPreferredFeatures([...preferredFeatures, feature]);
                }}>{feature}</button>
              ))}
            </div>
          </div>
        )}
        
        <button style={styles.button} onClick={() => {
          if (!budget || !fuel || !type) { alert("Please select all options"); return; }
          navigate("/carresults", { state: { budget, fuel, type, preferredFeatures } });
        }}>🚀 Explore Cars</button>
        
        <div style={styles.bookingsLink}>
          <span style={styles.linkText} onClick={() => navigate("/mybookings")}>📋 View My Bookings</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { width: "100vw", height: "100vh", backgroundImage: "url('https://images.unsplash.com/photo-1494976388531-d1058494cdd8')", backgroundSize: "cover", backgroundPosition: "center", display: "flex", justifyContent: "center", alignItems: "center", position: "relative" },
  overlay: { position: "absolute", width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(0,0,40,0.8))" },
  card: { position: "relative", width: "450px", maxWidth: "90%", padding: "40px", borderRadius: "25px", background: "rgba(255,255,255,0.1)", backdropFilter: "blur(15px)", textAlign: "center", color: "white", border: "1px solid rgba(255,255,255,0.2)", maxHeight: "90vh", overflowY: "auto" },
  heading: { marginBottom: "10px", fontSize: "28px", fontWeight: "700", background: "linear-gradient(45deg, #fff, #ff4b2b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subheading: { marginBottom: "30px", fontSize: "14px", opacity: 0.8 },
  button: { width: "100%", padding: "14px", marginTop: "25px", borderRadius: "12px", border: "none", background: "linear-gradient(45deg, #ff416c, #ff4b2b)", color: "white", fontWeight: "700", fontSize: "16px", cursor: "pointer" },
  mlToggle: { width: "100%", padding: "10px", marginTop: "15px", borderRadius: "10px", border: "none", color: "white", cursor: "pointer", fontSize: "14px" },
  mlSection: { marginTop: "20px", padding: "15px", background: "rgba(255,255,255,0.1)", borderRadius: "12px", textAlign: "left" },
  featuresGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", marginTop: "10px" },
  featureBtn: { padding: "8px", borderRadius: "8px", border: "none", color: "white", cursor: "pointer", fontSize: "12px" },
  bookingsLink: { marginTop: "20px", paddingTop: "15px", borderTop: "1px solid rgba(255,255,255,0.2)" },
  linkText: { color: "#00c3ff", cursor: "pointer", fontSize: "14px", fontWeight: "500" }
};

const dropdownStyles = {
  box: { width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,0.15)", color: "white", cursor: "pointer", backdropFilter: "blur(5px)" },
  menu: { position: "absolute", top: "100%", left: 0, width: "100%", background: "rgba(0,0,0,0.95)", borderRadius: "12px", marginTop: "5px", zIndex: 999, maxHeight: "200px", overflowY: "auto" },
  item: { padding: "12px", color: "white", cursor: "pointer" }
};

export default Home;