import { formatDistance, formatRelative } from 'date-fns'
import './AssignmentCard.css'

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
            <div className="meta-item">
              <span className="meta-label">Grade</span>
              <span className="meta-value grade">
                {assignment.assignedGrade != null ? assignment.assignedGrade : '—'} / {assignment.points}
              </span>
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
