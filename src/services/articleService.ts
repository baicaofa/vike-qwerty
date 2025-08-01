import { generateUUID } from "@/utils/uuid";
import { db } from "@/utils/db";
import type { CustomArticle } from "@/pages/CustomArticle/store/type";

// 文章操作结果类型
export interface ArticleOperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errorCode?: string;
}

// 文章保存参数
export interface SaveArticleParams {
  title: string;
  content: string;
  isOfficial?: boolean;
}

// 文章更新参数
export interface UpdateArticleParams {
  id: number;
  title?: string;
  content?: string;
  isOfficial?: boolean;
}

// 文章查询参数
export interface GetArticlesParams {
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'lastPracticedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  filter?: {
    isOfficial?: boolean;
    search?: string;
  };
}

// 文章服务类
export class ArticleService {
  private static instance: ArticleService;
  private operationQueue: Map<string, Promise<any>> = new Map();

  static getInstance(): ArticleService {
    if (!ArticleService.instance) {
      ArticleService.instance = new ArticleService();
    }
    return ArticleService.instance;
  }

  // 生成操作ID
  private generateOperationId(operation: string, params: any): string {
    return `${operation}_${JSON.stringify(params)}`;
  }

  // 防重复操作
  private async executeWithDeduplication<T>(
    operation: string,
    params: any,
    executor: () => Promise<T>
  ): Promise<T> {
    const operationId = this.generateOperationId(operation, params);
    
    if (this.operationQueue.has(operationId)) {
      return this.operationQueue.get(operationId);
    }

    const promise = executor().finally(() => {
      this.operationQueue.delete(operationId);
    });

    this.operationQueue.set(operationId, promise);
    return promise;
  }

  // 保存文章（事务性操作）
  async saveArticle(params: SaveArticleParams): Promise<ArticleOperationResult<{ id: number; uuid: string }>> {
    return this.executeWithDeduplication('saveArticle', params, async () => {
      try {
        // 数据验证
        const validationResult = this.validateArticleData(params);
        if (!validationResult.success) {
          return validationResult;
        }

        const uuid = generateUUID();
        const now = Date.now();

        // 检查是否已存在相同标题的文章
        const existingArticle = await db.articleRecords
          .where('title')
          .equals(params.title.trim())
          .first();

        if (existingArticle) {
          return {
            success: false,
            error: '文章标题已存在',
            errorCode: 'DUPLICATE_TITLE'
          };
        }

        const articleData = {
          ...params,
          uuid,
          createdAt: now,
          lastPracticedAt: now,
          isOfficial: params.isOfficial || false,
        };

        const id = await db.articleRecords.add(articleData);

        return {
          success: true,
          data: { id, uuid }
        };
      } catch (error) {
        console.error('保存文章失败:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : '保存文章失败',
          errorCode: 'SAVE_FAILED'
        };
      }
    });
  }

  // 更新文章（事务性操作）
  async updateArticle(params: UpdateArticleParams): Promise<ArticleOperationResult<boolean>> {
    return this.executeWithDeduplication('updateArticle', params, async () => {
      try {
        // 检查文章是否存在
        const existingArticle = await db.articleRecords.get(params.id);
        if (!existingArticle) {
          return {
            success: false,
            error: '文章不存在',
            errorCode: 'ARTICLE_NOT_FOUND'
          };
        }

        // 数据验证
        if (params.title || params.content) {
          const validationParams = {
            title: params.title || existingArticle.title,
            content: params.content || existingArticle.content,
            isOfficial: params.isOfficial ?? existingArticle.isOfficial
          };
          
          const validationResult = this.validateArticleData(validationParams);
          if (!validationResult.success) {
            return validationResult;
          }
        }

        // 检查标题重复（排除当前文章）
        if (params.title && params.title !== existingArticle.title) {
          const duplicateArticle = await db.articleRecords
            .where('title')
            .equals(params.title.trim())
            .filter(article => article.id !== params.id)
            .first();

          if (duplicateArticle) {
            return {
              success: false,
              error: '文章标题已存在',
              errorCode: 'DUPLICATE_TITLE'
            };
          }
        }

        const updateData: Partial<CustomArticle> = {
          lastPracticedAt: Date.now()
        };

        if (params.title !== undefined) updateData.title = params.title;
        if (params.content !== undefined) updateData.content = params.content;
        if (params.isOfficial !== undefined) updateData.isOfficial = params.isOfficial;

        await db.articleRecords.update(params.id, updateData);

        return {
          success: true,
          data: true
        };
      } catch (error) {
        console.error('更新文章失败:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : '更新文章失败',
          errorCode: 'UPDATE_FAILED'
        };
      }
    });
  }

  // 获取文章列表（支持分页和过滤）
  async getArticles(params: GetArticlesParams = {}): Promise<ArticleOperationResult<{
    articles: CustomArticle[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  }>> {
    try {
      const {
        page = 1,
        pageSize = 20,
        sortBy = 'lastPracticedAt',
        sortOrder = 'desc',
        filter = {}
      } = params;

      let query = db.articleRecords.toCollection();

      // 应用过滤条件
      if (filter.isOfficial !== undefined) {
        query = query.filter(article => article.isOfficial === filter.isOfficial);
      }

      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        query = query.filter(article => 
          article.title.toLowerCase().includes(searchTerm) ||
          article.content.toLowerCase().includes(searchTerm)
        );
      }

      // 获取总数
      const total = await query.count();

      // 应用排序和分页
      const offset = (page - 1) * pageSize;
      const articles = await query
        .sortBy(sortBy)
        .then(sorted => sortOrder === 'desc' ? sorted.reverse() : sorted)
        .then(sorted => sorted.slice(offset, offset + pageSize));

      return {
        success: true,
        data: {
          articles,
          total,
          page,
          pageSize,
          hasMore: offset + pageSize < total
        }
      };
    } catch (error) {
      console.error('获取文章列表失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取文章列表失败',
        errorCode: 'FETCH_FAILED'
      };
    }
  }

