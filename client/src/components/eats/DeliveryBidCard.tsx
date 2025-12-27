import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '../shared/CustomText';
import { Colors } from '@/utils/Constants';

interface DeliveryBidCardProps {
  bid: {
    courierId: string;
    amount: number;
    estimatedTime?: number;
    message?: string;
    courier?: {
      name: string;
      rating?: number;
    };
  };
  onAccept: () => void;
  isLoading?: boolean;
}

const DeliveryBidCard: React.FC<DeliveryBidCardProps> = ({
  bid,
  onAccept,
  isLoading,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.courierInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={RFValue(20)} color={Colors.textLight} />
          </View>
          <View>
            <CustomText fontFamily="SemiBold" fontSize={14} style={styles.name}>
              {bid.courier?.name || 'Courier'}
            </CustomText>
            {bid.courier?.rating && (
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={RFValue(12)} color="#FFC107" />
                <CustomText fontFamily="Regular" fontSize={12} style={styles.rating}>
                  {bid.courier.rating.toFixed(1)}
                </CustomText>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.bidAmount}>
          <CustomText fontFamily="Bold" fontSize={18} style={styles.amount}>
            ${bid.amount.toFixed(2)}
          </CustomText>
          <CustomText fontFamily="Regular" fontSize={11} style={styles.deliveryFee}>
            delivery fee
          </CustomText>
        </View>
      </View>

      {bid.estimatedTime && (
        <View style={styles.etaRow}>
          <Ionicons name="time-outline" size={RFValue(14)} color={Colors.textLight} />
          <CustomText fontFamily="Regular" fontSize={12} style={styles.etaText}>
            Estimated delivery in {bid.estimatedTime} mins
          </CustomText>
        </View>
      )}

      {bid.message && (
        <View style={styles.messageRow}>
          <Ionicons name="chatbubble-outline" size={RFValue(14)} color={Colors.textLight} />
          <CustomText fontFamily="Regular" fontSize={12} style={styles.messageText}>
            "{bid.message}"
          </CustomText>
        </View>
      )}

      <TouchableOpacity
        style={[styles.acceptButton, isLoading && styles.acceptButtonDisabled]}
        onPress={onAccept}
        disabled={isLoading}
      >
        <CustomText fontFamily="SemiBold" fontSize={14} style={styles.acceptButtonText}>
          {isLoading ? 'Accepting...' : 'Accept Bid'}
        </CustomText>
      </TouchableOpacity>
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
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  courierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    color: Colors.text,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    color: Colors.textLight,
  },
  bidAmount: {
    alignItems: 'flex-end',
  },
  amount: {
    color: Colors.primary,
  },
  deliveryFee: {
    color: Colors.textLight,
  },
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  etaText: {
    color: Colors.textLight,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 12,
  },
  messageText: {
    color: Colors.textLight,
    flex: 1,
    fontStyle: 'italic',
  },
  acceptButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    opacity: 0.6,
  },
  acceptButtonText: {
    color: Colors.white,
  },
});

export default DeliveryBidCard;

