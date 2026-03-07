import { formatDistance, formatRelative } from 'date-fns'
import './AssignmentCard.css'

export default function AssignmentCard({ assignment }) {
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
    return formatRelative(dueDate, new Date()).replace('at ', '')
  }

  return (
    <div className="assignment-card">
      <div className="card-header">
        <h3 className="assignment-title">{assignment.title}</h3>
        <span className={`status-badge ${getStatusColor(assignment.submissionStatus)}`}>
          {getStatusLabel()}
        </span>
      </div>

      <div className="card-body">
        <div className="assignment-course">
          <span className="course-icon">📚</span>
          <span className="course-name">{assignment.courseName}</span>
        </div>

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
