import { getDictionaryWords } from "@/services/customDictionaryService";
import { extractCustomDictionaryId } from "@/store/customDictionary";
import type { Word } from "@/typings";

export async function wordListFetcher(url: string): Promise<Word[]> {
  // 处理自定义词典的API URL格式
  if (url.startsWith("api://custom-dictionaries/")) {
    console.log("检测到自定义词典URL:", url);
    try {
      // 从URL中提取词典ID
      const dictId = url.replace("api://custom-dictionaries/", "");
      console.log("提取的自定义词典ID:", dictId);

      // 获取自定义词典的单词列表
      const result = await getDictionaryWords(dictId, 1, 1000); // 获取所有单词，最多1000个

      if (!result.success || !result.words) {
        throw new Error(result.error || "获取自定义词典单词失败");
      }

      console.log("成功获取自定义词典单词，数量:", result.words.length);

      // getDictionaryWords 已经返回了合并后的标准 Word 格式数据
      return result.words;
    } catch (error) {
      console.error("获取自定义词典单词失败:", error);
      throw error;
    }
  }

  // 处理常规URL（原有逻辑）
  // 确保 URL 以 / 开头
  const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
  const URL_PREFIX: string =
    REACT_APP_DEPLOY_ENV === "pages" ? "/qwerty-learner" : "";

  const fullUrl = URL_PREFIX + normalizedUrl;

  try {
    console.log("开始获取词典:", fullUrl);
    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch dictionary: ${response.status} ${response.statusText}`
      );
    }

    const words: Word[] = await response.json();
    console.log("成功解析词典数据，单词数量:", words.length);
    return words;
  } catch (error) {
    console.error("获取词典失败:", {
      url: fullUrl,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
