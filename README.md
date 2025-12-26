# 🚗 RIDE - Full-Stack Rideshare Platform

A modern, real-time rideshare application built with React Native (Expo) and Node.js, featuring live tracking, KYC verification, and dynamic earnings for drivers.

## 📱 Overview

RIDE is a comprehensive rideshare platform that connects passengers with drivers in real-time. The app features separate interfaces for customers and drivers, with real-time location tracking, bidding system, KYC verification for drivers, and dynamic earnings calculation.

## ✨ Key Features

### For Customers
- 📍 **Real-time Location Tracking** - Track your driver's location in real-time on the map
- 🗺️ **Smart Route Planning** - Select pickup and drop locations with autocomplete
- 💰 **Transparent Pricing** - See estimated fares before booking
- 🚖 **Multiple Vehicle Options** - Choose from bikes, economy cabs, and premium cabs
- 🔔 **Live Ride Updates** - Get notified about ride status changes
- 📱 **OTP Verification** - Secure ride confirmation with OTP
- 💳 **Cash Payment** - Simple cash payment system

### For Drivers/Riders
- ✅ **KYC Verification** - Mandatory identity verification before accepting rides
  - Upload ID documents (National ID, Passport, Driver's License)
  - Submit personal information
  - Status tracking (Pending, Submitted, Approved, Rejected)
- 💵 **Dynamic Earnings Tracking** - Real-time earnings calculation (80% to driver, 20% platform fee)
- 🎯 **Smart Ride Matching** - Receive ride offers within 60km radius
- 📊 **Statistics Dashboard** - Track total rides, completed rides, and ratings
- 🔄 **On/Off Duty Toggle** - Control availability status
- 📍 **Live Location Broadcasting** - Automatic location updates every 10 seconds
- ⏱️ **Time-Limited Offers** - 12-second countdown for ride acceptance

### Real-time Features
- 🌐 **WebSocket Integration** - Instant bidirectional communication
- 🗺️ **Live Map Updates** - Real-time driver location on customer's map
- 🔄 **Automatic Retries** - Smart retry mechanism for finding drivers
- 📡 **Connection Management** - Automatic reconnection handling

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React Native with Expo SDK 52
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Maps**: React Native Maps with Google Maps
- **Real-time**: Socket.io Client
- **Authentication**: Firebase Phone Authentication
- **HTTP Client**: Axios
- **UI Components**: Custom components with React Native
- **Image Handling**: Expo Image Picker
- **Styling**: React Native StyleSheet with responsive design

### Backend (Server)
- **Runtime**: Node.js v20+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io Server
- **Authentication**: JWT + Firebase Admin SDK
- **Security**: bcryptjs, http-status-codes
- **Environment**: dotenv
- **Development**: Nodemon

### Key Libraries
- **geolib** - Distance calculations and geospatial operations
- **react-native-reanimated** - Smooth animations
- **@gorhom/bottom-sheet** - Bottom sheet components
- **expo-location** - Location services

## 📁 Project Structure

```
RIDE/
├── client/                    # React Native mobile app
│   ├── src/
│   │   ├── app/              # Expo Router pages
│   │   │   ├── customer/     # Customer-side screens
│   │   │   ├── rider/        # Driver-side screens
│   │   │   ├── auth/         # Authentication screens
│   │   │   └── _layout.tsx   # Root layout
│   │   ├── components/       # Reusable components
│   │   │   ├── customer/     # Customer components
│   │   │   ├── rider/        # Rider components
│   │   │   └── shared/       # Shared components
│   │   ├── service/          # API services & WebSocket
│   │   ├── store/            # Zustand stores
│   │   ├── styles/           # Style definitions
│   │   ├── utils/            # Utility functions
│   │   └── assets/           # Images, icons, fonts
│   ├── app.json              # Expo configuration
│   └── package.json
│
└── server/                    # Node.js backend
    ├── controllers/          # Route controllers
    │   ├── auth.js          # Authentication logic
    │   ├── ride.js          # Ride management
    │   ├── kyc.js           # KYC verification
    │   └── sockets.js       # WebSocket handlers
    ├── middleware/          # Express middleware
    │   ├── authentication.js
    │   └── error-handler.js
    ├── models/              # MongoDB schemas
    │   ├── User.js
    │   └── Ride.js
    ├── routes/              # API routes
    ├── utils/               # Helper functions
    ├── app.js               # Express app setup
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js v20 or higher
- MongoDB (local or Atlas)
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator
- Firebase project with Phone Authentication enabled
- Google Maps API key

### Environment Setup

#### Server (.env)
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/rideshare
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
JWT_LIFETIME=4d
JWT_REFRESH_LIFETIME=30d
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY="your_firebase_private_key"
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
```

#### Client
Create `client/src/service/config.ts`:
```typescript
export const BASE_URL = "http://YOUR_IP:3000"; // Use your local IP
export const GOOGLE_MAPS_API_KEY = "your_google_maps_api_key";
```

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/Marlvin12/rideshare.git
cd rideshare
```

#### 2. Install Server Dependencies
```bash
cd server
npm install
```

#### 3. Install Client Dependencies
```bash
cd ../client
npm install
```

#### 4. Start MongoDB
```bash
# If using local MongoDB
mongod
```

#### 5. Start the Server
```bash
cd server
npm start
# Server runs on http://localhost:3000
```

#### 6. Start the Client
```bash
cd client
npm start
# Choose iOS/Android simulator or scan QR code
```

## 🔐 Authentication Flow

1. **Phone Number Entry** - User enters phone number
2. **OTP Verification** - Firebase sends OTP via SMS
3. **Role Selection** - User selects Customer or Rider role
4. **JWT Token Generation** - Server generates access & refresh tokens
5. **Automatic Navigation** - Users are redirected based on role and KYC status

### KYC Verification Flow (Riders Only)

1. **Initial Login** - New riders are redirected to KYC screen
2. **Document Upload** - Upload ID front/back images (base64)
3. **Information Submission** - Full name, DOB, address, ID number
4. **Status Tracking**:
   - **Pending** → Awaiting submission
   - **Submitted** → Under review (24-48 hours)
   - **Approved** → Can accept rides
   - **Rejected** → Must resubmit
5. **Access Control** - Only approved riders can go online and accept rides

## 📊 Database Schema

### User Model
```javascript
{
  role: "customer" | "rider",
  phone: String,
  firebaseUid: String,
  kyc: {
    status: "pending" | "submitted" | "approved" | "rejected",
    idType: "national_id" | "passport" | "drivers_license",
    idNumber: String,
    fullName: String,
    dateOfBirth: String,
    address: String,
    idFrontImage: String (base64),
    idBackImage: String (base64),
    submittedAt: Date,
    reviewedAt: Date,
    rejectionReason: String
  },
  earnings: {
    total: Number,
    available: Number,
    pendingWithdrawal: Number
  },
  stats: {
    totalRides: Number,
    completedRides: Number,
    cancelledRides: Number,
    rating: Number,
    totalRatings: Number
  }
}
```

### Ride Model
```javascript
{
  vehicle: "bike" | "human" | "cabEconomy" | "cabPremium",
  distance: Number,
  fare: Number,
  proposedPrice: Number,
  suggestedPriceRange: { min: Number, max: Number },
  pricingModel: "fixed" | "bidding",
  pickup: { address: String, latitude: Number, longitude: Number },
  drop: { address: String, latitude: Number, longitude: Number },
  customer: ObjectId,
  rider: ObjectId,
  status: "AWAITING_OFFERS" | "SEARCHING_FOR_RIDER" | "START" | "ARRIVED" | "COMPLETED",
  otp: String,
  offers: [{
    riderId: ObjectId,
    offeredPrice: Number,
    message: String,
    status: "pending" | "accepted" | "rejected"
  }],
  acceptedOffer: {
    riderId: ObjectId,
    finalPrice: Number
  }
}
```

## 🔄 Real-time Communication

### WebSocket Events

#### Customer Events
- `subscribeToZone` - Subscribe to nearby riders
- `searchrider` - Start searching for a rider
- `cancelRide` - Cancel active ride
- `subscribeRide` - Subscribe to ride updates
- `subscribeToriderLocation` - Track rider location

#### Rider Events
- `subscribeRider` - Register rider online
- `onOffDuty` - Toggle availability
- `updateLocation` - Update rider location
- `rideOffer` - Receive ride offers
- `rideAccepted` - Ride accepted confirmation

#### Server Events
- `rideData` - Initial ride information
- `rideUpdate` - Ride status changes
- `rideCanceled` - Ride cancellation
- `riderLocationUpdate` - Rider location updates
- `nearbyriders` - List of nearby available riders
- `error` - Error messages

## 💰 Earnings Calculation

```javascript
Platform Fee: 20%
Driver Share: 80%

Example:
Ride Fare: $10.00
Driver Earnings: $8.00
Platform Fee: $2.00
```

Earnings are automatically updated upon ride completion and stored in the rider's profile.

## 🌍 Production Roadmap

### Phase 1: MVP Enhancement (1-2 months)
- [ ] **Enhanced KYC System**
  - Integration with third-party ID verification APIs (Onfido, Jumio)
  - Facial recognition matching
  - Background check integration
  - Automated approval workflow
  
- [ ] **Payment Integration**
  - Stripe/PayPal integration
  - In-app wallet system
  - Multiple payment methods (cards, mobile money)
  - Automated payouts to drivers
  - Transaction history and receipts

- [ ] **Advanced Booking**
  - Schedule rides in advance
  - Recurring ride bookings
  - Ride for someone else
  - Multi-stop rides

- [ ] **Rating & Review System**
  - Post-ride ratings (1-5 stars)
  - Written reviews
  - Driver and passenger ratings
  - Reputation-based matching

### Phase 2: Scale & Reliability (2-4 months)
- [ ] **Backend Scalability**
  - Microservices architecture migration
  - Redis for caching and session management
  - RabbitMQ/Kafka for message queuing
  - Database sharding and replication
  - Load balancing with Nginx/HAProxy
  - CDN integration for static assets

- [ ] **Performance Optimization**
  - Query optimization and indexing
  - Connection pooling
  - API rate limiting
  - Response compression (gzip)
  - Lazy loading and pagination
  - Image optimization and compression

- [ ] **Infrastructure**
  - Docker containerization
  - Kubernetes orchestration
  - CI/CD pipeline (GitHub Actions)
  - Automated testing suite
  - Blue-green deployments
  - Auto-scaling configuration

- [ ] **Monitoring & Observability**
  - Application Performance Monitoring (New Relic, DataDog)
  - Error tracking (Sentry)
  - Log aggregation (ELK Stack)
  - Real-time dashboards
  - Alerting system

### Phase 3: Advanced Features (4-6 months)
- [ ] **Safety & Security**
  - SOS/Emergency button
  - Real-time ride sharing with contacts
  - In-app calling (masked numbers)
  - Ride recording/audio
  - Safety center and resources
  - 24/7 support hotline

- [ ] **Smart Matching Algorithm**
  - ML-based ride matching
  - Predictive pricing
  - Dynamic routing optimization
  - Surge pricing during high demand
  - Rider preference learning

- [ ] **Notifications**
  - Push notifications (Expo Notifications)
  - SMS notifications
  - Email notifications
  - Real-time alerts
  - Promotional notifications

- [ ] **Analytics Dashboard**
  - Admin panel for monitoring
  - Revenue analytics
  - User behavior tracking
  - Heat maps for demand
  - Performance metrics

### Phase 4: Market Expansion (6-12 months)
- [ ] **Multi-language Support**
  - i18n implementation
  - RTL language support
  - Localized content
  - Currency conversion

- [ ] **Multi-region Support**
  - Geographic database partitioning
  - Regional pricing models
  - Local payment methods
  - Compliance with regional laws

- [ ] **Business Features**
  - Corporate accounts
  - Ride vouchers and promos
  - Referral program
  - Loyalty rewards
  - Bulk booking API

- [ ] **Driver Features**
  - Driver analytics dashboard
  - Weekly earnings summary
  - Tax documentation
  - Performance insights
  - Training modules

### Phase 5: Scale to Millions (12+ months)
- [ ] **Infrastructure for Scale**
  - Multi-region deployment (AWS/GCP/Azure)
  - Global CDN (CloudFlare)
  - Database clusters across regions
  - Real-time data replication
  - Edge computing for location services
  - Serverless functions for peak loads

- [ ] **Advanced Matching at Scale**
  - Geo-spatial indexing optimization
  - Sub-second matching algorithms
  - Predictive demand forecasting
  - AI-powered route optimization
  - Dynamic driver allocation

- [ ] **Financial Infrastructure**
  - Multi-currency support
  - International payment gateways
  - Fraud detection system
  - Automated tax calculations
  - Financial reporting and compliance

- [ ] **Regulatory Compliance**
  - GDPR compliance
  - Data privacy regulations
  - Insurance integration
  - Background check automation
  - Legal document management

- [ ] **Quality Assurance**
  - Automated end-to-end testing
  - Load testing (10k+ concurrent users)
  - Security audits and penetration testing
  - Performance benchmarking
  - Disaster recovery planning

## 🏗️ Architecture for Scale

### Current Architecture
```
[Mobile Apps] ← WebSocket/HTTP → [Node.js Server] ← → [MongoDB]
```

### Production Architecture (Target)
```
                    [CloudFlare CDN]
                           ↓
[Mobile Apps] ← → [Load Balancer (Nginx)]
                           ↓
                 ┌─────────┴─────────┐
                 ↓                   ↓
          [API Gateway]      [WebSocket Servers]
                 ↓                   ↓
        ┌────────┼────────┐         ↓
        ↓        ↓        ↓         ↓
   [Auth      [Rides  [Payment]  [Location
   Service]   Service] Service]   Service]
        ↓        ↓        ↓         ↓
        └────────┼────────┴─────────┘
                 ↓
          [Message Queue - Kafka]
                 ↓
        ┌────────┼────────┐
        ↓        ↓        ↓
   [MongoDB]  [Redis]  [PostgreSQL]
   (Rides)    (Cache)  (Payments)
        ↓        ↓        ↓
   [Replicas] [Cluster] [Backups]
