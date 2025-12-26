import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    role: {
      type: String,
      enum: ["customer", "rider"],
      required: true,
    },
    phone: {
      type: String,
      sparse: true,
    },
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },
    kyc: {
      status: {
        type: String,
        enum: ["pending", "submitted", "approved", "rejected"],
        default: "pending",
      },
      idType: {
        type: String,
        enum: ["national_id", "passport", "drivers_license"],
      },
      idNumber: {
        type: String,
      },
      idFrontImage: {
        type: String,
      },
      idBackImage: {
        type: String,
      },
      fullName: {
        type: String,
      },
      dateOfBirth: {
        type: Date,
      },
      address: {
        type: String,
      },
      submittedAt: {
        type: Date,
      },
      verifiedAt: {
        type: Date,
      },
      rejectionReason: {
        type: String,
      },
    },
    earnings: {
      total: {
        type: Number,
        default: 0,
      },
      available: {
        type: Number,
        default: 0,
      },
      pendingWithdrawal: {
        type: Number,
        default: 0,
      },
    },
    stats: {
      totalRides: {
        type: Number,
        default: 0,
      },
      completedRides: {
        type: Number,
        default: 0,
      },
      cancelledRides: {
        type: Number,
        default: 0,
      },
      rating: {
        type: Number,
        default: 5.0,
      },
      totalRatings: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.createAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      phone: this.phone,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.createRefreshToken = function () {
  return jwt.sign(
    { id: this._id, phone: this.phone },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);
export default User;
