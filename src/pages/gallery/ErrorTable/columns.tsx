import type { TErrorWordData } from "../hooks/useErrorWords";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ColumnDef } from "@tanstack/react-table";
import PhArrowsDownUpFill from "~icons/ph/arrows-down-up-fill";
import DeleteIcon from "~icons/weui/delete-filled";

export type ErrorColumn = {
  word: string;
  trans: string;
  errorCount: number;
  errorChar: string[];
};

export const errorColumns = (
  onDelete: (word: string) => Promise<void>
): ColumnDef<ErrorColumn>[] => [
  {
    accessorKey: "word",
    size: 100,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          单词
          <PhArrowsDownUpFill className="ml-1.5 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "trans",
    size: 500,
    header: "释义",
  },
  {
    accessorKey: "errorCount",
    size: 40,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          错误次数
          <PhArrowsDownUpFill className="ml-1.5 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="flex justify-center">{row.original.errorCount} </span>
      );
    },
  },
  {
    accessorKey: "errorChar",
    header: "易错字母",
    size: 100,
    cell: ({ row }) => {
      return (
        <p>
          {(row.getValue("errorChar") as string[]).map((char, index) => (
            <kbd className="flex justify-center" key={`${char}-${index}`}>
              {char + " "}
            </kbd>
          ))}
        </p>
      );
    },
  },
  {
    accessorKey: "delete",
    header: "",
    size: 40,
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <DeleteIcon
                className="cursor-pointer"
                onClick={() => onDelete(row.original.word)}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Records</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

export function getRowsFromErrorWordData(
  data: TErrorWordData[]
): ErrorColumn[] {
  return data.map((item) => {
    // 处理翻译数据：优先使用 detailed_translations，如果没有则使用 trans
    let translationText = "";

    if (
      item.originData.detailed_translations &&
      item.originData.detailed_translations.length > 0
    ) {
      // 使用新的 detailed_translations 格式
      translationText = item.originData.detailed_translations
        .map((trans) => trans.chinese)
        .filter(Boolean)
        .join("，");
    } else if (item.originData.trans && Array.isArray(item.originData.trans)) {
      // 兼容旧的 trans 格式
      translationText = item.originData.trans.join("，");
    }

    return {
      word: item.word,
      trans: translationText,
      errorCount: item.errorCount,
      errorChar: item.errorChar,
    };
  });
}
