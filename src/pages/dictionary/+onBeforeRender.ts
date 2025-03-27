import { idDictionaryMap } from '@/resources/dictionary'
import type { OnBeforeRenderAsync } from 'vike/types'

export const onBeforeRender: OnBeforeRenderAsync = async (pageContext) => {
  const { routeParams, urlPathname } = pageContext

  console.log('onBeforeRender - urlPathname:', urlPathname)
  console.log('onBeforeRender - routeParams:', routeParams)

  if (!routeParams?.id) {
    console.log('onBeforeRender - No dictionary ID provided')
    return {
      pageContext: {
        title: '词典页面',
        description: '请选择要查看的词典',
      },
    }
  }

  const dictionary = idDictionaryMap[routeParams.id]

  console.log(dictionary)

  if (!dictionary) {
    console.log('onBeforeRender - Dictionary not found')
    return {
      pageContext: {
        title: '词典未找到',
        description: `请求的词典不存在。可用的词典ID: ${Object.keys(idDictionaryMap).join(', ')}`,
      },
    }
  }

  return {
    pageContext: {
      title: `${dictionary.name} 词典`,
      description: dictionary.description,
      // 可以添加更多 meta 信息
      meta: {
        dictionaryId: dictionary.id,
        wordCount: dictionary.length,
        category: dictionary.category,
        tags: dictionary.tags,
      },
    },
  }
}
