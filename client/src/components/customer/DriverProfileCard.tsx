import { View, Image, TouchableOpacity, Linking } from "react-native";
import React, { FC, useState } from "react";
import CustomText from "../shared/CustomText";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { commonStyles } from "@/styles/commonStyles";
import { Colors } from "@/utils/Constants";
import { RFValue } from "react-native-responsive-fontsize";
import { getOptimizedVehicleImage, getFallbackVehicleImage } from "@/utils/vehicleImageService";

interface DriverProfileCardProps {
  driver: {
    name: string;
    phone: string;
    rating: number;
    totalRatings: number;
    completedRides: number;
    profilePhoto?: string;
    vehicle?: {
      type?: string;
      make?: string;
      model?: string;
      color?: string;
      licensePlate?: string;
      photo?: string;
    };
  };
  estimatedArrival?: number;
  onCall?: () => void;
  onMessage?: () => void;
}

const DriverProfileCard: FC<DriverProfileCardProps> = ({
  driver,
  estimatedArrival,
  onCall,
  onMessage,
}) => {
  const [imageError, setImageError] = useState(false);

  const handleCall = () => {
    if (driver.phone) {
      Linking.openURL(`tel:${driver.phone}`);
    }
  };

  const vehicleImageUrl = driver.vehicle?.photo || 
    getOptimizedVehicleImage({
      make: driver.vehicle?.make,
      model: driver.vehicle?.model,
      year: driver.vehicle?.year,
      color: driver.vehicle?.color,
      type: driver.vehicle?.type,
      angle: 'front_angle',
      background: 'studio',
    });

  return (
    <View
      style={{
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 15,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={commonStyles.flexRowBetween}>
        <View style={commonStyles.flexRow}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: Colors.primary,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
              overflow: "hidden",
            }}
          >
            {driver.profilePhoto ? (
              <Image
                source={{ uri: driver.profilePhoto }}
                style={{ width: 60, height: 60 }}
              />
            ) : (
              <CustomText
                fontFamily="Bold"
                fontSize={20}
                style={{ color: Colors.white }}
              >
                {driver.name?.charAt(0)?.toUpperCase() || "D"}
              </CustomText>
            )}
          </View>

          <View>
            <CustomText fontFamily="SemiBold" fontSize={16}>
              {driver.name || "Driver"}
            </CustomText>
            
            <View style={[commonStyles.flexRow, { marginTop: 4 }]}>
              <Ionicons name="star" size={14} color="#FFA500" />
              <CustomText
                fontFamily="Medium"
                fontSize={12}
                style={{ marginLeft: 4 }}
              >
                {driver.rating?.toFixed(1) || "5.0"} ({driver.totalRatings || 0})
              </CustomText>
            </View>

            <CustomText
              fontSize={10}
              style={{ color: "#666", marginTop: 2 }}
            >
              {driver.completedRides || 0} rides completed
            </CustomText>
          </View>
        </View>

        <View style={{ alignItems: "flex-end" }}>
          {estimatedArrival && (
            <View
              style={{
                backgroundColor: "#E8F5E9",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                marginBottom: 8,
              }}
            >
              <CustomText
                fontFamily="SemiBold"
                fontSize={12}
                style={{ color: "#2E7D32" }}
              >
                {estimatedArrival} min
              </CustomText>
            </View>
          )}

          <View style={commonStyles.flexRow}>
            <TouchableOpacity
              onPress={onMessage}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#F0F0F0",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 8,
              }}
            >
              <MaterialIcons name="message" size={18} color="#333" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCall}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: Colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="call" size={18} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {driver.vehicle && (
        <View
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: "#E5E5E5",
          }}
        >
          <View style={{ marginBottom: 12, alignItems: "center" }}>
            <Image
              source={{ uri: imageError ? getFallbackVehicleImage(driver.vehicle.type || 'default') : vehicleImageUrl }}
              onError={() => setImageError(true)}
              style={{
                width: "100%",
                height: 120,
                borderRadius: 8,
                resizeMode: "cover",
              }}
            />
          </View>
          
          <View style={commonStyles.flexRowBetween}>
            <View style={{ flex: 1 }}>
              <CustomText fontSize={10} style={{ color: "#666" }}>
                Vehicle
              </CustomText>
              <CustomText fontFamily="Medium" fontSize={12}>
                {driver.vehicle.color || ""} {driver.vehicle.make || ""} {driver.vehicle.model || driver.vehicle.type || "Vehicle"}
              </CustomText>
              {driver.vehicle.year && (
                <CustomText fontSize={10} style={{ color: "#666", marginTop: 2 }}>
                  {driver.vehicle.year}
                </CustomText>
              )}
            </View>
            {driver.vehicle.licensePlate && (
              <View style={{ alignItems: "flex-end" }}>
                <CustomText fontSize={10} style={{ color: "#666" }}>
                  Plate Number
                </CustomText>
                <CustomText fontFamily="Bold" fontSize={14} style={{ 
                  backgroundColor: "#FFD700", 
                  paddingHorizontal: 8, 
                  paddingVertical: 4, 
                  borderRadius: 4,
                  marginTop: 4,
                }}>
                  {driver.vehicle.licensePlate}
                </CustomText>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default DriverProfileCard;

