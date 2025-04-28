import mongoose from "mongoose";

// 本地修改熟词标记时，记录会被标记为 local_new 或 local_modified
// 删除熟词标记时，记录会被标记为 local_deleted
// 同步时会将这些变更发送到服务器
// 服务器处理后会返回最新的变更
// 本地应用服务器返回的变更，并更新同步状态
const familiarWordSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    word: {
      type: String,
      required: true,
    },
    dict: {
      type: String,
      required: true,
    },
    isFamiliar: {
      type: Boolean,
      required: true,
      default: false,
    },
    sync_status: {
      type: String,
      enum: ["synced", "local_new", "local_modified", "local_deleted"],
      default: "local_new",
    },
    last_modified: {
      type: Date,
      required: true,
    },
    clientModifiedAt: {
      type: Date,
      required: true,
    },
    serverModifiedAt: {
      type: Date,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// 创建复合索引
familiarWordSchema.index({ userId: 1, dict: 1, word: 1 }, { unique: true });
familiarWordSchema.index({ userId: 1, updatedAt: 1 });

const FamiliarWord = mongoose.model("FamiliarWord", familiarWordSchema);

export default FamiliarWord;
