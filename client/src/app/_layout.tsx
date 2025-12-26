import React from "react";
import { Stack } from "expo-router";
import { WSProvider } from "@/service/WSProvider";

const Layout = () => {
  return (
    <WSProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="otp-verify" />
        <Stack.Screen name="customer/selectlocations" />
        <Stack.Screen name="customer/ridebooking" />
        <Stack.Screen name="customer/home" />
        <Stack.Screen name="rider/home" />
        <Stack.Screen name="customer/liveride" />
        <Stack.Screen name="rider/liveride" />
      </Stack>
    </WSProvider>
  );
};

export default Layout;
