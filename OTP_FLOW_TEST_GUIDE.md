# OTP Flow Testing Guide

## 🧪 How to Test the OTP Verification Flow

### Prerequisites
- Server running on `http://localhost:3000`
- Client app running on mobile device or simulator
- Two test accounts: one as **Passenger** and one as **Driver**

---

## Step-by-Step Testing

### 1. **Passenger Creates a Ride**

**As Passenger:**
1. Open the app and login as a **customer**
2. Navigate to home screen
3. Tap "Where are you going?"
4. Select pickup and drop-off locations
5. Choose a vehicle type (Bike, Cab Economy, etc.)
6. Enter your price offer
7. Tap "Propose Price & Find Drivers"

**Expected Result:**
- Ride is created with status: `SEARCHING_FOR_RIDER`
- A 4-digit OTP is generated (e.g., "3847")
- Ride is broadcast to nearby drivers

---

### 2. **Driver Accepts the Ride**

**As Driver:**
1. Open the app and login as a **rider**
2. Make sure you're **ON-DUTY** (toggle in header)
3. You should see incoming ride offers
4. Tap "Accept" on one of the ride offers (within 12 seconds)

**Expected Result:**
- Ride status changes to: `START`
- Driver is navigated to live ride screen
- Driver can see customer details and pickup location

---

### 3. **Passenger Sees OTP** ✨

**As Passenger:**
1. After driver accepts, you'll see driver profile card
2. Look at the ride status area
3. **You should see:** `"OTP: 3847"` (or whatever 4-digit code was generated)

**Check:**
```
✓ Status shows "Driver is on the way"
✓ OTP is clearly displayed (e.g., "OTP: 3847")
✓ Driver profile with rating is visible
```

**If OTP is NOT showing:**
- Check ride status is "START" (not "SEARCHING_FOR_RIDER")
- Refresh the ride data
- Check server logs for OTP generation

---

### 4. **Driver Navigates to Pickup**

**As Driver:**
1. On the live ride screen, you'll see pickup and drop-off locations
2. Optionally use navigation assist (Google Maps/Waze)
3. When you arrive at pickup location, tap the **"ARRIVED"** button

**Expected Result:**
- OTP input modal opens
- Modal shows 4 input boxes for digits
- Title: "Enter OTP Below"

---

### 5. **Driver Enters OTP** 🔐

**As Driver:**
1. Ask passenger: "What's your OTP?"
2. Passenger tells you: "3847"
3. Enter the 4 digits in the modal
4. Tap "Confirm"

**Expected Result if CORRECT:**
- Alert: "Success" or no error
- Ride status changes to: `ARRIVED`
- Modal closes
- Button now shows "COMPLETED"
- Trip can begin

**Expected Result if WRONG:**
- Alert: "Wrong OTP"
- Modal stays open
- Can try again

---

### 6. **Complete the Trip**

**As Driver:**
1. After OTP verification, drive to drop-off location
2. When arrived, tap **"COMPLETED"** button

**Expected Result:**
- Ride status changes to: `COMPLETED`
- Rating modal appears (if implemented)
- Driver returns to home screen
- Earnings are updated

**As Passenger:**
- Rating modal appears
- Can rate the driver
- Trip is completed

---

## 🐛 Troubleshooting

### Issue 1: OTP Not Showing for Passenger

**Symptoms:**
- Passenger screen doesn't display OTP
- Shows blank or undefined

**Possible Causes:**
1. Ride status is not "START"
2. OTP not generated on server
3. Ride data not populated correctly

**Fix:**
```javascript
// Check in LiveTrackingSheet.tsx line 65:
{item?.status === "START" ? `OTP: ${item?.otp}` : ...}

// Verify ride object has:
console.log("Ride status:", item?.status);
console.log("OTP:", item?.otp);
```

---

### Issue 2: Driver Can't Open OTP Modal

**Symptoms:**
- Clicking "ARRIVED" doesn't open modal
- No response when tapping button

**Possible Causes:**
1. Ride status is not "START"
2. Modal visibility state issue

**Fix:**
```javascript
// Check in rider/liveride.tsx line 142:
if (rideData?.status === "START") {
  setOtpModalVisible(true);
}

// Verify:
console.log("Current ride status:", rideData?.status);
```

---

### Issue 3: OTP Verification Always Fails

**Symptoms:**
- Always shows "Wrong OTP" even with correct code
- Never proceeds to ARRIVED status

**Possible Causes:**
1. OTP type mismatch (string vs number)
2. Extra spaces in OTP
3. Case sensitivity

**Fix:**
```javascript
// Check in rider/liveride.tsx line 162:
if (otp === rideData?.otp) {
  // Should work
}

// Debug:
console.log("Entered OTP:", otp, typeof otp);
console.log("Expected OTP:", rideData?.otp, typeof rideData?.otp);
```

---

### Issue 4: Status Not Updating After OTP

**Symptoms:**
- OTP is correct but status stays "START"
- No transition to "ARRIVED"

**Possible Causes:**
1. `updateRideStatus` API call failing
2. Socket not emitting update
3. Server error

**Fix:**
```javascript
// Check server logs for:
// "Ride status updated to ARRIVED"

// Check if updateRideStatus returns success:
const isSuccess = await updateRideStatus(rideData?._id, "ARRIVED");
console.log("Update success:", isSuccess);
```

