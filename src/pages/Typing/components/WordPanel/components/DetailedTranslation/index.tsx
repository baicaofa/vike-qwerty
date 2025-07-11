import Tooltip from "@/components/Tooltip";
import { SoundIcon } from "@/components/WordPronunciationIcon/SoundIcon";
import useSpeech from "@/hooks/useSpeech";
import {
  fontSizeConfigAtom,
  isTextSelectableAtom,
  pronunciationConfigAtom,
} from "@/store";
import type { Word } from "@/typings";
import { useAtomValue } from "jotai";
import { useCallback, useMemo } from "react";

export type DetailedTranslationProps = {
  word: Word;
  showDetailedTranslation?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

export default function DetailedTranslation({
  word,
  showDetailedTranslation = false,
  onMouseEnter,
  onMouseLeave,
}: DetailedTranslationProps) {
  const isTextSelectable = useAtomValue(isTextSelectableAtom);
  const fontSizeConfig = useAtomValue(fontSizeConfigAtom);
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom);

  // 准备朗读内容（所有翻译合并）
  const speechText = word.detailed_translations
    ? word.detailed_translations
        .map((item) => {
          let text = "";
          if (item.pos) text += `${item.pos}. `;
          if (item.chinese) text += item.chinese;
          if (item.english) text += ` ${item.english}`;
          return text;
        })
        .filter(Boolean)
        .join(". ")
    : "";

  const isShowTransRead =
    window.speechSynthesis && pronunciationConfig.isTransRead;
  const speechOptions = useMemo(
    () => ({ volume: pronunciationConfig.transVolume }),
    [pronunciationConfig.transVolume]
  );
  const { speak, speaking } = useSpeech(speechText, speechOptions);

  const handleClickSoundIcon = useCallback(() => {
    speak(true);
  }, [speak]);

  // 如果单词没有详细翻译或设置不显示，则不渲染
  if (
    !word.detailed_translations ||
    !word.detailed_translations.length ||
    !showDetailedTranslation
  ) {
    return null;
  }

  return (
    <div
      className={`flex items-center justify-center pb-4 pt-5`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`w-full max-w-2xl mx-auto text-center transition-colors duration-300 ${
          isTextSelectable && "select-text"
        }`}
      >
        <div className="space-y-4 text-left pl-8">
          {word.detailed_translations.map((item, index) => (
            <div key={index} className="mb-3">
              {/* 词性 */}
              {item.pos && (
                <div
                  className="mb-2 font-medium pl-2"
                  style={{
                    fontSize: fontSizeConfig.translateFont.toString() + "px",
                  }}
                >
                  词性：
                  {typeof item.pos === "string" ? item.pos : String(item.pos)}.
                </div>
              )}

              <div className="space-y-2 pl-2">
                {/* 中文释义 */}
                {item.chinese && (
                  <p
                    className="dark:text-white dark:text-opacity-80"
                    style={{
                      fontSize: fontSizeConfig.translateFont.toString() + "px",
                    }}
                  >
                    <span className="font-bold">中文释义：</span>
                    {item.chinese}
                  </p>
                )}

                {/* 英文释义 */}
                {item.english && (
                  <p
                    className="dark:text-white dark:text-opacity-70 italic"
                    style={{
                      fontSize:
                        fontSizeConfig.sentenceForeignFont.toString() + "px",
                    }}
                  >
                    <span className="font-bold">English Definition：</span>
                    {item.english}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isShowTransRead && showDetailedTranslation && (
        <Tooltip
          content="朗读释义"
          className="ml-3 h-5 w-5 cursor-pointer leading-7"
        >
          <SoundIcon
            animated={speaking}
            onClick={handleClickSoundIcon}
            className="h-5 w-5"
          />
        </Tooltip>
      )}
    </div>
  );
}
