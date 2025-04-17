import type { Word } from "@/typings";

export async function wordListFetcher(url: string): Promise<Word[]> {
  // 确保 URL 以 / 开头
  const normalizedUrl = url.startsWith("/") ? url : `/${url}`;
  const URL_PREFIX: string =
    REACT_APP_DEPLOY_ENV === "pages" ? "/qwerty-learner" : "";

  const fullUrl = URL_PREFIX + normalizedUrl;
  console.log("wordListFetcher 参数:", {
    originalUrl: url,
    normalizedUrl,
    URL_PREFIX,
    REACT_APP_DEPLOY_ENV,
    fullUrl,
  });

  try {
    console.log("开始获取词典:", fullUrl);
    const response = await fetch(fullUrl);
    console.log("获取词典响应:", {
      status: response.status,
      ok: response.ok,
      statusText: response.statusText,
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch dictionary: ${response.status} ${response.statusText}`
      );
    }

    const words: Word[] = await response.json();
    console.log("成功解析词典数据，单词数量:", words.length);
    return words;
  } catch (error) {
    console.error("获取词典失败:", {
      url: fullUrl,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}
