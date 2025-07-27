import { WordEditModal } from "../../components/WordEditModal";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { DictionaryEditForm } from "./components/DictionaryEditForm";
import { WordList } from "./components/WordList";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  useCustomDictionaryAPI,
  useCustomWordAPI,
} from "@/hooks/useCustomDictionary";
import { useToast } from "@/hooks/useToast";
import {
  extractCustomDictionaryId,
  isCustomDictionary,
} from "@/store/customDictionary";
import type {
  ICustomDictionary,
  ICustomWord,
} from "@/utils/db/customDictionary";
import { useState, useEffect } from "react";
import { navigate } from "vike/client/router";
import type { PageContext } from "vike/types";

interface Props {
  pageContext: PageContext & {
    pageProps?: {
      dictionaryId?: string;
      urlDictionaryId?: string;
      error?: string;
    };
  };
}

// 词典编辑页面组件
function Page({ pageContext }: Props) {
  const { routeParams, pageProps } = pageContext;
  const { success, error: showError } = useToast();
  const { getDictionary } = useCustomDictionaryAPI();
  const { deleteWord } = useCustomWordAPI();

  // 状态
  const [loading, setLoading] = useState(true);
  const [dictionary, setDictionary] = useState<ICustomDictionary | null>(null);
  const [error, setError] = useState<string | null>(pageProps?.error || null);
  const [isWordModalOpen, setIsWordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentWord, setCurrentWord] = useState<ICustomWord | undefined>(
    undefined
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // 获取词典ID
  const urlDictionaryId = pageProps?.urlDictionaryId || routeParams?.id;
  const dictionaryId =
    pageProps?.dictionaryId ||
    (isCustomDictionary(urlDictionaryId)
      ? extractCustomDictionaryId(urlDictionaryId)
      : urlDictionaryId);

  // 在客户端获取词典数据
  useEffect(() => {
    if (error) {
      setLoading(false);
      return;
    }

    async function fetchDictionary() {
      try {
        console.log(`客户端获取词典数据，ID: ${dictionaryId}`);
        const result = await getDictionary(dictionaryId);

        if (result.success && result.dictionary) {
          console.log("获取词典成功:", result.dictionary);
          setDictionary(result.dictionary);
        } else {
          console.error("获取词典失败:", result.error);
          setError(result.error || "获取词典数据失败");
        }
      } catch (err) {
        console.error("获取词典异常:", err);
        setError(err instanceof Error ? err.message : "获取词典数据失败");
      } finally {
        setLoading(false);
      }
    }

    fetchDictionary();
  }, [dictionaryId, error, getDictionary]);

  // 处理返回
  const handleGoBack = () => {
    navigate("/gallery");
  };

  // 处理词典信息更新成功
  const handleDictionaryUpdated = () => {
    // 重新加载词典信息
    if (dictionaryId) {
      getDictionary(dictionaryId).then((result) => {
        if (result.success && result.dictionary) {
          setDictionary(result.dictionary);
        }
      });
    }
  };

  // 处理添加单词
  const handleAddWord = () => {
    setCurrentWord(undefined); // 清空当前单词，表示添加模式
    setIsWordModalOpen(true);
  };

  // 处理编辑单词
  const handleEditWord = (word: ICustomWord) => {
    setCurrentWord(word);
    setIsWordModalOpen(true);
  };

  // 处理删除单词
  const handleDeleteWord = (word: ICustomWord) => {
    setCurrentWord(word);
    setIsDeleteModalOpen(true);
  };

  // 确认删除单词
  const handleConfirmDelete = async () => {
    if (!currentWord) return;

    setIsDeleting(true);
    try {
      const result = await deleteWord(dictionaryId, currentWord.id);
      if (result.success) {
        success("单词删除成功");
        setIsDeleteModalOpen(false);
        // 刷新单词列表
        handleRefreshWordList();
      } else {
        showError(result.error || "删除失败");
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : "删除失败");
    } finally {
      setIsDeleting(false);
    }
  };

  // 刷新单词列表
  const handleRefreshWordList = () => {
    // 这个函数会被传递给WordList组件，由它来实现刷新逻辑
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6">编辑词典</h1>
          <p>加载中...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-6">编辑词典</h1>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
          <Button onClick={handleGoBack}>返回词库列表</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">编辑词典</h1>
          <Button variant="outline" onClick={handleGoBack}>
            返回词库列表
          </Button>
        </div>

        {dictionary ? (
          <>
            {/* 词典编辑表单 */}
            <DictionaryEditForm
              dictionary={dictionary}
              onSaved={handleDictionaryUpdated}
            />

            {/* 单词列表 */}
            <WordList
              dictionaryId={dictionaryId}
              onEdit={handleEditWord}
              onDelete={handleDeleteWord}
              onAdd={handleAddWord}
              onRefresh={handleRefreshWordList}
            />

            {/* 单词编辑模态框 */}
            <WordEditModal
              word={currentWord || null}
              dictId={dictionaryId}
              isOpen={isWordModalOpen}
              onClose={() => setIsWordModalOpen(false)}
              onSuccess={handleRefreshWordList}
            />

            {/* 删除确认对话框 */}
            <ConfirmDialog
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirm={handleConfirmDelete}
              title="删除单词"
              message={`确定要删除单词 "${currentWord?.name}" 吗？此操作无法撤销。`}
              confirmText="删除"
              cancelText="取消"
              isLoading={isDeleting}
            />
          </>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4">
            未获取到词典数据，但未报错。请检查控制台日志。
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Page;
