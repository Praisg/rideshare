import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCEGxinASLuWazGKRywi7YADLDKDs4KCwg", // From GoogleService-Info.plist
  authDomain: "rideshare-bd747.firebaseapp.com",
  projectId: "rideshare-bd747", // Matches config files
  storageBucket: "rideshare-bd747.firebasestorage.app",
  messagingSenderId: "913523611964", // Project number from config files
  appId: "1:913523611964:ios:f91902f62a95c8026c2639", // iOS app ID from GoogleService-Info.plist
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth };

