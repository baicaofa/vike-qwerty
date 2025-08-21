import { Button } from "@/components/ui/button";
import { useCustomWordAPI } from "@/hooks/useCustomDictionary";
import type { ICustomWord } from "@/utils/db/customDictionary";
import { useEffect, useState } from "react";
import IconEdit from "~icons/tabler/edit";
import IconPlus from "~icons/tabler/plus";
import IconTrash from "~icons/tabler/trash";

interface WordListProps {
  dictionaryId: string;
  onEdit: (word: ICustomWord) => void;
  onDelete: (word: ICustomWord) => void;
  onAdd: () => void;
  onRefresh: () => void;
}

export function WordList({
  dictionaryId,
  onEdit,
  onDelete,
  onAdd,
  onRefresh,
}: WordListProps) {
  const { getWords, loading } = useCustomWordAPI();
  const [words, setWords] = useState<ICustomWord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 20;

  // 加载单词列表
  const loadWords = async (pageNum: number = page) => {
    try {
      setError(null);
      const result = await getWords(dictionaryId, pageNum, pageSize);

      if (result.success && result.words) {
        setWords(result.words);
        // 计算总页数
        if (result.total) {
          setTotalPages(Math.ceil(result.total / pageSize));
        }
      } else {
        setError(result.error || "获取单词列表失败");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "获取单词列表失败");
    }
  };

  // 初始加载
  useEffect(() => {
    if (dictionaryId) {
      loadWords(1);
    }
  }, [dictionaryId]);

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      loadWords(newPage);
    }
  };

  // 处理刷新
  const handleRefresh = () => {
    loadWords(page);
    onRefresh();
  };

  // 生成页码列表
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // 如果总页数小于等于最大显示页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 否则，显示当前页附近的页码
      let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">单词列表</h2>
        <div className="space-x-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            刷新
          </Button>
          <Button onClick={onAdd} size="sm">
            <IconPlus className="mr-1 h-4 w-4" /> 添加单词
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4">加载中...</div>
      ) : words.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>词典中还没有单词</p>
          <Button onClick={onAdd} className="mt-2">
            添加单词
          </Button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    单词
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    翻译
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    音标
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {words.map((word, index) => (
                  <tr
                    key={word.id || `word-${index}-${word.name}`}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {word.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {word.userData?.detailed_translations
                        ?.map((t) => t.chinese)
                        .join("; ") || ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {word.userData?.usphone
                        ? `美 [${word.userData.usphone}]`
                        : ""}
                      {word.userData?.ukphone
                        ? `英 [${word.userData.ukphone}]`
                        : ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(word)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          aria-label="编辑单词"
                        >
                          <IconEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => onDelete(word)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          aria-label="删除单词"
                        >
                          <IconTrash className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <Button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                variant="outline"
                size="sm"
              >
                上一页
              </Button>

              {generatePageNumbers().map((pageNum) => (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                >
                  {pageNum}
                </Button>
              ))}

              <Button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                variant="outline"
                size="sm"
              >
                下一页
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
