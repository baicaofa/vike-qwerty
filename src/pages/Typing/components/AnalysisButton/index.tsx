import { recordAnalysisAction } from "@/utils";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { navigate } from "vike/client/router";
import ChartPie from "~icons/heroicons/chart-pie-solid";

const AnalysisButton = () => {
  const { t } = useTranslation("typing");

  const toAnalysis = useCallback(() => {
    navigate("/analysis");
    recordAnalysisAction("open");
  }, []);

  return (
    <button
      type="button"
      onClick={toAnalysis}
      className={`flex items-center justify-center rounded p-[2px] text-lg text-blue-500 outline-none transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white`}
      title={t("buttons.analysis", "分析")}
    >
      <ChartPie className="icon" />
    </button>
  );
};

export default AnalysisButton;
