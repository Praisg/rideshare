# Quick Start Guide

## Setup Status
- Server dependencies: Installed
- Client dependencies: Installed  
- Server .env: Created (needs MongoDB URI)
- Google Maps API: Needs configuration

## 3 Steps to Get Running

### Step 1: Configure Google Maps API Key
From the `client` directory, run:
```bash
cd client
./configure-maps.sh YOUR_GOOGLE_MAPS_API_KEY
```

Or manually replace `YOUR_GOOGLE_MAP_API_KEY` in these files:
- `app.json` (2 places)
- `ios/RideApp/Info.plist`
- `ios/RideApp/AppDelegate.mm`
- `android/app/src/main/AndroidManifest.xml`

### Step 2: Configure MongoDB
Edit `server/.env` and update `MONGO_URI`:
```
MONGO_URI=mongodb://localhost:27017/ride_app
```

Or use MongoDB Atlas:
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ride_app
```

### Step 3: Start Everything

**Terminal 1 - Start Server:**
```bash
cd server
npm start
```

**Terminal 2 - Start Client (iOS):**
```bash
cd client
npx expo prebuild
npm run ios
```

**Or for Android:**
```bash
cd client
npx expo prebuild
npm run android
```

## Using Real Devices

Find your local network IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

Update `client/src/service/config.tsx`:
```typescript
export const BASE_URL = 'http://YOUR_LOCAL_IP:3000'
export const SOCKET_URL = 'ws://YOUR_LOCAL_IP:3000'
```

## Testing the App

1. Open two instances (or two devices)
2. One as Customer, one as Rider
3. Customer: Book a ride
4. Rider: Accept the ride
5. Track real-time location

## Need Help?
See `SETUP_COMPLETE.md` for detailed troubleshooting.

