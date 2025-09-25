import Header from "@/components/Header";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import useAuthStore from "@/store/auth";
import axios from "axios";
import { useEffect, useState } from "react";
import { navigate } from "vike/client/router";

export default function Page() {
  const { isAuthenticated, deleteAccount } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/auth/profile");
        setProfile(response.data);
      } catch (error: any) {
        setError(error.response?.data?.message || "获取个人资料失败");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError("");

    if (!deletePassword) {
      setDeleteError("请输入当前密码以确认注销账户");
      return;
    }

    try {
      setIsDeleting(true);
      await deleteAccount(deletePassword);
      await navigate("/");
    } catch (error: any) {
      setDeleteError(error.response?.data?.message || "注销账户失败");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
                个人资料
              </h2>

              {loading ? (
                <div className="text-center">加载中...</div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      用户名
                    </label>
                    <div className="mt-1 p-2 bg-gray-100 rounded-md">
                      {profile?.username}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      邮箱
                    </label>
                    <div className="mt-1 p-2 bg-gray-100 rounded-md">
                      {profile?.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      注册时间
                    </label>
                    <div className="mt-1 p-2 bg-gray-100 rounded-md">
                      {new Date(profile?.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-red-700">
                      注销账户
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      注销后会删除你的账户、云端学习记录、复习记录、熟词和自定义词库数据。此操作不可恢复。
                    </p>

                    {deleteError && (
                      <div className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">
                        {deleteError}
                      </div>
                    )}

                    <form
                      className="mt-4 space-y-3"
                      onSubmit={handleDeleteAccount}
                    >
                      <div>
                        <label
                          htmlFor="delete-account-password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          当前密码
                        </label>
                        <input
                          id="delete-account-password"
                          type="password"
                          value={deletePassword}
                          onChange={(event) =>
                            setDeletePassword(event.target.value)
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                          placeholder="输入当前密码"
                          autoComplete="current-password"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isDeleting}
                        className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:bg-red-300"
                      >
                        {isDeleting ? "正在注销账户" : "确认注销账户"}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
