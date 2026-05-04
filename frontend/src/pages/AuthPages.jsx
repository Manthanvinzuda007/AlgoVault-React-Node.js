// Manthan Vinzuda
// LoginPage.jsx
import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const PARTICLES = ['const', '{}', '=>', 'fn()', 'O(n)', '[]', '&&', 'if']

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email or username is required'
    if (!form.password) e.password = 'Password is required'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.token, res.data.user)
      toast.success(`Welcome back, ${res.data.user.name}! 👋`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
      setErrors({ general: err.response?.data?.message || 'Invalid credentials' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout page-enter">
      {/* Left Panel */}
      <div className="auth-left">
        <div className="particles" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} aria-hidden>
          {PARTICLES.map((p, i) => (
            <span key={i} className="particle" style={{
              left: `${10 + (i * 12) % 80}%`,
              animationDuration: `${4 + (i % 3)}s`,
              animationDelay: `${i * 0.4}s`,
              color: 'rgba(255,255,255,0.3)'
            }}>{p}</span>
          ))}
        </div>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 20, animation: 'float 3s ease-in-out infinite' }}>🏛️</div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Welcome back, solver.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 40, lineHeight: 1.7, maxWidth: 320 }}>
            Your problems, your progress, your vault — exactly as you left it.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['🔐 Secure JWT Authentication', '🌙 Light & Dark mode', '📊 Track your XP & Streak'].map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                background: 'rgba(255,255,255,0.1)', borderRadius: 10, fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.9)'
              }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-card">
          <div style={{ marginBottom: 32 }}>
            <h1 className="auth-title">Enter the Vault</h1>
            <p className="auth-subtitle">Sign in to continue your learning journey.</p>
          </div>

          {errors.general && (
            <div style={{ background: 'var(--hard-bg-cur)', color: 'var(--hard)', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.875rem' }}>
              {errors.general}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email or Username</label>
            <input
              className={`form-input ${errors.email ? 'error' : ''}`}
              style={errors.email ? { borderColor: 'var(--hard)' } : {}}
              type="text"
              placeholder="manthan@example.com"
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })) }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className={`form-input ${errors.password ? 'error' : ''}`}
                style={errors.password ? { borderColor: 'var(--hard)', paddingRight: 44 } : { paddingRight: 44 }}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })) }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
              <button type="button" onClick={() => setShowPw(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--primary-blue)', cursor: 'pointer' }}>Forgot password?</span>
          </div>

          <button className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in...</> : '🔐 Enter the Vault'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            New here?{' '}
            <Link to="/register" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Create an account</Link>
          </div>

          <div style={{ marginTop: 32, padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 10, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--accent-gold)' }}>Demo credentials:</strong><br />
            manthan@example.com / password
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── RegisterPage ──────────────────────────────────────────────────────────────

function getStrength(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Strong', 'Very Strong']
const STRENGTH_COLORS = ['', '#f44336', '#ff9800', '#4caf50', '#2196f3']

export function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '', terms: false })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [usernameStatus, setUsernameStatus] = useState(null) // 'available' | 'taken' | 'checking'
  const usernameTimeout = useRef(null)

  const checkUsername = (val) => {
    if (!val || val.length < 3) { setUsernameStatus(null); return }
    setUsernameStatus('checking')
    clearTimeout(usernameTimeout.current)
    usernameTimeout.current = setTimeout(async () => {
      try {
        const res = await api.get(`/auth/check-username/${val}`)
        setUsernameStatus(res.data.available ? 'available' : 'taken')
      } catch { setUsernameStatus(null) }
    }, 500)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters'
    if (usernameStatus === 'taken') e.username = 'Username is already taken'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match'
    if (!form.terms) e.terms = 'You must agree to the terms'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { name: form.name, username: form.username, email: form.email, password: form.password })
      login(res.data.token, res.data.user)
      toast.success(`Welcome to AlgoVault, ${res.data.user.name}! 🎉`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
      setErrors({ general: msg })
    } finally {
      setLoading(false)
    }
  }

  const strength = getStrength(form.password)
  const strengthPct = ['0%', '25%', '50%', '75%', '100%'][strength]

  return (
    <div className="auth-layout page-enter">
      <div className="auth-left">
        <div className="particles" style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} aria-hidden>
          {PARTICLES.map((p, i) => (
            <span key={i} className="particle" style={{
              left: `${10 + (i * 12) % 80}%`,
              animationDuration: `${4 + (i % 3)}s`,
              animationDelay: `${i * 0.4}s`,
              color: 'rgba(255,255,255,0.3)'
            }}>{p}</span>
          ))}
        </div>
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: 20, animation: 'float 3s ease-in-out infinite' }}>🔑</div>
          <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
            Your journey begins here.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', marginBottom: 40, lineHeight: 1.7, maxWidth: 320 }}>
            Join thousands of focused learners mastering algorithms one problem at a time.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['✅ Free forever, no credit card', '🏆 Track XP, streaks & rankings', '💬 Community-driven discussions', '🤖 Ava AI mentor included'].map((f, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                background: 'rgba(255,255,255,0.1)', borderRadius: 10, fontSize: '0.875rem',
                color: 'rgba(255,255,255,0.9)'
              }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-card">
          <div style={{ marginBottom: 28 }}>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join the vault. Start solving.</p>
          </div>

          {errors.general && (
            <div style={{ background: 'var(--hard-bg-cur)', color: 'var(--hard)', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.875rem' }}>
              {errors.general}
            </div>
          )}

          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" style={errors.name ? { borderColor: 'var(--hard)' } : {}}
              type="text" placeholder="Manthan Vinzuda"
              value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: '' })) }} />
            {errors.name && <div className="form-error">{errors.name}</div>}
          </div>

          {/* Username */}
          <div className="form-group">
            <label className="form-label">Username</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>@</span>
              <input className="form-input" style={{ paddingLeft: 30, ...(errors.username ? { borderColor: 'var(--hard)' } : {}), ...(usernameStatus === 'available' ? { borderColor: 'var(--easy)' } : {}) }}
                type="text" placeholder="manthan_v"
                value={form.username}
                onChange={e => {
                  const v = e.target.value.toLowerCase().replace(/\s/g, '_')
                  setForm(f => ({ ...f, username: v }))
                  setErrors(er => ({ ...er, username: '' }))
                  checkUsername(v)
                }} />
            </div>
            {usernameStatus === 'checking' && <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>Checking availability...</div>}
            {usernameStatus === 'available' && <div style={{ fontSize: '0.78rem', color: 'var(--easy)', marginTop: 4 }}>✓ Username is available</div>}
            {usernameStatus === 'taken' && <div style={{ fontSize: '0.78rem', color: 'var(--hard)', marginTop: 4 }}>✗ Username is taken</div>}
            {errors.username && <div className="form-error">{errors.username}</div>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" style={errors.email ? { borderColor: 'var(--hard)' } : {}}
              type="email" placeholder="you@example.com"
              value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: '' })) }} />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" style={{ paddingRight: 44, ...(errors.password ? { borderColor: 'var(--hard)' } : {}) }}
                type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                value={form.password} onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setErrors(er => ({ ...er, password: '' })) }} />
              <button type="button" onClick={() => setShowPw(s => !s)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            {form.password && (
              <div style={{ marginTop: 6 }}>
                <div className="strength-bar">
                  <div className="strength-fill" style={{ width: strengthPct, background: STRENGTH_COLORS[strength] }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: STRENGTH_COLORS[strength], marginTop: 3 }}>
                  {STRENGTH_LABELS[strength]}
                </div>
              </div>
            )}
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>

          {/* Confirm */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input className="form-input" style={errors.confirm ? { borderColor: 'var(--hard)' } : {}}
              type="password" placeholder="Repeat your password"
              value={form.confirm} onChange={e => { setForm(f => ({ ...f, confirm: e.target.value })); setErrors(er => ({ ...er, confirm: '' })) }} />
            {errors.confirm && <div className="form-error">{errors.confirm}</div>}
          </div>

          {/* Terms */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={form.terms} onChange={e => { setForm(f => ({ ...f, terms: e.target.checked })); setErrors(er => ({ ...er, terms: '' })) }}
                style={{ marginTop: 2, accentColor: 'var(--primary-blue)', width: 16, height: 16 }} />
              I agree to the <a href="#" style={{ color: 'var(--primary-blue)', marginLeft: 4 }}>Terms of Service</a>
              <span style={{ margin: '0 4px' }}>and</span>
              <a href="#" style={{ color: 'var(--primary-blue)' }}>Privacy Policy</a>
            </label>
            {errors.terms && <div className="form-error">{errors.terms}</div>}
          </div>

          <button className="btn btn-gold btn-lg" style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleSubmit} disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account...</> : '🎉 Create My Account'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


