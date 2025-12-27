import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Rides from './pages/Rides';
import KYCManagement from './pages/KYCManagement';
import Financials from './pages/Financials';
import RestaurantDashboard from './pages/RestaurantDashboard';
import RestaurantOrders from './pages/RestaurantOrders';
import RestaurantMenu from './pages/RestaurantMenu';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <Login />} 
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="rides" element={<Rides />} />
          <Route path="kyc" element={<KYCManagement />} />
          <Route path="financials" element={<Financials />} />
          <Route path="restaurant/dashboard" element={<RestaurantDashboard />} />
          <Route path="restaurant/orders" element={<RestaurantOrders />} />
          <Route path="restaurant/menu" element={<RestaurantMenu />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
