import FoodOrder from '../models/FoodOrder.js';
import DeliveryBid from '../models/DeliveryBid.js';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import {
  getRestaurantById as getMockRestaurantById,
  getMenuItemById as getMockMenuItemById,
} from '../utils/mockEatsData.js';

const USE_MOCK_DATA = true;

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const createOrder = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, channel } = req.body;
    const customerId = req.user._id;

    let restaurant;
    if (USE_MOCK_DATA) {
      restaurant = getMockRestaurantById(restaurantId);
    } else {
      restaurant = await Restaurant.findById(restaurantId);
    }

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        msg: 'Restaurant not found',
      });
    }

    if (!restaurant.isOpen) {
      return res.status(400).json({
        success: false,
        msg: 'Restaurant is currently closed',
      });
    }

    let itemsTotal = 0;
    const orderItems = items.map((item) => {
      let menuItem;
      if (USE_MOCK_DATA) {
        menuItem = getMockMenuItemById(item.menuItemId);
      }

      const itemPrice = menuItem ? menuItem.price : item.price;
      const subtotal = itemPrice * item.quantity;
      itemsTotal += subtotal;

      return {
        menuItemId: item.menuItemId,
        name: item.name || (menuItem ? menuItem.name : 'Unknown Item'),
        price: itemPrice,
        quantity: item.quantity,
        customizations: item.customizations || {},
        subtotal,
        specialInstructions: item.specialInstructions,
      };
    });

    const deliveryFee = restaurant.deliveryFee || 2;
    const platformFee = itemsTotal * 0.1;
    const tax = 0;
    const total = itemsTotal + deliveryFee + platformFee + tax;

    if (itemsTotal < (restaurant.minimumOrder || 0)) {
      return res.status(400).json({
        success: false,
        msg: `Minimum order amount is $${restaurant.minimumOrder}`,
      });
    }

    const deliveryDistance = calculateDistance(
      restaurant.location.latitude,
      restaurant.location.longitude,
      deliveryAddress.latitude,
      deliveryAddress.longitude
    );

    const order = new FoodOrder({
      customerId,
      restaurantId,
      items: orderItems,
      pricing: {
        itemsTotal,
        deliveryFee,
        platformFee,
        tax,
        total,
      },
      deliveryAddress,
      restaurantAddress: restaurant.location,
      deliveryDistance,
      status: 'pending',
      paymentMethod: paymentMethod || 'cash',
      channel: channel || 'app',
      estimatedPreparationTime: restaurant.preparationTime || 30,
      timeline: [
        {
          status: 'pending',
          timestamp: new Date(),
          message: 'Order placed',
        },
      ],
    });

    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`restaurant_${restaurantId}`).emit('order:new', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        items: order.items,
        total: order.pricing.total,
        deliveryAddress: order.deliveryAddress,
      });
    }

    res.status(201).json({
      success: true,
      msg: 'Order placed successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to create order',
      error: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const { status } = req.query;

    let query = {};

    if (userRole === 'customer') {
      query.customerId = userId;
    } else if (userRole === 'rider') {
      query.courierId = userId;
    }

    if (status) {
      query.status = status;
    }

    const orders = await FoodOrder.find(query)
      .sort({ createdAt: -1 })
      .populate('restaurantId', 'name imageUrl')
      .populate('courierId', 'name phone');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch orders',
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await FoodOrder.findById(id)
      .populate('restaurantId', 'name imageUrl location contactPhone')
      .populate('courierId', 'name phone vehicleType')
      .populate('customerId', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch order',
      error: error.message,
    });
  }
};

export const restaurantAcceptOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { preparationTime } = req.body;

    const order = await FoodOrder.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: 'Order not found',
      });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        msg: 'Order cannot be accepted in current state',
      });
    }

    order.status = 'restaurant_accepted';
    order.estimatedPreparationTime = preparationTime || order.estimatedPreparationTime;
    order.timeline.push({
      status: 'restaurant_accepted',
      timestamp: new Date(),
      message: `Order accepted by restaurant. Prep time: ${order.estimatedPreparationTime} mins`,
    });

    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${id}`).emit('order:status', {
        orderId: id,
        status: order.status,
        message: 'Restaurant has accepted your order',
        preparationTime: order.estimatedPreparationTime,
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Order accepted',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to accept order',
      error: error.message,
    });
  }
};

export const restaurantRejectOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await FoodOrder.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: 'Order not found',
      });
    }

    order.status = 'cancelled';
    order.cancellationReason = reason || 'Restaurant unavailable';
    order.timeline.push({
      status: 'cancelled',
      timestamp: new Date(),
      message: `Order rejected by restaurant: ${order.cancellationReason}`,
    });

    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${id}`).emit('order:status', {
        orderId: id,
        status: 'cancelled',
        message: `Order rejected: ${order.cancellationReason}`,
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Order rejected',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to reject order',
      error: error.message,
    });
  }
};

