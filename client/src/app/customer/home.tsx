import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/shared/CustomText";
import { Colors, screenWidth } from "@/utils/Constants";
import { useUserStore } from "@/store/userStore";
import { getMyRides } from "@/service/rideService";
import RideHistoryModal from "@/components/shared/RideHistoryModal";
import { getRestaurants, getCuisines } from "@/service/eatsService";
import { useEatsStore } from "@/store/eatsStore";
import { useCartStore } from "@/store/cartStore";

const services = [
  { id: 1, name: "Ride", icon: require("@/assets/icons/cab.png"), promo: false },
  { id: 2, name: "2-Wheels", icon: require("@/assets/icons/bike.png"), promo: true },
  { id: 3, name: "Rental Cars", icon: require("@/assets/icons/cab_premium.png"), promo: false },
  { id: 4, name: "Reserve", icon: require("@/assets/icons/auto.png"), promo: false },
];

const recentLocations = [
  { id: 1, name: "Rd", city: "Austin, TX", saved: false },
  { id: 2, name: "St", city: "Austin, TX", saved: false },
];

const cuisineIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Fast Food": "fast-food",
  "Chicken": "restaurant",
  "Pizza": "pizza",
  "Indian": "flame",
  "Chinese": "restaurant",
  "African": "leaf",
  "Burgers": "fast-food",
  "Cafe": "cafe",
  "Seafood": "fish",
};

