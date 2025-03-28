import { dictionaries } from "@/resources/dictionary";
import { wordListFetcher } from "@/utils/wordListFetcher";
import type { PageContext } from "vike/types";

export async function onBeforeRender(pageContext: PageContext) {
  const { id } = pageContext.routeParams;

  // 1. 查找词典
  const dictionary = dictionaries.find((dict) => dict.id === id);
  if (!dictionary) {
    return {
      pageContext: {
        redirectTo: "/404",
      },
    };
  }

  try {
    // 2. 加载单词列表
    const words = await wordListFetcher(dictionary.url);

    // 3. 返回数据，注入到组件的 props
    return {
      pageContext: {
        pageProps: {
          dictionary,
          words,
        },
      },
    };
  } catch (error) {
    console.error("Failed to load dictionary:", error);
    return {
      pageContext: {
        pageProps: {
          dictionary,
          words: [],
          error: "Failed to load dictionary words",
        },
      },
    };
  }
}
