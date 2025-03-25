// src/index.tsx
import { isOpenDarkModeAtom } from '@/store'
import 'animate.css'
import { Provider, useAtomValue } from 'jotai'
import mixpanel from 'mixpanel-browser'
import process from 'process'
import React, { useEffect, useState } from 'react'
import 'react-app-polyfill/stable'

if (process.env.NODE_ENV === 'production') {
  mixpanel.init('bdc492847e9340eeebd53cc35f321691')
} else {
  mixpanel.init('5474177127e4767124c123b2d7846e2a', { debug: true })
}

// 共享逻辑（如暗黑模式和移动端检测）
export function useRootLogic() {
  const darkMode = useAtomValue(isOpenDarkModeAtom)
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 600 : false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')

    const handleResize = () => {
      const mobile = window.innerWidth <= 600
      if (!mobile) {
        window.location.href = '/'
      }
      setIsMobile(mobile)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [darkMode])

  return { isMobile }
}
