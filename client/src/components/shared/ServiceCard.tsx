import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from "react-native";
import React, { FC } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./CustomText";
import { Colors, screenWidth } from "@/utils/Constants";

interface ServiceCardProps {
  name: string;
  icon?: ImageSourcePropType;
  iconName?: keyof typeof Ionicons.glyphMap;
  description?: string;
  promo?: boolean;
  promoText?: string;
  disabled?: boolean;
  onPress: () => void;
}

const ServiceCard: FC<ServiceCardProps> = ({
  name,
  icon,
  iconName,
  description,
  promo = false,
  promoText = "Promo",
  disabled = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, disabled && styles.cardDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {promo && (
        <View style={styles.promoBadge}>
          <CustomText fontFamily="SemiBold" fontSize={9} style={styles.promoText}>
            {promoText}
          </CustomText>
        </View>
      )}
      
      <View style={[styles.iconContainer, disabled && styles.iconContainerDisabled]}>
        {icon ? (
          <Image source={icon} style={styles.icon} />
        ) : iconName ? (
          <Ionicons
            name={iconName}
            size={RFValue(28)}
            color={disabled ? Colors.textLight : Colors.primary}
          />
        ) : null}
      </View>
      
      <CustomText
        fontFamily="Medium"
        fontSize={12}
        style={[styles.name, disabled && styles.nameDisabled]}
        numberOfLines={1}
      >
        {name}
      </CustomText>
      
      {description && (
        <CustomText
          fontFamily="Regular"
          fontSize={10}
          style={styles.description}
          numberOfLines={1}
        >
          {description}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

const cardWidth = (screenWidth - 60) / 3;

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    alignItems: "center",
    marginBottom: 20,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  promoBadge: {
    position: "absolute",
    top: -6,
    right: 0,
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 1,
  },
  promoText: {
    color: Colors.white,
  },
  iconContainer: {
    width: cardWidth - 16,
    aspectRatio: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  iconContainerDisabled: {
    backgroundColor: "#E5E7EB",
  },
  icon: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
  },
  name: {
    color: Colors.text,
    textAlign: "center",
  },
  nameDisabled: {
    color: Colors.textLight,
  },
  description: {
    color: Colors.textLight,
    textAlign: "center",
    marginTop: 2,
  },
});

export default ServiceCard;

