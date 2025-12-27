import mongoose from 'mongoose';

const { Schema } = mongoose;

const deliveryBidSchema = new Schema(
  {
    foodOrderId: {
      type: Schema.Types.ObjectId,
      ref: 'FoodOrder',
      required: true,
    },
    courierId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    estimatedPickupTime: {
      type: Number,
    },
    estimatedDeliveryTime: {
      type: Number,
    },
    distance: {
      type: Number,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'expired'],
      default: 'pending',
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 5 * 60 * 1000),
    },
  },
  { timestamps: true }
);

deliveryBidSchema.index({ foodOrderId: 1, courierId: 1 }, { unique: true });
deliveryBidSchema.index({ foodOrderId: 1, status: 1 });
deliveryBidSchema.index({ courierId: 1, status: 1 });
deliveryBidSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const DeliveryBid = mongoose.model('DeliveryBid', deliveryBidSchema);

export default DeliveryBid;

