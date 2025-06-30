import { useState, useRef } from 'react'
import { useConversation } from '../contexts/ConversationContext'
import { Mic, MicOff, Volume2, VolumeX, MessageCircle } from 'lucide-react'

interface ConversationInterfaceProps {
  agentId?: string
}

export default function ConversationInterface({ agentId: _agentId }: ConversationInterfaceProps) {
  const { addMessage, currentConversation } = useConversation()
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const _conversationRef = useRef<any>(null)

  const _handleMessage = async (message: string, role: 'user' | 'assistant') => {
    if (currentConversation) {
      await addMessage(message, role)
    }
  }

  const handleStartRecording = () => {
    setIsRecording(true)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  if (!currentConversation) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversation selected</h3>
          <p className="text-gray-600">Start a new conversation to begin chatting with your AI companion</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentConversation.title}
            </h2>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`p-4 rounded-full transition-colors ${
                  isRecording
                    ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse-soft'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                }`}
              >
                {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>
              
              <button
                onClick={toggleMute}
                className={`p-3 rounded-full transition-colors ${
                  isMuted
                    ? 'bg-gray-500 hover:bg-gray-600 text-white'
                    : 'bg-secondary-500 hover:bg-secondary-600 text-white'
                }`}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-center text-sm text-gray-600 mb-4">
              {isRecording ? 'Listening...' : 'Click the microphone to start talking'}
            </div>

            {/* ElevenLabs Conversation Component would go here */}
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600">
              <p>ElevenLabs Conversation Interface</p>
              <p className="text-sm mt-2">
                This will be replaced with the actual ElevenLabs React component
                once the Supabase connection is established.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}