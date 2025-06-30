import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { MessageCircle, Heart, Brain, Users, Palette } from 'lucide-react'
import ThemeCustomizer from '../components/ThemeCustomizer'

export default function Login() {
  const { user, signIn, signUp, loading } = useAuth()
  const { currentPalette } = useTheme()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [diagnosisAge, setDiagnosisAge] = useState('')
  const [diagnosisType, setDiagnosisType] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, {
          full_name: fullName,
          diagnosis_age: diagnosisAge ? parseInt(diagnosisAge) : null,
          diagnosis_type: diagnosisType,
        })
      } else {
        await signIn(email, password)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        {/* Theme customizer button */}
        <button
          onClick={() => setShowThemeCustomizer(true)}
          className="fixed top-6 right-6 z-10 p-3 bg-surface rounded-full watercolor-shadow border-2 border-border hover:border-primary transition-all"
          title="Customize Theme"
        >
          <Palette className="w-5 h-5 text-primary" />
        </button>

        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-3xl flex items-center justify-center watercolor-shadow-strong">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-heading font-bold text-text">knowMe</h1>
                <p className="text-lg text-text-secondary font-body">Your conversational companion</p>
                <p className="text-sm text-accent font-accent">{currentPalette.name}</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <h2 className="text-3xl font-heading font-bold text-text leading-tight">
                Designed for neurodivergent adults diagnosed after 25
              </h2>
              <p className="text-lg text-text leading-relaxed font-body">
                A safe space to explore your thoughts, understand your patterns, and grow with the support of AI-powered conversations that truly listen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center watercolor-card p-6">
                <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-3 watercolor-shadow">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-text">Empathetic</h3>
                <p className="text-sm text-text-secondary font-body">Understanding your unique journey</p>
              </div>
              <div className="text-center watercolor-card p-6">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3 watercolor-shadow">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-text">Insightful</h3>
                <p className="text-sm text-text-secondary font-body">Helping you discover patterns</p>
              </div>
              <div className="text-center watercolor-card p-6">
                <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-3 watercolor-shadow">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-semibold text-text">Supportive</h3>
                <p className="text-sm text-text-secondary font-body">A judgment-free companion</p>
              </div>
            </div>
          </div>

          {/* Right side - Auth Form */}
          <div className="watercolor-card p-8 watercolor-shadow-strong">
            <div className="mb-8">
              <h3 className="text-2xl font-heading font-bold text-text mb-2">
                {isSignUp ? 'Join knowMe' : 'Welcome back'}
              </h3>
              <p className="text-text-secondary font-body">
                {isSignUp 
                  ? 'Create your account to start your journey' 
                  : 'Sign in to continue your conversations'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <>
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-text mb-2 font-body">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-field"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="diagnosisAge" className="block text-sm font-medium text-text mb-2 font-body">
                        Diagnosis Age
                      </label>
                      <input
                        type="number"
                        id="diagnosisAge"
                        value={diagnosisAge}
                        onChange={(e) => setDiagnosisAge(e.target.value)}
                        className="input-field"
                        placeholder="Age"
                        min="25"
                      />
                    </div>
                    <div>
                      <label htmlFor="diagnosisType" className="block text-sm font-medium text-text mb-2 font-body">
                        Diagnosis Type
                      </label>
                      <select
                        id="diagnosisType"
                        value={diagnosisType}
                        onChange={(e) => setDiagnosisType(e.target.value)}
                        className="input-field"
                      >
                        <option value="">Select type</option>
                        <option value="ADHD">ADHD</option>
                        <option value="Autism">Autism</option>
                        <option value="Both">Both ADHD & Autism</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-text mb-2 font-body">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text mb-2 font-body">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600 font-body">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || loading}
                className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary hover:text-secondary font-medium font-body transition-colors"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      <ThemeCustomizer 
        isOpen={showThemeCustomizer}
        onClose={() => setShowThemeCustomizer(false)}
      />
    </>
  )
}