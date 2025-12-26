# Ride App - Setup Complete

## What's Been Fixed

### Server Setup
- Created `.env` file with default configuration
- Installed all server dependencies
- Default MongoDB URI: `mongodb://localhost:27017/ride_app`
- Default PORT: `3000`

### Client Setup
- Installed all client dependencies with legacy peer deps
- Configured for iOS (localhost:3000) and Android (10.0.2.2:3000)

## What You Need To Do

### 1. Configure MongoDB
Edit `/server/.env` and update `MONGO_URI` with your actual MongoDB connection string:
```
MONGO_URI=your_mongodb_connection_string_here
```

For local MongoDB:
```
MONGO_URI=mongodb://localhost:27017/ride_app
```

For MongoDB Atlas:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ride_app
```

### 2. Configure Google Maps API Key
You need to replace `YOUR_GOOGLE_MAP_API_KEY` in these 5 files:

1. `/client/app.json` (line 20 - iOS)
2. `/client/app.json` (line 26 - Android)
3. `/client/ios/RideApp/Info.plist` (line 38)
4. `/client/ios/RideApp/AppDelegate.mm` (line 17)
5. `/client/android/app/src/main/AndroidManifest.xml` (line 17)

**Quick Fix Command:**
Run this from the `/client` directory (replace `YOUR_ACTUAL_API_KEY` with your key):
```bash
find . -type f \( -name "*.json" -o -name "*.plist" -o -name "*.mm" -o -name "*.xml" \) -exec sed -i '' 's/YOUR_GOOGLE_MAP_API_KEY/YOUR_ACTUAL_API_KEY/g' {} +
```

### 3. Update Bundle Identifier (Optional)
Change `com.ritik.rideapp` to your preferred identifier in:
- `/client/app.json` (line 18 for iOS, line 33 for Android)

### 4. Start the Server
```bash
cd server
npm start
```

The server will run on `http://localhost:3000`

### 5. Start the Client

For iOS:
```bash
cd client
npx expo prebuild
npm run ios
```

For Android:
```bash
cd client
npx expo prebuild
npm run android
```

## Testing on Real Devices

If using a real device, update the API URLs in `/client/src/service/config.tsx`:

Find your local network IP:
- Mac: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- Windows: `ipconfig`
- Linux: `ip addr show`

Then update config.tsx:
```typescript
export const BASE_URL = 'http://YOUR_LOCAL_IP:3000'
export const SOCKET_URL = 'ws://YOUR_LOCAL_IP:3000'
```

## Troubleshooting

### Server won't start
- Ensure MongoDB is running
- Check `.env` file exists with proper MONGO_URI

### Client build errors
- Run `npx expo prebuild` before running iOS/Android
- Ensure Google Maps API key is configured
- Check that you're using Node.js 18+ and have Expo CLI installed

### Map not showing
- Verify Google Maps API key is correctly set in all 5 locations
- Ensure Maps SDK is enabled in Google Cloud Console
- For iOS: Enable "Maps SDK for iOS"
- For Android: Enable "Maps SDK for Android"

## Current Status
- Server: Ready (dependencies installed, .env created)
- Client: Ready (dependencies installed, needs Google Maps API key)
- Database: Needs configuration

