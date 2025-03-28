import InfoPanel from "@/components/InfoPanel";
import { useCallback, useState } from "react";
import IconBook2 from "~icons/tabler/book-2";

export default function DictRequest() {
  const [showPanel, setShowPanel] = useState(false);

  const onOpenPanel = useCallback(() => {
    setShowPanel(true);
  }, []);

  const onClosePanel = useCallback(() => {
    setShowPanel(false);
  }, []);

  return (
    <>
      {showPanel && (
        <InfoPanel
          openState={showPanel}
          title="申请词典"
          icon={IconBook2}
          buttonClassName=" bg-blue-500 hover:bg-blue-400"
          iconClassName="text-blue-500 bg-indigo-100 dark:text-indigo-300 dark: bg-blue-500"
          onClose={onClosePanel}
        >
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <br />
            <br />
          </p>
          <br />
        </InfoPanel>
      )}
      <button
        className="cursor-pointer pr-6 text-sm text-blue-500"
        onClick={onOpenPanel}
      >
        没有找到想要的词典？
      </button>
    </>
  );
}
