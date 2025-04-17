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
  token: string | null;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    code: string
  ) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
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

// 安全地设置 localStorage 中的值
const setLocalStorageItem = (key: string, value: string): void => {
  if (isBrowser) {
    localStorage.setItem(key, value);
  }
};

// 安全地删除 localStorage 中的值
const removeLocalStorageItem = (key: string): void => {
  if (isBrowser) {
    localStorage.removeItem(key);
  }
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: getLocalStorageItem("token"),
  isAuthenticated: !!getLocalStorageItem("token"),
  isEmailVerified: false,

  login: async (email: string, password: string) => {
    const response = await axios.post("/api/auth/login", { email, password });
    const { token, ...user } = response.data;

    setLocalStorageItem("token", token);
    setLocalStorageItem("user", JSON.stringify(user));
    set({
      user,
      token,
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

      const { token, ...user } = response.data;

      setLocalStorageItem("token", token);
      setLocalStorageItem("user", JSON.stringify(user));
      set({
        user,
        token,
        isAuthenticated: true,
        isEmailVerified: true,
      });

      return response.data;
    } catch (error) {
      console.error("注册失败:", error);
      throw error;
    }
  },

  logout: () => {
    removeLocalStorageItem("token");
    removeLocalStorageItem("lastSyncTimestamp");
    delete axios.defaults.headers.common["Authorization"];
    set({ user: null, token: null, isAuthenticated: false });
  },

  checkAuth: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      set({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
      });
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
      set({ user: userData });
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

      if (!response.data || !response.data.token) {
        throw new Error("服务器响应格式错误");
      }

      const { token, ...user } = response.data;

      console.log("设置本地存储和状态...");
      setLocalStorageItem("token", token);
      setLocalStorageItem("user", JSON.stringify(user));

      set({
        user,
        token,
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
