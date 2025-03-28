import type { Word } from "@/typings";

export async function wordListFetcher(url: string): Promise<Word[]> {
  // 确保 URL 以 / 开头
  const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
  const URL_PREFIX: string =
    REACT_APP_DEPLOY_ENV === "pages" ? "/qwerty-learner" : "";

  try {
    const response = await fetch(URL_PREFIX + normalizedUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch dictionary: ${response.status} ${response.statusText}`
      );
    }
    const words: Word[] = await response.json();
    return words;
  } catch (error) {
    console.error("Error fetching dictionary:", error);
    throw error;
  }
}
