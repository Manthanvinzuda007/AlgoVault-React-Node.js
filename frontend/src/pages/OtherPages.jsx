
// PracticePage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { AvaBot } from '../components/AvaBot'

const TOPICS = [
  { name: 'Arrays', count: 4, emoji: '📚', solved: 2 },
  { name: 'Strings', count: 2, emoji: '🔤', solved: 0 },
  { name: 'Hash Map', count: 2, emoji: '🗂️', solved: 1 },
  { name: 'Stack', count: 1, emoji: '📦', solved: 0 },
  { name: 'Linked List', count: 2, emoji: '🔗', solved: 0 },
  { name: 'Trees', count: 2, emoji: '🌳', solved: 0 },
  { name: 'Graphs', count: 2, emoji: '🕸️', solved: 0 },
  { name: 'Dynamic Programming', count: 3, emoji: '🧮', solved: 1 },
  { name: 'Backtracking', count: 1, emoji: '↩️', solved: 0 },
  { name: 'Binary Search', count: 1, emoji: '🔍', solved: 0 },
  { name: 'Two Pointers', count: 2, emoji: '👉', solved: 0 },
  { name: 'Sorting', count: 1, emoji: '🔃', solved: 0 },
]

const PROBLEMS_BY_TOPIC = {
  'Arrays': [
    { id: 'prob-001', number: 1, title: 'Two Sum', difficulty: 'Easy' },
    { id: 'prob-004', number: 4, title: 'Maximum Subarray', difficulty: 'Medium' },
    { id: 'prob-011', number: 11, title: 'Trapping Rain Water', difficulty: 'Hard' },
    { id: 'prob-015', number: 15, title: '3Sum', difficulty: 'Medium' },
  ],
  'Dynamic Programming': [
    { id: 'prob-004', number: 4, title: 'Maximum Subarray', difficulty: 'Medium' },
    { id: 'prob-005', number: 5, title: 'Climbing Stairs', difficulty: 'Easy' },
    { id: 'prob-007', number: 7, title: 'Coin Change', difficulty: 'Medium' },
  ],
  'Graphs': [
    { id: 'prob-008', number: 8, title: 'Number of Islands', difficulty: 'Medium' },
    { id: 'prob-013', number: 13, title: 'Median of Two Sorted Arrays', difficulty: 'Hard' },
  ],
  'Stack': [
    { id: 'prob-002', number: 2, title: 'Valid Parentheses', difficulty: 'Easy' },
  ],
}

const CHEAT_SHEETS = {
  'Arrays': `**Array Cheat Sheet**\n\n• Two Pointer: Use when sorted or need pairs\n• Sliding Window: Fixed/variable window over array\n• Prefix Sum: Precompute cumulative sums for range queries\n• Kadane's Algorithm: max subarray in O(n)\n\nKey Patterns:\n- Sort first for O(n log n) solutions\n- Hash map for O(1) lookup\n- Use two indices (left/right) for in-place ops`,
  'Dynamic Programming': `**DP Cheat Sheet**\n\n• Bottom-up: Fill table iteratively\n• Top-down (memoization): Recursion + cache\n• Common patterns: 0/1 Knapsack, LCS, Coin Change\n\nSteps:\n1. Define the subproblem\n2. Find the recurrence relation\n3. Identify base cases\n4. Decide order of computation`,
  'Graphs': `**Graph Cheat Sheet**\n\n• BFS: Shortest path in unweighted graph\n• DFS: Explore all paths, detect cycles\n• Union-Find: Connected components\n• Topological Sort: DAG ordering\n\nComplexity: O(V + E) for BFS/DFS`,
}

