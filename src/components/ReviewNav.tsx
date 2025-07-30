import { Link } from "./ui/Link";
import { Button } from "./ui/button";
import { SettingsModal } from "@/components/settings/SettingsModal";
import { useTranslation } from "react-i18next";
import type React from "react";
import { useEffect, useState } from "react";
import { navigate } from "vike/client/router";

/**
 * 复习模块导航栏组件
 * 用于 review 目录下页面之间的导航
 */
const ReviewNav: React.FC = () => {
  const { t } = useTranslation();
  const [currentPath, setCurrentPath] = useState("/");
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);

  useEffect(() => {
    // 仅在客户端环境中获取当前路径
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  // 定义导航项
  const navItems = [
    { path: "/review/today", label: t("review:today.title") },
    { path: "/review/practice", label: t("review:practice.startPractice") },
    { path: "/review/history", label: t("review:history.title") },
    { path: "/review", label: t("review:dashboard.statistics") },
    // settings is now a modal
    // { path: "/review/settings", label: "复习设置" },
    { path: "/", label: t("common:navigation.home") },
  ];

  return (
    <>
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
                <Button
                  variant="ghost"
                  onClick={() => setSettingsModalOpen(true)}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  {t("review:nav.reviewSettings")}
                </Button>
              </div>
            </div>

            {/* 移动端下拉菜单 */}
            <div className="md:hidden">
              <select
                aria-label="Review Navigation"
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                value={currentPath}
                onChange={(e) => {
                  const path = e.target.value;
                  if (path === "settings") {
                    setSettingsModalOpen(true);
                  } else {
                    navigate(e.target.value);
                  }
                }}
              >
                {navItems.map((item) => (
                  <option key={item.path} value={item.path}>
                    {item.label}
                  </option>
                ))}
                <option value="settings">{t("review:nav.reviewSettings")}</option>
              </select>
            </div>
          </div>
        </div>
      </nav>
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </>
  );
};

export default ReviewNav;
