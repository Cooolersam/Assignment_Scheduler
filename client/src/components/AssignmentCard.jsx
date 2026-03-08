import { formatDistance, formatRelative } from 'date-fns'
import './AssignmentCard.css'

function gradeColor(pct) {
  if (pct >= 90) return { color: '#2E7D52', bg: '#E8F5EE' }
  if (pct >= 80) return { color: '#4A7C59', bg: '#EDF5E8' }
  if (pct >= 70) return { color: '#92650A', bg: '#FDF6E3' }
  if (pct >= 60) return { color: '#B06020', bg: '#FEF0E0' }
  return { color: '#B83232', bg: '#FCEAEA' }
}

function letterGrade(pct) {
  if (pct >= 90) return 'A'
  if (pct >= 80) return 'B'
  if (pct >= 70) return 'C'
  if (pct >= 60) return 'D'
  return 'F'
}

export default function AssignmentCard({ assignment, courseColor }) {
  const getStatusColor = (status) => {
    if (status === 'TURNED_IN') return 'status-submitted'
    if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) return 'status-overdue'
    return 'status-pending'
  }

  const getStatusLabel = () => {
    if (assignment.submissionStatus === 'TURNED_IN') return '✓ Submitted'
    if (assignment.dueDate && new Date(assignment.dueDate) < new Date()) return '! Overdue'
    return '○ Pending'
  }

  const formatDueDate = () => {
    if (!assignment.dueDate) return 'No due date'
    const dueDate = new Date(assignment.dueDate)
    const formatted = formatRelative(dueDate, new Date()).replace('at ', '')
    return formatted.charAt(0).toUpperCase() + formatted.slice(1)
  }

  const cardStyle = courseColor ? {
    backgroundColor: courseColor.bg,
    borderColor: courseColor.border,
    borderLeft: `4px solid ${courseColor.accent}`,
  } : {}

  const pillStyle = courseColor ? {
    backgroundColor: courseColor.pill,
    color: courseColor.pillText,
  } : {}

  const hasGrade = assignment.assignedGrade != null && assignment.points
  const pct = hasGrade ? (assignment.assignedGrade / assignment.points) * 100 : null
  const gc = hasGrade ? gradeColor(pct) : null

  return (
    <div className="assignment-card" style={cardStyle}>
      <div className="card-header">
        <div className="header-main">
          {assignment.courseName && (
            <span className="course-pill" style={pillStyle}>
              {assignment.courseName}
            </span>
          )}
          <h3 className="assignment-title">{assignment.title}</h3>
        </div>
        <span className={`status-badge ${getStatusColor(assignment.submissionStatus)}`}>
          {getStatusLabel()}
        </span>
      </div>

      <div className="card-body">
        {assignment.description && (
          <p className="assignment-description">{assignment.description}</p>
        )}

        <div className="assignment-meta">
          <div className="meta-item">
            <span className="meta-label">Due</span>
            <span className="meta-value">{formatDueDate()}</span>
          </div>

          {assignment.points != null && (
            <div className="meta-item" style={hasGrade ? { borderColor: gc.color + '30' } : {}}>
              <span className="meta-label">Grade</span>
              {hasGrade ? (
                <span className="grade-display">
                  <span className="grade-letter" style={{ backgroundColor: gc.bg, color: gc.color }}>
                    {letterGrade(pct)}
                  </span>
                  <span className="grade-score" style={{ color: gc.color }}>
                    {assignment.assignedGrade}/{assignment.points}
                  </span>
                  <span className="grade-pct" style={{ color: gc.color }}>
                    {pct.toFixed(0)}%
                  </span>
                </span>
              ) : (
                <span className="meta-value grade-ungraded">— / {assignment.points}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {assignment.submittedTime && (
        <div className="card-footer">
          <span className="submitted-info">
            Submitted {formatDistance(new Date(assignment.submittedTime), new Date(), { addSuffix: true })}
          </span>
        </div>
      )}
    </div>
  )
}
