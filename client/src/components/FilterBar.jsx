import { useState, useRef, useEffect } from 'react'
import './FilterBar.css'

function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find(o => o.id === value)
  const isFiltered = value !== options[0]?.id

  return (
    <div className="dropdown" ref={ref}>
      <button
        className={`dropdown-btn ${isFiltered ? 'dropdown-btn-active' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className="dropdown-label">{label}:</span>
        <span className="dropdown-value">{selected?.label || 'All'}</span>
        <span className="dropdown-arrow">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="dropdown-menu">
          {options.map(o => (
            <button
              key={o.id}
              className={`dropdown-option ${value === o.id ? 'dropdown-option-active' : ''}`}
              onClick={() => { onChange(o.id); setOpen(false) }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function FilterBar({ statusFilter, onStatusChange, courseFilter, onCourseChange, dueDateSort, onDueDateSortChange, courses }) {
  const statusOptions = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'submitted', label: 'Submitted' },
    { id: 'upcoming', label: 'Upcoming' },
  ]

  const courseOptions = [
    { id: 'all', label: 'All Classes' },
    ...courses.map(c => ({ id: c, label: c })),
  ]

  const dueDateOptions = [
    { id: 'priority', label: 'Priority' },
    { id: 'due-asc', label: 'Due Date (Soonest)' },
    { id: 'due-desc', label: 'Due Date (Latest)' },
  ]

  return (
    <div className="filter-bar">
      <Dropdown label="Status" value={statusFilter} options={statusOptions} onChange={onStatusChange} />
      <Dropdown label="Class" value={courseFilter} options={courseOptions} onChange={onCourseChange} />
      <Dropdown label="Due Date" value={dueDateSort} options={dueDateOptions} onChange={onDueDateSortChange} />
    </div>
  )
}
