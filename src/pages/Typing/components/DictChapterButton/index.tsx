import Tooltip from "@/components/Tooltip";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isReviewModeAtom,
} from "@/store";
import range from "@/utils/range";
import { Listbox, Transition } from "@headlessui/react";
import { useAtom, useAtomValue } from "jotai";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { navigate } from "vike/client/router";
import IconCheck from "~icons/tabler/check";

export const DictChapterButton = () => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  const chapterCount = currentDictInfo.chapterCount;
  const isReviewMode = useAtomValue(isReviewModeAtom);
  const { t } = useTranslation("typing");

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

  return (
    <>
      <Tooltip content={t("tooltips.dictSwitch")}>
        <button
          onClick={toGallery}
          className="block rounded-lg px-3 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100"
        >
          {currentDictInfo.name} {isReviewMode && t("chapter.reviewMode")}
        </button>
      </Tooltip>
      {!isReviewMode && (
        <Tooltip content={t("tooltips.chapterSwitch")}>
          <Listbox value={currentChapter} onChange={setCurrentChapter}>
            <Listbox.Button
              onKeyDown={handleKeyDown}
              className="rounded-lg px-3 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100"
            >
              {t("chapter.number", { number: currentChapter + 1 })}
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
                        <span>
                          {t("chapter.number", { number: index + 1 })}
                        </span>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </Listbox>
        </Tooltip>
      )}
    </>
  );
};
