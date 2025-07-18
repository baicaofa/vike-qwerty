import axios from "axios";
import React, { useEffect, useState } from "react";

interface DictStat {
  dictName: string;
  wordCount: number;
}

interface UserPracticeStat {
  userId: string;
  username: string;
  email: string;
  createdAt: string;
  lastLogin?: string;
  dictStats: DictStat[];
  totalPracticeCount: number;
}

interface StatsResponse {
  success: boolean;
  userCount: number;
  userPracticeStats: UserPracticeStat[];
  totalUserPages: number;
  currentUserPage: number;
}

export default function BlockStats() {
  const [userCount, setUserCount] = useState<number>(0);
  const [userPracticeStats, setUserPracticeStats] = useState<
    UserPracticeStat[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserPracticeStat | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 50;

  // 初始加载 summary 数据
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await axios.get<StatsResponse>(
          "/api/db-stats?dataType=summary"
        );
        setUserCount(response.data.userCount || 0);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "加载失败");
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  // 加载用户练习统计（按需）
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get<StatsResponse>(
          `/api/db-stats?dataType=userStats&page=${page}&limit=${limit}`
        );
        setUserPracticeStats(response.data.userPracticeStats || []);
        setTotalPages(response.data.totalUserPages || 1);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "加载失败");
        setLoading(false);
      }
    };
    fetchUserStats();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">用户统计</h1>
      {loading ? (
        <div>加载中...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-2">用户总数</h2>
            <p className="text-3xl font-bold">{userCount}</p>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">用户列表</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr>
                    <th className="border px-2 py-1">用户名</th>
                    <th className="border px-2 py-1">邮箱</th>
                    <th className="border px-2 py-1">注册时间</th>
                    <th className="border px-2 py-1">最近登录</th>
                    <th className="border px-2 py-1">练习总数</th>
                  </tr>
                </thead>
                <tbody>
                  {userPracticeStats.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-2">
                        暂无数据
                      </td>
                    </tr>
                  ) : (
                    userPracticeStats.map((user) => (
                      <tr
                        key={user.userId}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => setSelectedUser(user)}
                      >
                        <td className="border px-2 py-1">
                          {user.username || "未知"}
                        </td>
                        <td className="border px-2 py-1">
                          {user.email || "未提供"}
                        </td>
                        <td className="border px-2 py-1">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleString()
                            : "未注册"}
                        </td>
                        <td className="border px-2 py-1">
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleString()
                            : "未登录"}
                        </td>
                        <td className="border px-2 py-1">
                          {user.totalPracticeCount || 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {/* 分页控件 */}
            <div className="mt-4 flex justify-center gap-2">
              <button
                className="px-4 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
              >
                上一页
              </button>
              <span>
                第 {page} 页 / 共 {totalPages} 页
              </span>
              <button
                className="px-4 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
              >
                下一页
              </button>
            </div>
          </section>

          {/* 用户详情弹窗 */}
          {selectedUser && (
            <div
              className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
              onClick={() => setSelectedUser(null)}
            >
              <div
                className="bg-white rounded shadow-lg p-6 min-w-[320px] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-2">
                  {selectedUser.username} 的练习详情
                </h3>
                <p className="mb-2">邮箱：{selectedUser.email || "未提供"}</p>
                <p className="mb-2">
                  注册时间：
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleString()
                    : "未注册"}
                </p>
                <p className="mb-2">
                  最近登录：
                  {selectedUser.lastLogin
                    ? new Date(selectedUser.lastLogin).toLocaleString()
                    : "未登录"}
                </p>
                <p className="mb-2">
                  练习总数：{selectedUser.totalPracticeCount || 0}
                </p>
                <h4 className="font-semibold mt-4 mb-2">词典细分练习次数</h4>
                <table className="min-w-full border mb-2">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">词典</th>
                      <th className="border px-2 py-1">单词数量</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedUser.dictStats.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="text-center py-2">
                          无练习数据
                        </td>
                      </tr>
                    ) : (
                      selectedUser.dictStats.map((dict) => (
                        <tr key={dict.dictName}>
                          <td className="border px-2 py-1">{dict.dictName}</td>
                          <td className="border px-2 py-1">{dict.wordCount}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
                <button
                  className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => setSelectedUser(null)}
                >
                  关闭
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
