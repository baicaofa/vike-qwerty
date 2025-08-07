import { TypingContext, TypingStateActionType } from "../../store";
import AnalysisButton from "../AnalysisButton";
import ErrorBookButton from "../ErrorBookButton";
import HandPositionIllustration from "../HandPositionIllustration";
import LoopWordSwitcher from "../LoopWordSwitcher";
import Setting from "../Setting";
import SoundSwitcher from "../SoundSwitcher";
import TranslationSwitcher from "../TranslationSwitcher";
import WordDictationSwitcher from "../WordDictationSwitcher";
import Tooltip from "@/components/Tooltip";
import { isOpenDarkModeAtom } from "@/store";
import { CTRL } from "@/utils";
import { useAtom } from "jotai";
import { useContext } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import IconMoon from "~icons/heroicons/moon-solid";
import IconSun from "~icons/heroicons/sun-solid";

interface SwitcherProps {
  pageContext?: any;
}

export default function Switcher({ pageContext }: SwitcherProps = {}) {
  const { t } = useTranslation("typing");
  const [isOpenDarkMode, setIsOpenDarkMode] = useAtom(isOpenDarkModeAtom);
  const { state, dispatch } = useContext(TypingContext) ?? {};

  const changeDarkModeState = () => {
    setIsOpenDarkMode((old) => !old);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Tooltip content={t("switcher.tooltips.soundSettings", "声音设置")}>
        <SoundSwitcher />
      </Tooltip>

      <Tooltip
        className="h-7 w-7"
        content={t("switcher.tooltips.loopWord", "循环单词")}
      >
        <LoopWordSwitcher />
      </Tooltip>

      <Tooltip
        className="h-7 w-7"
        content={t("switcher.tooltips.dictationMode", "听写模式", {
          shortcut: `${CTRL} + V`,
        })}
      >
        <WordDictationSwitcher />
      </Tooltip>
      <Tooltip
        className="h-7 w-7"
        content={t("switcher.tooltips.toggleTranslation", "切换翻译", {
          shortcut: `${CTRL} + Shift + V`,
        })}
      >
        <TranslationSwitcher />
      </Tooltip>

      <Tooltip content={t("switcher.tooltips.errorBook", "错误本")}>
        <ErrorBookButton />
      </Tooltip>

      <Tooltip
        className="h-7 w-7"
        content={t("switcher.tooltips.dataAnalysis", "数据分析")}
      >
        <AnalysisButton />
      </Tooltip>

      <Tooltip
        className="h-7 w-7"
        content={t("switcher.tooltips.darkMode", "暗色模式")}
      >
        <button
          className={`p-[2px] text-lg text-blue-500 focus:outline-none`}
          type="button"
          onClick={(e) => {
            changeDarkModeState();
            e.currentTarget.blur();
          }}
          aria-label={t("switcher.ariaLabels.darkMode")}
        >
          {isOpenDarkMode ? (
            <IconMoon className="icon" />
          ) : (
            <IconSun className="icon" />
          )}
        </button>
      </Tooltip>
      <Tooltip
        className="h-7 w-7"
        content={t("switcher.tooltips.handPosition", "手势")}
      >
        <HandPositionIllustration></HandPositionIllustration>
      </Tooltip>
      <Tooltip content={t("switcher.tooltips.settings", "设置")}>
        <Setting pageContext={pageContext} />
      </Tooltip>
    </div>
  );
}
