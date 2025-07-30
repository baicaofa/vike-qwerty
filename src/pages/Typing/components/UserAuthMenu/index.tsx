import { Link } from "@/components/Link";
import { getLocalizedHref } from "@/components/Link";
import { SyncStatusIndicator } from "@/components/SyncStatusIndicator";
import Tooltip from "@/components/Tooltip";
import UpdateNotification from "@/components/UpdateNotification";
import { useSync } from "@/hooks/useSync";
import { useToast } from "@/hooks/useToast";
import useAuthStore from "@/store/auth";
import type { SupportedLanguage } from "@/store/languageAtom";
import { Menu, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import IconCloudUpload from "~icons/tabler/cloud-upload";
import IconLogin from "~icons/tabler/login";
import IconLogout from "~icons/tabler/logout";
import IconMessageCircle from "~icons/tabler/message-circle";
import IconUserCircle from "~icons/tabler/user-circle";

interface UserAuthMenuProps {
  pageContext?: any;
}

export const UserAuthMenu: React.FC<UserAuthMenuProps> = ({
  pageContext: pageContextProp,
}: UserAuthMenuProps = {}) => {
  const { t } = useTranslation("typing");
  const { user, isAuthenticated, logout } = useAuthStore();
  const { triggerSync } = useSync();
  const { success, error } = useToast();

  // 获取页面上下文，用于国际化
  const pageContextFromHook = usePageContext();
  const pageContext = pageContextFromHook || pageContextProp;
  const currentLocale: SupportedLanguage =
    pageContext?.locale === "en" ? "en" : "zh";
  // 添加客户端渲染状态控制
  const [isClient, setIsClient] = useState(false);
  console.log("pageContext", pageContext);

  // 在客户端渲染后设置状态
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = () => {
    // 使用本地化的路径进行导航
    const localizedHref = getLocalizedHref("/login", currentLocale);
    navigate(localizedHref);
  };

  const handleProfile = () => {
    const localizedHref = getLocalizedHref("/profile", currentLocale);
    navigate(localizedHref);
  };

  const handleLogout = () => {
    logout();
    const localizedHref = getLocalizedHref("/", currentLocale);
    navigate(localizedHref);
  };

  const handleSync = async () => {
    success(t("userAuthMenu.sync.inProgress"));
    const result = await triggerSync("both");
    if (result?.success) {
      success(t("userAuthMenu.sync.success"));
    } else {
      const errorMessage =
        result?.error?.code === "EMAIL_NOT_VERIFIED"
          ? t("userAuthMenu.sync.emailNotVerified")
          : result?.error?.message || t("userAuthMenu.sync.unknownError");
      error(t("userAuthMenu.sync.failed", { error: errorMessage }));
    }
  };

  // 提取用户名的第一个字符
  const firstChar = user?.username ? user.username.charAt(0).toUpperCase() : "";

  // 未经客户端水合前，渲染一个空的占位符
  if (!isClient) {
    return <div className="flex items-center space-x-2" />;
  }

  // 已登录状态 - 显示用户名首字符和下拉菜单
  if (isAuthenticated) {
    return (
      <Menu
        as="div"
        className="relative inline-block text-left flex items-center space-x-2"
      >
        <Menu.Button className="rounded-lg px-1 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100">
          <div className="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white">
            <span>{firstChar}</span>
          </div>
        </Menu.Button>
        <Tooltip content={t("userAuthMenu.feedback")}>
          <Link
            href="/feedback/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-1 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100 flex items-center"
            aria-label={t("userAuthMenu.feedback")}
            title={t("userAuthMenu.feedback")}
            pageContext={pageContext}
          >
            <IconMessageCircle className="mr-1 h-5 w-5" />
            <span className="sr-only">{t("userAuthMenu.feedback")}</span>
          </Link>
        </Tooltip>
        <UpdateNotification />
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute top-full left-0 mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:text-white">
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={handleProfile}
                  className={`${
                    active
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-200"
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <IconUserCircle className="mr-2 h-5 w-5" />
                  {t("userAuthMenu.profile")}
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={handleSync}
                  className={`${
                    active
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-200"
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <IconCloudUpload className="mr-2 h-5 w-5" />
                  {t("userAuthMenu.syncData")}
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  onClick={handleLogout}
                  className={`${
                    active
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-200"
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <IconLogout className="mr-2 h-5 w-5" />
                  {t("userAuthMenu.logout")}
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    );
  }

  // 未登录状态 - 直接显示并排的注册和登录按钮
  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={handleLogin}
        className="rounded-lg px-3 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100 flex items-center"
      >
        <IconLogin className="mr-1 h-5 w-5" />
        <span>{t("userAuthMenu.login")}</span>
      </button>
      <Tooltip content={t("userAuthMenu.feedback")}>
        <Link
          href="/feedback/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("userAuthMenu.feedback")}
          title={t("userAuthMenu.feedback")}
          className="rounded-lg px-1 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100 flex items-center"
          pageContext={pageContext}
        >
          <IconMessageCircle className="mr-1 h-5 w-5" />
          <span className="sr-only">{t("userAuthMenu.feedback")}</span>
        </Link>
      </Tooltip>
      <UpdateNotification />
      <SyncStatusIndicator />
    </div>
  );
};
