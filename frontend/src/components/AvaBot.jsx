
import { useState } from 'react'

const AVA_RESPONSES = {
  hint: "💡 Try breaking the problem into smaller sub-problems. What's the simplest case you can solve first?",
  time: "⏱️ Think about what data structure gives O(1) lookup time. A hash map might be your friend here!",
  space: "📦 Can you solve it in-place? Sometimes using the input array itself saves space.",
  approach: "🎯 Start with brute force to understand the problem, then optimize. Pattern recognition is key!",
  stuck: "🔑 Re-read the constraints. Often the key insight is hidden there. What's the range of values?",
  dp: "🧮 DP problems have overlapping subproblems. Define your state clearly: dp[i] = what exactly?",
  graph: "🕸️ BFS for shortest path in unweighted graphs, DFS for exploring all paths or detecting cycles.",
  tree: "🌳 Most tree problems are solved elegantly with recursion. Think: what does the function return for a leaf?",
  sort: "🔃 Sorting first often reveals patterns. Two pointers work beautifully on sorted arrays.",
  default: "🤖 I'm Ava, your AI mentor! Ask me about hints, time/space complexity, approach strategies, or just say you're stuck.",
}

export function AvaBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { from: 'bot', text: AVA_RESPONSES.default }
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.toLowerCase()
    const matchedKey = Object.keys(AVA_RESPONSES).find(k => k !== 'default' && userMsg.includes(k))
    const reply = AVA_RESPONSES[matchedKey || 'default']

    setMessages(m => [
      ...m,
      { from: 'user', text: input },
      { from: 'bot', text: reply }
    ])
    setInput('')
  }

  return (
    <>
      <button
        className="ava-fab"
        onClick={() => setOpen(o => !o)}
        title="Ask Ava — AI Mentor"
      >
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div className="ava-modal">
          <div className="ava-header">
            <div className="ava-avatar">🤖</div>
            <div>
              <div className="ava-name">Ava — AI Mentor</div>
              <div className="ava-status">● Online · Always here to help</div>
            </div>
          </div>

          <div className="ava-body" id="ava-body">
            {messages.map((m, i) => (
              <div key={i} className={`ava-message ${m.from}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div style={{ padding: '8px 12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {['hint', 'approach', 'stuck', 'time'].map(k => (
              <button key={k} onClick={() => {
                setMessages(m => [...m, { from: 'user', text: k }, { from: 'bot', text: AVA_RESPONSES[k] }])
              }} style={{
                padding: '3px 10px', fontSize: '0.72rem', borderRadius: 20,
                border: '1px solid var(--border-color)', background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)', cursor: 'pointer'
              }}>
                {k}
              </button>
            ))}
          </div>

          <div className="ava-input-row">
            <input
              className="ava-input"
              placeholder="Ask for hint, approach, stuck..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
            />
            <button className="ava-send" onClick={send}>Send</button>
          </div>
        </div>
      )}
    </>
  )
}
