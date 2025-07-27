import { TypingContext, TypingStateActionType } from "../../store";
import AnalysisButton from "../AnalysisButton";
import ErrorBookButton from "../ErrorBookButton";
import HandPositionIllustration from "../HandPositionIllustration";
import LoopWordSwitcher from "../LoopWordSwitcher";
import Setting from "../Setting";
import SoundSwitcher from "../SoundSwitcher";
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
import IconLanguage from "~icons/tabler/language";
import IconLanguageOff from "~icons/tabler/language-off";

export default function Switcher() {
  const { t } = useTranslation("typing");
  const [isOpenDarkMode, setIsOpenDarkMode] = useAtom(isOpenDarkModeAtom);
  const { state, dispatch } = useContext(TypingContext) ?? {};

  const changeDarkModeState = () => {
    setIsOpenDarkMode((old) => !old);
  };

  const changeTransVisibleState = () => {
    if (dispatch) {
      dispatch({ type: TypingStateActionType.TOGGLE_TRANS_VISIBLE });
    }
  };

  useHotkeys(
    "ctrl+shift+v",
    () => {
      changeTransVisibleState();
    },
    { enableOnFormTags: true, preventDefault: true },
    []
  );

  return (
    <div className="flex items-center justify-center gap-2">
      <Tooltip content={t("switcher.tooltips.soundSettings")}>
        <SoundSwitcher />
      </Tooltip>

      <Tooltip className="h-7 w-7" content={t("switcher.tooltips.loopWord")}>
        <LoopWordSwitcher />
      </Tooltip>

      <Tooltip
        className="h-7 w-7"
        content={t("switcher.tooltips.dictationMode", {
          shortcut: `${CTRL} + V`,
        })}
      >
        <WordDictationSwitcher />
      </Tooltip>
      <Tooltip
        className="h-7 w-7"
        content={t("switcher.tooltips.toggleTranslation", {
          shortcut: `${CTRL} + Shift + V`,
        })}
      >
        <button
          className={`p-[2px] ${
            state?.isTransVisible ? "text-blue-500" : "text-gray-500"
          } text-lg focus:outline-none`}
          type="button"
          onClick={(e) => {
            changeTransVisibleState();
            e.currentTarget.blur();
          }}
          aria-label={t("switcher.ariaLabels.toggleTranslation", {
            shortcut: `${CTRL} + Shift + V`,
          })}
        >
          {state?.isTransVisible ? <IconLanguage /> : <IconLanguageOff />}
        </button>
      </Tooltip>

      <Tooltip content={t("switcher.tooltips.errorBook")}>
        <ErrorBookButton />
      </Tooltip>

      <Tooltip
        className="h-7 w-7"
        content={t("switcher.tooltips.dataAnalysis")}
      >
        <AnalysisButton />
      </Tooltip>

      <Tooltip className="h-7 w-7" content={t("switcher.tooltips.darkMode")}>
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
        content={t("switcher.tooltips.handPosition")}
      >
        <HandPositionIllustration></HandPositionIllustration>
      </Tooltip>
      <Tooltip content={t("switcher.tooltips.settings")}>
        <Setting />
      </Tooltip>
    </div>
  );
}
