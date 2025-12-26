import mongoose from 'mongoose';

const { Schema } = mongoose;

const rideSchema = new Schema(
  {
    vehicle: {
      type: String,
      enum: ["bike", "human", "cabEconomy", "cabPremium"],
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    pickup: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    drop: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    fare: {
      type: Number,
      required: true,
    },
    proposedPrice: {
      type: Number,
      required: true,
    },
    suggestedPriceRange: {
      min: { type: Number },
      max: { type: Number },
    },
    pricingModel: {
      type: String,
      enum: ["fixed", "bidding"],
      default: "bidding",
    },
    offers: [{
      riderId: { type: Schema.Types.ObjectId, ref: "User" },
      offeredPrice: { type: Number, required: true },
      message: { type: String },
      status: { 
        type: String, 
        enum: ["pending", "accepted", "rejected"], 
        default: "pending" 
      },
      createdAt: { type: Date, default: Date.now },
    }],
    acceptedOffer: {
      riderId: { type: Schema.Types.ObjectId, ref: "User" },
      finalPrice: { type: Number },
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rider: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["AWAITING_OFFERS", "SEARCHING_FOR_RIDER", "START", "ARRIVED", "COMPLETED"],
      default: "AWAITING_OFFERS",
    },
    otp: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Ride = mongoose.model("Ride", rideSchema);
export default Ride;
