import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomText from '../shared/CustomText';
import { Colors } from '@/utils/Constants';

interface CartItemRowProps {
  item: {
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
    specialInstructions?: string;
  };
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const subtotal = item.price * item.quantity;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.info}>
          <CustomText fontFamily="SemiBold" fontSize={14} style={styles.name}>
            {item.name}
          </CustomText>
          <CustomText fontFamily="Regular" fontSize={13} style={styles.price}>
            ${item.price.toFixed(2)} each
          </CustomText>
        </View>
        
        <TouchableOpacity onPress={onRemove} style={styles.removeButton}>
          <Ionicons name="trash-outline" size={RFValue(16)} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {item.specialInstructions && (
        <CustomText fontFamily="Regular" fontSize={12} style={styles.instructions}>
          Note: {item.specialInstructions}
        </CustomText>
      )}

      <View style={styles.footer}>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
            onPress={onDecrease}
          >
            <Ionicons
              name="remove"
              size={RFValue(16)}
              color={item.quantity <= 1 ? Colors.textLight : Colors.text}
            />
          </TouchableOpacity>
          
          <CustomText fontFamily="SemiBold" fontSize={14} style={styles.quantity}>
            {item.quantity}
          </CustomText>
          
          <TouchableOpacity style={styles.quantityButton} onPress={onIncrease}>
            <Ionicons name="add" size={RFValue(16)} color={Colors.text} />
          </TouchableOpacity>
        </View>

        <CustomText fontFamily="SemiBold" fontSize={14} style={styles.subtotal}>
          ${subtotal.toFixed(2)}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  info: {
    flex: 1,
  },
  name: {
    color: Colors.text,
    marginBottom: 2,
  },
  price: {
    color: Colors.textLight,
  },
  removeButton: {
    padding: 4,
  },
  instructions: {
    color: Colors.textLight,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantity: {
    color: Colors.text,
    minWidth: 30,
    textAlign: 'center',
  },
  subtotal: {
    color: Colors.text,
  },
});

export default CartItemRow;