export function PracticePage() {
  const [activeTopic, setActiveTopic] = useState('Arrays')

  const problems = PROBLEMS_BY_TOPIC[activeTopic] || []
  const cheatSheet = CHEAT_SHEETS[activeTopic]
  const topicData = TOPICS.find(t => t.name === activeTopic)

  return (
    <div className="page-wrapper page-enter">
      <Navbar />
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '32px 24px' }}>

        <div style={{ marginBottom: 28 }}>
          <h1 className="section-title"><span className="gold-underline">Practice</span></h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Focused topic-by-topic practice. Master one pattern at a time.</p>
        </div>

        <div className="practice-layout">
          {/* Sidebar */}
          <div className="card" style={{ padding: 16, height: 'fit-content' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'var(--text-muted)', marginBottom: 12, padding: '0 4px' }}>Topics</div>
            {TOPICS.map(t => (
              <div key={t.name} className={`sidebar-topic-item ${activeTopic === t.name ? 'active' : ''}`}
                onClick={() => setActiveTopic(t.name)}>
                <span>{t.emoji} {t.name}</span>
                <span className="topic-count">{t.solved}/{t.count}</span>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.4rem', fontWeight: 700 }}>
                    {topicData?.emoji} {activeTopic}
                  </h2>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {topicData?.solved} / {topicData?.count} solved
                  </div>
                </div>
                <div style={{ width: 100, height: 8, background: 'var(--border-color)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 4, background: 'var(--gradient-blue)',
                    width: `${topicData ? (topicData.solved / topicData.count) * 100 : 0}%`,
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>

              {problems.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">🚧</div><p>Problems coming soon for this topic!</p></div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {problems.map(p => (
                    <Link key={p.id} to={`/problem/${p.id}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--bg-tertiary)', borderRadius: 10, textDecoration: 'none', color: 'inherit', transition: 'var(--transition)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-blue-light)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                    >
                      <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.78rem', color: 'var(--text-muted)', minWidth: 32 }}>#{p.number}</span>
                      <span style={{ flex: 1, fontWeight: 600 }}>{p.title}</span>
                      <span className={`badge badge-${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                      <span style={{ color: 'var(--primary-blue)', fontSize: '0.82rem' }}>Solve →</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Cheat Sheet */}
          <div className="card" style={{ padding: 24, height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1rem', fontWeight: 600, marginBottom: 16 }}>📖 Study Notes</h3>
            {cheatSheet ? (
              <div style={{ fontSize: '0.82rem', lineHeight: 1.9, color: 'var(--text-secondary)', whiteSpace: 'pre-line', fontFamily: 'var(--font-code)' }}>
                {cheatSheet}
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No notes available for this topic yet.</div>
            )}
          </div>
        </div>
      </div>
      <AvaBot />
    </div>
  )
}

// ─── AboutPage ────────────────────────────────────────────────────────────────
export function AboutPage() {
  const TECH = [
    { name: 'React JS', icon: '⚛️', color: '#61dafb', desc: 'Frontend UI library' },
    { name: 'Vite', icon: '⚡', color: '#646cff', desc: 'Build tool' },
    { name: 'Node.js', icon: '🟢', color: '#339933', desc: 'Backend runtime' },
    { name: 'Express', icon: '🚂', color: '#000000', desc: 'REST API framework' },
    { name: 'JSON Storage', icon: '📁', color: '#f0a500', desc: 'File-based database' },
    { name: 'Monaco Editor', icon: '💻', color: '#0078d4', desc: 'Code editor' },
    { name: 'JWT Auth', icon: '🔐', color: '#d63aff', desc: 'Authentication' },
    { name: 'React Router', icon: '🔗', color: '#ca4245', desc: 'Client-side routing' },
  ]

  const TIMELINE = [
    { phase: 'Phase 1', title: 'Design System', desc: 'Built the Cozy Study theme with CSS variables, color palette, and component library.' },
    { phase: 'Phase 2', title: 'Backend API', desc: 'Node.js + Express REST API with JSON file storage, JWT auth, and all route handlers.' },
    { phase: 'Phase 3', title: 'Core Pages', desc: 'Landing page, auth flows, dashboard, problem page with Monaco editor.' },
    { phase: 'Phase 4', title: 'Community Features', desc: 'Leaderboard, discussions, practice paths, and Ava AI mentor.' },
  ]

  return (
    <div className="page-wrapper page-enter">
      <Navbar />

      {/* Hero */}
      <section style={{ background: 'var(--gradient-blue)', padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          {['</>', '{}', 'fn()', 'O(n)', 'const'].map((p, i) => (
            <span key={i} className="particle" style={{ left: `${10 + i * 20}%`, color: '#fff', animationDuration: `${4 + i}s` }}>{p}</span>
          ))}
        </div>
        <div style={{ position: 'relative', maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>🏛️</div>
          <h1 style={{ fontFamily: 'var(--font-title)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, color: '#fff', marginBottom: 16, lineHeight: 1.2 }}>
            The Story Behind <em>AlgoVault</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.05rem', lineHeight: 1.8 }}>
            Built with ❤️ by Manthan Vinzuda — a full-stack developer who wanted a calmer way to practice algorithms.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '60px 24px' }}>

        {/* Motivation */}
        <div className="card" style={{ padding: 40, marginBottom: 40, textAlign: 'center' }}>
          <h2 className="section-title" style={{ marginBottom: 20 }}>Why AlgoVault?</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, maxWidth: 680, margin: '0 auto', fontSize: '1rem' }}>
            Most DSA platforms feel like you're racing against time, competing for streaks, or drowning in notifications.
            AlgoVault was built to feel like a library — quiet, focused, and purposeful. The cozy study theme isn't just aesthetic;
            it's a philosophy: <em style={{ color: 'var(--primary-blue)' }}>calm minds write better code.</em>
          </p>
        </div>

        {/* Tech Stack */}
        <h2 className="section-title" style={{ marginBottom: 32 }}>🛠️ Tech Stack</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 60 }}>
          {TECH.map(t => (
            <div key={t.name} className="card" style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontWeight: 700, color: t.color, marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <h2 className="section-title" style={{ marginBottom: 32 }}>📅 Build Journey</h2>
        <div style={{ position: 'relative', paddingLeft: 40 }}>
          <div style={{ position: 'absolute', left: 12, top: 0, bottom: 0, width: 2, background: 'var(--border-color)' }} />
          {TIMELINE.map((t, i) => (
            <div key={i} style={{ marginBottom: 32, position: 'relative' }}>
              <div style={{ position: 'absolute', left: -34, top: 4, width: 16, height: 16, borderRadius: '50%', background: 'var(--gradient-blue)', border: '2px solid var(--bg-primary)' }} />
              <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--accent-gold)', marginBottom: 4 }}>{t.phase}</div>
              <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', fontWeight: 600, marginBottom: 6 }}>{t.title}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.7 }}>{t.desc}</div>
            </div>
          ))}
        </div>

        {/* Creator */}
        <div className="card" style={{ padding: 32, textAlign: 'center', marginTop: 40, background: 'linear-gradient(135deg, var(--primary-blue-light), var(--accent-gold-light))' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--gradient-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, margin: '0 auto 16px', fontFamily: 'var(--font-title)', boxShadow: '0 8px 20px rgba(67,107,149,0.3)' }}>M</div>
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 6 }}>Manthan Vinzuda</h3>
          <div style={{ color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.875rem', marginBottom: 12 }}>Full-Stack Developer</div>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', fontSize: '0.9rem', lineHeight: 1.7 }}>
            Passionate about building thoughtful tools for developers. AlgoVault is my attempt to make DSA practice feel like a calm, rewarding ritual rather than a stressful grind.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── NotFoundPage ─────────────────────────────────────────────────────────────
export function NotFoundPage() {
  return (
    <div className="not-found page-enter">
      <div className="particles" aria-hidden>
        {['🔑','⚙️','🔐','🗝️','🔒'].map((p, i) => (
          <span key={i} className="particle" style={{ left: `${15 + i * 17}%`, fontSize: '1.5rem', animationDuration: `${4 + i}s` }}>{p}</span>
        ))}
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="not-found-number">404</div>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🏛️</div>
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', marginBottom: 12, color: 'var(--text-primary)' }}>
          Looks like this vault room doesn't exist.
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 32, maxWidth: 360, margin: '0 auto 32px' }}>
          The page you're looking for has been moved, deleted, or never existed in the first place.
        </p>
        <a href="/" className="btn btn-primary btn-lg">← Back to Home</a>
      </div>
    </div>
  )
}
