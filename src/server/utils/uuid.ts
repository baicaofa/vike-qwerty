import { randomUUID } from "crypto";

/**
 * 生成一个随机的 UUID v4
 * 服务器端实现，使用Node.js内置的crypto模块
 */
export function generateUUID(): string {
  return randomUUID();
}
