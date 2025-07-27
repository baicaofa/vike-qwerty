import type { Dictionary } from "@/typings";
import type { ICustomDictionary } from "@/utils/db/customDictionary";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// 当前选中的自定义词库ID
export const currentCustomDictIdAtom = atomWithStorage<string | null>(
  "currentCustomDictId",
  null
);

// 自定义词库列表
export const customDictionariesAtom = atom<ICustomDictionary[]>([]);

// 自定义词库加载状态
export const customDictionariesLoadingAtom = atom<boolean>(false);

// 自定义词库错误信息
export const customDictionariesErrorAtom = atom<string | null>(null);

// 将自定义词库转换为应用内Dictionary格式
export function adaptCustomDictionaryToDictionary(
  customDict: ICustomDictionary
): Dictionary {
  return {
    id: `custom_${customDict.id}`, // 添加前缀区分自定义词库
    name: customDict.name,
    description: customDict.description,
    category: customDict.category || "我的词库", // 默认分类
    tags: customDict.tags,
    // 特殊URL格式，表示从API加载
    url: `api://custom-dictionaries/${customDict.id}`,
    length: customDict.length,
    language: customDict.language || "en",
    languageCategory: customDict.languageCategory || "en",
    chapterCount: Math.ceil(customDict.length / 20), // 每章20个单词
  };
}

// 将自定义词库列表转换为应用内Dictionary格式列表
export function adaptCustomDictionariesToDictionaries(
  customDicts: ICustomDictionary[]
): Dictionary[] {
  return customDicts.map(adaptCustomDictionaryToDictionary);
}

// 判断词库ID是否为自定义词库
export function isCustomDictionary(dictId: string): boolean {
  return dictId.startsWith("custom_");
}

// 从自定义词库ID中提取原始ID
export function extractCustomDictionaryId(dictId: string): string {
  return dictId.replace("custom_", "");
}
