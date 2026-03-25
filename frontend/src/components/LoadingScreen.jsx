import { useEffect } from 'react'

const particles = ['const', '{}', 'O(n)', '=>', '[]', 'fn()', 'if', 'for', '++', '&&']

export function LoadingScreen({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className="loading-screen">
      <div className="particles" aria-hidden>
        {particles.map((p, i) => (
          <span key={i} className="particle" style={{
            left: `${10 + (i * 9) % 80}%`,
            animationDuration: `${4 + (i % 4)}s`,
            animationDelay: `${i * 0.3}s`,
          }}>{p}</span>
        ))}
      </div>
      <div className="loading-vault-icon">🏛️</div>
      <div className="loading-title">AlgoVault</div>
      <div className="loading-tagline">Where Logic Meets Peace.</div>
      <div className="loading-bar-wrap">
        <div className="loading-bar-fill" />
      </div>
    </div>
  )
}
