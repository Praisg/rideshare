import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import CustomText from "@/components/shared/CustomText";
import { useUserStore } from "@/store/userStore";
import { logout } from "@/service/authService";
import { useWS } from "@/service/WSProvider";
import { useThemeStore } from "@/store/themeStore";

const AccountScreen = () => {
  const { user } = useUserStore();
  const { disconnect } = useWS();
  const { colors } = useThemeStore();

  const handleLogout = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          style: "destructive",
          onPress: () => logout(disconnect),
        },
      ]
    );
  };

  const formatPhone = (phone?: string) => {
    if (!phone) return "";
    return phone;
  };

  const getUserRating = () => {
    if (user?.stats?.avgRating) {
      return user.stats.avgRating.toFixed(1);
    }
    return "5.0";
  };

  const MenuItem = ({
    iconName,
    title,
    subtitle,
    onPress,
    showBadge = false,
    danger = false,
  }: {
    iconName: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showBadge?: boolean;
    danger?: boolean;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuIconContainer}>
        <Ionicons
          name={iconName}
          size={RFValue(20)}
          color={danger ? colors.error : colors.text}
        />
      </View>
      <View style={styles.menuContent}>
        <CustomText
          fontFamily="Medium"
          fontSize={16}
          style={[styles.menuTitle, { color: colors.text }, danger && { color: colors.error }]}
        >
          {title}
        </CustomText>
        {subtitle && (
          <CustomText fontFamily="Regular" fontSize={13} style={[styles.menuSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </CustomText>
        )}
      </View>
      {showBadge && <View style={[styles.menuBadge, { backgroundColor: colors.notification }]} />}
      <Ionicons name="chevron-forward" size={RFValue(18)} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    profileSection: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 14,
    },
    name: {
      color: colors.text,
      marginBottom: 4,
    },
    rating: {
      color: colors.text,
      marginLeft: 4,
    },
    phone: {
      color: colors.textSecondary,
    },
    quickAction: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
    },
    quickActionText: {
      color: colors.text,
    },
    menuSection: {
      backgroundColor: colors.card,
      marginBottom: 8,
    },
    menuTitle: {
      color: colors.text,
    },
    menuSubtitle: {
      color: colors.textSecondary,
      marginTop: 2,
    },
    menuBadge: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    footerText: {
      color: colors.textSecondary,
    },
    bottomNav: {
      flexDirection: "row",
      backgroundColor: colors.background,
      borderTopWidth: 0.5,
      borderTopColor: colors.divider,
      paddingVertical: 8,
      paddingHorizontal: 20,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    navText: {
      color: colors.textSecondary,
    },
    navTextActive: {
      color: colors.text,
    },
    notificationDot: {
      position: "absolute",
      top: -2,
      right: -6,
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });

  return (
    <View style={dynamicStyles.container}>
      <StatusBar style={colors.background === "#000000" ? "light" : "dark"} backgroundColor={colors.background} translucent={false} />
      
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity style={dynamicStyles.profileSection} activeOpacity={0.8}>
            <View style={dynamicStyles.avatar}>
              <Ionicons name="person" size={RFValue(28)} color={colors.textSecondary} />
            </View>
            <View style={styles.profileInfo}>
              <CustomText fontFamily="SemiBold" fontSize={22} style={dynamicStyles.name}>
                {user?.name || "Guest User"}
              </CustomText>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={RFValue(14)} color="#FFC107" />
                <CustomText fontFamily="Regular" fontSize={14} style={dynamicStyles.rating}>
                  {getUserRating()}
                </CustomText>
                <View style={styles.dot} />
                <CustomText fontFamily="Regular" fontSize={14} style={dynamicStyles.phone}>
                  {formatPhone(user?.phone)}
                </CustomText>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={RFValue(20)} color={colors.textSecondary} />
          </TouchableOpacity>

          <View style={styles.quickActions}>
            <TouchableOpacity style={dynamicStyles.quickAction}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="help-circle" size={RFValue(24)} color={colors.text} />
              </View>
              <CustomText fontFamily="Medium" fontSize={12} style={dynamicStyles.quickActionText}>
                Help
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={dynamicStyles.quickAction}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="wallet" size={RFValue(24)} color={colors.text} />
              </View>
              <CustomText fontFamily="Medium" fontSize={12} style={dynamicStyles.quickActionText}>
                Wallet
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity style={dynamicStyles.quickAction}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="car" size={RFValue(24)} color={colors.text} />
              </View>
              <CustomText fontFamily="Medium" fontSize={12} style={dynamicStyles.quickActionText}>
                Trips
              </CustomText>
            </TouchableOpacity>
          </View>

          <View style={dynamicStyles.menuSection}>
            <MenuItem
              iconName="bookmark"
              title="Saved Places"
              onPress={() => router.push("/customer/account/saved-places")}
            />
            <MenuItem
              iconName="people"
              title="Manage Account"
              subtitle="Info, security"
              onPress={() => router.push("/customer/account/settings")}
              showBadge
            />
          </View>

          <View style={styles.menuSection}>
            <MenuItem
              iconName="shield-checkmark"
              title="Safety"
              subtitle="Manage trusted contacts"
              onPress={() => router.push("/customer/account/safety")}
            />
            <MenuItem
              iconName="gift"
              title="Send a gift"
              onPress={() => {}}
            />
            <MenuItem
              iconName="megaphone"
              title="Promotions"
              onPress={() => {}}
            />
          </View>

          <View style={styles.menuSection}>
            <MenuItem
              iconName="briefcase"
              title="Set up your business profile"
              onPress={() => {}}
            />
            <MenuItem
              iconName="car-sport"
              title="Drive or deliver with RIDE"
              onPress={() => {}}
            />
          </View>

          <View style={styles.menuSection}>
            <MenuItem
              iconName="settings"
              title="Settings"
              onPress={() => router.push("/customer/account/settings")}
            />
            <MenuItem
              iconName="chatbubble"
              title="Messages"
              onPress={() => {}}
            />
          </View>

          <View style={dynamicStyles.menuSection}>
            <MenuItem
              iconName="information-circle"
              title="Legal"
              onPress={() => router.push("/customer/account/support")}
            />
          </View>

          <View style={dynamicStyles.menuSection}>
            <MenuItem
              iconName="log-out"
              title="Sign Out"
              onPress={handleLogout}
              danger
            />
          </View>

          <View style={styles.footer}>
            <CustomText fontFamily="Regular" fontSize={12} style={dynamicStyles.footerText}>
              v1.0.0
            </CustomText>
          </View>
        </ScrollView>

        <View style={dynamicStyles.bottomNav}>
          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/customer/home")}>
            <Ionicons name="home-outline" size={RFValue(22)} color={colors.textSecondary} />
            <CustomText fontFamily="Regular" fontSize={10} style={dynamicStyles.navText}>
              Home
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/customer/services")}>
            <Ionicons name="grid-outline" size={RFValue(22)} color={colors.textSecondary} />
            <CustomText fontFamily="Regular" fontSize={10} style={dynamicStyles.navText}>
              Services
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem} onPress={() => router.push("/customer/home")}>
            <Ionicons name="receipt-outline" size={RFValue(22)} color={colors.textSecondary} />
            <CustomText fontFamily="Regular" fontSize={10} style={dynamicStyles.navText}>
              Activity
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navItem}>
            <View style={styles.accountIconContainer}>
              <Ionicons name="people" size={RFValue(22)} color={colors.text} />
              <View style={[dynamicStyles.notificationDot, { backgroundColor: colors.notification }]} />
            </View>
            <CustomText fontFamily="SemiBold" fontSize={10} style={dynamicStyles.navTextActive}>
              Account
            </CustomText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileInfo: {
    flex: 1,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 8,
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
  },
  menuIconContainer: {
    width: 32,
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    gap: 4,
  },
  accountIconContainer: {
    position: "relative",
  },
});

export default AccountScreen;
