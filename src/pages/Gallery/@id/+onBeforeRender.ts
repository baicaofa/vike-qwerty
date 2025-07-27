// /gallery/@id/+onBeforeRender.ts
import { dictionaries } from "@/resources/dictionary";
import {
  fetchCustomDictionary,
  fetchCustomDictionaryWords,
} from "@/services/customDictionaryService";
import {
  extractCustomDictionaryId,
  isCustomDictionary,
} from "@/store/customDictionary";
import { wordListFetcher } from "@/utils/wordListFetcher";
import type { PageContext } from "vike/types";

export async function onBeforeRender(pageContext: PageContext) {
  const routeParams = pageContext.routeParams;
  const urlDictionaryId = routeParams?.id;

  // 处理自定义词典
  if (urlDictionaryId && isCustomDictionary(urlDictionaryId)) {
    const dictionaryId = extractCustomDictionaryId(urlDictionaryId);
    try {
      // 获取自定义词典数据
      const dictionary = await fetchCustomDictionary(dictionaryId);
      if (!dictionary) {
        return {
          pageContext: {
            pageProps: {
              error: "自定义词典未找到",
              dictionary: null,
              words: [],
            },
          },
        };
      }

      // 获取自定义词典单词列表
      const words = await fetchCustomDictionaryWords(dictionaryId);

      return {
        pageContext: {
          pageProps: {
            dictionary: {
              ...dictionary,
              id: urlDictionaryId, // 保留带前缀的ID
            },
            words,
          },
        },
      };
    } catch (error) {
      return {
        pageContext: {
          pageProps: {
            error: "加载自定义词典数据失败",
            dictionary: null,
            words: [],
          },
        },
      };
    }
  }

  // 处理系统词典
  const dictionary = dictionaries.find((dict) => dict.id === urlDictionaryId);

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
