# Quick Start - RIDE Admin Dashboard

## 30-Second Start Guide

### 1. Start Backend
```bash
cd /Users/malvin/Desktop/RIDE/server
npm start
```

### 2. Start Admin Dashboard
```bash
cd /Users/malvin/Desktop/RIDE/admin-web
npm run dev
```

### 3. Login
- Open: http://localhost:5173
- Email: `admin@ride.com`
- Password: `admin123`

## Main Features

### KYC Management (Most Important)
**Path**: Click "KYC Management" in sidebar

**To Approve KYC**:
1. Filter by "submitted"
2. Click "View Front ID" to review document
3. Click "Approve" button

**To Reject KYC**:
1. Click "Reject" button
2. Enter reason (e.g., "ID image is blurry")
3. Click "Confirm Reject"

### Monitor Rides
**Path**: Click "Rides" in sidebar
- Filter by status to see active/completed rides
- View customer and rider details
- Track pickup and drop locations

### View Users
**Path**: Click "Users" in sidebar
- Search by phone or name
- Filter by customer/rider
- See stats: rides, ratings, earnings

### Track Finances
**Path**: Click "Financials" in sidebar
- Total revenue
- Platform fees (20%)
- Rider earnings (80%)
- Charts and transaction history

### Dashboard Overview
**Path**: Home page after login
- Key metrics at a glance
- Charts showing trends
- Quick stats cards

## Common Tasks

### Approve All Pending KYC
1. Go to KYC Management
2. Click "submitted" filter
3. Review each submission
4. Click "Approve" for valid ones

### Check Today's Revenue
1. Go to Financials
2. Look at recent transactions
3. View total revenue card

### Find a User
1. Go to Users
2. Type phone number in search
3. View their details

### Monitor Active Rides
1. Go to Rides
2. Click "START" filter
3. See all ongoing rides

## Need Help?

Full documentation: `/Users/malvin/Desktop/RIDE/ADMIN_SETUP.md`
Complete guide: `/Users/malvin/Desktop/RIDE/ADMIN_DASHBOARD_COMPLETE.md`

## Default Credentials

Email: `admin@ride.com`
Password: `admin123`

(Change these in production!)

