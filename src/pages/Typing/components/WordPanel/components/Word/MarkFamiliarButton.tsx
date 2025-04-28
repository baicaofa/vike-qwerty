import Tooltip from "@/components/Tooltip";
import { useFamiliarWords } from "@/pages/Typing/hooks/useFamiliarWords";
import { currentDictIdAtom } from "@/store";
import type { Word } from "@/typings";
import { useMarkFamiliarWord } from "@/utils/db";
import { useAtomValue } from "jotai";
import { useCallback, useState } from "react";
import IconStar from "~icons/ic/outline-star";
import IconStarOutline from "~icons/ic/outline-star-border";

interface MarkFamiliarButtonProps {
  word: Word;
  isFamiliar: boolean;
}

export default function MarkFamiliarButton({
  word,
  isFamiliar,
}: MarkFamiliarButtonProps) {
  const dictId = useAtomValue(currentDictIdAtom);
  const { markFamiliarWord } = useMarkFamiliarWord();
  const { addFamiliarWord, removeFamiliarWord } = useFamiliarWords();
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkFamiliar = useCallback(async () => {
    if (isMarking) return;
    setIsMarking(true);
    try {
      await markFamiliarWord(word.name, dictId, !isFamiliar);
      if (!isFamiliar) {
        addFamiliarWord(word.name);
      } else {
        removeFamiliarWord(word.name);
      }
    } catch (error) {
      console.error("标记熟词失败:", error);
    } finally {
      setIsMarking(false);
    }
  }, [
    word.name,
    dictId,
    isFamiliar,
    markFamiliarWord,
    isMarking,
    addFamiliarWord,
    removeFamiliarWord,
  ]);

  return (
    <Tooltip content={isFamiliar ? "取消熟词标记" : "标记为熟词"}>
      <button
        onClick={handleMarkFamiliar}
        className={`absolute right-4 top-1/2 -translate-y-1/2 transform ${
          isFamiliar ? "text-yellow-400" : "text-gray-400"
        } hover:text-yellow-400`}
        disabled={isMarking}
      >
        {isFamiliar ? (
          <IconStar className="h-6 w-6" />
        ) : (
          <IconStarOutline className="h-6 w-6" />
        )}
      </button>
    </Tooltip>
  );
}
