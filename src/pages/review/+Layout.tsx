import ReviewNav from "@/components/ReviewNav";
import React from "react";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <ReviewNav />
      {children}
    </div>
  );
}

export { Layout };
