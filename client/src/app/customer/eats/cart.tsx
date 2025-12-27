import React, { useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@/components/shared/CustomText';
import CartItemRow from '@/components/eats/CartItemRow';
import MapPickerModal from '@/components/customer/MapPickerModal';
import { Colors } from '@/utils/Constants';
import { useCartStore } from '@/store/cartStore';
import { useUserStore } from '@/store/userStore';
import { createFoodOrder } from '@/service/foodOrderService';

const CartScreen = () => {
  const {
    items,
    restaurant,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getDeliveryFee,
    getPlatformFee,
    getTotal,
    isMinimumOrderMet,
  } = useCartStore();

  const { location, setLocation } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isMapModalVisible, setMapModalVisible] = useState(false);

  const handlePlaceOrder = async () => {
    if (!restaurant) {
      Alert.alert('Error', 'No restaurant selected');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'Please set your delivery address');
      return;
    }

    if (!isMinimumOrderMet()) {
      Alert.alert(
        'Minimum Order',
        `The minimum order for ${restaurant.name} is $${restaurant.minimumOrder.toFixed(2)}`
      );
      return;
    }

    setIsLoading(true);

    const orderData = {
      restaurantId: restaurant.id,
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        customizations: item.customizations,
        specialInstructions: item.specialInstructions,
      })),
      deliveryAddress: {
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      paymentMethod: 'cash',
      channel: 'app',
    };

    const result = await createFoodOrder(orderData);
    setIsLoading(false);

    if (result.success) {
      clearCart();
      router.replace(`/customer/eats/bidding?orderId=${result.order._id}`);
    } else {
      Alert.alert('Error', result.error || 'Failed to place order');
    }
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" backgroundColor={Colors.white} />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={RFValue(20)} color={Colors.text} />
          </TouchableOpacity>
          <CustomText fontFamily="SemiBold" fontSize={18}>Cart</CustomText>
          <View style={styles.backButton} />
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={Colors.textLight} />
          <CustomText fontFamily="SemiBold" fontSize={18} style={styles.emptyTitle}>
            Your cart is empty
          </CustomText>
          <CustomText fontFamily="Regular" fontSize={14} style={styles.emptySubtitle}>
            Add items from a restaurant to get started
          </CustomText>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/customer/eats/restaurants')}
          >
            <CustomText fontFamily="SemiBold" fontSize={14} style={styles.browseButtonText}>
              Browse Restaurants
            </CustomText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.white} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={RFValue(20)} color={Colors.text} />
        </TouchableOpacity>
        <CustomText fontFamily="SemiBold" fontSize={18}>Cart</CustomText>
        <TouchableOpacity onPress={clearCart} style={styles.backButton}>
          <Ionicons name="trash-outline" size={RFValue(18)} color={Colors.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {restaurant && (
          <View style={styles.restaurantInfo}>
            <Ionicons name="restaurant" size={RFValue(20)} color={Colors.primary} />
            <CustomText fontFamily="SemiBold" fontSize={16} style={styles.restaurantName}>
              {restaurant.name}
            </CustomText>
          </View>
        )}

        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <CartItemRow
              key={item.menuItemId}
              item={item}
              onIncrease={() => updateQuantity(item.menuItemId, item.quantity + 1)}
              onDecrease={() => updateQuantity(item.menuItemId, item.quantity - 1)}
              onRemove={() => removeItem(item.menuItemId)}
            />
          ))}
        </View>

        <View style={styles.deliverySection}>
          <CustomText fontFamily="SemiBold" fontSize={16} style={styles.sectionTitle}>
            Delivery Address
          </CustomText>
          <TouchableOpacity 
            style={styles.addressCard}
            onPress={() => setMapModalVisible(true)}
          >
            <Ionicons name="location" size={RFValue(20)} color={Colors.primary} />
            <View style={styles.addressInfo}>
              <CustomText fontFamily="Medium" fontSize={14} numberOfLines={2}>
                {location?.address || 'Set delivery address'}
              </CustomText>
            </View>
            <Ionicons name="chevron-forward" size={RFValue(16)} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        <View style={styles.summarySection}>
          <CustomText fontFamily="SemiBold" fontSize={16} style={styles.sectionTitle}>
            Order Summary
          </CustomText>
          
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <CustomText fontFamily="Regular" fontSize={14} style={styles.summaryLabel}>
                Subtotal
              </CustomText>
              <CustomText fontFamily="Medium" fontSize={14}>
                ${getSubtotal().toFixed(2)}
              </CustomText>
            </View>
            
            <View style={styles.summaryRow}>
              <CustomText fontFamily="Regular" fontSize={14} style={styles.summaryLabel}>
                Delivery Fee
              </CustomText>
              <CustomText fontFamily="Medium" fontSize={14}>
                ${getDeliveryFee().toFixed(2)}
              </CustomText>
            </View>
            
            <View style={styles.summaryRow}>
              <CustomText fontFamily="Regular" fontSize={14} style={styles.summaryLabel}>
                Platform Fee (10%)
              </CustomText>
              <CustomText fontFamily="Medium" fontSize={14}>
                ${getPlatformFee().toFixed(2)}
              </CustomText>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.summaryRow}>
              <CustomText fontFamily="SemiBold" fontSize={16}>
                Total
              </CustomText>
              <CustomText fontFamily="Bold" fontSize={18} style={styles.totalAmount}>
                ${getTotal().toFixed(2)}
              </CustomText>
            </View>
          </View>

          {!isMinimumOrderMet() && restaurant && (
            <View style={styles.minimumWarning}>
              <Ionicons name="alert-circle" size={RFValue(16)} color={Colors.warning} />
              <CustomText fontFamily="Regular" fontSize={12} style={styles.warningText}>
                Add ${(restaurant.minimumOrder - getSubtotal()).toFixed(2)} more to meet the minimum order
              </CustomText>
            </View>
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <MapPickerModal
        visible={isMapModalVisible}
        title="Delivery Address"
        selectedLocation={location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          address: location.address,
        } : undefined}
        onClose={() => setMapModalVisible(false)}
        onSelectLocation={(data) => {
          if (data) {
            setLocation({
              latitude: data.latitude,
              longitude: data.longitude,
              address: data.address,
            });
          }
          setMapModalVisible(false);
        }}
      />

      <View style={styles.checkoutContainer}>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            (!isMinimumOrderMet() || isLoading) && styles.checkoutButtonDisabled,
          ]}
          onPress={handlePlaceOrder}
          disabled={!isMinimumOrderMet() || isLoading}
        >
          <CustomText fontFamily="SemiBold" fontSize={16} style={styles.checkoutButtonText}>
            {isLoading ? 'Placing Order...' : `Place Order - $${getTotal().toFixed(2)}`}
          </CustomText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: Colors.text,
    marginTop: 20,
  },
  emptySubtitle: {
    color: Colors.textLight,
    marginTop: 8,
    textAlign: 'center',
  },
  browseButton: {
    marginTop: 24,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
  },
  browseButtonText: {
    color: Colors.white,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 8,
    gap: 12,
  },
  restaurantName: {
    color: Colors.text,
  },
  itemsContainer: {
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 8,
  },
  deliverySection: {
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    color: Colors.text,
    marginBottom: 12,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 14,
    borderRadius: 10,
    gap: 12,
  },
  addressInfo: {
    flex: 1,
  },
  summarySection: {
    backgroundColor: Colors.white,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    color: Colors.textLight,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalAmount: {
    color: Colors.primary,
  },
  minimumWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  warningText: {
    color: '#92400E',
    flex: 1,
  },
  checkoutContainer: {
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
  checkoutButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonDisabled: {
    opacity: 0.5,
  },
  checkoutButtonText: {
    color: Colors.white,
  },
});

export default CartScreen;

