import axios from "axios";
import { create } from "zustand";

// 配置 axios 默认值
axios.defaults.baseURL = "http://localhost:5000";

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

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const response = await axios.post("/api/auth/login", { email, password });
    const { token, ...user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    set({ user, token, isAuthenticated: true });
  },

  register: async (username: string, email: string, password: string) => {
    const response = await axios.post("/api/auth/register", {
      username,
      email,
      password,
    });
    const { token, ...user } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
