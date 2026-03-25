import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setDropOpen(false)
  }

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/explore', label: 'Explore' },
        { to: '/practice', label: 'Practice' },
        { to: '/leaderboard', label: 'Leaderboard' },
        { to: '/discuss', label: 'Discuss' },
      ]
    : [
        { to: '/explore', label: 'Explore' },
        { to: '/leaderboard', label: 'Leaderboard' },
        { to: '/discuss', label: 'Discuss' },
        { to: '/about', label: 'About' },
      ]

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <div className="navbar-logo-icon">A</div>
        <span className="navbar-logo-text">AlgoVault</span>
      </Link>

      <ul className="navbar-links">
        {navLinks.map(l => (
          <li key={l.to}>
            <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''}>
              {l.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggle} title="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDropOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
                background: 'var(--primary-blue-light)', border: '1px solid var(--primary-blue)',
                borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'var(--transition)',
                color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.875rem'
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: 'var(--gradient-blue)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700
              }}>
                {user.name?.[0]?.toUpperCase()}
              </div>
              {user.username}
              <span style={{ fontSize: '0.7rem' }}>▾</span>
            </button>

            {dropOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '110%', minWidth: 180,
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)', zIndex: 100,
                padding: '6px', animation: 'fadeInUp 0.15s ease'
              }}>
                <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-color)', marginBottom: 6 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{user.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                  <div style={{ marginTop: 4 }}>
                    <span style={{ background: 'var(--accent-gold-light)', color: 'var(--accent-gold)', padding: '2px 8px', borderRadius: 10, fontSize: '0.72rem', fontWeight: 600 }}>
                      ⚡ {user.xp} XP
                    </span>
                  </div>
                </div>
                {[
                  { to: '/dashboard', label: '🏠 Dashboard' },
                  { to: '/about', label: 'ℹ️ About' },
                ].map(item => (
                  <Link key={item.to} to={item.to} onClick={() => setDropOpen(false)}
                    style={{
                      display: 'block', padding: '8px 14px', borderRadius: 8, fontSize: '0.875rem',
                      color: 'var(--text-secondary)', transition: 'var(--transition)'
                    }}
                    onMouseEnter={e => e.target.style.background = 'var(--bg-tertiary)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    {item.label}
                  </Link>
                ))}
                <button onClick={handleLogout}
                  style={{
                    display: 'block', width: '100%', padding: '8px 14px', borderRadius: 8,
                    fontSize: '0.875rem', color: 'var(--hard)', background: 'transparent',
                    border: 'none', cursor: 'pointer', textAlign: 'left', marginTop: 4,
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={e => e.target.style.background = 'var(--hard-bg-cur)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-gold btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  )
}
