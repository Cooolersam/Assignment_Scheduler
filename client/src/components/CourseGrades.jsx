import './CourseGrades.css'

function letterGrade(pct) {
  if (pct >= 90) return 'A'
  if (pct >= 80) return 'B'
  if (pct >= 70) return 'C'
  if (pct >= 60) return 'D'
  return 'F'
}

function gradeColor(pct) {
  if (pct >= 90) return '#2E7D52'
  if (pct >= 80) return '#4A7C59'
  if (pct >= 70) return '#92650A'
  if (pct >= 60) return '#B06020'
  return '#B83232'
}

function GradeBar({ pct, color }) {
  return (
    <div className="cg-bar-track">
      <div className="cg-bar-fill" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
    </div>
  )
}

export default function CourseGrades({ courseGrades }) {
  const sorted = [...courseGrades]
    .filter(c => c.pct !== null)
    .sort((a, b) => b.pct - a.pct)

  if (sorted.length === 0) return null

  return (
    <div className="course-grades">
      <h2 className="cg-heading">Course Grades</h2>
      <p className="cg-disclaimer">
        Grades are calculated as total points earned / total points possible across all graded assignments.
        Google Classroom does not provide category weights — once Infinite Campus is integrated, weighted grades will be available.
      </p>
      <div className="cg-grid">
        {sorted.map(course => {
          const color = gradeColor(course.pct)
          const letter = letterGrade(course.pct)
          return (
            <div key={course.name} className="cg-card" style={course.color ? { borderLeft: `4px solid ${course.color.accent}` } : {}}>
              <div className="cg-card-top">
                <span className="cg-course-name">{course.name}</span>
                <span className="cg-letter" style={{ backgroundColor: color + '18', color }}>{letter}</span>
              </div>
              <GradeBar pct={course.pct} color={color} />
              <div className="cg-card-bottom">
                <span className="cg-pct" style={{ color }}>{course.pct.toFixed(1)}%</span>
                <span className="cg-detail">
                  {course.earned}/{course.total} pts
                  {course.pending > 0 && ` · ${course.pending} ungraded`}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
