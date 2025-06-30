import React, { useState } from 'react'
import { X, Palette, Type, RotateCcw, Save, Paintbrush } from 'lucide-react'
import { useTheme, ColorPalette, FontSettings } from '../contexts/ThemeContext'

interface ThemeCustomizerProps {
  isOpen: boolean
  onClose: () => void
}

const fontOptions = [
  { name: 'Inter', category: 'Sans Serif' },
  { name: 'Playfair Display', category: 'Serif' },
  { name: 'Dancing Script', category: 'Script' },
  { name: 'Merriweather', category: 'Serif' },
  { name: 'Open Sans', category: 'Sans Serif' },
  { name: 'Lora', category: 'Serif' },
  { name: 'Poppins', category: 'Sans Serif' },
  { name: 'Crimson Text', category: 'Serif' },
  { name: 'Caveat', category: 'Script' },
  { name: 'Source Sans Pro', category: 'Sans Serif' },
]

export default function ThemeCustomizer({ isOpen, onClose }: ThemeCustomizerProps) {
  const { 
    currentPalette, 
    customPalette, 
    fonts, 
    predefinedPalettes, 
    setPalette, 
    setCustomPalette, 
    setFonts, 
    resetToDefault 
  } = useTheme()

  const [activeTab, setActiveTab] = useState<'palettes' | 'custom' | 'fonts'>('palettes')
  const [customColors, setCustomColors] = useState(currentPalette.colors)
  const [customName, setCustomName] = useState('My Custom Palette')
  const [customDescription, setCustomDescription] = useState('A personalized color scheme')

  if (!isOpen) return null

  const handleColorChange = (colorKey: string, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }))
  }

  const saveCustomPalette = () => {
    const newCustomPalette: ColorPalette = {
      id: 'custom',
      name: customName,
      description: customDescription,
      colors: customColors
    }
    setCustomPalette(newCustomPalette)
    setPalette(newCustomPalette)
  }

  const handleFontChange = (fontType: keyof FontSettings, fontName: string) => {
    setFonts({
      ...fonts,
      [fontType]: fontName
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden watercolor-border">
        {/* Header */}
        <div className="bg-gradient-to-r from-watercolor-1 to-watercolor-2 p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center watercolor-shadow">
                <Paintbrush className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-bold text-text">Theme Studio</h2>
                <p className="text-sm text-text-secondary">Customize your knowMe experience</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-watercolor-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mt-6 bg-surface rounded-lg p-1">
            {[
              { id: 'palettes', label: 'Palettes', icon: Palette },
              { id: 'custom', label: 'Custom', icon: Paintbrush },
              { id: 'fonts', label: 'Typography', icon: Type }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === id
                    ? 'bg-primary text-white watercolor-shadow'
                    : 'text-text-secondary hover:text-text hover:bg-watercolor-1'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
          {activeTab === 'palettes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-semibold text-text mb-4">
                  Predefined Palettes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predefinedPalettes.map((palette) => (
                    <div
                      key={palette.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all watercolor-card ${
                        currentPalette.id === palette.id
                          ? 'border-primary watercolor-shadow-strong'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setPalette(palette)}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="flex space-x-1">
                          <div 
                            className="w-4 h-4 rounded-full watercolor-dot"
                            style={{ backgroundColor: palette.colors.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full watercolor-dot"
                            style={{ backgroundColor: palette.colors.secondary }}
                          />
                          <div 
                            className="w-4 h-4 rounded-full watercolor-dot"
                            style={{ backgroundColor: palette.colors.accent }}
                          />
                        </div>
                        <h4 className="font-heading font-semibold text-text">{palette.name}</h4>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {palette.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {customPalette && (
                <div>
                  <h3 className="text-lg font-heading font-semibold text-text mb-4">
                    Your Custom Palette
                  </h3>
                  <div
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all watercolor-card ${
                      currentPalette.id === 'custom'
                        ? 'border-primary watercolor-shadow-strong'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setPalette(customPalette)}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex space-x-1">
                        <div 
                          className="w-4 h-4 rounded-full watercolor-dot"
                          style={{ backgroundColor: customPalette.colors.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full watercolor-dot"
                          style={{ backgroundColor: customPalette.colors.secondary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full watercolor-dot"
                          style={{ backgroundColor: customPalette.colors.accent }}
                        />
                      </div>
                      <h4 className="font-heading font-semibold text-text">{customPalette.name}</h4>
                    </div>
                    <p className="text-sm text-text-secondary">{customPalette.description}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-semibold text-text mb-4">
                  Create Your Palette
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Palette Name
                      </label>
                      <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="input-field"
                        placeholder="My Beautiful Palette"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-text mb-2">
                        Description
                      </label>
                      <textarea
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        className="input-field h-20 resize-none"
                        placeholder="Describe the mood and feeling of your palette..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(customColors).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="w-10 h-10 rounded-lg border border-border cursor-pointer watercolor-shadow"
                        />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-text capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </label>
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleColorChange(key, e.target.value)}
                            className="text-xs text-text-secondary bg-transparent border-none p-0 w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={saveCustomPalette}
                  className="btn-primary flex items-center space-x-2 mt-6"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Custom Palette</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'fonts' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading font-semibold text-text mb-4">
                  Typography Settings
                </h3>
                
                <div className="space-y-6">
                  {Object.entries(fonts).map(([fontType, currentFont]) => (
                    <div key={fontType}>
                      <label className="block text-sm font-medium text-text mb-3 capitalize">
                        {fontType} Font
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {fontOptions.map((font) => (
                          <button
                            key={font.name}
                            onClick={() => handleFontChange(fontType as keyof FontSettings, font.name)}
                            className={`p-3 rounded-lg border text-left transition-all watercolor-card ${
                              currentFont === font.name
                                ? 'border-primary bg-watercolor-1 watercolor-shadow'
                                : 'border-border hover:border-primary/50 hover:bg-watercolor-1'
                            }`}
                            style={{ fontFamily: font.name }}
                          >
                            <div className="font-medium text-text">{font.name}</div>
                            <div className="text-xs text-text-secondary">{font.category}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-watercolor-1 rounded-xl">
                  <h4 className="font-heading font-semibold text-text mb-2">Preview</h4>
                  <div className="space-y-2">
                    <p style={{ fontFamily: fonts.heading }} className="text-xl font-bold text-text">
                      This is a heading in {fonts.heading}
                    </p>
                    <p style={{ fontFamily: fonts.body }} className="text-text-secondary">
                      This is body text in {fonts.body}. It should be comfortable to read for longer passages.
                    </p>
                    <p style={{ fontFamily: fonts.accent }} className="text-lg text-primary">
                      This is accent text in {fonts.accent}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-watercolor-1 p-4 border-t border-border flex items-center justify-between">
          <button
            onClick={resetToDefault}
            className="flex items-center space-x-2 text-text-secondary hover:text-text transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Default</span>
          </button>
          
          <button
            onClick={onClose}
            className="btn-primary"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}