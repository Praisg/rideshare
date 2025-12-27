import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/shared/CustomText";
import { useUserStore } from "@/store/userStore";
import { useThemeStore } from "@/store/themeStore";

const SettingsScreen = () => {
  const { preferences } = useUserStore();
  const { colors, mode, toggleMode } = useThemeStore();
  
  const [pushNotifications, setPushNotifications] = useState(
    preferences?.notifications?.push ?? true
  );
  const [emailNotifications, setEmailNotifications] = useState(
    preferences?.notifications?.email ?? true
  );
  const [smsNotifications, setSmsNotifications] = useState(
    preferences?.notifications?.sms ?? true
  );
  const [promoNotifications, setPromoNotifications] = useState(
    preferences?.notifications?.promo ?? false
  );

  const SettingToggle = ({
    title,
    subtitle,
    value,
    onValueChange,
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <CustomText fontFamily="Medium" fontSize={16} style={dynamicStyles.settingTitle}>
          {title}
        </CustomText>
        {subtitle && (
          <CustomText fontFamily="Regular" fontSize={13} style={dynamicStyles.settingSubtitle}>
            {subtitle}
          </CustomText>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: mode === "dark" ? "#39393D" : "#E5E7EB", true: colors.accent }}
        thumbColor={colors.text}
        ios_backgroundColor={mode === "dark" ? "#39393D" : "#E5E7EB"}
      />
    </View>
  );

  const MenuItem = ({
    title,
    subtitle,
    onPress,
  }: {
    title: string;
    subtitle?: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuContent}>
        <CustomText fontFamily="Medium" fontSize={16} style={styles.menuTitle}>
          {title}
        </CustomText>
        {subtitle && (
          <CustomText fontFamily="Regular" fontSize={13} style={styles.menuSubtitle}>
            {subtitle}
          </CustomText>
        )}
      </View>
      <Ionicons name="chevron-forward" size={RFValue(18)} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.divider,
    },
    sectionContent: {
      backgroundColor: colors.card,
    },
    settingTitle: {
      color: colors.text,
    },
    settingSubtitle: {
      color: colors.textSecondary,
      marginTop: 2,
    },
    menuTitle: {
      color: colors.text,
    },
    menuSubtitle: {
      color: colors.textSecondary,
      marginTop: 2,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <StatusBar style={colors.background === "#000000" ? "light" : "dark"} backgroundColor={colors.background} translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={dynamicStyles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={RFValue(22)} color={colors.text} />
          </TouchableOpacity>
          <CustomText fontFamily="SemiBold" fontSize={18} style={[styles.headerTitle, { color: colors.text }]}>
            Settings
          </CustomText>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <CustomText fontFamily="SemiBold" fontSize={13} style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              APPEARANCE
            </CustomText>
            
            <View style={dynamicStyles.sectionContent}>
              <SettingToggle
                title="Dark Mode"
                subtitle={mode === "dark" ? "Dark theme enabled" : "Light theme enabled"}
                value={mode === "dark"}
                onValueChange={(value) => {
                  if (value !== (mode === "dark")) {
                    toggleMode();
                  }
                }}
              />
            </View>
          </View>

          <View style={styles.section}>
            <CustomText fontFamily="SemiBold" fontSize={13} style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              NOTIFICATIONS
            </CustomText>
            
            <View style={dynamicStyles.sectionContent}>
              <SettingToggle
                title="Push Notifications"
                subtitle="Trip updates and alerts"
                value={pushNotifications}
                onValueChange={setPushNotifications}
              />
              <View style={styles.divider} />
              <SettingToggle
                title="Email Notifications"
                subtitle="Receipts and account updates"
                value={emailNotifications}
                onValueChange={setEmailNotifications}
              />
              <View style={styles.divider} />
              <SettingToggle
                title="SMS Notifications"
                subtitle="Text message alerts"
                value={smsNotifications}
                onValueChange={setSmsNotifications}
              />
              <View style={styles.divider} />
              <SettingToggle
                title="Promotional Offers"
                subtitle="Deals and new features"
                value={promoNotifications}
                onValueChange={setPromoNotifications}
              />
            </View>
          </View>

          <View style={styles.section}>
            <CustomText fontFamily="SemiBold" fontSize={13} style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              ACCESSIBILITY
            </CustomText>
            
            <View style={dynamicStyles.sectionContent}>
              <MenuItem
                title="Accessibility Features"
                subtitle="VoiceOver, larger text, high contrast"
                onPress={() => {}}
              />
            </View>
          </View>

          <View style={styles.section}>
            <CustomText fontFamily="SemiBold" fontSize={13} style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              PRIVACY
            </CustomText>
            
            <View style={dynamicStyles.sectionContent}>
              <MenuItem
                title="Location Services"
                subtitle="Manage how we use your location"
                onPress={() => {}}
              />
              <View style={[styles.divider, { backgroundColor: colors.divider, marginLeft: 20 }]} />
              <MenuItem
                title="Data & Privacy"
                subtitle="Download or delete your data"
                onPress={() => {}}
              />
            </View>
          </View>

          <View style={styles.section}>
            <CustomText fontFamily="SemiBold" fontSize={13} style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              SECURITY
            </CustomText>
            
            <View style={dynamicStyles.sectionContent}>
              <MenuItem
                title="Change Password"
                onPress={() => {}}
              />
              <View style={[styles.divider, { backgroundColor: colors.divider, marginLeft: 20 }]} />
              <MenuItem
                title="Two-Factor Authentication"
                onPress={() => {}}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 30,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  settingInfo: {
    flex: 1,
  },
  divider: {
    height: 0.5,
    marginLeft: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuContent: {
    flex: 1,
  },
});

export default SettingsScreen;
