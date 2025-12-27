import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { FC, memo, useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import MapView, { Marker, Region } from "react-native-maps";
import { useUserStore } from "@/store/userStore";
import { useWS } from "@/service/WSProvider";
import { customMapStyle, defaultInitialRegion } from "@/utils/CustomMap";
import { reverseGeocode } from "@/utils/mapUtils";
import haversine from "haversine-distance";
import { mapStyles } from "@/styles/mapStyles";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import * as Location from "expo-location";

const DraggableMap: FC<{ height: number }> = ({ height }) => {
  const isFocused = useIsFocused();
  const [markers, setMarkers] = useState<any>([]);
  const [currentRegion, setCurrentRegion] = useState(defaultInitialRegion);
  const mapRef = useRef<MapView>(null);
  const { setLocation, location, outOfRange, setOutOfRange } = useUserStore();
  const { emit, on, off } = useWS();
  const MAX_DISTANCE_THRESHOLD = 10000;

  useEffect(() => {
    (async () => {
      if (isFocused) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          try {
            const location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Balanced,
            });
            const { latitude, longitude } = location.coords;
            
            const newRegion = {
              latitude,
              longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            };
            
            setCurrentRegion(newRegion);
            
            mapRef.current?.animateToRegion(newRegion, 1000);
            
            handleRegionChangeComplete(newRegion);
          } catch (error) {
            console.error("Error getting current location:", error);
          }
        } else {
          console.log("Permission to access location was denied");
        }
      }
    })();
  }, [mapRef, isFocused]);

  // REALTIME NEARBY RIDERS (Uncomment when ready to implement)

  // useEffect(() => {
  //   if (location?.latitude && location?.longitude && isFocused) {
  //     emit("subscribeToZone", {
  //       latitude: location.latitude,
  //       longitude: location.longitude,
  //     });

  //     on("nearbyRiders", (riders: any[]) => {
  //       const updatedMarkers = riders.map((rider) => ({
  //         id: rider.id,
  //         latitude: rider.coords.latitude,
  //         longitude: rider.coords.longitude,
  //         type: "rider",
  //         rotation: rider.coords.heading,
  //         visible: true,
  //       }));
  //       setMarkers(updatedMarkers);
  //     });
  //   }

  //   return () => {
  //     off("nearbyriders");
  //   };
  // }, [location, emit, on, off, isFocused]);

  const handleRegionChangeComplete = async (newRegion: Region) => {
    const address = await reverseGeocode(
      newRegion.latitude,
      newRegion.longitude
    );
    setLocation({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
      address: address,
    });

    const userLocation = {
      latitude: location?.latitude,
      longitude: location?.longitude,
    } as any;
    if (userLocation) {
      const newLocation = {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
      };
      const distance = haversine(userLocation, newLocation);
      setOutOfRange(distance > MAX_DISTANCE_THRESHOLD);
    }
  };

  const handleGpsButtonPress = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      mapRef.current?.fitToCoordinates([{ latitude, longitude }], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
      const address = await reverseGeocode(latitude, longitude);
      setLocation({ latitude, longitude, address });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  return (
    <View style={{ height: height, width: "100%", backgroundColor: '#f0f0f0' }}>
      <MapView
        ref={mapRef}
        maxZoomLevel={18}
        minZoomLevel={10}
        pitchEnabled={false}
        onRegionChangeComplete={handleRegionChangeComplete}
        style={{ flex: 1 }}
        initialRegion={currentRegion}
        provider="google"
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsTraffic={false}
        showsScale={false}
        showsBuildings={false}
        showsPointsOfInterest={false}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
        loadingEnabled={true}
        loadingIndicatorColor="#666666"
        loadingBackgroundColor="#ffffff"
      >
        {markers
          ?.filter(
            (marker: any) =>
              marker?.latitude && marker.longitude && marker.visible
          )
          .map((marker: any, index: number) => (
            <Marker
              key={index}
              zIndex={index + 1}
              flat
              anchor={{ x: 0.5, y: 0.5 }}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker?.longitude,
              }}
            >
              <View
                style={{ transform: [{ rotate: `${marker?.rotation}deg` }] }}
              >
                <Image
                  source={
                    marker.type === "bike"
                      ? require("@/assets/icons/bike_marker.png")
                      : require("@/assets/icons/cab_marker.png")
                  }
                  style={{ height: 40, width: 40, resizeMode: "contain" }}
                />
              </View>
            </Marker>
          ))}
      </MapView>

      <View style={mapStyles.centerMarkerContainer}>
        <Image
          source={require("@/assets/icons/marker.png")}
          style={mapStyles.marker}
        />
      </View>
      <TouchableOpacity
        style={mapStyles.gpsButton}
        onPress={handleGpsButtonPress}
      >
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(16)}
          color="#3C75BE"
        />
      </TouchableOpacity>

      {outOfRange && (
        <View style={mapStyles.outOfRange}>
          <FontAwesome6 name="road-circle-exclamation" size={24} color="red" />
        </View>
      )}
    </View>
  );
};

export default memo(DraggableMap);
