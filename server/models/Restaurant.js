import mongoose from 'mongoose';

const { Schema } = mongoose;

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    cuisine: [{
      type: String,
      trim: true,
    }],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    priceRange: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      default: '$$',
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    minimumOrder: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    location: {
      address: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    contactPhone: {
      type: String,
    },
    contactWhatsApp: {
      type: String,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    featured: {
      type: Boolean,
      default: false,
    },
    acceptsBidding: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number,
      default: 30,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    bankDetails: {
      bankName: String,
      accountNumber: String,
      accountName: String,
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'suspended'],
      default: 'active',
    },
  },
  { timestamps: true }
);

restaurantSchema.index({ 'location.latitude': 1, 'location.longitude': 1 });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ name: 'text', description: 'text' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;

