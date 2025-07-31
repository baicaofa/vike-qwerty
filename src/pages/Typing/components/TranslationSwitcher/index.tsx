import { TypingContext, TypingStateActionType } from "../../store";
import { CTRL } from "@/utils";
import { Popover, Switch, Transition } from "@headlessui/react";
import { Fragment, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import IconLanguage from "~icons/tabler/language";
import IconLanguageOff from "~icons/tabler/language-off";

export default function TranslationSwitcher() {
  const { t } = useTranslation("typing");
  const { state, dispatch } = useContext(TypingContext) ?? {};

  const changeTransVisibleState = useCallback(() => {
    if (dispatch) {
      dispatch({ type: TypingStateActionType.TOGGLE_TRANS_VISIBLE });
    }
  }, [dispatch]);

  const changeSentencesVisibleState = useCallback(() => {
    if (dispatch) {
      dispatch({ type: TypingStateActionType.TOGGLE_SENTENCES_VISIBLE });
    }
  }, [dispatch]);

  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className={`p-[2px] ${
              state?.isTransVisible ? "text-blue-500" : "text-gray-500"
            } text-lg focus:outline-none`}
            aria-label={t("switcher.ariaLabels.toggleTranslation", {
              shortcut: `${CTRL} + Shift + V`,
            })}
          >
            {state?.isTransVisible ? <IconLanguage /> : <IconLanguageOff />}
          </Popover.Button>
          <Transition
            as={Fragment}
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute bottom-full left-1/2 z-10 mb-2 flex max-w-max -translate-x-1/2 px-4">
              <div className="shadow-upper box-border flex w-60 select-none flex-col items-center justify-center gap-4 rounded-xl bg-white p-4 drop-shadow dark:bg-gray-800">
                <div className="flex w-full flex-col items-start gap-2 py-0">
                  <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">
                    {t("translationSwitcher.translation.label")}
                  </span>
                  <div className="flex w-full flex-row items-center justify-between">
                    <Switch
                      checked={state?.isTransVisible ?? false}
                      onChange={changeTransVisibleState}
                      className="switch-root"
                    >
                      <span aria-hidden="true" className="switch-thumb" />
                    </Switch>
                    <span className="text-right text-xs font-normal leading-tight text-gray-600">
                      {t("translationSwitcher.translation.status", {
                        status: state?.isTransVisible
                          ? t("translationSwitcher.enabled")
                          : t("translationSwitcher.disabled"),
                      })}
                    </span>
                  </div>
                </div>
                <div className="flex w-full flex-col items-start gap-2 py-0">
                  <span className="text-sm font-normal leading-5 text-gray-900 dark:text-white dark:text-opacity-60">
                    {t("translationSwitcher.sentences.label")}
                  </span>
                  <div className="flex w-full flex-row items-center justify-between">
                    <Switch
                      checked={state?.isSentencesVisible ?? false}
                      onChange={changeSentencesVisibleState}
                      className="switch-root"
                    >
                      <span aria-hidden="true" className="switch-thumb" />
                    </Switch>
                    <span className="text-right text-xs font-normal leading-tight text-gray-600">
                      {t("translationSwitcher.sentences.status", {
                        status: state?.isSentencesVisible
                          ? t("translationSwitcher.enabled")
                          : t("translationSwitcher.disabled"),
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
