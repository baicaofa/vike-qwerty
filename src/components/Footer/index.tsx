import { infoPanelStateAtom } from "@/store";
import type { InfoPanelType } from "@/typings";
import { recordOpenInfoPanelAction } from "@/utils";
import { useAtom } from "jotai";
import type React from "react";
import { useCallback } from "react";

const Footer: React.FC = () => {
  const [infoPanelState, setInfoPanelState] = useAtom(infoPanelStateAtom);

  const handleOpenInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      recordOpenInfoPanelAction(modalType, "footer");
      setInfoPanelState((state) => ({ ...state, [modalType]: true }));
    },
    [setInfoPanelState]
  );

  const handleCloseInfoPanel = useCallback(
    (modalType: InfoPanelType) => {
      setInfoPanelState((state) => ({ ...state, [modalType]: false }));
    },
    [setInfoPanelState]
  );

  return (
    <>
      <footer
        className="mb-1 mt-4 flex w-full items-center justify-center gap-2.5 text-sm ease-in"
        onClick={(e) => e.currentTarget.blur()}
      >
        <a
          href="https://www.keybr.com.cn/keybr/"
          target="_blank"
          aria-label=""
          rel="noreferrer"
        >
          Keybr Blog
        </a>
        <a
          className="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          href="https://beian.miit.gov.cn"
          target="_blank"
          rel="noreferrer"
        >
          赣ICP备2020012444号
        </a>
      </footer>
    </>
  );
};

export default Footer;
