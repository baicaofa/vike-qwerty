import type { Dictionary, Word } from "@/typings";
import { db } from "@/utils/db";
// IPerformanceEntry 可能会在 WordRecord 中导出，或者直接从这里导入
import type { IPerformanceEntry, WordRecord } from "@/utils/db/record";
import { wordListFetcher } from "@/utils/wordListFetcher";
import { useEffect, useState } from "react";
import useSWR from "swr";

type GroupedWordRecord = {
  word: string;
  //在新模型下，一个单词在特定词典中只有一个 WordRecord 实例。
  //但为了兼容或处理潜在的未合并数据，这里仍然使用数组。
  //理想情况下，records 数组长度为1。
  records: WordRecord[];
};

export type TErrorWordData = {
  word: string;
  originData: Word;
  errorCount: number; // 该单词总的错误次数
  errorLetters: Record<string, number>; // 每个字母索引对应的错误次数
  errorChar: string[]; // 按错误频率排序的易错字母字符
  latestErrorTime: number; // 最近一次出错的时间
};

export default function useErrorWordData(dict: Dictionary, reload: boolean) {
  const {
    data: wordList,
    error,
    isLoading,
  } = useSWR(dict?.url, wordListFetcher);

  const [errorWordData, setErrorData] = useState<TErrorWordData[]>([]);

  useEffect(() => {
    if (!wordList || !dict?.id) return;

    db.wordRecords
      .where("dict") // 获取当前词典的所有单词记录
      .equals(dict.id)
      .toArray()
      .then((allRecordsForDict) => {
        // 客户端筛选：找出 performanceHistory 中至少有一次错误的记录
        const recordsWithErrors = allRecordsForDict.filter(
          (record) =>
            record.performanceHistory &&
            record.performanceHistory.some((entry) => entry.wrongCount > 0)
        );

        const groupedRecords: GroupedWordRecord[] = [];
        recordsWithErrors.forEach((record) => {
          // 按单词名称分组。在新模型下，每个单词应该只有一个记录，
          // 所以 group.records 数组理论上只包含一个元素。
          let group = groupedRecords.find((g) => g.word === record.word);
          if (!group) {
            group = { word: record.word, records: [] };
            groupedRecords.push(group);
          }
          group.records.push(record as WordRecord);
        });

        const res: TErrorWordData[] = [];

        groupedRecords.forEach((group) => {
          const errorLettersAggregated: Record<string, number> = {};
          let totalErrorCountForWord = 0;
          let maxLatestErrorTimeForWord = 0;

          group.records.forEach((wordRecordInstance) => {
            // 通常只会迭代一次
            if (wordRecordInstance.performanceHistory) {
              wordRecordInstance.performanceHistory.forEach(
                (performanceEntry: IPerformanceEntry) => {
                  // 累加总错误次数
                  totalErrorCountForWord += performanceEntry.wrongCount;

                  // 更新最近错误时间
                  if (performanceEntry.timeStamp > maxLatestErrorTimeForWord) {
                    maxLatestErrorTimeForWord = performanceEntry.timeStamp;
                  }

                  // 聚合每个字母的错误
                  if (performanceEntry.mistakes) {
                    for (const letterIndex in performanceEntry.mistakes) {
                      const mistakesAtPosition =
                        performanceEntry.mistakes[letterIndex];
                      if (mistakesAtPosition && mistakesAtPosition.length > 0) {
                        errorLettersAggregated[letterIndex] =
                          (errorLettersAggregated[letterIndex] || 0) +
                          mistakesAtPosition.length;
                      }
                    }
                  }
                }
              );
            }
          });

          // 如果这个单词没有任何错误（例如，performanceHistory 为空或所有 wrongCount 都为0），则跳过
          if (totalErrorCountForWord === 0) return;

          const originWordInfo = wordList.find((w) => w.name === group.word);
          if (!originWordInfo) return;

          const errorData: TErrorWordData = {
            word: group.word,
            originData: originWordInfo,
            errorCount: totalErrorCountForWord,
            errorLetters: errorLettersAggregated,
            errorChar: Object.entries(errorLettersAggregated)
              .sort((a, b) => b[1] - a[1])
              .map(([index]) => group.word[Number(index)]),
            latestErrorTime: maxLatestErrorTimeForWord,
          };
          res.push(errorData);
        });

        setErrorData(res);
      });
  }, [dict?.id, wordList, reload]); // 确保 dict.id 在依赖项中

  return { errorWordData, isLoading, error };
}
