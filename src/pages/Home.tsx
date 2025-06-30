import React from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, BarChart3, User, Plus, Calendar, Clock, TrendingUp } from 'lucide-react'
import { useConversation } from '../contexts/ConversationContext'
import { useAuth } from '../contexts/AuthContext'
import { format } from 'date-fns'

export default function Home() {
  const { user } = useAuth()
  const { conversations, createConversation } = useConversation()

  const handleQuickStart = async () => {
    try {
      const conversation = await createConversation(`Quick Chat ${format(new Date(), 'MMM dd, HH:mm')}`)
      // Navigate to chat would happen here
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  const recentConversations = conversations.slice(0, 3)
  const totalConversations = conversations.length

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-lg text-gray-600">
          Ready to continue your journey of self-discovery and growth?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={handleQuickStart}
          className="card hover:shadow-xl transition-shadow duration-200 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <Plus className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Start New Chat</h3>
              <p className="text-sm text-gray-600">Begin a fresh conversation</p>
            </div>
          </div>
        </button>

        <Link
          to="/analytics"
          className="card hover:shadow-xl transition-shadow duration-200 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center group-hover:bg-secondary-200 transition-colors">
              <BarChart3 className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-600">Explore your patterns</p>
            </div>
          </div>
        </Link>

        <Link
          to="/profile"
          className="card hover:shadow-xl transition-shadow duration-200 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center group-hover:bg-accent-200 transition-colors">
              <User className="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Update Profile</h3>
              <p className="text-sm text-gray-600">Manage your information</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-primary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalConversations}</h3>
          <p className="text-sm text-gray-600">Total Conversations</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6 text-secondary-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {conversations.filter(c => {
              const today = new Date()
              const convDate = new Date(c.created_at)
              return convDate.toDateString() === today.toDateString()
            }).length}
          </h3>
          <p className="text-sm text-gray-600">Today's Chats</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-accent-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {conversations.filter(c => {
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return new Date(c.created_at) >= weekAgo
            }).length}
          </h3>
          <p className="text-sm text-gray-600">This Week</p>
        </div>

        <div className="card text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            {Math.round((conversations.filter(c => {
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return new Date(c.created_at) >= weekAgo
            }).length / 7) * 10) / 10}
          </h3>
          <p className="text-sm text-gray-600">Daily Average</p>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Conversations</h2>
          <Link
            to="/chat"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            View all
          </Link>
        </div>

        {recentConversations.length > 0 ? (
          <div className="space-y-4">
            {recentConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{conversation.title}</h3>
                    <p className="text-sm text-gray-600">
                      {format(new Date(conversation.updated_at), 'MMM dd, yyyy • HH:mm')}
                    </p>
                  </div>
                </div>
                <Link
                  to="/chat"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  Continue
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
            <p className="text-gray-600 mb-4">Start your first conversation to begin your journey</p>
            <button
              onClick={handleQuickStart}
              className="btn-primary"
            >
              Start First Chat
            </button>
          </div>
        )}
      </div>
    </div>
  )
}