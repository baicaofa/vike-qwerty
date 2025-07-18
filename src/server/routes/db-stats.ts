import DbStats from "../models/DbStats";
import User from "../models/User";
import WordRecord from "../models/WordRecord";
import type { Request, Response } from "express";
import express from "express";

const router = express.Router();

// 获取数据库版本统计信息的GET请求
router.get("/", async (req: Request, res: Response) => {
  try {
    // 获取查询参数
    const dataType = (req.query.dataType as string) || "full";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const response: any = { success: true };

    // summary 或 full：返回设备统计和用户总数
    if (dataType === "summary" || dataType === "full") {
      // 获取设备统计（带分页）
      const stats = await DbStats.find()
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
      response.stats = stats;
      response.versionCounts = stats.reduce((acc, stat) => {
        const version = stat.currentVersion;
        if (!acc[version]) {
          acc[version] = 0;
        }
        acc[version]++;
        return acc;
      }, {} as Record<number, number>);
      response.totalDevices = await DbStats.countDocuments(); // 使用 countDocuments 获取总数
      response.totalStatsPages = Math.ceil(response.totalDevices / limit);
      response.currentStatsPage = page;

      // 获取用户总数
      response.userCount = await User.countDocuments();
    }

    // userStats 或 full：返回用户练习统计
    if (dataType === "userStats" || dataType === "full") {
      // 获取用户练习数据统计（带分页）
      const userPracticeStats = await WordRecord.aggregate([
        {
          $match: { userId: { $exists: true } },
        },
        {
          $group: {
            _id: { userId: "$userId", dict: "$dict" },
            wordCount: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.userId",
            dictStats: {
              $push: {
                dictName: "$_id.dict",
                wordCount: "$wordCount",
              },
            },
            totalPracticeCount: { $sum: "$wordCount" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
            pipeline: [
              {
                $project: { username: 1, email: 1, createdAt: 1, lastLogin: 1 },
              },
            ],
          },
        },
        {
          $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
        },
        {
          $project: {
            userId: "$_id",
            username: { $ifNull: ["$user.username", "Unknown"] },
            email: { $ifNull: ["$user.email", "N/A"] },
            createdAt: "$user.createdAt",
            lastLogin: "$user.lastLogin",
            dictStats: { $ifNull: ["$dictStats", []] },
            totalPracticeCount: { $ifNull: ["$totalPracticeCount", 0] },
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]);

      response.userPracticeStats = userPracticeStats;
      response.totalUserPages = Math.ceil(
        (await User.countDocuments()) / limit
      );
      response.currentUserPage = page;
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("获取数据库版本统计信息时出错:", error);
    res.status(500).json({ success: false, message: "服务器错误" });
  }
});

// 接收数据库版本统计信息的POST请求（保持不变）
router.post("/", (req: Request, res: Response) => {
  try {
    const { deviceId, currentVersion, expectedVersion, timestamp, userAgent } =
      req.body;

    if (
      !deviceId ||
      currentVersion === undefined ||
      expectedVersion === undefined
    ) {
      res.status(400).json({ success: false, message: "缺少必要的字段" });
      return;
    }

    (async () => {
      try {
        const existingStats = await DbStats.findOne({ deviceId });

        if (existingStats) {
          existingStats.currentVersion = currentVersion;
          existingStats.expectedVersion = expectedVersion;
          existingStats.timestamp = timestamp
            ? new Date(timestamp)
            : new Date();
          if (userAgent) existingStats.userAgent = userAgent;

          await existingStats.save();
          res
            .status(200)
            .json({ success: true, message: "数据库版本统计信息已更新" });
        } else {
          const newStats = new DbStats({
            deviceId,
            currentVersion,
            expectedVersion,
            timestamp: timestamp ? new Date(timestamp) : new Date(),
            userAgent,
          });

          await newStats.save();
          res
            .status(201)
            .json({ success: true, message: "数据库版本统计信息已保存" });
        }
      } catch (dbError) {
        console.error("数据库操作出错:", dbError);
        res.status(500).json({ success: false, message: "服务器错误" });
      }
    })();
  } catch (error) {
    console.error("保存数据库版本统计信息时出错:", error);
    res.status(500).json({ success: false, message: "服务器错误" });
  }
});

export default router;
