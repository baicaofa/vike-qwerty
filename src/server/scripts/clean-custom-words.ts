import CustomWord from "../models/CustomWord";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";

// 加载项目根目录的 .env 文件
dotenv.config({ path: path.join(__dirname, "../../../.env") });

/**
 * 清理所有 CustomWord 数据的脚本
 * 用于重置到新的数据结构
 */
async function cleanCustomWords() {
  try {
    console.log("尝试连接数据库...");
    // 尝试使用正确的用户名
    const mongoUri =
      "mongodb://KEYBR:ePPNnmHpJA6eBbPt@47.88.56.222:27017/KEYBR";
    console.log("使用连接字符串:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("数据库连接成功");

    // 1. 统计当前数据
    const totalCount = await CustomWord.countDocuments();
    console.log(`当前 CustomWord 记录总数: ${totalCount}`);

    if (totalCount === 0) {
      console.log("没有需要清理的数据");
      return;
    }

    // 2. 按词库统计
    const dictStats = await CustomWord.aggregate([
      {
        $group: {
          _id: "$dictId",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("按词库统计:");
    dictStats.forEach((stat) => {
      console.log(`  词库 ${stat._id}: ${stat.count} 个单词`);
    });

    // 3. 确认删除
    console.log("\n⚠️  即将删除所有 CustomWord 数据！");
    console.log("这个操作不可逆，请确保您已经备份了重要数据。");

    // 在生产环境中，这里应该有用户确认步骤
    // 为了脚本自动化，我们直接执行删除

    // 4. 执行删除
    const deleteResult = await CustomWord.deleteMany({});
    console.log(`\n✅ 成功删除 ${deleteResult.deletedCount} 条记录`);

    // 5. 验证删除结果
    const remainingCount = await CustomWord.countDocuments();
    console.log(`剩余记录数: ${remainingCount}`);

    if (remainingCount === 0) {
      console.log("✅ 数据清理完成");
    } else {
      console.log("⚠️  仍有记录未删除，请检查");
    }
  } catch (error) {
    console.error("清理失败:", error);
  } finally {
    await mongoose.disconnect();
    console.log("数据库连接已关闭");
  }
}

// 运行清理脚本
if (require.main === module) {
  cleanCustomWords();
}

export { cleanCustomWords };
