import { dictionaries } from "@/resources/dictionary";
import { reviewWordDictMapAtom } from "@/store";
import type { Word } from "@/typings";
import { wordListFetcher } from "@/utils/wordListFetcher";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";

type MeaningResult = {
  word: Word | null;
  isLoading: boolean;
  error: string | null;
};

// 词典缓存：dictId -> { words, map }
const dictCache: Record<
  string,
  { words: Word[]; map: Map<string, Word>; loading?: boolean; error?: string }
> = {};

async function ensureDictLoaded(dictId: string): Promise<void> {
  const cached = dictCache[dictId];
  if (
    cached &&
    cached.words &&
    cached.map &&
    !cached.loading &&
    !cached.error
  ) {
    return;
  }
  if (cached?.loading) return; // 正在加载中，等待即可

  const dict = dictionaries.find((d) => d.id === dictId);
  if (!dict) {
    dictCache[dictId] = {
      words: [],
      map: new Map(),
      error: `Dictionary not found: ${dictId}`,
    };
    return;
  }

  dictCache[dictId] = { words: [], map: new Map(), loading: true };
  try {
    const words = await wordListFetcher(dict.url);
    const map = new Map<string, Word>();
    for (const w of words) {
      map.set(w.name, w);
    }
    dictCache[dictId] = { words, map };
  } catch (e) {
    dictCache[dictId] = {
      words: [],
      map: new Map(),
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export function useMeaningInReview(
  name: string | undefined,
  options?: {
    preferredDictId?: string;
    fallbackDictIds?: string[];
  }
): MeaningResult {
  const reviewWordDictMap = useAtomValue(reviewWordDictMapAtom);
  const [state, setState] = useState<MeaningResult>({
    word: null,
    isLoading: false,
    error: null,
  });
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const dictCandidates = useMemo(() => {
    const list: string[] = [];
    if (options?.preferredDictId) list.push(options.preferredDictId);
    const mapped = name ? reviewWordDictMap[name] : undefined;
    if (mapped) list.push(mapped);
    if (options?.fallbackDictIds && options.fallbackDictIds.length > 0) {
      for (const id of options.fallbackDictIds) list.push(id);
    }
    // 去重
    return Array.from(new Set(list));
  }, [
    options?.preferredDictId,
    options?.fallbackDictIds,
    reviewWordDictMap,
    name,
  ]);

  useEffect(() => {
    if (!name || dictCandidates.length === 0) {
      setState((s) => ({ ...s, word: null, isLoading: false, error: null }));
      return;
    }

    let cancelled = false;
    const run = async () => {
      setState({ word: null, isLoading: true, error: null });
      for (const dictId of dictCandidates) {
        await ensureDictLoaded(dictId);
        const cache = dictCache[dictId];
        if (cache?.error) {
          // 继续尝试下一个词典
          continue;
        }
        const found = cache?.map.get(name);
        if (found) {
          if (!cancelled && mountedRef.current) {
            setState({ word: found, isLoading: false, error: null });
          }
          return;
        }
      }
      if (!cancelled && mountedRef.current) {
        setState({ word: null, isLoading: false, error: null });
      }
    };
    run();

    return () => {
      cancelled = true;
    };
  }, [name, dictCandidates]);

  return state;
}
