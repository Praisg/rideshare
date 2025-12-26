import { View, Text, Platform } from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { homeStyles } from "@/styles/homeStyles";
import { StatusBar } from "expo-status-bar";
import LocationBar from "@/components/customer/LocationBar";
import { screenHeight } from "@/utils/Constants";
import DraggableMap from "@/components/customer/DraggableMap";
import { SimpleBottomSheet, SimpleBottomSheetScrollView } from "@/components/shared/SimpleBottomSheet";
import SheetContent from "@/components/customer/SheetContent";
import { getMyRides } from "@/service/rideService";

const androidHeights = [
  screenHeight * 0.12,
  screenHeight * 0.42,
  screenHeight * 0.8,
];
const iosHeights = [screenHeight * 0.2, screenHeight * 0.5, screenHeight * 0.8];

const CustomerHome = () => {
  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(
    () => (Platform.OS === "ios" ? iosHeights : androidHeights),
    []
  );

  const handleSheetChanges = useCallback((index: number) => {
    // Sheet position changed, can be used for other logic if needed
  }, []);

  useEffect(() => {
    getMyRides();
  }, []);

  return (
    <View style={homeStyles.container}>
      <StatusBar style="light" backgroundColor="orange" translucent={false} />
      <LocationBar />

      <DraggableMap height={screenHeight} />

      <SimpleBottomSheet
        ref={bottomSheetRef}
        initialIndex={1}
        handleIndicatorStyle={{
          backgroundColor: "#ccc",
        }}
        enableOverDrag={false}
        enableDynamicSizing={false}
        style={{ zIndex: 4 }}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        <SimpleBottomSheetScrollView
          contentContainerStyle={homeStyles.scrollContainer}
        >
          <SheetContent />
        </SimpleBottomSheetScrollView>
      </SimpleBottomSheet>
    </View>
  );
};

export default CustomerHome;
