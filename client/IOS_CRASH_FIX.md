# iOS Dev Launcher Crash Fix - Completed Steps

## Problem
The iOS app was crashing when Expo Dev Launcher tried to fetch/load the app manifest. The crash occurred in `EXDevLauncherController loadApp` / `EXDevLauncherManifestParser _fetch` - indicating an invalid/unreachable project URL or corrupted dev setup.

## Fixes Applied

### ✅ Step 1: Metro Server with Cache Clear
- Restarted Metro with `--dev-client -c` flags to clear cache
- Command: `npx expo start --dev-client --localhost -c`

### ✅ Step 2: Project URL Configuration
- Started Metro with `--localhost` flag to ensure dev client uses a reachable URL
- This prevents the dev client from trying to fetch from an unreachable URL

### ✅ Step 3: Hard Reset iOS Build Artifacts
- Cleaned and reinstalled `node_modules`
- Removed iOS Pods and Podfile.lock
- Reinstalled CocoaPods dependencies
- Cleared Xcode DerivedData

### ✅ Step 4: Re-build Dev Client
- Ran `npx expo prebuild --clean` to regenerate native directories
- Pods reinstalled successfully

## Next Steps to Run the App

### 1. Start Metro Bundler (if not already running)
```bash
cd /Users/praisegavi/rideshare/client
npx expo start --dev-client --localhost -c
```

**Important:** Make sure Metro is running BEFORE opening the iOS app. The dev client needs to fetch the manifest from Metro.

### 2. Build and Run iOS App

**Option A: Using Expo CLI (Recommended)**
```bash
cd /Users/praisegavi/rideshare/client
npx expo run:ios
```

**Option B: Using Xcode**
1. Open `client/ios/RideApp.xcworkspace` in Xcode
2. Select a simulator or connected device
3. Press ⌘+R to build and run

### 3. If Using iOS Simulator
- Make sure Metro is running on `localhost`
- The simulator should automatically connect to Metro
- If you see a QR code, you can ignore it (that's for physical devices)

### 4. If Using Physical Device
- Make sure your device and computer are on the same network
- You may need to use `--lan` instead of `--localhost`:
  ```bash
  npx expo start --dev-client --lan -c
  ```
- Update `BASE_URL` in `client/src/service/config.tsx` to your computer's local IP

## Troubleshooting

### If the app still crashes on launch:
1. **Check Metro is running**: Look for the Metro bundler terminal output
2. **Check the manifest URL**: In Metro terminal, look for lines containing "manifest" or "dev launcher"
3. **Verify network connectivity**: Make sure the simulator/device can reach Metro
4. **Check Xcode console**: Look for any error messages about manifest fetching

### If you see "Unable to connect to Metro":
- Make sure Metro is running with `--dev-client` flag
- Try restarting Metro with `-c` to clear cache
- Check firewall settings if using `--lan`

### If pods need to be reinstalled:
```bash
cd client/ios
rm -rf Pods Podfile.lock
export LANG=en_US.UTF-8
pod install
```

## Key Configuration Files

- **app.json**: Contains app scheme (`myapp`) and bundle identifier (`com.ritik.rideapp`)
- **Info.plist**: Contains URL schemes including `exp+rideapp` for Expo dev client
- **config.tsx**: Contains `BASE_URL` for server connection (update for physical devices)

## Notes

- The app uses `expo-dev-client` which requires a custom dev client build
- Metro must be running before the app launches
- The `--localhost` flag ensures the dev client connects to Metro on the same machine
- Cache clearing (`-c`) helps resolve stale manifest issues

