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
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">knowMe</h2>
            <p className="text-xs text-gray-600">AI Companion</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex-1 px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Conversations</h3>
          <button
            onClick={handleNewConversation}
            className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 custom-scrollbar overflow-y-auto max-h-96">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => selectConversation(conversation.id)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors truncate"
            >
              {conversation.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}