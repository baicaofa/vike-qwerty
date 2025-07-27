import {
  extractCustomDictionaryId,
  isCustomDictionary,
} from "@/store/customDictionary";
import type { PageContextServer } from "vike/types";

export default async function onBeforeRender(pageContext: PageContextServer) {
  const { routeParams } = pageContext;
  const urlDictionaryId = routeParams?.id;

  // 如果不是自定义词典，直接返回
  if (!isCustomDictionary(urlDictionaryId)) {
    return {
      pageContext: {
        pageProps: {
          error: "只能编辑自定义词典",
        },
      },
    };
  }

  const dictionaryId = extractCustomDictionaryId(urlDictionaryId);

  // 不在服务端获取数据，将ID传递给客户端
  return {
    pageContext: {
      pageProps: {
        dictionaryId,
        urlDictionaryId,
      },
    },
  };
}
