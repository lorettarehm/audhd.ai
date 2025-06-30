import React, { createContext, useContext, useState, useEffect } from 'react'

export interface ColorPalette {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    watercolor1: string
    watercolor2: string
    watercolor3: string
  }
}

export interface FontSettings {
  heading: string
  body: string
  accent: string
}

const defaultPalettes: ColorPalette[] = [
  {
    id: 'ocean-dreams',
    name: 'Ocean Dreams',
    description: 'Calming blues and teals like gentle waves washing over consciousness',
    colors: {
      primary: '#2563eb',
      secondary: '#0891b2',
      accent: '#06b6d4',
      background: '#f0f9ff',
      surface: '#ffffff',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      watercolor1: 'rgba(37, 99, 235, 0.1)',
      watercolor2: 'rgba(8, 145, 178, 0.15)',
      watercolor3: 'rgba(6, 182, 212, 0.08)',
    }
  },
  {
    id: 'sunset-reverie',
    name: 'Sunset Reverie',
    description: 'Warm oranges and pinks that embrace like a comforting evening glow',
    colors: {
      primary: '#ea580c',
      secondary: '#ec4899',
      accent: '#f59e0b',
      background: '#fff7ed',
      surface: '#ffffff',
      text: '#1c1917',
      textSecondary: '#78716c',
      border: '#e7e5e4',
      watercolor1: 'rgba(234, 88, 12, 0.1)',
      watercolor2: 'rgba(236, 72, 153, 0.12)',
      watercolor3: 'rgba(245, 158, 11, 0.08)',
    }
  },
  {
    id: 'forest-whispers',
    name: 'Forest Whispers',
    description: 'Earthy greens and browns that ground you in nature\'s wisdom',
    colors: {
      primary: '#16a34a',
      secondary: '#059669',
      accent: '#84cc16',
      background: '#f0fdf4',
      surface: '#ffffff',
      text: '#14532d',
      textSecondary: '#4b5563',
      border: '#d1d5db',
      watercolor1: 'rgba(22, 163, 74, 0.1)',
      watercolor2: 'rgba(5, 150, 105, 0.12)',
      watercolor3: 'rgba(132, 204, 22, 0.08)',
    }
  },
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    description: 'Soft purples and lilacs that soothe the mind like a gentle meditation',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#c084fc',
      background: '#faf5ff',
      surface: '#ffffff',
      text: '#581c87',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      watercolor1: 'rgba(124, 58, 237, 0.1)',
      watercolor2: 'rgba(168, 85, 247, 0.12)',
      watercolor3: 'rgba(192, 132, 252, 0.08)',
    }
  },
  {
    id: 'monochrome-zen',
    name: 'Monochrome Zen',
    description: 'Elegant grays and blacks that focus the mind with minimalist clarity',
    colors: {
      primary: '#374151',
      secondary: '#4b5563',
      accent: '#6b7280',
      background: '#f9fafb',
      surface: '#ffffff',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#d1d5db',
      watercolor1: 'rgba(55, 65, 81, 0.08)',
      watercolor2: 'rgba(75, 85, 99, 0.1)',
      watercolor3: 'rgba(107, 114, 128, 0.06)',
    }
  }
]

const defaultFonts: FontSettings = {
  heading: 'Playfair Display',
  body: 'Inter',
  accent: 'Dancing Script'
}

interface ThemeContextType {
  currentPalette: ColorPalette
  customPalette: ColorPalette | null
  fonts: FontSettings
  predefinedPalettes: ColorPalette[]
  setPalette: (palette: ColorPalette) => void
  setCustomPalette: (palette: ColorPalette) => void
  setFonts: (fonts: FontSettings) => void
  resetToDefault: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(defaultPalettes[0])
  const [customPalette, setCustomPalette] = useState<ColorPalette | null>(null)
  const [fonts, setFonts] = useState<FontSettings>(defaultFonts)

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('knowme-theme')
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme)
        if (theme.palette) {
          const palette = defaultPalettes.find(p => p.id === theme.palette.id) || theme.palette
          setCurrentPalette(palette)
        }
        if (theme.customPalette) {
          setCustomPalette(theme.customPalette)
        }
        if (theme.fonts) {
          setFonts(theme.fonts)
        }
      } catch (error) {
        console.error('Error loading saved theme:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Apply theme to CSS variables
    const root = document.documentElement
    const colors = currentPalette.colors

    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-accent', colors.accent)
    root.style.setProperty('--color-background', colors.background)
    root.style.setProperty('--color-surface', colors.surface)
    root.style.setProperty('--color-text', colors.text)
    root.style.setProperty('--color-text-secondary', colors.textSecondary)
    root.style.setProperty('--color-border', colors.border)
    root.style.setProperty('--color-watercolor-1', colors.watercolor1)
    root.style.setProperty('--color-watercolor-2', colors.watercolor2)
    root.style.setProperty('--color-watercolor-3', colors.watercolor3)

    // Apply fonts
    root.style.setProperty('--font-heading', fonts.heading)
    root.style.setProperty('--font-body', fonts.body)
    root.style.setProperty('--font-accent', fonts.accent)

    // Save to localStorage
    localStorage.setItem('knowme-theme', JSON.stringify({
      palette: currentPalette,
      customPalette,
      fonts
    }))
  }, [currentPalette, customPalette, fonts])

  const setPalette = (palette: ColorPalette) => {
    setCurrentPalette(palette)
  }

  const resetToDefault = () => {
    setCurrentPalette(defaultPalettes[0])
    setCustomPalette(null)
    setFonts(defaultFonts)
  }

  const value = {
    currentPalette,
    customPalette,
    fonts,
    predefinedPalettes: defaultPalettes,
    setPalette,
    setCustomPalette,
    setFonts,
    resetToDefault,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}