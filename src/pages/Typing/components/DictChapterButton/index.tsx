import Tooltip from "@/components/Tooltip";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isReviewModeAtom,
} from "@/store";
import useAuthStore from "@/store/auth";
import range from "@/utils/range";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { useAtom, useAtomValue } from "jotai";
import { Fragment } from "react";
import { navigate } from "vike/client/router";
import IconCheck from "~icons/tabler/check";
import IconLogin from "~icons/tabler/login";
import IconLogout from "~icons/tabler/logout";
import IconUser from "~icons/tabler/user";
import IconUserCircle from "~icons/tabler/user-circle";

export const DictChapterButton = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  const chapterCount = currentDictInfo.chapterCount;
  const isReviewMode = useAtomValue(isReviewModeAtom);
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (
    event
  ) => {
    if (event.key === " ") {
      event.preventDefault();
    }
  };

  const toGallery = () => {
    navigate("/gallery");
  };

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
    <>
      <Tooltip content="词典切换">
        <button
          onClick={toGallery}
          className="block rounded-lg px-3 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100"
        >
          {currentDictInfo.name} {isReviewMode && "错题复习"}
        </button>
      </Tooltip>
      {!isReviewMode && (
        <Tooltip content="章节切换">
          <Listbox value={currentChapter} onChange={setCurrentChapter}>
            <Listbox.Button
              onKeyDown={handleKeyDown}
              className="rounded-lg px-3 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100"
            >
              第 {currentChapter + 1} 章
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="listbox-options z-10 w-32">
                {range(0, chapterCount, 1).map((index) => (
                  <Listbox.Option key={index} value={index}>
                    {({ selected }) => (
                      <div className="group flex cursor-pointer items-center justify-between">
                        {selected ? (
                          <span className="listbox-options-icon">
                            <IconCheck className="focus:outline-none" />
                          </span>
                        ) : null}
                        <span>第 {index + 1} 章</span>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </Tooltip>
      )}

      {/* 用户认证菜单 */}
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
    </>
  );
};
