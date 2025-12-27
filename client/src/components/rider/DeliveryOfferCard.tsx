import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '../shared/CustomText';
import { Colors } from '@/utils/Constants';

interface DeliveryOfferCardProps {
  order: {
    _id: string;
    orderNumber: string;
    restaurantAddress?: {
      address: string;
    };
    deliveryAddress: {
      address: string;
    };
    deliveryDistance: number;
    pricing: {
      total: number;
    };
    items: Array<{ quantity: number }>;
  };
  onBid: () => void;
  onViewDetails?: () => void;
}

const DeliveryOfferCard: React.FC<DeliveryOfferCardProps> = ({
  order,
  onBid,
  onViewDetails,
}) => {
  const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const estimatedEarnings = (order.pricing.total * 0.15).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.orderBadge}>
          <Ionicons name="fast-food" size={RFValue(14)} color={Colors.primary} />
          <CustomText fontFamily="SemiBold" fontSize={12} style={styles.orderType}>
            Food Delivery
          </CustomText>
        </View>
        <CustomText fontFamily="Regular" fontSize={11} style={styles.orderNumber}>
          #{order.orderNumber}
        </CustomText>
      </View>

      <View style={styles.locationSection}>
        <View style={styles.locationRow}>
          <View style={[styles.dot, styles.pickupDot]} />
          <View style={styles.locationInfo}>
            <CustomText fontFamily="Medium" fontSize={12} style={styles.locationLabel}>
              Pickup
            </CustomText>
            <CustomText fontFamily="Regular" fontSize={13} numberOfLines={1} style={styles.locationAddress}>
              {order.restaurantAddress?.address || 'Restaurant'}
            </CustomText>
          </View>
        </View>
        
        <View style={styles.locationLine} />
        
        <View style={styles.locationRow}>
          <View style={[styles.dot, styles.deliveryDot]} />
          <View style={styles.locationInfo}>
            <CustomText fontFamily="Medium" fontSize={12} style={styles.locationLabel}>
              Delivery
            </CustomText>
            <CustomText fontFamily="Regular" fontSize={13} numberOfLines={1} style={styles.locationAddress}>
              {order.deliveryAddress.address}
            </CustomText>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="navigate-outline" size={RFValue(14)} color={Colors.textLight} />
          <CustomText fontFamily="Medium" fontSize={13}>
            {order.deliveryDistance?.toFixed(1) || '?'} km
          </CustomText>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.stat}>
          <Ionicons name="bag-outline" size={RFValue(14)} color={Colors.textLight} />
          <CustomText fontFamily="Medium" fontSize={13}>
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </CustomText>
        </View>
        
        <View style={styles.statDivider} />
        
        <View style={styles.stat}>
          <Ionicons name="cash-outline" size={RFValue(14)} color={Colors.primary} />
          <CustomText fontFamily="SemiBold" fontSize={13} style={styles.earnings}>
            ~${estimatedEarnings}
          </CustomText>
        </View>
      </View>

      <View style={styles.actions}>
        {onViewDetails && (
          <TouchableOpacity style={styles.detailsButton} onPress={onViewDetails}>
            <CustomText fontFamily="Medium" fontSize={14} style={styles.detailsButtonText}>
              Details
            </CustomText>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity style={styles.bidButton} onPress={onBid}>
          <CustomText fontFamily="SemiBold" fontSize={14} style={styles.bidButtonText}>
            Place Bid
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  orderType: {
    color: Colors.primary,
  },
  orderNumber: {
    color: Colors.textLight,
  },
  locationSection: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  pickupDot: {
    backgroundColor: Colors.primary,
  },
  deliveryDot: {
    backgroundColor: Colors.error,
  },
  locationLine: {
    width: 2,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginLeft: 4,
    marginVertical: 2,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    color: Colors.textLight,
    marginBottom: 2,
  },
  locationAddress: {
    color: Colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
  },
  earnings: {
    color: Colors.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  detailsButtonText: {
    color: Colors.text,
  },
  bidButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  bidButtonText: {
    color: Colors.white,
  },
});

export default DeliveryOfferCard;

