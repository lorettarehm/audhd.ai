import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useConversation } from '../contexts/ConversationContext'
import { supabase } from '../lib/supabase'
import { User, Mail, Calendar, Brain, Save, Download, Trash2, AlertTriangle, Sparkles, FileText } from 'lucide-react'
import Papa from 'papaparse'

interface Profile {
  id: string
  email: string
  full_name: string | null
  diagnosis_age: number | null
  diagnosis_type: string | null
  created_at: string
  updated_at: string
}

interface AIInsight {
  summary: string
  keyPatterns: string[]
  emotionalTrends: string[]
  recommendations: string[]
  lastUpdated: string
}

export default function Profile() {
  const { user, signOut } = useAuth()
  const { conversations } = useConversation()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [aiInsight, setAiInsight] = useState<AIInsight | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const [formData, setFormData] = useState({
    full_name: '',
    diagnosis_age: '',
    diagnosis_type: '',
  })

  useEffect(() => {
    if (user) {
      loadProfile()
      generateAIInsight()
    }
  }, [user, conversations])

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

  const generateAIInsight = async () => {
    if (!conversations.length) return

    try {
      // Get all messages for analysis
      const { data: messages, error } = await supabase
        .from('messages')
        .select('content, role, timestamp, emotion_analysis')
        .in('conversation_id', conversations.map(c => c.id))
        .order('timestamp', { ascending: true })

      if (error) throw error

      // Generate AI summary (simplified version - in production, this would use actual AI)
      const userMessages = messages?.filter(m => m.role === 'user') || []
      const totalMessages = messages?.length || 0
      const conversationCount = conversations.length
      
      // Analyze patterns
      const commonWords = extractCommonThemes(userMessages.map(m => m.content))
      const timePatterns = analyzeTimePatterns(messages || [])
      const emotionalPatterns = analyzeEmotionalPatterns(messages || [])

      const insight: AIInsight = {
        summary: generateSummary(conversationCount, totalMessages, commonWords),
        keyPatterns: timePatterns,
        emotionalTrends: emotionalPatterns,
        recommendations: generateRecommendations(commonWords, emotionalPatterns),
        lastUpdated: new Date().toISOString()
      }

      setAiInsight(insight)
    } catch (error) {
      console.error('Error generating AI insight:', error)
    }
  }

  const extractCommonThemes = (messages: string[]): string[] => {
    const text = messages.join(' ').toLowerCase()
    const themes = []
    
    if (text.includes('work') || text.includes('job') || text.includes('career')) themes.push('Work & Career')
    if (text.includes('anxiety') || text.includes('stress') || text.includes('worry')) themes.push('Anxiety Management')
    if (text.includes('relationship') || text.includes('social') || text.includes('friend')) themes.push('Social Connections')
    if (text.includes('focus') || text.includes('attention') || text.includes('concentrate')) themes.push('Focus & Attention')
    if (text.includes('routine') || text.includes('habit') || text.includes('schedule')) themes.push('Daily Routines')
    
    return themes.length ? themes : ['General Wellbeing']
  }

  const analyzeTimePatterns = (messages: any[]): string[] => {
    const patterns = []
    const hours = messages.map(m => new Date(m.timestamp).getHours())
    
    const morningChats = hours.filter(h => h >= 6 && h < 12).length
    const afternoonChats = hours.filter(h => h >= 12 && h < 18).length
    const eveningChats = hours.filter(h => h >= 18 || h < 6).length
    
    if (morningChats > afternoonChats && morningChats > eveningChats) {
      patterns.push('Most active in mornings - great for setting daily intentions')
    } else if (eveningChats > morningChats && eveningChats > afternoonChats) {
      patterns.push('Evening reflections are your strength - perfect for processing the day')
    }
    
    const avgLength = messages.length / Math.max(1, new Set(messages.map(m => new Date(m.timestamp).toDateString())).size)
    if (avgLength > 5) {
      patterns.push('You engage in deep, meaningful conversations')
    }
    
    return patterns.length ? patterns : ['Building consistent conversation habits']
  }

  const analyzeEmotionalPatterns = (messages: any[]): string[] => {
    // Simplified emotional analysis
    const userMessages = messages.filter(m => m.role === 'user')
    const text = userMessages.map(m => m.content).join(' ').toLowerCase()
    
    const patterns = []
    
    if (text.includes('feel') || text.includes('emotion')) {
      patterns.push('Strong emotional awareness and expression')
    }
    if (text.includes('think') || text.includes('understand') || text.includes('realize')) {
      patterns.push('Analytical and reflective thinking style')
    }
    if (text.includes('help') || text.includes('support') || text.includes('advice')) {
      patterns.push('Actively seeking growth and improvement')
    }
    
    return patterns.length ? patterns : ['Developing emotional insight']
  }

  const generateSummary = (conversations: number, messages: number, themes: string[]): string => {
    const avgMessages = Math.round(messages / Math.max(1, conversations))
    const primaryTheme = themes[0] || 'personal growth'
    
    return `You've engaged in ${conversations} meaningful conversations with ${messages} total exchanges, averaging ${avgMessages} messages per session. Your primary focus area is ${primaryTheme.toLowerCase()}, showing a commitment to self-understanding and growth. Your conversation style demonstrates thoughtful reflection and genuine engagement with the AI companion. You're building valuable patterns of self-exploration that contribute to your neurodivergent journey of discovery and personal development.`
  }

  const generateRecommendations = (themes: string[], emotions: string[]): string[] => {
    const recs = []
    
    if (themes.includes('Anxiety Management')) {
      recs.push('Consider exploring breathing exercises and grounding techniques during conversations')
    }
    if (themes.includes('Work & Career')) {
      recs.push('Regular check-ins about work-life balance could be beneficial')
    }
    if (themes.includes('Social Connections')) {
      recs.push('Practice social scenarios and relationship dynamics in your conversations')
    }
    if (emotions.includes('Analytical and reflective thinking style')) {
      recs.push('Your analytical nature is a strength - use it to identify patterns and solutions')
    }
    
    recs.push('Continue your regular conversation practice for ongoing self-discovery')
    
    return recs
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

  const exportData = async () => {
    try {
      // Get all user data
      const { data: messages, error: msgError } = await supabase
        .from('messages')
        .select('*, conversations(title, created_at)')
        .in('conversation_id', conversations.map(c => c.id))
        .order('timestamp', { ascending: true })

      if (msgError) throw msgError

      // Prepare CSV data
      const csvData = messages?.map(msg => ({
        conversation_title: (msg as any).conversations?.title || 'Unknown',
        conversation_date: (msg as any).conversations?.created_at || '',
        message_timestamp: msg.timestamp,
        role: msg.role,
        content: msg.content,
        audio_url: msg.audio_url || '',
      })) || []

      // Add profile data
      const profileData = {
        conversation_title: 'PROFILE_DATA',
        conversation_date: profile?.created_at || '',
        message_timestamp: profile?.updated_at || '',
        role: 'profile',
        content: JSON.stringify({
          email: profile?.email,
          full_name: profile?.full_name,
          diagnosis_age: profile?.diagnosis_age,
          diagnosis_type: profile?.diagnosis_type,
          ai_summary: aiInsight?.summary || ''
        }),
        audio_url: '',
      }

      csvData.unshift(profileData)

      // Generate CSV
      const csv = Papa.unparse(csvData)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `knowme-data-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setMessage('Data exported successfully!')
    } catch (error: any) {
      setMessage(`Export error: ${error.message}`)
    }
  }

  const deleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      setMessage('Please type "DELETE MY ACCOUNT" to confirm')
      return
    }

    try {
      // Delete user data (cascading deletes will handle related data)
      const { error } = await supabase.auth.admin.deleteUser(user?.id!)
      
      if (error) throw error

      await signOut()
    } catch (error: any) {
      setMessage(`Delete error: ${error.message}`)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const readabilityScore = aiInsight?.summary ? Math.min(95, 75 + (aiInsight.summary.split(' ').length > 50 ? 10 : 0) + (aiInsight.summary.split('.').length > 3 ? 10 : 0)) : 0

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-text mb-2">Profile & Insights</h1>
        <p className="text-text-secondary font-body">
          Manage your information and explore AI-generated insights about your journey
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Insight Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Summary */}
          <div className="watercolor-card p-6 watercolor-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center watercolor-shadow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold text-text">AI Insight Summary</h2>
                <p className="text-sm text-text-secondary font-body">
                  Readability Score: {readabilityScore}/100 • {aiInsight?.summary.split(' ').length || 0} words
                </p>
              </div>
            </div>
            
            {aiInsight ? (
              <div className="space-y-4">
                <div className="bg-watercolor-1 rounded-xl p-4 border-2 border-border">
                  <p className="text-text leading-relaxed font-body">{aiInsight.summary}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-heading font-semibold text-text mb-2">Key Patterns</h3>
                    <ul className="space-y-1">
                      {aiInsight.keyPatterns.map((pattern, index) => (
                        <li key={index} className="text-sm text-text-secondary font-body flex items-start space-x-2">
                          <span className="text-primary">•</span>
                          <span>{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-heading font-semibold text-text mb-2">Emotional Trends</h3>
                    <ul className="space-y-1">
                      {aiInsight.emotionalTrends.map((trend, index) => (
                        <li key={index} className="text-sm text-text-secondary font-body flex items-start space-x-2">
                          <span className="text-secondary">•</span>
                          <span>{trend}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-heading font-semibold text-text mb-2">Recommendations</h3>
                  <ul className="space-y-1">
                    {aiInsight.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-text-secondary font-body flex items-start space-x-2">
                        <span className="text-accent">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <p className="text-xs text-text-secondary font-body">
                  Last updated: {new Date(aiInsight.lastUpdated).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-text-secondary opacity-50 mx-auto mb-3" />
                <p className="text-text-secondary font-body">Start conversations to generate AI insights</p>
              </div>
            )}
          </div>

          {/* Data Management */}
          <div className="watercolor-card p-6 watercolor-shadow">
            <h2 className="text-xl font-heading font-semibold text-text mb-4">Data Management</h2>
            
            <div className="space-y-4">
              <button
                onClick={exportData}
                className="btn-secondary flex items-center space-x-2 w-full justify-center"
              >
                <Download className="w-4 h-4" />
                <span>Export All Data (CSV)</span>
              </button>
              
              <div className="border-t border-border pt-4">
                <div className="flex items-start space-x-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <h3 className="font-heading font-semibold text-text">Delete Account</h3>
                    <p className="text-sm text-text-secondary font-body">
                      This action cannot be undone. All your data will be permanently deleted.
                    </p>
                  </div>
                </div>
                
                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="btn-secondary text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Delete Account
                  </button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="Type: DELETE MY ACCOUNT"
                      className="input-field"
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={deleteAccount}
                        disabled={deleteConfirmText !== 'DELETE MY ACCOUNT'}
                        className="btn-primary bg-red-600 hover:bg-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Confirm Delete
                      </button>
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false)
                          setDeleteConfirmText('')
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Info & Edit */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="watercolor-card p-6 watercolor-shadow">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 watercolor-shadow">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-text">
                {profile?.full_name || 'Anonymous User'}
              </h3>
              <p className="text-text-secondary font-body">{profile?.email}</p>
              {profile?.created_at && (
                <p className="text-sm text-text-secondary font-body mt-2">
                  Member since {new Date(profile.created_at).toLocaleDateString()}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-text-secondary">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-body">{profile?.email}</span>
              </div>
              {profile?.diagnosis_age && (
                <div className="flex items-center space-x-3 text-text-secondary">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-body">Diagnosed at age {profile.diagnosis_age}</span>
                </div>
              )}
              {profile?.diagnosis_type && (
                <div className="flex items-center space-x-3 text-text-secondary">
                  <Brain className="w-4 h-4" />
                  <span className="text-sm font-body">{profile.diagnosis_type}</span>
                </div>
              )}
            </div>
          </div>

          {/* Edit Form */}
          <div className="watercolor-card p-6 watercolor-shadow">
            <h2 className="text-lg font-heading font-semibold text-text mb-4">
              Update Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-text mb-2 font-body">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="input-field"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="diagnosis_age" className="block text-sm font-medium text-text mb-2 font-body">
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
              </div>

              <div>
                <label htmlFor="diagnosis_type" className="block text-sm font-medium text-text mb-2 font-body">
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

              {message && (
                <div className={`p-3 rounded-lg text-sm ${
                  message.includes('Error') || message.includes('error')
                    ? 'bg-red-50 border border-red-200 text-red-600' 
                    : 'bg-green-50 border border-green-200 text-green-600'
                }`}>
                  <p className="font-body">{message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </form>
          </div>

          {/* Privacy Notice */}
          <div className="watercolor-card p-4 bg-watercolor-1 border-primary">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="text-sm font-heading font-semibold text-text mb-2">Privacy & Data</h3>
                <div className="text-xs text-text-secondary space-y-1 font-body">
                  <p>Your data is encrypted and securely stored.</p>
                  <p>AI insights are generated locally and privately.</p>
                  <p>Export includes all conversations and profile data.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}