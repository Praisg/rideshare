import mongoose from 'mongoose';

const { Schema } = mongoose;

const foodOrderSchema = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    items: [{
      menuItemId: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      customizations: {
        type: Schema.Types.Mixed,
        default: {},
      },
      subtotal: {
        type: Number,
        required: true,
      },
      specialInstructions: {
        type: String,
      },
    }],
    pricing: {
      itemsTotal: {
        type: Number,
        required: true,
      },
      deliveryFee: {
        type: Number,
        default: 0,
      },
      platformFee: {
        type: Number,
        default: 0,
      },
      tax: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    deliveryAddress: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      instructions: { type: String },
    },
    restaurantAddress: {
      address: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
    },
    deliveryDistance: {
      type: Number,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'restaurant_accepted',
        'preparing',
        'ready_for_pickup',
        'bidding_open',
        'courier_assigned',
        'picked_up',
        'in_transit',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    bids: [{
      courierId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      estimatedTime: {
        type: Number,
      },
      message: {
        type: String,
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    acceptedBid: {
      courierId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
      amount: {
        type: Number,
      },
      acceptedAt: {
        type: Date,
      },
    },
    courierId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'mobile_money'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending',
    },
    timeline: [{
      status: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
      message: {
        type: String,
      },
    }],
    estimatedPreparationTime: {
      type: Number,
    },
    estimatedDeliveryTime: {
      type: Date,
    },
    actualDeliveryTime: {
      type: Date,
    },
    ratings: {
      restaurant: {
        score: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        timestamp: { type: Date },
      },
      courier: {
        score: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        timestamp: { type: Date },
      },
    },
    channel: {
      type: String,
      enum: ['app', 'whatsapp', 'web'],
      default: 'app',
    },
    cancellationReason: {
      type: String,
    },
    deliveryProofImage: {
      type: String,
    },
  },
  { timestamps: true }
);

foodOrderSchema.index({ customerId: 1, createdAt: -1 });
foodOrderSchema.index({ restaurantId: 1, status: 1 });
foodOrderSchema.index({ courierId: 1, status: 1 });
foodOrderSchema.index({ status: 1 });
foodOrderSchema.index({ orderNumber: 1 });

foodOrderSchema.pre('save', function(next) {
  if (this.isNew) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `FO-${timestamp}${random}`;
  }
  next();
});

const FoodOrder = mongoose.model('FoodOrder', foodOrderSchema);

export default FoodOrder;

