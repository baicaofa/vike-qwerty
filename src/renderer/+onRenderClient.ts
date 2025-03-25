// src/renderer/+onRenderClient.ts
import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import type { PageContextClient } from 'vike/types'

export async function onRenderClient(pageContext: PageContextClient) {
  const { Page } = pageContext
  const container = document.getElementById('root')
  if (!container) {
    throw new Error('找不到 root 元素')
  }
  hydrateRoot(container, React.createElement(Page, { pageContext }))
}
