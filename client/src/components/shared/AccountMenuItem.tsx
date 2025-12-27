import {
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { FC } from "react";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "./CustomText";
import { Colors } from "@/utils/Constants";

interface AccountMenuItemProps {
  title: string;
  subtitle?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  rightText?: string;
  showChevron?: boolean;
  danger?: boolean;
  onPress: () => void;
}

const AccountMenuItem: FC<AccountMenuItemProps> = ({
  title,
  subtitle,
  iconName,
  iconColor,
  rightText,
  showChevron = true,
  danger = false,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, danger && styles.iconContainerDanger]}>
        <Ionicons
          name={iconName}
          size={RFValue(18)}
          color={iconColor || (danger ? Colors.error : Colors.text)}
        />
      </View>
      
      <View style={styles.content}>
        <CustomText
          fontFamily="Medium"
          fontSize={15}
          style={[styles.title, danger && styles.titleDanger]}
        >
          {title}
        </CustomText>
        
        {subtitle && (
          <CustomText fontFamily="Regular" fontSize={12} style={styles.subtitle}>
            {subtitle}
          </CustomText>
        )}
      </View>
      
      {rightText && (
        <CustomText fontFamily="Regular" fontSize={13} style={styles.rightText}>
          {rightText}
        </CustomText>
      )}
      
      {showChevron && (
        <Ionicons
          name="chevron-forward"
          size={RFValue(16)}
          color={Colors.textLight}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.white,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  iconContainerDanger: {
    backgroundColor: "#FEE2E2",
  },
  content: {
    flex: 1,
  },
  title: {
    color: Colors.text,
  },
  titleDanger: {
    color: Colors.error,
  },
  subtitle: {
    color: Colors.textLight,
    marginTop: 2,
  },
  rightText: {
    color: Colors.textLight,
    marginRight: 8,
  },
});

export default AccountMenuItem;

