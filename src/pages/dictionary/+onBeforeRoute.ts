import type { OnBeforeRouteSync } from 'vike/types'

export const onBeforeRoute: OnBeforeRouteSync = (pageContext) => {
  const match = pageContext.url.match(/^\/dictionary\/([^/]+)$/)
  if (match) {
    const id = match[1]
    return {
      pageContext: {
        routeParams: { id },
      },
    }
  }
  return {
    pageContext: {},
  }
}
