import { generateUUID } from "../uuid";
import type { Word } from "@/typings";

/**
 * 自定义词库接口
 */
export interface ICustomDictionary {
  id: string; // 唯一标识符
  userId: string; // 关联用户ID
  name: string; // 词库名称
  description: string; // 词库描述
  category: string; // 词库分类
  tags: string[]; // 词库标签
  length: number; // 单词数量
  language: string; // 语言类型
  languageCategory: string; // 语言分类
  createdAt: number; // 创建时间
  updatedAt: number; // 更新时间
  isPublic: boolean; // 是否公开
  version: number; // 版本号
}

/**
 * 自定义单词接口
 */
export interface ICustomWord {
  id: string; // 唯一标识符
  dictId: string; // 关联词库ID
  name: string; // 单词
  index: number; // 在词库中的索引位置

  // 数据来源标识
  sourceType?: "official" | "user_custom" | "empty";
  officialWordId?: string; // 关联官方词汇库ID

  // 用户数据（仅在修改或自定义时存储）
  userData?: {
    usphone: string;
    ukphone: string;
    sentences: Array<{
      english: string;
      chinese: string;
    }>;
    detailed_translations: Array<{
      pos: string;
      chinese: string;
      english: string;
    }>;
  };

  // 状态标识
  isUserModified?: boolean; // 用户是否修改过
  isEmpty?: boolean; // 是否为空白待填写

  createdAt?: number; // 创建时间
  updatedAt?: number; // 更新时间
}

/**
 * 创建自定义词库对象
 */
export function createCustomDictionary(
  data: Partial<ICustomDictionary>
): ICustomDictionary {
  return {
    id: data.id || generateUUID(),
    userId: data.userId || "",
    name: data.name || "",
    description: data.description || "",
    category: data.category || "我的词库",
    tags: data.tags || [],
    length: data.length || 0,
    language: data.language || "en",
    languageCategory: data.languageCategory || "en",
    createdAt: data.createdAt || Date.now(),
    updatedAt: data.updatedAt || Date.now(),
    isPublic: data.isPublic || false,
    version: data.version || 1,
  };
}

/**
 * 创建自定义单词对象
 */
export function createCustomWord(data: Partial<ICustomWord>): ICustomWord {
  return {
    id: data.id || generateUUID(),
    dictId: data.dictId || "",
    name: data.name || "",
    index: data.index || 0,
    sourceType: data.sourceType || "empty",
    officialWordId: data.officialWordId,
    userData: data.userData,
    isUserModified: data.isUserModified || false,
    isEmpty: data.isEmpty !== undefined ? data.isEmpty : true,
  };
}

/**
 * 将自定义单词转换为应用内Word格式
 * 注意：这个函数现在主要用于兼容性，新的数据应该通过 WordQueryService 获取
 */
export function convertCustomWordToWord(customWord: ICustomWord): Word {
  if (customWord.userData) {
    // 使用用户数据
    return {
      name: customWord.name,
      ...customWord.userData,
    };
  } else {
    // 空白数据或需要从官方库获取的数据
    return {
      name: customWord.name,
      usphone: "",
      ukphone: "",
      sentences: [],
      detailed_translations: [],
    };
  }
}

/**
 * 将自定义单词列表转换为应用内Word格式列表
 */
export function convertCustomWordsToWords(customWords: ICustomWord[]): Word[] {
  return customWords.map(convertCustomWordToWord);
}

/**
 * 将Excel数据转换为自定义单词列表
 */
export function convertExcelDataToCustomWords(
  data: Array<{ [key: string]: any }>,
  dictId: string
): ICustomWord[] {
  return data.map((item, index) => {
    // 处理翻译字段，转换为新的 userData 格式
    let userData = undefined;
    if (item.trans || item.usphone || item.ukphone) {
      const detailed_translations = [];
      if (item.trans) {
        const translations =
          typeof item.trans === "string"
            ? item.trans.split(";").map((t: string) => t.trim())
            : Array.isArray(item.trans)
            ? item.trans
            : [];

        detailed_translations.push(
          ...translations.map((trans: string) => ({
            pos: "",
            chinese: trans,
            english: "",
          }))
        );
      }

      userData = {
        usphone: item.usphone || "",
        ukphone: item.ukphone || "",
        sentences: [],
        detailed_translations,
      };
    }

    return createCustomWord({
      dictId,
      name: item.word || item.name || "",
      index,
      sourceType: userData ? "user_custom" : "empty",
      userData,
      isUserModified: !!userData,
      isEmpty: !userData,
    });
  });
}

/**
 * 去除重复的自定义单词（基于单词名称）
 */
export function removeDuplicateCustomWords(
  words: ICustomWord[]
): ICustomWord[] {
  const seen = new Set<string>();
  return words.filter((word) => {
    const name = word.name.toLowerCase();
    if (seen.has(name)) {
      return false;
    }
    seen.add(name);
    return true;
  });
}

// 用于保存自定义词库的API请求结果类型
export type SaveCustomDictionaryResult = {
  success: boolean;
  dictionary?: ICustomDictionary;
  error?: string;
};

// 用于保存自定义单词的API请求结果类型
export type SaveCustomWordResult = {
  success: boolean;
  word?: ICustomWord;
  error?: string;
};

// 用于查询自定义词库的参数
export type GetCustomDictionariesParams = {
  userId?: string;
  category?: string;
  tag?: string;
  isPublic?: boolean;
  limit?: number;
  offset?: number;
};

// 用于查询自定义单词的参数
export type GetCustomWordsParams = {
  dictId: string;
  limit?: number;
  offset?: number;
  search?: string;
};
