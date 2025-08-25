import { getLocalizedHref } from "@/components/Link";
import Tooltip from "@/components/Tooltip";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isReviewModeAtom,
} from "@/store";
import type { SupportedLanguage } from "@/store/languageAtom";
import range from "@/utils/range";
import { Listbox, Transition } from "@headlessui/react";
import { useAtom, useAtomValue } from "jotai";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePageContext } from "vike-react/usePageContext";
import { navigate } from "vike/client/router";
import IconCheck from "~icons/tabler/check";

interface DictChapterButtonProps {
  pageContext?: any;
}

export const DictChapterButton = ({
  pageContext: pageContextProp,
}: DictChapterButtonProps = {}) => {
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  const chapterCount = currentDictInfo.chapterCount;
  const isReviewMode = useAtomValue(isReviewModeAtom);
  const { t } = useTranslation("typing");

  // 客户端水合状态检查
  const [isClientHydrated, setIsClientHydrated] = useState(false);

  // 获取页面上下文，用于国际化
  const pageContextFromHook = usePageContext();
  const pageContext = pageContextFromHook || pageContextProp;
  const currentLocale: SupportedLanguage =
    pageContext?.locale === "en" ? "en" : "zh";

  // 在客户端水合完成后设置状态
  useEffect(() => {
    setIsClientHydrated(true);
  }, []);

  const handleKeyDown: React.KeyboardEventHandler<HTMLButtonElement> = (
    event
  ) => {
    if (event.key === " ") {
      event.preventDefault();
    }
  };

  const toGallery = () => {
    // 使用本地化的路径进行导航
    const localizedHref = getLocalizedHref("/gallery", currentLocale);
    navigate(localizedHref);
  };

  // 渲染章节按钮内容
  const renderChapterButtonContent = () => {
    if (!isClientHydrated) {
      // 服务端渲染时显示占位符，避免水合不匹配
      return "第 1 章";
    }
    return t("chapter.number", { number: currentChapter + 1 });
  };

  // 渲染章节选项内容
  const renderChapterOptionContent = (index: number) => {
    if (!isClientHydrated) {
      // 服务端渲染时显示占位符
      return `第 ${index + 1} 章`;
    }
    return t("chapter.number", { number: index + 1 });
  };

  return (
    <>
      <Tooltip content={t("tooltips.dictSwitch", "词典切换")}>
        <button
          onClick={toGallery}
          className="block rounded-lg px-3 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100"
        >
          {currentDictInfo.name}{" "}
          {isReviewMode && t("chapter.reviewMode", "复习模式")}
        </button>
      </Tooltip>
      {!isReviewMode && (
        <Tooltip content={t("tooltips.chapterSwitch", "章节切换")}>
          <Listbox value={currentChapter} onChange={setCurrentChapter}>
            <Listbox.Button
              onKeyDown={handleKeyDown}
              className="rounded-lg px-3 py-1 text-lg transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white focus:outline-none dark:text-white dark:text-opacity-60 dark:hover:text-opacity-100"
            >
              {renderChapterButtonContent()}
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
                        <span>{renderChapterOptionContent(index)}</span>
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
