# Firebase Setup Guide for React Native/Expo

## ✅ What You Already Have

1. **Firebase JavaScript SDK**: Already installed (`firebase: ^12.7.0`)
2. **Firebase Configuration**: Already set up in `client/src/config/firebase.ts`
3. **GoogleService-Info.plist**: File exists but may need updating

## ⚠️ Important: Project Mismatch

Your `GoogleService-Info.plist` shows:
- `PROJECT_ID: rideshare-bd747`

But your Firebase config shows:
- `projectId: kwendash-dbf13`

**You need to use the correct `GoogleService-Info.plist` from the `kwendash-dbf13` project.**

## What You DON'T Need

❌ **Swift Package Manager** - Not needed for React Native
❌ **Native iOS Firebase SDK** - You're using JavaScript SDK
❌ **Xcode Package Manager** - Not required

## What You DO Need

### 1. Update GoogleService-Info.plist

After downloading the new `GoogleService-Info.plist` from Firebase Console:

1. **Replace the file**:
   ```
   client/ios/RideApp/GoogleService-Info.plist
   ```

2. **Verify it has the correct project ID**: `kwendash-dbf13`

### 2. For Android (if needed)

Download `google-services.json` and place it at:
```
client/android/app/google-services.json
```

### 3. Server-Side Setup (For Backend)

You still need Firebase Admin SDK credentials for the server:

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Extract values for `server/.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`

## How React Native Firebase Works

Your app uses:
- **Firebase JavaScript SDK** (npm package) - Already installed ✅
- **GoogleService-Info.plist** (iOS config file) - Needs updating ⚠️
- **google-services.json** (Android config file) - May need to add

The JavaScript SDK reads the config files automatically - no native code changes needed!

## Next Steps

1. ✅ Download correct `GoogleService-Info.plist` from Firebase Console
2. ✅ Replace `client/ios/RideApp/GoogleService-Info.plist`
3. ✅ Download `google-services.json` for Android (if using Android)
4. ✅ Get Firebase Admin SDK credentials for server
5. ✅ Add credentials to `server/.env`

## Verification

After updating files, rebuild the app:

```bash
cd client
npx expo prebuild  # Regenerate native projects
npm run ios        # For iOS
# or
npm run android    # For Android
```

The Firebase JavaScript SDK will automatically read the config files.


