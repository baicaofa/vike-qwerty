import type {
  ICustomDictionary,
  ICustomWord,
} from "../utils/db/customDictionary";
import {
  createCustomDictionary,
  createCustomWord,
} from "../utils/db/customDictionary";

// API基础路径
const API_BASE_URL = "/api";

// 通用响应接口
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// 获取身份验证令牌
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// 获取词库列表参数
export interface GetCustomDictionariesParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

// 获取词库列表响应
export interface GetCustomDictionariesResult extends ApiResponse {
  dictionaries?: ICustomDictionary[];
  total?: number;
  page?: number;
  pageSize?: number;
}

// 获取单个词库响应
export interface GetCustomDictionaryResult extends ApiResponse {
  dictionary?: ICustomDictionary;
}

// 保存词库响应
export interface SaveCustomDictionaryResult extends ApiResponse {
  dictionary?: ICustomDictionary;
}

// 获取单词列表响应
export interface GetCustomWordsResult extends ApiResponse {
  words?: ICustomWord[];
  total?: number;
  page?: number;
  pageSize?: number;
}

// 保存单词响应
export interface SaveCustomWordsResult extends ApiResponse {
  words?: ICustomWord[];
}

/**
 * 获取用户所有自定义词库
 */
export async function getDictionaries(
  params?: GetCustomDictionariesParams
): Promise<GetCustomDictionariesResult> {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.order) queryParams.append("order", params.order);
    }

    const url = `${API_BASE_URL}/custom-dictionaries${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;
    const response = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `获取词库列表失败: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return {
      success: true,
      dictionaries: result.dictionaries,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  } catch (error) {
    console.error("获取词库列表出错:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取词库列表失败",
    };
  }
}

/**
 * 获取单个词库详情
 */
export async function getDictionary(
  id: string
): Promise<GetCustomDictionaryResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/custom-dictionaries/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `获取词库详情失败: ${response.status} ${response.statusText}`
      );
    }

    const dictionary = await response.json();
    return {
      success: true,
      dictionary,
    };
  } catch (error) {
    console.error("获取词库详情出错:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "获取词库详情失败",
    };
  }
}

/**
 * 创建新词库
 */
export async function createDictionary(
  dictionary: Partial<ICustomDictionary>
): Promise<SaveCustomDictionaryResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/custom-dictionaries`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(dictionary),
    });

    if (!response.ok) {
      // 尝试解析错误响应
      let errorMessage = `创建词库失败: ${response.status} ${response.statusText}`;

      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        // 如果无法解析JSON，使用默认错误信息
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    return {
      success: true,
      dictionary: result,
    };
  } catch (error) {
    console.error("创建词库出错:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "创建词库失败",
    };
  }
}

/**
 * 更新词库信息
 */
export async function updateDictionary(
  id: string,
  dictionary: Partial<ICustomDictionary>
): Promise<SaveCustomDictionaryResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/custom-dictionaries/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(dictionary),
    });

    if (!response.ok) {
      throw new Error(
        `更新词库失败: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return {
      success: true,
      dictionary: result,
    };
  } catch (error) {
    console.error("更新词库出错:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新词库失败",
    };
  }
}

/**
 * 删除词库
 */
export async function deleteDictionary(
  id: string
): Promise<ApiResponse & { deletedWordsCount?: number; message?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/custom-dictionaries/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(
        `删除词库失败: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return {
      success: true,
      deletedWordsCount: result.deletedWordsCount,
      message: result.message,
    };
  } catch (error) {
    console.error("删除词库出错:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "删除词库失败",
    };
  }
}

/**
 * 获取词库单词列表
 */
export async function getDictionaryWords(
  dictId: string,
  page = 1,
  pageSize = 20
): Promise<GetCustomWordsResult> {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/custom-dictionaries/${dictId}/words?${queryParams.toString()}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `获取单词列表失败: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return {
      success: true,
      words: result.words,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  } catch (error) {
    console.error("获取单词列表出错:", error);
    return {
      success: false,
      words: [],
      error: error instanceof Error ? error.message : "获取单词列表失败",
    };
  }
}

/**
 * 添加单词到词库
 */
export async function addWords(
  dictId: string,
  words: ICustomWord[] | string[]
): Promise<SaveCustomWordsResult & { result?: any }> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/custom-dictionaries/${dictId}/words`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ words }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `添加单词失败: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return {
      success: true,
      words: result.words,
      result: result.result, // 包含补充统计信息
    };
  } catch (error) {
    console.error("添加单词出错:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "添加单词失败",
    };
  }
}

