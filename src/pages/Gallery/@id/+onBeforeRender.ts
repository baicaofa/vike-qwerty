// /gallery/@id/+onBeforeRender.ts
import { dictionaries } from "@/resources/dictionary";
import { wordListFetcher } from "@/utils/wordListFetcher";
import type { PageContext } from "vike/types";

export async function onBeforeRender(pageContext: PageContext) {
  const routeParams = pageContext.routeParams;
  const dictionary = dictionaries.find((dict) => dict.id === routeParams?.id);

  if (!dictionary) {
    return {
      pageContext: {
        pageProps: {
          error: "词典未找到",
          dictionary: null,
          words: [],
        },
      },
    };
  }

  try {
    const words = await wordListFetcher(dictionary.url);
    return {
      pageContext: {
        pageProps: {
          dictionary,
          words,
        },
      },
    };
  } catch (error) {
    return {
      pageContext: {
        pageProps: {
          error: "加载词典数据失败",
          dictionary,
          words: [],
        },
      },
    };
  }
}
