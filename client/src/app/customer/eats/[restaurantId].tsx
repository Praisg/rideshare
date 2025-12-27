import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '@/components/shared/CustomText';
import MenuItemCard from '@/components/eats/MenuItemCard';
import { Colors, screenHeight, screenWidth } from '@/utils/Constants';
import { getRestaurantById, getRestaurantMenu } from '@/service/eatsService';
import { useEatsStore } from '@/store/eatsStore';
import { useCartStore } from '@/store/cartStore';

const RestaurantDetailScreen = () => {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const { selectedRestaurant, menuItems, categories, setSelectedRestaurant, setMenuItems, setCategories } = useEatsStore();
  const { addItem, getItemCount, restaurant: cartRestaurant } = useCartStore();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const cartCount = getItemCount();

  const fetchRestaurant = useCallback(async () => {
    if (!restaurantId) return;
    
    setIsLoading(true);
    const result = await getRestaurantById(restaurantId);
    if (result.success) {
      setSelectedRestaurant(result.restaurant);
    }
    setIsLoading(false);
  }, [restaurantId]);

  const fetchMenu = useCallback(async () => {
    if (!restaurantId) return;
    
    const result = await getRestaurantMenu(restaurantId);
    if (result.success) {
      setMenuItems(result.menuItems);
      setCategories(result.categories);
      if (result.categories.length > 0) {
        setSelectedCategory(result.categories[0]);
      }
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchRestaurant();
    fetchMenu();
  }, [restaurantId]);

  const handleAddToCart = (item: any) => {
    if (!selectedRestaurant) return;

    addItem(
      {
        menuItemId: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
        imageUrl: item.imageUrl,
      },
      {
        id: selectedRestaurant._id,
        name: selectedRestaurant.name,
        imageUrl: selectedRestaurant.imageUrl,
        deliveryFee: selectedRestaurant.deliveryFee,
        minimumOrder: selectedRestaurant.minimumOrder,
      }
    );
  };

  const filteredMenuItems = selectedCategory
    ? menuItems.filter((item) => item.category === selectedCategory)
    : menuItems;

  if (isLoading || !selectedRestaurant) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.loadingContainer}>
          <CustomText fontFamily="Medium" fontSize={16}>Loading...</CustomText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}>
        <View style={styles.heroContainer}>
          {selectedRestaurant.coverImage || selectedRestaurant.imageUrl ? (
            <Image
              source={{ uri: selectedRestaurant.coverImage || selectedRestaurant.imageUrl }}
              style={styles.heroImage}
            />
          ) : (
            <View style={[styles.heroImage, styles.heroPlaceholder]}>
              <Ionicons name="restaurant" size={60} color={Colors.white} />
            </View>
          )}
          <View style={styles.heroOverlay} />
          
          <SafeAreaView style={styles.heroHeader}>
            <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={RFValue(20)} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="heart-outline" size={RFValue(20)} color={Colors.white} />
            </TouchableOpacity>
          </SafeAreaView>

          <View style={styles.heroContent}>
            <CustomText fontFamily="Bold" fontSize={24} style={styles.heroTitle}>
              {selectedRestaurant.name}
            </CustomText>
            <View style={styles.heroInfo}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={RFValue(14)} color="#FFC107" />
                <CustomText fontFamily="SemiBold" fontSize={14} style={styles.heroInfoText}>
                  {selectedRestaurant.rating.toFixed(1)}
                </CustomText>
                <CustomText fontFamily="Regular" fontSize={12} style={styles.heroInfoTextLight}>
                  ({selectedRestaurant.reviewCount} reviews)
                </CustomText>
              </View>
              <View style={styles.dot} />
              <CustomText fontFamily="Regular" fontSize={12} style={styles.heroInfoTextLight}>
                {selectedRestaurant.cuisine.join(', ')}
              </CustomText>
            </View>
          </View>
        </View>

        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipSelected,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <CustomText
                  fontFamily={selectedCategory === category ? 'SemiBold' : 'Regular'}
                  fontSize={13}
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextSelected,
                  ]}
                >
                  {category}
                </CustomText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={RFValue(18)} color={Colors.primary} />
              <CustomText fontFamily="Medium" fontSize={14} style={styles.infoValue}>
                {selectedRestaurant.preparationTime || 25}-{(selectedRestaurant.preparationTime || 25) + 15} min
              </CustomText>
              <CustomText fontFamily="Regular" fontSize={11} style={styles.infoLabel}>
                Delivery
              </CustomText>
            </View>
            
            <View style={styles.infoDivider} />
            
            <View style={styles.infoItem}>
              <Ionicons name="bicycle-outline" size={RFValue(18)} color={Colors.primary} />
              <CustomText fontFamily="Medium" fontSize={14} style={styles.infoValue}>
                ${selectedRestaurant.deliveryFee.toFixed(2)}
              </CustomText>
              <CustomText fontFamily="Regular" fontSize={11} style={styles.infoLabel}>
                Delivery Fee
              </CustomText>
            </View>
            
            <View style={styles.infoDivider} />
            
            <View style={styles.infoItem}>
              <Ionicons name="wallet-outline" size={RFValue(18)} color={Colors.primary} />
              <CustomText fontFamily="Medium" fontSize={14} style={styles.infoValue}>
                ${selectedRestaurant.minimumOrder}
              </CustomText>
              <CustomText fontFamily="Regular" fontSize={11} style={styles.infoLabel}>
                Minimum
              </CustomText>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <CustomText fontFamily="SemiBold" fontSize={18} style={styles.menuTitle}>
            {selectedCategory || 'Menu'}
          </CustomText>
          
          {filteredMenuItems.map((item) => (
            <MenuItemCard
              key={item._id}
              item={item}
              onPress={() => {}}
              onAddToCart={() => handleAddToCart(item)}
            />
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {cartCount > 0 && (
        <View style={styles.cartButtonContainer}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => router.push('/customer/eats/cart')}
          >
            <View style={styles.cartBadge}>
              <CustomText fontFamily="SemiBold" fontSize={12} style={styles.cartBadgeText}>
                {cartCount}
              </CustomText>
            </View>
            <CustomText fontFamily="SemiBold" fontSize={16} style={styles.cartButtonText}>
              View Cart
            </CustomText>
            <Ionicons name="arrow-forward" size={RFValue(18)} color={Colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </View>
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
  heroContainer: {
    height: screenHeight * 0.3,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroPlaceholder: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTitle: {
    color: Colors.white,
    marginBottom: 8,
  },
  heroInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroInfoText: {
    color: Colors.white,
  },
  heroInfoTextLight: {
    color: 'rgba(255,255,255,0.8)',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginHorizontal: 8,
  },
  categoryContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryScroll: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: Colors.text,
  },
  categoryText: {
    color: Colors.textLight,
  },
  categoryTextSelected: {
    color: Colors.white,
  },
  infoCard: {
    margin: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  infoItem: {
    alignItems: 'center',
  },
  infoValue: {
    color: Colors.text,
    marginTop: 8,
    marginBottom: 2,
  },
  infoLabel: {
    color: Colors.textLight,
  },
  infoDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  menuSection: {
    paddingTop: 8,
  },
  menuTitle: {
    paddingHorizontal: 20,
    marginBottom: 12,
    color: Colors.text,
  },
  cartButtonContainer: {
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
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
  },
  cartBadge: {
    backgroundColor: Colors.white,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: Colors.primary,
  },
  cartButtonText: {
    color: Colors.white,
  },
});

export default RestaurantDetailScreen;

