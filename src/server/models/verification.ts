import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  data: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

// 创建索引以加快查询速度
verificationSchema.index({ email: 1, code: 1 });
verificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerificationData = mongoose.model(
  "VerificationData",
  verificationSchema
);
