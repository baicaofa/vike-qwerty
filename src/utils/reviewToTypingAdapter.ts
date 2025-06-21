/**
 * 复习数据到打字数据的适配器
 * 将复习系统的数据格式转换为 Typing 组件可用的格式
 */
import type { Word, WordWithIndex } from "@/typings";
import type { IWordReviewRecord } from "@/utils/db/wordReviewRecord";

/**
 * 将复习单词记录转换为打字组件可用的 Word 格式
 */
export function adaptReviewWordToTypingWord(
  reviewWord: IWordReviewRecord
): Word {
  return {
    name: reviewWord.word,
    trans: ["复习单词"], // 复习模式下不显示翻译，给个默认值
    usphone: "",
    ukphone: "",
    notation: undefined,
  };
}

/**
 * 将复习单词记录数组转换为打字组件可用的对象
 * @deprecated 请使用adaptReviewWordsToTypingWords返回字符串数组
 */
export function adaptReviewWordsToTypingObjects(
  reviewWords: IWordReviewRecord[]
): WordWithIndex[] {
  return reviewWords.map((reviewWord, index) => ({
    ...adaptReviewWordToTypingWord(reviewWord),
    index,
  }));
}

/**
 * 将复习单词记录数组转换为字符串数组
 * 适合新版TypingProvider使用
 */
export function adaptReviewWordsToTypingWords(
  reviewWords: IWordReviewRecord[]
): string[] {
  return reviewWords.map((reviewWord) => reviewWord.word);
}

/**
 * 从 WordWithIndex 中提取原始单词名称
 * 用于复习完成时的回调处理
 */
export function extractWordNameFromTypingWord(
  word: WordWithIndex | string
): string {
  if (typeof word === "string") {
    return word;
  }
  return word.name;
}

/**
 * 检查是否为复习模式的单词
 * 通过检查是否有复习相关的字段来判断
 */
export function isReviewWord(word: Word | WordWithIndex): boolean {
  // 在复习模式下，我们可以通过某些特征来识别
  // 这里暂时返回 true，因为在复习页面中所有单词都是复习单词
  return true;
}
