import useAuthStore from "@/store/auth";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { navigate } from "vike/client/router";
import IconLogin from "~icons/tabler/login";
import IconLogout from "~icons/tabler/logout";
import IconUser from "~icons/tabler/user";
import IconUserCircle from "~icons/tabler/user-circle";

export const UserAuthMenu = () => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="rounded-lg px-3 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100">
        {isAuthenticated ? (
          <div className="flex items-center">
            <IconUserCircle className="mr-1 h-5 w-5" />
            <span>{user?.username}</span>
          </div>
        ) : (
          <div className="flex items-center">
            <IconUser className="mr-1 h-5 w-5" />
            <span>登录</span>
          </div>
        )}
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:text-white">
          {isAuthenticated ? (
            <>
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
            </>
          ) : (
            <>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleLogin}
                    className={`${
                      active
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 dark:text-gray-200"
                    } flex w-full items-center px-4 py-2 text-sm`}
                  >
                    <IconLogin className="mr-2 h-5 w-5" />
                    登录
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={handleRegister}
                    className={`${
                      active
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 dark:text-gray-200"
                    } flex w-full items-center px-4 py-2 text-sm`}
                  >
                    <IconUser className="mr-2 h-5 w-5" />
                    注册
                  </button>
                )}
              </Menu.Item>
            </>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
