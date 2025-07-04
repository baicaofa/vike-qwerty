import type { View } from "../type";
import useAuthStore from "@/store/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export const RegisterForm = ({
  setView,
}: {
  setView: (view: View) => void;
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const { register, sendVerificationCode } = useAuthStore();

  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  }, [password]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return "非常弱";
    if (passwordStrength === 2) return "弱";
    if (passwordStrength === 3) return "中等";
    if (passwordStrength === 4) return "强";
    return "非常强";
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength === 2) return "bg-yellow-500";
    if (passwordStrength === 3) return "bg-blue-500";
    if (passwordStrength >= 4) return "bg-green-500";
    return "bg-gray-200";
  };

  const handleSendCode = async () => {
    if (!email) {
      setError("请输入邮箱地址");
      return;
    }

    try {
      setSendingCode(true);
      setError("");
      await sendVerificationCode(email);
      setSuccess("验证码已发送，请查收邮件");
      setCountdown(60);
    } catch (error: any) {
      setError(error.response?.data?.message || "发送验证码失败，请重试");
    } finally {
      setSendingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !verificationCode
    ) {
      setError("请填写所有必填字段");
      return;
    }
    if (password !== confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }
    if (password.length < 6) {
      setError("密码长度至少为6位");
      return;
    }

    setLoading(true);
    try {
      await register(username, email, password, verificationCode);
      setSuccess("注册成功！即将跳转到登录页...");
      setTimeout(() => {
        setView("login");
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.message || "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
          创建新账户
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          加入我们，开始您的打字之旅
        </p>
      </div>

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              用户名
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="请输入您的用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email-register"
              className="block text-sm font-medium text-gray-700"
            >
              邮箱地址
            </label>
            <div className="mt-1">
              <input
                id="email-register"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="请输入您的邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password-register"
              className="block text-sm font-medium text-gray-700"
            >
              密码
            </label>
            <div className="mt-1 relative">
              <input
                id="password-register"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                placeholder="请输入您的密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <EyeIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">密码强度</span>
                  <span className="text-xs font-medium text-gray-600">
                    {getPasswordStrengthText()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className={`h-1.5 rounded-full ${getPasswordStrengthColor()}`}
                    style={{ width: `${passwordStrength * 20}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              确认密码
            </label>
            <div className="mt-1 relative">
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10"
                placeholder="请再次输入您的密码"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                ) : (
                  <EyeIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="verification-code"
              className="block text-sm font-medium text-gray-700"
            >
              邮箱验证码
            </label>
            <div className="mt-1 flex space-x-2">
              <input
                id="verification-code"
                name="verification-code"
                type="text"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="请输入验证码"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sendingCode || countdown > 0}
                className="w-48 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
              >
                {sendingCode
                  ? "发送中..."
                  : countdown > 0
                  ? `${countdown}s`
                  : "获取验证码"}
              </button>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={() => setView("login")}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            已有账户？前往登录
          </button>
        </div>
      </form>
    </>
  );
};
