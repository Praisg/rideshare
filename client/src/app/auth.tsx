import {
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import CustomText from "@/components/shared/CustomText";
import { useWS } from "@/service/WSProvider";
import PhoneInput from "@/components/shared/PhoneInput";
import { signin } from "@/service/authService";
import { Colors } from "@/utils/Constants";
import { testServerConnection } from "@/utils/testConnection";

const Auth = () => {
  const { updateAccessToken } = useWS();
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState<"customer" | "rider" | null>(null);
  const [testing, setTesting] = useState(false);

  const handleTestConnection = async () => {
    setTesting(true);
    const result = await testServerConnection();
    setTesting(false);
    
    if (result.success) {
      Alert.alert("Success!", result.message);
    } else {
      Alert.alert("Connection Failed", result.message + "\n\nCheck console for details.");
    }
  };

  const handleNext = async () => {
    if (!selectedRole) {
      Alert.alert("Please select your role", "Choose whether you're a Customer or a Rider");
      return;
    }
    
    if (!phone || phone.length < 9) {
      Alert.alert("Please enter your phone number");
      return;
    }
    
    signin({ role: selectedRole, phone }, updateAccessToken);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/logo_t.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.testButton} 
            onPress={handleTestConnection}
            disabled={testing}
          >
            <MaterialIcons name="wifi" size={20} color={Colors.primary} />
            <CustomText fontFamily="Medium" variant="h8" style={styles.testButtonText}>
              {testing ? "Testing..." : "Test Server Connection"}
            </CustomText>
          </TouchableOpacity>

          <CustomText fontFamily="Bold" variant="h3" style={styles.title}>
            Get started with Ride
          </CustomText>

          <CustomText fontFamily="Medium" variant="h6" style={styles.sectionTitle}>
            I am a:
          </CustomText>

          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === "customer" && styles.roleCardSelected,
              ]}
              onPress={() => setSelectedRole("customer")}
            >
              <Image
                source={require("@/assets/images/customer.jpg")}
                style={styles.roleImage}
              />
              <View style={styles.roleContent}>
                <CustomText fontFamily="SemiBold" variant="h6" style={styles.roleTitle}>
                  Customer
                </CustomText>
                <CustomText fontFamily="Regular" variant="h8" style={styles.roleDescription}>
                  Book rides and deliveries
                </CustomText>
              </View>
              {selectedRole === "customer" && (
                <View style={styles.checkmark}>
                  <MaterialIcons name="check-circle" size={24} color={Colors.primary} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleCard,
                selectedRole === "rider" && styles.roleCardSelected,
              ]}
              onPress={() => setSelectedRole("rider")}
            >
              <Image
                source={require("@/assets/images/rider_logo.png")}
                style={styles.roleImage}
              />
              <View style={styles.roleContent}>
                <CustomText fontFamily="SemiBold" variant="h6" style={styles.roleTitle}>
                  Rider
                </CustomText>
                <CustomText fontFamily="Regular" variant="h8" style={styles.roleDescription}>
                  Drive and deliver
                </CustomText>
              </View>
              {selectedRole === "rider" && (
                <View style={styles.checkmark}>
                  <MaterialIcons name="check-circle" size={24} color={Colors.primary} />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <CustomText fontFamily="Regular" variant="h7" style={styles.label}>
            Mobile number
          </CustomText>

          <PhoneInput onChangeText={setPhone} value={phone} />

          <TouchableOpacity style={styles.continueButton} onPress={handleNext}>
            <CustomText fontFamily="Bold" variant="h6" style={styles.continueText}>
              Continue
            </CustomText>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <CustomText fontFamily="Regular" variant="h7" style={styles.dividerText}>
              or
            </CustomText>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.socialButton}>
            <MaterialIcons name="apple" size={24} color={Colors.text} />
            <CustomText fontFamily="SemiBold" variant="h6" style={styles.socialButtonText}>
              Continue with Apple
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <MaterialIcons name="g-translate" size={24} color={Colors.text} />
            <CustomText fontFamily="SemiBold" variant="h6" style={styles.socialButtonText}>
              Continue with Google
            </CustomText>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <CustomText fontFamily="Regular" variant="h8" style={styles.footerText}>
            By proceeding, you consent to get calls, WhatsApp or SMS/RCS messages, including by automated dialer, from Ride and its affiliates to the number provided.
          </CustomText>
          <CustomText fontFamily="Regular" variant="h8" style={styles.footerText}>
            This site is protected by reCAPTCHA and the Google{' '}
            <CustomText fontFamily="SemiBold" variant="h8" style={styles.footerLink}>
              Privacy Policy
            </CustomText>{' '}
            and{' '}
            <CustomText fontFamily="SemiBold" variant="h8" style={styles.footerLink}>
              Terms of Service
            </CustomText>{' '}
            apply.
          </CustomText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  testButtonText: {
    color: Colors.primary,
    fontSize: 12,
  },
  title: {
    fontSize: 28,
    color: Colors.text,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: Colors.text,
    marginBottom: 15,
  },
  roleContainer: {
    marginBottom: 25,
    gap: 12,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#FFF5F0',
  },
  roleImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  roleContent: {
    flex: 1,
    marginLeft: 12,
  },
  roleTitle: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
  },
  roleDescription: {
    fontSize: 13,
    color: Colors.textLight,
  },
  checkmark: {
    marginLeft: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  continueButton: {
    backgroundColor: Colors.text,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  continueText: {
    color: Colors.white,
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.textLight,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 15,
    color: Colors.textLight,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 12,
    gap: 12,
  },
  socialButtonText: {
    color: Colors.text,
    fontSize: 16,
  },
  footer: {
    paddingVertical: 30,
    gap: 12,
  },
  footerText: {
    color: Colors.textLight,
    fontSize: 11,
    lineHeight: 16,
  },
  footerLink: {
    color: Colors.text,
    textDecorationLine: 'underline',
  },
});

export default Auth;

