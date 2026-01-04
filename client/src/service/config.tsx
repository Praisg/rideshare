import { Platform } from "react-native";

// Use 'localhost' for iOS Simulator, or your computer's IP address for physical devices
// For iOS Simulator, use localhost. For physical devices, use your computer's local IP (e.g., 10.0.0.136)
// iOS Simulator can access localhost directly, physical devices need the network IP
export const BASE_URL = __DEV__ && Platform.OS === 'ios' 
  ? 'http://localhost:3000' 
  : 'http://10.0.0.136:3000';

export const SOCKET_URL = __DEV__ && Platform.OS === 'ios'
  ? 'ws://localhost:3000'
  : 'ws://10.0.0.136:3000';
    