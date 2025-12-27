import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import * as Location from 'expo-location';
import CustomText from '@/components/shared/CustomText';
import { Colors, screenWidth } from '@/utils/Constants';
import {
  getFoodOrderById,
  markPickedUp,
  markInTransit,
  markDelivered,
  updateCourierLocation,
} from '@/service/foodOrderService';
import { useWS } from '@/service/WSProvider';

type DeliveryPhase = 'pickup' | 'delivery';

const FoodDeliveryScreen = () => {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { emit } = useWS();

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<DeliveryPhase>('pickup');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    const result = await getFoodOrderById(orderId);
    if (result.success) {
      setOrder(result.order);
      
      if (result.order.status === 'picked_up' || result.order.status === 'in_transit') {
        setPhase('delivery');
      }
      
      if (result.order.status === 'delivered') {
        Alert.alert('Delivery Complete', 'This delivery has already been completed.');
        router.replace('/rider/home');
      }
    }
    setIsLoading(false);
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  useEffect(() => {
    let locationSubscription: any;

    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 20,
          },
          (location) => {
            const { latitude, longitude, heading } = location.coords;
            
            if (orderId) {
              updateCourierLocation(orderId, latitude, longitude, heading || undefined);
            }
          }
        );
      }
    };

    if (order && order.status !== 'delivered') {
      startLocationUpdates();
    }

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [order, orderId]);

  const handlePickup = async () => {
    setIsUpdating(true);
    const result = await markPickedUp(orderId!);
    
    if (result.success) {
      setOrder(result.order);
      setPhase('delivery');
      
      await markInTransit(orderId!);
    } else {
      Alert.alert('Error', result.error || 'Failed to mark as picked up');
    }
    setIsUpdating(false);
  };

  const handleDelivered = async () => {
    Alert.alert(
      'Confirm Delivery',
      'Have you handed the order to the customer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setIsUpdating(true);
            const result = await markDelivered(orderId!);
            
            if (result.success) {
              Alert.alert(
                'Delivery Complete!',
                `You earned $${result.courierEarnings?.toFixed(2) || '0.00'} on this delivery.`,
                [
                  {
                    text: 'OK',
                    onPress: () => router.replace('/rider/home'),
                  },
                ]
              );
            } else {
              Alert.alert('Error', result.error || 'Failed to complete delivery');
            }
            setIsUpdating(false);
          },
        },
      ]
    );
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleNavigate = (address: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${address.latitude},${address.longitude}`;
    Linking.openURL(url);
  };

  if (isLoading || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor={Colors.white} />
        <View style={styles.loadingContainer}>
          <CustomText fontFamily="Medium" fontSize={16}>Loading delivery...</CustomText>
        </View>
      </SafeAreaView>
    );
  }

  const currentAddress = phase === 'pickup' ? order.restaurantAddress : order.deliveryAddress;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={RFValue(20)} color={Colors.text} />
        </TouchableOpacity>
        <View>
          <CustomText fontFamily="SemiBold" fontSize={16}>
            {phase === 'pickup' ? 'Pickup Order' : 'Deliver Order'}
          </CustomText>
          <CustomText fontFamily="Regular" fontSize={12} style={styles.orderNumber}>
            #{order.orderNumber}
          </CustomText>
        </View>
        <View style={styles.backButton} />
      </View>

      <View style={styles.phaseIndicator}>
        <View style={[styles.phaseStep, phase === 'pickup' && styles.phaseStepActive]}>
          <View style={[styles.phaseIcon, phase !== 'pickup' && styles.phaseIconDone]}>
            {phase === 'delivery' ? (
              <Ionicons name="checkmark" size={RFValue(14)} color={Colors.white} />
            ) : (
              <Ionicons name="restaurant" size={RFValue(14)} color={Colors.white} />
            )}
          </View>
          <CustomText fontFamily="Medium" fontSize={12}>Pickup</CustomText>
        </View>
        
        <View style={[styles.phaseLine, phase === 'delivery' && styles.phaseLineDone]} />
        
        <View style={[styles.phaseStep, phase === 'delivery' && styles.phaseStepActive]}>
          <View style={[styles.phaseIcon, phase === 'delivery' && styles.phaseIconActive]}>
            <Ionicons name="home" size={RFValue(14)} color={phase === 'delivery' ? Colors.white : Colors.textLight} />
          </View>
          <CustomText fontFamily="Medium" fontSize={12}>Deliver</CustomText>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.destinationCard}>
          <View style={styles.destinationHeader}>
            <CustomText fontFamily="SemiBold" fontSize={16}>
              {phase === 'pickup' ? 'Pickup Location' : 'Delivery Address'}
            </CustomText>
            <TouchableOpacity
              style={styles.navigateButton}
              onPress={() => handleNavigate(currentAddress)}
            >
              <Ionicons name="navigate" size={RFValue(16)} color={Colors.white} />
              <CustomText fontFamily="SemiBold" fontSize={12} style={styles.navigateText}>
                Navigate
              </CustomText>
            </TouchableOpacity>
          </View>
          
          <View style={styles.addressRow}>
            <Ionicons
              name={phase === 'pickup' ? 'restaurant' : 'location'}
              size={RFValue(18)}
              color={phase === 'pickup' ? Colors.primary : Colors.error}
            />
            <CustomText fontFamily="Regular" fontSize={14} style={styles.addressText}>
              {currentAddress?.address || 'Address'}
            </CustomText>
          </View>

          {phase === 'pickup' && order.restaurantId?.contactPhone && (
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(order.restaurantId.contactPhone)}
            >
              <Ionicons name="call" size={RFValue(16)} color={Colors.primary} />
              <CustomText fontFamily="Medium" fontSize={14} style={styles.callText}>
                Call Restaurant
              </CustomText>
            </TouchableOpacity>
          )}

          {phase === 'delivery' && order.customerId?.phone && (
            <TouchableOpacity
              style={styles.callButton}
              onPress={() => handleCall(order.customerId.phone)}
            >
              <Ionicons name="call" size={RFValue(16)} color={Colors.primary} />
              <CustomText fontFamily="Medium" fontSize={14} style={styles.callText}>
                Call Customer
              </CustomText>
            </TouchableOpacity>
          )}

          {phase === 'delivery' && order.deliveryAddress?.instructions && (
            <View style={styles.instructionsBox}>
              <Ionicons name="information-circle" size={RFValue(16)} color={Colors.warning} />
              <CustomText fontFamily="Regular" fontSize={13} style={styles.instructionsText}>
                {order.deliveryAddress.instructions}
              </CustomText>
            </View>
          )}
        </View>

        <View style={styles.orderDetails}>
          <CustomText fontFamily="SemiBold" fontSize={16} style={styles.sectionTitle}>
            Order Items
          </CustomText>
          
          {order.items?.map((item: any, index: number) => (
            <View key={index} style={styles.orderItem}>
              <View style={styles.itemQuantity}>
                <CustomText fontFamily="Medium" fontSize={13}>
                  {item.quantity}x
                </CustomText>
              </View>
              <CustomText fontFamily="Regular" fontSize={14} style={styles.itemName}>
                {item.name}
              </CustomText>
            </View>
          ))}
        </View>

        <View style={styles.earningsCard}>
          <CustomText fontFamily="Medium" fontSize={14} style={styles.earningsLabel}>
            Your Earnings
          </CustomText>
          <CustomText fontFamily="Bold" fontSize={24} style={styles.earningsAmount}>
            ${(order.acceptedBid?.amount * 0.8)?.toFixed(2) || '0.00'}
          </CustomText>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.actionContainer}>
        {phase === 'pickup' ? (
          <TouchableOpacity
            style={[styles.actionButton, isUpdating && styles.actionButtonDisabled]}
            onPress={handlePickup}
            disabled={isUpdating}
          >
            <Ionicons name="bag-check" size={RFValue(20)} color={Colors.white} />
            <CustomText fontFamily="SemiBold" fontSize={16} style={styles.actionButtonText}>
              {isUpdating ? 'Updating...' : 'Picked Up Order'}
            </CustomText>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: Colors.success },
              isUpdating && styles.actionButtonDisabled,
            ]}
            onPress={handleDelivered}
            disabled={isUpdating}
          >
            <Ionicons name="checkmark-circle" size={RFValue(20)} color={Colors.white} />
            <CustomText fontFamily="SemiBold" fontSize={16} style={styles.actionButtonText}>
              {isUpdating ? 'Completing...' : 'Mark as Delivered'}
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderNumber: {
    color: Colors.textLight,
    marginTop: 2,
  },
  phaseIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  phaseStep: {
    alignItems: 'center',
    gap: 8,
  },
  phaseStepActive: {},
  phaseIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseIconActive: {
    backgroundColor: Colors.primary,
  },
  phaseIconDone: {
    backgroundColor: Colors.success,
  },
  phaseLine: {
    width: 60,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  phaseLineDone: {
    backgroundColor: Colors.success,
  },
  content: {
    flex: 1,
  },
  destinationCard: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 8,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  navigateText: {
    color: Colors.white,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  addressText: {
    flex: 1,
    color: Colors.text,
    lineHeight: 22,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F0FDF4',
    gap: 8,
  },
  callText: {
    color: Colors.primary,
  },
  instructionsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  instructionsText: {
    flex: 1,
    color: '#92400E',
  },
  orderDetails: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 8,
  },
  sectionTitle: {
    color: Colors.text,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemQuantity: {
    width: 32,
    height: 32,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemName: {
    flex: 1,
    color: Colors.text,
  },
  earningsCard: {
    backgroundColor: Colors.white,
    padding: 20,
    alignItems: 'center',
    marginBottom: 8,
  },
  earningsLabel: {
    color: Colors.textLight,
    marginBottom: 8,
  },
  earningsAmount: {
    color: Colors.primary,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 34,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: Colors.white,
  },
});

export default FoodDeliveryScreen;