const CustomerHome = () => {
  const { location } = useUserStore();
  const [activeTab, setActiveTab] = useState<"rides" | "eats">("rides");
  const [showRideHistory, setShowRideHistory] = useState(false);
  
  const { restaurants, cuisines, setRestaurants, setCuisines } = useEatsStore();
  const cartCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    getMyRides();
  }, []);

  useEffect(() => {
    if (activeTab === "eats") {
      fetchEatsData();
    }
  }, [activeTab]);

  const fetchEatsData = useCallback(async () => {
    const [restaurantsResult, cuisinesResult] = await Promise.all([
      getRestaurants({ featured: true }),
      getCuisines(),
    ]);
    
    if (restaurantsResult.success) {
      setRestaurants(restaurantsResult.restaurants);
    }
    if (cuisinesResult.success) {
      setCuisines(cuisinesResult.cuisines);
    }
  }, []);

  const handleServicePress = () => {
    router.navigate("/customer/selectlocations");
  };

  const handleEatsSearchPress = () => {
    router.navigate("/customer/eats/restaurants");
  };

  const handleRestaurantPress = (restaurantId: string) => {
    router.push(`/customer/eats/${restaurantId}`);
  };

  const handleCuisinePress = (cuisine: string) => {
    router.push(`/customer/eats/restaurants?cuisine=${encodeURIComponent(cuisine)}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.white} translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "rides" && styles.activeTab]}
              onPress={() => setActiveTab("rides")}
            >
              <Ionicons
                name="car-outline"
                size={RFValue(18)}
                color={activeTab === "rides" ? Colors.text : Colors.textLight}
              />
              <CustomText
                fontFamily={activeTab === "rides" ? "SemiBold" : "Regular"}
                fontSize={14}
                style={[styles.tabText, activeTab === "rides" && styles.activeTabText]}
              >
                Rides
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === "eats" && styles.activeTab]}
              onPress={() => setActiveTab("eats")}
            >
              <Ionicons
                name="fast-food-outline"
                size={RFValue(18)}
                color={activeTab === "eats" ? Colors.text : Colors.textLight}
              />
              <CustomText
                fontFamily={activeTab === "eats" ? "SemiBold" : "Regular"}
                fontSize={14}
                style={[styles.tabText, activeTab === "eats" && styles.activeTabText]}
              >
                Eats
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === "rides" ? (
            <>
              <TouchableOpacity style={styles.searchBar} onPress={handleServicePress}>
                <Ionicons name="search" size={RFValue(18)} color={Colors.text} />
                <CustomText fontFamily="Regular" fontSize={14} style={styles.searchText}>
                  Where to?
                </CustomText>
                <View style={styles.timeSelector}>
                  <Ionicons name="time-outline" size={RFValue(14)} color={Colors.text} />
                  <CustomText fontFamily="Regular" fontSize={12}>
                    Now
                  </CustomText>
                  <Ionicons name="chevron-down" size={RFValue(12)} color={Colors.text} />
                </View>
              </TouchableOpacity>

              <View style={styles.section}>
                {recentLocations.map((loc) => (
                  <TouchableOpacity
                    key={loc.id}
                    style={styles.recentLocation}
                    onPress={handleServicePress}
                  >
                    <View style={styles.locationIcon}>
                      <Ionicons name="time-outline" size={RFValue(16)} color={Colors.textLight} />
                    </View>
                    <View style={styles.locationInfo}>
                      <CustomText fontFamily="Medium" fontSize={14} style={styles.locationName}>
                        {loc.name}
                      </CustomText>
                      <CustomText fontFamily="Regular" fontSize={12} style={styles.locationCity}>
                        {loc.city}
                      </CustomText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <CustomText fontFamily="SemiBold" fontSize={16}>
                    Suggestions
                  </CustomText>
                  <TouchableOpacity>
                    <CustomText fontFamily="Regular" fontSize={13} style={styles.seeAll}>
                      See All
                    </CustomText>
                  </TouchableOpacity>
                </View>

                <View style={styles.servicesGrid}>
                  {services.map((service) => (
                    <TouchableOpacity
                      key={service.id}
                      style={styles.serviceCard}
                      onPress={handleServicePress}
                    >
                      {service.promo && (
                        <View style={styles.promoBadge}>
                          <CustomText fontFamily="SemiBold" fontSize={10} style={styles.promoText}>
                            Promo
                          </CustomText>
                        </View>
                      )}
                      <View style={styles.serviceIconContainer}>
                        <Image source={service.icon} style={styles.serviceIcon} />
                      </View>
                      <CustomText fontFamily="Medium" fontSize={12} style={styles.serviceName}>
                        {service.name}
                      </CustomText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity style={styles.promoBanner} onPress={() => setActiveTab("eats")}>
                <View style={styles.promoContent}>
                  <CustomText fontFamily="Bold" fontSize={18} style={styles.promoTitle}>
                    40% off your next 3{"\n"}restaurant orders.
                  </CustomText>
                  <TouchableOpacity style={styles.redeemButton} onPress={() => setActiveTab("eats")}>
                    <CustomText fontFamily="SemiBold" fontSize={14} style={styles.redeemText}>
                      Redeem now
                    </CustomText>
                    <Ionicons name="arrow-forward" size={RFValue(14)} color={Colors.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.promoImageContainer}>
                  <Ionicons name="restaurant" size={80} color="rgba(255,255,255,0.3)" />
                </View>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.searchBar} onPress={handleEatsSearchPress}>
                <Ionicons name="search" size={RFValue(18)} color={Colors.text} />
                <CustomText fontFamily="Regular" fontSize={14} style={styles.searchText}>
                  What are you craving?
                </CustomText>
              </TouchableOpacity>

              <View style={styles.section}>
                <CustomText fontFamily="SemiBold" fontSize={16} style={styles.sectionTitle}>
                  Categories
                </CustomText>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cuisineScroll}
                >
                  {cuisines.filter(c => c !== 'All').slice(0, 8).map((cuisine) => (
                    <TouchableOpacity
                      key={cuisine}
                      style={styles.cuisineCard}
                      onPress={() => handleCuisinePress(cuisine)}
                    >
                      <View style={styles.cuisineIconContainer}>
                        <Ionicons
                          name={cuisineIcons[cuisine] || "restaurant"}
                          size={RFValue(22)}
                          color={Colors.primary}
                        />
                      </View>
                      <CustomText fontFamily="Medium" fontSize={11} style={styles.cuisineName}>
                        {cuisine}
                      </CustomText>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <CustomText fontFamily="SemiBold" fontSize={16}>
                    Featured Restaurants
                  </CustomText>
                  <TouchableOpacity onPress={handleEatsSearchPress}>
                    <CustomText fontFamily="Regular" fontSize={13} style={styles.seeAll}>
                      See All
                    </CustomText>
                  </TouchableOpacity>
                </View>

                {restaurants.slice(0, 4).map((restaurant) => (
                  <TouchableOpacity
                    key={restaurant._id}
                    style={styles.restaurantCard}
                    onPress={() => handleRestaurantPress(restaurant._id)}
                  >
                    <View style={styles.restaurantImageContainer}>
                      <Ionicons name="restaurant" size={30} color={Colors.textLight} />
                    </View>
                    <View style={styles.restaurantInfo}>
                      <CustomText fontFamily="SemiBold" fontSize={14} numberOfLines={1}>
                        {restaurant.name}
                      </CustomText>
                      <View style={styles.restaurantMeta}>
                        <Ionicons name="star" size={RFValue(12)} color="#FFC107" />
                        <CustomText fontFamily="Regular" fontSize={12} style={styles.restaurantRating}>
                          {restaurant.rating.toFixed(1)}
                        </CustomText>
                        <View style={styles.metaDot} />
                        <CustomText fontFamily="Regular" fontSize={12} style={styles.restaurantCuisine}>
                          {restaurant.cuisine.slice(0, 2).join(', ')}
                        </CustomText>
                      </View>
                      <View style={styles.restaurantDelivery}>
                        <Ionicons name="time-outline" size={RFValue(12)} color={Colors.textLight} />
                        <CustomText fontFamily="Regular" fontSize={11} style={styles.deliveryText}>
                          {restaurant.preparationTime || 25}-{(restaurant.preparationTime || 25) + 15} min
                        </CustomText>
                        <View style={styles.metaDot} />
                        <CustomText fontFamily="Regular" fontSize={11} style={styles.deliveryText}>
                          ${restaurant.deliveryFee.toFixed(2)} delivery
                        </CustomText>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={RFValue(16)} color={Colors.textLight} />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={[styles.promoBanner, { backgroundColor: Colors.primary }]} onPress={handleEatsSearchPress}>
                <View style={styles.promoContent}>
                  <CustomText fontFamily="Bold" fontSize={18} style={styles.promoTitle}>
                    Free delivery on{"\n"}your first order!
                  </CustomText>
                  <TouchableOpacity style={styles.redeemButton} onPress={handleEatsSearchPress}>
                    <CustomText fontFamily="SemiBold" fontSize={14} style={styles.redeemText}>
                      Order now
                    </CustomText>
                    <Ionicons name="arrow-forward" size={RFValue(14)} color={Colors.white} />
                  </TouchableOpacity>
                </View>
                <View style={styles.promoImageContainer}>
                  <Ionicons name="fast-food" size={80} color="rgba(255,255,255,0.3)" />
                </View>
              </TouchableOpacity>
            </>
          )}

          {location?.address && (
            <View style={styles.currentLocation}>
              <Ionicons name="location" size={RFValue(14)} color={Colors.textLight} />
              <CustomText fontFamily="Regular" fontSize={11} style={styles.currentLocationText}>
                {location.address}
              </CustomText>
            </View>
          )}
        </ScrollView>

        {activeTab === "eats" && cartCount > 0 && (
          <TouchableOpacity
            style={styles.floatingCartButton}
            onPress={() => router.push("/customer/eats/cart")}
        >
            <View style={styles.cartBadge}>
              <CustomText fontFamily="SemiBold" fontSize={11} style={styles.cartBadgeText}>
                {cartCount}
              </CustomText>
            </View>
            <Ionicons name="cart" size={RFValue(20)} color={Colors.white} />
          </TouchableOpacity>
        )}

        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Ionicons name="home" size={RFValue(20)} color={Colors.text} />
            <CustomText fontFamily="SemiBold" fontSize={10} style={styles.navTextActive}>
              Home
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/customer/services")}>
            <Ionicons name="grid-outline" size={RFValue(20)} color={Colors.textLight} />
            <CustomText fontFamily="Regular" fontSize={10} style={styles.navText}>
              Services
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => setShowRideHistory(true)}>
            <Ionicons name="receipt-outline" size={RFValue(20)} color={Colors.textLight} />
            <CustomText fontFamily="Regular" fontSize={10} style={styles.navText}>
              Activity
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/customer/account")}>
            <Ionicons name="person-outline" size={RFValue(20)} color={Colors.textLight} />
            <CustomText fontFamily="Regular" fontSize={10} style={styles.navText}>
              Account
            </CustomText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <RideHistoryModal visible={showRideHistory} onClose={() => setShowRideHistory(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginRight: 24,
    gap: 8,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.text,
  },
  tabText: {
    color: Colors.textLight,
  },
  activeTabText: {
    color: Colors.text,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    marginHorizontal: 20,
    marginVertical: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  searchText: {
    flex: 1,
    color: Colors.text,
  },
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.white,
    borderRadius: 20,
  },
  section: {
    marginBottom: 24,
  },
  recentLocation: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    color: Colors.text,
    marginBottom: 2,
  },
  locationCity: {
    color: Colors.textLight,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAll: {
    color: Colors.textLight,
  },
  servicesGrid: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 16,
  },
  serviceCard: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  promoBadge: {
    position: "absolute",
    top: -4,
    right: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  promoText: {
    color: Colors.white,
  },
  serviceIconContainer: {
    width: screenWidth * 0.18,
    height: screenWidth * 0.18,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceIcon: {
    width: "60%",
    height: "60%",
    resizeMode: "contain",
  },
  serviceName: {
    color: Colors.text,
    textAlign: "center",
  },
  promoBanner: {
    marginHorizontal: 20,
    backgroundColor: "#7C2D12",
    borderRadius: 16,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 24,
  },
  promoContent: {
    flex: 1,
    padding: 20,
  },
  promoTitle: {
    color: Colors.white,
    marginBottom: 16,
    lineHeight: 24,
  },
  redeemButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  redeemText: {
    color: Colors.white,
  },
  promoImageContainer: {
    width: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  currentLocation: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 8,
  },
  currentLocationText: {
    color: Colors.textLight,
    flex: 1,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  navTextActive: {
    color: Colors.text,
  },
  navText: {
    color: Colors.textLight,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
    color: Colors.text,
  },
  cuisineScroll: {
    paddingHorizontal: 20,
  },
  cuisineCard: {
    alignItems: "center",
    marginRight: 16,
    width: 70,
  },
  cuisineIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cuisineName: {
    color: Colors.text,
    textAlign: "center",
  },
  restaurantCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    marginBottom: 1,
  },
  restaurantImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  restaurantRating: {
    marginLeft: 4,
    color: Colors.text,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textLight,
    marginHorizontal: 6,
  },
  restaurantCuisine: {
    color: Colors.textLight,
  },
  restaurantDelivery: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  deliveryText: {
    color: Colors.textLight,
    marginLeft: 4,
  },
  floatingCartButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: Colors.white,
  },
});

export default CustomerHome;
