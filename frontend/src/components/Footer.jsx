
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">🏛️ AlgoVault</div>
            <p className="footer-tagline">
              A calm, focused place to master data structures and algorithms — at your own pace, without the noise.
            </p>
            <p className="footer-quote">"Every algorithm begins with silence and ends in clarity."</p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <ul className="footer-links">
              <li><Link to="/explore">Explore Problems</Link></li>
              <li><Link to="/practice">Practice</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/discuss">Discussions</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <ul className="footer-links">
              <li><a href="#">Discord</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Twitter</a></li>
              <li><a href="#">Newsletter</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><a href="#">DSA Roadmap</a></li>
              <li><a href="#">Cheat Sheets</a></li>
              <li><a href="#">Blog</a></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <ul className="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 AlgoVault. Crafted with ❤️ by Manthan Vinzuda.</span>
          <span style={{ color: 'var(--accent-gold)', fontSize: '0.82rem' }}>v1.0.0</span>
        </div>
      </div>
    </footer>
  )
}
