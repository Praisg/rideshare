import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '../shared/CustomText';
import { Colors } from '@/utils/Constants';

interface MenuItemCardProps {
  item: {
    _id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    isAvailable: boolean;
    isVegetarian?: boolean;
  };
  onPress: () => void;
  onAddToCart?: () => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onPress, onAddToCart }) => {
  return (
    <TouchableOpacity
      style={[styles.container, !item.isAvailable && styles.unavailable]}
      onPress={onPress}
      disabled={!item.isAvailable}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <View style={styles.textContent}>
          <View style={styles.nameRow}>
            <CustomText fontFamily="SemiBold" fontSize={14} numberOfLines={1} style={styles.name}>
              {item.name}
            </CustomText>
            {item.isVegetarian && (
              <View style={styles.vegBadge}>
                <Ionicons name="leaf" size={RFValue(10)} color="#059669" />
              </View>
            )}
          </View>
          
          {item.description && (
            <CustomText fontFamily="Regular" fontSize={12} numberOfLines={2} style={styles.description}>
              {item.description}
            </CustomText>
          )}
          
          <CustomText fontFamily="SemiBold" fontSize={14} style={styles.price}>
            ${item.price.toFixed(2)}
          </CustomText>
        </View>
        
        <View style={styles.imageSection}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Ionicons name="fast-food" size={24} color={Colors.textLight} />
            </View>
          )}
          
          {item.isAvailable && onAddToCart && (
            <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
              <Ionicons name="add" size={RFValue(18)} color={Colors.white} />
            </TouchableOpacity>
          )}
          
          {!item.isAvailable && (
            <View style={styles.unavailableOverlay}>
              <CustomText fontFamily="Medium" fontSize={10} style={styles.unavailableText}>
                Unavailable
              </CustomText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  unavailable: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  textContent: {
    flex: 1,
    paddingRight: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  name: {
    color: Colors.text,
  },
  vegBadge: {
    backgroundColor: '#D1FAE5',
    padding: 2,
    borderRadius: 4,
  },
  description: {
    color: Colors.textLight,
    marginBottom: 8,
    lineHeight: 18,
  },
  price: {
    color: Colors.text,
  },
  imageSection: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  placeholderImage: {
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  unavailableOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: Colors.textLight,
  },
});

export default MenuItemCard;

