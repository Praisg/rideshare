import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAnpcq56J2otESmsB8BnYp86nV9pw3wPec",
  authDomain: "kwendash-dbf13.firebaseapp.com",
  projectId: "kwendash-dbf13",
  storageBucket: "kwendash-dbf13.firebasestorage.app",
  messagingSenderId: "269847145872",
  appId: "1:269847145872:web:597b75e6b451c5867a9715",
  measurementId: "G-N755SHJNJT"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export { app, auth };

