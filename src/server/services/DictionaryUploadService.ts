import { generateUUID } from "../utils/uuid";
import {
  type EnrichmentResult,
  wordEnrichmentService,
} from "./WordEnrichmentService";

// 定义普通对象类型，不包含Mongoose Document方法
interface CustomWordData {
  id: string;
  dictId: string;
  name: string;
  index: number;
  sourceType: "official" | "user_custom" | "empty";
  officialWordId?: string;
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
  isUserModified: boolean;
  isEmpty: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * 上传结果接口
 */
export interface UploadResult {
  total: number; // 总词汇数
  enriched: number; // 成功补充数量
  empty: number; // 需要填写数量
  words: CustomWordData[]; // 创建的记录
  enrichmentRate: string; // 补充率
}

/**
 * 词典上传处理服务
 * 负责处理用户词典上传，集成词汇补充功能
 */
export class DictionaryUploadService {
  /**
   * 处理用户词典上传
   * @param words 用户上传的单词数组
   * @param dictId 词典ID
   * @returns 处理结果
   */
  async processWordUpload(
    words: string[],
    dictId: string
  ): Promise<UploadResult> {
    try {
      // 1. 批量词汇补充
      const enrichmentResults = await wordEnrichmentService.batchEnrichWords(
        words
      );

      // 2. 生成CustomWord记录
      const customWords: CustomWordData[] = enrichmentResults.map((result) => {
        const baseWord = {
          id: generateUUID(),
          dictId,
          name: result.cleanWord,
          index: result.index,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        if (result.found && result.officialData) {
          // 匹配到官方数据
          console.log(
            `[DictionaryUpload] 为单词 "${result.cleanWord}" 找到官方数据:`
          );
          console.log(`  - ID: ${result.officialData.id}`);
          console.log(`  - 美音: ${result.officialData.usphone}`);
          console.log(`  - 英音: ${result.officialData.ukphone}`);
          console.log(
            `  - 翻译数量: ${
              result.officialData.detailed_translations?.length || 0
            }`
          );

          const wordData = {
            ...baseWord,
            sourceType: "official" as const,
            officialWordId: result.officialData.id,
            userData: undefined,
            isUserModified: false,
            isEmpty: false,
          };

          console.log(
            `  - 生成的单词数据: sourceType=${wordData.sourceType}, officialWordId=${wordData.officialWordId}`
          );
          return wordData;
        } else {
          // 未匹配到，创建空记录
          return {
            ...baseWord,
            sourceType: "empty" as const,
            officialWordId: undefined,
            userData: undefined,
            isUserModified: false,
            isEmpty: true,
          };
        }
      });

      // 3. 获取统计信息
      const stats = wordEnrichmentService.getEnrichmentStats(enrichmentResults);

      return {
        total: stats.total,
        enriched: stats.enriched,
        empty: stats.empty,
        words: customWords,
        enrichmentRate: stats.enrichmentRate,
      };
    } catch (error) {
      console.error("词典上传处理失败:", error);
      throw new Error("词典上传处理异常");
    }
  }

  /**
   * 处理单词数据转换（兼容旧版本）
   * @param rawWords 原始单词数据
   * @param dictId 词典ID
   * @returns 转换后的单词数组
   */
  async processLegacyWordUpload(
    rawWords: any[],
    dictId: string
  ): Promise<UploadResult> {
    // 提取单词名称
    const wordNames = rawWords
      .map((word) => word.name || word.word || "")
      .filter(Boolean);

    // 使用新的处理流程
    const result = await this.processWordUpload(wordNames, dictId);

    // 对于旧版本数据和新版本数据，如果有用户提供的详细信息，转换为 userData 格式
    result.words = result.words.map((word, index) => {
      const rawWord = rawWords[index];
      if (rawWord && (word.sourceType === "empty" || rawWord.isUserModified)) {
        let userData;

        // 检查是否为新格式（包含userData字段）
        if (rawWord.userData) {
          userData = rawWord.userData;
        } else {
          // 兼容旧格式数据
          userData = {
            usphone: rawWord.usphone || "",
            ukphone: rawWord.ukphone || "",
            sentences: rawWord.sentences || [],
            detailed_translations: rawWord.trans
              ? rawWord.trans.map((trans: string) => ({
                  pos: "",
                  chinese: trans,
                  english: "",
                }))
              : rawWord.detailed_translations || [],
          };
        }

        return {
          ...word,
          sourceType: "user_custom" as const,
          userData,
          isUserModified: true,
          isEmpty: false,
        };
      }
      return word;
    });

    return result;
  }
}

// 导出单例实例
export const dictionaryUploadService = new DictionaryUploadService();
