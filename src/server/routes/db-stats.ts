import DbStats from "../models/DbStats";
import express from "express";

const router = express.Router();

// 接收数据库版本统计信息的POST请求
router.post("/", async (req, res) => {
  try {
    const { deviceId, currentVersion, expectedVersion, timestamp, userAgent } =
      req.body;

    // 验证必要的字段
    if (
      !deviceId ||
      currentVersion === undefined ||
      expectedVersion === undefined
    ) {
      return res
        .status(400)
        .json({ success: false, message: "缺少必要的字段" });
    }

    // 查找是否已存在该设备的记录
    const existingStats = await DbStats.findOne({ deviceId });

    if (existingStats) {
      // 如果存在记录，则更新
      existingStats.currentVersion = currentVersion;
      existingStats.expectedVersion = expectedVersion;
      existingStats.timestamp = timestamp ? new Date(timestamp) : new Date();
      if (userAgent) existingStats.userAgent = userAgent;

      await existingStats.save();
      return res
        .status(200)
        .json({ success: true, message: "数据库版本统计信息已更新" });
    } else {
      // 如果不存在记录，则创建新记录
      const newStats = new DbStats({
        deviceId,
        currentVersion,
        expectedVersion,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        userAgent,
      });

      await newStats.save();
      return res
        .status(201)
        .json({ success: true, message: "数据库版本统计信息已保存" });
    }
  } catch (error) {
    console.error("保存数据库版本统计信息时出错:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

// 获取数据库版本统计信息的GET请求
router.get("/", async (req, res) => {
  try {
    // 获取所有设备的最新记录
    const stats = await DbStats.find().sort({ timestamp: -1 });

    // 按版本分组统计
    const versionCounts = stats.reduce((acc, stat) => {
      const version = stat.currentVersion;
      if (!acc[version]) {
        acc[version] = 0;
      }
      acc[version]++;
      return acc;
    }, {} as Record<number, number>);

    return res.status(200).json({
      success: true,
      stats,
      versionCounts,
      totalDevices: stats.length,
    });
  } catch (error) {
    console.error("获取数据库版本统计信息时出错:", error);
    return res.status(500).json({ success: false, message: "服务器错误" });
  }
});

export default router;
