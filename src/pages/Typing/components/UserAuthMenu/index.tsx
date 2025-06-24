import { SyncStatusIndicator } from "@/components/SyncStatusIndicator";
import Tooltip from "@/components/Tooltip";
import UpdateNotification from "@/components/UpdateNotification";
import useAuthStore from "@/store/auth";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { navigate } from "vike/client/router";
import IconLogin from "~icons/tabler/login";
import IconLogout from "~icons/tabler/logout";
import IconMessageCircle from "~icons/tabler/message-circle";
import IconUser from "~icons/tabler/user";
import IconUserCircle from "~icons/tabler/user-circle";

export const UserAuthMenu = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogin = () => {
    navigate("/login/");
  };

  const handleRegister = () => {
    navigate("/register/");
  };

  const handleProfile = () => {
    navigate("/profile/");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // 提取用户名的第一个字符
  const firstChar = user?.username ? user.username.charAt(0) : "";

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
        <Tooltip content="问题反馈">
          <a href="/feedback/" target="_blank" rel="noopener noreferrer">
            <button className="rounded-lg px-1 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100 flex items-center">
              <IconMessageCircle className="mr-1 h-5 w-5" />
            </button>
          </a>
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
                  onClick={handleProfile}
                  className={`${
                    active
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-200"
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <IconUserCircle className="mr-2 h-5 w-5" />
                  个人资料
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={handleLogout}
                  className={`${
                    active
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 dark:text-gray-200"
                  } flex w-full items-center px-4 py-2 text-sm`}
                >
                  <IconLogout className="mr-2 h-5 w-5" />
                  退出登录
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
        onClick={handleRegister}
        className="rounded-lg px-1 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100 flex items-center"
      >
        <IconUser className="mr-1 h-5 w-5" />
        <span>注册</span>
      </button>
      <button
        onClick={handleLogin}
        className="rounded-lg px-3 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100 flex items-center"
      >
        <IconLogin className="mr-1 h-5 w-5" />
        <span>登录</span>
      </button>
      <Tooltip content="问题反馈">
        <a href="/feedback/" target="_blank" rel="noopener noreferrer">
          <button className="rounded-lg px-1 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100 flex items-center">
            <IconMessageCircle className="mr-1 h-5 w-5" />
          </button>
        </a>
      </Tooltip>
      <UpdateNotification />
      <SyncStatusIndicator />
    </div>
  );
};
