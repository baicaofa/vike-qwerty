import axios from "axios";
import { useEffect, useState } from "react";

interface DbStat {
  _id: string;
  deviceId: string;
  currentVersion: number;
  expectedVersion: number;
  timestamp: string;
  userAgent: string;
}

interface DbStatsResponse {
  success: boolean;
  stats: DbStat[];
  versionCounts: Record<number, number>;
  totalDevices: number;
  totalStatsPages: number;
  currentStatsPage: number;
}

export default function DbVersionStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DbStat[]>([]);
  const [versionCounts, setVersionCounts] = useState<Record<number, number>>(
    {}
  );
  const [totalDevices, setTotalDevices] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get<DbStatsResponse>(
          `/api/db-stats?dataType=summary&page=${page}&limit=${limit}`
        );

        if (response.data.success) {
          setStats(response.data.stats || []);
          setVersionCounts(response.data.versionCounts || {});
          setTotalDevices(response.data.totalDevices || 0);
          setTotalPages(response.data.totalStatsPages || 1);
        } else {
          setError("获取数据库版本统计信息失败");
        }
      } catch (err) {
        setError("获取数据库版本统计信息时出错");
        console.error("获取数据库版本统计信息时出错:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // 计算最新版本的用户比例
  const calculateLatestVersionPercentage = () => {
    if (totalDevices === 0) return 0;
    const latestVersion = Math.max(...Object.keys(versionCounts).map(Number));
    const latestVersionCount = versionCounts[latestVersion] || 0;
    return (latestVersionCount / totalDevices) * 100;
  };

  if (loading) {
    return <div className="p-4">加载中...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">数据库版本统计</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">总设备数</h2>
          <p className="text-3xl font-bold">{totalDevices}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">使用最新版本的比例</h2>
          <p className="text-3xl font-bold">
            {calculateLatestVersionPercentage().toFixed(2)}%
          </p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">需要升级的设备数</h2>
          <p className="text-3xl font-bold">
            {totalDevices - (versionCounts[7] || 0)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">版本分布</h2>
        <div className="bg-white p-4 rounded shadow">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">版本</th>
                <th className="px-4 py-2 text-left">设备数</th>
                <th className="px-4 py-2 text-left">百分比</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(versionCounts)
                .sort((a, b) => Number(b[0]) - Number(a[0]))
                .map(([version, count]) => (
                  <tr key={version}>
                    <td className="px-4 py-2">
                      {version}
                      {Number(version) === 7 && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          最新
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">{count}</td>
                    <td className="px-4 py-2">
                      {((count / totalDevices) * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-3">设备详情</h2>
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">设备ID</th>
                <th className="px-4 py-2 text-left">当前版本</th>
                <th className="px-4 py-2 text-left">期望版本</th>
                <th className="px-4 py-2 text-left">上报时间</th>
                <th className="px-4 py-2 text-left">浏览器信息</th>
              </tr>
            </thead>
            <tbody>
              {stats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-2">
                    暂无数据
                  </td>
                </tr>
              ) : (
                stats.map((stat) => (
                  <tr key={stat._id}>
                    <td className="px-4 py-2">{stat.deviceId}</td>
                    <td className="px-4 py-2">
                      {stat.currentVersion}
                      {stat.currentVersion < stat.expectedVersion && (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          需升级
                        </span>
                      )}
                      {stat.currentVersion === stat.expectedVersion && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          最新
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2">{stat.expectedVersion}</td>
                    <td className="px-4 py-2">
                      {new Date(stat.timestamp).toLocaleString()}
                    </td>
                    <td
                      className="px-4 py-2 truncate max-w-xs"
                      title={stat.userAgent}
                    >
                      {stat.userAgent}
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
      </div>
    </div>
  );
}
