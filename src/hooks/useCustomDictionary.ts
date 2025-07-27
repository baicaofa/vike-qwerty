import type {
  GetCustomDictionariesParams,
  GetCustomWordsParams,
  ICustomDictionary,
  ICustomWord,
  SaveCustomDictionaryResult,
  SaveCustomWordResult,
} from "../utils/db/customDictionary";
import * as customDictionaryService from "@/services/customDictionaryService";
import { useCallback, useState } from "react";

/**
 * 自定义词库API钩子
 * 用于管理自定义词库的CRUD操作
 */
export function useCustomDictionaryAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取所有词库
  const getDictionaries = useCallback(
    async (params?: customDictionaryService.GetCustomDictionariesParams) => {
      setLoading(true);
      setError(null);
      try {
        const result = await customDictionaryService.getDictionaries(params);
        if (!result.success && result.error) {
          setError(result.error);
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return { success: false, dictionaries: [], error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 获取单个词库
  const getDictionary = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await customDictionaryService.getDictionary(id);
      if (!result.success && result.error) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建词库
  const createDictionary = useCallback(
    async (dictionary: Partial<ICustomDictionary>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await customDictionaryService.createDictionary(
          dictionary
        );
        if (!result.success && result.error) {
          setError(result.error);
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 更新词库
  const updateDictionary = useCallback(
    async (id: string, dictionary: Partial<ICustomDictionary>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await customDictionaryService.updateDictionary(
          id,
          dictionary
        );
        if (!result.success && result.error) {
          setError(result.error);
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 删除词库
  const deleteDictionary = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await customDictionaryService.deleteDictionary(id);
      if (!result.success && result.error) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // 添加单词到词库
  const addWords = useCallback(
    async (dictId: string, words: ICustomWord[] | string[]) => {
      setLoading(true);
      setError(null);
      try {
        const result = await customDictionaryService.addWords(dictId, words);
        if (!result.success && result.error) {
          setError(result.error);
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return { success: false, addedCount: 0, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    getDictionaries,
    getDictionary,
    createDictionary,
    updateDictionary,
    deleteDictionary,
    addWords,
  };
}

/**
 * 自定义单词API钩子
 * 用于管理自定义词库中单词的CRUD操作
 */
export function useCustomWordAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取词库中的单词
  const getWords = useCallback(
    async (dictId: string, page = 1, pageSize = 20) => {
      setLoading(true);
      setError(null);
      try {
        const result = await customDictionaryService.getDictionaryWords(
          dictId,
          page,
          pageSize
        );
        if (!result.success && result.error) {
          setError(result.error);
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return { success: false, words: [], error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 更新单词
  const updateWord = useCallback(
    async (dictId: string, wordId: string, word: Partial<ICustomWord>) => {
      setLoading(true);
      setError(null);
      try {
        const result = await customDictionaryService.updateWord(
          dictId,
          wordId,
          word
        );
        if (!result.success && result.error) {
          setError(result.error);
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // 删除单词
  const deleteWord = useCallback(async (dictId: string, wordId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await customDictionaryService.deleteWord(dictId, wordId);
      if (!result.success && result.error) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // 添加单词到词库（在useCustomWordAPI中也提供此方法）
  const addWords = useCallback(
    async (dictId: string, words: ICustomWord[] | string[]) => {
      setLoading(true);
      setError(null);
      try {
        const result = await customDictionaryService.addWords(dictId, words);
        if (!result.success && result.error) {
          setError(result.error);
        }
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setError(errorMessage);
        return { success: false, addedCount: 0, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    getWords,
    updateWord,
    deleteWord,
    addWords,
  };
}

/**
 * Excel上传API钩子
 * 用于处理Excel文件上传和模板下载
 */
export function useExcelUploadAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 下载Excel模板 - 现在使用前端方法生成
  const downloadTemplate = useCallback(() => {
    setLoading(true);
    setError(null);
    try {
      import("xlsx")
        .then(({ utils, writeFileXLSX }) => {
          // 使用excelParser.ts中的generateExcelTemplate函数
          import("../utils/excelParser")
            .then(({ generateExcelTemplate }) => {
              try {
                const wb = generateExcelTemplate();
                writeFileXLSX(wb, "自定义词库模板.xlsx");
                setLoading(false);
              } catch (err) {
                const errorMessage =
                  err instanceof Error ? err.message : String(err);
                setError(errorMessage);
                setLoading(false);
              }
            })
            .catch((err) => {
              setError("加载Excel解析模块失败");
              setLoading(false);
            });
        })
        .catch((err) => {
          setError("加载xlsx模块失败");
          setLoading(false);
        });
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  }, []);

  return {
    loading,
    error,
    downloadTemplate,
  };
}
