import { currentDictIdAtom } from "@/store";
import { useGetFamiliarWords } from "@/utils/db";
import { useMarkFamiliarWord } from "@/utils/db";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import IconStar from "~icons/ic/outline-star";
import { useTranslation } from "react-i18next";

interface FamiliarWord {
  word: string;
  dict: string;
}

export default function FamiliarWordsPage() {
  const { t } = useTranslation("familiar");
  const dictId = useAtomValue(currentDictIdAtom);
  const { getFamiliarWords } = useGetFamiliarWords();
  const { markFamiliarWord } = useMarkFamiliarWord();
  const [familiarWords, setFamiliarWords] = useState<FamiliarWord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  useEffect(() => {
    const loadFamiliarWords = async () => {
      try {
        setIsLoading(true);
        // 直接从familiarWords表中获取当前词典的熟词
        const familiarWordRecords = await getFamiliarWords(dictId);
        setFamiliarWords(familiarWordRecords);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(t("loadFailed", { message: "Unknown error" })));
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
      console.error(t("actions.removeFamiliar") + " failed:", err);
    }
  };

  // 全选/全不选
  const handleSelectAll = (checked: boolean) => {
    setSelectedWords(checked ? familiarWords.map((w) => w.word) : []);
  };

  // 单个选择
  const handleSelectWord = (word: string, checked: boolean) => {
    setSelectedWords((prev) =>
      checked ? [...prev, word] : prev.filter((w) => w !== word)
    );
  };

  // 批量删除
  const handleBatchDelete = async () => {
    for (const word of selectedWords) {
      await markFamiliarWord(word, dictId, false);
    }
    setFamiliarWords((prev) =>
      prev.filter((w) => !selectedWords.includes(w.word))
    );
    setSelectedWords([]);
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-2xl text-gray-500">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-2xl text-red-500">{t("loadFailed", { message: error.message })}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full justify-center items-start">
      <div className="w-full max-w-2xl flex flex-col items-center justify-center p-4 gap-2">
        <h1 className="text-2xl font-bold dark:text-gray-50">{t("title")}</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t("stats.totalCount")}
          <span className="font-bold">{familiarWords.length}</span>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <label className="flex items-center gap-1 cursor-pointer select-none">
            <input
              type="checkbox"
              aria-label={t("ariaLabels.selectAll")}
              checked={
                selectedWords.length === familiarWords.length &&
                familiarWords.length > 0
              }
              onChange={(e) => handleSelectAll(e.target.checked)}
            />
            <span>{t("actions.selectAll")}</span>
          </label>
          <button
            className="bg-red-500 text-white px-4 py-1 rounded disabled:opacity-50"
            disabled={selectedWords.length === 0}
            onClick={handleBatchDelete}
          >
            {t("actions.batchRemove")}
          </button>
        </div>
        <div className="flex-1 w-full overflow-y-auto px-4 mt-4">
          <div className="grid gap-4">
            {familiarWords.map((word) => (
              <FamiliarWordCard
                key={word.word}
                word={word.word}
                checked={selectedWords.includes(word.word)}
                onCheck={(checked) => handleSelectWord(word.word, checked)}
                onUnmark={() => handleUnmarkFamiliar(word.word)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FamiliarWordCard({
  word,
  checked,
  onCheck,
  onUnmark,
}: {
  word: string;
  checked: boolean;
  onCheck: (checked: boolean) => void;
  onUnmark: () => void;
}) {
  const { t } = useTranslation("familiar");
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow dark:bg-gray-700">
      <div className="flex items-center gap-2 flex-1">
        <input
          type="checkbox"
          aria-label={t("ariaLabels.selectWord", { word })}
          checked={checked}
          onChange={(e) => onCheck(e.target.checked)}
        />
        <p className="font-mono text-xl font-normal leading-6 dark:text-gray-50">
          {word}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onUnmark}
          className="rounded-full p-2 text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-600"
          title={t("actions.removeFamiliar")}
        >
          <IconStar className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
