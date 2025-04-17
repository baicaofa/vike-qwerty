import { SyncStatusIndicator } from "../SyncStatusIndicator";
import logo from "@/assets/logo.svg";
import type { PropsWithChildren } from "react";
import type React from "react";
import { useEffect, useState } from "react";

const Header: React.FC<PropsWithChildren> = ({ children }) => {
  const [showBubble, setShowBubble] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 5000); // Bubble will disappear after 5 seconds

    return () => clearTimeout(timer);
  }, []);

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
          <SyncStatusIndicator />
          <div className="relative">
            <button className="rounded-lg bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-600">
              打字练习
            </button>
            {showBubble && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 transform rounded-lg bg-yellow-400 px-4 py-2 text-sm text-black shadow-lg transition-opacity duration-500">
                <div className="relative">
                  New Feature! 🎉
                  <div className="absolute -bottom-2 left-1/2 h-2 w-2 -translate-x-1/2 transform rotate-45 bg-yellow-400"></div>
                </div>
              </div>
            )}
          </div>
          {children}
        </nav>
      </div>
    </header>
  );
};

export default Header;
