// Machine Learning Algorithm for Car Recommendations

class CarRecommendationML {
  
  static calculateScore(car, userPreferences) {
    let score = 0;
    
    // Budget compatibility (30%)
    const budgetScore = this.getBudgetScore(car.pricePerDay, userPreferences.budget);
    score += budgetScore * 0.3;
    
    // Fuel compatibility (25%)
    const fuelScore = this.getFuelScore(car.fuelType, userPreferences.fuel);
    score += fuelScore * 0.25;
    
    // Type compatibility (25%)
    const typeScore = this.getTypeScore(car.carType, userPreferences.type);
    score += typeScore * 0.25;
    
    // Features compatibility (20%)
    const featuresScore = this.getFeaturesScore(car.features, userPreferences.preferredFeatures || []);
    score += featuresScore * 0.2;
    
    return Math.round(score * 100) / 100;
  }
  
  static getBudgetScore(price, userBudget) {
    let min, max;
    if (userBudget === "₹500 - ₹1000") { min = 500; max = 1000; }
    else if (userBudget === "₹1000 - ₹2000") { min = 1000; max = 2000; }
    else if (userBudget === "₹2000 - ₹4000") { min = 2000; max = 4000; }
    else { min = 4000; max = 8000; }
    
    if (price >= min && price <= max) return 1.0;
    if (price < min) return 0.7;
    return 0.3;
  }
  
  static getFuelScore(carFuel, userFuel) {
    if (carFuel === userFuel) return 1.0;
    return 0;
  }
  
  static getTypeScore(carType, userType) {
    if (carType === userType) return 1.0;
    return 0.3;
  }
  
  static getFeaturesScore(carFeatures, preferredFeatures) {
    if (!preferredFeatures || preferredFeatures.length === 0) return 0.5;
    let matches = 0;
    preferredFeatures.forEach(pref => {
      if (carFeatures && carFeatures.some(f => f.toLowerCase().includes(pref.toLowerCase()))) {
        matches++;
      }
    });
    return matches / preferredFeatures.length;
  }
  
  static getRecommendations(cars, userPreferences, topN = 5) {
    const scored = cars.map(car => ({
      ...car,
      mlScore: this.calculateScore(car, userPreferences)
    }));
    scored.sort((a, b) => b.mlScore - a.mlScore);
    return scored.slice(0, topN).map(car => ({
      ...car,
      recommendationBadge: this.getBadge(car.mlScore)
    }));
  }
  
  static getBadge(score) {
    if (score >= 0.8) return { text: "Perfect Match", color: "#4caf50", icon: "⭐" };
    if (score >= 0.6) return { text: "Great Match", color: "#2196f3", icon: "👍" };
    if (score >= 0.4) return { text: "Good Match", color: "#ff9800", icon: "👌" };
    return { text: "Maybe", color: "#9e9e9e", icon: "🤔" };
  }
}

export default CarRecommendationML;