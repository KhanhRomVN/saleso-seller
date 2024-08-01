import { useState, useEffect } from 'react'
import { theme } from 'antd'

export const useTheme = () => {
  const [mode, setMode] = useState('light')

  useEffect(() => {
    const savedMode = localStorage.getItem('mui-mode')
    if (savedMode) {
      setMode(savedMode)
    }
  }, [])

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem('mui-mode', newMode)
  }

  const antdTheme = {
    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
    token: {
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  }

  return { mode, toggleMode, antdTheme }
}
