import Header from "@/components/Header";
import Layout from "@/components/Layout";
import useAuthStore from "@/store/auth";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function Page() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { sendVerificationCode, verifyEmail } = useAuthStore();

  useEffect(() => {
    // 从URL参数中获取邮箱
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSendCode = async () => {
    if (!email) {
      setError("请输入邮箱地址");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await sendVerificationCode(email);
      setSuccess("验证码已发送，请查收邮件");
      setCountdown(60); // 60秒倒计时
    } catch (error: any) {
      setError(error.response?.data?.message || "发送验证码失败");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !code) {
      setError("请输入邮箱和验证码");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await verifyEmail(email, code);
      setSuccess("邮箱验证成功");

      // 3秒后跳转到首页
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || "验证失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
              <EnvelopeIcon
                className="h-6 w-6 text-indigo-600"
                aria-hidden="true"
              />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              邮箱验证
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              我们已向{" "}
              <span className="font-medium text-indigo-600">{email}</span>{" "}
              发送了验证码
            </p>
          </div>

          {success && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {success}
                  </p>
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
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
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

          <form className="mt-8 space-y-6" onSubmit={handleVerify}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                邮箱地址
              </label>
              <div className="mt-1">
                <input
                  id="email"
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
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                验证码
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  id="code"
                  name="code"
                  type="text"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="请输入验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={loading || countdown > 0}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors duration-200"
                >
                  {countdown > 0 ? `${countdown}秒后重试` : "发送验证码"}
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                验证码有效期为15分钟，请尽快验证
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 transition-colors duration-200"
              >
                {loading ? (
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : null}
                {loading ? "处理中..." : "验证"}
              </button>
            </div>

            <div className="text-center">
              <a
                href="/login"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                返回登录
              </a>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