export const markReady = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await FoodOrder.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: 'Order not found',
      });
    }

    order.status = 'ready_for_pickup';
    order.timeline.push({
      status: 'ready_for_pickup',
      timestamp: new Date(),
      message: 'Food is ready for pickup',
    });

    await order.save();

    order.status = 'bidding_open';
    order.timeline.push({
      status: 'bidding_open',
      timestamp: new Date(),
      message: 'Open for courier bidding',
    });

    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${id}`).emit('order:status', {
        orderId: id,
        status: 'bidding_open',
        message: 'Food is ready! Finding a courier...',
      });

      io.emit('delivery:offer', {
        orderId: order._id,
        orderNumber: order.orderNumber,
        restaurantAddress: order.restaurantAddress,
        deliveryAddress: order.deliveryAddress,
        deliveryDistance: order.deliveryDistance,
        orderTotal: order.pricing.total,
        itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Order ready for pickup, bidding opened',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to mark order as ready',
      error: error.message,
    });
  }
};

export const placeBid = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, estimatedTime, message } = req.body;
    const courierId = req.user._id;

    const order = await FoodOrder.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: 'Order not found',
      });
    }

    if (order.status !== 'bidding_open') {
      return res.status(400).json({
        success: false,
        msg: 'Order is not open for bidding',
      });
    }

    const existingBid = order.bids.find(
      (bid) => bid.courierId.toString() === courierId.toString()
    );

    if (existingBid) {
      return res.status(400).json({
        success: false,
        msg: 'You have already placed a bid on this order',
      });
    }

    const bid = {
      courierId,
      amount,
      estimatedTime,
      message,
      status: 'pending',
      createdAt: new Date(),
    };

    order.bids.push(bid);
    await order.save();

    const deliveryBid = new DeliveryBid({
      foodOrderId: id,
      courierId,
      amount,
      estimatedPickupTime: 10,
      estimatedDeliveryTime: estimatedTime,
      distance: order.deliveryDistance,
      message,
    });

    await deliveryBid.save();

    const io = req.app.get('io');
    if (io) {
      const courier = await User.findById(courierId).select('name phone rating');
      
      io.to(`order_${id}`).emit('delivery:bid', {
        orderId: id,
        bid: {
          ...bid,
          courier: courier || { name: 'Courier', rating: 4.5 },
        },
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Bid placed successfully',
      bid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to place bid',
      error: error.message,
    });
  }
};

export const acceptBid = async (req, res) => {
  try {
    const { id } = req.params;
    const { courierId } = req.body;

    const order = await FoodOrder.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: 'Order not found',
      });
    }

    const bid = order.bids.find(
      (b) => b.courierId.toString() === courierId.toString()
    );

    if (!bid) {
      return res.status(404).json({
        success: false,
        msg: 'Bid not found',
      });
    }

    bid.status = 'accepted';
    order.bids.forEach((b) => {
      if (b.courierId.toString() !== courierId.toString()) {
        b.status = 'rejected';
      }
    });

    order.status = 'courier_assigned';
    order.courierId = courierId;
    order.acceptedBid = {
      courierId,
      amount: bid.amount,
      acceptedAt: new Date(),
    };

    const estimatedDelivery = new Date();
    estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + (bid.estimatedTime || 30));
    order.estimatedDeliveryTime = estimatedDelivery;

    order.timeline.push({
      status: 'courier_assigned',
      timestamp: new Date(),
      message: 'Courier assigned to your order',
    });

    await order.save();

    await DeliveryBid.updateMany(
      { foodOrderId: id, courierId: { $ne: courierId } },
      { status: 'rejected' }
    );

    await DeliveryBid.updateOne(
      { foodOrderId: id, courierId },
      { status: 'accepted' }
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${id}`).emit('order:status', {
        orderId: id,
        status: 'courier_assigned',
        message: 'A courier has been assigned',
        courierId,
        estimatedDelivery: order.estimatedDeliveryTime,
      });

      io.to(`courier_${courierId}`).emit('delivery:assigned', {
        orderId: id,
        orderNumber: order.orderNumber,
        restaurantAddress: order.restaurantAddress,
        deliveryAddress: order.deliveryAddress,
        items: order.items,
        acceptedAmount: bid.amount,
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Bid accepted, courier assigned',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to accept bid',
      error: error.message,
    });
  }
};

export const markPickedUp = async (req, res) => {
  try {
    const { id } = req.params;
    const courierId = req.user._id;

    const order = await FoodOrder.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: 'Order not found',
      });
    }

    if (order.courierId.toString() !== courierId.toString()) {
      return res.status(403).json({
        success: false,
        msg: 'You are not assigned to this order',
      });
    }

    order.status = 'picked_up';
    order.timeline.push({
      status: 'picked_up',
      timestamp: new Date(),
      message: 'Courier has picked up your order',
    });

    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${id}`).emit('order:status', {
        orderId: id,
        status: 'picked_up',
        message: 'Your food has been picked up!',
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Order marked as picked up',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to mark as picked up',
      error: error.message,
    });
  }
};

export const markInTransit = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await FoodOrder.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: 'Order not found',
      });
    }

    order.status = 'in_transit';
    order.timeline.push({
      status: 'in_transit',
      timestamp: new Date(),
      message: 'Courier is on the way',
    });

    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${id}`).emit('order:status', {
        orderId: id,
        status: 'in_transit',
        message: 'Your order is on its way!',
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Order in transit',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to update order status',
      error: error.message,
    });
  }
};

