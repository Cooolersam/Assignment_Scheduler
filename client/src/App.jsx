import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await axios.get('/auth/user')
      setUser(response.data)
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="app-container loading">Loading...</div>
  }

  return (
    <div className="app-container">
      {user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <LoginPage />}
    </div>
  )
}

export default App
