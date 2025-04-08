import axios from "axios";
import { create } from "zustand";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
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

  login: async (email: string, password: string) => {
    const response = await axios.post("/api/auth/login", { email, password });
    const { token, ...user } = response.data;

    setLocalStorageItem("token", token);
    setLocalStorageItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  register: async (username: string, email: string, password: string) => {
    const response = await axios.post("/api/auth/register", {
      username,
      email,
      password,
    });
    const { token, ...user } = response.data;

    setLocalStorageItem("token", token);
    setLocalStorageItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
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
}));

export default useAuthStore;
