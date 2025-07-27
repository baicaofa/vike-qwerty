import OfficialWordLibrary, {
  type IOfficialWordLibrary,
} from "../models/OfficialWordLibrary";

/**
 * 词汇补充结果接口
 */
export interface EnrichmentResult {
  originalWord: string; // 用户原始输入
  cleanWord: string; // 清洗后的单词
  index: number; // 在数组中的位置
  found: boolean; // 是否在官方库中找到
  officialData: IOfficialWordLibrary | null; // 官方数据
}

/**
 * 词汇补充服务
 * 负责从官方词库中查找并补充单词信息
 */
export class WordEnrichmentService {
  /**
   * 批量词汇补充
   * @param words 用户上传的单词数组
   * @returns 补充结果
   */
  async batchEnrichWords(words: string[]): Promise<EnrichmentResult[]> {
    try {
      // 1. 数据清洗
      const cleanWords = words.map((word) => word.toLowerCase().trim());

      // 2. 批量查询官方词库
      const officialWords = await OfficialWordLibrary.find({
        name: { $in: cleanWords },
      }).lean(); // 使用lean()提高查询性能

      console.log(
        `[WordEnrichment] 查询词汇: ${cleanWords.length}个, 找到官方数据: ${officialWords.length}个`
      );
      console.log(`[WordEnrichment] 查询的词汇:`, cleanWords.slice(0, 5));
      console.log(
        `[WordEnrichment] 找到的官方词汇:`,
        officialWords.slice(0, 2).map((w) => ({ name: w.name, id: w.id }))
      );

      // 3. 创建映射表
      const wordMap = new Map(officialWords.map((w) => [w.name, w]));

      // 4. 生成结果
      return words.map((originalWord, index) => {
        const cleanWord = originalWord.toLowerCase().trim();
        const officialWord = wordMap.get(cleanWord);

        // 确保官方数据有效且包含必要字段
        // 使用 _id 或 id 作为标识符
        const officialWordId =
          officialWord?.id || officialWord?._id?.toString();
        const isValidOfficialData = !!(
          officialWord &&
          officialWordId &&
          officialWord.name === cleanWord
        );

        console.log(
          `[WordEnrichment] 处理单词 "${cleanWord}": 找到=${!!officialWord}, 有效=${isValidOfficialData}`
        );
        if (officialWord) {
          console.log(
            `  - 官方数据: id=${officialWordId}, name=${officialWord.name}`
          );
        }

        return {
          originalWord,
          cleanWord,
          index,
          found: isValidOfficialData,
          officialData: isValidOfficialData
            ? {
                ...officialWord,
                id: officialWordId, // 确保有 id 字段
              }
            : null,
        };
      });
    } catch (error) {
      console.error("批量词汇补充失败:", error);
      throw new Error("词汇补充服务异常");
    }
  }

  /**
   * 单个词汇补充
   * @param word 单词
   * @returns 补充结果
   */
  async enrichSingleWord(word: string): Promise<EnrichmentResult> {
    const results = await this.batchEnrichWords([word]);
    return results[0];
  }

  /**
   * 获取补充统计信息
   * @param results 补充结果数组
   * @returns 统计信息
   */
  getEnrichmentStats(results: EnrichmentResult[]) {
    const total = results.length;
    const enriched = results.filter((r) => r.found).length;
    const empty = total - enriched;

    return {
      total,
      enriched,
      empty,
      enrichmentRate: total > 0 ? ((enriched / total) * 100).toFixed(1) : "0",
    };
  }
}

// 导出单例实例
export const wordEnrichmentService = new WordEnrichmentService();
