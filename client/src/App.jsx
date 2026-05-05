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

// Route protégée — redirige vers /login si pas connecté
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
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/chat" element={<PrivateRoute><Chat /></PrivateRoute>} />
        <Route path="/summary" element={<PrivateRoute><Summary /></PrivateRoute>} />
        <Route path="/quiz" element={<PrivateRoute><Quiz /></PrivateRoute>} />
        <Route path="/orientation" element={<PrivateRoute><Orientation /></PrivateRoute>} />
      </Routes>
    </>
  )
}

export default App
