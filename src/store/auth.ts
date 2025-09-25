import axios from "axios";
import { create } from "zustand";

interface User {
  _id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    code: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  sendVerificationCode: (email: string) => Promise<void>;
  verifyEmail: (email: string, code: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    token: string,
    email: string,
    password: string
  ) => Promise<void>;
  completeRegistration: (
    username: string,
    email: string,
    password: string,
    code: string
  ) => Promise<void>;
}

// 检查是否在浏览器环境中
const isBrowser = typeof window !== "undefined";

// 安全地获取 localStorage 中的值
const getLocalStorageItem = (key: string): string | null => {
  if (isBrowser) {
    return localStorage.getItem(key);
  }
  return null;
};

// 安全地删除 localStorage 中的值
const removeLocalStorageItem = (key: string): void => {
  if (isBrowser) {
    localStorage.removeItem(key);
  }
};

axios.defaults.withCredentials = true;

// 安全地设置 localStorage 中的值
const setLocalStorageItem = (key: string, value: string): void => {
  if (isBrowser) {
    localStorage.setItem(key, value);
  }
};

// 从localStorage获取用户数据
const getUserFromLocalStorage = (): User | null => {
  const userString = getLocalStorageItem("user");
  if (userString) {
    try {
      return JSON.parse(userString);
    } catch (e) {
      console.error("解析用户数据失败:", e);
      return null;
    }
  }
  return null;
};

const initialUser = getUserFromLocalStorage();

const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  isAuthenticated: false,
  isEmailVerified: initialUser?.isEmailVerified || false,

  login: async (email: string, password: string) => {
    const response = await axios.post("/api/auth/login", { email, password });
    const user = response.data;

    setLocalStorageItem("user", JSON.stringify(user));

    set({
      user,
      isAuthenticated: true,
      isEmailVerified: user.isEmailVerified,
    });
  },

  register: async (
    username: string,
    email: string,
    password: string,
    code: string
  ) => {
    try {
      console.log("发送注册请求:", { username, email, code });

      const response = await axios.post("/api/auth/register", {
        username,
        email,
        password,
        code,
      });

      console.log("注册响应:", response.data);

      const user = response.data;

      setLocalStorageItem("user", JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isEmailVerified: true,
      });

      return response.data;
    } catch (error) {
      console.error("注册失败:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post("/api/auth/logout");
    } finally {
      removeLocalStorageItem("user");
      removeLocalStorageItem("lastSyncTimestamp");
      set({ user: null, isAuthenticated: false, isEmailVerified: false });
    }
  },

  deleteAccount: async (password: string) => {
    await axios.delete("/api/auth/account", { data: { password } });
    removeLocalStorageItem("user");
    removeLocalStorageItem("lastSyncTimestamp");
    set({ user: null, isAuthenticated: false, isEmailVerified: false });
  },

  checkAuth: async () => {
    try {
      const response = await axios.get("/api/auth/profile");
      const user = response.data;
      set({
        user,
        isAuthenticated: true,
        isEmailVerified: user.isEmailVerified,
      });
      setLocalStorageItem("user", JSON.stringify(user));
    } catch (error) {
      // Cookie 无效或过期，自动登出本地状态
      removeLocalStorageItem("user");
      set({ user: null, isAuthenticated: false, isEmailVerified: false });
    }
  },

  // 发送验证码
  sendVerificationCode: async (email: string) => {
    await axios.post("/api/auth/send-verification-code", { email });
  },

  // 验证邮箱
  verifyEmail: async (email: string, code: string) => {
    await axios.post("/api/auth/verify-email", { email, code });

    // 更新本地用户状态
    const user = getLocalStorageItem("user");
    if (user) {
      const userData = JSON.parse(user);
      userData.isEmailVerified = true;
      setLocalStorageItem("user", JSON.stringify(userData));
      set({ user: userData, isEmailVerified: true });
    }
  },

  // 完成注册
  completeRegistration: async (
    username: string,
    email: string,
    password: string,
    code: string
  ) => {
    try {
      console.log("准备发送完成注册请求:", { username, email, code });

      const response = await axios.post("/api/auth/complete-registration", {
        username,
        email,
        password,
        code,
      });

      console.log("完成注册响应:", response.data);

      if (!response.data || !response.data._id) {
        throw new Error("服务器响应格式错误");
      }

      const user = response.data;

      console.log("设置本地用户状态...");
      setLocalStorageItem("user", JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isEmailVerified: true,
      });

      console.log("完成注册流程成功");
      return response.data;
    } catch (error: any) {
      console.error("完成注册失败:", error);
      if (error.response) {
        console.error("服务器错误响应:", error.response.data);
        throw new Error(error.response.data.message || "完成注册失败");
      } else if (error.request) {
        console.error("网络请求错误:", error.request);
        throw new Error("网络连接失败，请检查网络设置");
      } else {
        console.error("其他错误:", error.message);
        throw error;
      }
    }
  },

  // 忘记密码
  forgotPassword: async (email: string) => {
    await axios.post("/api/auth/forgot-password", { email });
  },

  // 重置密码
  resetPassword: async (token: string, email: string, password: string) => {
    await axios.post("/api/auth/reset-password", { token, email, password });
  },
}));

export default useAuthStore;
