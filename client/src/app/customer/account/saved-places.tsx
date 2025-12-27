import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/shared/CustomText";
import { useUserStore } from "@/store/userStore";

const DARK_BG = "#000000";
const CARD_BG = "#1C1C1E";
const TEXT_PRIMARY = "#FFFFFF";
const TEXT_SECONDARY = "#8E8E93";
const DIVIDER = "#2C2C2E";
const ACCENT = "#10B981";

const SavedPlacesScreen = () => {
  const { savedPlaces } = useUserStore();

  const defaultPlaces = [
    { id: "home", label: "Home", iconName: "home" as const, address: null },
    { id: "work", label: "Work", iconName: "briefcase" as const, address: null },
  ];

  const places = defaultPlaces.map((p) => {
    const saved = savedPlaces?.find((sp: any) => sp.id === p.id);
    return { ...p, address: saved?.address || null };
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={DARK_BG} translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={RFValue(22)} color={TEXT_PRIMARY} />
          </TouchableOpacity>
          <CustomText fontFamily="SemiBold" fontSize={18} style={styles.headerTitle}>
            Saved Places
          </CustomText>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            {places.map((place, index) => (
              <TouchableOpacity
                key={place.id}
                style={[
                  styles.placeItem,
                  index < places.length - 1 && styles.placeItemBorder,
                ]}
              >
                <View style={styles.placeIcon}>
                  <Ionicons
                    name={place.iconName}
                    size={RFValue(20)}
                    color={TEXT_PRIMARY}
                  />
                </View>
                <View style={styles.placeInfo}>
                  <CustomText fontFamily="Medium" fontSize={16} style={styles.placeLabel}>
                    {place.label}
                  </CustomText>
                  <CustomText fontFamily="Regular" fontSize={14} style={styles.placeAddress}>
                    {place.address || "Add address"}
                  </CustomText>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={RFValue(18)}
                  color={TEXT_SECONDARY}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.addSection}>
            <View style={styles.addIcon}>
              <Ionicons name="add" size={RFValue(24)} color={ACCENT} />
            </View>
            <CustomText fontFamily="Medium" fontSize={16} style={styles.addText}>
              Add a place
            </CustomText>
          </TouchableOpacity>

          <View style={styles.infoSection}>
            <Ionicons name="information-circle-outline" size={RFValue(18)} color={TEXT_SECONDARY} />
            <CustomText fontFamily="Regular" fontSize={13} style={styles.infoText}>
              Your saved places make it faster to book rides to your frequent destinations.
            </CustomText>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: DIVIDER,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: TEXT_PRIMARY,
  },
  headerSpacer: {
    width: 30,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  section: {
    backgroundColor: CARD_BG,
    marginBottom: 8,
  },
  placeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  placeItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: DIVIDER,
  },
  placeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  placeInfo: {
    flex: 1,
  },
  placeLabel: {
    color: TEXT_PRIMARY,
    marginBottom: 2,
  },
  placeAddress: {
    color: TEXT_SECONDARY,
  },
  addSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  addIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2C2C2E",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  addText: {
    color: ACCENT,
  },
  infoSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    gap: 12,
  },
  infoText: {
    flex: 1,
    color: TEXT_SECONDARY,
    lineHeight: 20,
  },
});

export default SavedPlacesScreen;
