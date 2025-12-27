# RIDE Admin Dashboard Setup Guide

## Overview

The admin dashboard is a comprehensive web-based management portal for the RIDE rideshare platform. It provides full control over users, rides, KYC verification, and financial tracking.

## Features

### 1. Dashboard Analytics
- **Real-time Metrics**: Total users, active rides, revenue, pending KYC
- **Charts**: Rides over time, revenue breakdown
- **Quick Stats**: Riders, customers, completed rides, platform fees

### 2. User Management
- **View All Users**: Customers and riders with detailed information
- **Filter by Role**: Customer, rider, or all
- **Search**: By phone number or full name
- **User Details**:
  - KYC status
  - Total rides
  - Ratings (for riders)
  - Earnings (for riders)
  - Join date

### 3. KYC Management (Priority Feature)
- **Review Submissions**: See all pending KYC verifications
- **View Documents**: 
  - ID front image
  - ID back image (if provided)
  - Full document viewer in new window
- **Approve/Reject**:
  - One-click approval
  - Rejection with mandatory reason
- **Filter by Status**: Submitted, approved, rejected, pending
- **Track Details**:
  - Full name
  - ID type (National ID, Passport, Driver's License)
  - ID number
  - Date of birth
  - Address
  - Submission date

### 4. Ride Monitoring
- **View All Rides**: Past and active rides
- **Filter by Status**:
  - AWAITING_OFFERS
  - SEARCHING_FOR_RIDER
  - START (accepted)
  - ARRIVED
  - COMPLETED
- **Ride Details**:
  - Vehicle type
  - Pickup and drop locations
  - Distance and fare
  - Pricing model (fixed/bidding)
  - Customer and rider info
  - Bidding offers (if applicable)

### 5. Financial Dashboard
- **Revenue Tracking**:
  - Total revenue
  - Platform fees (20%)
  - Rider earnings (80%)
- **Charts**:
  - Monthly revenue trend
  - Revenue by vehicle type (pie chart)
- **Transactions Table**:
  - Date, ride ID, vehicle
  - Total fare breakdown
  - Platform fee and rider earning per transaction

## Installation

### 1. Navigate to Admin Dashboard

```bash
cd /Users/malvin/Desktop/RIDE/admin-web
```

### 2. Install Dependencies (Already Done)

```bash
npm install
```

### 3. Configure Backend URL

The dashboard is already configured to connect to `http://localhost:3000`.

If your backend runs on a different port or host, update `/Users/malvin/Desktop/RIDE/admin-web/src/config.js`:

```javascript
export const API_URL = "http://YOUR_IP:YOUR_PORT";
export const WS_URL = "http://YOUR_IP:YOUR_PORT";
```

## Running the Admin Dashboard

### Start the Backend Server First

```bash
cd /Users/malvin/Desktop/RIDE/server
npm start
```

The server should be running on http://localhost:3000

### Start the Admin Dashboard

Open a new terminal:

```bash
cd /Users/malvin/Desktop/RIDE/admin-web
npm run dev
```

The admin dashboard will be available at: **http://localhost:5173**

## Login Credentials

### Default Admin Account

- **Email**: `admin@ride.com`
- **Password**: `admin123`

The default admin account is automatically created on first login.

## Backend API Endpoints

The following endpoints have been added to your server:

### Admin Authentication
- `POST /admin/login` - Admin login

### Dashboard
- `GET /admin/dashboard` - Get dashboard statistics and charts

### Users
- `GET /admin/users?role={role}` - Get all users (role: all, customer, rider)

### Rides
- `GET /admin/rides?status={status}` - Get all rides with filters

### KYC
- `GET /admin/kyc?status={status}` - Get KYC submissions
- `POST /kyc/approve` - Approve KYC (body: { userId })
- `POST /kyc/reject` - Reject KYC (body: { userId, reason })

### Financials
- `GET /admin/financials` - Get financial data and charts

## Server Files Added

### Models
- `/server/models/Admin.js` - Admin user model

### Middleware
- `/server/middleware/adminAuth.js` - JWT authentication for admin routes

### Controllers
- `/server/controllers/admin.js` - Admin business logic

### Routes
- `/server/routes/admin.js` - Admin API routes

### Updated Files
- `/server/app.js` - Added admin router

## Usage Guide

### 1. Access the Dashboard

1. Start the backend server
2. Start the admin dashboard
3. Navigate to http://localhost:5173
4. Login with default credentials

### 2. Monitor Platform Activity

**Dashboard View**:
- See key metrics at a glance
- Monitor active rides
- Track pending KYC submissions
- View revenue trends

### 3. Manage KYC Verifications

**Navigate to KYC Management**:
1. Click "KYC Management" in sidebar
2. Filter by "submitted" to see pending verifications
3. Click on a submission to review:
   - Click "View Front ID" to see ID document
   - Click "View Back ID" (if available)
   - Review all personal information
4. **To Approve**:
   - Click "Approve" button
   - Rider will be notified and can start accepting rides
5. **To Reject**:
   - Click "Reject" button
   - Enter rejection reason
   - Click "Confirm Reject"
   - Rider will be notified with the reason

### 4. View Users

**Navigate to Users**:
1. Click "Users" in sidebar
2. Use filters:
   - All: Show all users
   - Customer: Show only customers
   - Rider: Show only riders
3. Search by phone or name
4. View user statistics:
   - Total rides
   - Ratings (riders)
   - Earnings (riders)
   - KYC status

### 5. Monitor Rides

**Navigate to Rides**:
1. Click "Rides" in sidebar
2. Filter by status:
   - All: Show all rides
   - AWAITING_OFFERS: Waiting for driver bids
   - START: Ride accepted by driver
   - COMPLETED: Finished rides
3. View ride details:
   - Pickup and drop locations
   - Customer and rider info
   - Pricing and offers
   - Distance and fare

### 6. Track Financials

**Navigate to Financials**:
1. Click "Financials" in sidebar
2. View summary cards:
   - Total revenue
   - Platform fees (20%)
   - Rider earnings (80%)
3. Analyze charts:
   - Monthly revenue trends
   - Revenue by vehicle type
4. Review transactions:
   - Recent completed rides
   - Fare breakdowns

## Architecture

### Frontend Stack
- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **React Router 6** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP requests
- **Recharts** - Charts and graphs
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Socket.io Client** - Real-time updates (ready for integration)

### Backend Integration
- **JWT Authentication** - Secure admin sessions
- **REST APIs** - CRUD operations
- **MongoDB Aggregations** - Analytics and reports
- **Real-time Ready** - WebSocket support prepared

## Security Features

- **JWT-based authentication**
- **Protected routes** - All admin pages require login
- **Token expiration** - Auto-logout on token expiry
- **Authorization checks** - Admin-only endpoints on backend
- **CORS enabled** - Configured for local development

## Development

### File Structure

```
admin-web/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with sidebar
│   ├── pages/
│   │   ├── Dashboard.jsx       # Analytics dashboard
│   │   ├── Users.jsx          # User management
│   │   ├── Rides.jsx          # Ride monitoring
│   │   ├── KYCManagement.jsx  # KYC verification
│   │   ├── Financials.jsx     # Financial tracking
│   │   └── Login.jsx          # Admin login
│   ├── services/
│   │   ├── api.js             # Axios instance
│   │   └── websocket.js       # Socket.io client
│   ├── store/
│   │   ├── authStore.js       # Auth state
│   │   └── dataStore.js       # App data state
│   ├── config.js              # API URLs
│   ├── App.jsx                # Router setup
│   ├── main.jsx               # Entry point
│   └── index.css              # Tailwind CSS
├── package.json
└── vite.config.js
```

### Build for Production

```bash
cd /Users/malvin/Desktop/RIDE/admin-web
npm run build
```

The production build will be in `dist/` folder.

### Deploy

You can deploy the `dist` folder to any static hosting:
- Vercel
- Netlify
- AWS S3
- Digital Ocean

## Troubleshooting

### Issue: Cannot connect to backend

**Solution**:
1. Ensure backend server is running on port 3000
2. Check `/admin-web/src/config.js` has correct URL
3. Verify CORS is enabled in server

### Issue: Login fails

**Solution**:
1. Check credentials: `admin@ride.com` / `admin123`
2. Verify `/admin/login` endpoint is accessible
3. Check browser console for errors

### Issue: KYC images not loading

**Solution**:
1. Verify images are stored as base64 in database
2. Check KYC submission has `idFrontImage` field
3. Ensure image data is complete

### Issue: Charts not displaying

**Solution**:
1. Ensure rides exist in database
2. Check `/admin/dashboard` returns `chartData`
3. Verify Recharts library is installed

## Next Steps

### Immediate Enhancements

1. **Real-time WebSocket Integration**:
   - Uncomment WebSocket service
   - Connect on dashboard mount
   - Show live ride updates

2. **Export Reports**:
   - CSV export for users
   - PDF reports for financials
   - Excel export for rides

3. **User Actions**:
   - Ban/suspend users
   - Reset user passwords
   - Send notifications

4. **Advanced Filters**:
   - Date range for rides
   - Revenue by date range
   - User activity filters

### Future Features

- Email notifications to riders on KYC approval/rejection
- Bulk KYC operations
- Audit logs for admin actions
- Role-based access control (super admin, admin, moderator)
- System settings configuration
- Analytics export
- Real-time alerts
- Customer support chat

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Check server logs
4. Verify all dependencies are installed

## Summary

You now have a fully functional admin dashboard with:
✅ User management
✅ KYC verification system
✅ Ride monitoring
✅ Financial tracking
✅ Analytics dashboard
✅ Secure authentication
✅ Responsive design
✅ Real-time ready

**Start using it now:**

1. `cd /Users/malvin/Desktop/RIDE/server && npm start`
2. `cd /Users/malvin/Desktop/RIDE/admin-web && npm run dev`
3. Visit http://localhost:5173
4. Login with `admin@ride.com` / `admin123`

Happy managing! 🚗💼

