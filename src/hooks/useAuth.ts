import useAuthStore from "@/store/auth";

export interface AuthUser {
  _id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  isAdmin?: boolean;
}

export interface UseAuthResult {
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  userData: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string,
    code: string
  ) => Promise<void>;
  checkAuth: () => Promise<void>;
}

/**
 * useAuth钩子，提供认证相关功能
 * @returns 认证相关状态和方法
 */
export const useAuth = (): UseAuthResult => {
  const {
    user,
    isAuthenticated,
    isEmailVerified,
    login,
    logout,
    register,
    checkAuth,
  } = useAuthStore();

  return {
    isAuthenticated,
    isEmailVerified,
    userData: user,
    login,
    logout,
    register,
    checkAuth,
  };
};
