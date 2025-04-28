import { WordPronunciationIcon } from "@/components/WordPronunciationIcon";
import type { WordPronunciationIconRef } from "@/components/WordPronunciationIcon";
import { currentDictIdAtom } from "@/store";
import { useGetFamiliarWords } from "@/utils/db";
import { useMarkFamiliarWord } from "@/utils/db";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useRef } from "react";
import IconStar from "~icons/ic/outline-star";
import IconStarOutline from "~icons/ic/outline-star-border";
import IconX from "~icons/tabler/x";

interface FamiliarWord {
  word: string;
  dict: string;
}

export default function FamiliarWordsPage() {
  const dictId = useAtomValue(currentDictIdAtom);
  const { getFamiliarWords } = useGetFamiliarWords();
  const { markFamiliarWord } = useMarkFamiliarWord();
  const [familiarWords, setFamiliarWords] = useState<FamiliarWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadFamiliarWords = async () => {
      try {
        setIsLoading(true);
        // 直接从familiarWords表中获取当前词典的熟词
        const familiarWordRecords = await getFamiliarWords(dictId);
        setFamiliarWords(familiarWordRecords);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("加载熟词列表失败"));
      } finally {
        setIsLoading(false);
      }
    };

    loadFamiliarWords();
  }, [dictId, getFamiliarWords]);

  const handleUnmarkFamiliar = async (word: string) => {
    try {
      await markFamiliarWord(word, dictId, false);
      setFamiliarWords((prev) => prev.filter((w) => w.word !== word));
    } catch (err) {
      console.error("取消熟词标记失败:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-2xl text-gray-500">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-2xl text-red-500">加载失败: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold dark:text-gray-50">熟词列表</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          共 {familiarWords.length} 个熟词
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4">
        <div className="grid gap-4">
          {familiarWords.map((word) => (
            <FamiliarWordCard
              key={word.word}
              word={word.word}
              onUnmark={() => handleUnmarkFamiliar(word.word)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FamiliarWordCard({
  word,
  onUnmark,
}: {
  word: string;
  onUnmark: () => void;
}) {
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null);

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow dark:bg-gray-700">
      <div className="flex-1">
        <p className="font-mono text-xl font-normal leading-6 dark:text-gray-50">
          {word}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onUnmark}
          className="rounded-full p-2 text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <IconStar className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
