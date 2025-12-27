import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/shared/CustomText";
import { screenWidth } from "@/utils/Constants";
import { useThemeStore } from "@/store/themeStore";

const rideServices = [
  {
    id: "ride",
    name: "Ride",
    icon: require("@/assets/icons/cab.png"),
    route: "/customer/selectlocations",
    promo: "$1",
  },
  {
    id: "rental",
    name: "Rental Cars",
    icon: require("@/assets/icons/cab_premium.png"),
    promo: "Promo",
    disabled: true,
  },
  {
    id: "reserve",
    name: "Reserve",
    icon: require("@/assets/icons/auto.png"),
    route: "/customer/selectlocations",
    promo: "Promo",
  },
  {
    id: "teens",
    name: "Teens",
    iconName: "people" as const,
    disabled: true,
  },
  {
    id: "seniors",
    name: "Seniors",
    iconName: "accessibility" as const,
    disabled: true,
  },
  {
    id: "bike",
    name: "2-Wheels",
    icon: require("@/assets/icons/bike.png"),
    route: "/customer/selectlocations",
  },
];

const deliveryServices = [
  {
    id: "food",
    name: "Food",
    iconName: "fast-food" as const,
    route: "/customer/eats/restaurants",
  },
  {
    id: "grocery",
    name: "Grocery",
    iconName: "cart" as const,
    disabled: true,
  },
  {
    id: "alcohol",
    name: "Alcohol",
    iconName: "wine" as const,
    disabled: true,
  },
  {
    id: "electronics",
    name: "Electronics",
    iconName: "hardware-chip" as const,
    disabled: true,
  },
  {
    id: "convenience",
    name: "Convenience",
    iconName: "storefront" as const,
    disabled: true,
  },
  {
    id: "retail",
    name: "Retail",
    iconName: "pricetag" as const,
    disabled: true,
  },
  {
    id: "flowers",
    name: "Flowers",
    iconName: "flower" as const,
    disabled: true,
  },
  {
    id: "health",
    name: "Health",
    iconName: "medkit" as const,
    disabled: true,
  },
  {
    id: "package",
    name: "Package",
    iconName: "cube" as const,
    disabled: true,
  },
  {
    id: "baby",
    name: "Baby",
    iconName: "happy" as const,
    disabled: true,
  },
  {
    id: "pet",
    name: "Pet Supplies",
    iconName: "paw" as const,
    disabled: true,
  },
  {
    id: "gourmet",
    name: "Gourmet",
    iconName: "restaurant" as const,
    disabled: true,
  },
];

const cardWidth = (screenWidth - 60) / 4;

