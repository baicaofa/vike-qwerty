import mongoose from "mongoose";

export interface IFeedback extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  type: "bug" | "feature" | "suggestion" | "other";
  title: string;
  description: string;
  userId?: mongoose.Types.ObjectId; // 关联用户ID(可选)
  contactInfo?: string; // 联系方式(可选)
  status: "new" | "in-review" | "resolved" | "rejected";
  priority: "low" | "medium" | "high" | "critical";
  upvotes: number; // 点赞数量
  downvotes: number; // 踩数量
  voters: {
    userId?: mongoose.Types.ObjectId; // 已登录用户ID（可选）
    deviceId?: string; // 设备指纹ID（可选）
    vote: "up" | "down";
    createdAt: Date;
  }[]; // 投票用户列表（支持已登录用户和匿名用户）
  replies: {
    adminId: mongoose.Types.ObjectId; // 管理员用户ID
    adminUsername: string; // 管理员用户名
    content: string; // 回复内容
    createdAt: Date; // 回复时间
  }[]; // 管理员回复列表
  createdAt: Date;
  updatedAt: Date;
}

const feedbackSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["bug", "feature", "suggestion", "other"],
      required: [true, "反馈类型是必需的"],
    },
    title: {
      type: String,
      required: [true, "反馈标题是必需的"],
      trim: true,
      maxlength: [100, "标题不能超过100个字符"],
    },
    description: {
      type: String,
      required: [true, "反馈描述是必需的"],
      trim: true,
      maxlength: [2000, "描述不能超过2000个字符"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    contactInfo: {
      type: String,
      required: false,
      trim: true,
      maxlength: [100, "联系方式不能超过100个字符"],
    },
    status: {
      type: String,
      enum: ["new", "in-review", "resolved", "rejected"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },
    voters: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false, // 已登录用户ID（可选）
        },
        deviceId: {
          type: String,
          required: false, // 设备指纹ID（可选）
        },
        vote: {
          type: String,
          enum: ["up", "down"],
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    replies: [
      {
        adminId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true, // 管理员用户ID
        },
        adminUsername: {
          type: String,
          required: true, // 管理员用户名
        },
        content: {
          type: String,
          required: true,
          trim: true,
          maxlength: [1000, "回复不能超过1000个字符"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  }
);

// 添加复合索引优化查询性能
feedbackSchema.index({ "voters.userId": 1, "voters.deviceId": 1 });

// 添加验证逻辑：确保userId和deviceId至少有一个存在
feedbackSchema.pre("save", function (next) {
  // 验证每个voter都有userId或deviceId
  for (const voter of this.voters) {
    if (!voter.userId && !voter.deviceId) {
      return next(new Error("投票记录必须包含userId或deviceId"));
    }
  }
  next();
});

export default mongoose.model<IFeedback>("Feedback", feedbackSchema);
