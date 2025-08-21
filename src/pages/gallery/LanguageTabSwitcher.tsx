import { GalleryContext } from "./context";
import codeFlag from "@/assets/flags/code.png";
import deFlag from "@/assets/flags/de.png";
import myDictFlag from "@/assets/flags/dict.png";
import enFlag from "@/assets/flags/en.png";
import idFlag from "@/assets/flags/id.png";
import jpFlag from "@/assets/flags/ja.png";
import kkFlag from "@/assets/flags/kk.png";
import LoginPromptModal from "@/components/LoginPromptModal";
import useAuthStore from "@/store/auth";
import type { LanguageCategoryType } from "@/typings";
import { RadioGroup } from "@headlessui/react";
import { useCallback, useContext, useState } from "react";
import { navigate } from "vike/client/router";

export type LanguageTabOption = {
  id: LanguageCategoryType;
  name: string;
  flag: string;
};

const options: LanguageTabOption[] = [
  { id: "my-dict", name: "我的词典", flag: myDictFlag },
  { id: "en", name: "英语", flag: enFlag },
  { id: "ja", name: "日语", flag: jpFlag },
  { id: "de", name: "德语", flag: deFlag },
  { id: "kk", name: "哈萨克语", flag: kkFlag },
  { id: "id", name: "印尼语", flag: idFlag },
  { id: "code", name: "Code", flag: codeFlag },
];

export function LanguageTabSwitcher() {
  const context = useContext(GalleryContext);
  const { isAuthenticated } = useAuthStore();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const onChangeTab = useCallback(
    (tab: string) => {
      if (!context) {
        return;
      }

      // 如果选择"我的词典"标签且用户未登录，则显示登录提示
      if (tab === "my-dict" && !isAuthenticated) {
        setShowLoginPrompt(true);
        return;
      }

      context.setState((draft) => {
        draft.currentLanguageTab = tab as LanguageCategoryType;
      });
    },
    [context, isAuthenticated]
  );

  const currentTab = context?.state?.currentLanguageTab || "en";

  return (
    <>
      <RadioGroup value={currentTab} onChange={onChangeTab}>
        <div className="flex items-center space-x-4">
          {options.map((option) => (
            <RadioGroup.Option
              key={option.id}
              value={option.id}
              className="cursor-pointer"
            >
              {({ checked, active }) => (
                <div
                  className={`flex items-center border-b-2 px-2 pb-1 ${
                    checked ? "border-indigo-500" : "border-transparent"
                  } ${active ? "bg-gray-100 dark:bg-gray-800" : ""}`}
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
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>

      <LoginPromptModal
        isOpen={showLoginPrompt}
        onClose={() => setShowLoginPrompt(false)}
        feature="自定义词典"
        description="自定义词典功能允许您上传和管理自己的词汇表，创建个性化的学习内容。登录后您可以上传Excel文件创建词典，并享受云端同步服务。"
        onLogin={() => navigate("/login")}
        showLearnMore={false}
      />
    </>
  );
}
