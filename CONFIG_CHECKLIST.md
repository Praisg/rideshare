# Configuration Checklist

Before running the app, complete these steps:

## [ ] Step 1: MongoDB Configuration
Location: `/server/.env`
```bash
# Replace with your MongoDB connection string
MONGO_URI=mongodb://localhost:27017/ride_app
```

**Options:**
- Local: Install MongoDB and use `mongodb://localhost:27017/ride_app`
- Cloud: Sign up for MongoDB Atlas and use their connection string

## [ ] Step 2: Google Maps API Key
Run this command from the `/client` directory:
```bash
cd client
./configure-maps.sh YOUR_GOOGLE_MAPS_API_KEY
```

**Get API Key:**
1. Go to https://console.cloud.google.com/
2. Create a project
3. Enable these APIs:
   - Maps SDK for iOS
   - Maps SDK for Android
   - Directions API
   - Geocoding API
4. Create credentials -> API Key

**Files Updated (5 total):**
- app.json (2 places)
- ios/RideApp/Info.plist
- ios/RideApp/AppDelegate.mm
- android/app/src/main/AndroidManifest.xml

## [ ] Step 3: Start Server
```bash
cd server
npm start
```

Expected output:
```
HTTP server is running on port http://localhost:3000
```

## [ ] Step 4: Build Client (First time only)
```bash
cd client
npx expo prebuild
```

## [ ] Step 5: Run Client
```bash
cd client
npm run ios      # For iOS
# OR
npm run android  # For Android
```

## [ ] Optional: Configure for Real Device
If testing on a real device, find your local IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Update `/client/src/service/config.tsx`:
```typescript
export const BASE_URL = 'http://YOUR_LOCAL_IP:3000'
export const SOCKET_URL = 'ws://YOUR_LOCAL_IP:3000'
```

## [ ] Optional: Change Bundle Identifier
Edit `/client/app.json`:
- Line 18: `"bundleIdentifier": "com.yourcompany.rideapp"`
- Line 33: `"package": "com.yourcompany.rideapp"`

---

## Quick Reference

**Already Completed:**
- ✓ Server dependencies installed
- ✓ Client dependencies installed
- ✓ .env file created
- ✓ Helper scripts created
- ✓ Documentation created

**Start Commands:**
```bash
# Terminal 1 - Server
cd server && npm start

# Terminal 2 - Client  
cd client && npm run ios
```

**Verify Setup:**
- Server should show: "HTTP server is running on port http://localhost:3000"
- MongoDB should be connected
- Client should build and launch simulator/emulator
