import ReviewNav from "@/components/ReviewNav";
import type React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ReviewNav />
      {children}
    </div>
  );
}

export { Layout };
