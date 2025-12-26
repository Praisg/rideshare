import { View, Text, FlatList, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useWS } from "@/service/WSProvider";
import { useRiderStore } from "@/store/riderStore";
import { getMyRides } from "@/service/rideService";
import * as Location from "expo-location";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import RiderHeader from "@/components/rider/RiderHeader";
import { riderStyles } from "@/styles/riderStyles";
import CustomText from "@/components/shared/CustomText";
import RiderRidesItem from "@/components/rider/RiderRidesItem";
import { getKYCStatus } from "@/service/kycService";
import { resetAndNavigate } from "@/utils/Helpers";

const RiderHome = () => {
  const isFocused = useIsFocused();
  const { emit, on, off } = useWS();
  const { onDuty, setLocation, user } = useRiderStore();

  const [rideOffers, setRideOffers] = useState<any[]>([]);
  const [kycVerified, setKycVerified] = useState(false);
  const [checkingKYC, setCheckingKYC] = useState(true);

  useEffect(() => {
    // TEMPORARY: KYC disabled for testing
    setKycVerified(true);
    setCheckingKYC(false);
    getMyRides(false);

    /* ENABLE THIS WHEN READY TO TEST KYC:
    const checkKYCStatus = async () => {
      setCheckingKYC(true);
      const result = await getKYCStatus();
      
      if (result.success) {
        const kycStatus = result.data.kyc?.status || "pending";
        
        if (kycStatus === "approved") {
          setKycVerified(true);
        } else {
          const messages: Record<string, { title: string; message: string; buttonText: string }> = {
            submitted: {
              title: "KYC Under Review",
              message: "Your verification documents are being reviewed. You'll be notified once approved (24-48 hours).",
              buttonText: "OK"
            },
            rejected: {
              title: "KYC Rejected",
              message: "Your KYC was rejected. Please resubmit with valid documents.",
              buttonText: "Resubmit"
            },
            pending: {
              title: "KYC Required",
              message: "Complete identity verification to start accepting rides.",
              buttonText: "Complete KYC"
            }
          };

          const config = messages[kycStatus] || messages.pending;

          Alert.alert(
            config.title,
            config.message,
            [
              {
                text: config.buttonText,
                onPress: () => {
                  if (kycStatus !== "submitted") {
                    resetAndNavigate("/rider/kyc-verification");
                  }
                },
              },
            ]
          );
        }
      } else {
        Alert.alert("Error", "Failed to verify KYC status");
      }
      
      setCheckingKYC(false);
    };

    checkKYCStatus();
    getMyRides(false);
    */
  }, []);

  useEffect(() => {
    let locationsSubscription: any;
    const startLocationUpdates = async () => {
      if (!kycVerified) {
        Alert.alert("KYC Required", "Please complete KYC verification first");
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        locationsSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 10000,
            distanceInterval: 10,
          },
          (location) => {
            const { latitude, longitude, heading } = location.coords;
            setLocation({
              latitude: latitude,
              longitude: longitude,
              address: "Somewhere",
              heading: heading as number,
            });
            emit("updateLocation", {
              latitude,
              longitude,
              heading,
            });
          }
        );
      }
    };

    if (onDuty && isFocused && kycVerified) {
      startLocationUpdates();
    }

    return () => {
      if (locationsSubscription) {
        locationsSubscription.remove();
      }
    };
  }, [onDuty, isFocused, kycVerified]);

  useEffect(() => {
    if (onDuty && isFocused && kycVerified) {
      on("rideOffer", (rideDetails: any) => {
        setRideOffers((prevOffers) => {
          const existingIds = new Set(prevOffers?.map((offer) => offer?._id));
          if (!existingIds.has(rideDetails?._id)) {
            return [...prevOffers, rideDetails];
          }
          return prevOffers;
        });
      });
    }

    return () => {
      off("rideOffer");
    };
  }, [onDuty, on, off, isFocused, kycVerified]);

  const removeRide = (id: string) => {
    setRideOffers((prevOffers) =>
      prevOffers.filter((offer) => offer._id !== id)
    );
  };

  const renderRides = ({ item }: any) => {
    return (
      <RiderRidesItem removeIt={() => removeRide(item?._id)} item={item} />
    );
  };

  if (checkingKYC) {
    return (
      <View style={[homeStyles.container, { justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style="light" backgroundColor="orange" translucent={false} />
        <CustomText fontSize={16}>Verifying KYC Status...</CustomText>
      </View>
    );
  }

  if (!kycVerified) {
    return (
      <View style={[homeStyles.container, { justifyContent: "center", alignItems: "center", padding: 20 }]}>
        <StatusBar style="light" backgroundColor="orange" translucent={false} />
        <CustomText fontSize={18} fontWeight="bold" style={{ marginBottom: 10, textAlign: "center" }}>
          KYC Verification Required
        </CustomText>
        <CustomText fontSize={14} style={{ textAlign: "center", color: "#666" }}>
          Please complete your KYC verification to start accepting rides.
        </CustomText>
      </View>
    );
  }

  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" backgroundColor="orange" translucent={false} />
      <RiderHeader />

      <FlatList
        data={!onDuty ? [] : rideOffers}
        renderItem={renderRides}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
        keyExtractor={(item: any) => item?._id || Math.random().toString()}
        ListEmptyComponent={
          <View style={riderStyles?.emptyContainer}>
            <Image
              source={require("@/assets/icons/ride.jpg")}
              style={riderStyles?.emptyImage}
            />
            <CustomText fontSize={12} style={{ textAlign: "center" }}>
              {onDuty
                ? "There are no available rides! Stay Active"
                : "You're currently OFF-DUTY, please go ON-DUTY to start earning"}
            </CustomText>
          </View>
        }
      />
    </View>
  );
};

export default RiderHome;
