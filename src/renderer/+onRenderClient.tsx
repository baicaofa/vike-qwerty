import { TypingContext, initialState } from '../pages/Typing/store'
import './PageLayout.css'
import { Provider as JotaiProvider, createStore } from 'jotai'
import type React from 'react'
import { hydrateRoot } from 'react-dom/client'
import type { PageContextClient } from 'vike/types'

interface PageContext extends PageContextClient {
  Page: React.ComponentType
  urlPathname: string
}

export function onRenderClient(pageContext: PageContext) {
  const { Page } = pageContext
  const container = document.getElementById('root')

  if (!container) {
    throw new Error('Root element not found')
  }

  const typingContextValue = {
    state: initialState,
    dispatch: () => {
      // 实际的 dispatch 函数会在组件内部通过 useReducer 创建
      console.warn('Initial dispatch called')
    },
  }

  // 创建一个 Jotai store 实例用于客户端渲染
  const store = createStore()

  hydrateRoot(
    container,
    <JotaiProvider store={store}>
      <TypingContext.Provider value={typingContextValue}>
        <Page pageContext={pageContext} />
      </TypingContext.Provider>
    </JotaiProvider>,
  )
}
