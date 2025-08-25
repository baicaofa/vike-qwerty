import { TypingContext } from "../../store";
import InfoBox from "./InfoBox";
import { useContext } from "react";
import { useTranslation } from "react-i18next";

export default function Speed() {
  // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
  const { state } = useContext(TypingContext)!;
  const { t } = useTranslation("typing");
  const seconds = state.timerData.time % 60;
  const minutes = Math.floor(state.timerData.time / 60);
  const secondsString = seconds < 10 ? "0" + seconds : seconds + "";
  const minutesString = minutes < 10 ? "0" + minutes : minutes + "";
  const inputNumber =
    state.chapterData.correctCount + state.chapterData.wrongCount;

  return (
    <div className="my-card flex w-3/5 rounded-xl bg-white p-4 py-10 opacity-50 transition-colors duration-300 dark:bg-gray-800">
      <InfoBox
        info={`${minutesString}:${secondsString}`}
        description={t("stats.time", "时间")}
      />
      <InfoBox
        info={inputNumber + ""}
        description={t("stats.inputCount", "输入数")}
      />
      <InfoBox
        info={state.timerData.wpm + ""}
        description={t("progress.wpm", "WPM")}
      />
      <InfoBox
        info={state.chapterData.correctCount + ""}
        description={t("stats.correctCount", "正确数")}
      />
      <InfoBox
        info={state.timerData.accuracy + ""}
        description={t("progress.accuracy", "准确率")}
      />
    </div>
  );
}
