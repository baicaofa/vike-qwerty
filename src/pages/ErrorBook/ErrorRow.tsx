import { LoadingWordUI } from "./LoadingWordUI";
import useGetWord from "./hooks/useGetWord";
import { currentRowDetailAtom } from "./store";
import type { groupedWordRecords } from "./type";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { idDictionaryMap } from "@/resources/dictionary";
import { recordErrorBookAction } from "@/utils";
import { useSetAtom } from "jotai";
import type { FC } from "react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import DeleteIcon from "~icons/weui/delete-filled";

type IErrorRowProps = {
  record: groupedWordRecords;
  onDelete: () => void;
};

const ErrorRow: FC<IErrorRowProps> = ({ record, onDelete }) => {
  const setCurrentRowDetail = useSetAtom(currentRowDetailAtom);
  const dictInfo = idDictionaryMap[record.dict];
  const { word, isLoading, hasError } = useGetWord(record.word, dictInfo);
  const { t } = useTranslation("errors");

  const onClick = useCallback(() => {
    setCurrentRowDetail(record);
    recordErrorBookAction("detail");
  }, [record, setCurrentRowDetail]);

  return (
    <li
      className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-white px-6 py-3 text-black opacity-85 shadow-md dark:bg-gray-800 dark:text-white"
      onClick={onClick}
    >
      <span className="basis-2/12 break-normal">{record.word}</span>
      <span className="basis-6/12 break-normal">
        {word ? (
          (() => {
            // 处理翻译数据：优先使用 detailed_translations，如果没有则使用 trans
            if (
              word.detailed_translations &&
              word.detailed_translations.length > 0
            ) {
              return word.detailed_translations
                .map((trans) => trans.chinese)
                .filter(Boolean)
                .join("；");
            } else if (word.trans && Array.isArray(word.trans)) {
              return word.trans.join("；");
            }
            return "";
          })()
        ) : (
          <LoadingWordUI isLoading={isLoading} hasError={hasError} />
        )}
      </span>
      <span className="basis-1/12 break-normal pl-8">{record.wrongCount}</span>
      <span className="basis-1/12 break-normal">{dictInfo?.name}</span>
      <span
        className="basis-1/12 break-normal"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DeleteIcon />
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("errorBook.deleteRecords", "删除记录")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </span>
    </li>
  );
};

export default ErrorRow;
