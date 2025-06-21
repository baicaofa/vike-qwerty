import {
  addMarkedWordAtom,
  removeMarkedWordAtom,
} from "../store/markedWordsAtom";
import { useAtom } from "jotai";

interface MarkWordButtonProps {
  word: string;
  isMarked: boolean;
}

export default function MarkWordButton({
  word,
  isMarked,
}: MarkWordButtonProps) {
  const [, addMarkedWord] = useAtom(addMarkedWordAtom);
  const [, removeMarkedWord] = useAtom(removeMarkedWordAtom);

  const handleClick = () => {
    if (isMarked) {
      removeMarkedWord(word);
    } else {
      addMarkedWord(word);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-2 py-1 rounded ${
        isMarked ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
      }`}
    >
      {isMarked ? "取消标熟" : "标熟"}
    </button>
  );
}
