import { Button } from "@/components/ui/button";
import { useCustomDictionaryAPI } from "@/hooks/useCustomDictionary";
import { useToast } from "@/hooks/useToast";
import { currentChapterAtom, currentDictIdAtom } from "@/store";
import { customDictionariesAtom } from "@/store/customDictionary";
import type { ICustomDictionary } from "@/utils/db/customDictionary";
import { useAtom, useSetAtom } from "jotai";
import { useEffect } from "react";
import { navigate } from "vike/client/router";
import IconPlus from "~icons/tabler/plus";

interface CustomDictionaryListProps {
  onOpenUploadModal: () => void;
}

/**
 * 自定义词典列表组件
 * 注意：此组件现在由AuthRequiredWrapper保护，无需自己处理登录验证
 */
export function CustomDictionaryList({
  onOpenUploadModal,
}: CustomDictionaryListProps) {
  const [customDictionaries, setCustomDictionaries] = useAtom(
    customDictionariesAtom
  );
  const { getDictionaries, deleteDictionary } = useCustomDictionaryAPI();
  const { success, error: showError } = useToast();
  const setCurrentDictId = useSetAtom(currentDictIdAtom);
  const setCurrentChapter = useSetAtom(currentChapterAtom);

  // 加载自定义词库列表
  useEffect(() => {
    const fetchDictionaries = async () => {
      try {
        const result = await getDictionaries();
        if (result.success && result.dictionaries) {
          setCustomDictionaries(result.dictionaries);
        } else {
          showError(result.error || "获取词库列表失败");
        }
      } catch (err) {
        showError(err instanceof Error ? err.message : "获取词库列表失败");
      }
    };

    fetchDictionaries();
  }, [getDictionaries, setCustomDictionaries, showError]);

  // 删除词库处理函数
  const handleDeleteDictionary = async (dictionary: ICustomDictionary) => {
    if (!dictionary.id) return;

    if (
      window.confirm(`确定要删除词库"${dictionary.name}"吗？此操作不可恢复。`)
    ) {
      try {
        const result = await deleteDictionary(dictionary.id);

        if (result.success) {
          // 从列表中移除被删除的词库
          setCustomDictionaries((prev) =>
            prev.filter((dict) => dict.id !== dictionary.id)
          );
          // 显示详细的删除信息
          const message =
            (result as any).message || `词库"${dictionary.name}"删除成功`;
          success(message);
        } else {
          showError(result.error || "删除词库失败");
        }
      } catch (err) {
        showError(err instanceof Error ? err.message : "删除词库失败");
      }
    }
  };

  const handlePracticeClick = (dictId: string) => {
    setCurrentDictId(`custom_${dictId}`);
    setCurrentChapter(0);
    navigate("/");
  };

  if (customDictionaries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
        <p className="mb-4 text-lg text-gray-600 dark:text-gray-400">
          您还没有创建任何自定义词库
        </p>
        <Button onClick={onOpenUploadModal}>上传第一个词库</Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">我的词库</h2>
        <Button onClick={onOpenUploadModal} className="flex items-center gap-2">
          <IconPlus className="h-4 w-4" />
          <span>上传新词库</span>
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {customDictionaries.map((dictionary) => (
          <div
            key={dictionary.id}
            className="flex flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex flex-1 flex-col p-4">
              {dictionary.name}

              <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                {dictionary.description || "无描述"}
              </p>
              <div className="mb-2 flex flex-wrap gap-2">
                {dictionary.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-auto text-sm text-gray-600 dark:text-gray-400">
                {dictionary.length} 个单词
              </p>
            </div>
            <div className="flex justify-end border-t border-gray-200 p-2 dark:border-gray-800">
              <Button
                variant="outline"
                size="sm"
                className="mr-2"
                onClick={() =>
                  navigate(`/gallery/custom_${dictionary.id}/edit`)
                }
              >
                编辑
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="mr-2"
                onClick={() => handlePracticeClick(dictionary.id)}
              >
                练习
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                onClick={() => handleDeleteDictionary(dictionary)}
              >
                删除
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
