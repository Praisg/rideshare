import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '../shared/CustomText';
import { Colors, screenWidth } from '@/utils/Constants';

interface DeliveryBiddingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (amount: number, estimatedTime: number, message?: string) => void;
  order: {
    orderNumber: string;
    deliveryDistance: number;
    pricing: { total: number };
    restaurantAddress?: { address: string };
    deliveryAddress: { address: string };
  } | null;
  isLoading?: boolean;
}

const DeliveryBiddingModal: React.FC<DeliveryBiddingModalProps> = ({
  visible,
  onClose,
  onSubmit,
  order,
  isLoading,
}) => {
  const [bidAmount, setBidAmount] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('25');
  const [message, setMessage] = useState('');

  const suggestedBid = order ? (order.deliveryDistance * 1.5 + 2).toFixed(2) : '5.00';
  const platformFee = bidAmount ? (parseFloat(bidAmount) * 0.2).toFixed(2) : '0.00';
  const yourEarnings = bidAmount ? (parseFloat(bidAmount) * 0.8).toFixed(2) : '0.00';

  const handleSubmit = () => {
    const amount = parseFloat(bidAmount);
    const time = parseInt(estimatedTime, 10);
    
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    
    onSubmit(amount, time || 25, message || undefined);
  };

  const handleQuickBid = (multiplier: number) => {
    const base = parseFloat(suggestedBid);
    setBidAmount((base * multiplier).toFixed(2));
  };

  if (!order) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        
        <View style={styles.container}>
          <View style={styles.handle} />
          
          <View style={styles.header}>
            <CustomText fontFamily="SemiBold" fontSize={18}>
              Place Your Bid
            </CustomText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={RFValue(22)} color={Colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.orderInfo}>
            <View style={styles.orderRow}>
              <Ionicons name="restaurant" size={RFValue(16)} color={Colors.primary} />
              <CustomText fontFamily="Regular" fontSize={13} numberOfLines={1} style={styles.orderAddress}>
                {order.restaurantAddress?.address || 'Restaurant'}
              </CustomText>
            </View>
            <View style={styles.orderRow}>
              <Ionicons name="location" size={RFValue(16)} color={Colors.error} />
              <CustomText fontFamily="Regular" fontSize={13} numberOfLines={1} style={styles.orderAddress}>
                {order.deliveryAddress.address}
              </CustomText>
            </View>
            <View style={styles.orderStats}>
              <View style={styles.orderStat}>
                <Ionicons name="navigate-outline" size={RFValue(14)} color={Colors.textLight} />
                <CustomText fontFamily="Medium" fontSize={12}>
                  {order.deliveryDistance?.toFixed(1) || '?'} km
                </CustomText>
              </View>
              <View style={styles.orderStat}>
                <Ionicons name="cash-outline" size={RFValue(14)} color={Colors.textLight} />
                <CustomText fontFamily="Medium" fontSize={12}>
                  Order: ${order.pricing.total.toFixed(2)}
                </CustomText>
              </View>
            </View>
          </View>

          <View style={styles.bidSection}>
            <CustomText fontFamily="Medium" fontSize={14} style={styles.label}>
              Your Bid Amount ($)
            </CustomText>
            <View style={styles.bidInputContainer}>
              <CustomText fontFamily="SemiBold" fontSize={24} style={styles.currencySign}>
                $
              </CustomText>
              <TextInput
                style={styles.bidInput}
                value={bidAmount}
                onChangeText={setBidAmount}
                placeholder={suggestedBid}
                placeholderTextColor={Colors.textLight}
                keyboardType="decimal-pad"
              />
            </View>

            <View style={styles.quickBids}>
              <TouchableOpacity
                style={styles.quickBidButton}
                onPress={() => handleQuickBid(0.8)}
              >
                <CustomText fontFamily="Medium" fontSize={12}>
                  ${(parseFloat(suggestedBid) * 0.8).toFixed(2)}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickBidButton, styles.suggestedBid]}
                onPress={() => handleQuickBid(1)}
              >
                <CustomText fontFamily="Medium" fontSize={12} style={styles.suggestedBidText}>
                  ${suggestedBid}
                </CustomText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.quickBidButton}
                onPress={() => handleQuickBid(1.2)}
              >
                <CustomText fontFamily="Medium" fontSize={12}>
                  ${(parseFloat(suggestedBid) * 1.2).toFixed(2)}
                </CustomText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timeSection}>
            <CustomText fontFamily="Medium" fontSize={14} style={styles.label}>
              Estimated Delivery Time (minutes)
            </CustomText>
            <TextInput
              style={styles.timeInput}
              value={estimatedTime}
              onChangeText={setEstimatedTime}
              placeholder="25"
              placeholderTextColor={Colors.textLight}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.earningsBreakdown}>
            <View style={styles.earningsRow}>
              <CustomText fontFamily="Regular" fontSize={13} style={styles.earningsLabel}>
                Your bid
              </CustomText>
              <CustomText fontFamily="Medium" fontSize={13}>
                ${bidAmount || '0.00'}
              </CustomText>
            </View>
            <View style={styles.earningsRow}>
              <CustomText fontFamily="Regular" fontSize={13} style={styles.earningsLabel}>
                Platform fee (20%)
              </CustomText>
              <CustomText fontFamily="Medium" fontSize={13} style={styles.feeText}>
                -${platformFee}
              </CustomText>
            </View>
            <View style={styles.earningsDivider} />
            <View style={styles.earningsRow}>
              <CustomText fontFamily="SemiBold" fontSize={14}>
                Your earnings
              </CustomText>
              <CustomText fontFamily="Bold" fontSize={16} style={styles.earningsAmount}>
                ${yourEarnings}
              </CustomText>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              (!bidAmount || isLoading) && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={!bidAmount || isLoading}
          >
            <CustomText fontFamily="SemiBold" fontSize={16} style={styles.submitButtonText}>
              {isLoading ? 'Submitting...' : 'Submit Bid'}
            </CustomText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  orderInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  orderAddress: {
    flex: 1,
    color: Colors.text,
  },
  orderStats: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  orderStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bidSection: {
    marginBottom: 16,
  },
  label: {
    color: Colors.text,
    marginBottom: 10,
  },
  bidInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  currencySign: {
    color: Colors.text,
    marginRight: 4,
  },
  bidInput: {
    flex: 1,
    fontSize: 24,
    fontFamily: 'SemiBold',
    color: Colors.text,
    paddingVertical: 16,
  },
  quickBids: {
    flexDirection: 'row',
    gap: 12,
  },
  quickBidButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  suggestedBid: {
    backgroundColor: Colors.primary,
  },
  suggestedBidText: {
    color: Colors.white,
  },
  timeSection: {
    marginBottom: 16,
  },
  timeInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.text,
  },
  earningsBreakdown: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
  },
  earningsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  earningsLabel: {
    color: Colors.textLight,
  },
  feeText: {
    color: Colors.error,
  },
  earningsDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  earningsAmount: {
    color: Colors.primary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: Colors.white,
  },
});

export default DeliveryBiddingModal;

