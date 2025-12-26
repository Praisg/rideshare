# Launch Instructions - RIDE App

## Setup Complete ✓

All configuration is complete. Your app is ready to launch!

### What's Configured
- ✓ MongoDB Atlas connected
- ✓ Google Maps API configured (5 files)
- ✓ Server dependencies installed
- ✓ Client dependencies installed
- ✓ iOS CocoaPods installed (91 pods)
- ✓ Android Gradle configured
- ✓ Native projects generated

---

## Launch the App

### Step 1: Start the Server

Open a terminal:
```bash
cd /Users/malvin/Desktop/RIDE/server
npm start
```

**Expected Output:**
```
HTTP server is running on port http://localhost:3000
```

Keep this terminal running.

---

### Step 2: Launch the Client

Open a **new terminal**:

#### For iOS:
```bash
cd /Users/malvin/Desktop/RIDE/client
npm run ios
```

#### For Android:
```bash
cd /Users/malvin/Desktop/RIDE/client
npm run android
```

---

## Quick Launch Scripts

### Option A: Use the helper script
```bash
cd /Users/malvin/Desktop/RIDE
./START_SERVER.sh
```

### Option B: Run both in one command (separate terminals needed)
```bash
# Terminal 1
cd /Users/malvin/Desktop/RIDE/server && npm start

# Terminal 2  
cd /Users/malvin/Desktop/RIDE/client && npm run ios
```

---

## Testing the App

### Test Scenario 1: Customer Books a Ride

1. Launch the app on first device/simulator
2. Select "Customer" role
3. Enter phone number (any 10 digits)
4. Select pickup location on map
5. Select drop location on map
6. Choose vehicle type
7. Confirm booking

### Test Scenario 2: Rider Accepts Ride

1. Launch the app on second device/simulator
2. Select "Rider" role
3. Enter phone number (different from customer)
4. Toggle "Go on Duty"
5. Wait for ride request
6. Accept the ride
7. Start ride with OTP
8. Complete ride

---

## Configuration Details

### MongoDB Atlas
```
Connection: mongodb+srv://marvingoreedu_db_user:***@cluster0.gywqacy.mongodb.net/ride_app
Database: ride_app
Collections: users, rides
```

### Google Maps API
```
Key: AIzaSyCh1ybEuYu7ypDnz0JUrHHdVVDZPh8zJRs
Enabled APIs:
  - Maps SDK for iOS
  - Maps SDK for Android
  - Directions API
  - Geocoding API
```

### Server
```
Port: 3000
Host: 0.0.0.0
WebSocket: Enabled
JWT: Access & Refresh tokens configured
```

### Client
```
iOS Bundle ID: com.ritik.rideapp
Android Package: com.ritik.rideapp
Base URL: http://localhost:3000 (iOS), http://10.0.2.2:3000 (Android)
Socket URL: ws://localhost:3000 (iOS), ws://10.0.2.2:3000 (Android)
```

---

## Troubleshooting

### Server Issues

**Server won't start:**
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process if needed
kill -9 <PID>
```

**MongoDB connection error:**
- Check internet connection
- Verify MongoDB Atlas network access (whitelist IP)
- Check credentials in `.env` file

### Client Issues

**Build errors:**
```bash
# Clean and rebuild
cd /Users/malvin/Desktop/RIDE/client
npx expo prebuild --clean
npm run ios
```

**Maps not showing:**
- Verify API key is correct
- Check Google Cloud Console for API restrictions
- Ensure billing is enabled

**Metro bundler issues:**
```bash
# Clear cache
npx expo start -c
```

### iOS Specific

**CocoaPods issues:**
```bash
cd /Users/malvin/Desktop/RIDE/client/ios
pod deintegrate
pod install
```

**Simulator not launching:**
```bash
# List available simulators
xcrun simctl list devices

# Reset simulator
xcrun simctl erase all
```

### Android Specific

**Gradle build failed:**
```bash
cd /Users/malvin/Desktop/RIDE/client/android
./gradlew clean
cd ..
npm run android
```

**Emulator not starting:**
```bash
# List available emulators
emulator -list-avds

# Start specific emulator
emulator -avd <emulator_name>
```

---

## Real Device Testing

### Find Your Local IP
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Update Configuration
Edit `/Users/malvin/Desktop/RIDE/client/src/service/config.tsx`:
```typescript
export const BASE_URL = 'http://YOUR_LOCAL_IP:3000'
export const SOCKET_URL = 'ws://YOUR_LOCAL_IP:3000'
```

### Rebuild
```bash
cd /Users/malvin/Desktop/RIDE/client
npx expo prebuild --clean
npm run ios  # or npm run android
```

---

## Development Tips

### Hot Reload
- Changes to JavaScript/TypeScript files will hot reload automatically
- Changes to native code require rebuild

### Debugging
- Shake device/simulator to open developer menu
- Enable "Debug JS Remotely" for Chrome DevTools
- Use React Native Debugger for better experience

### Logs
```bash
# iOS logs
npx react-native log-ios

# Android logs
npx react-native log-android

# Server logs
# Check terminal running npm start
```

---

## Project Structure

```
RIDE/
├── server/
│   ├── .env                    ✓ Configured
│   ├── app.js                  Entry point
│   ├── controllers/            Business logic
│   ├── models/                 MongoDB schemas
│   ├── routes/                 API routes
│   └── middleware/             Auth & error handling
│
└── client/
    ├── app.json                ✓ Maps API configured
    ├── src/
    │   ├── app/                Screens (Expo Router)
    │   ├── components/         React components
    │   ├── service/            API & WebSocket
    │   ├── store/              State management
    │   └── utils/              Helper functions
    ├── android/                ✓ Native Android
    └── ios/                    ✓ Native iOS
```

---

## API Endpoints

### Authentication
- `POST /auth/signin` - Login/Register
- `POST /auth/refresh-token` - Refresh access token

### Rides
- `POST /ride/book` - Create new ride
- `POST /ride/accept` - Accept ride (rider)
- `POST /ride/start` - Start ride
- `POST /ride/arrived` - Mark arrived
- `POST /ride/complete` - Complete ride
- `GET /ride/current` - Get current ride

### WebSocket Events
- `goOnDuty` - Rider goes on duty
- `goOffDuty` - Rider goes off duty
- `updateLocation` - Update location
- `searchrider` - Search for nearby riders
- `rideOffer` - Ride offer to rider
- `rideAccepted` - Ride accepted notification

---

## Next Steps

1. **Start the server** (see Step 1 above)
2. **Launch the client** (see Step 2 above)
3. **Test with two devices** (customer + rider)
4. **Customize the app** (optional):
   - Update bundle identifier
   - Modify fare calculation
   - Customize UI/UX
   - Add new features

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review other documentation files:
   - `README.md` - Project overview
   - `SETUP_COMPLETE.md` - Detailed setup
   - `APP_READY.md` - Configuration summary
3. Check server logs for backend issues
4. Check Metro bundler logs for client issues

---

**Your app is ready! Start the server and launch the client to begin testing.**

