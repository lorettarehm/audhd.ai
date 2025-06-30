import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { User, Mail, Calendar, Brain, Save } from 'lucide-react'

interface Profile {
  id: string
  email: string
  full_name: string | null
  diagnosis_age: number | null
  diagnosis_type: string | null
  created_at: string
  updated_at: string
}

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    diagnosis_age: '',
    diagnosis_type: '',
  })

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setProfile(data)
        setFormData({
          full_name: data.full_name || '',
          diagnosis_age: data.diagnosis_age?.toString() || '',
          diagnosis_type: data.diagnosis_type || '',
        })
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user?.id!,
          email: user?.email!,
          full_name: null,
          diagnosis_age: null,
          diagnosis_type: null,
        }

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single()

        if (createError) throw createError
        setProfile(createdProfile)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const updates = {
        full_name: formData.full_name || null,
        diagnosis_age: formData.diagnosis_age ? parseInt(formData.diagnosis_age) : null,
        diagnosis_type: formData.diagnosis_type || null,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id)

      if (error) throw error

      setMessage('Profile updated successfully!')
      await loadProfile()
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {profile?.full_name || 'Anonymous User'}
              </h3>
              <p className="text-gray-600">{profile?.email}</p>
              {profile?.created_at && (
                <p className="text-sm text-gray-500 mt-2">
                  Member since {new Date(profile.created_at).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-5 h-5" />
                <span className="text-sm">{profile?.email}</span>
              </div>
              {profile?.diagnosis_age && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Calendar className="w-5 h-5" />
                  <span className="text-sm">Diagnosed at age {profile.diagnosis_age}</span>
                </div>
              )}
              {profile?.diagnosis_type && (
                <div className="flex items-center space-x-3 text-gray-600">
                  <Brain className="w-5 h-5" />
                  <span className="text-sm">{profile.diagnosis_type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Update Your Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="diagnosis_age" className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis Age
                  </label>
                  <input
                    type="number"
                    id="diagnosis_age"
                    value={formData.diagnosis_age}
                    onChange={(e) => setFormData({ ...formData, diagnosis_age: e.target.value })}
                    className="input-field"
                    placeholder="Age when diagnosed"
                    min="25"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Age when you received your neurodivergent diagnosis
                  </p>
                </div>

                <div>
                  <label htmlFor="diagnosis_type" className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis Type
                  </label>
                  <select
                    id="diagnosis_type"
                    value={formData.diagnosis_type}
                    onChange={(e) => setFormData({ ...formData, diagnosis_type: e.target.value })}
                    className="input-field"
                  >
                    <option value="">Select diagnosis type</option>
                    <option value="ADHD">ADHD</option>
                    <option value="Autism">Autism Spectrum Disorder</option>
                    <option value="Both">Both ADHD & Autism</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {message && (
                <div className={`p-3 rounded-lg ${
                  message.includes('Error') 
                    ? 'bg-red-50 border border-red-200 text-red-600' 
                    : 'bg-green-50 border border-green-200 text-green-600'
                }`}>
                  <p className="text-sm">{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>

          {/* Privacy Notice */}
          <div className="card mt-6 bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Privacy & Data</h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                Your personal information is securely stored and never shared with third parties.
              </p>
              <p>
                Diagnosis information helps us provide more personalized and relevant conversations.
              </p>
              <p>
                All conversations are encrypted and stored securely for your analysis and growth tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}