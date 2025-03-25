import { renderToHtml, createElement } from 'some-ui-framework'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import type { OnRenderHtmlAsync } from 'vike/types'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  const { Page } = pageContext
  const pageHtml = renderToString(<Page pageContext={pageContext} />)

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Qwerty Learner</title>
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`

  return { documentHtml }
  // ...
}
