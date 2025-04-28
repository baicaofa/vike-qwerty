import { atom } from "jotai";

// 标熟单词的 atom
export const markedWordsAtom = atom<Set<string>>(new Set());

// 添加标熟单词的函数
export const addMarkedWordAtom = atom(null, (get, set, word: string) => {
  const currentMarkedWords = get().markedWordsAtom;
  set(markedWordsAtom, new Set(currentMarkedWords).add(word));
});

// 移除标熟单词的函数
export const removeMarkedWordAtom = atom(null, (get, set, word: string) => {
  const currentMarkedWords = get().markedWordsAtom;
  const newMarkedWords = new Set(currentMarkedWords);
  newMarkedWords.delete(word);
  set(markedWordsAtom, newMarkedWords);
});