export const markDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryProofImage } = req.body;
    const courierId = req.user._id;

    const order = await FoodOrder.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: 'Order not found',
      });
    }

    if (order.courierId.toString() !== courierId.toString()) {
      return res.status(403).json({
        success: false,
        msg: 'You are not assigned to this order',
      });
    }

    order.status = 'delivered';
    order.actualDeliveryTime = new Date();
    order.paymentStatus = 'completed';
    if (deliveryProofImage) {
      order.deliveryProofImage = deliveryProofImage;
    }
    order.timeline.push({
      status: 'delivered',
      timestamp: new Date(),
      message: 'Order delivered successfully',
    });

    await order.save();

    const courierEarnings = order.acceptedBid.amount * 0.8;

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${id}`).emit('order:status', {
        orderId: id,
        status: 'delivered',
        message: 'Your order has been delivered!',
      });

      io.to(`courier_${courierId}`).emit('delivery:completed', {
        orderId: id,
        earnings: courierEarnings,
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Order delivered successfully',
      order,
      courierEarnings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to mark as delivered',
      error: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const order = await FoodOrder.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: 'Order not found',
      });
    }

    const cancellableStatuses = [
      'pending',
      'restaurant_accepted',
      'preparing',
      'ready_for_pickup',
      'bidding_open',
    ];

    if (!cancellableStatuses.includes(order.status)) {
      return res.status(400).json({
        success: false,
        msg: 'Order cannot be cancelled at this stage',
      });
    }

    order.status = 'cancelled';
    order.cancellationReason = reason;
    order.timeline.push({
      status: 'cancelled',
      timestamp: new Date(),
      message: `Order cancelled: ${reason}`,
    });

    await order.save();

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${id}`).emit('order:status', {
        orderId: id,
        status: 'cancelled',
        message: 'Order has been cancelled',
      });

      io.to(`restaurant_${order.restaurantId}`).emit('order:cancelled', {
        orderId: id,
        orderNumber: order.orderNumber,
      });

      if (order.courierId) {
        io.to(`courier_${order.courierId}`).emit('delivery:cancelled', {
          orderId: id,
        });
      }
    }

    res.status(200).json({
      success: true,
      msg: 'Order cancelled',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to cancel order',
      error: error.message,
    });
  }
};

export const rateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { restaurantRating, courierRating } = req.body;

    const order = await FoodOrder.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        msg: 'Order not found',
      });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        msg: 'Can only rate delivered orders',
      });
    }

    if (restaurantRating) {
      order.ratings.restaurant = {
        score: restaurantRating.score,
        comment: restaurantRating.comment,
        timestamp: new Date(),
      };
    }

    if (courierRating) {
      order.ratings.courier = {
        score: courierRating.score,
        comment: courierRating.comment,
        timestamp: new Date(),
      };
    }

    await order.save();

    res.status(200).json({
      success: true,
      msg: 'Rating submitted successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to submit rating',
      error: error.message,
    });
  }
};

export const getAvailableDeliveries = async (req, res) => {
  try {
    const orders = await FoodOrder.find({
      status: 'bidding_open',
    })
      .populate('restaurantId', 'name imageUrl location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch available deliveries',
      error: error.message,
    });
  }
};

export const getCourierActiveDelivery = async (req, res) => {
  try {
    const courierId = req.user._id;

    const order = await FoodOrder.findOne({
      courierId,
      status: { $in: ['courier_assigned', 'picked_up', 'in_transit'] },
    })
      .populate('restaurantId', 'name imageUrl location contactPhone')
      .populate('customerId', 'name phone');

    if (!order) {
      return res.status(200).json({
        success: true,
        hasActiveDelivery: false,
        order: null,
      });
    }

    res.status(200).json({
      success: true,
      hasActiveDelivery: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch active delivery',
      error: error.message,
    });
  }
};

export const getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status, date } = req.query;

    const query = { restaurantId };

    if (status) {
      query.status = status;
    }

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    const orders = await FoodOrder.find(query)
      .populate('customerId', 'name phone')
      .populate('courierId', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to fetch restaurant orders',
      error: error.message,
    });
  }
};

export const updateCourierLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, heading } = req.body;

    const io = req.app.get('io');
    if (io) {
      io.to(`order_${id}`).emit('courier:location', {
        orderId: id,
        location: { latitude, longitude, heading },
      });
    }

    res.status(200).json({
      success: true,
      msg: 'Location updated',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      msg: 'Failed to update location',
      error: error.message,
    });
  }
};

