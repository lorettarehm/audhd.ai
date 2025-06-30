import React, { useState, useEffect } from 'react'
import { useConversation } from '../contexts/ConversationContext'
import { supabase } from '../lib/supabase'
import { BarChart3, MessageCircle, Clock, TrendingUp, Calendar, Brain } from 'lucide-react'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'

interface AnalyticsData {
  totalConversations: number
  totalMessages: number
  averageMessagesPerConversation: number
  conversationsThisWeek: number
  conversationsThisMonth: number
  dailyActivity: { date: string; count: number }[]
  topicDistribution: { topic: string; count: number }[]
  emotionalTrends: { emotion: string; count: number }[]
}

export default function Analytics() {
  const { conversations } = useConversation()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month')

  useEffect(() => {
    loadAnalytics()
  }, [conversations, timeRange])

  const loadAnalytics = async () => {
    setLoading(true)
    try {
      // Get messages count
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('id, conversation_id, timestamp, content, emotion_analysis')

      if (messagesError) throw messagesError

      // Calculate analytics
      const totalConversations = conversations.length
      const totalMessages = messages?.length || 0
      const averageMessagesPerConversation = totalConversations > 0 
        ? Math.round(totalMessages / totalConversations) 
        : 0

      // Time-based filtering
      const now = new Date()
      const weekAgo = subDays(now, 7)
      const monthAgo = subDays(now, 30)

      const conversationsThisWeek = conversations.filter(c => 
        new Date(c.created_at) >= weekAgo
      ).length

      const conversationsThisMonth = conversations.filter(c => 
        new Date(c.created_at) >= monthAgo
      ).length

      // Daily activity for the selected time range
      const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90
      const dailyActivity = Array.from({ length: days }, (_, i) => {
        const date = subDays(now, days - 1 - i)
        const dayStart = startOfDay(date)
        const dayEnd = endOfDay(date)
        
        const count = conversations.filter(c => {
          const convDate = new Date(c.created_at)
          return convDate >= dayStart && convDate <= dayEnd
        }).length

        return {
          date: format(date, 'MMM dd'),
          count
        }
      })

      // Simple topic analysis based on conversation titles
      const topicDistribution = conversations.reduce((acc, conv) => {
        const title = conv.title.toLowerCase()
        let topic = 'General'
        
        if (title.includes('work') || title.includes('job')) topic = 'Work'
        else if (title.includes('relationship') || title.includes('social')) topic = 'Relationships'
        else if (title.includes('anxiety') || title.includes('stress')) topic = 'Mental Health'
        else if (title.includes('goal') || title.includes('plan')) topic = 'Goals'
        else if (title.includes('daily') || title.includes('routine')) topic = 'Daily Life'

        const existing = acc.find(item => item.topic === topic)
        if (existing) {
          existing.count++
        } else {
          acc.push({ topic, count: 1 })
        }
        return acc
      }, [] as { topic: string; count: number }[])

      // Mock emotional trends (would be real with emotion analysis)
      const emotionalTrends = [
        { emotion: 'Positive', count: Math.floor(totalMessages * 0.4) },
        { emotion: 'Neutral', count: Math.floor(totalMessages * 0.35) },
        { emotion: 'Reflective', count: Math.floor(totalMessages * 0.15) },
        { emotion: 'Concerned', count: Math.floor(totalMessages * 0.1) },
      ]

      setAnalytics({
        totalConversations,
        totalMessages,
        averageMessagesPerConversation,
        conversationsThisWeek,
        conversationsThisMonth,
        dailyActivity,
        topicDistribution,
        emotionalTrends,
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Unable to load analytics data</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
            <p className="text-gray-600">
              Insights into your conversation patterns and emotional journey
            </p>
          </div>
          
          <div className="flex space-x-2">
            {(['week', 'month', 'all'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range === 'all' ? 'All Time' : `This ${range}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{analytics.totalConversations}</h3>
          <p className="text-sm text-gray-600">Total Conversations</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-secondary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{analytics.totalMessages}</h3>
          <p className="text-sm text-gray-600">Total Messages</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-accent-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{analytics.averageMessagesPerConversation}</h3>
          <p className="text-sm text-gray-600">Avg Messages/Chat</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{analytics.conversationsThisWeek}</h3>
          <p className="text-sm text-gray-600">This Week</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Activity Chart */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Daily Activity</h2>
          <div className="space-y-3">
            {analytics.dailyActivity.map((day, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 w-16">{day.date}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max((day.count / Math.max(...analytics.dailyActivity.map(d => d.count))) * 100, 5)}%`
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">{day.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Distribution */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Conversation Topics</h2>
          <div className="space-y-4">
            {analytics.topicDistribution.map((topic, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500" />
                  <span className="text-sm font-medium text-gray-900">{topic.topic}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                      style={{
                        width: `${(topic.count / Math.max(...analytics.topicDistribution.map(t => t.count))) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{topic.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emotional Trends */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Emotional Patterns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analytics.emotionalTrends.map((emotion, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{emotion.emotion}</h3>
              <p className="text-2xl font-bold text-primary-600">{emotion.count}</p>
              <p className="text-sm text-gray-600">messages</p>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="card mt-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Insights & Recommendations</h2>
        <div className="space-y-3 text-gray-700">
          <p>
            📈 You've been most active with <strong>{analytics.conversationsThisWeek}</strong> conversations this week.
          </p>
          <p>
            💬 Your conversations average <strong>{analytics.averageMessagesPerConversation}</strong> messages, 
            showing good engagement depth.
          </p>
          <p>
            🎯 Your most discussed topic is <strong>{analytics.topicDistribution[0]?.topic || 'General'}</strong>, 
            which might be worth exploring further.
          </p>
          <p>
            🌟 Consider setting aside regular time for reflection to maintain your conversation momentum.
          </p>
        </div>
      </div>
    </div>
  )
}