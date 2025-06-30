import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { MessageCircle, Heart, Brain, Users, Palette, Eye, EyeOff } from 'lucide-react'
import ThemeCustomizer from '../components/ThemeCustomizer'

export default function Login() {
  const { user, signIn, signUp, signInWithGoogle, signInWithFacebook, resetPassword, loading } = useAuth()
  const { currentPalette } = useTheme()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [diagnosisAge, setDiagnosisAge] = useState('')
  const [diagnosisType, setDiagnosisType] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showThemeCustomizer, setShowThemeCustomizer] = useState(false)

  if (user) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      if (showForgotPassword) {
        await resetPassword(email)
        setMessage('Password reset email sent! Check your inbox.')
        setShowForgotPassword(false)
      } else if (isSignUp) {
        if (!email) {
          throw new Error('Email is required')
        }
        await signUp(email, password, {
          full_name: fullName,
          diagnosis_age: diagnosisAge ? parseInt(diagnosisAge) : null,
          diagnosis_type: diagnosisType,
        })
        setMessage('Account created! Please check your email to verify your account.')
      } else {
        await signIn(email, password)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setError('')
    setIsLoading(true)
    
    try {
      if (provider === 'google') {
        await signInWithGoogle()
      } else {
        await signInWithFacebook()
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
                {showForgotPassword 
                  ? 'Reset Password' 
                  : isSignUp 
                    ? 'Join knowMe' 
                    : 'Welcome back'
                }
              </h3>
              <p className="text-text-secondary font-body">
                {showForgotPassword
                  ? 'Enter your email to receive a password reset link'
                  : isSignUp 
                    ? 'Create your account to start your journey' 
                    : 'Sign in to continue your conversations'
                }
              </p>
            </div>

            {!showForgotPassword && (
              <div className="space-y-4 mb-6">
                <button
                  onClick={() => handleSocialLogin('google')}
                  disabled={isLoading}
                  className="w-full btn-secondary py-3 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <button
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                  className="w-full btn-secondary py-3 flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Continue with Facebook</span>
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-surface text-text-secondary">or</span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && !showForgotPassword && (
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
                  Email Address *
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

              {!showForgotPassword && (
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text mb-2 font-body">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field pr-12"
                      placeholder="Enter your password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-600 font-body">{error}</p>
                </div>
              )}

              {message && (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-600 font-body">{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || loading}
                className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Please wait...' : (
                  showForgotPassword 
                    ? 'Send Reset Email'
                    : isSignUp 
                      ? 'Create Account' 
                      : 'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              {!showForgotPassword && !isSignUp && (
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-primary hover:text-secondary font-medium font-body transition-colors text-sm"
                >
                  Forgot your password?
                </button>
              )}
              
              <div>
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setShowForgotPassword(false)
                    setError('')
                    setMessage('')
                  }}
                  className="text-primary hover:text-secondary font-medium font-body transition-colors"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"
                  }
                </button>
              </div>

              {showForgotPassword && (
                <button
                  onClick={() => {
                    setShowForgotPassword(false)
                    setError('')
                    setMessage('')
                  }}
                  className="text-text-secondary hover:text-text font-medium font-body transition-colors text-sm"
                >
                  Back to sign in
                </button>
              )}
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