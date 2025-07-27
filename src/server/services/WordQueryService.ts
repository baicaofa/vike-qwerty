import CustomWord, { type ICustomWord } from "../models/CustomWord";
import OfficialWordLibrary, {
  type IOfficialWordLibrary,
} from "../models/OfficialWordLibrary";

/**
 * 合并后的单词数据接口（与前端 Word 类型保持一致，但包含 id 字段）
 */
export interface Word {
  id: string; // 添加 id 字段
  name: string;
  trans: string[];
  usphone: string;
  ukphone: string;
  notation?: string;
  sentences: Array<{
    english: string;
    chinese: string;
  }>;
  detailed_translations: Array<{
    pos: string;
    chinese: string;
    english: string;
  }>;
}

/**
 * 词汇查询服务
 * 负责查询和合并官方数据与用户数据
 */
export class WordQueryService {
  /**
   * 获取词典的完整单词数据
   * @param dictId 词典ID
   * @param page 页码
   * @param pageSize 每页大小
   * @returns 完整的单词数据数组
   */
  async getDictionaryWords(
    dictId: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<{
    words: Word[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      // 1. 获取总数
      const total = await CustomWord.countDocuments({ dictId });

      // 2. 获取分页的CustomWord记录
      const customWords = await CustomWord.find({ dictId })
        .sort({ index: 1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .lean();

      // 3. 提取需要查询的官方词汇ID
      const officialWordIds = customWords
        .filter(
          (w) =>
            w.sourceType === "official" && !w.isUserModified && w.officialWordId
        )
        .map((w) => w.officialWordId)
        .filter(Boolean);

      // 4. 批量查询官方数据
      const officialWords = await OfficialWordLibrary.find({
        _id: { $in: officialWordIds },
      }).lean();

      // 5. 创建官方数据映射
      const officialWordMap = new Map(
        officialWords.map((w) => [w._id.toString(), w])
      );

      // 6. 合并数据
      const words = customWords.map((customWord) =>
        this.mergeWordData(customWord, officialWordMap)
      );

      return {
        words,
        total,
        page,
        pageSize,
      };
    } catch (error) {
      console.error("获取词典单词失败:", error);
      throw new Error("查询词典单词异常");
    }
  }

  /**
   * 获取所有词典单词（不分页）
   * @param dictId 词典ID
   * @returns 所有单词数据
   */
  async getAllDictionaryWords(dictId: string): Promise<Word[]> {
    const result = await this.getDictionaryWords(dictId, 1, 10000);
    return result.words;
  }

  /**
   * 合并单词数据
   * @param customWord 自定义单词记录
   * @param officialWordMap 官方词汇映射
   * @returns 合并后的单词数据
   */
  private mergeWordData(
    customWord: any, // 使用any类型避免Mongoose Document类型问题
    officialWordMap: Map<string, any>
  ): Word {
    if (
      customWord.sourceType === "official" &&
      !customWord.isUserModified &&
      customWord.officialWordId
    ) {
      // 使用官方数据
      const officialWord = officialWordMap.get(customWord.officialWordId);
      return {
        id: customWord.id,
        name: customWord.name,
        usphone: officialWord?.usphone ?? "",
        ukphone: officialWord?.ukphone ?? "",
        // 将新的数据结构转换为旧的 Word 格式
        trans:
          officialWord?.detailed_translations?.map((t: any) => t.chinese) ?? [],
        sentences: officialWord?.sentences ?? [],
        detailed_translations: officialWord?.detailed_translations ?? [],
      };
    } else if (customWord.userData) {
      // 使用用户数据
      return {
        id: customWord.id,
        name: customWord.name,
        usphone: customWord.userData.usphone ?? "",
        ukphone: customWord.userData.ukphone ?? "",
        // 将新的数据结构转换为旧的 Word 格式
        trans:
          customWord.userData.detailed_translations?.map(
            (t: any) => t.chinese
          ) ?? [],
        sentences: customWord.userData.sentences ?? [],
        detailed_translations: customWord.userData.detailed_translations ?? [],
      };
    } else {
      // 空白数据
      return {
        id: customWord.id,
        name: customWord.name,
        usphone: "",
        ukphone: "",
        trans: [],
        sentences: [],
        detailed_translations: [],
      };
    }
  }

  /**
   * 获取单个单词的详细信息
   * @param wordId 单词ID
   * @returns 单词详细信息
   */
  async getWordDetail(wordId: string): Promise<Word | null> {
    try {
      const customWord = await CustomWord.findOne({ id: wordId }).lean();
      if (!customWord) {
        return null;
      }

      let officialWordMap = new Map();
      if (customWord.sourceType === "official" && customWord.officialWordId) {
        const officialWord = await OfficialWordLibrary.findOne({
          _id: customWord.officialWordId,
        }).lean();
        if (officialWord) {
          officialWordMap.set(customWord.officialWordId, officialWord);
        }
      }

      return this.mergeWordData(customWord, officialWordMap);
    } catch (error) {
      console.error("获取单词详情失败:", error);
      throw new Error("查询单词详情异常");
    }
  }
}

// 导出单例实例
export const wordQueryService = new WordQueryService();
