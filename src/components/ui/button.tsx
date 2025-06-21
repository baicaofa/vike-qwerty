import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg";
  className?: string;
}

/**
 * 通用按钮组件
 * 支持多种样式变体和尺寸
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    // 变体样式
    const variantClasses = {
      default: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
      destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
      outline:
        "border border-gray-300 bg-transparent hover:bg-gray-50 active:bg-gray-100 text-gray-700",
      secondary:
        "bg-gray-200 text-gray-900 hover:bg-gray-300 active:bg-gray-400",
      ghost:
        "bg-transparent hover:bg-gray-100 active:bg-gray-200 text-gray-700",
      link: "bg-transparent underline-offset-4 hover:underline text-blue-600 hover:text-blue-800",
    };

    // 尺寸样式
    const sizeClasses = {
      default: "h-10 py-2 px-4 text-sm",
      sm: "h-8 px-3 text-xs",
      lg: "h-12 px-6 text-base",
    };

    const allClasses = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ].join(" ");

    return <button className={allClasses} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

export { Button };
