import { View, TextInput, StyleSheet, Alert, TouchableOpacity } from "react-native";
import React, { useState, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomText from "@/components/shared/CustomText";
import CustomButton from "@/components/shared/CustomButton";
import { Colors } from "@/utils/Constants";
import { verifyOTP } from "@/service/firebaseAuthService";
import { useWS } from "@/service/WSProvider";

const OTPVerify = () => {
  const { verificationId, role, phone } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);
  const { updateAccessToken } = useWS();

  const handleOTPChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter the 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(
        verificationId as string,
        otpCode,
        role as "customer" | "rider",
        updateAccessToken
      );
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <CustomText variant="h4" fontFamily="Bold" style={styles.title}>
          Verify OTP
        </CustomText>
        <CustomText variant="h7" fontFamily="Regular" style={styles.subtitle}>
          Enter the 6-digit code sent to {phone}
        </CustomText>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOTPChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.resendContainer}
        >
          <CustomText variant="h8" fontFamily="Medium" style={styles.resendText}>
            Didn't receive code? Resend
          </CustomText>
        </TouchableOpacity>

        <CustomButton
          title="Verify"
          onPress={handleVerify}
          loading={loading}
          disabled={loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: Colors.textLight,
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 10,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
  },
  resendContainer: {
    alignSelf: "center",
    marginBottom: 20,
  },
  resendText: {
    color: Colors.primary,
  },
});

export default OTPVerify;

