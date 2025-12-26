import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { BASE_URL } from "@/service/config";

export const getLatLong = async (placeId: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/maps/place-details`, {
            params: {
                placeId: placeId,
            },
        });
        
        if (response.data.details) {
            return response.data.details;
        } else {
            throw new Error('Unable to fetch location details');
        }
    } catch (error) {
        console.log('Error fetching place details:', error);
        throw new Error('Unable to fetch location details');
    }
}

export const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/maps/reverse-geocode`, {
            params: {
                latitude,
                longitude,
            },
        });
        
        if (response.data.address) {
            return response.data.address;
        }
        return "";
    } catch (error) {
        console.log('Error during reverse geocoding: ', error);
        return "";
    }
};

export const getPlacesSuggestions = async (query: string) => {
    const { location } = useUserStore.getState();
    try {
        const params: any = { query };
        
        if (location?.latitude && location?.longitude) {
            params.latitude = location.latitude;
            params.longitude = location.longitude;
        }

        const response = await axios.get(`${BASE_URL}/maps/autocomplete`, {
            params,
        });
        
        return response.data.suggestions || [];
    } catch (error) {
        console.log('Error fetching autocomplete suggestions:', error);
        return [];
    }
};

export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const estimateRideTime = (distanceKm: number): number => {
    const averageCitySpeedKmh = 25;
    return (distanceKm / averageCitySpeedKmh) * 60;
};

export const calculateSurgeMultiplier = (
    activeRides: number = 0, 
    availableRiders: number = 0, 
    timeOfDay: Date | null = null
): number => {
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

export const calculateFare = (distance: number, surgeMultiplier: number = 1.0) => {
    const estimatedTimeMinutes = estimateRideTime(distance);
    
    const rateStructure = {
        bike: {
            baseFare: 2.0,
            costPerMinute: 0.15,
            costPerKm: 0.8,
            bookingFee: 1.5,
            minimumFare: 5.0,
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

    const fareCalculation = (
        baseFare: number, 
        costPerMinute: number, 
        costPerKm: number, 
        bookingFee: number, 
        minimumFare: number
    ): number => {
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

function quadraticBezierCurve(p1: any, p2: any, controlPoint: any, numPoints: any) {
    const points = [];
    const step = 1 / (numPoints - 1);

    for (let t = 0; t <= 1; t += step) {
        const x =
            (1 - t) ** 2 * p1[0] +
            2 * (1 - t) * t * controlPoint[0] +
            t ** 2 * p2[0];
        const y =
            (1 - t) ** 2 * p1[1] +
            2 * (1 - t) * t * controlPoint[1] +
            t ** 2 * p2[1];
        const coord = { latitude: x, longitude: y };
        points.push(coord);
    }

    return points;
}

const calculateControlPoint = (p1: any, p2: any) => {
    const d = Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2);
    const scale = 1; // Scale factor to reduce bending
    const h = d * scale; // Reduced distance from midpoint
    const w = d / 2;
    const x_m = (p1[0] + p2[0]) / 2;
    const y_m = (p1[1] + p2[1]) / 2;

    const x_c =
        x_m +
        ((h * (p2[1] - p1[1])) /
            (2 * Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2))) *
        (w / d);
    const y_c =
        y_m -
        ((h * (p2[0] - p1[0])) /
            (2 * Math.sqrt((p2[0] - p1[0]) ** 2 + (p2[1] - p1[1]) ** 2))) *
        (w / d);

    const controlPoint = [x_c, y_c];
    return controlPoint;
};

export const getPoints = (places: any) => {
    const p1 = [places[0].latitude, places[0].longitude];
    const p2 = [places[1].latitude, places[1].longitude];
    const controlPoint = calculateControlPoint(p1, p2);

    return quadraticBezierCurve(p1, p2, controlPoint, 100);
};

export const vehicleIcons: Record<'bike' | 'cabEconomy' | 'cabPremium', { icon: any }> = {
    bike: { icon: require('@/assets/icons/bike.png') },
    cabEconomy: { icon: require('@/assets/icons/cab.png') },
    cabPremium: { icon: require('@/assets/icons/cab_premium.png') },
  };

export const getSuggestedPriceRange = (distance: number, vehicleType: string, surgeMultiplier: number = 1.0) => {
    const fareBreakdown = calculateFare(distance, surgeMultiplier);
    const calculatedFare = fareBreakdown[vehicleType as keyof typeof fareBreakdown];
    
    if (typeof calculatedFare !== 'number') {
        return {
            min: 0,
            max: 0,
            suggested: 0,
            calculatedFare: 0,
        };
    }
    
    const minPrice = Math.max(calculatedFare * 0.7, calculatedFare - 5);
    const maxPrice = calculatedFare * 1.3;
    const suggestedPrice = calculatedFare;
    
    return {
        min: Math.round(minPrice * 100) / 100,
        max: Math.round(maxPrice * 100) / 100,
        suggested: Math.round(suggestedPrice * 100) / 100,
        calculatedFare: Math.round(calculatedFare * 100) / 100,
    };
};
  