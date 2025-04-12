// /gallery/@id/+onBeforePrerenderStart.ts
import { dictionaries } from "@/resources/dictionary";
import type { OnBeforePrerenderStartSync } from "vike/types";

export const onBeforePrerenderStart: OnBeforePrerenderStartSync = () => {
  // 为每个词典生成预渲染 URL
  return dictionaries.map((dict) => `/gallery/${dict.id}`);
};
