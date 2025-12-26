# Uber-Style Pricing Algorithm Implementation

## Overview
This app now implements a comprehensive pricing algorithm similar to Uber's dynamic pricing model.

## Pricing Components

### 1. Base Fare
A flat fee charged at the beginning of every ride, varying by vehicle type.

### 2. Cost per Minute
Charges based on the estimated duration of the ride, calculated from distance and average city speed (25 km/h).

### 3. Cost per Kilometer
Charges based on the actual distance traveled.

### 4. Booking Fee
A flat operational fee covering platform costs.

### 5. Surge Multiplier (Dynamic Pricing)
Applied during high-demand periods to balance supply and demand.

## Pricing Formula

```
Standard Fare = Base Fare + (Cost per Minute × Estimated Time) + (Cost per Km × Distance) + Booking Fee
Final Fare = Standard Fare × Surge Multiplier
Total Fare = max(Final Fare, Minimum Fare)
```

## Rate Structure

### Bike
- Base Fare: $2.00
- Cost per Minute: $0.15
- Cost per Km: $0.80
- Booking Fee: $1.50
- Minimum Fare: $5.00

### Human Delivery
- Base Fare: $3.00
- Cost per Minute: $0.20
- Cost per Km: $1.00
- Booking Fee: $2.00
- Minimum Fare: $7.00

### Cab Economy
- Base Fare: $4.00
- Cost per Minute: $0.30
- Cost per Km: $1.50
- Booking Fee: $2.50
- Minimum Fare: $10.00

### Cab Premium
- Base Fare: $6.00
- Cost per Minute: $0.50
- Cost per Km: $2.50
- Booking Fee: $3.50
- Minimum Fare: $15.00

## Time Estimation

Ride time is estimated based on distance and average city speed:
- Average City Speed: 25 km/h
- Formula: `Time (minutes) = (Distance in km / 25) × 60`

## Surge Pricing Algorithm

### Surge Multiplier Calculation

The surge multiplier is determined by:

1. **Demand-Supply Ratio**
   - Ratio = Active Rides / Available Riders
   - Ratio > 3.0: 2.5x surge
   - Ratio > 2.0: 2.0x surge
   - Ratio > 1.5: 1.5x surge
   - Ratio > 1.0: 1.3x surge
   - Ratio ≤ 1.0: 1.0x (no surge)

2. **Peak Hour Factor**
   - Morning Peak: 7:00 AM - 9:00 AM
   - Evening Peak: 5:00 PM - 7:00 PM
   - Minimum 1.2x multiplier during peak hours

3. **Special Cases**
   - No available riders: 2.0x surge (encourages riders to go online)

### Surge Display
- When surge > 1.0x: Red alert banner shows multiplier
- When surge = 1.0x: Standard offer banner displays

## Example Calculation

### Scenario: 5 km Cab Economy ride during normal hours

**Inputs:**
- Distance: 5 km
- Vehicle: Cab Economy
- Surge Multiplier: 1.0 (normal demand)

**Calculation:**
1. Estimated Time: (5 / 25) × 60 = 12 minutes
2. Standard Fare:
   - Base Fare: $4.00
   - Time Cost: 12 × $0.30 = $3.60
   - Distance Cost: 5 × $1.50 = $7.50
   - Booking Fee: $2.50
   - **Subtotal: $17.60**
3. Apply Surge: $17.60 × 1.0 = $17.60
4. Check Minimum: max($17.60, $10.00) = **$17.60**

**Final Fare: $17.60**

### Scenario: Same ride during high demand (2.0x surge)

**Calculation:**
1. Standard Fare: $17.60 (same as above)
2. Apply Surge: $17.60 × 2.0 = $35.20
3. Check Minimum: max($35.20, $10.00) = **$35.20**

**Final Fare: $35.20**

## API Usage

### Server-side (Node.js)

```javascript
import { calculateFare, calculateSurgeMultiplier } from './utils/mapUtils.js';

const distance = 5.2;
const activeRides = 45;
const availableRiders = 20;

const surgeMultiplier = calculateSurgeMultiplier(activeRides, availableRiders);

const fareBreakdown = calculateFare(distance, surgeMultiplier);

console.log('Bike Fare:', fareBreakdown.bike);
console.log('Estimated Time:', fareBreakdown.estimatedTime, 'minutes');
console.log('Surge Multiplier:', fareBreakdown.surgeMultiplier);
```

### Client-side (React Native/TypeScript)

```typescript
import { calculateFare, calculateSurgeMultiplier } from '@/utils/mapUtils';

const distance: number = 5.2;
const surgeMultiplier: number = calculateSurgeMultiplier(45, 20);

const fareBreakdown = calculateFare(distance, surgeMultiplier);

console.log(`Cab Economy: $${fareBreakdown.cabEconomy.toFixed(2)}`);
console.log(`ETA: ${fareBreakdown.estimatedTime} min`);
```

## Benefits of This Implementation

1. **Fair Pricing**: Considers both distance and time
2. **Dynamic Adjustment**: Surge pricing balances supply and demand
3. **Transparent**: Users see exact multiplier during surge
4. **Flexible**: Easy to adjust rates per vehicle type
5. **Scalable**: Works for any distance or demand level

## Future Enhancements

1. **Real-time Traffic Integration**: Adjust time estimates based on actual traffic
2. **Weather Factor**: Apply multiplier during adverse weather
3. **Special Events**: Detect nearby events and adjust pricing
4. **Historical Data**: Use past ride data to predict demand
5. **Route Optimization**: Calculate fares based on optimal route
6. **Toll Integration**: Add toll fees to total fare
7. **Promotional Pricing**: Apply discounts and promo codes
8. **Machine Learning**: Predict optimal surge multiplier

## Implementation Notes

- The algorithm ensures minimum fare is always met
- Surge multiplier is rounded to 1 decimal place for clarity
- Time estimation uses average city speed; can be enhanced with real-time data
- All prices are in USD but can be easily converted to any currency

