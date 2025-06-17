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
    userId: mongoose.Types.ObjectId;
    vote: "up" | "down";
  }[]; // 投票用户列表
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
          required: true,
        },
        vote: {
          type: String,
          enum: ["up", "down"],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true, // 自动添加 createdAt 和 updatedAt 字段
  }
);

export default mongoose.model<IFeedback>("Feedback", feedbackSchema);
