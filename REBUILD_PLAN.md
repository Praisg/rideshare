# Systematic Rebuild Plan

## Goal
Create a clean RIDE app project with proper dependencies, no conflicts, and working Expo Go compatibility.

---

## Phase 1: Backup Current Code (5 min)

### 1.1 Create Clean Backup
```bash
cd /Users/malvin/Desktop
mkdir RIDE_BACKUP
```

### 1.2 Copy Source Code Only (No Dependencies)
```bash
# Server - copy source only
mkdir -p RIDE_BACKUP/server
cp -R RIDE/server/{controllers,models,routes,middleware,errors,utils,config} RIDE_BACKUP/server/
cp RIDE/server/{app.js,package.json,.env} RIDE_BACKUP/server/

# Client - copy source only
mkdir -p RIDE_BACKUP/client
cp -R RIDE/client/src RIDE_BACKUP/client/
cp RIDE/client/{app.json,tsconfig.json,package.json} RIDE_BACKUP/client/
```

---

## Phase 2: Create Fresh Project (10 min)

### 2.1 Create New Directory
```bash
cd /Users/malvin/Desktop
mkdir RIDE_CLEAN
cd RIDE_CLEAN
```

### 2.2 Initialize Fresh Expo Project
```bash
# Create new Expo project with Router
npx create-expo-app@latest client --template tabs@52
```

**Why SDK 52?**
- More stable than SDK 54
- Better compatibility with React Native 0.76.x
- Matches original project structure

### 2.3 Setup Server Fresh
```bash
mkdir server
cd server
npm init -y
```

---

## Phase 3: Server Setup (5 min)

### 3.1 Install Server Dependencies
```bash
cd /Users/malvin/Desktop/RIDE_CLEAN/server

npm install express mongoose dotenv express-async-errors \
  socket.io jsonwebtoken geolib http-status-codes

npm install -D nodemon
```

### 3.2 Copy Server Code
```bash
# Copy from backup
cp -R /Users/malvin/Desktop/RIDE_BACKUP/server/{controllers,models,routes,middleware,errors,utils,config} .
cp /Users/malvin/Desktop/RIDE_BACKUP/server/app.js .
cp /Users/malvin/Desktop/RIDE_BACKUP/server/.env .
```

### 3.3 Update package.json
Add to scripts:
```json
{
  "type": "module",
  "scripts": {
    "start": "nodemon app.js"
  }
}
```

---

## Phase 4: Client Setup (15 min)

### 4.1 Install Client Dependencies
```bash
cd /Users/malvin/Desktop/RIDE_CLEAN/client

# Core dependencies
npm install --legacy-peer-deps \
  @gorhom/bottom-sheet \
  @react-navigation/bottom-tabs \
  @react-navigation/native \
  axios \
  socket.io-client \
  zustand \
  jwt-decode \
  haversine-distance \
  react-native-mmkv

# Expo packages
npx expo install expo-location expo-font expo-haptics \
  expo-blur expo-constants expo-system-ui

# React Native packages
npx expo install react-native-maps react-native-maps-directions \
  react-native-gesture-handler react-native-reanimated \
  react-native-safe-area-context react-native-screens \
  react-native-svg react-native-webview

# UI packages
npm install --legacy-peer-deps \
  react-native-countdown-circle-timer \
  react-native-responsive-fontsize \
  rn-swipe-button
```

### 4.2 Copy Client Source Code
```bash
# Remove default app structure
rm -rf app

# Copy our app structure
cp -R /Users/malvin/Desktop/RIDE_BACKUP/client/src .

# Copy fonts and assets
# (Will create proper structure)
```

### 4.3 Update app.json
- Set SDK 52
- Add Google Maps API key
- Configure bundle identifiers
- Add expo-location plugin

### 4.4 Configure for Expo Go
Update `src/service/config.tsx`:
```typescript
export const BASE_URL = 'http://10.0.0.136:3000'
export const SOCKET_URL = 'ws://10.0.0.136:3000'
```

---

## Phase 5: Configuration (5 min)

### 5.1 Google Maps Setup
```bash
cd /Users/malvin/Desktop/RIDE_CLEAN/client

# Update app.json with API key
```

### 5.2 MongoDB Setup
```bash
# .env already copied
# Verify connection string
```

---

## Phase 6: Test & Launch (5 min)

### 6.1 Start Server
```bash
cd /Users/malvin/Desktop/RIDE_CLEAN/server
npm start
```

### 6.2 Start Client
```bash
cd /Users/malvin/Desktop/RIDE_CLEAN/client
npx expo start
```

### 6.3 Connect Expo Go
- Scan QR code
- Or enter: `exp://10.0.0.136:8081`

---

## Benefits of This Approach

1. **Clean Dependencies**: No version conflicts
2. **Proper SDK**: Using stable SDK 52
3. **Fresh Start**: No corrupted node_modules
4. **Same Code**: All your logic preserved
5. **Documented**: Clear steps to reproduce
6. **Works with Expo Go**: Proper compatibility

---

## Estimated Time

- Phase 1: 5 minutes
- Phase 2: 10 minutes  
- Phase 3: 5 minutes
- Phase 4: 15 minutes
- Phase 5: 5 minutes
- Phase 6: 5 minutes

**Total: ~45 minutes**

---

## Rollback Plan

If something goes wrong:
- Original project still in `/Users/malvin/Desktop/RIDE`
- Backup in `/Users/malvin/Desktop/RIDE_BACKUP`
- Can restart any phase

---

## Success Criteria

✓ Server starts without errors
✓ MongoDB connects successfully
✓ Metro bundler shows QR code
✓ Expo Go connects and loads app
✓ Maps display correctly
✓ WebSocket connects
✓ Can book and accept rides

---

## Ready to Execute?

This plan will create a clean, working version of your app with:
- Proper dependency versions
- Expo Go SDK 52 compatibility
- All your existing code
- Clean configuration
- Documentation for future

**Shall we proceed?**

