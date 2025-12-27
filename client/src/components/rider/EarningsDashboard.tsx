import { View, ScrollView, TouchableOpacity } from "react-native";
import React, { FC, useEffect, useState } from "react";
import CustomText from "../shared/CustomText";
import { commonStyles } from "@/styles/commonStyles";
import { Colors } from "@/utils/Constants";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRiderStore } from "@/store/riderStore";

interface EarningsDashboardProps {
  onClose: () => void;
}

const EarningsDashboard: FC<EarningsDashboardProps> = ({ onClose }) => {
  const { user } = useRiderStore();
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month">("today");

  const earnings = {
    today: {
      total: 45.50,
      rides: 8,
      hours: 4.5,
      avgPerRide: 5.69,
    },
    week: {
      total: 312.75,
      rides: 52,
      hours: 28,
      avgPerRide: 6.01,
    },
    month: {
      total: 1250.00,
      rides: 198,
      hours: 112,
      avgPerRide: 6.31,
    },
  };

  const currentEarnings = earnings[timeFilter];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <View
        style={{
          padding: 20,
          backgroundColor: Colors.primary,
          paddingTop: 50,
        }}
      >
        <View style={commonStyles.flexRowBetween}>
          <CustomText
            fontFamily="Bold"
            fontSize={24}
            style={{ color: Colors.white }}
          >
            My Earnings
          </CustomText>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: 20, alignItems: "center" }}>
          <CustomText fontSize={14} style={{ color: "rgba(255,255,255,0.8)" }}>
            Total Earned
          </CustomText>
          <CustomText
            fontFamily="Bold"
            fontSize={42}
            style={{ color: Colors.white, marginTop: 8 }}
          >
            ${user?.earnings?.total?.toFixed(2) || "0.00"}
          </CustomText>
          <CustomText fontSize={12} style={{ color: "rgba(255,255,255,0.8)", marginTop: 4 }}>
            Available: ${user?.earnings?.available?.toFixed(2) || "0.00"}
          </CustomText>
        </View>
      </View>

      <View style={{ padding: 20 }}>
        <View style={[commonStyles.flexRow, { marginBottom: 20 }]}>
          {(["today", "week", "month"] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setTimeFilter(filter)}
              style={{
                flex: 1,
                paddingVertical: 10,
                backgroundColor: timeFilter === filter ? Colors.primary : "#F0F0F0",
                borderRadius: 8,
                marginHorizontal: 4,
                alignItems: "center",
              }}
            >
              <CustomText
                fontFamily={timeFilter === filter ? "SemiBold" : "Regular"}
                fontSize={12}
                style={{ color: timeFilter === filter ? Colors.white : "#333" }}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" }}>
            <StatCard
              icon="cash"
              label="Total Earned"
              value={`$${currentEarnings.total.toFixed(2)}`}
              color="#4CAF50"
            />
            <StatCard
              icon="car"
              label="Total Rides"
              value={currentEarnings.rides.toString()}
              color="#2196F3"
            />
            <StatCard
              icon="clock-outline"
              label="Hours Online"
              value={`${currentEarnings.hours}h`}
              color="#FF9800"
            />
            <StatCard
              icon="trending-up"
              label="Avg Per Ride"
              value={`$${currentEarnings.avgPerRide.toFixed(2)}`}
              color="#9C27B0"
            />
          </View>

          <View style={{ marginTop: 20, padding: 15, backgroundColor: "#FFF3CD", borderRadius: 10 }}>
            <View style={commonStyles.flexRow}>
              <MaterialCommunityIcons name="information" size={20} color="#856404" />
              <CustomText fontSize={12} style={{ color: "#856404", marginLeft: 8, flex: 1 }}>
                Complete 10 more rides this week to unlock a $50 bonus!
              </CustomText>
            </View>
          </View>

          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: Colors.primary,
              padding: 16,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <CustomText fontFamily="SemiBold" fontSize={16} style={{ color: Colors.white }}>
              Withdraw Earnings
            </CustomText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const StatCard: FC<{ icon: string; label: string; value: string; color: string }> = ({
  icon,
  label,
  value,
  color,
}) => (
  <View
    style={{
      width: "48%",
      backgroundColor: Colors.white,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: "#E5E5E5",
    }}
  >
    <MaterialCommunityIcons name={icon as any} size={28} color={color} />
    <CustomText fontSize={10} style={{ color: "#666", marginTop: 8 }}>
      {label}
    </CustomText>
    <CustomText fontFamily="Bold" fontSize={20} style={{ marginTop: 4 }}>
      {value}
    </CustomText>
  </View>
);

export default EarningsDashboard;

