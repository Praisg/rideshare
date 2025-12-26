# Easy Solution: Use Expo Go App

## Problem
- Emulator needs 7.3 GB of space
- Only 4.3 GB available
- Building native apps is complex

## Best Solution: Expo Go App

Use **Expo Go** on your physical phone - it's the fastest and easiest way to test!

---

## Setup (2 Minutes)

### Step 1: Install Expo Go on Your Phone

**On iPhone:**
- Open App Store
- Search "Expo Go"
- Install the app

**On Android:**
- Open Google Play Store
- Search "Expo Go"
- Install the app

### Step 2: Start Expo Dev Server

```bash
cd /Users/malvin/Desktop/RIDE/client
npm start
```

This will show a QR code in the terminal.

### Step 3: Scan QR Code

**On iPhone:**
- Open Camera app
- Point at QR code
- Tap the notification to open in Expo Go

**On Android:**
- Open Expo Go app
- Tap "Scan QR Code"
- Scan the QR code from terminal

### Step 4: Done!

Your app will load on your phone instantly!

---

## Important: Network Configuration

Your phone and computer must be on the same WiFi network.

The app is currently configured for emulator. Update for physical device:

**Edit:** `/Users/malvin/Desktop/RIDE/client/src/service/config.tsx`

Find your Mac's local IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
```

Update config.tsx:
```typescript
export const BASE_URL = 'http://YOUR_LOCAL_IP:3000'
export const SOCKET_URL = 'ws://YOUR_LOCAL_IP:3000'
```

For example, if your IP is `192.168.1.100`:
```typescript
export const BASE_URL = 'http://192.168.1.100:3000'
export const SOCKET_URL = 'ws://192.168.1.100:3000'
```

---

## Full Steps

1. **Get your Mac's local IP:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
```

2. **Update config file with that IP**

3. **Make sure server is running:**
```bash
cd /Users/malvin/Desktop/RIDE/server
npm start
```

4. **Start Expo dev server:**
```bash
cd /Users/malvin/Desktop/RIDE/client
npm start
```

5. **Scan QR code with Expo Go app**

---

## Benefits of Expo Go

- ✓ No emulator needed
- ✓ No disk space issues
- ✓ No build process
- ✓ Hot reload on save
- ✓ Test on real device
- ✓ Works on iOS and Android
- ✓ Instant updates

---

## Current Server Status

Your server should already be running. If not:

```bash
cd /Users/malvin/Desktop/RIDE/server
npm start
```

You should see:
```
HTTP server is running on port http://localhost:3000
```

---

## Troubleshooting

### Can't see QR code?
Press `w` in the terminal to open web interface with QR code.

### Connection refused?
Make sure:
1. Server is running on port 3000
2. Phone and computer on same WiFi
3. IP address in config.tsx is correct
4. No firewall blocking port 3000

### Test server from phone browser:
Open Safari/Chrome on phone and go to: `http://YOUR_LOCAL_IP:3000`

If you see an error page or JSON, the server is reachable!

---

## Alternative: Free Up Disk Space

If you want to use emulator instead:

```bash
# Clean npm cache
npm cache clean --force

# Clean CocoaPods cache
pod cache clean --all

# Delete old iOS builds
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Empty trash
# Then try emulator again
```

---

**Recommended: Use Expo Go - it's faster, easier, and works great!**

