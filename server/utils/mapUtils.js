import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCh1ybEuYu7ypDnz0JUrHHdVVDZPh8zJRs';

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const estimateRideTime = (distanceKm) => {
  const averageCitySpeedKmh = 25;
  return (distanceKm / averageCitySpeedKmh) * 60;
};

export const calculateSurgeMultiplier = (activeRides = 0, availableRiders = 0, timeOfDay = null) => {
  if (availableRiders === 0) return 2.0;
  
  const demandSupplyRatio = activeRides / availableRiders;
  
  let surgeMultiplier = 1.0;
  
  if (demandSupplyRatio > 3.0) {
    surgeMultiplier = 2.5;
  } else if (demandSupplyRatio > 2.0) {
    surgeMultiplier = 2.0;
  } else if (demandSupplyRatio > 1.5) {
    surgeMultiplier = 1.5;
  } else if (demandSupplyRatio > 1.0) {
    surgeMultiplier = 1.3;
  }
  
  const hour = timeOfDay ? new Date(timeOfDay).getHours() : new Date().getHours();
  const isPeakHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
  
  if (isPeakHour && surgeMultiplier < 1.2) {
    surgeMultiplier = 1.2;
  }
  
  return Math.round(surgeMultiplier * 10) / 10;
};

export const calculateFare = (distance, surgeMultiplier = 1.0) => {
  const estimatedTimeMinutes = estimateRideTime(distance);
  
  const rateStructure = {
    bike: {
      baseFare: 2.0,
      costPerMinute: 0.15,
      costPerKm: 0.8,
      bookingFee: 1.5,
      minimumFare: 5.0,
    },
    human: {
      baseFare: 3.0,
      costPerMinute: 0.20,
      costPerKm: 1.0,
      bookingFee: 2.0,
      minimumFare: 7.0,
    },
    cabEconomy: {
      baseFare: 4.0,
      costPerMinute: 0.30,
      costPerKm: 1.5,
      bookingFee: 2.5,
      minimumFare: 10.0,
    },
    cabPremium: {
      baseFare: 6.0,
      costPerMinute: 0.50,
      costPerKm: 2.5,
      bookingFee: 3.5,
      minimumFare: 15.0,
    },
  };

  const fareCalculation = (baseFare, costPerMinute, costPerKm, bookingFee, minimumFare) => {
    const standardFare = 
      baseFare + 
      (costPerMinute * estimatedTimeMinutes) + 
      (costPerKm * distance) + 
      bookingFee;
    
    const fareWithSurge = standardFare * surgeMultiplier;
    return Math.max(fareWithSurge, minimumFare);
  };

  return {
    bike: fareCalculation(
      rateStructure.bike.baseFare,
      rateStructure.bike.costPerMinute,
      rateStructure.bike.costPerKm,
      rateStructure.bike.bookingFee,
      rateStructure.bike.minimumFare
    ),
    human: fareCalculation(
      rateStructure.human.baseFare,
      rateStructure.human.costPerMinute,
      rateStructure.human.costPerKm,
      rateStructure.human.bookingFee,
      rateStructure.human.minimumFare
    ),
    cabEconomy: fareCalculation(
      rateStructure.cabEconomy.baseFare,
      rateStructure.cabEconomy.costPerMinute,
      rateStructure.cabEconomy.costPerKm,
      rateStructure.cabEconomy.bookingFee,
      rateStructure.cabEconomy.minimumFare
    ),
    cabPremium: fareCalculation(
      rateStructure.cabPremium.baseFare,
      rateStructure.cabPremium.costPerMinute,
      rateStructure.cabPremium.costPerKm,
      rateStructure.cabPremium.bookingFee,
      rateStructure.cabPremium.minimumFare
    ),
    estimatedTime: Math.round(estimatedTimeMinutes),
    surgeMultiplier: surgeMultiplier,
  };
};

export const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const getSuggestedPriceRange = (distance, vehicleType, surgeMultiplier = 1.0) => {
  const fareBreakdown = calculateFare(distance, surgeMultiplier);
  const calculatedFare = fareBreakdown[vehicleType];
  
  const minPrice = Math.max(calculatedFare * 0.7, fareBreakdown[vehicleType] - 5);
  const maxPrice = calculatedFare * 1.3;
  const suggestedPrice = calculatedFare;
  
  return {
    min: Math.round(minPrice * 100) / 100,
    max: Math.round(maxPrice * 100) / 100,
    suggested: Math.round(suggestedPrice * 100) / 100,
    calculatedFare: Math.round(calculatedFare * 100) / 100,
  };
};

export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );
    if (response.data.status === 'OK' && response.data.results[0]) {
      return response.data.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error.message);
    return null;
  }
};

export const getPlacesSuggestions = async (query, location) => {
  try {
    const params = {
      input: query,
      key: GOOGLE_MAPS_API_KEY,
    };
    
    if (location?.latitude && location?.longitude) {
      params.location = `${location.latitude},${location.longitude}`;
      params.radius = 50000;
    }

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
      { params }
    );
    
    if (response.data.status === 'OK' && response.data.predictions) {
      return response.data.predictions.map((item) => ({
        place_id: item.place_id,
        title: item.structured_formatting.main_text,
        description: item.description,
      }));
    }
    return [];
  } catch (error) {
    console.error('Places suggestions error:', error.message);
    return [];
  }
};

export const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`,
      {
        params: {
          placeid: placeId,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );
    
    if (response.data.status === 'OK' && response.data.result) {
      const location = response.data.result.geometry.location;
      const address = response.data.result.formatted_address;
      return {
        latitude: location.lat,
        longitude: location.lng,
        address: address,
      };
    }
    return null;
  } catch (error) {
    console.error('Place details error:', error.message);
    return null;
  }
};
