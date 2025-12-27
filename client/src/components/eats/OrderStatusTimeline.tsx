import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '../shared/CustomText';
import { Colors } from '@/utils/Constants';

interface TimelineStep {
  status: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const TIMELINE_STEPS: TimelineStep[] = [
  { status: 'pending', label: 'Order Placed', icon: 'receipt-outline' },
  { status: 'restaurant_accepted', label: 'Confirmed', icon: 'checkmark-circle-outline' },
  { status: 'preparing', label: 'Preparing', icon: 'restaurant-outline' },
  { status: 'ready_for_pickup', label: 'Ready', icon: 'bag-check-outline' },
  { status: 'picked_up', label: 'Picked Up', icon: 'bicycle-outline' },
  { status: 'in_transit', label: 'On the Way', icon: 'navigate-outline' },
  { status: 'delivered', label: 'Delivered', icon: 'home-outline' },
];

const STATUS_ORDER = [
  'pending',
  'restaurant_accepted',
  'preparing',
  'ready_for_pickup',
  'bidding_open',
  'courier_assigned',
  'picked_up',
  'in_transit',
  'delivered',
];

interface OrderStatusTimelineProps {
  currentStatus: string;
  timeline?: Array<{
    status: string;
    timestamp: string;
    message?: string;
  }>;
}

const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({
  currentStatus,
  timeline,
}) => {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  const getStepState = (step: TimelineStep) => {
    const stepIndex = STATUS_ORDER.indexOf(step.status);
    
    if (currentStatus === 'cancelled') {
      return 'cancelled';
    }
    
    if (stepIndex < currentIndex) {
      return 'completed';
    }
    if (stepIndex === currentIndex || 
        (step.status === 'picked_up' && ['bidding_open', 'courier_assigned'].includes(currentStatus))) {
      return 'current';
    }
    return 'pending';
  };

  const filteredSteps = TIMELINE_STEPS.filter((step) => {
    if (currentStatus === 'cancelled') {
      return STATUS_ORDER.indexOf(step.status) <= currentIndex;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {filteredSteps.map((step, index) => {
        const state = getStepState(step);
        const isLast = index === filteredSteps.length - 1;

        return (
          <View key={step.status} style={styles.stepContainer}>
            <View style={styles.stepLeft}>
              <View
                style={[
                  styles.iconContainer,
                  state === 'completed' && styles.completedIcon,
                  state === 'current' && styles.currentIcon,
                  state === 'pending' && styles.pendingIcon,
                  state === 'cancelled' && styles.cancelledIcon,
                ]}
              >
                <Ionicons
                  name={state === 'completed' ? 'checkmark' : step.icon}
                  size={RFValue(14)}
                  color={
                    state === 'completed'
                      ? Colors.white
                      : state === 'current'
                      ? Colors.primary
                      : state === 'cancelled'
                      ? Colors.error
                      : Colors.textLight
                  }
                />
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    (state === 'completed') && styles.completedLine,
                  ]}
                />
              )}
            </View>

            <View style={styles.stepContent}>
              <CustomText
                fontFamily={state === 'current' ? 'SemiBold' : 'Regular'}
                fontSize={14}
                style={[
                  styles.label,
                  state === 'completed' && styles.completedLabel,
                  state === 'current' && styles.currentLabel,
                  state === 'pending' && styles.pendingLabel,
                ]}
              >
                {step.label}
              </CustomText>
              
              {state === 'current' && currentStatus !== 'delivered' && (
                <View style={styles.currentIndicator}>
                  <View style={styles.pulseDot} />
                </View>
              )}
            </View>
          </View>
        );
      })}

      {currentStatus === 'cancelled' && (
        <View style={styles.cancelledContainer}>
          <Ionicons name="close-circle" size={RFValue(20)} color={Colors.error} />
          <CustomText fontFamily="SemiBold" fontSize={14} style={styles.cancelledText}>
            Order Cancelled
          </CustomText>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  stepContainer: {
    flexDirection: 'row',
  },
  stepLeft: {
    alignItems: 'center',
    width: 40,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  completedIcon: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  currentIcon: {
    backgroundColor: Colors.white,
    borderColor: Colors.primary,
  },
  pendingIcon: {
    backgroundColor: Colors.white,
    borderColor: '#E5E7EB',
  },
  cancelledIcon: {
    backgroundColor: Colors.white,
    borderColor: Colors.error,
  },
  line: {
    width: 2,
    height: 30,
    backgroundColor: '#E5E7EB',
  },
  completedLine: {
    backgroundColor: Colors.primary,
  },
  stepContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: Colors.text,
  },
  completedLabel: {
    color: Colors.primary,
  },
  currentLabel: {
    color: Colors.text,
  },
  pendingLabel: {
    color: Colors.textLight,
  },
  currentIndicator: {
    marginLeft: 8,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  cancelledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 52,
    marginTop: 8,
  },
  cancelledText: {
    color: Colors.error,
  },
});

export default OrderStatusTimeline;

