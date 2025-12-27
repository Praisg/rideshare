# RIDE Admin Dashboard

Web-based administration portal for managing the RIDE rideshare platform.

## Features

### User Management
- View all customers and riders
- Filter by user role
- Search by phone or name
- View user statistics and KYC status
- Track earnings for riders

### KYC Management
- Review submitted KYC documents
- Approve or reject verification requests
- View ID images (front and back)
- Track verification status
- Provide rejection reasons

### Ride Monitoring
- View all rides in real-time
- Filter by ride status
- Monitor bidding offers
- Track ride details (pickup, drop, fare)
- View customer and rider information

### Financial Dashboard
- Total revenue tracking
- Platform fees (20% commission)
- Rider earnings (80% payout)
- Revenue by vehicle type
- Monthly revenue charts
- Recent transactions

### Dashboard Analytics
- Key metrics overview
- Total users (customers + riders)
- Active rides count
- Revenue statistics
- Pending KYC approvals
- Rides over time chart
- Revenue breakdown

## Tech Stack

- **React** - UI framework
- **Vite** - Build tool
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Getting Started

### Prerequisites

- Node.js v20+
- RIDE backend server running

### Installation

```bash
cd admin-web
npm install
```

### Configuration

Update `src/config.js` with your backend URL:

```javascript
export const API_URL = "http://localhost:3000";
export const WS_URL = "http://localhost:3000";
```

### Development

```bash
npm run dev
```

The admin dashboard will be available at `http://localhost:5173`

### Default Credentials

- Email: `admin@ride.com`
- Password: `admin123`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## API Endpoints Required

The admin dashboard expects the following backend endpoints:

### Authentication
- `POST /admin/login` - Admin login

### Dashboard
- `GET /admin/dashboard` - Dashboard statistics

### Users
- `GET /admin/users?role={role}` - Get all users

### Rides
- `GET /admin/rides?status={status}` - Get all rides

### KYC
- `GET /admin/kyc?status={status}` - Get KYC submissions
- `POST /kyc/approve` - Approve KYC
- `POST /kyc/reject` - Reject KYC

### Financials
- `GET /admin/financials` - Financial data

## Features in Detail

### Real-time Updates
- The dashboard will support WebSocket connections for real-time ride updates
- Live monitoring of active rides
- Instant KYC submission notifications

### Security
- JWT-based authentication
- Protected routes
- Token refresh mechanism
- Automatic logout on token expiration

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts
- Touch-optimized controls

## Development Roadmap

- [ ] Real-time WebSocket integration
- [ ] Export financial reports
- [ ] User ban/suspend functionality
- [ ] Bulk KYC operations
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Audit logs
- [ ] Role-based access control

## License

MIT
