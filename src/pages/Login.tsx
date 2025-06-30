import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { MessageCircle, Heart, Brain, Users } from 'lucide-react'

export default function Login() {
  const { user, signIn, signUp, loading } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [diagnosisAge, setDiagnosisAge] = useState('')
  const [diagnosisType, setDiagnosisType] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-3 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">knowMe</h1>
              <p className="text-lg text-gray-600">Your conversational companion</p>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Designed for neurodivergent adults diagnosed after 25
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              A safe space to explore your thoughts, understand your patterns, and grow with the support of AI-powered conversations that truly listen.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Empathetic</h3>
              <p className="text-sm text-gray-600">Understanding your unique journey</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Insightful</h3>
              <p className="text-sm text-gray-600">Helping you discover patterns</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Supportive</h3>
              <p className="text-sm text-gray-600">A judgment-free companion</p>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Join knowMe' : 'Welcome back'}
            </h3>
            <p className="text-gray-600">
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
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label htmlFor="diagnosisAge" className="block text-sm font-medium text-gray-700 mb-2">
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
                    <label htmlFor="diagnosisType" className="block text-sm font-medium text-gray-700 mb-2">
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || loading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary-600 hover:text-primary-700 font-medium"
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
  )
}