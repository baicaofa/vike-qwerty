import ErrorRow from "./ErrorRow";
import type { ISortType } from "./HeadWrongNumber";
import HeadWrongNumber from "./HeadWrongNumber";
import Pagination, { ITEM_PER_PAGE } from "./Pagination";
import RowDetail from "./RowDetail";
import { currentRowDetailAtom } from "./store";
import type { groupedWordRecords } from "./type";
import { db, useDeleteWordRecord } from "@/utils/db";
import type { IWordRecord, WordRecord } from "@/utils/db/record";
// 确保 IWordRecord 被导入或 WordRecord 类型可用
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { navigate } from "vike/client/router";
import IconX from "~icons/tabler/x";

export function Page() {
  const { t } = useTranslation("errors");
  const [groupedRecords, setGroupedRecords] = useState<groupedWordRecords[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = useMemo(
    () => Math.ceil(groupedRecords.length / ITEM_PER_PAGE),
    [groupedRecords.length]
  );
  const [sortType, setSortType] = useState<ISortType>("asc");
  const currentRowDetail = useAtomValue(currentRowDetailAtom);
  const { deleteWordRecord } = useDeleteWordRecord();
  const [reload, setReload] = useState(false);

  const onBack = useCallback(() => {
    navigate("/");
  }, []);

  const setPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    },
    [totalPages]
  );

  const setSort = useCallback(
    (sortType: ISortType) => {
      setSortType(sortType);
      setPage(1);
    },
    [setPage]
  );

  const sortedRecords = useMemo(() => {
    if (sortType === "none") return groupedRecords;
    return [...groupedRecords].sort((a, b) => {
      if (sortType === "asc") {
        return a.wrongCount - b.wrongCount;
      } else {
        return b.wrongCount - a.wrongCount;
      }
    });
  }, [groupedRecords, sortType]);

  const renderRecords = useMemo(() => {
    const start = (currentPage - 1) * ITEM_PER_PAGE;
    const end = start + ITEM_PER_PAGE;
    return sortedRecords.slice(start, end);
  }, [currentPage, sortedRecords]);

  useEffect(() => {
    db.wordRecords
      .toArray() // 获取所有 wordRecords
      .then((allWordRecords: IWordRecord[]) => {
        // 明确类型为 IWordRecord[]
        // 筛选出包含错误练习的记录
        const errorRecords = allWordRecords.filter(
          (record) =>
            record.performanceHistory &&
            record.performanceHistory.some((perf) => perf.wrongCount > 0)
        );

        const groups: groupedWordRecords[] = [];

        errorRecords.forEach((record) => {
          // record 类型是 IWordRecord
          let group = groups.find(
            (g) => g.word === record.word && g.dict === record.dict
          );
          if (!group) {
            group = {
              word: record.word,
              dict: record.dict,
              records: [], // records 数组将存储 IWordRecord 对象
              wrongCount: 0,
            };
            groups.push(group);
          }
          // groupedWordRecords.records 类型是 WordRecord[], 但我们推入的是 IWordRecord
          // 如果后续只访问属性，这是可以的。或者将 groupedWordRecords.records 改为 IWordRecord[]
          group.records.push(record as WordRecord); // 保持原有类型断言，但注意实际是 IWordRecord
        });

        groups.forEach((group) => {
          // group.records 中的每个 'curRecord' 实际上是 IWordRecord
          group.wrongCount = group.records.reduce(
            (accWrongCountInGroup, curRecord) => {
              const wrongsInCurrentRecord = curRecord.performanceHistory.reduce(
                (accPerfWrongCount, perfEntry) => {
                  return accPerfWrongCount + perfEntry.wrongCount;
                },
                0
              );
              return accWrongCountInGroup + wrongsInCurrentRecord;
            },
            0
          );
        });

        setGroupedRecords(groups);
      });
  }, [reload]);

  const handleDelete = async (word: string, dict: string) => {
    await deleteWordRecord(word, dict);
    setReload((prev) => !prev);
  };

  return (
    <>
      <div
        className={`relative flex h-screen w-full flex-col items-center pb-4 ease-in ${
          currentRowDetail && "blur-sm"
        }`}
      >
        <div className="mr-8 mt-4 flex w-auto items-center justify-center self-end">
          <h1 className="font-lighter mr-4 w-auto self-end text-gray-500 opacity-70">
            {t("errorBook.tip", "Tip: 点击错误单词查看详细信息")}
          </h1>
          <IconX
            className="h-7 w-7 cursor-pointer text-gray-400"
            onClick={onBack}
          />
        </div>

        <div className="flex w-full flex-1 select-text items-start justify-center overflow-hidden">
          <div className="flex h-full w-5/6 flex-col pt-10">
            <div className="flex w-full justify-between rounded-lg bg-white px-6 py-5 text-lg text-black shadow-lg dark:bg-gray-800 dark:text-white">
              <span className="basis-2/12">{t("errorBook.word", "单词")}</span>
              <span className="basis-6/12">
                {t("errorBook.translation", "释义")}
              </span>
              <HeadWrongNumber
                className="basis-1/12"
                sortType={sortType}
                setSortType={setSort}
              />
              <span className="basis-1/12">{t("errorBook.dict", "词典")}</span>
              <span className="basis-1/12"> </span>
            </div>
            <ScrollArea.Root className="flex-1 overflow-y-auto pt-5">
              <ScrollArea.Viewport className="h-full  ">
                <div className="flex flex-col gap-3">
                  {renderRecords.map((record) => (
                    <ErrorRow
                      key={`${record.dict}-${record.word}`}
                      record={record}
                      onDelete={() => handleDelete(record.word, record.dict)}
                    />
                  ))}
                </div>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                className="flex touch-none select-none bg-transparent"
                orientation="vertical"
              ></ScrollArea.Scrollbar>
            </ScrollArea.Root>
          </div>
        </div>
        <Pagination
          className="pt-3"
          page={currentPage}
          setPage={setPage}
          totalPages={totalPages}
        />
      </div>
      {currentRowDetail && (
        <RowDetail
          currentRowDetail={currentRowDetail}
          allRecords={sortedRecords}
        />
      )}
    </>
  );
}
