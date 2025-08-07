import HeatmapCharts from "./components/HeatmapCharts";
import KeyboardWithBarCharts from "./components/KeyboardWithBarCharts";
import LineCharts from "./components/LineCharts";
import { useWordStats } from "./hooks/useWordStats";
import Layout from "@/components/Layout";
import { isOpenDarkModeAtom } from "@/store";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTranslation } from "react-i18next";
import { navigate } from "vike/client/router";
import IconX from "~icons/tabler/x";

export function Page() {
  const { t } = useTranslation("analysis");
  const [, setIsOpenDarkMode] = useAtom(isOpenDarkModeAtom);

  const onBack = useCallback(() => {
    navigate("/");
  }, []);

  const changeDarkModeState = () => {
    setIsOpenDarkMode((old) => !old);
  };

  useHotkeys(
    "ctrl+d",
    () => {
      changeDarkModeState();
    },
    { enableOnFormTags: true, preventDefault: true },
    []
  );

  useHotkeys("enter,esc", onBack, { preventDefault: true });

  const {
    isEmpty,
    exerciseRecord,
    wordRecord,
    wpmRecord,
    accuracyRecord,
    wrongTimeRecord,
  } = useWordStats(dayjs().subtract(1, "year").unix(), dayjs().unix());

  return (
    <Layout>
      <div className="flex w-full flex-1 flex-col overflow-y-auto pl-20 pr-20 pt-20">
        <IconX
          className="absolute right-20 top-10 mr-2 h-7 w-7 cursor-pointer text-gray-400"
          onClick={onBack}
        />
        <ScrollArea.Root className="flex-1 overflow-y-auto">
          <ScrollArea.Viewport className="h-full w-auto pb-[20rem] [&>div]:!block">
            {isEmpty ? (
              <div className="align-items-center m-4 grid h-80 w-auto place-content-center overflow-hidden rounded-lg shadow-lg dark:bg-gray-600">
                <div className="text-2xl text-gray-400">
                  {t("noData", "没有数据")}
                </div>
              </div>
            ) : (
              <>
                <div className="mx-4 my-8 h-auto w-auto overflow-hidden rounded-lg p-8 shadow-lg dark:bg-gray-700 dark:bg-opacity-50">
                  <HeatmapCharts
                    title={t("charts.exerciseHeatmap", "练习热图")}
                    data={exerciseRecord}
                  />
                </div>
                <div className="mx-4 my-8 h-auto w-auto overflow-hidden rounded-lg p-8 shadow-lg dark:bg-gray-700 dark:bg-opacity-50">
                  <HeatmapCharts
                    title={t("charts.wordHeatmap", "单词热图")}
                    data={wordRecord}
                  />
                </div>
                <div className="mx-4 my-8 h-80 w-auto overflow-hidden rounded-lg p-8 shadow-lg dark:bg-gray-700 dark:bg-opacity-50">
                  <LineCharts
                    title={t("charts.wpmTrend", "WPM趋势")}
                    name={t("metrics.wpm", "WPM")}
                    data={wpmRecord}
                  />
                </div>
                <div className="mx-4 my-8 h-80 w-auto overflow-hidden rounded-lg p-8 shadow-lg dark:bg-gray-700 dark:bg-opacity-50">
                  <LineCharts
                    title={t("charts.accuracyTrend", "准确率趋势")}
                    name={t("metrics.accuracy", "准确率")}
                    data={accuracyRecord}
                    suffix={t("metrics.percentage", "%")}
                  />
                </div>
                <div className="mx-4 my-8 h-80 w-auto overflow-hidden rounded-lg p-8 shadow-lg dark:bg-gray-700 dark:bg-opacity-50">
                  <KeyboardWithBarCharts
                    title={t("charts.keyboardErrors", "键盘错误")}
                    name={t("metrics.errorCount", "错误次数")}
                    data={wrongTimeRecord}
                  />
                </div>
              </>
            )}
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="flex touch-none select-none bg-transparent "
            orientation="vertical"
          ></ScrollArea.Scrollbar>
        </ScrollArea.Root>
        <div className="overflow-y-auto"></div>
      </div>
    </Layout>
  );
}
