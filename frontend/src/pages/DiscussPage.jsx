
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const TAGS = ['All', 'Arrays', 'Hash Map', 'Dynamic Programming', 'Graphs', 'Trees', 'Strings', 'Stack']

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function ThreadModal({ thread, onClose, user }) {
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [comments, setComments] = useState(thread.comments || [])

  const postComment = async () => {
    if (!comment.trim()) return
    if (!user) { toast.error('Sign in to comment'); return }
    setSubmitting(true)
    try {
      const res = await api.post(`/discussions/${thread.id}/comments`, { body: comment })
      setComments(c => [...c, res.data])
      setComment('')
      toast.success('Comment posted!')
    } catch { toast.error('Failed to post comment') }
    setSubmitting(false)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem' }}>{thread.title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}>✕</button>
        </div>
        <div className="modal-body">
          {/* Author */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gradient-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
              {thread.authorName?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{thread.authorName}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>@{thread.authorUsername} · {timeAgo(thread.createdAt)}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              {thread.tags?.map(t => <span key={t} className="tag">{t}</span>)}
            </div>
          </div>

          {/* Body */}
          <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: '16px 20px', marginBottom: 24, lineHeight: 1.8, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {thread.body}
          </div>

          {/* Votes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              👍 {thread.votes} votes
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              💬 {comments.length} comments
            </span>
          </div>

          {/* Comments */}
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20 }}>
            <h4 style={{ fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.875rem', marginBottom: 16 }}>Comments</h4>
            {comments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No comments yet. Be the first!</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                {comments.map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--accent-gold)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.72rem', flexShrink: 0, marginTop: 2 }}>
                      {c.authorName?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ background: 'var(--bg-tertiary)', borderRadius: 10, padding: '10px 14px', flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: 4 }}>{c.authorName} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>· {timeAgo(c.createdAt)}</span></div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{c.body}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Comment Input */}
            <div style={{ display: 'flex', gap: 10 }}>
              <textarea
                placeholder={user ? 'Write a comment...' : 'Sign in to comment'}
                disabled={!user}
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', background: 'var(--bg-tertiary)', border: '1.5px solid var(--border-color)', borderRadius: 10, color: 'var(--text-primary)', fontSize: '0.875rem', resize: 'vertical', minHeight: 80, outline: 'none', fontFamily: 'var(--font-ui)' }}
              />
              <button className="btn btn-primary btn-sm" onClick={postComment} disabled={submitting || !user} style={{ alignSelf: 'flex-end' }}>
                {submitting ? <span className="spinner" style={{ width: 14, height: 14 }} /> : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DiscussPage() {
  const { user } = useAuth()
  const [discussions, setDiscussions] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('new')
  const [tag, setTag] = useState('All')
  const [selected, setSelected] = useState(null)
  const [showNew, setShowNew] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', body: '', tags: [] })
  const [posting, setPosting] = useState(false)

  const fetchDiscussions = async () => {
    setLoading(true)
    try {
      const params = { sort }
      if (tag !== 'All') params.tag = tag
      const res = await api.get('/discussions', { params })
      setDiscussions(res.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchDiscussions() }, [sort, tag])

  const handlePost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) { toast.error('Title and body required'); return }
    if (!user) { toast.error('Sign in to post'); return }
    setPosting(true)
    try {
      const res = await api.post('/discussions', newPost)
      setDiscussions(d => [res.data, ...d])
      setShowNew(false)
      setNewPost({ title: '', body: '', tags: [] })
      toast.success('Discussion posted! 🎉')
    } catch { toast.error('Failed to post') }
    setPosting(false)
  }

  const handleVote = async (e, id, dir) => {
    e.stopPropagation()
    if (!user) { toast.error('Sign in to vote'); return }
    try {
      const res = await api.put(`/discussions/${id}/vote`, { direction: dir })
      setDiscussions(d => d.map(t => t.id === id ? { ...t, votes: res.data.votes } : t))
    } catch {}
  }

  return (
    <div className="page-wrapper page-enter">
      <Navbar />
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 className="section-title"><span className="gold-underline">Discuss</span></h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Ask questions, share insights, learn together.</p>
          </div>
          <button className="btn btn-gold" onClick={() => user ? setShowNew(true) : toast.error('Sign in to post')}>
            ✍️ New Post
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {[['new', '🕐 New'], ['hot', '🔥 Hot'], ['top', '⭐ Top']].map(([v, l]) => (
              <button key={v} onClick={() => setSort(v)} className={`filter-chip ${sort === v ? 'active' : ''}`}>{l}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {TAGS.map(t => (
              <button key={t} onClick={() => setTag(t)} className={`filter-chip ${tag === t ? 'active' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>{t}</button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner spinner-dark" style={{ width: 36, height: 36 }} /></div>
        ) : discussions.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">💬</div><p>No discussions yet. Start one!</p></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {discussions.map(d => (
              <div key={d.id} className="discussion-card" onClick={() => setSelected(d)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="discussion-title">{d.title}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                      @{d.authorUsername} · {timeAgo(d.createdAt)}
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {d.tags?.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <button onClick={e => handleVote(e, d.id, 'up')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-muted)' }}>▲</button>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-gold)' }}>{d.votes}</span>
                    <button onClick={e => handleVote(e, d.id, 'down')}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: 'var(--text-muted)' }}>▼</button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 12, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span>💬 {d.comments?.length || 0} comments</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Thread Modal */}
      {selected && <ThreadModal thread={selected} onClose={() => setSelected(null)} user={user} />}

      {/* New Post Modal */}
      {showNew && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowNew(false)}>
          <div className="modal">
            <div className="modal-header">
              <h3 style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem' }}>Start a Discussion</h3>
              <button onClick={() => setShowNew(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input className="form-input" placeholder="What's your question or insight?" value={newPost.title} onChange={e => setNewPost(p => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Body</label>
                <textarea className="form-input" rows={5} placeholder="Describe in detail..." value={newPost.body} onChange={e => setNewPost(p => ({ ...p, body: e.target.value }))} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Tags</label>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {TAGS.filter(t => t !== 'All').map(t => (
                    <button key={t} onClick={() => setNewPost(p => ({
                      ...p,
                      tags: p.tags.includes(t) ? p.tags.filter(x => x !== t) : [...p.tags, t]
                    }))}
                      className={`filter-chip ${newPost.tags.includes(t) ? 'active' : ''}`} style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowNew(false)}>Cancel</button>
              <button className="btn btn-gold" onClick={handlePost} disabled={posting}>
                {posting ? <><span className="spinner" style={{ width: 14, height: 14 }} /> Posting...</> : '🚀 Post Discussion'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
