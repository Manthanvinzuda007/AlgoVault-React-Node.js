import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const FLAG_MAP = { IN: '🇮🇳', US: '🇺🇸', ES: '🇪🇸', UK: '🇬🇧', DE: '🇩🇪' }

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('global')

  useEffect(() => {
    const url = activeTab === 'weekly' ? '/leaderboard/weekly' : '/leaderboard'
    setLoading(true)
    api.get(url).then(r => { setData(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [activeTab])

  const top3 = data.slice(0, 3)
  const rest = data.slice(3)

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'
  const colors = ['#436b95', '#caa855', '#4caf50', '#f44336', '#9c27b0', '#00bcd4']

  return (
    <div className="page-wrapper page-enter">
      <Navbar />
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 className="section-title">🏆 <span className="gold-underline">Leaderboard</span></h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 10 }}>The most dedicated solvers in the AlgoVault community.</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
          {['global', 'weekly'].map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`btn ${activeTab === t ? 'btn-primary' : 'btn-ghost'}`}>
              {t === 'global' ? '🌐 Global' : '📅 Weekly'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner spinner-dark" style={{ width: 36, height: 36 }} /></div>
        ) : (
          <>
            {/* ─── Podium ─── */}
            {top3.length >= 3 && (
              <div className="podium">
                {/* 2nd */}
                <div className="podium-item podium-2">
                  <div className="podium-avatar" style={{ background: colors[1] }}>{initials(top3[1]?.name)}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>@{top3[1]?.username}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⚡ {top3[1]?.xp} XP</div>
                  <div className="podium-block">2</div>
                </div>
                {/* 1st */}
                <div className="podium-item podium-1">
                  <div style={{ fontSize: '1.4rem', marginBottom: 4 }}>👑</div>
                  <div className="podium-avatar" style={{ background: colors[0], border: '3px solid var(--accent-gold)' }}>{initials(top3[0]?.name)}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>@{top3[0]?.username}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-gold)', fontWeight: 600 }}>⚡ {top3[0]?.xp} XP</div>
                  <div className="podium-block">1</div>
                </div>
                {/* 3rd */}
                <div className="podium-item podium-3">
                  <div className="podium-avatar" style={{ background: colors[2] }}>{initials(top3[2]?.name)}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>@{top3[2]?.username}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>⚡ {top3[2]?.xp} XP</div>
                  <div className="podium-block">3</div>
                </div>
              </div>
            )}

            {/* ─── Full Table ─── */}
            <div className="card" style={{ overflow: 'hidden', marginTop: 12 }}>
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>User</th>
                    <th>XP</th>
                    <th>Solved</th>
                    <th>Streak</th>
                    <th>Country</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map(u => (
                    <tr key={u.id} className={user?.id === u.id ? 'my-row' : ''}>
                      <td>
                        <span className={`rank-badge ${u.rank <= 3 ? `rank-${u.rank}` : ''}`}>{u.rank}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: colors[(u.rank - 1) % colors.length],
                            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                          }}>
                            {initials(u.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{u.name}</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>@{u.username}</div>
                          </div>
                          {user?.id === u.id && (
                            <span style={{ background: 'var(--accent-gold-light)', color: 'var(--accent-gold)', padding: '2px 8px', borderRadius: 10, fontSize: '0.68rem', fontWeight: 700 }}>You</span>
                          )}
                        </div>
                      </td>
                      <td><span style={{ color: 'var(--accent-gold)', fontWeight: 700 }}>⚡ {u.xp}</span></td>
                      <td><span style={{ fontWeight: 600 }}>{u.solvedCount}</span></td>
                      <td>
                        {u.streak > 0 ? (
                          <span style={{ color: 'var(--medium)' }}>🔥 {u.streak}d</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td>{FLAG_MAP[u.country] || '🌐'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
