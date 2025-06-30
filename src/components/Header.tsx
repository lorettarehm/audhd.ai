import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { LogOut, User, Palette } from 'lucide-react'
import ThemeCustomizer from './ThemeCustomizer'

export default function Header() {
  const { user, signOut } = useAuth()
  const { currentPalette } = useTheme()
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)

  return (
    <>
      <header className="bg-surface border-b-2 border-border px-6 py-4 watercolor-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-heading font-bold text-text">audhd.ai</h1>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-text-secondary font-body">Your conversational companion</p>
              <p className="text-xs text-accent font-accent">{currentPalette.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowThemeCustomizer(true)}
              className="flex items-center space-x-2 px-3 py-2 text-text-secondary hover:text-text transition-colors rounded-lg hover:bg-watercolor-1"
              title="Customize Theme"
            >
              <Palette className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Theme</span>
            </button>
            
            <div className="flex items-center space-x-3 text-text">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center watercolor-shadow">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
            </div>
            
            <button
              onClick={signOut}
              className="flex items-center space-x-2 text-text-secondary hover:text-text transition-colors px-3 py-2 rounded-lg hover:bg-watercolor-1"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <ThemeCustomizer 
        isOpen={showThemeCustomizer}
        onClose={() => setShowThemeCustomizer(false)}
      />
    </>
  )
}