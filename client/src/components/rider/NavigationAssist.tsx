import { View, TouchableOpacity, Linking, Platform, Alert } from "react-native";
import React, { FC } from "react";
import CustomText from "../shared/CustomText";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/utils/Constants";
import { commonStyles } from "@/styles/commonStyles";

interface NavigationAssistProps {
  pickupLocation: {
    latitude: number;
    longitude: number;
    address: string;
  };
  dropLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  isPickedUp: boolean;
}

const NavigationAssist: FC<NavigationAssistProps> = ({
  pickupLocation,
  dropLocation,
  isPickedUp,
}) => {
  const currentDestination = isPickedUp ? dropLocation : pickupLocation;

  const openGoogleMaps = () => {
    if (!currentDestination) return;

    const scheme = Platform.select({
      ios: "maps://0,0?q=",
      android: "geo:0,0?q=",
    });
    const latLng = `${currentDestination.latitude},${currentDestination.longitude}`;
    const label = encodeURIComponent(currentDestination.address);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.canOpenURL(url!).then((supported) => {
      if (supported) {
        Linking.openURL(url!);
      } else {
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;
        Linking.openURL(webUrl);
      }
    });
  };

  const openWaze = () => {
    if (!currentDestination) return;

    const url = `https://waze.com/ul?ll=${currentDestination.latitude},${currentDestination.longitude}&navigate=yes`;
    
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert("Waze Not Installed", "Please install Waze to use this feature");
      }
    });
  };

  const openAppleMaps = () => {
    if (!currentDestination || Platform.OS !== "ios") return;

    const url = `http://maps.apple.com/?daddr=${currentDestination.latitude},${currentDestination.longitude}`;
    
    Linking.openURL(url);
  };

  if (!currentDestination) return null;

  return (
    <View
      style={{
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={[commonStyles.flexRowBetween, { marginBottom: 12 }]}>
        <View style={commonStyles.flexRow}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isPickedUp ? "#4CAF50" : Colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Ionicons
              name={isPickedUp ? "flag" : "location"}
              size={20}
              color={Colors.white}
            />
          </View>
          <View>
            <CustomText fontFamily="SemiBold" fontSize={14}>
              {isPickedUp ? "Navigate to Drop-off" : "Navigate to Pickup"}
            </CustomText>
            <CustomText fontSize={10} style={{ color: "#666", marginTop: 2 }}>
              Choose your preferred navigation app
            </CustomText>
          </View>
        </View>
      </View>

      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#E5E5E5",
          paddingTop: 12,
        }}
      >
        <CustomText fontSize={10} style={{ color: "#666", marginBottom: 8 }}>
          {currentDestination.address}
        </CustomText>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={openGoogleMaps}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#4285F4",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <MaterialCommunityIcons name="google-maps" size={20} color={Colors.white} />
            <CustomText
              fontFamily="Medium"
              fontSize={12}
              style={{ color: Colors.white, marginLeft: 6 }}
            >
              Google Maps
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={openWaze}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#00D9FF",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <MaterialCommunityIcons name="waze" size={20} color={Colors.white} />
            <CustomText
              fontFamily="Medium"
              fontSize={12}
              style={{ color: Colors.white, marginLeft: 6 }}
            >
              Waze
            </CustomText>
          </TouchableOpacity>

          {Platform.OS === "ios" && (
            <TouchableOpacity
              onPress={openAppleMaps}
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#000",
                padding: 12,
                borderRadius: 8,
              }}
            >
              <Ionicons name="map" size={20} color={Colors.white} />
              <CustomText
                fontFamily="Medium"
                fontSize={12}
                style={{ color: Colors.white, marginLeft: 6 }}
              >
                Apple Maps
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default NavigationAssist;

