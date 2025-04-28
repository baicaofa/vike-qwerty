import { markedWordsAtom } from "../store/markedWordsAtom";
import { useAtom } from "jotai";

export default function useMarkedWords() {
  const [markedWords] = useAtom(markedWordsAtom);

  const isWordMarked = (word: string) => markedWords.has(word);

  const filterUnmarkedWords = (words: string[]) =>
    words.filter((word) => !markedWords.has(word));

  return { isWordMarked, filterUnmarkedWords };
}
