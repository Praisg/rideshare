import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { FC, useState } from "react";
import { useWS } from "@/service/WSProvider";
import { rideStyles } from "@/styles/rideStyles";
import { commonStyles } from "@/styles/commonStyles";
import CustomText from "../shared/CustomText";
import { vehicleIcons } from "@/utils/mapUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { resetAndNavigate } from "@/utils/Helpers";
import DriverProfileCard from "./DriverProfileCard";
import ChatModal from "../shared/ChatModal";
import RatingModal from "../shared/RatingModal";
import CancellationModal from "../shared/CancellationModal";
import { submitRating } from "@/service/rideService";

type VehicleType = "bike" | "cabEconomy" | "cabPremium";

interface RideItem {
  _id: string;
  vehicle?: VehicleType;
  pickup?: { address: string };
  drop?: { address: string };
  fare?: number;
  otp?: string;
  rider: any;
  status: string;
}

const LiveTrackingSheet: FC<{ item: RideItem }> = ({ item }) => {
  const { emit } = useWS();
  const [showChat, setShowChat] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showCancellation, setShowCancellation] = useState(false);

  const handleRating = async (rating: number, feedback: string) => {
    await submitRating(item._id, rating, feedback);
    resetAndNavigate("/customer/home");
  };

  const handleCancellation = (reason: string) => {
    emit("cancelRide", item._id);
    setShowCancellation(false);
  };

  return (
    <View>
      <View style={rideStyles?.headerContainer}>
        <View style={commonStyles.flexRowGap}>
          {item.vehicle && (
            <Image
              source={vehicleIcons[item.vehicle]?.icon}
              style={rideStyles.rideIcon}
            />
          )}
          <View>
            <CustomText fontSize={10}>
              {item?.status === "START"
                ? "Driver is on the way"
                : item?.status === "ARRIVED"
                ? "Driver has arrived"
                : "Trip completed!"}
            </CustomText>

            <CustomText fontFamily="SemiBold" fontSize={12}>
              {item?.status === "START" ? `OTP: ${item?.otp}` : item?.status === "COMPLETED" ? "Rate your ride" : "Enjoy your trip!"}
            </CustomText>
          </View>
        </View>
      </View>

      {item.rider && (
        <DriverProfileCard
          driver={{
            name: item.rider.name,
            phone: item.rider.phone,
            rating: item.rider.stats?.rating || 5.0,
            totalRatings: item.rider.stats?.totalRatings || 0,
            completedRides: item.rider.stats?.completedRides || 0,
            profilePhoto: item.rider.profilePhoto,
            vehicle: item.rider.vehicle || { type: item.vehicle },
          }}
          estimatedArrival={item.status === "START" ? 5 : undefined}
          onMessage={() => setShowChat(true)}
        />
      )}

      <View style={{ padding: 10 }}>
        <CustomText fontFamily="SemiBold" fontSize={12}>
          Location Details
        </CustomText>

        <View
          style={[
            commonStyles.flexRowGap,
            { marginVertical: 15, width: "90%" },
          ]}
        >
          <Image
            source={require("@/assets/icons/marker.png")}
            style={rideStyles.pinIcon}
          />
          <CustomText fontSize={10} numberOfLines={2}>
            {item?.pickup?.address}
          </CustomText>
        </View>

        <View style={[commonStyles.flexRowGap, { width: "90%" }]}>
          <Image
            source={require("@/assets/icons/drop_marker.png")}
            style={rideStyles.pinIcon}
          />
          <CustomText fontSize={10} numberOfLines={2}>
            {item?.drop?.address}
          </CustomText>
        </View>

        <View style={{ marginVertical: 20 }}>
          <View style={[commonStyles.flexRowBetween]}>
            <View style={commonStyles.flexRow}>
              <MaterialCommunityIcons
                name="credit-card"
                size={24}
                color="black"
              />
              <CustomText
                style={{ marginLeft: 10 }}
                fontFamily="SemiBold"
                fontSize={12}
              >
                Payment
              </CustomText>
            </View>

            <CustomText fontFamily="SemiBold" fontSize={14}>
              $ {item.fare?.toFixed(2)}
            </CustomText>
          </View>

          <CustomText fontSize={10}>Payment via cash</CustomText>
        </View>
      </View>

      <View style={rideStyles.bottomButtonContainer}>
        {item.status !== "COMPLETED" ? (
          <>
            <TouchableOpacity
              style={rideStyles.cancelButton}
              onPress={() => setShowCancellation(true)}
            >
              <CustomText style={rideStyles.cancelButtonText} fontFamily="SemiBold">
                Cancel Ride
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={rideStyles.backButton2}
              onPress={() => setShowChat(true)}
            >
              <CustomText style={rideStyles.backButtonText} fontFamily="SemiBold">
                Message Driver
              </CustomText>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            style={[rideStyles.backButton2, { flex: 1 }]}
            onPress={() => setShowRating(true)}
          >
            <CustomText style={rideStyles.backButtonText} fontFamily="SemiBold">
              Rate Your Driver
            </CustomText>
          </TouchableOpacity>
        )}
      </View>

      <ChatModal
        visible={showChat}
        onClose={() => setShowChat(false)}
        rideId={item._id}
        recipientName={item.rider?.name || "Driver"}
        recipientRole="rider"
      />

      <RatingModal
        visible={showRating}
        onClose={() => {
          setShowRating(false);
          resetAndNavigate("/customer/home");
        }}
        recipientName={item.rider?.name || "Driver"}
        recipientRole="rider"
        onSubmit={handleRating}
      />

      <CancellationModal
        visible={showCancellation}
        onClose={() => setShowCancellation(false)}
        onConfirm={handleCancellation}
        userRole="customer"
      />
    </View>
  );
};

export default LiveTrackingSheet;
