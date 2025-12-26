import { useRiderStore } from "@/store/riderStore";
import { tokenStorage } from "@/store/storage";
import { useUserStore } from "@/store/userStore";
import { resetAndNavigate } from "@/utils/Helpers";
import axios from "axios";
import { Alert } from "react-native";
import { BASE_URL } from "./config";

export const signin = async (
  payload: {
    role: "customer" | "rider";
    phone: string;
  },
  updateAccessToken: () => void
) => {
  const { setUser } = useUserStore.getState();
  const { setUser: setRiderUser } = useRiderStore.getState();

  console.log("Attempting sign-in...");
  console.log("BASE_URL:", BASE_URL);
  console.log("Payload:", payload);

  try {
    const res = await axios.post(`${BASE_URL}/auth/signin`, payload, {
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("Sign-in successful:", res.data);
    
    if (res.data.user.role === "customer") {
      setUser(res.data.user);
    } else {
      setRiderUser(res.data.user);
    }

    tokenStorage.set("access_token", res.data.access_token);
    tokenStorage.set("refresh_token", res.data.refresh_token);

    if (res.data.user.role === "customer") {
      resetAndNavigate("/customer/home");
    } else {
      // TEMPORARY: KYC disabled for testing
      resetAndNavigate("/rider/home");
      
      /* ENABLE THIS WHEN READY TO TEST KYC:
      const kycStatus = res.data.user.kyc?.status || "pending";
      if (kycStatus === "approved") {
        resetAndNavigate("/rider/home");
      } else {
        resetAndNavigate("/rider/kyc-verification");
      }
      */
    }

    updateAccessToken();
  } catch (error: any) {
    console.log("Sign-in failed!");
    console.log("Error code:", error?.code);
    console.log("Error message:", error?.message);
    console.log("Response status:", error?.response?.status);
    console.log("Response data:", error?.response?.data);
    
    let errorMessage = "Unable to connect to server";
    
    if (error?.code === "ECONNABORTED") {
      errorMessage = "Connection timeout. Please check your network.";
    } else if (error?.code === "ERR_NETWORK" || error?.message?.includes("Network Error")) {
      errorMessage = "Network error. Make sure the server is running at " + BASE_URL;
    } else if (error?.response?.data?.msg) {
      errorMessage = error.response.data.msg;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    Alert.alert("Sign-in Error", errorMessage);
  }
};

export const logout = async (disconnect?: () => void) => {
  if (disconnect) {
    disconnect();
  }
  const { clearData } = useUserStore.getState();
  const { clearRiderData } = useRiderStore.getState();

  tokenStorage.clearAll();
  clearRiderData();
  clearData();
  resetAndNavigate("/auth");
};
