import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '../shared/CustomText';
import { Colors, screenWidth } from '@/utils/Constants';

interface RestaurantCardProps {
  restaurant: {
    _id: string;
    name: string;
    description?: string;
    cuisine: string[];
    rating: number;
    reviewCount: number;
    deliveryFee: number;
    imageUrl?: string;
    isOpen: boolean;
    featured?: boolean;
    preparationTime?: number;
  };
  onPress: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        {restaurant.imageUrl ? (
          <Image source={{ uri: restaurant.imageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="restaurant" size={40} color={Colors.textLight} />
          </View>
        )}
        {restaurant.featured && (
          <View style={styles.featuredBadge}>
            <CustomText fontFamily="SemiBold" fontSize={10} style={styles.featuredText}>
              Featured
            </CustomText>
          </View>
        )}
        {!restaurant.isOpen && (
          <View style={styles.closedOverlay}>
            <CustomText fontFamily="SemiBold" fontSize={12} style={styles.closedText}>
              Closed
            </CustomText>
          </View>
        )}
        {restaurant.deliveryFee === 0 && (
          <View style={styles.freeDeliveryBadge}>
            <CustomText fontFamily="SemiBold" fontSize={9} style={styles.freeDeliveryText}>
              Free Delivery
            </CustomText>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <CustomText fontFamily="SemiBold" fontSize={14} numberOfLines={1} style={styles.name}>
          {restaurant.name}
        </CustomText>
        
        <View style={styles.infoRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={RFValue(12)} color="#FFC107" />
            <CustomText fontFamily="Medium" fontSize={12} style={styles.rating}>
              {restaurant.rating.toFixed(1)}
            </CustomText>
            <CustomText fontFamily="Regular" fontSize={11} style={styles.reviewCount}>
              ({restaurant.reviewCount})
            </CustomText>
          </View>
          
          <View style={styles.dot} />
          
          <CustomText fontFamily="Regular" fontSize={11} style={styles.cuisine} numberOfLines={1}>
            {restaurant.cuisine.slice(0, 2).join(', ')}
          </CustomText>
        </View>
        
        <View style={styles.deliveryRow}>
          <Ionicons name="time-outline" size={RFValue(12)} color={Colors.textLight} />
          <CustomText fontFamily="Regular" fontSize={11} style={styles.deliveryText}>
            {restaurant.preparationTime || 25}-{(restaurant.preparationTime || 25) + 15} min
          </CustomText>
          
          <View style={styles.dot} />
          
          <CustomText fontFamily="Regular" fontSize={11} style={styles.deliveryText}>
            ${restaurant.deliveryFee.toFixed(2)} delivery
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: (screenWidth - 48) / 2,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: Colors.white,
  },
  freeDeliveryBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeDeliveryText: {
    color: Colors.white,
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: Colors.white,
  },
  content: {
    padding: 12,
  },
  name: {
    color: Colors.text,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rating: {
    color: Colors.text,
    marginLeft: 2,
  },
  reviewCount: {
    color: Colors.textLight,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textLight,
    marginHorizontal: 6,
  },
  cuisine: {
    color: Colors.textLight,
    flex: 1,
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    color: Colors.textLight,
    marginLeft: 4,
  },
});

export default RestaurantCard;