  // 获取单篇文章
  async getArticle(id: number): Promise<ArticleOperationResult<CustomArticle>> {
    try {
      const article = await db.articleRecords.get(id);
      
      if (!article) {
        return {
          success: false,
          error: '文章不存在',
          errorCode: 'ARTICLE_NOT_FOUND'
        };
      }

      return {
        success: true,
        data: article
      };
    } catch (error) {
      console.error('获取文章失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取文章失败',
        errorCode: 'FETCH_FAILED'
      };
    }
  }

  // 删除文章
  async deleteArticle(id: number): Promise<ArticleOperationResult<boolean>> {
    return this.executeWithDeduplication('deleteArticle', { id }, async () => {
      try {
        // 检查文章是否存在
        const existingArticle = await db.articleRecords.get(id);
        if (!existingArticle) {
          return {
            success: false,
            error: '文章不存在',
            errorCode: 'ARTICLE_NOT_FOUND'
          };
        }

        await db.articleRecords.delete(id);

        return {
          success: true,
          data: true
        };
      } catch (error) {
        console.error('删除文章失败:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : '删除文章失败',
          errorCode: 'DELETE_FAILED'
        };
      }
    });
  }

  // 批量删除文章
  async deleteArticles(ids: number[]): Promise<ArticleOperationResult<{ success: number; failed: number }>> {
    return this.executeWithDeduplication('deleteArticles', { ids }, async () => {
      try {
        let success = 0;
        let failed = 0;

        for (const id of ids) {
          const result = await this.deleteArticle(id);
          if (result.success) {
            success++;
          } else {
            failed++;
          }
        }

        return {
          success: true,
          data: { success, failed }
        };
      } catch (error) {
        console.error('批量删除文章失败:', error);
        return {
          success: false,
          error: error instanceof Error ? error.message : '批量删除文章失败',
          errorCode: 'BATCH_DELETE_FAILED'
        };
      }
    });
  }

  // 更新练习时间
  async updatePracticeTime(id: number): Promise<ArticleOperationResult<boolean>> {
    try {
      const existingArticle = await db.articleRecords.get(id);
      if (!existingArticle) {
        return {
          success: false,
          error: '文章不存在',
          errorCode: 'ARTICLE_NOT_FOUND'
        };
      }

      await db.articleRecords.update(id, {
        lastPracticedAt: Date.now()
      });

      return {
        success: true,
        data: true
      };
    } catch (error) {
      console.error('更新练习时间失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '更新练习时间失败',
        errorCode: 'UPDATE_FAILED'
      };
    }
  }

  // 数据验证
  private validateArticleData(params: SaveArticleParams): ArticleOperationResult {
    const { title, content } = params;

    // 标题验证
    if (!title || !title.trim()) {
      return {
        success: false,
        error: '文章标题不能为空',
        errorCode: 'EMPTY_TITLE'
      };
    }

    if (title.trim().length > 100) {
      return {
        success: false,
        error: '文章标题不能超过100个字符',
        errorCode: 'TITLE_TOO_LONG'
      };
    }

    // 内容验证
    if (!content || !content.trim()) {
      return {
        success: false,
        error: '文章内容不能为空',
        errorCode: 'EMPTY_CONTENT'
      };
    }

    if (content.length > 50000) {
      return {
        success: false,
        error: '文章内容不能超过50000个字符',
        errorCode: 'CONTENT_TOO_LONG'
      };
    }

    // 内容安全检查
    if (this.containsSuspiciousContent(content)) {
      return {
        success: false,
        error: '文章内容包含不安全的字符',
        errorCode: 'SUSPICIOUS_CONTENT'
      };
    }

    return {
      success: true
    };
  }

  // 内容安全检查
  private containsSuspiciousContent(content: string): boolean {
    // 检查XSS攻击相关的脚本标签
    const scriptPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b/gi,
      /<object\b/gi,
      /<embed\b/gi
    ];

    return scriptPatterns.some(pattern => pattern.test(content));
  }

  // 清理内容
  cleanContent(content: string): string {
    // 移除HTML标签
    let cleaned = content.replace(/<[^>]*>/g, '');
    
    // 移除多余的空白字符
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    // 移除控制字符
    cleaned = cleaned.replace(/[\x00-\x1F\x7F]/g, '');
    
    return cleaned;
  }

  // 获取文章统计信息
  async getArticleStats(): Promise<ArticleOperationResult<{
    total: number;
    custom: number;
    official: number;
    totalWords: number;
    averageLength: number;
  }>> {
    try {
      const allArticles = await db.articleRecords.toArray();
      
      const total = allArticles.length;
      const custom = allArticles.filter(a => !a.isOfficial).length;
      const official = allArticles.filter(a => a.isOfficial).length;
      
      const totalWords = allArticles.reduce((sum, article) => {
        return sum + article.content.split(/\s+/).length;
      }, 0);
      
      const averageLength = total > 0 ? Math.round(totalWords / total) : 0;

      return {
        success: true,
        data: {
          total,
          custom,
          official,
          totalWords,
          averageLength
        }
      };
    } catch (error) {
      console.error('获取文章统计失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取文章统计失败',
        errorCode: 'STATS_FAILED'
      };
    }
  }
}

// 导出单例实例
export const articleService = ArticleService.getInstance();