import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Alert, Keyboard } from "react-native";
import React, { memo, useCallback, useMemo, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useUserStore } from "@/store/userStore";
import { rideStyles } from "@/styles/rideStyles";
import { StatusBar } from "expo-status-bar";
import { calculateFare, getSuggestedPriceRange } from "@/utils/mapUtils";
import RoutesMap from "@/components/customer/RoutesMap";
import CustomText from "@/components/shared/CustomText";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { commonStyles } from "@/styles/commonStyles";
import CustomButton from "@/components/shared/CustomButton";
import { createRide } from "@/service/rideService";
import { Colors } from "@/utils/Constants";

const RideBooking = () => {
  const route = useRoute() as any;
  const item = route?.params as any;
  const { location } = useUserStore() as any;
  const [selectedOption, setSelectedOption] = useState("Bike");
  const [loading, setLoading] = useState(false);
  const [proposedPrice, setProposedPrice] = useState("");

  const farePrices = useMemo(
    () => calculateFare(parseFloat(item?.distanceInKm)),
    [item?.distanceInKm]
  );

  const vehicleTypeMapping: Record<string, string> = {
    "Bike": "bike",
    "Cab Economy": "cabEconomy",
    "Cab Premium": "cabPremium",
  };

  const priceRange = useMemo(
    () => getSuggestedPriceRange(
      parseFloat(item?.distanceInKm), 
      vehicleTypeMapping[selectedOption] || "bike"
    ),
    [item?.distanceInKm, selectedOption]
  );

  const getDropTime = (additionalMinutes: number = 0) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + (farePrices?.estimatedTime || 0) + additionalMinutes);
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const rideOptions = useMemo(
    () => [
      {
        type: "Bike",
        seats: 1,
        time: `${farePrices?.estimatedTime || 1} min`,
        dropTime: getDropTime(0),
        price: farePrices?.bike,
        isFastest: true,
        icon: require("@/assets/icons/bike.png"),
      },
      {
        type: "Cab Economy",
        seats: 4,
        time: `${farePrices?.estimatedTime || 1} min`,
        dropTime: getDropTime(0),
        price: farePrices.cabEconomy,
        icon: require("@/assets/icons/cab.png"),
      },
      {
        type: "Cab Premium",
        seats: 4,
        time: `${farePrices?.estimatedTime || 1} min`,
        dropTime: getDropTime(1),
        price: farePrices.cabPremium,
        icon: require("@/assets/icons/cab_premium.png"),
      },
    ],
    [farePrices]
  );

  const handleOptionSelect = useCallback((type: string) => {
    setSelectedOption(type);
  }, []);

  const handleRideBooking = async () => {
    const price = parseFloat(proposedPrice);
    
    if (!proposedPrice || isNaN(price) || price <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid price for your ride");
      return;
    }

    if (price < priceRange.min) {
      Alert.alert(
        "Price Too Low", 
        `Your proposed price ($${price.toFixed(2)}) is below the minimum suggested price ($${priceRange.min.toFixed(2)}). Drivers may not accept this offer.`,
        [
          { text: "Change Price", style: "cancel" },
          { 
            text: "Continue Anyway", 
            onPress: () => submitRide(price),
            style: "destructive" 
          }
        ]
      );
      return;
    }

    if (price > priceRange.max) {
      Alert.alert(
        "Price Too High", 
        `Your proposed price ($${price.toFixed(2)}) is above the maximum suggested price ($${priceRange.max.toFixed(2)}). You might be overpaying.`,
        [
          { text: "Change Price", style: "cancel" },
          { 
            text: "Continue Anyway", 
            onPress: () => submitRide(price) 
          }
        ]
      );
      return;
    }

    await submitRide(price);
  };

  const submitRide = async (price: number) => {
    setLoading(true);

    try {
      const vehicleType = vehicleTypeMapping[selectedOption];
      
      if (!vehicleType) {
        Alert.alert("Error", "Please select a valid vehicle type");
        setLoading(false);
        return;
      }

      await createRide({
        vehicle: vehicleType,
        drop: {
          latitude: parseFloat(item.drop_latitude),
          longitude: parseFloat(item.drop_longitude),
          address: item?.drop_address,
        },
        pickup: {
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          address: location.address,
        },
        pricingModel: "fixed",
        proposedPrice: price,
        suggestedPriceRange: {
          min: priceRange.min,
          max: priceRange.max,
        },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to create ride. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" backgroundColor="orange" translucent={false} />

      {item?.drop_latitude && location?.latitude && (
        <RoutesMap
          drop={{
            latitude: parseFloat(item?.drop_latitude),
            longitude: parseFloat(item?.drop_longitude),
          }}
          pickup={{
            latitude: parseFloat(location?.latitude),
            longitude: parseFloat(location?.longitude),
          }}
        />
      )}

      <View style={rideStyles.rideSelectionContainer}>
        {farePrices?.surgeMultiplier > 1 ? (
          <View style={[rideStyles?.offerContainer, { backgroundColor: '#FFE5E5' }]}>
            <CustomText fontSize={12} style={[rideStyles.offerText, { color: '#D32F2F' }]}>
              High demand! Prices are {farePrices.surgeMultiplier}x higher than usual
            </CustomText>
          </View>
        ) : (
          <View style={rideStyles?.offerContainer}>
            <CustomText fontSize={12} style={rideStyles.offerText}>
              You get $10 off 5 coins cashback!
            </CustomText>
          </View>
        )}

        <ScrollView
          contentContainerStyle={rideStyles?.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {rideOptions?.map((ride, index) => (
            <RideOption
              key={index}
              ride={ride}
              selected={selectedOption}
              onSelect={handleOptionSelect}
            />
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={rideStyles.backButton}
        onPress={() => router.back()}
      >
        <MaterialIcons
          name="arrow-back-ios"
          size={RFValue(14)}
          style={{ left: 4 }}
          color="black"
        />
      </TouchableOpacity>

      <View style={rideStyles.bookingContainer}>
        <View style={{ padding: 15, backgroundColor: '#F8F9FA', borderRadius: 10, marginBottom: 15 }}>
          <CustomText fontFamily="SemiBold" fontSize={14} style={{ marginBottom: 8 }}>
            Your Offer
          </CustomText>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <TextInput
                value={proposedPrice}
                onChangeText={setProposedPrice}
                placeholder={`$${priceRange.suggested.toFixed(2)}`}
                keyboardType="decimal-pad"
                returnKeyType="done"
                blurOnSubmit={true}
                onSubmitEditing={() => Keyboard.dismiss()}
                style={{
                  backgroundColor: Colors.white,
                  borderRadius: 8,
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                  fontSize: RFValue(16),
                  fontFamily: 'Bold',
                  borderWidth: 2,
                  borderColor: proposedPrice ? Colors.primary : '#E5E7EB',
                }}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                setProposedPrice(priceRange.suggested.toString());
                Keyboard.dismiss();
              }}
              style={{
                backgroundColor: Colors.primary,
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderRadius: 8,
              }}
            >
              <CustomText fontFamily="Medium" fontSize={10} style={{ color: Colors.white }}>
                Suggested
              </CustomText>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
            <CustomText fontSize={10} style={{ color: '#6B7280' }}>
              Min: ${priceRange.min.toFixed(2)}
            </CustomText>
            <CustomText fontSize={10} style={{ color: '#6B7280' }}>
              Suggested: ${priceRange.suggested.toFixed(2)}
            </CustomText>
            <CustomText fontSize={10} style={{ color: '#6B7280' }}>
              Max: ${priceRange.max.toFixed(2)}
            </CustomText>
          </View>

          <View style={{ marginTop: 10, padding: 10, backgroundColor: '#FFF3CD', borderRadius: 6 }}>
            <CustomText fontSize={9} style={{ color: '#856404', textAlign: 'center' }}>
              💡 Drivers will see your offer and can accept or counter-offer with their price
            </CustomText>
          </View>
        </View>

        <CustomButton
          title="Propose Price & Find Drivers"
          disabled={loading}
          loading={loading}
          onPress={handleRideBooking}
        />
      </View>
    </View>
  );
};

const RideOption = memo(({ ride, selected, onSelect }: any) => (
  <TouchableOpacity
    onPress={() => onSelect(ride?.type)}
    style={[
      rideStyles.rideOption,
      { borderColor: selected === ride.type ? "#222" : "#ddd" },
    ]}
  >
    <View style={commonStyles.flexRowBetween}>
      <Image source={ride?.icon} style={rideStyles?.rideIcon} />

      <View style={rideStyles?.rideDetails}>
        <CustomText fontFamily="Medium" fontSize={12}>
          {ride?.type}{" "}
          {ride?.isFastest && (
            <Text style={rideStyles.fastestLabel}>FASTEST</Text>
          )}
        </CustomText>
        <CustomText fontSize={10}>
          {ride?.seats} seats • {ride?.time} away • Drop {ride?.dropTime}
        </CustomText>
      </View>

      <View style={rideStyles?.priceContainer}>
        <CustomText fontFamily="Medium" fontSize={14}>
          ${ride?.price?.toFixed(2)}
        </CustomText>
        {selected === ride.type && (
          <Text style={rideStyles?.discountedPrice}>
            ${Number(ride?.price + 10).toFixed(2)}
          </Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
));

export default memo(RideBooking);
