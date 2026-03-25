import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import api from '../services/api'

function ProgressRing({ value, max, label, color = 'var(--primary-blue)' }) {
  const r = 32, c = 2 * Math.PI * r
  const pct = max > 0 ? Math.min(value / max, 1) : 0
  const offset = c - pct * c

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div className="progress-ring" style={{ width: 80, height: 80 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle className="progress-ring-track" cx="40" cy="40" r={r} />
          <circle className="progress-ring-fill" cx="40" cy="40" r={r}
            style={{ stroke: color, strokeDasharray: c, strokeDashoffset: offset }} />
        </svg>
        <div className="progress-ring-label">
          <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{value}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>/{max}</span>
        </div>
      </div>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
    </div>
  )
}

function DailyCountdown() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const tomorrow = new Date(now); tomorrow.setHours(24, 0, 0, 0)
      const diff = Math.floor((tomorrow - now) / 1000)
      setTime({ h: Math.floor(diff / 3600), m: Math.floor((diff % 3600) / 60), s: diff % 60 })
    }
    tick()
    const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.875rem', color: 'var(--accent-gold)' }}>
      {String(time.h).padStart(2,'0')}:{String(time.m).padStart(2,'0')}:{String(time.s).padStart(2,'0')}
    </span>
  )
}

const GREETINGS = ['Good morning', 'Good afternoon', 'Good evening']
const QUOTES = [
  '"The expert in anything was once a beginner."',
  '"Progress, not perfection."',
  '"Every problem solved is a skill earned."',
  '"One line of code at a time."',
]

const TOP3 = [
  { username: 'alex_algo', xp: 1560, solved: 7, rank: 1 },
  { username: 'manthan_v', xp: 1240, solved: 4, rank: 2 },
  { username: 'arjun_dsa', xp: 980, solved: 3, rank: 3 },
]

const RECOMMENDED = [
  { id: 'prob-004', number: 4, title: 'Maximum Subarray', difficulty: 'Medium', topics: ['Arrays', 'DP'] },
  { id: 'prob-005', number: 5, title: 'Climbing Stairs', difficulty: 'Easy', topics: ['DP', 'Math'] },
  { id: 'prob-008', number: 8, title: 'Number of Islands', difficulty: 'Medium', topics: ['Graphs'] },
  { id: 'prob-011', number: 11, title: 'Trapping Rain Water', difficulty: 'Hard', topics: ['Arrays'] },
  { id: 'prob-007', number: 7, title: 'Coin Change', difficulty: 'Medium', topics: ['DP'] },
  { id: 'prob-015', number: 15, title: '3Sum', difficulty: 'Medium', topics: ['Arrays', 'Two Pointers'] },
]

export default function HomePage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [submissions, setSubmissions] = useState([])
  const hour = new Date().getHours()
  const greeting = hour < 12 ? GREETINGS[0] : hour < 18 ? GREETINGS[1] : GREETINGS[2]
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]

  useEffect(() => {
    api.get('/users/me/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/submissions/me').then(r => setSubmissions(r.data.slice(0, 5))).catch(() => {})
  }, [])

  return (
    <div className="page-wrapper page-enter">
      <Navbar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* ─── Welcome Hero ─────────────────────────────────── */}
        <div className="dashboard-welcome">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                {greeting}, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', fontStyle: 'italic' }}>{quote}</p>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 20px' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>{user?.xp || 0}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>XP Earned</div>
              </div>
              <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 20px' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--accent-gold)' }}>🔥 {user?.streak || 0}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Main Grid ────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>

          {/* Daily Challenge */}
          <div className="card" style={{ padding: 24, gridColumn: '1 / 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', fontWeight: 600 }}>⚡ Daily Challenge</h3>
              <DailyCountdown />
            </div>
            <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 10, marginBottom: 16 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 6 }}>#4 · Today's Pick</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Maximum Subarray</div>
              <span className="badge badge-medium">Medium</span>
            </div>
            <Link to="/problem/prob-004" className="btn btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
              Solve Now →
            </Link>
          </div>

          {/* Progress Overview */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', fontWeight: 600, marginBottom: 20 }}>📊 Progress</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, justifyItems: 'center' }}>
              <ProgressRing value={stats?.solvedEasy || 0} max={5} label="Easy" color="var(--easy)" />
              <ProgressRing value={stats?.solvedMedium || 0} max={7} label="Medium" color="var(--medium)" />
              <ProgressRing value={stats?.solvedHard || 0} max={3} label="Hard" color="var(--hard)" />
              <ProgressRing value={stats?.totalSolved || 0} max={15} label="Total" color="var(--primary-blue)" />
            </div>
          </div>

          {/* Leaderboard Peek */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', fontWeight: 600 }}>🏆 Top Solvers</h3>
              <Link to="/leaderboard" style={{ fontSize: '0.78rem', color: 'var(--primary-blue)', fontWeight: 600 }}>View all →</Link>
            </div>
            {TOP3.map(u => (
              <div key={u.username} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span className={`rank-badge rank-${u.rank}`}>{u.rank}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>@{u.username}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{u.solved} problems solved</div>
                </div>
                <span style={{ color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.875rem' }}>⚡ {u.xp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Recent Activity ──────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>📝 Recent Submissions</h3>
            {submissions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <p>No submissions yet. Start solving!</p>
              </div>
            ) : submissions.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '1rem' }}>{s.status === 'Accepted' ? '✅' : '❌'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.problemId}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.language} · {s.runtime}</div>
                </div>
                <span style={{ fontSize: '0.78rem', color: s.status === 'Accepted' ? 'var(--easy)' : 'var(--hard)', fontWeight: 600 }}>{s.status}</span>
              </div>
            ))}
          </div>

          {/* Recommended Problems */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>🎯 Recommended for You</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {RECOMMENDED.slice(0, 4).map(p => (
                <Link key={p.id} to={`/problem/${p.id}`} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                  background: 'var(--bg-tertiary)', borderRadius: 8, transition: 'var(--transition)',
                  textDecoration: 'none', color: 'inherit'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-blue-light)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                >
                  <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.75rem', color: 'var(--text-muted)', minWidth: 28 }}>#{p.number}</span>
                  <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>{p.title}</span>
                  <span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                </Link>
              ))}
            </div>
            <Link to="/explore" className="btn btn-outline btn-sm" style={{ marginTop: 14, width: '100%', justifyContent: 'center' }}>
              Browse All Problems
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
