import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase, Database } from '../lib/supabase'
import { useAuth } from './AuthContext'

type Conversation = Database['public']['Tables']['conversations']['Row']
type Message = Database['public']['Tables']['messages']['Row']

interface ConversationContextType {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Message[]
  loading: boolean
  createConversation: (title: string) => Promise<Conversation>
  selectConversation: (conversationId: string) => Promise<void>
  addMessage: (content: string, role: 'user' | 'assistant', audioUrl?: string) => Promise<void>
  deleteConversation: (conversationId: string) => Promise<void>
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export function useConversation() {
  const context = useContext(ConversationContext)
  if (context === undefined) {
    throw new Error('useConversation must be used within a ConversationProvider')
  }
  return context
}

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      loadConversations()
    }
  }, [user])

  const loadConversations = async () => {
    if (!user) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setConversations(data || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const createConversation = async (title: string): Promise<Conversation> => {
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: user.id,
        title,
      })
      .select()
      .single()

    if (error) throw error

    const newConversation = data as Conversation
    setConversations(prev => [newConversation, ...prev])
    return newConversation
  }

  const selectConversation = async (conversationId: string) => {
    setLoading(true)
    try {
      // Load conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single()

      if (convError) throw convError

      // Load messages
      const { data: messagesData, error: msgError } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true })

      if (msgError) throw msgError

      setCurrentConversation(conversation)
      setMessages(messagesData || [])
    } catch (error) {
      console.error('Error selecting conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  const addMessage = async (content: string, role: 'user' | 'assistant', audioUrl?: string) => {
    if (!currentConversation) throw new Error('No conversation selected')

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversation.id,
        content,
        role,
        audio_url: audioUrl,
      })
      .select()
      .single()

    if (error) throw error

    const newMessage = data as Message
    setMessages(prev => [...prev, newMessage])

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', currentConversation.id)
  }

  const deleteConversation = async (conversationId: string) => {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)

    if (error) throw error

    setConversations(prev => prev.filter(conv => conv.id !== conversationId))
    if (currentConversation?.id === conversationId) {
      setCurrentConversation(null)
      setMessages([])
    }
  }

  const value = {
    conversations,
    currentConversation,
    messages,
    loading,
    createConversation,
    selectConversation,
    addMessage,
    deleteConversation,
  }

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}