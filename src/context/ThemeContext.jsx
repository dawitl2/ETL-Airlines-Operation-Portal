'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { readStorage, writeStorage } from '../utils/storage'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => readStorage('theme', 'light'))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    writeStorage('theme', theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  return useContext(ThemeContext)
}
