import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../errors/index.js";

export const submitKYC = async (req, res) => {
  const { idType, idNumber, fullName, dateOfBirth, address, idFrontImage, idBackImage } = req.body;
  const userId = req.user.id;

  if (!idType || !idNumber || !fullName || !dateOfBirth || !address) {
    throw new BadRequestError("All KYC fields are required");
  }

  if (!idFrontImage) {
    throw new BadRequestError("ID front image is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  if (user.role !== "rider") {
    throw new BadRequestError("KYC verification is only available for riders");
  }

  if (user.kyc.status === "approved") {
    throw new BadRequestError("KYC is already approved");
  }

  if (user.kyc.status === "submitted") {
    throw new BadRequestError("KYC is already submitted and pending verification");
  }

  user.kyc = {
    status: "submitted",
    idType,
    idNumber,
    fullName,
    dateOfBirth: new Date(dateOfBirth),
    address,
    idFrontImage,
    idBackImage: idBackImage || null,
    submittedAt: new Date(),
  };

  await user.save();

  res.status(StatusCodes.OK).json({
    message: "KYC submitted successfully. Awaiting verification.",
    kyc: user.kyc,
  });
};

export const getKYCStatus = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  res.status(StatusCodes.OK).json({
    kyc: user.kyc,
  });
};

export const approveKYC = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new BadRequestError("User ID is required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  if (user.kyc.status !== "submitted") {
    throw new BadRequestError("KYC must be in submitted status to approve");
  }

  user.kyc.status = "approved";
  user.kyc.verifiedAt = new Date();

  await user.save();

  res.status(StatusCodes.OK).json({
    message: "KYC approved successfully",
    kyc: user.kyc,
  });
};

export const rejectKYC = async (req, res) => {
  const { userId, reason } = req.body;

  if (!userId || !reason) {
    throw new BadRequestError("User ID and rejection reason are required");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new BadRequestError("User not found");
  }

  if (user.kyc.status !== "submitted") {
    throw new BadRequestError("KYC must be in submitted status to reject");
  }

  user.kyc.status = "rejected";
  user.kyc.rejectionReason = reason;

  await user.save();

  res.status(StatusCodes.OK).json({
    message: "KYC rejected",
    kyc: user.kyc,
  });
};

export const getRiderEarnings = async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  if (user.role !== "rider") {
    throw new BadRequestError("Earnings are only available for riders");
  }

  res.status(StatusCodes.OK).json({
    earnings: user.earnings,
    stats: user.stats,
  });
};

