import mongoose from 'mongoose';

const { Schema } = mongoose;

const menuItemSchema = new Schema(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isVegetarian: {
      type: Boolean,
      default: false,
    },
    preparationTime: {
      type: Number,
      default: 15,
    },
    customizations: [{
      name: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ['radio', 'checkbox'],
        default: 'radio',
      },
      required: {
        type: Boolean,
        default: false,
      },
      options: [{
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          default: 0,
        },
      }],
    }],
  },
  { timestamps: true }
);

menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

export default MenuItem;

