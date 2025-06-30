import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, MessageCircle, User, BarChart3, Plus } from 'lucide-react'
import { useConversation } from '../contexts/ConversationContext'

export default function Sidebar() {
  const { conversations, createConversation, selectConversation } = useConversation()

  const handleNewConversation = async () => {
    try {
      const conversation = await createConversation(`Chat ${new Date().toLocaleDateString()}`)
      await selectConversation(conversation.id)
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/profile', icon: User, label: 'Profile' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  ]

  return (
    <div className="w-64 bg-surface border-r-2 border-border flex flex-col watercolor-shadow">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8 watercolor-pulse">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center watercolor-shadow">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-text">knowMe</h2>
            <p className="text-xs text-text-secondary font-accent">AI Companion</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? 'bg-watercolor-1 text-primary border-2 border-primary watercolor-shadow'
                    : 'text-text-secondary hover:text-text hover:bg-watercolor-1 border-2 border-transparent'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-body">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1 px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-heading font-semibold text-text">Conversations</h3>
          <button
            onClick={handleNewConversation}
            className="p-2 text-text-secondary hover:text-text transition-colors rounded-lg hover:bg-watercolor-1 watercolor-shadow"
            title="New Conversation"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 custom-scrollbar overflow-y-auto max-h-96">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => selectConversation(conversation.id)}
              className="w-full text-left px-3 py-3 text-sm text-text hover:bg-watercolor-1 rounded-lg transition-all truncate border-2 border-transparent hover:border-border watercolor-card"
            >
              <span className="font-body">{conversation.title}</span>
            </button>
          ))}
          
          {conversations.length === 0 && (
            <div className="text-center py-8 text-text-secondary">
              <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-body">No conversations yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}