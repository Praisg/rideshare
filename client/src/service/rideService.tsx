import { router } from "expo-router";
import { appAxios } from "./apiInterceptors";
import { Alert } from "react-native";
import { resetAndNavigate } from "@/utils/Helpers";

interface coords {
  address: string;
  latitude: number;
  longitude: number;
}

export const createRide = async (payload: {
  vehicle: "bike" | "auto" | "cabEconomy" | "cabPremium";
  pickup: coords;
  drop: coords;
  pricingModel?: "fixed" | "bidding";
  proposedPrice?: number;
  suggestedPriceRange?: { min: number; max: number };
}) => {
  try {
    const res = await appAxios.post(`/ride/create`, payload);
    router?.navigate({
      pathname: "/customer/liveride",
      params: {
        id: res?.data?.ride?._id,
      },
    });
  } catch (error: any) {
    Alert.alert("Oh! Dang there was an error");
    console.log("Error:Create Ride ", error);
  }
};

export const getMyRides = async (isCustomer: boolean = true) => {
  try {
    const res = await appAxios.get(`/ride/rides`);
    const filterRides = res.data.rides?.filter(
      (ride: any) => ride?.status != "COMPLETED"
    );
    if (filterRides?.length > 0) {
      router?.navigate({
        pathname: isCustomer ? "/customer/liveride" : "/rider/liveride",
        params: {
          id: filterRides![0]?._id,
        },
      });
    }
  } catch (error: any) {
    Alert.alert("Oh! Dang there was an error");
    console.log("Error:GET MY Ride ", error);
  }
};

export const acceptRideOffer = async (rideId: string) => {
  try {
    const res = await appAxios.patch(`/ride/accept/${rideId}`);
    resetAndNavigate({
      pathname: "/rider/liveride",
      params: { id: rideId },
    });
  } catch (error: any) {
    Alert.alert("Oh! Dang there was an error");
    console.log(error);
  }
};

export const updateRideStatus = async (rideId: string, status: string) => {
  try {
    const res = await appAxios.patch(`/ride/update/${rideId}`, { status });
    return true;
  } catch (error: any) {
    Alert.alert("Oh! Dang there was an error");
    console.log(error);
    return false;
  }
};

export const submitRating = async (
  rideId: string,
  rating: number,
  feedback: string
) => {
  try {
    const res = await appAxios.post(`/ride/rate/${rideId}`, {
      rating,
      feedback,
    });
    return { success: true, data: res.data };
  } catch (error: any) {
    Alert.alert("Error", "Failed to submit rating");
    console.log("Error:Submit Rating ", error);
    return { success: false };
  }
};
