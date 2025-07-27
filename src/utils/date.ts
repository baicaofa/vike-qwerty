/**
 * 格式化日期为本地字符串
 * @param date 日期对象或时间戳
 * @returns 格式化后的日期字符串，如 "2023-05-20 14:30:45"
 */
export function formatDate(date: Date | number): string {
  const d = typeof date === "number" ? new Date(date) : date;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 格式化日期为相对时间（如"3天前"）
 * @param date 日期对象或时间戳
 * @returns 相对时间字符串
 */
export function formatRelativeTime(date: Date | number): string {
  const d = typeof date === "number" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();

  // 转换为秒
  const diffSec = Math.floor(diffMs / 1000);

  // 小于1分钟
  if (diffSec < 60) {
    return "刚刚";
  }

  // 小于1小时
  if (diffSec < 3600) {
    const minutes = Math.floor(diffSec / 60);
    return `${minutes}分钟前`;
  }

  // 小于1天
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    return `${hours}小时前`;
  }

  // 小于30天
  if (diffSec < 2592000) {
    const days = Math.floor(diffSec / 86400);
    return `${days}天前`;
  }

  // 小于12个月
  if (diffSec < 31536000) {
    const months = Math.floor(diffSec / 2592000);
    return `${months}个月前`;
  }

  // 大于等于12个月
  const years = Math.floor(diffSec / 31536000);
  return `${years}年前`;
}
