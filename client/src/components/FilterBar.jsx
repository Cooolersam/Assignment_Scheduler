import './FilterBar.css'

export default function FilterBar({ activeFilter, onFilterChange }) {
  const filters = [
    { id: 'all', label: 'All Assignments' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'pending', label: 'Pending' },
    { id: 'submitted', label: 'Submitted' }
  ]

  return (
    <div className="filter-bar">
      {filters.map(f => (
        <button
          key={f.id}
          className={`filter-btn ${activeFilter === f.id ? 'active' : ''}`}
          onClick={() => onFilterChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}
