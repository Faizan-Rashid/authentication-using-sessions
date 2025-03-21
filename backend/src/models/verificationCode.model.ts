import mongoose from "mongoose";
import { verificationCodeType } from "../constants/verificationCodeType";

interface VerificationCodeDocument extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  type: verificationCodeType;
  expiresAt: Date;
  createdAt: Date;
}

const verificationCodeSchema = new mongoose.Schema<VerificationCodeDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const VerificationCodeModel = mongoose.model(
  "VerififcationCode",
  verificationCodeSchema,
  "verififcationc_code"
);

export default VerificationCodeModel;
