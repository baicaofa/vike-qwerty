/**
 * 数据库重置工具
 * 用于清除IndexedDB中的RecordDB数据库
 */

export async function resetIndexedDB(): Promise<boolean> {
  try {
    console.log("🗑️ 开始清除IndexedDB中的RecordDB数据库...");

    // 获取所有数据库
    const databases = await indexedDB.databases();
    console.log("📋 发现的数据库:", databases);

    // 查找RecordDB
    const recordDB = databases.find((db) => db.name === "RecordDB");

    if (recordDB) {
      console.log("🎯 找到RecordDB，准备删除...");

      // 删除数据库
      const deleteRequest = indexedDB.deleteDatabase("RecordDB");

      return new Promise((resolve, reject) => {
        deleteRequest.onsuccess = () => {
          console.log("✅ RecordDB数据库删除成功");
          resolve(true);
        };

        deleteRequest.onerror = () => {
          console.error("❌ 删除RecordDB数据库失败:", deleteRequest.error);
          reject(deleteRequest.error);
        };

        deleteRequest.onblocked = () => {
          console.warn("⚠️ 数据库删除被阻塞，可能有其他连接正在使用");
          // 等待一段时间后重试
          setTimeout(() => {
            console.log("🔄 重试删除数据库...");
            resolve(false);
          }, 1000);
        };
      });
    } else {
      console.log("ℹ️ 未找到RecordDB数据库");
      return true;
    }
  } catch (error) {
    console.error("❌ 重置IndexedDB失败:", error);
    return false;
  }
}

/**
 * 清除所有相关的localStorage数据
 */
export function clearLocalStorage(): void {
  try {
    console.log("🗑️ 清除相关的localStorage数据...");

    // 清除数据库升级状态
    localStorage.removeItem("db_upgrade_status");

    // 清除其他可能相关的键
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.includes("db_") ||
          key.includes("database_") ||
          key.includes("record_"))
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`🗑️ 已删除localStorage键: ${key}`);
    });

    console.log("✅ localStorage清理完成");
  } catch (error) {
    console.error("❌ 清除localStorage失败:", error);
  }
}

/**
 * 完整的数据库重置
 */
export async function fullDatabaseReset(): Promise<boolean> {
  try {
    console.log("🚀 开始完整的数据库重置...");

    // 1. 清除localStorage
    clearLocalStorage();

    // 2. 重置IndexedDB
    const success = await resetIndexedDB();

    if (success) {
      console.log("✅ 数据库重置完成，建议刷新页面");
      return true;
    } else {
      console.log("⚠️ 数据库重置可能未完全成功，建议手动刷新页面");
      return false;
    }
  } catch (error) {
    console.error("❌ 完整数据库重置失败:", error);
    return false;
  }
}

// 在开发环境下暴露到全局对象，方便调试
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as any).resetDB = {
    resetIndexedDB,
    clearLocalStorage,
    fullDatabaseReset,
  };

  console.log("🔧 开发模式：数据库重置工具已暴露到 window.resetDB");
  console.log("使用方法：");
  console.log("- window.resetDB.fullDatabaseReset() - 完整重置");
  console.log("- window.resetDB.resetIndexedDB() - 只重置IndexedDB");
  console.log("- window.resetDB.clearLocalStorage() - 只清除localStorage");
}
