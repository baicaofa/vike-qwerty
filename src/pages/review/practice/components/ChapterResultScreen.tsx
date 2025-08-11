import Tooltip from "@/components/Tooltip";
import ConclusionBar from "@/pages/Typing/components/ResultScreen/ConclusionBar";
import RemarkRing from "@/pages/Typing/components/ResultScreen/RemarkRing";
import WordChip from "@/pages/Typing/components/ResultScreen/WordChip";
import type { WordWithIndex } from "@/typings";
import type { ChapterStats } from "@/typings/chapter";
import type { IWordReviewRecord } from "@/utils/db/wordReviewRecord";
import { Transition } from "@headlessui/react";
import { useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import IconX from "~icons/tabler/x";

interface ChapterResultScreenProps {
  /** 章节编号 */
  chapterNumber: number;
  /** 章节统计数据 */
  stats: ChapterStats;
  /** 关闭弹窗 */
  onClose: () => void;
  /** 下一章 */
  onNextChapter: () => void;
  /** 重新练习本章 */
  onRepeatChapter: () => void;
  /** 是否是最后一章 */
  isLastChapter?: boolean;
}

/**
 * 章节结果展示组件
 * 复用现有 ResultScreen 的设计模式和视觉风格
 */
const ChapterResultScreen: React.FC<ChapterResultScreenProps> = ({
  chapterNumber,
  stats,
  onClose,
  onNextChapter,
  onRepeatChapter,
  isLastChapter = false,
}) => {
  const { t } = useTranslation("review");

  // 计算完成时间字符串
  const timeString = useMemo(() => {
    const time =
      typeof stats.time === "number" && stats.time >= 0 ? stats.time : 0;
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const minuteString = minutes < 10 ? "0" + minutes : minutes + "";
    const secondString = seconds < 10 ? "0" + seconds : seconds + "";
    return `${minuteString}:${secondString}`;
  }, [stats.time]);

  // 计算正确率
  const correctRate = useMemo(() => {
    const totalWords = stats.correctWords.length + stats.wrongWords.length;
    if (totalWords === 0) {
      console.warn("ChapterResultScreen: 没有单词数据");
      return 100;
    }
    const rate = Math.floor((stats.correctWords.length / totalWords) * 100);
    return Math.max(0, Math.min(100, rate)); // 确保在0-100范围内
  }, [stats.correctWords.length, stats.wrongWords.length]);

  // 计算错误级别（复用 ResultScreen 的逻辑）
  const mistakeLevel = useMemo(() => {
    if (correctRate >= 85) {
      return 0;
    } else if (correctRate >= 70) {
      return 1;
    } else {
      return 2;
    }
  }, [correctRate]);

  // 将 IWordReviewRecord 转换为 WordWithIndex 格式
  const wrongWordsWithIndex = useMemo((): WordWithIndex[] => {
    return stats.wrongWords.map((word, index) => ({
      index,
      name: word.word,
      trans: [], // 暂时为空，如果需要翻译可以从词典数据中获取
      usphone: "",
      ukphone: "",
    }));
  }, [stats.wrongWords]);

  // 快捷键处理
  useHotkeys(
    "enter",
    () => {
      if (!isLastChapter) {
        onNextChapter();
      }
    },
    { preventDefault: true, enabled: !isLastChapter }
  );

  useHotkeys(
    "space",
    (e) => {
      e.stopPropagation();
      onRepeatChapter();
    },
    { preventDefault: true }
  );

  useHotkeys(
    "escape",
    () => {
      onClose();
    },
    { preventDefault: true }
  );

  return (
    <div className="fixed inset-0 z-30 overflow-y-auto">
      <div className="absolute inset-0 bg-gray-300 opacity-80 dark:bg-gray-600"></div>
      <Transition
        show={true}
        enter="ease-in duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-out duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="flex h-screen items-center justify-center">
          <div className="my-card fixed flex w-[90vw] max-w-6xl flex-col overflow-hidden rounded-3xl bg-white pb-14 pl-10 pr-5 pt-10 shadow-lg dark:bg-gray-800 md:w-4/5 lg:w-3/5">
            {/* 标题 */}
            <div className="text-center font-sans text-xl font-normal text-gray-900 dark:text-gray-400 md:text-2xl">
              {t("chapter.completed", "第{{number}}章 完成！", {
                number: chapterNumber,
              })}
            </div>

            {/* 关闭按钮 */}
            <button
              className="absolute right-7 top-5"
              onClick={onClose}
              title={t("tooltips.closeResult", "关闭结果")}
              aria-label={t("tooltips.closeResult", "关闭结果")}
            >
              <IconX className="text-gray-400" />
            </button>

            {/* 主要内容区域 */}
            <div className="mt-10 flex flex-row gap-2 overflow-hidden">
              {/* 统计圈区域 */}
              <div className="flex flex-shrink-0 flex-grow-0 flex-col gap-3 px-4 sm:px-1 md:px-2 lg:px-4">
                <RemarkRing
                  remark={`${correctRate}%`}
                  caption={t("stats.accuracy", "正确率")}
                  percentage={correctRate}
                />
                <RemarkRing
                  remark={timeString}
                  caption={t("stats.time", "完成时间")}
                />
                <RemarkRing
                  remark={stats.wpm + ""}
                  caption={t("stats.wpm", "每分钟字数")}
                />
              </div>

              {/* 错误单词展示区域 */}
              <div className="z-10 ml-6 flex-1 overflow-visible rounded-xl bg-indigo-50 dark:bg-gray-700">
                <div className="customized-scrollbar z-20 ml-8 mr-1 flex h-80 flex-row flex-wrap content-start gap-4 overflow-y-auto overflow-x-hidden pr-7 pt-9">
                  {wrongWordsWithIndex.length > 0 ? (
                    wrongWordsWithIndex.map((word, index) => (
                      <WordChip key={`${index}-${word.name}`} word={word} />
                    ))
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <div className="text-2xl mb-2">🎉</div>
                        <div className="text-base font-medium">
                          {t("chapter.noMistakes", "全部正确！")}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="align-center flex w-full flex-row justify-start rounded-b-xl bg-indigo-200 px-4 dark:bg-blue-400">
                  <ConclusionBar
                    mistakeLevel={mistakeLevel}
                    mistakeCount={wrongWordsWithIndex.length}
                  />
                </div>
              </div>
            </div>

            {/* 操作按钮区域 */}
            <div className="mt-10 flex w-full justify-center gap-5 px-5 text-xl">
              <Tooltip content={t("chapter.tooltips.space", "快捷键：space")}>
                <button
                  className="my-btn-primary h-12 border-2 border-solid border-gray-300 bg-white text-base text-gray-700 dark:border-gray-700 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700"
                  type="button"
                  onClick={onRepeatChapter}
                  title={t("chapter.buttons.repeat", "重新练习")}
                >
                  {t("chapter.buttons.repeat", "重新练习")}
                </button>
              </Tooltip>

              {!isLastChapter && (
                <Tooltip content={t("chapter.tooltips.enter", "快捷键：enter")}>
                  <button
                    className="my-btn-primary h-12 text-base font-bold"
                    type="button"
                    onClick={onNextChapter}
                    title={t("chapter.buttons.next", "下一章")}
                  >
                    {t("chapter.buttons.next", "下一章")}
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

export default ChapterResultScreen;
