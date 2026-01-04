# Firebase Project Update: rideshare-bd747

## ✅ All References Updated

All Firebase project references have been changed from `kwendash-dbf13` to `rideshare-bd747`.

## Files Updated

### Code Files
1. ✅ `server/config/firebase.js`
   - Fallback project ID: `"rideshare-bd747"`

2. ✅ `client/src/config/firebase.ts`
   - Project ID: `"rideshare-bd747"`
   - Auth Domain: `"rideshare-bd747.firebaseapp.com"`
   - Storage Bucket: `"rideshare-bd747.firebasestorage.app"`
   - API Key: Updated to match config files
   - Messaging Sender ID: `913523611964`

### Config Files (Already Correct)
- ✅ `client/ios/RideApp/GoogleService-Info.plist` - Project: `rideshare-bd747`
- ✅ `client/android/app/google-services.json` - Project: `rideshare-bd747`

### Documentation Files Updated
- ✅ `server/ENV_VARIABLES.md`
- ✅ `server/ENV_SUMMARY.md`
- ✅ `server/FIREBASE_AUTH_STATUS.md`
- ✅ `server/FIREBASE_AUTH_CHECK.md`

## Current Configuration

### Client (React Native)
```typescript
// client/src/config/firebase.ts
projectId: "rideshare-bd747"
authDomain: "rideshare-bd747.firebaseapp.com"
storageBucket: "rideshare-bd747.firebasestorage.app"
messagingSenderId: "913523611964"
```

### Server (Node.js)
```javascript
// server/config/firebase.js
projectId: process.env.FIREBASE_PROJECT_ID || "rideshare-bd747"
```

## Next Steps

### 1. Update Server Environment Variables

Add to `server/.env`:
```bash
FIREBASE_PROJECT_ID=rideshare-bd747
FIREBASE_CLIENT_EMAIL=your-service-account@rideshare-bd747.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n
```

### 2. Get Firebase Admin SDK Credentials

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project: **rideshare-bd747**
3. Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download JSON file
6. Extract values for `.env` file

### 3. Test Configuration

```bash
# Start server
cd server
npm start
# Look for: "Firebase Admin initialized successfully"

# Test client
cd client
npx expo prebuild
npm run ios  # or npm run android
```

## Verification Checklist

- [x] Client Firebase config uses `rideshare-bd747`
- [x] Server Firebase config uses `rideshare-bd747` (with fallback)
- [x] iOS config file matches (`GoogleService-Info.plist`)
- [x] Android config file matches (`google-services.json`)
- [ ] Server `.env` has Firebase credentials (you need to add)
- [ ] Firebase Admin SDK initialized successfully

## Summary

✅ **All code and documentation now uses `rideshare-bd747`**

The only remaining step is to:
1. Get Firebase Admin SDK credentials from `rideshare-bd747` project
2. Add them to `server/.env`
3. Restart the server

Everything else is configured and ready!

