import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import MainLayout from './components/MainLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Summary from './pages/Summary'
import Quiz from './pages/Quiz'
import Orientation from './pages/Orientation'
import Flashcards from './pages/Flashcards'
import Exam from './pages/Exam'
import Profile from './pages/Profile'

// Wraps AI tool pages: authenticated → full access, unauthenticated → guest mode
function SmartRoute({ children, requireAuth = false }) {
  const { user, guestMode, enterGuestMode, loading } = useAuth()

  // Enter guest mode in an effect, not during render
  useEffect(() => {
    if (!loading && !user && !requireAuth && !guestMode) {
      enterGuestMode()
    }
  }, [loading, user, requireAuth, guestMode, enterGuestMode])

  if (loading) return null
  if (user) return children
  if (requireAuth) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Root → redirect to chat (the main experience) */}
        <Route path="/" element={<Navigate to="/chat" replace />} />

        {/* Auth pages */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected pages (no sidebar) */}
        <Route path="/dashboard" element={<SmartRoute requireAuth><Dashboard /></SmartRoute>} />
        <Route path="/profile"   element={<SmartRoute requireAuth><Profile /></SmartRoute>} />

        {/* AI tool pages — shared sidebar layout */}
        <Route element={<MainLayout />}>
          <Route path="/chat"        element={<SmartRoute><Chat /></SmartRoute>} />
          <Route path="/summary"     element={<SmartRoute><Summary /></SmartRoute>} />
          <Route path="/quiz"        element={<SmartRoute><Quiz /></SmartRoute>} />
          <Route path="/orientation" element={<SmartRoute><Orientation /></SmartRoute>} />
          <Route path="/flashcards"  element={<SmartRoute><Flashcards /></SmartRoute>} />
          <Route path="/exam"        element={<SmartRoute><Exam /></SmartRoute>} />
        </Route>
      </Routes>
    </>
  )
}

export default App
