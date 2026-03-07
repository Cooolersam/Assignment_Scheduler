import { useState, useRef } from 'react'
import './Header.css'
import { formatDistanceToNow } from 'date-fns'

function Avatar({ user, size = 32 }) {
  const [imgFailed, setImgFailed] = useState(false)
  const initials = (user.displayName || user.email || '?')
    .split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  if (user.photo && !imgFailed) {
    return (
      <img
        src={user.photo}
        alt={user.displayName}
        className="user-avatar"
        referrerPolicy="no-referrer"
        style={{ width: size, height: size }}
        onError={() => setImgFailed(true)}
      />
    )
  }
  return (
    <div className="user-avatar avatar-initials" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </div>
  )
}

function ProfileModal({ user, onUpdateProfile, onClose }) {
  const [name, setName] = useState(user.displayName || '')
  const [photoUrl, setPhotoUrl] = useState(user.photo || '')
  const [photoPreview, setPhotoPreview] = useState(user.photo || '')
  const fileInputRef = useRef()

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPhotoPreview(ev.target.result)
      setPhotoUrl(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = () => {
    onUpdateProfile({ displayName: name, photo: photoUrl })
    onClose()
  }

  const previewInitials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Profile</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="avatar-edit-area">
            {photoPreview
              ? <img src={photoPreview} alt="preview" className="avatar-preview" referrerPolicy="no-referrer" onError={() => setPhotoPreview('')} />
              : <div className="avatar-preview avatar-initials-lg">{previewInitials}</div>
            }
            <div className="avatar-edit-actions">
              <button className="btn-secondary" onClick={() => fileInputRef.current.click()}>Upload photo</button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
              <button className="btn-ghost" onClick={() => { setPhotoPreview(''); setPhotoUrl('') }}>Remove</button>
            </div>
          </div>

          <div className="form-group">
            <label>Display name</label>
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave}>Save changes</button>
        </div>
      </div>
    </div>
  )
}

export default function Header({ user, onLogout, lastUpdate, onUpdateProfile }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <header className="header">
        <div className="header-left">
          <div className="logo-wrap">
            <img src="/Thoth.png" alt="Thoth" className="logo-img" />
          </div>
          <h1>Thoth</h1>
        </div>

        <div className="header-center">
          {lastUpdate && (
            <div className="last-update">
              Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
            </div>
          )}
        </div>

        <div className="header-right">
          <button className="user-info-btn" onClick={() => setShowModal(true)}>
            <Avatar user={user} size={32} />
            <div className="user-details">
              <p className="user-name">{user.displayName}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </button>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </header>

      {showModal && (
        <ProfileModal
          user={user}
          onUpdateProfile={onUpdateProfile}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
