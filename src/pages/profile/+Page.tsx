import Header from "@/components/Header";
import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import useAuthStore from "@/store/auth";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page() {
  const { user, token } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
        const response = await axios.get("/api/auth/profile");
        setProfile(response.data);
      } catch (error: any) {
        setError(error.response?.data?.message || "获取个人资料失败");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    }
  }, [token]);

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
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
