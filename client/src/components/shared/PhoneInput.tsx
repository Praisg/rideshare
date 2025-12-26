import { View, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList, ScrollView } from "react-native";
import React, { FC, useState, useEffect } from "react";
import { RFValue } from "react-native-responsive-fontsize";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Localization from 'expo-localization';
import CustomText from "./CustomText";
import { Colors } from "@/utils/Constants";

interface Country {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
  maxLength: number;
}

const COUNTRIES: Country[] = [
  { name: "United States", code: "US", flag: "🇺🇸", dialCode: "+1", maxLength: 10 },
  { name: "United Kingdom", code: "GB", flag: "🇬🇧", dialCode: "+44", maxLength: 10 },
  { name: "Canada", code: "CA", flag: "🇨🇦", dialCode: "+1", maxLength: 10 },
  { name: "Australia", code: "AU", flag: "🇦🇺", dialCode: "+61", maxLength: 9 },
  { name: "Zimbabwe", code: "ZW", flag: "🇿🇼", dialCode: "+263", maxLength: 9 },
  { name: "South Africa", code: "ZA", flag: "🇿🇦", dialCode: "+27", maxLength: 9 },
  { name: "Kenya", code: "KE", flag: "🇰🇪", dialCode: "+254", maxLength: 10 },
  { name: "Nigeria", code: "NG", flag: "🇳🇬", dialCode: "+234", maxLength: 10 },
  { name: "Ghana", code: "GH", flag: "🇬🇭", dialCode: "+233", maxLength: 9 },
  { name: "India", code: "IN", flag: "🇮🇳", dialCode: "+91", maxLength: 10 },
  { name: "China", code: "CN", flag: "🇨🇳", dialCode: "+86", maxLength: 11 },
  { name: "Japan", code: "JP", flag: "🇯🇵", dialCode: "+81", maxLength: 10 },
  { name: "Germany", code: "DE", flag: "🇩🇪", dialCode: "+49", maxLength: 11 },
  { name: "France", code: "FR", flag: "🇫🇷", dialCode: "+33", maxLength: 9 },
  { name: "Brazil", code: "BR", flag: "🇧🇷", dialCode: "+55", maxLength: 11 },
  { name: "Mexico", code: "MX", flag: "🇲🇽", dialCode: "+52", maxLength: 10 },
  { name: "Spain", code: "ES", flag: "🇪🇸", dialCode: "+34", maxLength: 9 },
  { name: "Italy", code: "IT", flag: "🇮🇹", dialCode: "+39", maxLength: 10 },
];

const getDefaultCountry = (): Country => {
  try {
    const locales = Localization.getLocales();
    const deviceRegion = locales[0]?.regionCode;
    const foundCountry = COUNTRIES.find(
      (country) => country.code === deviceRegion
    );
    return foundCountry || COUNTRIES[0];
  } catch (error) {
    return COUNTRIES[0];
  }
};

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const PhoneInput: FC<PhoneInputProps> = ({
  value,
  onChangeText,
  onBlur,
  onFocus,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(getDefaultCountry());
  const [showCountryModal, setShowCountryModal] = useState(false);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountryModal(false);
    onChangeText("");
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.countrySelector}
          onPress={() => setShowCountryModal(true)}
        >
          <CustomText fontFamily="Regular" style={styles.flag}>
            {selectedCountry.flag}
          </CustomText>
          <MaterialIcons name="keyboard-arrow-down" size={20} color={Colors.text} />
        </TouchableOpacity>
        
        <View style={styles.inputContainer}>
          <CustomText fontFamily="Regular" style={styles.countryCode}>
            {selectedCountry.dialCode}
          </CustomText>
          <TextInput
            placeholder="000-000-0000"
            keyboardType="phone-pad"
            value={value}
            maxLength={selectedCountry.maxLength}
            onChangeText={onChangeText}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholderTextColor={Colors.textLight}
            style={styles.input}
          />
        </View>
      </View>

      <Modal
        visible={showCountryModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowCountryModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowCountryModal(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={Colors.text} />
            </TouchableOpacity>
            <CustomText fontFamily="Bold" variant="h5" style={styles.modalTitle}>
              Select Country
            </CustomText>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.countryList}>
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={styles.countryItem}
                onPress={() => handleCountrySelect(country)}
              >
                <View style={styles.countryInfo}>
                  <CustomText fontFamily="Regular" style={styles.countryFlag}>
                    {country.flag}
                  </CustomText>
                  <CustomText fontFamily="Regular" variant="h6" style={styles.countryName}>
                    {country.name}
                  </CustomText>
                </View>
                <CustomText fontFamily="Regular" variant="h6" style={styles.countryDialCode}>
                  {country.dialCode}
                </CustomText>
                {selectedCountry.code === country.code && (
                  <MaterialIcons name="check" size={24} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
    marginBottom: 16,
  },
  countrySelector: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
    gap: 4,
  },
  flag: {
    fontSize: 24,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countryCode: {
    fontSize: RFValue(14),
    color: Colors.text,
  },
  input: {
    flex: 1,
    fontSize: RFValue(14),
    fontFamily: "Regular",
    height: 50,
    color: Colors.text,
  },
  contactIcon: {
    paddingLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginTop: 40,
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  countryList: {
    flex: 1,
  },
  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  countryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryName: {
    fontSize: 16,
    color: Colors.text,
  },
  countryDialCode: {
    fontSize: 16,
    color: Colors.textLight,
    marginRight: 12,
  },
});

export default PhoneInput;
