import { appAxios } from './apiInterceptors';

interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  customizations?: Record<string, any>;
  specialInstructions?: string;
}

interface DeliveryAddress {
  address: string;
  latitude: number;
  longitude: number;
  instructions?: string;
}

interface CreateOrderPayload {
  restaurantId: string;
  items: OrderItem[];
  deliveryAddress: DeliveryAddress;
  paymentMethod?: string;
  channel?: string;
}

interface RatingPayload {
  restaurantRating?: {
    score: number;
    comment?: string;
  };
  courierRating?: {
    score: number;
    comment?: string;
  };
}

export const createFoodOrder = async (payload: CreateOrderPayload) => {
  try {
    const response = await appAxios.post('/food-orders/create', payload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to create order:', error);
    return { success: false, order: null, error: error?.response?.data?.msg || error.message };
  }
};

export const getMyFoodOrders = async (status?: string) => {
  try {
    const url = status ? `/food-orders?status=${status}` : '/food-orders';
    const response = await appAxios.get(url);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch orders:', error);
    return { success: false, orders: [], error: error.message };
  }
};

export const getFoodOrderById = async (id: string) => {
  try {
    const response = await appAxios.get(`/food-orders/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch order:', error);
    return { success: false, order: null, error: error.message };
  }
};

export const acceptBid = async (orderId: string, courierId: string) => {
  try {
    const response = await appAxios.patch(`/food-orders/${orderId}/accept-bid`, { courierId });
    return response.data;
  } catch (error: any) {
    console.error('Failed to accept bid:', error);
    return { success: false, error: error.message };
  }
};

export const cancelFoodOrder = async (orderId: string, reason: string) => {
  try {
    const response = await appAxios.patch(`/food-orders/${orderId}/cancel`, { reason });
    return response.data;
  } catch (error: any) {
    console.error('Failed to cancel order:', error);
    return { success: false, error: error.message };
  }
};

export const rateFoodOrder = async (orderId: string, ratings: RatingPayload) => {
  try {
    const response = await appAxios.post(`/food-orders/${orderId}/rate`, ratings);
    return response.data;
  } catch (error: any) {
    console.error('Failed to rate order:', error);
    return { success: false, error: error.message };
  }
};

export const getAvailableDeliveries = async () => {
  try {
    const response = await appAxios.get('/food-orders/available-deliveries');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch available deliveries:', error);
    return { success: false, orders: [], error: error.message };
  }
};

export const getActiveDelivery = async () => {
  try {
    const response = await appAxios.get('/food-orders/active-delivery');
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch active delivery:', error);
    return { success: false, hasActiveDelivery: false, order: null, error: error.message };
  }
};

export const placeBid = async (orderId: string, amount: number, estimatedTime: number, message?: string) => {
  try {
    const response = await appAxios.post(`/food-orders/${orderId}/bid`, {
      amount,
      estimatedTime,
      message,
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to place bid:', error);
    return { success: false, error: error?.response?.data?.msg || error.message };
  }
};

export const markPickedUp = async (orderId: string) => {
  try {
    const response = await appAxios.patch(`/food-orders/${orderId}/pickup`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to mark as picked up:', error);
    return { success: false, error: error.message };
  }
};

export const markInTransit = async (orderId: string) => {
  try {
    const response = await appAxios.patch(`/food-orders/${orderId}/in-transit`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to mark in transit:', error);
    return { success: false, error: error.message };
  }
};

export const markDelivered = async (orderId: string, deliveryProofImage?: string) => {
  try {
    const response = await appAxios.patch(`/food-orders/${orderId}/deliver`, {
      deliveryProofImage,
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to mark as delivered:', error);
    return { success: false, error: error.message };
  }
};

export const updateCourierLocation = async (orderId: string, latitude: number, longitude: number, heading?: number) => {
  try {
    const response = await appAxios.post(`/food-orders/${orderId}/courier-location`, {
      latitude,
      longitude,
      heading,
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to update courier location:', error);
    return { success: false, error: error.message };
  }
};

export const restaurantAcceptOrder = async (orderId: string, preparationTime?: number) => {
  try {
    const response = await appAxios.patch(`/food-orders/${orderId}/restaurant-accept`, {
      preparationTime,
    });
    return response.data;
  } catch (error: any) {
    console.error('Failed to accept order:', error);
    return { success: false, error: error.message };
  }
};

export const restaurantRejectOrder = async (orderId: string, reason: string) => {
  try {
    const response = await appAxios.patch(`/food-orders/${orderId}/restaurant-reject`, { reason });
    return response.data;
  } catch (error: any) {
    console.error('Failed to reject order:', error);
    return { success: false, error: error.message };
  }
};

export const markOrderReady = async (orderId: string) => {
  try {
    const response = await appAxios.patch(`/food-orders/${orderId}/ready`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to mark order ready:', error);
    return { success: false, error: error.message };
  }
};

export const getRestaurantOrders = async (restaurantId: string, status?: string, date?: string) => {
  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (date) params.append('date', date);
    
    const response = await appAxios.get(`/food-orders/restaurant/${restaurantId}?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch restaurant orders:', error);
    return { success: false, orders: [], error: error.message };
  }
};

