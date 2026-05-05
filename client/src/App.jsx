import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
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

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/chat"        element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/summary"     element={<PrivateRoute><Summary /></PrivateRoute>} />
        <Route path="/quiz"        element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/orientation" element={<PrivateRoute><Orientation /></PrivateRoute>} />
        <Route path="/flashcards"  element={<PrivateRoute><Flashcards /></PrivateRoute>} />
        <Route path="/exam"        element={<PrivateRoute><Exam /></PrivateRoute>} />
        <Route path="/profile"     element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </>
  )
}

export default App
