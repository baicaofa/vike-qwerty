import { useCallback, useEffect, useRef, useState } from "react";
import { articleService, type ArticleOperationResult, type GetArticlesParams } from "@/services/articleService";
import type { CustomArticle } from "../store/type";

// 缓存配置
interface CacheConfig {
  maxAge: number; // 缓存最大年龄（毫秒）
  maxSize: number; // 缓存最大条目数
}

// 文章列表状态
interface ArticleListState {
  articles: CustomArticle[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

// 文章管理Hook
export function useArticleManager(config: {
  initialPageSize?: number;
  cacheConfig?: Partial<CacheConfig>;
  autoRefresh?: boolean;
  refreshInterval?: number;
} = {}) {
  const {
    initialPageSize = 20,
    cacheConfig = { maxAge: 5 * 60 * 1000, maxSize: 100 },
    autoRefresh = false,
    refreshInterval = 30000
  } = config;

  // 状态管理
  const [state, setState] = useState<ArticleListState>({
    articles: [],
    total: 0,
    page: 1,
    pageSize: initialPageSize,
    hasMore: false,
    isLoading: false,
    error: null,
    lastUpdated: null
  });

  // 缓存管理
  const cacheRef = useRef<Map<string, { data: any; timestamp: number }>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 生成缓存键
  const generateCacheKey = useCallback((params: GetArticlesParams): string => {
    return `articles_${JSON.stringify(params)}`;
  }, []);

  // 清理过期缓存
  const cleanupCache = useCallback(() => {
    const now = Date.now();
    const { maxAge, maxSize } = cacheConfig;
    
    // 清理过期条目
    for (const [key, value] of cacheRef.current.entries()) {
      if (now - value.timestamp > maxAge) {
        cacheRef.current.delete(key);
      }
    }

    // 如果缓存过大，删除最旧的条目
    if (cacheRef.current.size > maxSize) {
      const entries = Array.from(cacheRef.current.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const toDelete = entries.slice(0, entries.length - maxSize);
      toDelete.forEach(([key]) => cacheRef.current.delete(key));
    }
  }, [cacheConfig]);

  // 获取缓存数据
  const getCachedData = useCallback((cacheKey: string) => {
    const cached = cacheRef.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheConfig.maxAge) {
      return cached.data;
    }
    return null;
  }, [cacheConfig.maxAge]);

  // 设置缓存数据
  const setCachedData = useCallback((cacheKey: string, data: any) => {
    cleanupCache();
    cacheRef.current.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }, [cleanupCache]);

  // 加载文章列表
  const loadArticles = useCallback(async (params: GetArticlesParams = {}, useCache = true) => {
    const cacheKey = generateCacheKey(params);
    
    // 检查缓存
    if (useCache) {
      const cached = getCachedData(cacheKey);
      if (cached) {
        setState(prev => ({
          ...prev,
          ...cached,
          isLoading: false,
          error: null
        }));
        return cached;
      }
    }

    // 取消之前的请求
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 创建新的AbortController
    abortControllerRef.current = new AbortController();

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const result = await articleService.getArticles(params);
      
      if (abortControllerRef.current.signal.aborted) {
        return null;
      }

      if (result.success && result.data) {
        const newState = {
          articles: result.data.articles,
          total: result.data.total,
          page: result.data.page,
          pageSize: result.data.pageSize,
          hasMore: result.data.hasMore,
          isLoading: false,
          error: null,
          lastUpdated: Date.now()
        };

        setState(newState);
        
        // 缓存结果
        setCachedData(cacheKey, newState);
        
        return result.data;
      } else {
        const errorMessage = result.error || '加载文章列表失败';
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }));
        return null;
      }
    } catch (error) {
      if (abortControllerRef.current.signal.aborted) {
        return null;
      }

      const errorMessage = error instanceof Error ? error.message : '加载文章列表失败';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return null;
    }
  }, [generateCacheKey, getCachedData, setCachedData]);

  // 刷新文章列表
  const refreshArticles = useCallback(async (params?: GetArticlesParams) => {
    return loadArticles(params || {
      page: state.page,
      pageSize: state.pageSize
    }, false);
  }, [loadArticles, state.page, state.pageSize]);

  // 加载下一页
  const loadNextPage = useCallback(async () => {
    if (state.isLoading || !state.hasMore) return;

    const nextPage = state.page + 1;
    const result = await loadArticles({
      page: nextPage,
      pageSize: state.pageSize
    });

    if (result) {
      setState(prev => ({
        ...prev,
        articles: [...prev.articles, ...result.articles],
        page: nextPage,
        hasMore: result.hasMore
      }));
    }
  }, [loadArticles, state.isLoading, state.hasMore, state.page, state.pageSize]);

  // 搜索文章
  const searchArticles = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      return refreshArticles();
    }

    return loadArticles({
      page: 1,
      pageSize: state.pageSize,
      filter: { search: searchTerm }
    }, false);
  }, [refreshArticles, loadArticles, state.pageSize]);

  // 过滤文章
  const filterArticles = useCallback(async (filter: { isOfficial?: boolean }) => {
    return loadArticles({
      page: 1,
      pageSize: state.pageSize,
      filter
    }, false);
  }, [loadArticles, state.pageSize]);

  // 保存文章
  const saveArticle = useCallback(async (title: string, content: string, isOfficial = false) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await articleService.saveArticle({ title, content, isOfficial });
      
      if (result.success) {
        // 刷新列表
        await refreshArticles();
        return { success: true, data: result.data };
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || '保存文章失败'
        }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '保存文章失败';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, [refreshArticles]);

  // 更新文章
  const updateArticle = useCallback(async (id: number, updates: { title?: string; content?: string; isOfficial?: boolean }) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await articleService.updateArticle({ id, ...updates });
      
      if (result.success) {
        // 刷新列表
        await refreshArticles();
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || '更新文章失败'
        }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新文章失败';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, [refreshArticles]);

  // 删除文章
  const deleteArticle = useCallback(async (id: number) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await articleService.deleteArticle(id);
      
      if (result.success) {
        // 从当前列表中移除
        setState(prev => ({
          ...prev,
          articles: prev.articles.filter(article => article.id !== id),
          total: prev.total - 1,
          isLoading: false
        }));
        return { success: true };
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || '删除文章失败'
        }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除文章失败';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, []);

  // 批量删除文章
  const deleteArticles = useCallback(async (ids: number[]) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await articleService.deleteArticles(ids);
      
      if (result.success) {
        // 刷新列表
        await refreshArticles();
        return { success: true, data: result.data };
      } else {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: result.error || '批量删除文章失败'
        }));
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '批量删除文章失败';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
      return { success: false, error: errorMessage };
    }
  }, [refreshArticles]);

  // 更新练习时间
  const updatePracticeTime = useCallback(async (id: number) => {
    try {
      const result = await articleService.updatePracticeTime(id);
      if (result.success) {
        // 更新本地状态
        setState(prev => ({
          ...prev,
          articles: prev.articles.map(article => 
            article.id === id 
              ? { ...article, lastPracticedAt: Date.now() }
              : article
          )
        }));
      }
      return result;
    } catch (error) {
      console.error('更新练习时间失败:', error);
      return { success: false, error: '更新练习时间失败' };
    }
  }, []);

  // 清理错误
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // 清理缓存
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  // 自动刷新
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      refreshTimerRef.current = setInterval(() => {
        refreshArticles();
      }, refreshInterval);

      return () => {
        if (refreshTimerRef.current) {
          clearInterval(refreshTimerRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, refreshArticles]);

  // 清理函数
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
      }
    };
  }, []);

  return {
    // 状态
    ...state,
    
    // 操作方法
    loadArticles,
    refreshArticles,
    loadNextPage,
    searchArticles,
    filterArticles,
    saveArticle,
    updateArticle,
    deleteArticle,
    deleteArticles,
    updatePracticeTime,
    
    // 工具方法
    clearError,
    clearCache,
    
    // 计算属性
    isEmpty: state.articles.length === 0 && !state.isLoading,
    isError: !!state.error,
    canLoadMore: state.hasMore && !state.isLoading
  };
}