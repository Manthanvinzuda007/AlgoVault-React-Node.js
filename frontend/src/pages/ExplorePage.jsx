// Manthan Vinzuda
import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import api from '../services/api'
import { DifficultyBadge } from '../components/DifficultyBadge'

const TOPICS = ['All', 'Arrays', 'Hash Map', 'Stack', 'Strings', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming', 'Backtracking', 'Binary Search', 'Two Pointers', 'Sorting']

export default function ExplorePage() {
  const [problems, setProblems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [difficulty, setDifficulty] = useState('All')
  const [topic, setTopic] = useState('All')
  const [sort, setSort] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const fetchProblems = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 20 }
      if (search) params.search = search
      if (difficulty !== 'All') params.difficulty = difficulty
      if (topic !== 'All') params.topic = topic
      if (sort) params.sort = sort
      const res = await api.get('/problems', { params })
      setProblems(res.data.problems)
      setTotal(res.data.total)
      setPages(res.data.pages)
    } catch {}
    setLoading(false)
  }, [page, search, difficulty, topic, sort])

  useEffect(() => { fetchProblems() }, [fetchProblems])

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1) }, 300)
    return () => clearTimeout(t)
  }, [searchInput])

  const setDiff = (d) => { setDifficulty(d); setPage(1) }
  const setTop = (t) => { setTopic(t); setPage(1) }

  return (
    <div className="page-wrapper page-enter">
      <Navbar />
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 className="section-title"><span className="gold-underline">Explore Problems</span></h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: 10 }}>
            {total} problems across all difficulties — find your next challenge.
          </p>
        </div>

        {/* Filters */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 28 }}>
          {/* Search */}
          <div className="search-bar" style={{ marginBottom: 16 }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>

          {/* Difficulty */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            {['All', 'Easy', 'Medium', 'Hard'].map(d => (
              <button key={d} onClick={() => setDiff(d)}
                className={`filter-chip ${difficulty === d ? (d === 'Easy' ? 'active-easy' : d === 'Medium' ? 'active-medium' : d === 'Hard' ? 'active-hard' : 'active') : ''}`}>
                {d}
              </button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Sort:</span>
              <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}
                style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.82rem', outline: 'none' }}>
                <option value="">Default</option>
                <option value="acceptance">Acceptance Rate</option>
                <option value="difficulty-asc">Difficulty ↑</option>
                <option value="difficulty-desc">Difficulty ↓</option>
              </select>
            </div>
          </div>

          {/* Topics */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {TOPICS.map(t => (
              <button key={t} onClick={() => setTop(t)}
                className={`filter-chip ${topic === t ? 'active' : ''}`}
                style={{ fontSize: '0.75rem', padding: '5px 12px' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Problem List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner spinner-dark" style={{ width: 36, height: 36 }} /></div>
        ) : problems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <p>No problems found. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 120px 100px', padding: '12px 20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
                {['#', 'Title', 'Difficulty', 'Topics', 'Acceptance'].map(h => (
                  <span key={h} style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text-muted)' }}>{h}</span>
                ))}
              </div>

              {problems.map((p, i) => (
                <Link key={p.id} to={`/problem/${p.id}`}
                  style={{ display: 'grid', gridTemplateColumns: '60px 1fr 120px 120px 100px', padding: '14px 20px', borderBottom: '1px solid var(--border-color)', textDecoration: 'none', color: 'inherit', transition: 'var(--transition)', alignItems: 'center' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>{p.number}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{p.title}</span>
                  <DifficultyBadge difficulty={p.difficulty} />
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {p.topics?.slice(0, 2).map(t => <span key={t} className="tag" style={{ fontSize: '0.68rem', padding: '2px 7px' }}>{t}</span>)}
                    {p.topics?.length > 2 && <span className="tag" style={{ fontSize: '0.68rem' }}>+{p.topics.length - 2}</span>}
                  </div>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{p.acceptanceRate}%</span>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                <button className="btn btn-ghost btn-sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`btn btn-sm ${page === p ? 'btn-primary' : 'btn-ghost'}`}>
                    {p}
                  </button>
                ))}
                <button className="btn btn-ghost btn-sm" disabled={page === pages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
