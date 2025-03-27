import { dictionaries } from '@/resources/dictionary'
import { wordListFetcher } from '@/utils/wordListFetcher'

export async function onBeforeRender(pageContext) {
  const { id } = pageContext.routeParams

  // 1. 查找词典
  const dictionary = dictionaries.find((dict) => dict.id === id)
  if (!dictionary) {
    return {
      pageContext: {
        // 直接返回错误信息，避免渲染组件
        redirectTo: '/404', // 或者返回自定义错误页面
      },
    }
  }

  // 2. 加载单词列表
  const words = await wordListFetcher(dictionary.url)

  // 3. 返回数据，注入到组件的 props
  return {
    pageContext: {
      pageProps: {
        dictionary,
        words,
      },
    },
  }
}
