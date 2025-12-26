import {
  View,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useWS } from "@/service/WSProvider";
import { useRiderStore } from "@/store/riderStore";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import { riderStyles } from "@/styles/riderStyles";
import { commonStyles } from "@/styles/commonStyles";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { logout } from "@/service/authService";
import CustomText from "../shared/CustomText";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "@/utils/Constants";
import { getRiderEarnings } from "@/service/kycService";

const RiderHeader = () => {
  const { disconnect, emit } = useWS();
  const { setOnDuty, onDuty, setLocation } = useRiderStore();
  const isFocused = useIsFocused();
  const [earnings, setEarnings] = useState({ total: 0, available: 0 });
  const [loadingEarnings, setLoadingEarnings] = useState(true);

  const toggleOnDuty = async () => {
    if (onDuty) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to go on duty."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude, heading } = location.coords;
      setLocation({
        latitude: latitude,
        longitude: longitude,
        address: "Somewhere",
        heading: heading as number,
      });
      emit("goOnDuty", {
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
        heading: heading,
      });
    } else {
      emit("goOffDuty");
    }
  };

  const fetchEarnings = async () => {
    setLoadingEarnings(true);
    const result = await getRiderEarnings();
    if (result.success) {
      setEarnings(result.data.earnings);
    }
    setLoadingEarnings(false);
  };

  useEffect(() => {
    if (isFocused) {
      toggleOnDuty();
      fetchEarnings();
    }
  }, [isFocused, onDuty]);

  return (
    <>
      <View style={riderStyles.headerContainer}>
        <SafeAreaView />

        <View style={commonStyles.flexRowBetween}>
          <FontAwesome
            onPress={() => logout(disconnect)}
            name="power-off"
            size={24}
            color={Colors.text}
          />

          <TouchableOpacity
            style={riderStyles.toggleContainer}
            onPress={() => setOnDuty(!onDuty)}
          >
            <CustomText
              fontFamily="SemiBold"
              fontSize={12}
              style={{ color: "#888" }}
            >
              {onDuty ? "ON-DUTY" : "OFF-DUTY"}
            </CustomText>

            <Image
              source={
                onDuty
                  ? require("@/assets/icons/switch_on.png")
                  : require("@/assets/icons/switch_off.png")
              }
              style={riderStyles.icon}
            />
          </TouchableOpacity>

          <MaterialIcons name="notifications" size={24} color="black" />
        </View>
      </View>

      <View style={riderStyles?.earningContainer}>
        <CustomText fontSize={13} style={{ color: "#fff" }} fontFamily="Medium">
          Total Earnings
        </CustomText>

        <View style={commonStyles?.flexRowGap}>
          {loadingEarnings ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
          <CustomText
            fontSize={14}
            style={{ color: "#fff" }}
            fontFamily="Medium"
          >
              $ {earnings.total.toFixed(2)}
          </CustomText>
          )}
          <MaterialIcons name="arrow-drop-down" size={24} color="#fff" />
        </View>
      </View>
    </>
  );
};

export default RiderHeader;
