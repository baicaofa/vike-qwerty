import type { View } from "../type";
import useAuthStore from "@/store/auth";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export const ResetPasswordForm = ({
  token,
  email,
  setView,
}: {
  token: string;
  email: string;
  setView: (view: View) => void;
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuthStore();
  const { t } = useTranslation("login");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError(t("errorInputNewPassword"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("errorPasswordNotMatch"));
      return;
    }
    if (password.length < 6) {
      setError(t("errorPasswordLength"));
      return;
    }

    try {
      setLoading(true);
      setError("");
      await resetPassword(token, email, password);
      setSuccess(t("successReset"));
      setTimeout(() => {
        setView("login");
        // 清理URL参数
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }, 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || t("errorReset"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {t("resetPassword")}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {t("resetPasswordTip")}
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

      <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="password-reset" className="sr-only">
              {t("newPassword")}
            </label>
            <input
              id="password-reset"
              name="password"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder={t("newPasswordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirm-password-reset" className="sr-only">
              {t("confirmPassword")}
            </label>
            <input
              id="confirm-password-reset"
              name="confirm-password"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder={t("confirmPasswordPlaceholder")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? t("processing") : t("resetPassword")}
          </button>
        </div>
      </form>
    </>
  );
};
