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
        className={`h-full w-full transform ${
          isFamiliar ? "text-yellow-400" : "text-gray-400"
        } hover:text-yellow-400`}
        disabled={isMarking}
      >
        {isFamiliar ? (
          <IconStar className="w-9 h-9" />
        ) : (
          <IconStarOutline className="w-9 h-9" />
        )}
      </button>
    </Tooltip>
  );
}
