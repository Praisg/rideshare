# How to Run the App

## Prerequisites

✅ **Server is already running** on `http://localhost:3000`
✅ **Firebase is configured** and initialized

## Step 1: Navigate to Client Directory

```bash
cd client
```

## Step 2: Install Dependencies (if not done)

```bash
npm install
```

## Step 3: Choose Your Method

### Option A: Using Expo Go (Easiest - Recommended for Testing)

**Best for**: Quick testing, no build required

```bash
# Start Expo
npm start
# or
npx expo start
```

Then:
- **iOS**: Scan QR code with Camera app or Expo Go app
- **Android**: Scan QR code with Expo Go app
- **Press `i`** for iOS simulator
- **Press `a`** for Android emulator

### Option B: iOS Simulator (Mac Only)

**Best for**: iOS development and testing

```bash
# First time only - generate native projects
npx expo prebuild

# Run on iOS simulator
npm run ios
# or
npx expo run:ios
```

**Requirements:**
- Xcode installed
- iOS Simulator available

### Option C: Android Emulator

**Best for**: Android development and testing

```bash
# First time only - generate native projects
npx expo prebuild

# Run on Android emulator
npm run android
# or
npx expo run:android
```

**Requirements:**
- Android Studio installed
- Android emulator running

### Option D: Physical Device

**Best for**: Real device testing

1. **Find your computer's IP address:**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

2. **Update client config** (`client/src/service/config.tsx`):
   ```typescript
   export const BASE_URL = 'http://YOUR_IP:3000'
   export const SOCKET_URL = 'ws://YOUR_IP:3000'
   ```

3. **Start Expo:**
   ```bash
   npm start
   ```

4. **Connect device:**
   - Same WiFi network as your computer
   - Scan QR code with Expo Go app

## Quick Start Commands

### For Development (Expo Go)
```bash
cd client
npm start
# Then press 'i' for iOS or 'a' for Android
```

### For Native Build (iOS)
```bash
cd client
npx expo prebuild  # First time only
npm run ios
```

### For Native Build (Android)
```bash
cd client
npx expo prebuild  # First time only
npm run android
```

## Troubleshooting

### "Module not found" errors
```bash
cd client
rm -rf node_modules
npm install
```

### "Expo CLI not found"
```bash
npm install -g expo-cli
# or use npx (no install needed)
npx expo start
```

### "Cannot connect to server"
- Make sure server is running on `http://localhost:3000`
- For physical device: Update `BASE_URL` in `client/src/service/config.tsx` to your computer's IP

### "Firebase not working"
- Verify `GoogleService-Info.plist` is in `client/ios/RideApp/`
- Verify `google-services.json` is in `client/android/app/`
- Check Firebase project is `rideshare-bd747`

## What to Expect

1. **App starts** → Shows login/onboarding screen
2. **Phone authentication** → Enter phone number, receive OTP
3. **Role selection** → Choose Customer or Rider
4. **Main screen** → Based on your role

## Testing Flow

1. **Start server** (already running ✅)
2. **Start client app** (choose method above)
3. **Test authentication** → Phone number + OTP
4. **Test as Customer** → Book a ride
5. **Test as Rider** → Accept rides (if KYC approved)

## Summary

**Easiest way to start:**
```bash
cd client
npm start
# Press 'i' for iOS simulator or 'a' for Android emulator
```

**For production-like testing:**
```bash
cd client
npx expo prebuild
npm run ios    # or npm run android
```

Your server is already running, so just start the client! 🚀