/**
 * 预览词汇补充结果
 */
export async function previewEnrichment(words: string[]): Promise<{
  success: boolean;
  result?: {
    total: number;
    enriched: number;
    empty: number;
    enrichmentRate: string;
  };
  error?: string;
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/custom-dictionaries/preview-enrichment`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ words }),
      }
    );

    if (!response.ok) {
      throw new Error(`预览失败: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("预览词汇补充出错:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "预览失败",
    };
  }
}

/**
 * 更新单词信息
 */
export async function updateWord(
  dictId: string,
  wordId: string,
  updateData: any
): Promise<{
  success: boolean;
  word?: any;
  error?: string;
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/custom-dictionaries/${dictId}/words/${wordId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(
        `更新单词失败: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("更新单词出错:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "更新单词失败",
    };
  }
}

/**
 * 删除单词
 */
export async function deleteWord(
  dictId: string,
  wordId: string
): Promise<ApiResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/custom-dictionaries/${dictId}/words/${wordId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(
        `删除单词失败: ${response.status} ${response.statusText}`
      );
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("删除单词出错:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "删除单词失败",
    };
  }
}

/**
 * 获取单个自定义词典（用于服务端渲染）
 */
export async function fetchCustomDictionary(
  id: string
): Promise<ICustomDictionary | null> {
  try {
    // 检查是否在浏览器环境
    const isBrowser = typeof window !== "undefined";

    if (isBrowser) {
      // 客户端环境使用getDictionary函数
      const result = await getDictionary(id);
      if (result.success && result.dictionary) {
        return result.dictionary;
      }
    } else {
      // 服务端环境直接发起请求
      // 注意：服务端环境下不能使用相对路径，需要完整URL
      // 这里我们尝试使用环境变量或默认值
      const apiUrl = process.env.API_URL || "/api";
      console.log(`服务端请求API: ${apiUrl}/custom-dictionaries/${id}`);

      try {
        const response = await fetch(`${apiUrl}/custom-dictionaries/${id}`);
        if (response.ok) {
          return await response.json();
        } else {
          console.error(
            `API请求失败: ${response.status} ${response.statusText}`
          );
        }
      } catch (fetchError) {
        console.error("API请求异常:", fetchError);
      }
    }
    return null;
  } catch (error) {
    console.error("获取自定义词典失败:", error);
    return null;
  }
}

/**
 * 获取自定义词典单词列表（用于服务端渲染）
 */
export async function fetchCustomDictionaryWords(
  dictId: string
): Promise<ICustomWord[]> {
  try {
    // 检查是否在浏览器环境
    const isBrowser = typeof window !== "undefined";

    if (isBrowser) {
      // 客户端环境使用getDictionaryWords函数
      // 获取所有单词（不分页）
      const result = await getDictionaryWords(dictId, 1, 1000);
      if (result.success && result.words) {
        return result.words;
      }
    } else {
      // 服务端环境直接发起请求
      // 注意：服务端环境下不能使用相对路径，需要完整URL
      const apiUrl = process.env.API_URL || "/api";
      console.log(
        `服务端请求API: ${apiUrl}/custom-dictionaries/${dictId}/words`
      );

      try {
        const response = await fetch(
          `${apiUrl}/custom-dictionaries/${dictId}/words?page=1&pageSize=1000`
        );
        if (response.ok) {
          const data = await response.json();
          return data.words || [];
        } else {
          console.error(
            `API请求失败: ${response.status} ${response.statusText}`
          );
        }
      } catch (fetchError) {
        console.error("API请求异常:", fetchError);
      }
    }
    return [];
  } catch (error) {
    console.error("获取自定义词典单词列表失败:", error);
    return [];
  }
}
