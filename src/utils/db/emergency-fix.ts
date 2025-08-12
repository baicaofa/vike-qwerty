import { db } from "./index";

/**
 * 紧急修复脚本 - 可以在浏览器控制台中手动执行
 * 使用方法：在浏览器控制台中执行 window.emergencyFixUuidConstraints()
 */
export async function emergencyFixUuidConstraints(): Promise<void> {
  console.log("🚨 开始紧急修复 uuid 约束错误...");

  try {
    // 关闭数据库连接
    await db.close();
    console.log("📴 数据库连接已关闭");

    // 删除数据库
    await db.delete();
    console.log("🗑️ 数据库已删除");

    // 重新打开数据库
    await db.open();
    console.log("🔄 数据库已重新打开");

    console.log("✅ 紧急修复完成，请刷新页面");

    // 提示用户刷新页面
    if (confirm("数据库已重置，请刷新页面以重新初始化。是否现在刷新？")) {
      window.location.reload();
    }
  } catch (error) {
    console.error("❌ 紧急修复失败:", error);
    alert("紧急修复失败，请手动清除浏览器数据");
  }
}

// 将函数挂载到全局对象，方便在控制台调用
if (typeof window !== "undefined") {
  (window as any).emergencyFixUuidConstraints = emergencyFixUuidConstraints;
  console.log("🔧 紧急修复函数已挂载到 window.emergencyFixUuidConstraints");
  console.log(
    "💡 如需修复 uuid 约束错误，请在控制台执行：window.emergencyFixUuidConstraints()"
  );
}
