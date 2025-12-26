import { auth } from "@/config/firebase";
import {
  PhoneAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useUserStore } from "@/store/userStore";
import { useRiderStore } from "@/store/riderStore";
import { tokenStorage } from "@/store/storage";
import { resetAndNavigate } from "@/utils/Helpers";
import { Alert } from "react-native";
import axios from "axios";
import { BASE_URL } from "./config";

export const sendOTP = async (phoneNumber: string, countryCode: string = "+263") => {
  try {
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;
    
    const provider = new PhoneAuthProvider(auth);
    const verificationId = await provider.verifyPhoneNumber(
      fullPhoneNumber,
      auth as any
    );
    
    return {
      success: true,
      verificationId,
    };
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    
    Alert.alert(
      "Error", 
      "Firebase Phone Authentication requires additional setup for React Native. For now, using fallback authentication."
    );
    
    try {
      const response = await axios.post(`${BASE_URL}/auth/signin`, {
        role: "customer",
        phone: phoneNumber,
      });
      
      return {
        success: true,
        fallback: true,
        data: response.data,
      };
    } catch (fallbackError: any) {
      console.error("Fallback auth error:", fallbackError);
      return {
        success: false,
        error: fallbackError?.message,
      };
    }
  }
};

export const verifyOTP = async (
  verificationId: string,
  otp: string,
  role: "customer" | "rider",
  updateAccessToken: () => void
) => {
  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const userCredential = await signInWithCredential(auth, credential);
    
    const user = userCredential.user;
    const firebaseToken = await user.getIdToken();
    
    const response = await axios.post(`${BASE_URL}/auth/firebase-signin`, {
      firebaseToken,
      role,
      phone: user.phoneNumber,
      uid: user.uid,
    });

    const { setUser } = useUserStore.getState();
    const { setUser: setRiderUser } = useRiderStore.getState();

    if (response.data.user.role === "customer") {
      setUser(response.data.user);
    } else {
      setRiderUser(response.data.user);
    }

    tokenStorage.set("access_token", response.data.access_token);
    tokenStorage.set("refresh_token", response.data.refresh_token);
    tokenStorage.set("firebase_uid", user.uid);

    if (response.data.user.role === "customer") {
      resetAndNavigate("/customer/home");
    } else {
      // TEMPORARY: KYC disabled for testing
      resetAndNavigate("/rider/home");
      
      /* ENABLE THIS WHEN READY TO TEST KYC:
      const kycStatus = response.data.user.kyc?.status || "pending";
      if (kycStatus === "approved") {
        resetAndNavigate("/rider/home");
      } else {
        resetAndNavigate("/rider/kyc-verification");
      }
      */
    }

    updateAccessToken();

    return {
      success: true,
      user: response.data.user,
    };
  } catch (error: any) {
    console.error("Error verifying OTP:", error);
    Alert.alert(
      "Verification Failed",
      error?.response?.data?.msg || error?.message || "Invalid OTP. Please try again."
    );
    return {
      success: false,
      error: error?.message,
    };
  }
};

export const signOutFirebase = async () => {
  try {
    await auth.signOut();
    const { clearData } = useUserStore.getState();
    const { clearRiderData } = useRiderStore.getState();
    
    tokenStorage.clearAll();
    clearRiderData();
    clearData();
    resetAndNavigate("/auth");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

