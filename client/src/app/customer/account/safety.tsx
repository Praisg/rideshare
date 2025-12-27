import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
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

const SafetyScreen = () => {
  const SafetyFeature = ({
    iconName,
    iconBg,
    iconColor,
    title,
    description,
    onPress,
  }: {
    iconName: keyof typeof Ionicons.glyphMap;
    iconBg: string;
    iconColor: string;
    title: string;
    description: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.featureItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.featureIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={iconName} size={RFValue(20)} color={iconColor} />
      </View>
      <View style={styles.featureContent}>
        <CustomText fontFamily="Medium" fontSize={16} style={styles.featureTitle}>
          {title}
        </CustomText>
        <CustomText fontFamily="Regular" fontSize={13} style={styles.featureDescription}>
          {description}
        </CustomText>
      </View>
      <Ionicons name="chevron-forward" size={RFValue(18)} color={TEXT_SECONDARY} />
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
            Safety
          </CustomText>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroSection}>
            <View style={styles.heroIcon}>
              <Ionicons name="shield-checkmark" size={RFValue(40)} color={ACCENT} />
            </View>
            <CustomText fontFamily="SemiBold" fontSize={22} style={styles.heroTitle}>
              Your safety matters
            </CustomText>
            <CustomText fontFamily="Regular" fontSize={15} style={styles.heroDescription}>
              We have built safety features into every ride to help keep you safe.
            </CustomText>
          </View>

          <View style={styles.section}>
            <CustomText fontFamily="SemiBold" fontSize={13} style={styles.sectionTitle}>
              SAFETY TOOLS
            </CustomText>
            
            <View style={styles.sectionContent}>
              <SafetyFeature
                iconName="warning"
                iconBg="#422006"
                iconColor="#FBBF24"
                title="Emergency Button"
                description="Quick access to emergency services"
                onPress={() => {}}
              />
              <View style={styles.divider} />
              <SafetyFeature
                iconName="people"
                iconBg="#1E3A5F"
                iconColor="#60A5FA"
                title="Trusted Contacts"
                description="Share your trip with family and friends"
                onPress={() => {}}
              />
              <View style={styles.divider} />
              <SafetyFeature
                iconName="location"
                iconBg="#052E16"
                iconColor={ACCENT}
                title="Share Trip Status"
                description="Let others follow your trip in real-time"
                onPress={() => {}}
              />
            </View>
          </View>

          <View style={styles.section}>
            <CustomText fontFamily="SemiBold" fontSize={13} style={styles.sectionTitle}>
              RIDE CHECK
            </CustomText>
            
            <View style={styles.sectionContent}>
              <SafetyFeature
                iconName="navigate"
                iconBg="#4C1D3D"
                iconColor="#F472B6"
                title="Trip Monitoring"
                description="We detect off-route or unexpected stops"
                onPress={() => {}}
              />
              <View style={styles.divider} />
              <SafetyFeature
                iconName="checkmark-circle"
                iconBg="#2E1065"
                iconColor="#A78BFA"
                title="Verify Your Ride"
                description="Match car, plate, and driver photo"
                onPress={() => {}}
              />
            </View>
          </View>

          <View style={styles.emergencyBanner}>
            <View style={styles.emergencyIcon}>
              <Ionicons name="call" size={RFValue(20)} color="#EF4444" />
            </View>
            <View style={styles.emergencyContent}>
              <CustomText fontFamily="SemiBold" fontSize={15} style={styles.emergencyTitle}>
                Emergency: 999
              </CustomText>
              <CustomText fontFamily="Regular" fontSize={13} style={styles.emergencyDescription}>
                In case of emergency, call local services
              </CustomText>
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
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#052E16",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  heroTitle: {
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  heroDescription: {
    color: TEXT_SECONDARY,
    textAlign: "center",
    lineHeight: 22,
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
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    color: TEXT_PRIMARY,
  },
  featureDescription: {
    color: TEXT_SECONDARY,
    marginTop: 2,
  },
  divider: {
    height: 0.5,
    backgroundColor: DIVIDER,
    marginLeft: 78,
  },
  emergencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "#450A0A",
    borderRadius: 12,
  },
  emergencyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#7F1D1D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyTitle: {
    color: "#FCA5A5",
  },
  emergencyDescription: {
    color: "#FCA5A5",
    opacity: 0.8,
    marginTop: 2,
  },
});

export default SafetyScreen;
