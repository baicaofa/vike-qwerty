// 检查是否在浏览器环境中
const isBrowser = typeof window !== "undefined";

// 安全地获取 localStorage 中的值
export const getLocalStorageItem = (key: string): string | null => {
  if (isBrowser) {
    return localStorage.getItem(key);
  }
  return null;
};

// 安全地设置 localStorage 中的值
export const setLocalStorageItem = (key: string, value: string): void => {
  if (isBrowser) {
    localStorage.setItem(key, value);
  }
};

// 安全地删除 localStorage 中的值
export const removeLocalStorageItem = (key: string): void => {
  if (isBrowser) {
    localStorage.removeItem(key);
  }
};

// 语言偏好相关的localStorage操作
const LANGUAGE_PREFERENCE_KEY = "language-preference";

// 获取语言偏好
export const getLanguagePreference = (): string | null => {
  return getLocalStorageItem(LANGUAGE_PREFERENCE_KEY);
};

// 设置语言偏好
export const setLanguagePreference = (language: string): void => {
  setLocalStorageItem(LANGUAGE_PREFERENCE_KEY, language);
};

// 清除语言偏好
export const clearLanguagePreference = (): void => {
  removeLocalStorageItem(LANGUAGE_PREFERENCE_KEY);
};
