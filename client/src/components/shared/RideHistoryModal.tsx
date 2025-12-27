import {
  View,
  Modal,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { FC, useState, useEffect } from "react";
import CustomText from "./CustomText";
import { Colors } from "@/utils/Constants";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { commonStyles } from "@/styles/commonStyles";
import { appAxios } from "@/service/apiInterceptors";

interface RideHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  userRole: "rider" | "customer";
}

interface RideHistoryItem {
  _id: string;
  pickup: { address: string };
  drop: { address: string };
  fare: number;
  distance: number;
  status: string;
  vehicle: string;
  createdAt: string;
  rating?: {
    riderRating?: number;
    customerRating?: number;
  };
  rider?: { name: string };
  customer?: { name: string };
}

const RideHistoryModal: FC<RideHistoryModalProps> = ({
  visible,
  onClose,
  userRole,
}) => {
  const [rides, setRides] = useState<RideHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<RideHistoryItem | null>(null);

  useEffect(() => {
    if (visible) {
      fetchRideHistory();
    }
  }, [visible]);

  const fetchRideHistory = async () => {
    setLoading(true);
    try {
      const response = await appAxios.get("/ride/rides?status=COMPLETED");
      setRides(response.data.rides || []);
    } catch (error) {
      console.error("Error fetching ride history:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "#4CAF50";
      case "CANCELLED":
        return "#F44336";
      default:
        return "#FF9800";
    }
  };

  const renderRideItem = ({ item }: { item: RideHistoryItem }) => {
    const otherParty = userRole === "rider" ? item.customer : item.rider;
    const myRating =
      userRole === "rider"
        ? item.rating?.customerRating
        : item.rating?.riderRating;

    return (
      <TouchableOpacity
        onPress={() => setSelectedRide(item)}
        style={{
          backgroundColor: Colors.white,
          borderRadius: 12,
          padding: 16,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "#E5E5E5",
        }}
      >
        <View style={[commonStyles.flexRowBetween, { marginBottom: 12 }]}>
          <View style={{ flex: 1 }}>
            <CustomText fontFamily="SemiBold" fontSize={14} numberOfLines={1}>
              {item.pickup.address.substring(0, 30)}...
            </CustomText>
            <View style={[commonStyles.flexRow, { marginTop: 4 }]}>
              <Ionicons name="arrow-down" size={12} color="#666" />
              <CustomText
                fontSize={10}
                style={{ color: "#666", marginLeft: 4 }}
                numberOfLines={1}
              >
                {item.drop.address.substring(0, 30)}...
              </CustomText>
            </View>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <CustomText fontFamily="Bold" fontSize={16} style={{ color: Colors.primary }}>
              ${item.fare.toFixed(2)}
            </CustomText>
            {myRating && (
              <View style={[commonStyles.flexRow, { marginTop: 4 }]}>
                <Ionicons name="star" size={12} color="#FFA500" />
                <CustomText fontSize={10} style={{ marginLeft: 2 }}>
                  {myRating}
                </CustomText>
              </View>
            )}
          </View>
        </View>

        <View style={[commonStyles.flexRowBetween]}>
          <CustomText fontSize={10} style={{ color: "#666" }}>
            {new Date(item.createdAt).toLocaleDateString()} •{" "}
            {item.distance.toFixed(1)} km • {item.vehicle}
          </CustomText>
          {otherParty && (
            <CustomText fontSize={10} style={{ color: "#666" }}>
              {userRole === "rider" ? "Passenger" : "Driver"}: {otherParty.name}
            </CustomText>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderRideDetails = () => {
    if (!selectedRide) return null;

    const otherParty =
      userRole === "rider" ? selectedRide.customer : selectedRide.rider;
    const myRating =
      userRole === "rider"
        ? selectedRide.rating?.customerRating
        : selectedRide.rating?.riderRating;

    return (
      <Modal
        visible={!!selectedRide}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedRide(null)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "80%",
            }}
          >
            <View
              style={[
                commonStyles.flexRowBetween,
                { marginBottom: 20 },
              ]}
            >
              <CustomText fontFamily="Bold" fontSize={18}>
                Ride Details
              </CustomText>
              <TouchableOpacity onPress={() => setSelectedRide(null)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={{ marginBottom: 20 }}>
              <DetailRow
                icon="calendar"
                label="Date"
                value={new Date(selectedRide.createdAt).toLocaleString()}
              />
              <DetailRow
                icon="car"
                label="Vehicle"
                value={selectedRide.vehicle}
              />
              <DetailRow
                icon="location"
                label="Pickup"
                value={selectedRide.pickup.address}
              />
              <DetailRow
                icon="flag"
                label="Drop-off"
                value={selectedRide.drop.address}
              />
              <DetailRow
                icon="map"
                label="Distance"
                value={`${selectedRide.distance.toFixed(2)} km`}
              />
              <DetailRow
                icon="cash"
                label="Fare"
                value={`$${selectedRide.fare.toFixed(2)}`}
              />
              {otherParty && (
                <DetailRow
                  icon="person"
                  label={userRole === "rider" ? "Passenger" : "Driver"}
                  value={otherParty.name}
                />
              )}
              {myRating && (
                <DetailRow
                  icon="star"
                  label="Your Rating"
                  value={`${myRating} / 5`}
                />
              )}
            </View>

            <TouchableOpacity
              onPress={() => setSelectedRide(null)}
              style={{
                backgroundColor: Colors.primary,
                padding: 16,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <CustomText
                fontFamily="SemiBold"
                fontSize={14}
                style={{ color: Colors.white }}
              >
                Close
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: "#F5F5F5" }}>
        <View
          style={{
            padding: 20,
            paddingTop: 50,
            backgroundColor: Colors.primary,
          }}
        >
          <View style={commonStyles.flexRowBetween}>
            <CustomText
              fontFamily="Bold"
              fontSize={24}
              style={{ color: Colors.white }}
            >
              Ride History
            </CustomText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <CustomText
            fontSize={14}
            style={{ color: "rgba(255,255,255,0.8)", marginTop: 8 }}
          >
            {rides.length} completed rides
          </CustomText>
        </View>

        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={Colors.primary} />
            <CustomText fontSize={14} style={{ marginTop: 16, color: "#666" }}>
              Loading ride history...
            </CustomText>
          </View>
        ) : rides.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 40 }}
          >
            <MaterialCommunityIcons
              name="history"
              size={80}
              color="#CCC"
            />
            <CustomText
              fontFamily="SemiBold"
              fontSize={16}
              style={{ marginTop: 16, textAlign: "center" }}
            >
              No Ride History
            </CustomText>
            <CustomText
              fontSize={14}
              style={{ marginTop: 8, color: "#666", textAlign: "center" }}
            >
              Your completed rides will appear here
            </CustomText>
          </View>
        ) : (
          <FlatList
            data={rides}
            renderItem={renderRideItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />
        )}

        {renderRideDetails()}
      </View>
    </Modal>
  );
};

const DetailRow: FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <View
    style={{
      flexDirection: "row",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#F0F0F0",
    }}
  >
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F5F5F5",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
      }}
    >
      <Ionicons name={icon as any} size={20} color={Colors.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <CustomText fontSize={10} style={{ color: "#666" }}>
        {label}
      </CustomText>
      <CustomText fontFamily="Medium" fontSize={12} style={{ marginTop: 2 }}>
        {value}
      </CustomText>
    </View>
  </View>
);

export default RideHistoryModal;

