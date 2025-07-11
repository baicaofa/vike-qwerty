import { fontSizeConfigAtom, isTextSelectableAtom } from "@/store";
import type { Word } from "@/typings";
import { useAtomValue } from "jotai";
import { useState } from "react";

export type SentencesProps = {
  word: Word;
  showSentences?: boolean;
};

// 高亮例句中的单词
const highlightWordInSentence = (sentence: string, wordToHighlight: string) => {
  if (!wordToHighlight || !sentence) return sentence;

  try {
    // 忽略大小写，创建正则表达式匹配整个单词
    const regex = new RegExp(
      `(\\b${wordToHighlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b)`,
      "gi"
    );

    // 分割文本
    const parts = sentence.split(regex);

    // 渲染带有高亮的文本
    return parts.map((part, index) => {
      // 检查这部分是否匹配单词（忽略大小写）
      if (part.toLowerCase() === wordToHighlight.toLowerCase()) {
        return (
          <span
            key={index}
            className="text-blue-600 dark:text-blue-400 font-medium"
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  } catch (error) {
    // 如果正则表达式有问题，返回原始句子
    console.error("Error highlighting word:", error);
    return sentence;
  }
};

// 处理例句显示
const renderSentencePair = (
  sentence: any,
  currentWord: string,
  fontSizeConfig: any
) => {
  if (typeof sentence === "string") {
    return (
      <p
        style={{
          fontSize: fontSizeConfig.sentenceForeignFont.toString() + "px",
        }}
      >
        {highlightWordInSentence(sentence, currentWord)}
      </p>
    );
  }

  if (typeof sentence === "object" && sentence !== null) {
    return (
      <>
        {sentence.english && (
          <p
            className="mb-1"
            style={{
              fontSize: fontSizeConfig.sentenceForeignFont.toString() + "px",
            }}
          >
            {highlightWordInSentence(sentence.english, currentWord)}
          </p>
        )}
        {sentence.chinese && (
          <p
            className="text-gray-600 dark:text-gray-400"
            style={{ fontSize: fontSizeConfig.translateFont.toString() + "px" }}
          >
            {sentence.chinese}
          </p>
        )}
      </>
    );
  }

  return <p>{String(sentence)}</p>;
};

export default function Sentences({
  word,
  showSentences = false,
}: SentencesProps) {
  const isTextSelectable = useAtomValue(isTextSelectableAtom);
  const fontSizeConfig = useAtomValue(fontSizeConfigAtom);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // 如果单词没有例句或者设置不显示例句，则不渲染
  if (
    !word.sentences ||
    !Array.isArray(word.sentences) ||
    word.sentences.length === 0 ||
    !showSentences
  ) {
    return null;
  }

  return (
    <div
      className={`mt-4 w-full max-w-2xl mx-auto text-gray-700 dark:text-gray-300 transition-colors duration-300 ${
        isTextSelectable && "select-text"
      }`}
    >
      <h3
        className="mb-2 font-medium text-gray-800 dark:text-gray-200 p-3"
        style={{ fontSize: fontSizeConfig.translateFont.toString() + "px" }}
      >
        例句：
      </h3>
      <ul className="space-y-3">
        {word.sentences.map((sentence, index) => (
          <li
            key={index}
            className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md cursor-pointer  dark:hover:bg-gray-700"
            onClick={() =>
              setExpandedIndex(expandedIndex === index ? null : index)
            }
          >
            <div className={expandedIndex === index ? "" : ""}>
              {renderSentencePair(sentence, word.name, fontSizeConfig)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
