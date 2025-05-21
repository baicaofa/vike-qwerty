import type { IUser } from "../server/models/User";
// 确保 WordRecordModel 和 IUser 的路径正确
import WordRecordModel, {
  IPerformanceEntry,
  IWordRecord,
} from "../server/models/WordRecord";
import mongoose from "mongoose";

// 如果 WordRecord.userId 是 IUser 类型
// import { v4 as uuidv4 } from 'uuid'; // 如果需要生成新的 UUID，请安装并导入 uuid 包

// 假设这是您旧的、扁平化的 WordRecord 文档结构
// 请根据您的实际旧结构调整此接口
interface IOldFlatWordRecord {
  _id: mongoose.Types.ObjectId;
  uuid?: string; // 旧记录可能有的 UUID
  userId: mongoose.Types.ObjectId | IUser;
  word: string;
  dict: string;
  // 以下是代表单次练习的扁平化字段
  timeStamp: Date;
  chapter: number | null;
  timing: number[];
  wrongCount: number;
  mistakes: { [index: number]: string[] };
  // 其他可能存在的旧字段
  last_modified: number; // 假设是 Unix 时间戳
  clientModifiedAt?: Date;
  // isDeleted?: boolean; // 旧记录可能没有此字段
}

async function migrateWordRecords() {
  // 1. 连接到 MongoDB
  // 请替换为您的 MongoDB 连接字符串和配置
  // 例如:
  try {
    await mongoose.connect(
      "mongodb://KEYBR:ePPNnmHpJA6eBbPt@47.88.56.222:27017/KEYBR"
    );
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    return; // 连接失败则退出
  }

  console.log("开始 WordRecord 数据迁移...");

  try {
    // 2. 查询所有现有的 "扁平化" WordRecord 文档
    //    识别旧记录的条件可能需要调整。
    //    这里假设旧记录的顶层有 'timeStamp' 字段，而没有 'performanceHistory' 字段。
    const oldRecords = (await WordRecordModel.find({
      timeStamp: { $exists: true }, // 假设 timeStamp 在顶层表明是旧记录
      performanceHistory: { $exists: false }, // 并且没有 performanceHistory 字段
    }).lean()) as unknown as IOldFlatWordRecord[]; // .lean() 提高处理大量数据时的性能

    if (oldRecords.length === 0) {
      console.log("没有找到需要迁移的旧版 WordRecord 文档。");
      // await mongoose.disconnect(); // 如果在此处管理连接
      return;
    }

    console.log(`找到 ${oldRecords.length} 条旧版记录待处理。`);

    // 3. 按 userId, dict, 和 word 对这些文档进行分组
    const groupedRecords = oldRecords.reduce(
      (acc, record) => {
        const userIdString = record.userId.toString(); // 将 ObjectId 转换为字符串作为键的一部分
        const key = `${userIdString}-${record.dict}-${record.word}`;

        if (!acc[key]) {
          acc[key] = {
            userId: record.userId,
            dict: record.dict,
            word: record.word,
            flatEntries: [],
            uuidsFromOldRecords: new Set<string>(),
            minFirstSeenAt: record.timeStamp, // 初始化为当前记录的时间戳
            maxLastPracticedAt: record.timeStamp, // 初始化为当前记录的时间戳
            allLastModified: [], // 收集所有 last_modified 时间戳
          };
        }
        acc[key].flatEntries.push(record);
        if (record.uuid) {
          acc[key].uuidsFromOldRecords.add(record.uuid);
        }
        if (record.timeStamp < acc[key].minFirstSeenAt) {
          acc[key].minFirstSeenAt = record.timeStamp;
        }
        if (record.timeStamp > acc[key].maxLastPracticedAt) {
          acc[key].maxLastPracticedAt = record.timeStamp;
        }
        if (typeof record.last_modified === "number") {
          acc[key].allLastModified.push(record.last_modified);
        }

        return acc;
      },
      {} as Record<
        string,
        {
          userId: mongoose.Types.ObjectId | IUser;
          dict: string;
          word: string;
          flatEntries: IOldFlatWordRecord[];
          uuidsFromOldRecords: Set<string>;
          minFirstSeenAt: Date;
          maxLastPracticedAt: Date;
          allLastModified: number[];
        }
      >
    );

    const idsOfOldRecordsToDelete: mongoose.Types.ObjectId[] = [];

    // 4. 为每个分组创建一个新的 WordRecord 文档
    for (const key in groupedRecords) {
      const group = groupedRecords[key];
      const performanceHistory: IPerformanceEntry[] = group.flatEntries
        .map((oldEntry) => ({
          timeStamp: oldEntry.timeStamp,
          chapter: oldEntry.chapter,
          timing: oldEntry.timing,
          wrongCount: oldEntry.wrongCount,
          mistakes: oldEntry.mistakes,
          // 如果旧记录的 uuid 是针对单次练习的，可以考虑在这里生成 entryUuid
          // entryUuid: oldEntry.uuid || uuidv4(),
        }))
        .sort((a, b) => a.timeStamp.getTime() - b.timeStamp.getTime()); // 按时间戳排序

      // 为新的聚合记录确定 UUID
      // 策略：如果旧记录中有 UUID，尝试使用其中一个；否则生成一个新的。
      // WordRecord 模型要求 uuid 唯一。
      const newAggregatedUuid =
        group.uuidsFromOldRecords.values().next().value ??
        `migrated-${group.userId.toString()}-${group.dict}-${
          group.word
        }-${Date.now()}`;

      const latestLastModified =
        group.allLastModified.length > 0
          ? Math.max(...group.allLastModified)
          : Date.now(); // 如果没有找到旧的 last_modified，则使用当前时间

      const newRecordData: Partial<IWordRecord> = {
        uuid: newAggregatedUuid,
        userId: group.userId,
        dict: group.dict,
        word: group.word,
        performanceHistory: performanceHistory,
        firstSeenAt: group.minFirstSeenAt,
        lastPracticedAt: group.maxLastPracticedAt,
        sync_status: "synced", // 服务器端迁移后通常认为是已同步状态
        last_modified: latestLastModified,
        clientModifiedAt: new Date(latestLastModified), // 从时间戳转换
        isDeleted: false,
      };

      try {
        // 使用 (userId, dict, word) 作为查询条件进行 upsert，以处理脚本重跑的幂等性
        // WordRecordSchema 中 (userId, dict, word) 的唯一索引会确保不会创建重复记录
        // 但需要注意 uuid 也必须是唯一的。
        // 更好的做法是先查询，如果不存在则创建，如果存在则根据业务逻辑更新或跳过。

        const existingMigratedRecord = await WordRecordModel.findOne({
          userId: group.userId,
          dict: group.dict,
          word: group.word,
        });

        if (existingMigratedRecord) {
          console.warn(`已存在针对分组 ${key} 的迁移后记录。将尝试合并/更新。`);
          // 更新逻辑：例如合并 performanceHistory，更新时间戳等
          // 注意：合并 performanceHistory 需要仔细处理，避免重复项
          // existingMigratedRecord.performanceHistory = mergeHistories(existingMigratedRecord.performanceHistory, performanceHistory);
          // existingMigratedRecord.firstSeenAt = newRecordData.firstSeenAt < existingMigratedRecord.firstSeenAt ? newRecordData.firstSeenAt : existingMigratedRecord.firstSeenAt;
          // existingMigratedRecord.lastPracticedAt = newRecordData.lastPracticedAt > existingMigratedRecord.lastPracticedAt ? newRecordData.lastPracticedAt : existingMigratedRecord.lastPracticedAt;
          // existingMigratedRecord.last_modified = newRecordData.last_modified;
          // existingMigratedRecord.clientModifiedAt = newRecordData.clientModifiedAt;
          // await existingMigratedRecord.save();
          // 当前简单跳过，如果需要更新，请实现上述合并逻辑
        } else {
          await WordRecordModel.create(newRecordData as IWordRecord);
          console.log(`为分组 ${key} 创建了新的聚合记录。`);
        }

        // 标记该组内的旧记录ID以便删除
        group.flatEntries.forEach((oldEntry) =>
          idsOfOldRecordsToDelete.push(oldEntry._id)
        );
      } catch (error) {
        console.error(`处理分组 ${key} 时出错:`, error);
        // 根据需要决定错误处理策略：停止脚本、记录错误并继续等
      }
    }

    // 5. 删除旧的、扁平化的 WordRecord 文档
    if (idsOfOldRecordsToDelete.length > 0) {
      console.log(
        `准备删除 ${idsOfOldRecordsToDelete.length} 条旧版扁平化记录...`
      );
      // **警告：这是一个破坏性操作。在生产环境中执行前，请务必备份数据！**
      // 考虑先软删除或标记为已迁移，而不是直接硬删除。
      const deleteResult = await WordRecordModel.deleteMany({
        _id: { $in: idsOfOldRecordsToDelete },
      });
      console.log(`成功删除了 ${deleteResult.deletedCount} 条旧版扁平化记录。`);
    } else {
      console.log("没有旧记录被标记为删除（可能已处理或跳过）。");
    }

    console.log("WordRecord 数据迁移成功完成。");
  } catch (error) {
    console.error("WordRecord 数据迁移过程中发生错误:", error);
  } finally {
    // 6. 断开 MongoDB 连接 (如果连接是在此脚本中管理的)
    // await mongoose.disconnect();
    // console.log('MongoDB connection closed.');
  }
}

// --- 如何运行此脚本 ---
// 1. 确保 MongoDB 服务正在运行且可访问。
// 2. 在脚本顶部配置好 MongoDB 的连接字符串。
// 3. 如果需要生成 UUID，安装 `uuid` 包: `npm install uuid` 或 `yarn add uuid`，并取消注释相关导入。
// 4. 使用 ts-node 执行脚本: `npx ts-node src/scripts/migrate-wordrecords.ts`
//
// 调用迁移函数 (通常在脚本末尾，确保在连接建立后执行):
// migrateWordRecords()
//   .then(() => console.log('迁移脚本执行完毕。'))
//   .catch(e => console.error('迁移脚本执行失败:', e))
//   .finally(() => {
//     // 确保在所有操作完成后关闭连接（如果在此脚本中打开）
//     // mongoose.disconnect();
//   });

// 示例：直接调用（确保在 mongoose.connect 成功后）
// (async () => {
//   await mongoose.connect('YOUR_MONGO_URI'); // 替换为你的连接 URI
//   await migrateWordRecords();
//   await mongoose.disconnect();
// })();
