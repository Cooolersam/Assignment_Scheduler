import { useEffect, useState } from 'react'
import axios from 'axios'
import './Dashboard.css'
import Header from '../components/Header'
import AssignmentCard from '../components/AssignmentCard'
import FilterBar from '../components/FilterBar'

const stringToHue = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

const getCourseColor = (courseName) => {
  if (!courseName) return null
  const h = stringToHue(courseName)
  return {
    bg: `hsl(${h}, 40%, 96%)`,
    border: `hsl(${h}, 35%, 84%)`,
    accent: `hsl(${h}, 55%, 50%)`,
    pill: `hsl(${h}, 50%, 88%)`,
    pillText: `hsl(${h}, 55%, 28%)`,
  }
}

const GROUP_ORDER = ['overdue', 'today', 'tomorrow', 'thisWeek', 'nextMonth', 'later', 'noDate', 'submitted']
const GROUP_LABELS = {
  overdue: 'Overdue',
  today: 'Due Today',
  tomorrow: 'Due Tomorrow',
  thisWeek: 'Due This Week',
  nextMonth: 'Due Next Month',
  later: 'Later',
  noDate: 'No Due Date',
  submitted: 'Submitted',
}

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

  // Ported from Pair.java — priority determines sort order (higher = more urgent)
  // Formula: (100 - classGrade) * 10000 + (-daysUntilDue) * 100 + pointValue
  const calculatePriority = (assignment) => {
    const today = new Date()

    // Days until due — negative means overdue (higher urgency)
    const daysUntilDue = assignment.dueDate
      ? Math.floor((new Date(assignment.dueDate) - today) / (1000 * 60 * 60 * 24))
      : 999

    // Class grade as percentage — lower grade = higher priority
    const classGrade = assignment.assignedGrade && assignment.points
      ? (assignment.assignedGrade / assignment.points) * 100
      : 100

    const pointValue = assignment.points || 0

    return (100 - classGrade) * 10000 + (-daysUntilDue) * 100 + pointValue
  }

  const getFilteredAssignments = () => {
    const now = new Date()

    return assignments
      .filter(assignment => {
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
      .sort((a, b) => calculatePriority(b) - calculatePriority(a))
  }

  const groupAssignments = (list) => {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const tomorrowStart = new Date(todayStart); tomorrowStart.setDate(todayStart.getDate() + 1)
    const dayAfterTomorrow = new Date(todayStart); dayAfterTomorrow.setDate(todayStart.getDate() + 2)
    const weekEnd = new Date(todayStart); weekEnd.setDate(todayStart.getDate() + 7)
    const monthEnd = new Date(todayStart); monthEnd.setDate(todayStart.getDate() + 30)

    const groups = { overdue: [], today: [], tomorrow: [], thisWeek: [], nextMonth: [], later: [], noDate: [], submitted: [] }

    for (const a of list) {
      if (a.submissionStatus === 'TURNED_IN') { groups.submitted.push(a); continue }
      if (!a.dueDate) { groups.noDate.push(a); continue }

      const due = new Date(a.dueDate)
      const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate())

      if (dueDay < todayStart) groups.overdue.push(a)
      else if (dueDay.getTime() === todayStart.getTime()) groups.today.push(a)
      else if (dueDay.getTime() === tomorrowStart.getTime()) groups.tomorrow.push(a)
      else if (due < weekEnd) groups.thisWeek.push(a)
      else if (due < monthEnd) groups.nextMonth.push(a)
      else groups.later.push(a)
    }

    return groups
  }

  const filteredAssignments = getFilteredAssignments()
  const grouped = groupAssignments(filteredAssignments)
  const totalCount = filteredAssignments.length

  // Build course color map
  const courseColors = {}
  for (const a of assignments) {
    if (a.courseName && !courseColors[a.courseName]) {
      courseColors[a.courseName] = getCourseColor(a.courseName)
    }
  }

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
          ) : totalCount === 0 ? (
            <div className="empty-state">
              <p>No assignments found.</p>
            </div>
          ) : (
            GROUP_ORDER.map(key => {
              const group = grouped[key]
              if (!group || group.length === 0) return null
              return (
                <div key={key} className="assignment-group">
                  <h2 className={`group-heading group-heading-${key}`}>{GROUP_LABELS[key]}</h2>
                  <div className="assignments-list">
                    {group.map(assignment => (
                      <AssignmentCard
                        key={assignment.id}
                        assignment={assignment}
                        courseColor={courseColors[assignment.courseName] || null}
                      />
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
