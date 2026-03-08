import { useEffect, useState } from 'react'
import axios from 'axios'
import './Dashboard.css'
import Header from '../components/Header'
import AssignmentCard from '../components/AssignmentCard'
import FilterBar from '../components/FilterBar'
import CourseGrades from '../components/CourseGrades'

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
  const [statusFilter, setStatusFilter] = useState('all')
  const [courseFilter, setCourseFilter] = useState('all')
  const [dueDateSort, setDueDateSort] = useState('priority')
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    fetchAssignments()
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

  const calculatePriority = (assignment) => {
    const today = new Date()
    const daysUntilDue = assignment.dueDate
      ? Math.floor((new Date(assignment.dueDate) - today) / (1000 * 60 * 60 * 24))
      : 999
    const classGrade = assignment.assignedGrade && assignment.points
      ? (assignment.assignedGrade / assignment.points) * 100
      : 100
    const pointValue = assignment.points || 0
    return (100 - classGrade) * 10000 + (-daysUntilDue) * 100 + pointValue
  }

  const sortFn = (a, b) => {
    if (dueDateSort === 'due-asc') {
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
      return aTime - bTime
    }
    if (dueDateSort === 'due-desc') {
      const aTime = a.dueDate ? new Date(a.dueDate).getTime() : -Infinity
      const bTime = b.dueDate ? new Date(b.dueDate).getTime() : -Infinity
      return bTime - aTime
    }
    return calculatePriority(b) - calculatePriority(a)
  }

  const getFilteredAssignments = () => {
    const now = new Date()

    return assignments
      .filter(assignment => {
        // Status filter
        switch (statusFilter) {
          case 'pending':
            if (assignment.submissionStatus === 'TURNED_IN') return false
            break
          case 'submitted':
            if (assignment.submissionStatus !== 'TURNED_IN') return false
            break
          case 'upcoming':
            if (assignment.submissionStatus === 'TURNED_IN') return false
            if (!assignment.dueDate || new Date(assignment.dueDate) <= now) return false
            break
        }
        // Course filter
        if (courseFilter !== 'all' && assignment.courseName !== courseFilter) return false
        return true
      })
      .sort(sortFn)
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

  // Group by course instead of due date when course sort isn't "all" but we always group by due date
  const filteredAssignments = getFilteredAssignments()
  const grouped = groupAssignments(filteredAssignments)
  const totalCount = filteredAssignments.length

  // Build course list, color map, and grade summaries
  const courseSet = new Set()
  const courseColors = {}
  const courseGradeMap = {}
  for (const a of assignments) {
    if (a.courseName) {
      courseSet.add(a.courseName)
      if (!courseColors[a.courseName]) {
        courseColors[a.courseName] = getCourseColor(a.courseName)
      }
      if (!courseGradeMap[a.courseName]) {
        courseGradeMap[a.courseName] = { earned: 0, total: 0, graded: 0, pending: 0 }
      }
      if (a.assignedGrade != null && a.points) {
        courseGradeMap[a.courseName].earned += a.assignedGrade
        courseGradeMap[a.courseName].total += a.points
        courseGradeMap[a.courseName].graded += 1
      } else {
        courseGradeMap[a.courseName].pending += 1
      }
    }
  }
  const courses = [...courseSet].sort()
  const courseGrades = courses.map(name => {
    const d = courseGradeMap[name]
    return {
      name,
      pct: d.total > 0 ? (d.earned / d.total) * 100 : null,
      earned: d.earned,
      total: d.total,
      graded: d.graded,
      pending: d.pending,
      color: courseColors[name],
    }
  })

  return (
    <div className="dashboard">
      <Header user={user} onLogout={handleLogout} lastUpdate={lastUpdate} onUpdateProfile={onUpdateProfile} />

      <div className="dashboard-content">
        <FilterBar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          courseFilter={courseFilter}
          onCourseChange={setCourseFilter}
          dueDateSort={dueDateSort}
          onDueDateSortChange={setDueDateSort}
          courses={courses}
        />

        {courseGrades.some(c => c.pct !== null) && (
          <CourseGrades courseGrades={courseGrades} />
        )}

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
