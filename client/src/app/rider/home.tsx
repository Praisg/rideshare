import { View, Text, FlatList, Image, Alert, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useWS } from "@/service/WSProvider";
import { useRiderStore } from "@/store/riderStore";
import { getMyRides } from "@/service/rideService";
import { getAvailableDeliveries, getActiveDelivery, placeBid } from "@/service/foodOrderService";
import * as Location from "expo-location";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import RiderHeader from "@/components/rider/RiderHeader";
import { riderStyles } from "@/styles/riderStyles";
import CustomText from "@/components/shared/CustomText";
import RiderRidesItem from "@/components/rider/RiderRidesItem";
import DeliveryOfferCard from "@/components/rider/DeliveryOfferCard";
import DeliveryBiddingModal from "@/components/rider/DeliveryBiddingModal";
import { getKYCStatus } from "@/service/kycService";
import { resetAndNavigate } from "@/utils/Helpers";
import { Colors } from "@/utils/Constants";
import { router } from "expo-router";

type DeliveryMode = "rides" | "deliveries" | "both";

const RiderHome = () => {
  const isFocused = useIsFocused();
  const { emit, on, off } = useWS();
  const { onDuty, setLocation, user } = useRiderStore();

  const [rideOffers, setRideOffers] = useState<any[]>([]);
  const [deliveryOffers, setDeliveryOffers] = useState<any[]>([]);
  const [kycVerified, setKycVerified] = useState(false);
  const [checkingKYC, setCheckingKYC] = useState(true);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("both");
  const [showBiddingModal, setShowBiddingModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [isBidding, setIsBidding] = useState(false);

  const fetchDeliveryOffers = useCallback(async () => {
    if (!onDuty || !kycVerified) return;
    
    const result = await getAvailableDeliveries();
    if (result.success) {
      setDeliveryOffers(result.orders || []);
    }
  }, [onDuty, kycVerified]);

  const checkActiveDelivery = useCallback(async () => {
    const result = await getActiveDelivery();
    if (result.success && result.hasActiveDelivery && result.order) {
      router.replace(`/rider/food-delivery?orderId=${result.order._id}`);
    }
  }, []);

  useEffect(() => {
    setKycVerified(true);
    setCheckingKYC(false);
    getMyRides(false);
    checkActiveDelivery();

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
        if (deliveryMode === "rides" || deliveryMode === "both") {
        setRideOffers((prevOffers) => {
          const existingIds = new Set(prevOffers?.map((offer) => offer?._id));
          if (!existingIds.has(rideDetails?._id)) {
            return [...prevOffers, rideDetails];
          }
          return prevOffers;
        });
        }
      });

      on("delivery:offer", (deliveryDetails: any) => {
        if (deliveryMode === "deliveries" || deliveryMode === "both") {
          setDeliveryOffers((prevOffers) => {
            const existingIds = new Set(prevOffers?.map((offer) => offer?._id || offer?.orderId));
            if (!existingIds.has(deliveryDetails?._id || deliveryDetails?.orderId)) {
              return [...prevOffers, deliveryDetails];
            }
            return prevOffers;
          });
        }
      });

      if (deliveryMode === "deliveries" || deliveryMode === "both") {
        fetchDeliveryOffers();
      }
    }

    return () => {
      off("rideOffer");
      off("delivery:offer");
    };
  }, [onDuty, on, off, isFocused, kycVerified, deliveryMode]);

  const removeRide = (id: string) => {
    setRideOffers((prevOffers) =>
      prevOffers.filter((offer) => offer._id !== id)
    );
  };

  const removeDelivery = (id: string) => {
    setDeliveryOffers((prevOffers) =>
      prevOffers.filter((offer) => (offer._id || offer.orderId) !== id)
    );
  };

  const handleOpenBidModal = (delivery: any) => {
    setSelectedDelivery(delivery);
    setShowBiddingModal(true);
  };

  const handleSubmitBid = async (amount: number, estimatedTime: number, message?: string) => {
    if (!selectedDelivery) return;
    
    setIsBidding(true);
    const orderId = selectedDelivery._id || selectedDelivery.orderId;
    const result = await placeBid(orderId, amount, estimatedTime, message);
    setIsBidding(false);
    
    if (result.success) {
      setShowBiddingModal(false);
      setSelectedDelivery(null);
      Alert.alert("Success", "Your bid has been submitted!");
      removeDelivery(orderId);
    } else {
      Alert.alert("Error", result.error || "Failed to place bid");
    }
  };

  const renderRides = ({ item }: any) => {
    return (
      <RiderRidesItem removeIt={() => removeRide(item?._id)} item={item} />
    );
  };

  const renderDelivery = ({ item }: any) => {
    return (
      <DeliveryOfferCard
        order={item}
        onBid={() => handleOpenBidModal(item)}
      />
    );
  };

  const getOffers = () => {
    if (deliveryMode === "rides") return rideOffers;
    if (deliveryMode === "deliveries") return deliveryOffers;
    return [...rideOffers, ...deliveryOffers];
  };

  const renderItem = ({ item }: any) => {
    if (item.orderNumber || item.orderId) {
      return renderDelivery({ item });
    }
    return renderRides({ item });
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

  const offers = getOffers();

  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" backgroundColor="orange" translucent={false} />
      <RiderHeader />

      <View style={localStyles.modeToggle}>
        <TouchableOpacity
          style={[
            localStyles.modeButton,
            deliveryMode === "rides" && localStyles.modeButtonActive,
          ]}
          onPress={() => setDeliveryMode("rides")}
        >
          <CustomText
            fontFamily={deliveryMode === "rides" ? "SemiBold" : "Regular"}
            fontSize={13}
            style={deliveryMode === "rides" ? localStyles.modeTextActive : localStyles.modeText}
          >
            Rides
          </CustomText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            localStyles.modeButton,
            deliveryMode === "deliveries" && localStyles.modeButtonActive,
          ]}
          onPress={() => setDeliveryMode("deliveries")}
        >
          <CustomText
            fontFamily={deliveryMode === "deliveries" ? "SemiBold" : "Regular"}
            fontSize={13}
            style={deliveryMode === "deliveries" ? localStyles.modeTextActive : localStyles.modeText}
          >
            Deliveries
          </CustomText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            localStyles.modeButton,
            deliveryMode === "both" && localStyles.modeButtonActive,
          ]}
          onPress={() => setDeliveryMode("both")}
        >
          <CustomText
            fontFamily={deliveryMode === "both" ? "SemiBold" : "Regular"}
            fontSize={13}
            style={deliveryMode === "both" ? localStyles.modeTextActive : localStyles.modeText}
          >
            Both
          </CustomText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={!onDuty ? [] : offers}
        renderItem={renderItem}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
        keyExtractor={(item: any) => item?._id || item?.orderId || Math.random().toString()}
        ListEmptyComponent={
          <View style={riderStyles?.emptyContainer}>
            <Image
              source={require("@/assets/icons/ride.jpg")}
              style={riderStyles?.emptyImage}
            />
            <CustomText fontSize={12} style={{ textAlign: "center" }}>
              {onDuty
                ? deliveryMode === "rides"
                  ? "No available rides. Stay active!"
                  : deliveryMode === "deliveries"
                  ? "No delivery orders available. Stay active!"
                  : "No rides or deliveries available. Stay active!"
                : "You're currently OFF-DUTY, please go ON-DUTY to start earning"}
            </CustomText>
          </View>
        }
      />

      <DeliveryBiddingModal
        visible={showBiddingModal}
        onClose={() => {
          setShowBiddingModal(false);
          setSelectedDelivery(null);
        }}
        onSubmit={handleSubmitBid}
        order={selectedDelivery}
        isLoading={isBidding}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeText: {
    color: Colors.textLight,
  },
  modeTextActive: {
    color: Colors.text,
  },
});

export default RiderHome;
