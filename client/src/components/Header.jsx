import './Header.css'
import { formatDistanceToNow } from 'date-fns'

export default function Header({ user, onLogout, lastUpdate }) {
  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">AS</div>
        <h1>Assignment Scheduler</h1>
      </div>

      <div className="header-center">
        {lastUpdate && (
          <div className="last-update">
            Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
          </div>
        )}
      </div>

      <div className="header-right">
        <div className="user-info">
          {user.photo && <img src={user.photo} alt={user.displayName} className="user-avatar" />}
          <div className="user-details">
            <p className="user-name">{user.displayName}</p>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </header>
  )
}
