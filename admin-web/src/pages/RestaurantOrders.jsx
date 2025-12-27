import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  AccessTime,
  LocalShipping,
  Restaurant,
} from '@mui/icons-material';
import api from '../services/api';
import { io } from 'socket.io-client';

const statusColors = {
  pending: 'warning',
  restaurant_accepted: 'info',
  preparing: 'info',
  ready_for_pickup: 'success',
  bidding_open: 'secondary',
  courier_assigned: 'primary',
  picked_up: 'primary',
  in_transit: 'primary',
  delivered: 'success',
  cancelled: 'error',
};

const statusLabels = {
  pending: 'New Order',
  restaurant_accepted: 'Accepted',
  preparing: 'Preparing',
  ready_for_pickup: 'Ready',
  bidding_open: 'Finding Courier',
  courier_assigned: 'Courier Assigned',
  picked_up: 'Picked Up',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const RestaurantOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('active');
  const [prepTimeDialog, setPrepTimeDialog] = useState({ open: false, orderId: null });
  const [prepTime, setPrepTime] = useState('25');
  const [actionLoading, setActionLoading] = useState(null);

  const restaurantId = localStorage.getItem('restaurantId') || 'rest_001';

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/food-orders/restaurant/${restaurantId}`);
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchOrders();

    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000');
    
    socket.emit('joinRoom', `restaurant_${restaurantId}`);
    
    socket.on('order:new', (data) => {
      fetchOrders();
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchOrders, restaurantId]);

  const handleAcceptOrder = async (orderId) => {
    setPrepTimeDialog({ open: true, orderId });
  };

  const confirmAcceptOrder = async () => {
    const { orderId } = prepTimeDialog;
    setActionLoading(orderId);
    
    try {
      await api.patch(`/food-orders/${orderId}/restaurant-accept`, {
        preparationTime: parseInt(prepTime, 10),
      });
      fetchOrders();
      setPrepTimeDialog({ open: false, orderId: null });
    } catch (err) {
      console.error('Failed to accept order:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to reject this order?')) return;
    
    setActionLoading(orderId);
    try {
      await api.patch(`/food-orders/${orderId}/restaurant-reject`, {
        reason: 'Restaurant unavailable',
      });
      fetchOrders();
    } catch (err) {
      console.error('Failed to reject order:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkReady = async (orderId) => {
    setActionLoading(orderId);
    try {
      await api.patch(`/food-orders/${orderId}/ready`);
      fetchOrders();
    } catch (err) {
      console.error('Failed to mark ready:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const activeStatuses = ['pending', 'restaurant_accepted', 'preparing', 'ready_for_pickup', 'bidding_open', 'courier_assigned'];
  const completedStatuses = ['picked_up', 'in_transit', 'delivered', 'cancelled'];

  const filteredOrders = orders.filter(order => 
    activeTab === 'active' 
      ? activeStatuses.includes(order.status)
      : completedStatuses.includes(order.status)
  );

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
        <Typography variant="h4" fontWeight="bold">
          Orders
        </Typography>
        <Button variant="outlined" onClick={fetchOrders}>
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onChange={(e, v) => setActiveTab(v)}
        sx={{ mb: 3 }}
      >
        <Tab value="active" label={`Active (${orders.filter(o => activeStatuses.includes(o.status)).length})`} />
        <Tab value="completed" label={`History (${orders.filter(o => completedStatuses.includes(o.status)).length})`} />
      </Tabs>

      <Grid container spacing={3}>
        {filteredOrders.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box textAlign="center" py={4}>
                  <Restaurant sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary">
                    {activeTab === 'active' ? 'No active orders' : 'No order history'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          filteredOrders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        #{order.orderNumber}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <Chip
                      label={statusLabels[order.status]}
                      color={statusColors[order.status]}
                      size="small"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                    Items
                  </Typography>
                  <List dense disablePadding>
                    {order.items?.map((item, idx) => (
                      <ListItem key={idx} disablePadding sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={`${item.quantity}x ${item.name}`}
                          secondary={`$${item.subtotal?.toFixed(2)}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                          secondaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Box display="flex" justifyContent="space-between" mb={2}>
                    <Typography fontWeight="bold">Total</Typography>
                    <Typography fontWeight="bold" color="primary">
                      ${order.pricing?.total?.toFixed(2)}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" mb={2}>
                    Delivery: {order.deliveryAddress?.address}
                  </Typography>

                  {order.status === 'pending' && (
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        startIcon={<CheckCircle />}
                        onClick={() => handleAcceptOrder(order._id)}
                        disabled={actionLoading === order._id}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        onClick={() => handleRejectOrder(order._id)}
                        disabled={actionLoading === order._id}
                      >
                        Reject
                      </Button>
                    </Box>
                  )}

                  {(order.status === 'restaurant_accepted' || order.status === 'preparing') && (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<LocalShipping />}
                      onClick={() => handleMarkReady(order._id)}
                      disabled={actionLoading === order._id}
                    >
                      Mark Ready for Pickup
                    </Button>
                  )}

                  {order.status === 'ready_for_pickup' && (
                    <Alert severity="info" icon={<AccessTime />}>
                      Waiting for courier pickup
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <Dialog open={prepTimeDialog.open} onClose={() => setPrepTimeDialog({ open: false, orderId: null })}>
        <DialogTitle>Set Preparation Time</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" mb={2}>
            How long will it take to prepare this order?
          </Typography>
          <TextField
            autoFocus
            label="Minutes"
            type="number"
            fullWidth
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            InputProps={{ inputProps: { min: 5, max: 120 } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrepTimeDialog({ open: false, orderId: null })}>
            Cancel
          </Button>
          <Button onClick={confirmAcceptOrder} variant="contained" color="success">
            Accept Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RestaurantOrders;

