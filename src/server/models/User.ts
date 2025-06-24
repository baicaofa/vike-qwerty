import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  isEmailVerified: boolean;
  isAdmin: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "用户名是必需的"],
    unique: true,
    trim: true,
    minlength: [3, "用户名至少需要3个字符"],
  },
  email: {
    type: String,
    required: [true, "邮箱是必需的"],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "请提供有效的邮箱地址",
    ],
  },
  password: {
    type: String,
    required: [true, "密码是必需的"],
    minlength: [6, "密码至少需要6个字符"],
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockUntil: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 密码加密中间件
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// 密码比较方法
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 增加登录尝试次数
userSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
  // 如果账户已锁定且锁定时间未过期，则不增加尝试次数
  if (this.lockUntil && this.lockUntil > new Date()) {
    return;
  }

  // 增加尝试次数
  this.loginAttempts += 1;

  // 如果尝试次数达到5次，锁定账户30分钟
  if (this.loginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30分钟
  }

  await this.save();
};

// 重置登录尝试次数
userSchema.methods.resetLoginAttempts = async function (): Promise<void> {
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  await this.save();
};

export default mongoose.model<IUser>("User", userSchema);
