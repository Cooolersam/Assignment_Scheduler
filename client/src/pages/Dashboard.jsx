import { useEffect, useState } from 'react'
import axios from 'axios'
import './Dashboard.css'
import Header from '../components/Header'
import AssignmentCard from '../components/AssignmentCard'
import FilterBar from '../components/FilterBar'

export default function Dashboard({ user, onLogout, onUpdateProfile }) {
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // all, pending, submitted, upcoming
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    fetchAssignments()
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchAssignments, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchAssignments = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/classroom/assignments')
      setAssignments(response.data.assignments || [])
      setLastUpdate(new Date())
      setError(null)
    } catch (err) {
      setError('Failed to fetch assignments. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.get('/auth/logout')
      onLogout()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const getFilteredAssignments = () => {
    const now = new Date()
    
    return assignments.filter(assignment => {
      switch (filter) {
        case 'pending':
          return assignment.submissionStatus !== 'TURNED_IN'
        case 'submitted':
          return assignment.submissionStatus === 'TURNED_IN'
        case 'upcoming':
          return assignment.submissionStatus !== 'TURNED_IN' && assignment.dueDate && new Date(assignment.dueDate) > now
        default:
          return true
      }
    })
  }

  const filteredAssignments = getFilteredAssignments()

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} lastUpdate={lastUpdate} onUpdateProfile={onUpdateProfile} />
      
      <div className="dashboard-content">
        <FilterBar activeFilter={filter} onFilterChange={setFilter} />
        
        <div className="assignments-container">
          {error && <div className="error-message">{error}</div>}
          
          {loading && assignments.length === 0 ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your assignments...</p>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="empty-state">
              <p>No assignments found.</p>
            </div>
          ) : (
            <div className="assignments-list">
              {filteredAssignments.map(assignment => (
                <AssignmentCard 
                  key={assignment.id} 
                  assignment={assignment}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
