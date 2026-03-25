import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import Editor from '@monaco-editor/react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { AvaBot } from '../components/AvaBot'
import api from '../services/api'
import toast from 'react-hot-toast'

const STARTER = `// Welcome to AlgoVault!
// Select a language and start coding.
function solution() {
  // Your code here
}`

export default function ProblemPage() {
  const { id } = useParams()
  const { theme } = useTheme()
  const { user } = useAuth()
  const [problem, setProblem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState(STARTER)
  const [lang, setLang] = useState('javascript')
  const [activeTab, setActiveTab] = useState('description')
  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    api.get(`/problems/${id}`).then(r => {
      setProblem(r.data)
      setCode(r.data.starterCode?.javascript || STARTER)
      setLoading(false)
    }).catch(() => setLoading(false))
    if (user) {
      api.get(`/submissions/problem/${id}`).then(r => setSubmissions(r.data)).catch(() => {})
    }
  }, [id, user])

  const handleRun = async () => {
    setRunning(true); setResult(null)
    try {
      const res = await api.post('/submissions/run', { code, problemId: id, language: lang })
      setResult(res.data)
    } catch (err) {
      toast.error('Error running code')
    }
    setRunning(false)
  }

  const handleSubmit = async () => {
    setSubmitting(true); setResult(null)
    try {
      const res = await api.post('/submissions/submit', { code, problemId: id, language: lang })
      setResult(res.data)
      if (res.data.status === 'Accepted') {
        toast.success('🎉 Accepted! Great work!')
        setSubmissions(s => [{ status: 'Accepted', language: lang, runtime: res.data.runtime, memory: res.data.memory, submittedAt: new Date().toISOString() }, ...s])
      } else {
        toast.error('Wrong Answer — keep trying!')
      }
    } catch (err) {
      toast.error('Submission failed')
    }
    setSubmitting(false)
  }

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner spinner-dark" style={{ width: 36, height: 36 }} />
    </div>
  )

  if (!problem) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2>Problem not found</h2>
      <Link to="/explore" className="btn btn-primary" style={{ marginTop: 16 }}>Back to Explore</Link>
    </div>
  )

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div className="problem-page-layout">
        {/* ─── LEFT: Problem Details ─────────────────────────── */}
        <div className="problem-left">
          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <Link to="/explore" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>← Explore</Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h1 style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', fontWeight: 700 }}>
                {problem.number}. {problem.title}
              </h1>
              <span className={`badge badge-${problem.difficulty?.toLowerCase()}`}>{problem.difficulty}</span>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {problem.topics?.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>

          {/* Tabs */}
          <div className="tab-bar" style={{ margin: '-24px -24px 20px', padding: '0 24px' }}>
            {['description', 'submissions', 'discussion'].map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`tab-btn ${activeTab === t ? 'active' : ''}`}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
                {t === 'submissions' && submissions.length > 0 && (
                  <span style={{ marginLeft: 6, background: 'var(--primary-blue-light)', color: 'var(--primary-blue)', borderRadius: 10, padding: '1px 6px', fontSize: '0.7rem' }}>
                    {submissions.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Description Tab */}
          {activeTab === 'description' && (
            <div>
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.9, whiteSpace: 'pre-line', fontSize: '0.9rem' }}>
                  {problem.description}
                </p>
              </div>

              {problem.examples?.map((ex, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 8 }}>Example {i + 1}:</div>
                  <div style={{ background: 'var(--code-bg)', borderRadius: 8, padding: '14px 16px', fontFamily: 'var(--font-code)', fontSize: '0.82rem', lineHeight: 2 }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Input:</span> <span style={{ color: 'var(--text-primary)' }}>{ex.input}</span></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Output:</span> <span style={{ color: 'var(--easy)' }}>{ex.output}</span></div>
                    {ex.explanation && <div style={{ color: 'var(--text-secondary)', marginTop: 4 }}>Explanation: {ex.explanation}</div>}
                  </div>
                </div>
              ))}

              <div>
                <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: 10 }}>Constraints:</div>
                <ul style={{ paddingLeft: 20 }}>
                  {problem.constraints?.map((c, i) => (
                    <li key={i} style={{ fontFamily: 'var(--font-code)', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <div>
              {!user ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🔐</div>
                  <p>Sign in to view your submissions</p>
                  <Link to="/login" className="btn btn-primary" style={{ marginTop: 12 }}>Sign In</Link>
                </div>
              ) : submissions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📭</div>
                  <p>No submissions yet. Write your solution and hit Submit!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {submissions.map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'var(--bg-tertiary)', borderRadius: 10 }}>
                      <span style={{ fontSize: '1.1rem' }}>{s.status === 'Accepted' ? '✅' : '❌'}</span>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: s.status === 'Accepted' ? 'var(--easy)' : 'var(--hard)' }}>{s.status}</span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.language} · {s.runtime} · {s.memory}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Discussion Tab */}
          {activeTab === 'discussion' && (
            <div className="empty-state">
              <div className="empty-state-icon">💬</div>
              <p>Discuss this problem in the community</p>
              <Link to="/discuss" className="btn btn-primary" style={{ marginTop: 12 }}>Go to Discuss →</Link>
            </div>
          )}
        </div>

        {/* ─── RIGHT: Code Editor ────────────────────────────── */}
        <div className="problem-right">
          {/* Editor Toolbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
            <select value={lang} onChange={e => { setLang(e.target.value); setCode(problem.starterCode?.[e.target.value] || STARTER) }}
              style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}>
              <option value="javascript">JavaScript</option>
              <option value="python" disabled>Python (soon)</option>
            </select>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost btn-sm" onClick={handleRun} disabled={running || submitting}>
                {running ? <><span className="spinner spinner-dark" style={{ width: 14, height: 14 }} /> Running...</> : '▶ Run'}
              </button>
              {user ? (
                <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={running || submitting}>
                  {submitting ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Submitting...</> : '🚀 Submit'}
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary btn-sm">Sign in to Submit</Link>
              )}
            </div>
          </div>

          {/* Monaco Editor */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Editor
              language={lang}
              value={code}
              onChange={v => setCode(v || '')}
              theme={theme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', monospace",
                minimap: { enabled: false },
                lineNumbers: 'on',
                bracketPairColorization: { enabled: true },
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Results Panel */}
          {result && (
            <div style={{
              padding: '16px 20px',
              background: result.status === 'Accepted' ? 'rgba(76,175,80,0.1)' : result.status === 'Wrong Answer' ? 'rgba(244,67,54,0.1)' : 'var(--bg-tertiary)',
              borderTop: `2px solid ${result.status === 'Accepted' ? 'var(--easy)' : result.status === 'Wrong Answer' ? 'var(--hard)' : 'var(--border-color)'}`,
              maxHeight: 200, overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontWeight: 700, color: result.status === 'Accepted' ? 'var(--easy)' : result.status === 'Wrong Answer' ? 'var(--hard)' : 'var(--text-primary)', fontSize: '0.95rem' }}>
                  {result.status === 'Accepted' ? '✅' : result.status === 'Wrong Answer' ? '❌' : 'ℹ️'} {result.status}
                </span>
                {result.runtime && <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{result.runtime} · {result.memory}</span>}
              </div>
              {result.results?.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {result.results.map((r, i) => (
                    <div key={i} style={{ fontFamily: 'var(--font-code)', fontSize: '0.78rem', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 6, borderLeft: `3px solid ${r.passed ? 'var(--easy)' : 'var(--hard)'}` }}>
                      <span style={{ color: r.passed ? 'var(--easy)' : 'var(--hard)', fontWeight: 700 }}>{r.passed ? '✓' : '✗'}</span>
                      {' '}Test {i+1}: Got <code style={{ color: 'var(--accent-gold)' }}>{JSON.stringify(r.output)}</code>
                      {!r.passed && <>, expected <code style={{ color: 'var(--easy)' }}>{JSON.stringify(r.expected)}</code></>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AvaBot />
    </div>
  )
}
