import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Switch,
  FormControlLabel,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Restaurant,
  ShoppingBag,
  AttachMoney,
  AccessTime,
  TrendingUp,
} from '@mui/icons-material';
import api from '../services/api';

const RestaurantDashboard = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [stats, setStats] = useState({
    todayOrders: 0,
    todayRevenue: 0,
    avgPrepTime: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const restaurantId = localStorage.getItem('restaurantId') || 'rest_001';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const restaurantRes = await api.get(`/restaurants/${restaurantId}`);
      if (restaurantRes.data.success) {
        setRestaurant(restaurantRes.data.restaurant);
      }

      const today = new Date().toISOString().split('T')[0];
      const ordersRes = await api.get(`/food-orders/restaurant/${restaurantId}?date=${today}`);
      
      if (ordersRes.data.success) {
        const orders = ordersRes.data.orders || [];
        const pending = orders.filter(o => ['pending', 'restaurant_accepted', 'preparing'].includes(o.status));
        const revenue = orders
          .filter(o => o.status === 'delivered')
          .reduce((sum, o) => sum + (o.pricing?.itemsTotal || 0), 0);
        
        setStats({
          todayOrders: orders.length,
          todayRevenue: revenue,
          avgPrepTime: restaurant?.preparationTime || 25,
          pendingOrders: pending.length,
        });
      }
      
      setError(null);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      await api.patch(`/restaurants/${restaurantId}/toggle-status`);
      setRestaurant(prev => ({ ...prev, isOpen: !prev.isOpen }));
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {restaurant?.name || 'Restaurant Dashboard'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your restaurant and orders
          </Typography>
        </Box>
        
        <Box display="flex" gap={2} alignItems="center">
          <FormControlLabel
            control={
              <Switch
                checked={restaurant?.isOpen || false}
                onChange={handleToggleStatus}
                color="success"
              />
            }
            label={restaurant?.isOpen ? 'Open' : 'Closed'}
          />
          <Button
            variant="contained"
            onClick={() => navigate('/restaurant/orders')}
          >
            View Orders
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'primary.light',
                    display: 'flex',
                  }}
                >
                  <ShoppingBag sx={{ color: 'primary.main' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Today's Orders
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.todayOrders}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'success.light',
                    display: 'flex',
                  }}
                >
                  <AttachMoney sx={{ color: 'success.main' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Today's Revenue
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    ${stats.todayRevenue.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'warning.light',
                    display: 'flex',
                  }}
                >
                  <AccessTime sx={{ color: 'warning.main' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Avg Prep Time
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.avgPrepTime} min
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'error.light',
                    display: 'flex',
                  }}
                >
                  <TrendingUp sx={{ color: 'error.main' }} />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pending Orders
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.pendingOrders}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Quick Actions
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<ShoppingBag />}
                  onClick={() => navigate('/restaurant/orders')}
                >
                  Manage Orders
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Restaurant />}
                  onClick={() => navigate('/restaurant/menu')}
                >
                  Edit Menu
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Restaurant Info
              </Typography>
              <Box display="flex" flexDirection="column" gap={1.5}>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Status</Typography>
                  <Chip
                    label={restaurant?.isOpen ? 'Open' : 'Closed'}
                    color={restaurant?.isOpen ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Rating</Typography>
                  <Typography fontWeight="medium">
                    {restaurant?.rating?.toFixed(1) || 'N/A'} ({restaurant?.reviewCount || 0} reviews)
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Delivery Fee</Typography>
                  <Typography fontWeight="medium">
                    ${restaurant?.deliveryFee?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography color="text.secondary">Minimum Order</Typography>
                  <Typography fontWeight="medium">
                    ${restaurant?.minimumOrder?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantDashboard;

