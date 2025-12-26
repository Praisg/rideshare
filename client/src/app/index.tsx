import { View, Text, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { commonStyles } from "@/styles/commonStyles";
import { splashStyles } from "@/styles/splashStyles";
import CustomText from "@/components/shared/CustomText";
import { useUserStore } from "@/store/userStore";
import { useRiderStore } from "@/store/riderStore";
import { tokenStorage } from "@/store/storage";
import { jwtDecode } from "jwt-decode";
import { resetAndNavigate } from "@/utils/Helpers";
import { refresh_tokens } from "@/service/apiInterceptors";
import { logout } from "@/service/authService";

interface DecodedToken {
  exp: number;
}

const Main = () => {
  const [loaded] = useFonts({
    Bold: require("../assets/fonts/NotoSans-Bold.ttf"),
    Regular: require("../assets/fonts/NotoSans-Regular.ttf"),
    Medium: require("../assets/fonts/NotoSans-Medium.ttf"),
    Light: require("../assets/fonts/NotoSans-Light.ttf"),
    SemiBold: require("../assets/fonts/NotoSans-SemiBold.ttf"),
  });

  const { user: customerUser } = useUserStore();
  const { user: riderUser } = useRiderStore();

  const [hasNavigated, setHasNavigated] = useState(false);

  const tokenCheck = async () => {
    const onboarding_completed = tokenStorage.getString("onboarding_completed");
    
    if (!onboarding_completed) {
      resetAndNavigate("/onboarding");
      return;
    }

    const access_token = tokenStorage.getString("access_token") as string;
    const refresh_token = tokenStorage.getString("refresh_token") as string;

    if (access_token) {
      const decodedAccessToken = jwtDecode<DecodedToken>(access_token);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refresh_token);

      const currentTime = Date.now() / 1000;

      if (decodedRefreshToken?.exp < currentTime) {
        logout();
        Alert.alert("Session Expired, please login again");
      }

      if (decodedAccessToken?.exp < currentTime) {
        try {
          refresh_tokens();
        } catch (err) {
          console.log(err);
          Alert.alert("Refresh Token Error");
        }
      }

      if (customerUser?.role === "customer") {
        resetAndNavigate("/customer/home");
      } else if (riderUser?.role === "rider") {
        // TEMPORARY: KYC disabled for testing
        resetAndNavigate("/rider/home");
        
        /* ENABLE THIS WHEN READY TO TEST KYC:
        const kycStatus = riderUser.kyc?.status || "pending";
        if (kycStatus === "approved") {
          resetAndNavigate("/rider/home");
        } else {
          resetAndNavigate("/rider/kyc-verification");
        }
        */
      } else {
        resetAndNavigate("/auth");
      }

      return;
    }

    resetAndNavigate("/auth");
  };

  useEffect(() => {
    if (loaded && !hasNavigated) {
      const timeoutId = setTimeout(() => {
        tokenCheck();
        setHasNavigated(true);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [loaded, hasNavigated]);

  return (
    <View style={commonStyles.container}>
      <Image
        source={require("@/assets/images/logo_t.png")}
        style={splashStyles.img}
      />
      <CustomText variant="h5" fontFamily="Medium" style={splashStyles.text}>
        Made in 🇿🇼
      </CustomText>
    </View>
  );
};

export default Main;
