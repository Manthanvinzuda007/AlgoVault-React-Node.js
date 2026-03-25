import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Footer from '../components/Footer'

const PARTICLES = ['</>', '{}', '01', 'fn()', 'const', '=>', '[]', 'O(n)', '&&', 'if', '++', 'null']

const FEATURES = [
  { icon: '🗺️', title: 'Structured Learning Paths', desc: 'Curated problem sequences from foundations to advanced, grouped by topic and difficulty.' },
  { icon: '💻', title: 'Real-Time Code Editor', desc: 'Monaco-powered editor with syntax highlighting, auto-complete, and instant feedback.' },
  { icon: '🤖', title: 'AI Mentor — Ava', desc: 'Stuck? Ask Ava for hints, complexity analysis, and approach suggestions anytime.' },
  { icon: '🏆', title: 'Weekly Challenges', desc: 'Fresh competitive challenges every week to keep your problem-solving sharp.' },
  { icon: '💬', title: 'Community Discussions', desc: 'Ask questions, share solutions, and learn from a focused community of solvers.' },
  { icon: '📊', title: 'Smart Leaderboard', desc: 'Track your XP, streak, and rank globally or among friends on a real-time board.' },
]

const PROBLEMS_PREVIEW = [
  { id: 'prob-001', number: 1, title: 'Two Sum', difficulty: 'Easy', topics: ['Arrays', 'Hash Map'], acceptanceRate: 49.2 },
  { id: 'prob-004', number: 4, title: 'Maximum Subarray', difficulty: 'Medium', topics: ['Arrays', 'DP'], acceptanceRate: 50.2 },
  { id: 'prob-007', number: 7, title: 'Coin Change', difficulty: 'Medium', topics: ['DP', 'BFS'], acceptanceRate: 42.1 },
  { id: 'prob-011', number: 11, title: 'Trapping Rain Water', difficulty: 'Hard', topics: ['Arrays', 'Two Pointers'], acceptanceRate: 58.1 },
  { id: 'prob-002', number: 2, title: 'Valid Parentheses', difficulty: 'Easy', topics: ['Stack', 'Strings'], acceptanceRate: 40.5 },
  { id: 'prob-008', number: 8, title: 'Number of Islands', difficulty: 'Medium', topics: ['Graphs', 'DFS'], acceptanceRate: 56.7 },
]

const TESTIMONIALS = [
  { quote: "AlgoVault completely changed how I prep for interviews. The calm environment helped me think clearly instead of panicking under pressure.", name: "Rohan Mehta", role: "SDE @ Google", initials: "RM", color: "#436b95" },
  { quote: "The structured paths finally made DP click for me. I'd been struggling for months. The cozy study vibe keeps me coming back daily.", name: "Aisha Kapoor", role: "CS Student, IIT Delhi", initials: "AK", color: "#caa855" },
  { quote: "Best platform for thoughtful learners. No gamification noise — just clean problems, great discussions, and real progress tracking.", name: "Dev Patel", role: "Backend Engineer @ Razorpay", initials: "DP", color: "#4caf50" },
]

