import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@/components/shared/CustomText';
import DeliveryBidCard from '@/components/eats/DeliveryBidCard';
import { Colors } from '@/utils/Constants';
import { getFoodOrderById, acceptBid, cancelFoodOrder } from '@/service/foodOrderService';
import { useWS } from '@/service/WSProvider';

const BiddingScreen = () => {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { on, off } = useWS();

  const [order, setOrder] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [acceptingBid, setAcceptingBid] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    const result = await getFoodOrderById(orderId);
    if (result.success) {
      setOrder(result.order);
      setBids(result.order.bids || []);

      if (result.order.status === 'courier_assigned' || 
          result.order.status === 'picked_up' || 
          result.order.status === 'in_transit') {
        router.replace(`/customer/eats/tracking/${orderId}`);
      }
    }
    setIsLoading(false);
  }, [orderId]);

  useEffect(() => {
    fetchOrder();

    on('delivery:bid', (data: any) => {
      if (data.orderId === orderId) {
        setBids((prev) => {
          const existingBid = prev.find((b) => b.courierId === data.bid.courierId);
          if (existingBid) return prev;
          return [...prev, data.bid];
        });
      }
    });

    on('order:status', (data: any) => {
      if (data.orderId === orderId) {
        if (data.status === 'courier_assigned') {
          router.replace(`/customer/eats/tracking/${orderId}`);
        }
      }
    });

    return () => {
      off('delivery:bid');
      off('order:status');
    };
  }, [orderId]);

  const handleAcceptBid = async (courierId: string) => {
    setAcceptingBid(courierId);
    
    const result = await acceptBid(orderId!, courierId);
    
    if (result.success) {
      router.replace(`/customer/eats/tracking/${orderId}`);
    } else {
      Alert.alert('Error', result.error || 'Failed to accept bid');
    }
    
    setAcceptingBid(null);
  };

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelFoodOrder(orderId!, 'Customer cancelled');
            if (result.success) {
              router.replace('/customer/home');
            } else {
              Alert.alert('Error', result.error || 'Failed to cancel order');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor={Colors.white} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <CustomText fontFamily="Medium" fontSize={16} style={styles.loadingText}>
            Loading order...
          </CustomText>
        </View>
      </SafeAreaView>
    );
  }

  const pendingBids = bids.filter((bid) => bid.status === 'pending');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <View style={styles.backButton} />
        <CustomText fontFamily="SemiBold" fontSize={18}>Find Courier</CustomText>
        <TouchableOpacity onPress={handleCancelOrder} style={styles.cancelButton}>
          <CustomText fontFamily="Medium" fontSize={14} style={styles.cancelText}>
            Cancel
          </CustomText>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusSection}>
          <View style={styles.pulseContainer}>
            <View style={styles.pulseOuter} />
            <View style={styles.pulseInner}>
              <Ionicons name="bicycle" size={RFValue(24)} color={Colors.white} />
            </View>
          </View>
          
          <CustomText fontFamily="SemiBold" fontSize={18} style={styles.statusTitle}>
            {pendingBids.length > 0 
              ? `${pendingBids.length} courier${pendingBids.length > 1 ? 's' : ''} bidding`
              : 'Waiting for couriers...'}
          </CustomText>
          <CustomText fontFamily="Regular" fontSize={14} style={styles.statusSubtitle}>
            Couriers nearby are placing bids to deliver your order
          </CustomText>
        </View>

        {order && (
          <View style={styles.orderSummary}>
            <CustomText fontFamily="SemiBold" fontSize={14} style={styles.orderLabel}>
              Order #{order.orderNumber}
            </CustomText>
            <View style={styles.orderRow}>
              <Ionicons name="restaurant-outline" size={RFValue(16)} color={Colors.textLight} />
              <CustomText fontFamily="Regular" fontSize={13} style={styles.orderText} numberOfLines={1}>
                {order.restaurantAddress?.address || 'Restaurant'}
              </CustomText>
            </View>
            <View style={styles.orderRow}>
              <Ionicons name="location-outline" size={RFValue(16)} color={Colors.textLight} />
              <CustomText fontFamily="Regular" fontSize={13} style={styles.orderText} numberOfLines={1}>
                {order.deliveryAddress?.address || 'Delivery address'}
              </CustomText>
            </View>
            <View style={styles.orderRow}>
              <Ionicons name="receipt-outline" size={RFValue(16)} color={Colors.textLight} />
              <CustomText fontFamily="Regular" fontSize={13} style={styles.orderText}>
                {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''} - ${order.pricing?.total?.toFixed(2) || '0.00'}
              </CustomText>
            </View>
          </View>
        )}

        {pendingBids.length > 0 && (
          <View style={styles.bidsSection}>
            <CustomText fontFamily="SemiBold" fontSize={16} style={styles.bidsTitle}>
              Available Couriers
            </CustomText>
            
            {pendingBids.map((bid) => (
              <DeliveryBidCard
                key={bid.courierId}
                bid={bid}
                onAccept={() => handleAcceptBid(bid.courierId)}
                isLoading={acceptingBid === bid.courierId}
              />
            ))}
          </View>
        )}

        {pendingBids.length === 0 && (
          <View style={styles.waitingSection}>
            <ActivityIndicator size="small" color={Colors.primary} />
            <CustomText fontFamily="Regular" fontSize={14} style={styles.waitingText}>
              Looking for nearby couriers...
            </CustomText>
            <CustomText fontFamily="Regular" fontSize={12} style={styles.waitingSubtext}>
              This usually takes 1-3 minutes
            </CustomText>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.textLight,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 60,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: Colors.error,
  },
  content: {
    flex: 1,
  },
  statusSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  pulseContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pulseOuter: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    opacity: 0.2,
  },
  pulseInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusTitle: {
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  statusSubtitle: {
    color: Colors.textLight,
    textAlign: 'center',
  },
  orderSummary: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  orderLabel: {
    color: Colors.text,
    marginBottom: 12,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  orderText: {
    color: Colors.textLight,
    flex: 1,
  },
  bidsSection: {
    paddingHorizontal: 20,
  },
  bidsTitle: {
    color: Colors.text,
    marginBottom: 16,
  },
  waitingSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  waitingText: {
    color: Colors.textLight,
    marginTop: 16,
  },
  waitingSubtext: {
    color: Colors.textLight,
    marginTop: 4,
  },
});

export default BiddingScreen;

