import { TypingContext, TypingStateActionType } from "../../store";
import AdvancedSetting from "./AdvancedSetting";
import SoundSetting from "./SoundSetting";
import ViewSetting from "@/pages/Typing/components/Setting/ViewSetting";
import { Dialog, Tab, Transition } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import IconCog6Tooth from "~icons/heroicons/cog-6-tooth-solid";
import IconEye from "~icons/heroicons/eye-solid";
import IconAdjustmentsHorizontal from "~icons/tabler/adjustments-horizontal";
import IconEar from "~icons/tabler/ear";
import IconX from "~icons/tabler/x";

interface SettingProps {
  pageContext?: any;
}

export default function Setting({ pageContext }: SettingProps = {}) {
  const { t } = useTranslation("typing");
  const { state, dispatch } = useContext(TypingContext);

  const [isOpenSetting, setIsOpenSetting] = useState(false);

  const onCloseSetting = () => {
    setIsOpenSetting(false);
  };

  const onToggleSetting = () => {
    setIsOpenSetting(!isOpenSetting);
  };

  const onKeyPress = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.code === "Escape" || e.key === "Escape") {
      onCloseSetting();
    }
  };

  const onRestart = () => {
    dispatch({
      type: TypingStateActionType.RESTART,
    });
    onCloseSetting();
  };

  const tabs = [
    {
      name: t("settings.sound", "声音"),
      icon: IconEar,
      content: <SoundSetting />,
    },
    {
      name: t("settings.advanced", "高级"),
      icon: IconAdjustmentsHorizontal,
      content: <AdvancedSetting pageContext={pageContext} />,
    },
    {
      name: t("settings.view", "视图"),
      icon: IconEye,
      content: <ViewSetting />,
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={onToggleSetting}
        className={`flex items-center justify-center rounded p-[2px] text-lg text-blue-500 outline-none transition-colors duration-300 ease-in-out hover:bg-blue-400 hover:text-white  ${
          isOpenSetting && " bg-blue-500 text-white"
        }`}
        title={t("tooltips.closeDialog", "关闭设置")}
      >
        <IconCog6Tooth className="icon" />
      </button>

      <Transition appear show={isOpenSetting} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onCloseSetting}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="flex w-200 flex-col overflow-hidden rounded-2xl bg-white p-0 shadow-xl dark:bg-gray-800">
                  <div className="relative flex h-22 items-end justify-between rounded-t-lg border-b border-neutral-100 bg-stone-50 px-6 py-3 dark:border-neutral-700 dark:bg-gray-900">
                    <span className="text-3xl font-bold text-gray-600">
                      {t("settings.title")}
                    </span>
                    <button
                      type="button"
                      onClick={onCloseSetting}
                      title={t("tooltips.closeDialog", "关闭设置")}
                    >
                      <IconX className="absolute right-7 top-5 cursor-pointer text-gray-400" />
                    </button>
                  </div>

                  <Tab.Group vertical>
                    <div className="flex h-120 w-full ">
                      <Tab.List className="flex h-full  flex-col items-start space-y-3  border-r border-neutral-100 bg-stone-50 px-6 py-3 dark:border-transparent dark:bg-gray-900">
                        {tabs.map((tab, index) => (
                          <Tab
                            key={index}
                            className={({ selected }) =>
                              classNames(
                                "flex h-14 w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-2 ring-0 focus:outline-none",
                                selected &&
                                  "bg-gray-200 bg-opacity-50 dark:bg-gray-800"
                              )
                            }
                          >
                            <tab.icon className="mr-2 text-neutral-500  dark:text-neutral-300" />
                            <span className="text-neutral-500 dark:text-neutral-300">
                              {tab.name}
                            </span>
                          </Tab>
                        ))}
                      </Tab.List>

                      <Tab.Panels className="h-full w-full flex-1">
                        {tabs.map((tab, index) => (
                          <Tab.Panel
                            key={index}
                            className="flex h-full w-full  focus:outline-none"
                          >
                            {tab.content}
                          </Tab.Panel>
                        ))}
                      </Tab.Panels>
                    </div>
                  </Tab.Group>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
