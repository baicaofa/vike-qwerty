import { isOpenDarkModeAtom } from "@/store";
import { useAtom } from "jotai";
import type { FC } from "react";
import React from "react";
import type { Activity } from "react-activity-calendar";
import { ActivityCalendar } from "react-activity-calendar";
import { useTranslation } from "react-i18next";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

interface HeatmapChartsProps {
  title: string;
  data: Activity[];
}
// 生成过去一年的默认数据
const defaultData: Activity[] = Array.from({ length: 365 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (364 - i));
  return {
    date: date.toISOString().split("T")[0],
    count: 0,
    level: 0,
  };
});

const HeatmapCharts: FC<HeatmapChartsProps> = ({ data, title }) => {
  const { t } = useTranslation("analysis");
  const [isOpenDarkMode] = useAtom(isOpenDarkModeAtom);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="text-center text-xl font-bold text-gray-600	dark:text-white">
        {title}
      </div>
      <ActivityCalendar
        fontSize={20}
        blockSize={22}
        blockRadius={7}
        style={{
          padding: "40px 60px 20px 100px",
          color: isOpenDarkMode ? "#fff" : "#000",
        }}
        colorScheme={isOpenDarkMode ? "dark" : "light"}
        data={data.length > 0 ? data : defaultData}
        theme={{
          light: ["#f0f0f0", "#6366f1"],
          dark: ["hsl(0, 0%, 22%)", "#818cf8"],
        }}
        renderBlock={(block, activity) =>
          React.cloneElement(block, {
            "data-tooltip-id": "react-tooltip",
            "data-tooltip-html": `${activity.date} ${t("tooltip.practice")} ${
              activity.count
            } ${t("tooltip.times")}`,
          })
        }
        showWeekdayLabels={true}
        labels={{
          months: [
            t("months.january"),
            t("months.february"),
            t("months.march"),
            t("months.april"),
            t("months.may"),
            t("months.june"),
            t("months.july"),
            t("months.august"),
            t("months.september"),
            t("months.october"),
            t("months.november"),
            t("months.december"),
          ],
          weekdays: [
            t("weekdays.sunday"),
            t("weekdays.monday"),
            t("weekdays.tuesday"),
            t("weekdays.wednesday"),
            t("weekdays.thursday"),
            t("weekdays.friday"),
            t("weekdays.saturday"),
          ],
          totalCount: t("tooltip.totalCount", { count: "{{count}}" }),
          legend: {
            less: t("legend.less"),
            more: t("legend.more"),
          },
        }}
      />
      <ReactTooltip id="react-tooltip" />
    </div>
  );
};

export default HeatmapCharts;
