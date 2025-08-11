import { useEffect, useState } from "react";

export type AmountType = -1 | 6 | 12 | 36 | 50 | 66;

export const DonatingCard = ({
  className,
  onAmountChange,
}: {
  className?: string;
  onAmountChange?: (amount: AmountType) => void;
}) => {
  const [amount, setAmount] = useState<AmountType | undefined>(undefined);

  useEffect(() => {
    onAmountChange && amount && onAmountChange(amount as AmountType);
  }, [amount, onAmountChange]);

  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-3 ${
        className && className
      }`}
    >
      {amount && (amount >= 50 || amount === -1) && (
        <span>
          <a
            className="text-sm font-bold text-gray-500 underline-offset-4 hover:underline dark:text-gray-400"
            href="https://wj.qq.com/s2/13329666/380d/"
            target="_blank"
            rel="noreferrer"
          >
            贴纸寄送地址问卷
          </a>
        </span>
      )}
    </div>
  );
};
