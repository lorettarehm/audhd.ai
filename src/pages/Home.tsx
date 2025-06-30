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
      <div className="mb-8 watercolor-float">
        <h1 className="text-4xl font-heading font-bold text-text mb-3">
          Welcome back! 👋
        </h1>
        <p className="text-lg text-text-secondary font-body">
          Ready to continue your journey of self-discovery and growth?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button
          onClick={handleQuickStart}
          className="watercolor-card p-6 hover:watercolor-shadow-strong transition-all text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center group-hover:bg-secondary transition-colors watercolor-shadow">
              <Plus className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-text">Start New Chat</h3>
              <p className="text-sm text-text-secondary font-body">Begin a fresh conversation</p>
            </div>
          </div>
        </button>

        <Link
          to="/analytics"
          className="watercolor-card p-6 hover:watercolor-shadow-strong transition-all text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center group-hover:bg-accent transition-colors watercolor-shadow">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-text">View Analytics</h3>
              <p className="text-sm text-text-secondary font-body">Explore your patterns</p>
            </div>
          </div>
        </Link>

        <Link
          to="/profile"
          className="watercolor-card p-6 hover:watercolor-shadow-strong transition-all text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors watercolor-shadow">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-text">Update Profile</h3>
              <p className="text-sm text-text-secondary font-body">Manage your information</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="watercolor-card p-6 text-center watercolor-pulse">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 watercolor-shadow">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-3xl font-heading font-bold text-text">{totalConversations}</h3>
          <p className="text-sm text-text-secondary font-body">Total Conversations</p>
        </div>

        <div className="watercolor-card p-6 text-center">
          <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 watercolor-shadow">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-3xl font-heading font-bold text-text">
            {conversations.filter(c => {
              const today = new Date()
              const convDate = new Date(c.created_at)
              return convDate.toDateString() === today.toDateString()
            }).length}
          </h3>
          <p className="text-sm text-text-secondary font-body">Today's Chats</p>
        </div>

        <div className="watercolor-card p-6 text-center">
          <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 watercolor-shadow">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-3xl font-heading font-bold text-text">
            {conversations.filter(c => {
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return new Date(c.created_at) >= weekAgo
            }).length}
          </h3>
          <p className="text-sm text-text-secondary font-body">This Week</p>
        </div>

        <div className="watercolor-card p-6 text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 watercolor-shadow">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-3xl font-heading font-bold text-text">
            {Math.round((conversations.filter(c => {
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return new Date(c.created_at) >= weekAgo
            }).length / 7) * 10) / 10}
          </h3>
          <p className="text-sm text-text-secondary font-body">Daily Average</p>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="watercolor-card watercolor-shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-semibold text-text">Recent Conversations</h2>
          <Link
            to="/chat"
            className="text-primary hover:text-secondary font-medium text-sm font-body transition-colors"
          >
            View all
          </Link>
        </div>

        {recentConversations.length > 0 ? (
          <div className="space-y-4">
            {recentConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="flex items-center justify-between p-4 bg-watercolor-1 rounded-xl hover:bg-watercolor-2 transition-colors border-2 border-transparent hover:border-border"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center watercolor-shadow">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text font-body">{conversation.title}</h3>
                    <p className="text-sm text-text-secondary font-body">
                      {format(new Date(conversation.updated_at), 'MMM dd, yyyy • HH:mm')}
                    </p>
                  </div>
                </div>
                <Link
                  to="/chat"
                  className="text-primary hover:text-secondary font-medium text-sm font-body transition-colors px-4 py-2 rounded-lg hover:bg-watercolor-1"
                >
                  Continue
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-watercolor-1 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-text-secondary opacity-50" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-text mb-2">No conversations yet</h3>
            <p className="text-text-secondary mb-6 font-body">Start your first conversation to begin your journey</p>
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