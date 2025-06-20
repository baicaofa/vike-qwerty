import { DonatingCard } from "../DonatingCard";
import { StickerButton } from "../DonatingCard/components/StickerButton";
import { FeedbackDialog } from "../FeedbackDialog";
import redBookCode from "@/assets/redBook-code.jpg";
import InfoPanel from "@/components/InfoPanel";
import Tooltip from "@/components/Tooltip";
import { infoPanelStateAtom } from "@/store";
import type { InfoPanelType } from "@/typings";
import { recordOpenInfoPanelAction } from "@/utils";
import { useAtom } from "jotai";
import type React from "react";
import { useCallback } from "react";
import IconMail from "~icons/material-symbols/mail";
import IconCoffee2 from "~icons/mdi/coffee";
import IconXiaoHongShu from "~icons/my-icons/xiaohongshu";
import IconTwitter from "~icons/ri/twitter-fill";
import IconGithub from "~icons/simple-icons/github";
import IconVisualstudiocode from "~icons/simple-icons/visualstudiocode";
import IconWechat2 from "~icons/simple-icons/wechat";
import IconWechat from "~icons/tabler/brand-wechat";
import IconCoffee from "~icons/tabler/coffee";
import IconTerminal2 from "~icons/tabler/terminal-2";
import IconFlagChina from "~icons/twemoji/flag-china";

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

        <FeedbackDialog buttonClassName="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
      </footer>
    </>
  );
};

export default Footer;
