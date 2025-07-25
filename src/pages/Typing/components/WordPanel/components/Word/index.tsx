import type { WordUpdateAction } from "../InputHandler";
import InputHandler from "../InputHandler";
import Letter from "./Letter";
import MarkFamiliarButton from "./MarkFamiliarButton";
import Notation from "./Notation";
import { TipAlert } from "./TipAlert";
import style from "./index.module.css";
import { initialWordState } from "./type";
import type { WordState } from "./type";
import Tooltip from "@/components/Tooltip";
import type { WordPronunciationIconRef } from "@/components/WordPronunciationIcon";
import { WordPronunciationIcon } from "@/components/WordPronunciationIcon";
import { EXPLICIT_SPACE } from "@/constants";
import useKeySounds from "@/hooks/useKeySounds";
import { useFamiliarWords } from "@/pages/Typing/hooks/useFamiliarWords";
import { TypingContext, TypingStateActionType } from "@/pages/Typing/store";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isIgnoreCaseAtom,
  isShowAnswerOnHoverAtom,
  isTextSelectableAtom,
  pronunciationIsOpenAtom,
  showWordAfterCompletionAtom,
  wordDictationConfigAtom,
} from "@/store";
import type { Word } from "@/typings";
import { CTRL, useMixPanelWordLogUploader } from "@/utils";
import { useSaveWordRecord } from "@/utils/db";
import { useAtomValue } from "jotai";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import { useImmer } from "use-immer";

const vowelLetters = ["A", "E", "I", "O", "U"];

