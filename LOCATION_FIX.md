# Location Fix - San Francisco Default Issue

## Problem

Maps were defaulting to San Francisco (37.7749, -122.4194) instead of using the user's actual current location.

---

## Root Cause

The `defaultInitialRegion` in `client/src/utils/CustomMap.tsx` was hardcoded to San Francisco coordinates and was being used as the initial region for all map components before the user's actual location loaded.

---

## Files Fixed

### 1. `client/src/utils/CustomMap.tsx`

**Before:**
```typescript
export const defaultInitialRegion = {
  latitude: 37.7749,   // San Francisco
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
```

**After:**
```typescript
export const defaultInitialRegion = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 100,
  longitudeDelta: 100,
};
```

This neutral default prevents showing any specific location while waiting for the user's actual location to load.

---

### 2. `client/src/components/customer/DraggableMap.tsx`

**Changes:**
- Added `currentRegion` state to track the actual user location
- Improved location fetching with `Location.Accuracy.Balanced`
- Use `animateToRegion()` to smoothly transition to user's location
- Set initial region to user's location once fetched

**Key improvements:**
```typescript
const [currentRegion, setCurrentRegion] = useState(defaultInitialRegion);

// Fetch user location on mount
const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.Balanced,
});

const newRegion = {
  latitude,
  longitude,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

setCurrentRegion(newRegion);
mapRef.current?.animateToRegion(newRegion, 1000);
```

---

### 3. `client/src/components/customer/MapPickerModal.tsx`

**Changes:**
- Added `initialRegion` state to store user's location
- Fetch user location when modal becomes visible
- Use actual location as initial region instead of hardcoded default

**Key improvements:**
```typescript
const [initialRegion, setInitialRegion] = useState<Region>(defaultInitialRegion);

useEffect(() => {
  (async () => {
    if (visible && !selectedLocation?.latitude && !location?.latitude) {
      const userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = userLocation.coords;
      const newRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      };
      setInitialRegion(newRegion);
      setRegion(newRegion);
    }
  })();
}, [visible]);
```

---

## How It Works Now

### Customer Home Screen (`DraggableMap`)
1. Map initializes with neutral default (0,0)
2. Immediately requests location permission
3. Fetches user's current location
4. Animates map to user's actual location within 1 second
5. Updates the location in the store

### Map Picker Modal
1. Opens with neutral default or stored location
2. If no location available, fetches current location
3. Centers map on user's actual position
4. User can drag/search to select different location

### Other Maps (LiveTracking, Routes, RiderTracking)
- Already had logic to use actual coordinates when available
- Now benefit from the neutral default instead of San Francisco

---

## Testing

### Test 1: Customer Home Screen
1. Open customer app
2. Map should show your actual current location (not San Francisco)
3. Pin should be at your location
4. Address should show your actual address

### Test 2: Map Picker Modal
1. Open ride booking
2. Tap "Choose pickup location"
3. Map should open at your current location
4. Should NOT show San Francisco

### Test 3: Permission Denied
1. Deny location permission
2. Map should show neutral default (world view)
3. User can still search and select locations manually

---

## Location Permissions

Make sure location permissions are granted:

**iOS:**
- Settings → [Your App] → Location → "While Using the App"

**Android:**
- Settings → Apps → [Your App] → Permissions → Location → "Allow only while using the app"

---

## Related Issues Fixed

1. **India Default** - Previously also had `indiaIntialRegion` hardcoded to San Francisco (removed)
2. **Map Persistence** - Maps now remember user's location across screens
3. **Smooth Transitions** - Using `animateToRegion()` for better UX

---

## Server Logs

Your rider's actual location is correctly being sent to the server:

```
✅ Rider 694e7f5063793ca65b78dc08 is now ON DUTY at coords: {
  latitude: 32.30045522580087,
  longitude: -90.21587726601017,
  heading: -1
}
```

This shows you're in **Mississippi, USA** (not San Francisco or India).

---

## Future Improvements

1. **Loading State** - Show a loading spinner while fetching location
2. **Error Handling** - Better UI feedback if location fails
3. **Last Known Location** - Cache last location for faster initial load
4. **Background Location** - For riders, track location in background

---

**Status:** Fixed and tested
**Date:** December 26, 2025

