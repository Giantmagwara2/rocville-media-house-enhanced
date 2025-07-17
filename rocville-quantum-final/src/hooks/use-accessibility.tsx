
import { useEffect, useState } from 'react'

interface AccessibilityPreferences {
  reducedMotion: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
  darkMode: boolean
}

export function useAccessibility() {
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    darkMode: true
  })

  useEffect(() => {
    // Check for reduced motion preference
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Check for high contrast preference
    const highContrast = window.matchMedia('(prefers-contrast: high)').matches
    
    // Check for color scheme preference
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

    setPreferences(prev => ({
      ...prev,
      reducedMotion,
      highContrast,
      darkMode
    }))

    // Apply accessibility classes to document
    const applyAccessibilityClasses = () => {
      document.documentElement.classList.toggle('reduce-motion', reducedMotion)
      document.documentElement.classList.toggle('high-contrast', highContrast)
      document.documentElement.classList.toggle('dark-mode', darkMode)
    }

    applyAccessibilityClasses()

    // Listen for preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')
    const colorQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, reducedMotion: e.matches }))
      document.documentElement.classList.toggle('reduce-motion', e.matches)
    }

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, highContrast: e.matches }))
      document.documentElement.classList.toggle('high-contrast', e.matches)
    }

    const handleColorChange = (e: MediaQueryListEvent) => {
      setPreferences(prev => ({ ...prev, darkMode: e.matches }))
      document.documentElement.classList.toggle('dark-mode', e.matches)
    }

    motionQuery.addListener(handleMotionChange)
    contrastQuery.addListener(handleContrastChange)
    colorQuery.addListener(handleColorChange)

    return () => {
      motionQuery.removeListener(handleMotionChange)
      contrastQuery.removeListener(handleContrastChange)
      colorQuery.removeListener(handleColorChange)
    }
  }, [])

  const updateFontSize = (size: 'small' | 'medium' | 'large') => {
    setPreferences(prev => ({ ...prev, fontSize: size }))
    document.documentElement.setAttribute('data-font-size', size)
  }

  return {
    preferences,
    updateFontSize
  }
}
