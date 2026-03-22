class CarRecommendationML {
  static calculateScore(car, preferences) {
    let score = 0;
    let min, max;
    if (preferences.budget === "₹500 - ₹1000") { min = 500; max = 1000; }
    else if (preferences.budget === "₹1000 - ₹2000") { min = 1000; max = 2000; }
    else if (preferences.budget === "₹2000 - ₹4000") { min = 2000; max = 4000; }
    else { min = 4000; max = 8000; }
    
    if (car.pricePerDay >= min && car.pricePerDay <= max) score += 0.3;
    else if (car.pricePerDay < min) score += 0.2;
    else score += 0.1;
    
    if (car.fuelType === preferences.fuel) score += 0.25;
    if (car.carType === preferences.type) score += 0.25;
    
    if (preferences.preferredFeatures && preferences.preferredFeatures.length > 0) {
      let matches = 0;
      preferences.preferredFeatures.forEach(pref => {
        if (car.features && car.features.some(f => f.toLowerCase().includes(pref.toLowerCase()))) matches++;
      });
      score += (matches / preferences.preferredFeatures.length) * 0.2;
    } else {
      score += 0.1;
    }
    return Math.round(score * 100) / 100;
  }
  
  static getRecommendations(cars, preferences, topN = 5) {
    const scored = cars.map(car => ({ ...car, mlScore: this.calculateScore(car, preferences) }));
    scored.sort((a, b) => b.mlScore - a.mlScore);
    return scored.slice(0, topN).map(car => ({
      ...car,
      recommendationBadge: car.mlScore >= 0.8 ? { text: "Perfect Match", color: "#4caf50", icon: "⭐" } :
                           car.mlScore >= 0.6 ? { text: "Great Match", color: "#2196f3", icon: "👍" } :
                           car.mlScore >= 0.4 ? { text: "Good Match", color: "#ff9800", icon: "👌" } :
                           { text: "Maybe", color: "#9e9e9e", icon: "🤔" }
    }));
  }
}

export default CarRecommendationML;