const ServiceTile = ({
  item,
  onPress,
  colors,
}: {
  item: any;
  onPress: () => void;
  colors: any;
}) => {
  const dynamicTileStyles = StyleSheet.create({
    tileIconContainer: {
      width: cardWidth - 8,
      aspectRatio: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    tileName: {
      color: colors.text,
      textAlign: "center",
    },
    tileNameDisabled: {
      color: colors.textSecondary,
    },
  });

  return (
    <TouchableOpacity
      style={[styles.serviceTile, item.disabled && styles.serviceTileDisabled]}
      onPress={onPress}
      disabled={item.disabled}
      activeOpacity={0.7}
    >
      {item.promo && (
        <View style={styles.promoBadge}>
          <CustomText fontFamily="SemiBold" fontSize={9} style={styles.promoText}>
            {item.promo}
          </CustomText>
        </View>
      )}
      <View style={dynamicTileStyles.tileIconContainer}>
        {item.icon ? (
          <Image source={item.icon} style={styles.tileIcon} />
        ) : item.iconName ? (
          <Ionicons
            name={item.iconName}
            size={RFValue(28)}
            color={item.disabled ? colors.textSecondary : colors.text}
          />
        ) : null}
      </View>
      <CustomText
        fontFamily="Medium"
        fontSize={11}
        style={[dynamicTileStyles.tileName, item.disabled && dynamicTileStyles.tileNameDisabled]}
        numberOfLines={2}
      >
        {item.name}
      </CustomText>
    </TouchableOpacity>
  );
};

const ServicesScreen = () => {
  const { colors } = useThemeStore();

  const handleServicePress = (service: { route?: string; disabled?: boolean }) => {
    if (service.disabled) return;
    if (service.route) {
      router.push(service.route as any);
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    pageTitle: {
      color: colors.text,
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    sectionTitle: {
      color: colors.text,
      paddingHorizontal: 20,
      marginBottom: 16,
    },
    tileIconContainer: {
      width: cardWidth - 8,
      aspectRatio: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
    },
    tileName: {
      color: colors.text,
      textAlign: "center",
    },
    tileNameDisabled: {
      color: colors.textSecondary,
    },
    divider: {
      height: 8,
      backgroundColor: colors.card,
      marginVertical: 16,
    },
    bottomNav: {
      flexDirection: "row",
      backgroundColor: colors.background,
      borderTopWidth: 0.5,
      borderTopColor: colors.divider,
      paddingVertical: 8,
      paddingHorizontal: 20,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    navText: {
      color: colors.textSecondary,
    },
    navTextActive: {
      color: colors.text,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <StatusBar style={colors.background === "#000000" ? "light" : "dark"} backgroundColor={colors.background} translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={RFValue(22)} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <CustomText fontFamily="Bold" fontSize={28} style={dynamicStyles.pageTitle}>
            Services
          </CustomText>

          <View style={styles.section}>
            <View style={styles.servicesGrid}>
              {rideServices.map((service) => (
                <ServiceTile
                  key={service.id}
                  item={service}
                  onPress={() => handleServicePress(service)}
                  colors={colors}
                />
              ))}
            </View>
          </View>

          <View style={dynamicStyles.divider} />

          <View style={styles.section}>
            <CustomText fontFamily="SemiBold" fontSize={18} style={dynamicStyles.sectionTitle}>
              Get anything delivered
            </CustomText>
            
            <View style={styles.servicesGrid}>
              {deliveryServices.map((service) => (
                <ServiceTile
                  key={service.id}
                  item={service}
                  onPress={() => handleServicePress(service)}
                  colors={colors}
                />
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={dynamicStyles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/customer/home")}>
            <Ionicons name="home-outline" size={RFValue(22)} color={colors.textSecondary} />
            <CustomText fontFamily="Regular" fontSize={10} style={dynamicStyles.navText}>
              Home
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="grid" size={RFValue(22)} color={colors.text} />
            <CustomText fontFamily="SemiBold" fontSize={10} style={dynamicStyles.navTextActive}>
              Services
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/customer/home")}>
            <Ionicons name="receipt-outline" size={RFValue(22)} color={colors.textSecondary} />
            <CustomText fontFamily="Regular" fontSize={10} style={dynamicStyles.navText}>
              Activity
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/customer/account")}>
            <View style={styles.accountIconContainer}>
              <Ionicons name="people-outline" size={RFValue(22)} color={colors.textSecondary} />
              <View style={[styles.notificationDot, { backgroundColor: colors.notification }]} />
            </View>
            <CustomText fontFamily="Regular" fontSize={10} style={dynamicStyles.navText}>
              Account
            </CustomText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 8,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
  },
  serviceTile: {
    width: cardWidth,
    alignItems: "center",
    marginHorizontal: 4,
    marginBottom: 12,
  },
  serviceTileDisabled: {
    opacity: 0.5,
  },
  promoBadge: {
    position: "absolute",
    top: 0,
    left: 4,
    backgroundColor: "#EF4444",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 10,
  },
  promoText: {
    color: "#FFFFFF",
  },
  tileIcon: {
    width: "55%",
    height: "55%",
    resizeMode: "contain",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  accountIconContainer: {
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: -2,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ServicesScreen;
