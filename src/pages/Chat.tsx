import React from 'react'
import ConversationInterface from '../components/ConversationInterface'
import { useConversation } from '../contexts/ConversationContext'
import { MessageCircle } from 'lucide-react'

export default function Chat() {
  const { currentConversation, messages } = useConversation()

  return (
    <div className="h-full flex flex-col">
      {currentConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentConversation.title}
            </h2>
            <p className="text-sm text-gray-600">
              {messages.length} messages
            </p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-4">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white rounded-br-md'
                          : 'bg-gray-100 text-gray-800 rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Start the conversation</h3>
                  <p className="text-gray-600">
                    Use the voice interface below to begin chatting with your AI companion
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Conversation Interface */}
          <ConversationInterface />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h3>
            <p className="text-gray-600">
              Select a conversation from the sidebar or create a new one to start chatting
            </p>
          </div>
        </div>
      )}
    </div>
  )
}