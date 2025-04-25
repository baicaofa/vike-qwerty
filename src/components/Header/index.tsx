import { SyncStatusIndicator } from "../SyncStatusIndicator";
import logo from "@/assets/logo.svg";
import type { PropsWithChildren } from "react";
import type React from "react";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <header className="container z-20 mx-auto w-full px-10 py-6">
      <div className="flex w-full flex-col items-center justify-between space-y-3 lg:flex-row lg:space-y-0">
        <a
          className="flex items-center text-2xl font-bold text-blue-500 no-underline hover:no-underline lg:text-4xl"
          href="https://www.keybr.com.cn/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={logo} className="mr-3 h-16 w-16" alt="Keybr Logo" />
          <h1>Keybr</h1>
        </a>
        <nav className="my-card on element flex w-auto content-center items-center justify-end space-x-3 rounded-xl bg-white p-4 transition-colors duration-300 dark:bg-gray-800">
          <div className="relative">
            <a
              href="https://typing.keybr.com.cn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="rounded-lg bg-blue-500 text-white font-black px-4 py-2 text-lg transition-all hover:bg-blue-400 hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100">
                👉打字练习👈
              </button>
            </a>
          </div>

          {children}
          <SyncStatusIndicator />
        </nav>
      </div>
    </header>
  );
};

export default Header;