```

### Key Scalability Strategies

1. **Horizontal Scaling**
   - Stateless microservices
   - Container orchestration (Kubernetes)
   - Auto-scaling based on metrics

2. **Database Optimization**
   - Read replicas for queries
   - Write master for transactions
   - Sharding by geographic region
   - Caching frequently accessed data

3. **Real-time at Scale**
   - Separate WebSocket server cluster
   - Redis pub/sub for message distribution
   - Connection pooling
   - Efficient broadcast algorithms

4. **Geographic Distribution**
   - Regional data centers
   - Location-based routing
   - Data residency compliance
   - Reduced latency

## 🧪 Testing Strategy

### Current Status
- Manual testing of core features

### Production Testing Plan
```bash
# Unit Tests
npm run test:unit

# Integration Tests
npm run test:integration

# E2E Tests
npm run test:e2e

# Load Tests
npm run test:load
```

**Target Coverage**: 80%+ for critical paths

## 📈 Performance Benchmarks

### Current Targets
- API Response: < 200ms (p95)
- WebSocket Latency: < 100ms
- Database Queries: < 50ms
- Map Loading: < 2s

### Production Targets (at 1M users)
- API Response: < 100ms (p95)
- WebSocket Latency: < 50ms
- Concurrent Connections: 100k+
- Requests/sec: 10k+
- Uptime: 99.9%

## 🔒 Security Considerations

### Implemented
- JWT authentication with refresh tokens
- Firebase phone verification
- MongoDB injection protection
- CORS configuration
- Environment variable protection

### Production Requirements
- [ ] HTTPS/TLS encryption
- [ ] API rate limiting per user
- [ ] DDoS protection
- [ ] Input sanitization
- [ ] SQL/NoSQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Regular security audits
- [ ] Encrypted data at rest
- [ ] PCI DSS compliance (for payments)

## 📱 App Store Deployment

### iOS App Store
- [ ] Apple Developer Account
- [ ] App Store Connect setup
- [ ] TestFlight beta testing
- [ ] App Store submission
- [ ] Privacy policy and terms

### Google Play Store
- [ ] Google Play Developer Account
- [ ] Internal testing track
- [ ] Beta release
- [ ] Production release
- [ ] Store listing optimization

## 💡 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Malvin** - Initial work - [Marlvin12](https://github.com/Marlvin12)

## 🙏 Acknowledgments

- React Native and Expo teams
- Socket.io for real-time communication
- MongoDB for database solution
- Firebase for authentication
- Google Maps for mapping services

## 📞 Support

For support, email support@rideshare.app or join our Slack channel.

## 🗺️ Roadmap Summary

- **Q1 2025**: MVP with KYC, payments, and ratings
- **Q2 2025**: Scale infrastructure to 10k concurrent users
- **Q3 2025**: Advanced safety features and analytics
- **Q4 2025**: Multi-region expansion
- **2026+**: Scale to 1M+ users across multiple countries

---

**Built with ❤️ for the future of transportation**
