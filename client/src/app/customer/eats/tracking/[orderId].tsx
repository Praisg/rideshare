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
import CustomText from '@/components/shared/CustomText';
import OrderStatusTimeline from '@/components/eats/OrderStatusTimeline';
import { Colors } from '@/utils/Constants';
import { getFoodOrderById, cancelFoodOrder, rateFoodOrder } from '@/service/foodOrderService';
import { useWS } from '@/service/WSProvider';
import RatingModal from '@/components/shared/RatingModal';

const OrderTrackingScreen = () => {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { on, off } = useWS();

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!orderId) return;

    const result = await getFoodOrderById(orderId);
    if (result.success) {
      setOrder(result.order);
      
      if (result.order.status === 'delivered' && !result.order.ratings?.restaurant) {
        setShowRating(true);
      }
    }
    setIsLoading(false);
  }, [orderId]);

  useEffect(() => {
    fetchOrder();

    on('order:status', (data: any) => {
      if (data.orderId === orderId) {
        setOrder((prev: any) => prev ? { ...prev, status: data.status } : prev);
        
        if (data.status === 'delivered') {
          setShowRating(true);
        }
      }
    });

    on('courier:location', (data: any) => {
      if (data.orderId === orderId) {
        setOrder((prev: any) => prev ? { 
          ...prev, 
          courierLocation: data.location 
        } : prev);
      }
    });

    return () => {
      off('order:status');
      off('courier:location');
    };
  }, [orderId]);

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
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

  const handleRatingSubmit = async (rating: number, feedback: string) => {
    await rateFoodOrder(orderId!, {
      restaurantRating: { score: rating, comment: feedback },
      courierRating: { score: rating, comment: feedback },
    });
    setShowRating(false);
  };

  const getStatusMessage = () => {
    if (!order) return '';
    
    switch (order.status) {
      case 'pending':
        return 'Waiting for restaurant to confirm';
      case 'restaurant_accepted':
        return 'Restaurant is preparing your order';
      case 'preparing':
        return 'Your food is being prepared';
      case 'ready_for_pickup':
        return 'Order is ready for pickup';
      case 'bidding_open':
        return 'Finding a courier for your order';
      case 'courier_assigned':
        return 'Courier is on the way to pickup';
      case 'picked_up':
        return 'Courier has picked up your order';
      case 'in_transit':
        return 'Your order is on its way!';
      case 'delivered':
        return 'Order delivered successfully!';
      case 'cancelled':
        return 'Order was cancelled';
      default:
        return 'Processing your order';
    }
  };

  const canCancel = order && ['pending', 'restaurant_accepted', 'preparing'].includes(order.status);

  if (isLoading || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor={Colors.white} />
        <View style={styles.loadingContainer}>
          <CustomText fontFamily="Medium" fontSize={16}>Loading order...</CustomText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.white} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/customer/home')} style={styles.backButton}>
          <Ionicons name="close" size={RFValue(22)} color={Colors.text} />
        </TouchableOpacity>
        <CustomText fontFamily="SemiBold" fontSize={16}>
          Order #{order.orderNumber}
        </CustomText>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={[
              styles.statusIcon,
              order.status === 'delivered' && styles.statusIconDelivered,
              order.status === 'cancelled' && styles.statusIconCancelled,
            ]}>
              <Ionicons 
                name={
                  order.status === 'delivered' ? 'checkmark' :
                  order.status === 'cancelled' ? 'close' :
                  order.status === 'in_transit' ? 'bicycle' :
                  'restaurant'
                } 
                size={RFValue(24)} 
                color={Colors.white} 
              />
            </View>
            <View style={styles.statusText}>
              <CustomText fontFamily="SemiBold" fontSize={16} style={styles.statusTitle}>
                {getStatusMessage()}
              </CustomText>
              {order.estimatedDeliveryTime && order.status !== 'delivered' && (
                <CustomText fontFamily="Regular" fontSize={13} style={styles.statusSubtitle}>
                  Estimated arrival: {new Date(order.estimatedDeliveryTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </CustomText>
              )}
            </View>
          </View>
        </View>

        {order.courierId && (
          <View style={styles.courierCard}>
            <View style={styles.courierInfo}>
              <View style={styles.courierAvatar}>
                <Ionicons name="person" size={RFValue(24)} color={Colors.textLight} />
              </View>
              <View style={styles.courierDetails}>
                <CustomText fontFamily="SemiBold" fontSize={15}>
                  {order.courierId.name || 'Courier'}
                </CustomText>
                <View style={styles.courierRating}>
                  <Ionicons name="star" size={RFValue(12)} color="#FFC107" />
                  <CustomText fontFamily="Regular" fontSize={12} style={styles.ratingText}>
                    4.8
                  </CustomText>
                </View>
              </View>
            </View>
            
            <View style={styles.courierActions}>
              {order.courierId.phone && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleCall(order.courierId.phone)}
                >
                  <Ionicons name="call" size={RFValue(18)} color={Colors.primary} />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble" size={RFValue(18)} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.timelineCard}>
          <CustomText fontFamily="SemiBold" fontSize={16} style={styles.cardTitle}>
            Order Status
          </CustomText>
          <OrderStatusTimeline
            currentStatus={order.status}
            timeline={order.timeline}
          />
        </View>

        <View style={styles.orderCard}>
          <CustomText fontFamily="SemiBold" fontSize={16} style={styles.cardTitle}>
            Order Details
          </CustomText>
          
          <View style={styles.orderItems}>
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
                <CustomText fontFamily="Medium" fontSize={14}>
                  ${item.subtotal.toFixed(2)}
                </CustomText>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.pricingRow}>
            <CustomText fontFamily="Regular" fontSize={14} style={styles.pricingLabel}>
              Subtotal
            </CustomText>
            <CustomText fontFamily="Medium" fontSize={14}>
              ${order.pricing?.itemsTotal?.toFixed(2) || '0.00'}
            </CustomText>
          </View>
          <View style={styles.pricingRow}>
            <CustomText fontFamily="Regular" fontSize={14} style={styles.pricingLabel}>
              Delivery Fee
            </CustomText>
            <CustomText fontFamily="Medium" fontSize={14}>
              ${order.acceptedBid?.amount?.toFixed(2) || order.pricing?.deliveryFee?.toFixed(2) || '0.00'}
            </CustomText>
          </View>
          <View style={styles.pricingRow}>
            <CustomText fontFamily="SemiBold" fontSize={15}>
              Total
            </CustomText>
            <CustomText fontFamily="Bold" fontSize={16} style={styles.totalAmount}>
              ${order.pricing?.total?.toFixed(2) || '0.00'}
            </CustomText>
          </View>
        </View>

        <View style={styles.addressCard}>
          <CustomText fontFamily="SemiBold" fontSize={16} style={styles.cardTitle}>
            Delivery Address
          </CustomText>
          <View style={styles.addressRow}>
            <Ionicons name="location" size={RFValue(18)} color={Colors.primary} />
            <CustomText fontFamily="Regular" fontSize={14} style={styles.addressText}>
              {order.deliveryAddress?.address || 'Address'}
            </CustomText>
          </View>
          {order.deliveryAddress?.instructions && (
            <CustomText fontFamily="Regular" fontSize={13} style={styles.instructions}>
              Note: {order.deliveryAddress.instructions}
            </CustomText>
          )}
        </View>

        {canCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancelOrder}>
            <CustomText fontFamily="Medium" fontSize={14} style={styles.cancelButtonText}>
              Cancel Order
            </CustomText>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <RatingModal
        visible={showRating}
        onClose={() => setShowRating(false)}
        onSubmit={handleRatingSubmit}
        title="Rate your order"
        subtitle="How was your food and delivery?"
      />
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
  content: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusIconDelivered: {
    backgroundColor: Colors.success,
  },
  statusIconCancelled: {
    backgroundColor: Colors.error,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    color: Colors.text,
    marginBottom: 4,
  },
  statusSubtitle: {
    color: Colors.textLight,
  },
  courierCard: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  courierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  courierAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  courierDetails: {},
  courierRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: Colors.textLight,
    marginLeft: 4,
  },
  courierActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineCard: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 8,
  },
  cardTitle: {
    color: Colors.text,
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 8,
  },
  orderItems: {
    marginBottom: 12,
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
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pricingLabel: {
    color: Colors.textLight,
  },
  totalAmount: {
    color: Colors.primary,
  },
  addressCard: {
    backgroundColor: Colors.white,
    padding: 20,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  addressText: {
    flex: 1,
    color: Colors.text,
  },
  instructions: {
    color: Colors.textLight,
    marginTop: 8,
    marginLeft: 30,
  },
  cancelButton: {
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: Colors.error,
  },
});

export default OrderTrackingScreen;

