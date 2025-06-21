import type React from "react";

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  className = "",
  target,
  rel,
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // 使用 window.location.href 进行导航
    if (target === "_blank") {
      window.open(href, "_blank", rel);
    } else {
      window.location.href = href;
    }
  };

  return (
    <a
      href={href}
      className={className}
      target={target}
      rel={rel}
      onClick={handleClick}
    >
      {children}
    </a>
  );
};
