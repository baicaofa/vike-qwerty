import classNames from "classnames";
import type { ElementType, SVGAttributes } from "react";
import { useTranslation } from "react-i18next";
import IconExclamationTriangle from "~icons/heroicons/exclamation-triangle-solid";
import IconHandThumbUp from "~icons/heroicons/hand-thumb-up-solid";
import IconHeart from "~icons/heroicons/heart-solid";

type IconMapper = {
  icon: ElementType<SVGAttributes<SVGSVGElement>>;
  className: string;
  textKey: string;
};

const ICON_MAPPER: IconMapper[] = [
  {
    icon: IconHeart,
    className: "text-indigo-600",
    textKey: "result.good", // 保留用于其他级别
  },
  {
    icon: IconHandThumbUp,
    className: "text-indigo-600",
    textKey: "result.normal",
  },
  {
    icon: IconExclamationTriangle,
    className: "text-indigo-600",
    textKey: "result.bad",
  },
];

const ConclusionBar = ({ mistakeLevel, mistakeCount }: ConclusionBarProps) => {
  const { t } = useTranslation("typing");
  const { icon: Icon, className } = ICON_MAPPER[mistakeLevel];

  let textContent: string;
  if (mistakeLevel === 0) {
    // 对于 good 级别，根据是否全对选择不同的翻译键
    const isAllCorrect = mistakeCount === 0;
    if (isAllCorrect) {
      textContent = t("result.allCorrect");
    } else {
      textContent = t("result.goodWithMistakes", { mistakeCount });
    }
  } else {
    // 对于其他级别，使用对应的翻译键
    const textKey = ICON_MAPPER[mistakeLevel].textKey;
    textContent = t(textKey);
  }

  return (
    <div className="flex h-10 flex-row items-center">
      <Icon className={classNames(className, "h-5 w-5")} />
      <span className="ml-2 inline-block align-middle text-sm font-medium leading-10 text-gray-700 sm:text-sm md:text-base">
        {textContent}
      </span>
    </div>
  );
};

export type ConclusionBarProps = {
  mistakeLevel: number;
  mistakeCount: number;
};

export default ConclusionBar;