export default function WordComponent({
  word,
  onFinish,
}: {
  word: Word;
  onFinish: (isCorrect?: boolean, responseTime?: number) => void;
}) {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state, dispatch } = useContext(TypingContext)!;
  const [wordState, setWordState] = useImmer<WordState>(
    structuredClone(initialWordState)
  );
  const { t } = useTranslation("typing");

  const wordDictationConfig = useAtomValue(wordDictationConfigAtom);
  const isTextSelectable = useAtomValue(isTextSelectableAtom);
  const isIgnoreCase = useAtomValue(isIgnoreCaseAtom);
  const isShowAnswerOnHover = useAtomValue(isShowAnswerOnHoverAtom);
  const showWordAfterCompletion = useAtomValue(showWordAfterCompletionAtom);
  const saveWordRecord = useSaveWordRecord();
  const wordLogUploader = useMixPanelWordLogUploader(state);
  const [playKeySound, playBeepSound, playHintSound] = useKeySounds();
  const pronunciationIsOpen = useAtomValue(pronunciationIsOpenAtom);
  const [isHoveringWord, setIsHoveringWord] = useState(false);
  const currentLanguage = useAtomValue(currentDictInfoAtom).language;
  const currentLanguageCategory =
    useAtomValue(currentDictInfoAtom).languageCategory;
  const currentChapter = useAtomValue(currentChapterAtom);

  const [showTipAlert, setShowTipAlert] = useState(false);
  // 添加状态来控制完成后的展示
  const [showCompletedWord, setShowCompletedWord] = useState(false);
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null);

  const { isFamiliar } = useFamiliarWords();
  const isWordFamiliar = isFamiliar(word);

  useEffect(() => {
    // run only when word changes
    let headword = "";
    try {
      headword = word.name.replace(new RegExp(" ", "g"), EXPLICIT_SPACE);
      headword = headword.replace(new RegExp("…", "g"), "..");
    } catch (e) {
      console.error("word.name is not a string", word);
      headword = "";
    }

    const newWordState = structuredClone(initialWordState);
    newWordState.displayWord = headword;
    newWordState.letterStates = new Array(headword.length).fill("normal");
    newWordState.startTime = performance.now();
    newWordState.randomLetterVisible = headword
      .split("")
      .map(() => Math.random() > 0.4);
    setWordState(newWordState);
  }, [word, setWordState]);

  const updateInput = useCallback(
    (updateAction: WordUpdateAction) => {
      switch (updateAction.type) {
        case "add":
          if (wordState.hasWrong) return;

          if (updateAction.value === " ") {
            updateAction.event.preventDefault();
            setWordState((state) => {
              state.inputWord = state.inputWord + EXPLICIT_SPACE;
            });
          } else {
            setWordState((state) => {
              state.inputWord = state.inputWord + updateAction.value;
            });
          }
          break;

        default:
          console.warn("unknown update type", updateAction);
      }
    },
    [wordState.hasWrong, setWordState]
  );

  const handleHoverWord = useCallback((checked: boolean) => {
    setIsHoveringWord(checked);
  }, []);

  useHotkeys(
    "tab",
    () => {
      handleHoverWord(true);
    },
    { enableOnFormTags: true, preventDefault: true },
    []
  );

  useHotkeys(
    "tab",
    () => {
      handleHoverWord(false);
    },
    { enableOnFormTags: true, keyup: true, preventDefault: true },
    []
  );
  useHotkeys(
    "ctrl+j",
    () => {
      if (state.isTyping) {
        wordPronunciationIconRef.current?.play();
      }
    },
    [state.isTyping],
    { enableOnFormTags: true, preventDefault: true }
  );

  useEffect(() => {
    if (wordState.inputWord.length === 0 && state.isTyping) {
      // 检查当前是否在打字练习页面或复习练习页面
      const currentPath = window.location.pathname;
      if (
        currentPath === "/" ||
        currentPath.startsWith("/typing") ||
        currentPath.startsWith("/review/practice")
      ) {
        setTimeout(() => {
          wordPronunciationIconRef.current?.play();
        }, 0);
      }
    }
  }, [state.isTyping, wordState.inputWord.length]);

  const getLetterVisible = useCallback(
    (index: number) => {
      // 如果单词已完成且启用了完成后展示功能，则显示所有字母
      if (showCompletedWord) return true;

      if (
        wordState.letterStates[index] === "correct" ||
        (isShowAnswerOnHover && isHoveringWord)
      )
        return true;

      if (wordDictationConfig.isOpen) {
        if (wordDictationConfig.type === "hideAll") return false;

        const letter = wordState.displayWord[index];
        if (wordDictationConfig.type === "hideVowel") {
          return vowelLetters.includes(letter.toUpperCase()) ? false : true;
        }
        if (wordDictationConfig.type === "hideConsonant") {
          return vowelLetters.includes(letter.toUpperCase()) ? true : false;
        }
        if (wordDictationConfig.type === "randomHide") {
          return wordState.randomLetterVisible[index];
        }
      }
      return true;
    },
    [
      showCompletedWord,
      isHoveringWord,
      isShowAnswerOnHover,
      wordDictationConfig.isOpen,
      wordDictationConfig.type,
      wordState.displayWord,
      wordState.letterStates,
      wordState.randomLetterVisible,
    ]
  );

  useEffect(() => {
    const inputLength = wordState.inputWord.length;
    /**
     * TODO: 当用户输入错误时，会报错
     * Cannot update a component (`App`) while rendering a different component (`WordComponent`). To locate the bad setState() call inside `WordComponent`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render
     * 目前不影响生产环境，猜测是因为开发环境下 react 会两次调用 useEffect 从而展示了这个 warning
     * 但这终究是一个 bug，需要修复
     */
    if (
      wordState.hasWrong ||
      inputLength === 0 ||
      wordState.displayWord.length === 0
    ) {
      return;
    }

    const inputChar = wordState.inputWord[inputLength - 1];
    const correctChar = wordState.displayWord[inputLength - 1];
    let isEqual = false;
    if (inputChar != undefined && correctChar != undefined) {
      isEqual = isIgnoreCase
        ? inputChar.toLowerCase() === correctChar.toLowerCase()
        : inputChar === correctChar;
    }

    if (isEqual) {
      // 输入正确时
      setWordState((state) => {
        state.letterTimeArray.push(Date.now());
        state.correctCount += 1;
      });

      if (inputLength >= wordState.displayWord.length) {
        // 完成输入时
        setWordState((state) => {
          state.letterStates[inputLength - 1] = "correct";
          state.isFinished = true;
          state.endTime = performance.now();
        });
        playHintSound();
      } else {
        setWordState((state) => {
          state.letterStates[inputLength - 1] = "correct";
        });
        playKeySound();
      }

      dispatch({ type: TypingStateActionType.REPORT_CORRECT_WORD });
    } else {
      // 出错时
      playBeepSound();
      setWordState((state) => {
        state.letterStates[inputLength - 1] = "wrong";
        state.hasWrong = true;
        state.hasMadeInputWrong = true;
        state.wrongCount += 1;
        state.letterTimeArray = [];

        if (state.letterMistake[inputLength - 1]) {
          state.letterMistake[inputLength - 1].push(inputChar);
        } else {
          state.letterMistake[inputLength - 1] = [inputChar];
        }

        const currentState = JSON.parse(JSON.stringify(state));
        dispatch({
          type: TypingStateActionType.REPORT_WRONG_WORD,
          payload: { letterMistake: currentState.letterMistake },
        });
      });

      if (
        currentChapter === 0 &&
        state.chapterData.index === 0 &&
        wordState.wrongCount >= 3
      ) {
        setShowTipAlert(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordState.inputWord]);

  useEffect(() => {
    if (wordState.hasWrong) {
      const timer = setTimeout(() => {
        setWordState((state) => {
          state.inputWord = "";
          state.letterStates = new Array(state.letterStates.length).fill(
            "normal"
          );
          state.hasWrong = false;
        });
      }, 300);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [wordState.hasWrong, setWordState]);

  useEffect(() => {
    if (wordState.isFinished) {
      dispatch({
        type: TypingStateActionType.SET_IS_SAVING_RECORD,
        payload: true,
      });

      // 如果启用了完成后展示功能，则在单词完成后播放发音并显示单词和翻译
      if (showWordAfterCompletion && wordDictationConfig.isOpen) {
        setShowCompletedWord(true);
        // 设置翻译可见
        dispatch({
          type: TypingStateActionType.SET_TRANS_VISIBLE,
          payload: true,
        });

        // 播放单词发音
        setTimeout(() => {
          wordPronunciationIconRef.current?.play();

          // 设置定时器，几秒后继续
          setTimeout(() => {
            setShowCompletedWord(false);
            // 恢复翻译不可见（如果之前是不可见的）
            if (!state.isTransVisible) {
              dispatch({
                type: TypingStateActionType.SET_TRANS_VISIBLE,
                payload: false,
              });
            }

            wordLogUploader({
              headword: word.name,
              timeStart: new Date(wordState.startTime)
                .toISOString()
                .substring(0, 19)
                .replace("T", " "),
              timeEnd: new Date(wordState.endTime)
                .toISOString()
                .substring(0, 19)
                .replace("T", " "),
              countInput: wordState.correctCount + wordState.wrongCount,
              countCorrect: wordState.correctCount,
              countTypo: wordState.wrongCount,
            });
            saveWordRecord({
              word: word.name,
              wrongCount: wordState.wrongCount,
              letterTimeArray: wordState.letterTimeArray,
              letterMistake: wordState.letterMistake,
            });

            // 计算响应时间和正确性
            const responseTime = Math.round(
              wordState.endTime - wordState.startTime
            );
            const isCorrect = wordState.wrongCount === 0;

            onFinish(isCorrect, responseTime);
          }, 2000); // 停留2秒
        }, 0);

        return;
      }

      // 原有的逻辑
      wordLogUploader({
        headword: word.name,
        timeStart: new Date(wordState.startTime)
          .toISOString()
          .substring(0, 19)
          .replace("T", " "),
        timeEnd: new Date(wordState.endTime)
          .toISOString()
          .substring(0, 19)
          .replace("T", " "),
        countInput: wordState.correctCount + wordState.wrongCount,
        countCorrect: wordState.correctCount,
        countTypo: wordState.wrongCount,
      });
      saveWordRecord({
        word: word.name,
        wrongCount: wordState.wrongCount,
        letterTimeArray: wordState.letterTimeArray,
        letterMistake: wordState.letterMistake,
      });

      // 计算响应时间和正确性
      const responseTime = Math.round(wordState.endTime - wordState.startTime);
      const isCorrect = wordState.wrongCount === 0;

      onFinish(isCorrect, responseTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordState.isFinished]);

  useEffect(() => {
    if (wordState.wrongCount >= 4) {
      dispatch({ type: TypingStateActionType.SET_IS_SKIP, payload: true });
    }
  }, [wordState.wrongCount, dispatch]);

  return (
    <>
      <InputHandler updateInput={updateInput} />
      <div
        lang={
          currentLanguageCategory !== "code"
            ? currentLanguageCategory === "en"
              ? "en"
              : currentLanguageCategory === "de"
              ? "de"
              : "en"
            : "en"
        }
        className="flex flex-col items-center justify-center pb-1 pt-4"
      >
        {["romaji", "hapin"].includes(currentLanguage) && word.notation && (
          <Notation notation={word.notation} />
        )}
        <div
          className={`tooltip-info relative w-fit bg-transparent p-0 leading-normal shadow-none dark:bg-transparent ${
            wordDictationConfig.isOpen && !showCompletedWord ? "tooltip" : ""
          }`}
          data-tip={t("tooltips.showFullWord")}
        >
          <div
            onMouseEnter={() => handleHoverWord(true)}
            onMouseLeave={() => handleHoverWord(false)}
            className={`flex items-center ${
              isTextSelectable && "select-all"
            } justify-center ${wordState.hasWrong ? style.wrong : ""}`}
          >
            {wordState.displayWord.split("").map((t, index) => {
              return (
                <Letter
                  key={`${index}-${t}`}
                  letter={t}
                  visible={getLetterVisible(index)}
                  state={wordState.letterStates[index]}
                />
              );
            })}
          </div>
          {pronunciationIsOpen && (
            <div>
              <div className="absolute -right-12 top-1/2 h-9 w-9 -translate-y-1/2 transform ">
                <Tooltip content={`快捷键${CTRL} + J`}>
                  <WordPronunciationIcon
                    word={word}
                    lang={currentLanguage}
                    ref={wordPronunciationIconRef}
                    className="h-full w-full"
                  />
                </Tooltip>
              </div>
              <div className="absolute -right-24 top-1/2 h-9 w-9 -translate-y-1/2 transform ">
                <MarkFamiliarButton word={word} isFamiliar={isWordFamiliar} />
              </div>
            </div>
          )}
        </div>
      </div>
      <TipAlert
        className="fixed bottom-10 right-3"
        show={showTipAlert}
        setShow={setShowTipAlert}
      />
    </>
  );
}