function StatCounter({ value, label }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const animated = useRef(false)

  useEffect(() => {
    const num = parseInt(value.replace(/\D/g, ''))
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !animated.current) {
        animated.current = true
        let start = 0
        const step = Math.ceil(num / 40)
        const t = setInterval(() => {
          start = Math.min(start + step, num)
          setCount(start)
          if (start >= num) clearInterval(t)
        }, 40)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [value])

  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-number">{count}{value.replace(/\d/g, '')}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

export default function LandingPage() {
  const { isAuth } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) navigate('/dashboard', { replace: true })
  }, [isAuth, navigate])

  return (
    <div className="page-enter">
      {/* ─── HERO ─────────────────────────────────────────── */}
      <section className="hero">
        {/* Cozy Room Background */}
        <div className="hero-room-bg" aria-hidden>
          {/* Window */}
          <div className="hero-window" />
          {/* Bookshelf */}
          <div className="hero-shelf">
            {['#e53935','#1565c0','#2e7d32','#f9a825','#6a1b9a','#00838f'].map((c, i) => (
              <div key={i} className="shelf-book" style={{ background: c }} />
            ))}
          </div>
          {/* Desk + Monitor */}
          <div className="hero-desk" />
          <div className="hero-monitor">
            <span style={{ color: '#4caf50', fontFamily: 'JetBrains Mono' }}>
              {'> solve()'}<br/>{'✓ accepted'}
            </span>
          </div>
        </div>

        {/* Floating Particles */}
        <div className="particles" aria-hidden>
          {PARTICLES.map((p, i) => (
            <span key={i} className="particle" style={{
              left: `${5 + (i * 8) % 90}%`,
              animationDuration: `${5 + (i % 5)}s`,
              animationDelay: `${i * 0.5}s`,
            }}>{p}</span>
          ))}
        </div>

        {/* Transparent Navbar for landing */}
        <nav style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: 'var(--gradient-blue)', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontFamily: 'var(--font-title)', fontWeight: 700
            }}>A</div>
            <span style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--primary-blue)' }}>AlgoVault</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link to="/register" className="btn btn-gold btn-sm">Get Started</Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="hero-content">
          <div className="hero-badge">✦ Built for focused minds</div>
          <h1 className="hero-title">
            Master Algorithms,<br /><em>Find Your Flow.</em>
          </h1>
          <p className="hero-subtitle">
            A calm, structured place to practice DSA — at your own pace, without the noise.
          </p>
          <div className="hero-cta">
            <Link to="/register" className="btn btn-gold btn-lg">Start Solving →</Link>
            <Link to="/explore" className="btn btn-outline btn-lg">Explore Problems</Link>
          </div>
          <p className="hero-social-proof">
            Joined by <span>2,400+</span> learners · <span>500+</span> problems · <span>98%</span> would recommend
          </p>
        </div>

        <div className="hero-scroll" aria-hidden>⌄</div>
      </section>

      {/* ─── STATS BAR ────────────────────────────────────── */}
      <section className="stats-bar">
        <StatCounter value="500+" label="Problems" />
        <StatCounter value="2400+" label="Members" />
        <StatCounter value="12+" label="Topic Tags" />
        <StatCounter value="98%" label="Satisfaction" />
      </section>

      {/* ─── FEATURES ─────────────────────────────────────── */}
      <section className="features-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <h2 className="section-title">Everything you need to <span>grow</span></h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
              AlgoVault brings together tools, community, and structure — so you can focus on learning.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROBLEMS PREVIEW ─────────────────────────────── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-tertiary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title"><span className="gold-underline">Handpicked Problems</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>
              From classic foundations to interview favourites.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {PROBLEMS_PREVIEW.map(p => (
              <Link key={p.id} to={`/problem/${p.id}`} style={{ textDecoration: 'none' }}>
                <div className="problem-card">
                  <div className="problem-card-header">
                    <div>
                      <div className="problem-number">#{p.number}</div>
                      <div className="problem-title">{p.title}</div>
                    </div>
                    <span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                  </div>
                  <div className="problem-tags">
                    {p.topics.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <div className="problem-footer">
                    <span className="acceptance-rate">✓ {p.acceptanceRate}% acceptance</span>
                    <span className="btn btn-primary btn-sm">Solve →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/explore" className="btn btn-outline btn-lg">View All Problems →</Link>
          </div>
        </div>
      </section>

      {/* ─── MEET AVA ─────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            {/* CSS Bot Face */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: 220, height: 220, borderRadius: '50%',
                background: 'var(--gradient-blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '5rem', boxShadow: '0 0 60px rgba(67,107,149,0.3)',
                animation: 'float 3s ease-in-out infinite',
                position: 'relative'
              }}>
                🤖
                <div style={{
                  position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--accent-gold)', color: '#fff', padding: '4px 16px',
                  borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap'
                }}>● Online</div>
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--accent-gold)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>AI MENTOR</div>
              <h2 className="section-title" style={{ marginBottom: 16 }}>Meet <span>Ava</span></h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.8 }}>
                Ava is your always-on AI mentor. Stuck on a problem? She'll guide you toward the insight without giving away the answer — the way great mentors do.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {['💡 Intelligent hints based on your approach', '⏱️ Time & space complexity guidance', '🎯 Pattern recognition coaching'].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {b}
                  </div>
                ))}
              </div>
              <Link to="/register" className="btn btn-primary">Ask Ava →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg-tertiary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="section-title">What learners <span>say</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card">
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.color }}>{t.initials}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t.name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ────────────────────────────────────── */}
      <section style={{
        padding: '100px 24px', textAlign: 'center',
        background: 'linear-gradient(135deg, #0f1420, #1a2340)'
      }}>
        <div style={{ color: 'var(--accent-gold)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>
          ✦ Begin Today
        </div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
          Your vault is waiting.<br /><em style={{ color: 'var(--accent-gold)' }}>Open it.</em>
        </h2>
        <p style={{ color: '#9ca3af', marginBottom: 36, maxWidth: 420, margin: '0 auto 36px' }}>
          Join thousands of developers who found their flow on AlgoVault.
        </p>
        <Link to="/register" className="btn btn-gold btn-lg">
          Create Free Account →
        </Link>
      </section>

      <Footer />
    </div>
  )
}
