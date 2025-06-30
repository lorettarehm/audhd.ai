import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ConversationProvider } from './contexts/ConversationContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Profile from './pages/Profile'
import Analytics from './pages/Analytics'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <ConversationProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          </Route>
        </Routes>
      </ConversationProvider>
    </AuthProvider>
  )
}

export default App