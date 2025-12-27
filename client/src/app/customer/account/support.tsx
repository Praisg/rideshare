import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/shared/CustomText";

const DARK_BG = "#000000";
const CARD_BG = "#1C1C1E";
const TEXT_PRIMARY = "#FFFFFF";
const TEXT_SECONDARY = "#8E8E93";
const DIVIDER = "#2C2C2E";
const ACCENT = "#10B981";

const SupportScreen = () => {
  const handleEmailSupport = () => {
    Linking.openURL("mailto:support@rideapp.com");
  };

  const handleCallSupport = () => {
    Linking.openURL("tel:+263771234567");
  };

  const MenuItem = ({
    iconName,
    title,
    onPress,
  }: {
    iconName: keyof typeof Ionicons.glyphMap;
    title: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={iconName} size={RFValue(20)} color={TEXT_PRIMARY} />
      <CustomText fontFamily="Medium" fontSize={16} style={styles.menuTitle}>
        {title}
      </CustomText>
      <Ionicons name="chevron-forward" size={RFValue(18)} color={TEXT_SECONDARY} />
    </TouchableOpacity>
  );

  const ContactItem = ({
    iconName,
    iconBg,
    iconColor,
    title,
    subtitle,
    onPress,
  }: {
    iconName: keyof typeof Ionicons.glyphMap;
    iconBg: string;
    iconColor: string;
    title: string;
    subtitle: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.contactItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.contactIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={RFValue(20)} color={iconColor} />
      </View>
      <View style={styles.contactContent}>
        <CustomText fontFamily="Medium" fontSize={16} style={styles.contactTitle}>
          {title}
        </CustomText>
        <CustomText fontFamily="Regular" fontSize={13} style={styles.contactSubtitle}>
          {subtitle}
        </CustomText>
      </View>
      <Ionicons name="open-outline" size={RFValue(18)} color={TEXT_SECONDARY} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor={DARK_BG} translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={RFValue(22)} color={TEXT_PRIMARY} />
          </TouchableOpacity>
          <CustomText fontFamily="SemiBold" fontSize={18} style={styles.headerTitle}>
            Help
          </CustomText>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity style={styles.searchBar} activeOpacity={0.7}>
            <Ionicons name="search" size={RFValue(18)} color={TEXT_SECONDARY} />
            <CustomText fontFamily="Regular" fontSize={15} style={styles.searchText}>
              Search for help
            </CustomText>
          </TouchableOpacity>

          <View style={styles.section}>
            <CustomText fontFamily="SemiBold" fontSize={13} style={styles.sectionTitle}>
              COMMON TOPICS
            </CustomText>
            
            <View style={styles.sectionContent}>
              <MenuItem iconName="car" title="Trip Issues" onPress={() => {}} />
              <View style={styles.divider} />
              <MenuItem iconName="card" title="Payment & Pricing" onPress={() => {}} />
              <View style={styles.divider} />
              <MenuItem iconName="person" title="Account & Profile" onPress={() => {}} />
              <View style={styles.divider} />
              <MenuItem iconName="shield" title="Safety Concerns" onPress={() => {}} />
              <View style={styles.divider} />
              <MenuItem iconName="bag" title="Lost Items" onPress={() => {}} />
            </View>
          </View>

          <View style={styles.section}>
            <CustomText fontFamily="SemiBold" fontSize={13} style={styles.sectionTitle}>
              CONTACT US
            </CustomText>
            
            <View style={styles.sectionContent}>
              <ContactItem
                iconName="mail"
                iconBg="#1E3A5F"
                iconColor="#60A5FA"
                title="Email Support"
                subtitle="support@rideapp.com"
                onPress={handleEmailSupport}
              />
              <View style={styles.divider} />
              <ContactItem
                iconName="call"
                iconBg="#052E16"
                iconColor={ACCENT}
                title="Phone Support"
                subtitle="+263 77 123 4567"
                onPress={handleCallSupport}
              />
              <View style={styles.divider} />
              <ContactItem
                iconName="chatbubbles"
                iconBg="#4C1D3D"
                iconColor="#F472B6"
                title="Live Chat"
                subtitle="Available 8AM - 10PM"
                onPress={() => {}}
              />
            </View>
          </View>

          <View style={styles.section}>
            <CustomText fontFamily="SemiBold" fontSize={13} style={styles.sectionTitle}>
              LEGAL
            </CustomText>
            
            <View style={styles.sectionContent}>
              <MenuItem iconName="document-text" title="Terms of Service" onPress={() => {}} />
              <View style={styles.divider} />
              <MenuItem iconName="lock-closed" title="Privacy Policy" onPress={() => {}} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK_BG,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: DIVIDER,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    color: TEXT_PRIMARY,
  },
  headerSpacer: {
    width: 30,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: CARD_BG,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 12,
  },
  searchText: {
    color: TEXT_SECONDARY,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: TEXT_SECONDARY,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  sectionContent: {
    backgroundColor: CARD_BG,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 14,
  },
  menuTitle: {
    flex: 1,
    color: TEXT_PRIMARY,
  },
  divider: {
    height: 0.5,
    backgroundColor: DIVIDER,
    marginLeft: 54,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  contactIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    color: TEXT_PRIMARY,
  },
  contactSubtitle: {
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
});

export default SupportScreen;
