/* eslint-disable react/prop-types */
import { LoadingWordUI } from "../LoadingWordUI";
import useGetWord from "../hooks/useGetWord";
import { currentRowDetailAtom } from "../store";
import type { groupedWordRecords } from "../type";
import DataTag from "./DataTag";
import RowPagination from "./RowPagination";
import type { WordPronunciationIconRef } from "@/components/WordPronunciationIcon";
import { WordPronunciationIcon } from "@/components/WordPronunciationIcon";
import Phonetic from "@/pages/Typing/components/WordPanel/components/Phonetic";
import Letter from "@/pages/Typing/components/WordPanel/components/Word/Letter";
import { idDictionaryMap } from "@/resources/dictionary";
import type { IWordRecord } from "@/utils/db/record";
import { useSetAtom } from "jotai";
import { useCallback, useMemo, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import HashtagIcon from "~icons/heroicons/chart-pie-20-solid";
import CheckCircle from "~icons/heroicons/check-circle-20-solid";
import ClockIcon from "~icons/heroicons/clock-20-solid";
import XCircle from "~icons/heroicons/x-circle-20-solid";
import IconX from "~icons/tabler/x";

// 确保 IPerformanceEntry 被导入

type RowDetailProps = {
  currentRowDetail: groupedWordRecords;
  allRecords: groupedWordRecords[];
};

const RowDetail: React.FC<RowDetailProps> = ({
  currentRowDetail,
  allRecords,
}) => {
  const setCurrentRowDetail = useSetAtom(currentRowDetailAtom);

  const dictInfo = idDictionaryMap[currentRowDetail.dict];
  const { word, isLoading, hasError } = useGetWord(
    currentRowDetail.word,
    dictInfo
  );
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null);

  const rowDetailData: RowDetailData = useMemo(() => {
    let totalPracticeTime = 0;
    let totalPerformanceEntries = 0;
    let correctPerformanceEntries = 0;

    // currentRowDetail.records 是 WordRecord[] (类型上), 实际是 IWordRecord[]
    (currentRowDetail.records as IWordRecord[]).forEach((record) => {
      if (record.performanceHistory) {
        record.performanceHistory.forEach((perfEntry) => {
          totalPracticeTime += perfEntry.timing.reduce((sum, t) => sum + t, 0);
          totalPerformanceEntries++;
          if (perfEntry.wrongCount === 0) {
            correctPerformanceEntries++;
          }
        });
      }
    });

    const averageTimePerEntry =
      totalPerformanceEntries > 0
        ? totalPracticeTime / totalPerformanceEntries
        : 0;
    const timeStr = (averageTimePerEntry / 1000).toFixed(2);

    const wrongCount = currentRowDetail.wrongCount; // 这个是聚合后的总错误次数
    const sumCount = totalPerformanceEntries; // 总练习次数

    return {
      time: timeStr,
      sumCount,
      correctCount: correctPerformanceEntries,
      wrongCount,
    };
  }, [currentRowDetail]);

  const onClose = useCallback(() => {
    setCurrentRowDetail(null);
  }, [setCurrentRowDetail]);

  useHotkeys(
    "esc",
    (e) => {
      onClose();
      e.stopPropagation();
    },
    { preventDefault: true }
  );

  useHotkeys(
    "ctrl+j",
    () => {
      wordPronunciationIconRef.current?.play();
    },
    [],
    { enableOnFormTags: true, preventDefault: true }
  );

  return (
    <div className="absolute inset-0 flex  flex-col items-center  justify-center ">
      <div className="my-card relative z-10 flex h-[32rem] min-w-[26rem] select-text flex-col items-center justify-around rounded-2xl bg-white px-3 py-10 dark:bg-gray-900">
        <IconX
          className="absolute right-3 top-3  h-6 w-6 cursor-pointer text-gray-400"
          onClick={onClose}
        />
        <div className="flex flex-col items-center justify-start">
          <div>
            {currentRowDetail.word.split("").map((t, index) => (
              <Letter key={`${index}-${t}`} letter={t} visible state="normal" />
            ))}
          </div>
          <div className="relative flex h-8 items-center">
            {word ? (
              <Phonetic word={word} />
            ) : (
              <LoadingWordUI isLoading={isLoading} hasError={hasError} />
            )}
            {word && (
              <WordPronunciationIcon
                lang={dictInfo.language}
                word={word}
                className="absolute -right-7 top-1/2 h-5 w-5 -translate-y-1/2 transform "
                ref={wordPronunciationIconRef}
              />
            )}
          </div>
          <div className="flex max-w-[24rem] items-center">
            <span
              className={`max-w-4xl text-center font-sans transition-colors duration-300 dark:text-white dark:text-opacity-80`}
            >
              {word ? (
                word.trans.join("；")
              ) : (
                <LoadingWordUI isLoading={isLoading} hasError={hasError} />
              )}
            </span>
          </div>
        </div>
        <div className="item flex flex-col gap-4">
          <div className="flex gap-6">
            <DataTag
              icon={ClockIcon}
              name="平均用时"
              data={rowDetailData.time}
            />
            <DataTag
              icon={HashtagIcon}
              name="练习次数"
              data={rowDetailData.sumCount}
            />
          </div>
          <div className="flex gap-6">
            <DataTag
              icon={CheckCircle}
              name="正确次数"
              data={rowDetailData.correctCount}
            />
            <DataTag
              icon={XCircle}
              name="错误次数"
              data={rowDetailData.wrongCount}
            />
          </div>
        </div>
        <RowPagination
          className="absolute bottom-6 mt-10"
          allRecords={allRecords}
        />
      </div>
      <div
        className="absolute inset-0 z-0  cursor-pointer bg-transparent"
        onClick={onClose}
      ></div>
    </div>
  );
};

type RowDetailData = {
  time: string;
  sumCount: number;
  correctCount: number;
  wrongCount: number;
};

export default RowDetail;
