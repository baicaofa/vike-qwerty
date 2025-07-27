import type { LanguageCategoryType } from "@/typings";
import { createContext } from "react";
import type { Updater } from "use-immer";

export type GalleryState = {
  currentLanguageTab: LanguageCategoryType;
  isUploadModalOpen: boolean;
};

export const initialGalleryState: GalleryState = {
  currentLanguageTab: "en",
  isUploadModalOpen: false,
};

export const GalleryContext = createContext<{
  state: GalleryState;
  setState: Updater<GalleryState>;
} | null>(null);
