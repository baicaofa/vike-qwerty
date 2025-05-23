import { currentDictIdAtom } from "@/store";
import type { Word } from "@/typings";
import { useGetFamiliarWords } from "@/utils/db";
import { useAtomValue, atom, useAtom } from "jotai";
import { useCallback, useEffect } from "react";

const familiarWordsAtom = atom<Set<string>>(new Set<string>());

export function useFamiliarWords() {
  const dictId = useAtomValue(currentDictIdAtom);
  const { getFamiliarWords } = useGetFamiliarWords();
  const [familiarWords, setFamiliarWords] = useAtom(familiarWordsAtom);

  const refreshFamiliarWords = useCallback(async () => {
    try {
      const words = await getFamiliarWords(dictId);
      const familiarSet = new Set<string>(words.map((w) => w.word));
      setFamiliarWords(familiarSet);
    } catch (error) {
      console.error("获取熟词列表失败:", error);
    }
  }, [dictId, getFamiliarWords, setFamiliarWords]);

  // 只在组件挂载时刷新熟词列表
  useEffect(() => {
    refreshFamiliarWords();
  }, []);

  const isFamiliar = useCallback(
    (word: Word) => {
      return familiarWords.has(word.name);
    },
    [familiarWords]
  );

  const addFamiliarWord = useCallback(
    (word: string) => {
      setFamiliarWords((prev) => new Set(prev).add(word));
    },
    [setFamiliarWords]
  );

  const removeFamiliarWord = useCallback(
    (word: string) => {
      setFamiliarWords((prev) => {
        const newSet = new Set(prev);
        newSet.delete(word);
        return newSet;
      });
    },
    [setFamiliarWords]
  );

  return {
    familiarWords,
    isFamiliar,
    refreshFamiliarWords,
    addFamiliarWord,
    removeFamiliarWord,
  };
}

/**
 * 查找下一个未被标记为熟词的单词索引
 * @param words 单词数组
 * @param familiarSet 熟词集合（Set<string>）
 * @param currentIndex 当前索引
 * @returns 下一个非熟词索引，若没有则返回-1
 */
export function findNextUnfamiliarIndex(
  words: { name: string }[],
  familiarSet: Set<string>,
  currentIndex: number
): number {
  let idx = currentIndex + 1;
  while (idx < words.length) {
    if (!familiarSet.has(words[idx].name)) {
      return idx;
    }
    idx++;
  }
  return -1;
}

/**
 * 查找上一个未被标记为熟词的单词索引
 * @param words 单词数组
 * @param familiarSet 熟词集合（Set<string>）
 * @param currentIndex 当前索引
 * @returns 上一个非熟词索引，若没有则返回-1
 */
export function findPrevUnfamiliarIndex(
  words: { name: string }[],
  familiarSet: Set<string>,
  currentIndex: number
): number {
  let idx = currentIndex - 1;
  while (idx >= 0) {
    if (!familiarSet.has(words[idx].name)) {
      return idx;
    }
    idx--;
  }
  return -1;
}