---

## 📋 Test Checklist

Use this checklist to verify the complete flow:

### Passenger Side
- [ ] OTP is generated when ride is created
- [ ] OTP is visible on screen when status is "START"
- [ ] OTP displays as "OTP: XXXX" format
- [ ] OTP persists through screen refreshes
- [ ] Can see driver approaching in real-time

### Driver Side
- [ ] Can accept ride and status changes to "START"
- [ ] "ARRIVED" button is visible when status is "START"
- [ ] Clicking "ARRIVED" opens OTP modal
- [ ] Modal has 4 input boxes for digits
- [ ] Can enter numbers only (keyboard is numeric)
- [ ] Auto-focuses next input after entering digit
- [ ] "Confirm" button works
- [ ] Correct OTP changes status to "ARRIVED"
- [ ] Wrong OTP shows error alert
- [ ] Modal closes after successful verification

### Server Side
- [ ] OTP is 4 digits (1000-9999)
- [ ] OTP is stored in ride document
- [ ] OTP is included in ride response
- [ ] Status transitions: SEARCHING → START → ARRIVED → COMPLETED
- [ ] Timestamps are recorded (arrivedAt, completedAt)
- [ ] Socket events broadcast status changes

---

## 🔍 Server Logs to Monitor

```bash
# Watch server logs:
tail -f /tmp/server.log

# Look for:
"Ride created with OTP: 3847"
"Rider accepted ride"
"Ride status updated to ARRIVED"
"Ride status updated to COMPLETED"
```

---

## 🎯 Expected Console Logs

### When Ride Created:
```javascript
// Server
console.log(`OTP generated: ${otp}`);
// Output: OTP generated: 3847
```

### When Driver Arrives:
```javascript
// Client (Driver)
console.log(`Showing OTP modal for ride: ${rideData._id}`);
```

### When OTP Entered:
```javascript
// Client (Driver)
console.log(`Verifying OTP: ${enteredOTP} === ${rideData.otp}`);
// Output: Verifying OTP: 3847 === 3847
```

### When Status Updates:
```javascript
// Server
console.log(`Ride ${rideId} status updated to ${status}`);
// Output: Ride 507f1f77bcf86cd799439011 status updated to ARRIVED
```

---

## 📱 Real-World Testing Scenario

### Uber-Style Testing:

1. **Passenger (Alice):**
   - Opens app
   - Requests ride from "123 Main St" to "456 Park Ave"
   - Sees: "Looking for your bike ride"
   
2. **Driver (Bob):**
   - Sees ride offer: $8.50, 2.3 km away
   - Accepts within 12 seconds
   
3. **Passenger (Alice):**
   - Sees: "Driver Bob is on the way"
   - Sees: **"OTP: 7452"**
   - Waits for driver to arrive
   
4. **Driver (Bob):**
   - Navigates to pickup location
   - Arrives and taps "ARRIVED"
   - Modal opens
   - Asks Alice: "What's your OTP?"
   
5. **Passenger (Alice):**
   - Says: "7-4-5-2"
   
6. **Driver (Bob):**
   - Enters: 7 → 4 → 5 → 2
   - Taps "Confirm"
   - ✅ Success! Status → ARRIVED
   - Alice gets in the vehicle
   
7. **Driver (Bob):**
   - Drives to destination
   - Taps "COMPLETED"
   - Rates Alice
   
8. **Passenger (Alice):**
   - Rates Bob
   - Trip complete!

---

## 🎨 UI Verification

### Passenger Screen (Status: START)
```
┌────────────────────────────┐
│   Driver Bob is on the way │
│        OTP: 3847           │  ← SHOULD BE VISIBLE
│                            │
│  ⭐ 4.8 (234 rides)        │
│  [Call] [Message]          │
└────────────────────────────┘
```

### Driver Screen (Status: START)
```
┌────────────────────────────┐
│   Meet the Customer        │
│   +91 98765 43210          │
│                            │
│  📍 Pickup: 123 Main St    │
│  🏁 Drop: 456 Park Ave     │
│                            │
│  [Swipe to ARRIVED] →      │  ← TAP HERE
└────────────────────────────┘
```

### OTP Modal (Driver)
```
┌────────────────────────────┐
│    Enter OTP Below         │
│                            │
│   [_] [_] [_] [_]          │  ← 4 BOXES
│                            │
│      [Confirm]             │
└────────────────────────────┘
```

---

## ✅ Success Criteria

The OTP flow is working correctly when:

1. ✓ Passenger sees 4-digit OTP clearly displayed
2. ✓ Driver can open OTP modal by clicking "ARRIVED"
3. ✓ Correct OTP verification succeeds
4. ✓ Wrong OTP shows error and allows retry
5. ✓ Status transitions properly: START → ARRIVED
6. ✓ Timestamps are recorded
7. ✓ Both apps update in real-time
8. ✓ Trip can proceed after verification

---

## 🚀 Next Steps After Testing

If OTP flow works:
- ✅ Test with multiple simultaneous rides
- ✅ Test network disconnection scenarios
- ✅ Test with very slow connections
- ✅ Add analytics/logging for OTP failures
- ✅ Consider adding OTP expiry (optional)

---

**Last Updated:** December 26, 2025
**Status:** Fixed timestamp updates in updateRideStatus

