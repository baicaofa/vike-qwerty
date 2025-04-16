/**
 * 生成一个随机的 UUID v4
 * 这个实现是兼容的，可以在所有环境中使用
 */
export function generateUUID(): string {
  // 使用 crypto.getRandomValues 如果可用，否则使用 Math.random
  const getRandomValues = (array: Uint8Array) => {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      return crypto.getRandomValues(array);
    }
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
    return array;
  };

  const buffer = new Uint8Array(16);
  getRandomValues(buffer);

  // 设置版本 (4) 和变体
  buffer[6] = (buffer[6] & 0x0f) | 0x40;
  buffer[8] = (buffer[8] & 0x3f) | 0x80;

  // 转换为十六进制字符串
  const hex = Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // 按照 UUID 格式分组
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}
