import { Link } from "./ui/Link";
import type React from "react";
import { useEffect, useState } from "react";

/**
 * 反馈模块导航栏组件
 * 用于 feedback 页面导航
 */
const FeedbackNav: React.FC = () => {
  const [currentPath, setCurrentPath] = useState("/");

  useEffect(() => {
    // 仅在客户端环境中获取当前路径
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // 定义导航项
  const navItems = [
    { path: "/feedback", label: "用户反馈" },
    { path: "/", label: "返回首页" },
  ];

  return (
    <nav className="mb-6 bg-white shadow-sm dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex-shrink-0"></div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    currentPath === item.path
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
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
              className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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

export default FeedbackNav;
