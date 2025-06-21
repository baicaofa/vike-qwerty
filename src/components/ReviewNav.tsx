import { Link } from "./ui/Link";
import type React from "react";
import { useEffect, useState } from "react";

/**
 * 复习模块导航栏组件
 * 用于 review 目录下页面之间的导航
 */
const ReviewNav: React.FC = () => {
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    // 仅在客户端环境中获取当前路径
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // 定义导航项
  const navItems = [
    { path: "/review/today", label: "今日复习" },
    { path: "/review/practice", label: "开始练习" },
    { path: "/review/history", label: "复习历史" },
    { path: "/review/dashboard", label: "数据统计" },
    { path: "/review/settings", label: "复习设置" },
    { path: "/", label: "返回首页" },
  ];

  return (
    <nav className="bg-white shadow-sm mb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex-shrink-0"></div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    currentPath === item.path
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 移动端下拉菜单 */}
          <div className="md:hidden">
            <select
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={currentPath}
              onChange={(e) => {
                if (typeof window !== "undefined") {
                  window.location.href = e.target.value;
                }
              }}
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ReviewNav;
