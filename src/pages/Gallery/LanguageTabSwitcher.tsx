import { GalleryContext } from "./context";
import codeFlag from "@/assets/flags/code.png";
import deFlag from "@/assets/flags/de.png";
import enFlag from "@/assets/flags/en.png";
import idFlag from "@/assets/flags/id.png";
import jpFlag from "@/assets/flags/ja.png";
import kkFlag from "@/assets/flags/kk.png";
import type { LanguageCategoryType } from "@/typings";
import { RadioGroup } from "@headlessui/react";
import { useCallback, useContext } from "react";

export type LanguageTabOption = {
  id: LanguageCategoryType;
  name: string;
  flag: string;
};

const options: LanguageTabOption[] = [
  { id: "en", name: "英语", flag: enFlag },
  { id: "ja", name: "日语", flag: jpFlag },
  { id: "de", name: "德语", flag: deFlag },
  { id: "kk", name: "哈萨克语", flag: kkFlag },
  { id: "id", name: "印尼语", flag: idFlag },
  { id: "code", name: "Code", flag: codeFlag },
];

export function LanguageTabSwitcher() {
  const context = useContext(GalleryContext);
  console.log("LanguageTabSwitcher context:", context);

  const onChangeTab = useCallback(
    (tab: string) => {
      console.log("onChangeTab called with:", tab);
      if (!context) {
        console.log("Context is null, returning early");
        return;
      }
      context.setState((draft) => {
        console.log(
          "Updating state from:",
          draft.currentLanguageTab,
          "to:",
          tab
        );
        draft.currentLanguageTab = tab as LanguageCategoryType;
      });
    },
    [context]
  );

  // 使用默认值而不是返回 null
  const currentTab = context?.state?.currentLanguageTab || "en";
  console.log("Current tab:", currentTab);

  return (
    <RadioGroup value={currentTab} onChange={onChangeTab}>
      <div className="flex items-center space-x-4">
        {options.map((option) => (
          <RadioGroup.Option
            key={option.id}
            value={option.id}
            className="cursor-pointer"
          >
            {({ checked, active }) => {
              console.log(
                `Option ${option.id} checked:`,
                checked,
                "active:",
                active
              );
              return (
                <div
                  className={`flex items-center border-b-2 px-2 pb-1 ${
                    checked ? "border-indigo-500" : "border-transparent"
                  } ${active ? "bg-gray-100" : ""}`}
                >
                  <img
                    src={option.flag}
                    alt={option.name}
                    className="mr-1.5 h-7 w-7"
                  />
                  <p
                    className={`text-lg font-medium text-gray-700 dark:text-gray-200`}
                  >
                    {option.name}
                  </p>
                </div>
              );
            }}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
