# 🏛️ AlgoVault

**Where Logic Meets Peace.**

A full-stack LeetCode-style competitive programming and algorithm learning platform — calm, cozy, and focused. Built with React JS, Node.js, and JSON file storage.

---

## ✨ Features

- 🎨 **Cozy Study Theme** — Warm blue & gold palette, light/dark mode, cinematic landing page
- 🔐 **Auth System** — JWT-based register/login with bcrypt password hashing
- 💻 **Code Editor** — Monaco Editor with syntax highlighting, run & submit
- 📊 **Dashboard** — XP tracker, streak, progress rings, daily challenge
- 🗺️ **Explore** — Search, filter, sort 15+ problems by difficulty/topic
- 🏆 **Leaderboard** — Global & weekly rankings with podium visualization
- 💬 **Discussions** — Threaded forum with voting, comments, tag filters
- 📚 **Practice** — Topic-grouped problems with cheat sheets
- 🤖 **Ava AI Mentor** — Floating hint bot on problem/practice pages
- 📱 **Responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite, React Router v6 |
| Styling | Pure CSS (no Tailwind), CSS Variables |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Backend | Node.js + Express.js |
| Database | JSON files (`fs` read/write) |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Fonts | Playfair Display, Inter, Poppins, JetBrains Mono |
| Icons | Phosphor Icons |
| Notifications | `react-hot-toast` |

---

## 📁 Project Structure

```
algovault/
├── client/                      # React Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Auth-aware navbar with dropdown
│   │   │   ├── Footer.jsx        # Full footer with links
│   │   │   ├── LoadingScreen.jsx # Animated 2.5s intro
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── AvaBot.jsx        # Floating AI mentor widget
│   │   │   └── DifficultyBadge.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # User state, login/logout
│   │   │   └── ThemeContext.jsx  # Light/dark theme
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Hero, CSS study room, features, testimonials
│   │   │   ├── AuthPages.jsx     # Login + Register (split-screen)
│   │   │   ├── HomePage.jsx      # Dashboard after login
│   │   │   ├── ExplorePage.jsx   # Problem list with filters
│   │   │   ├── ProblemPage.jsx   # Monaco editor + run/submit
│   │   │   ├── LeaderboardPage.jsx
│   │   │   ├── DiscussPage.jsx   # Forum with threads & comments
│   │   │   └── OtherPages.jsx    # Practice, About, 404
│   │   ├── services/api.js       # Axios instance with JWT interceptor
│   │   ├── App.jsx               # Router + loading screen
│   │   └── index.css             # Full design system (600+ lines)
│   ├── index.html
│   └── vite.config.js
│
└── server/                       # Node.js Express Backend
    ├── data/
    │   ├── users.json            # 5 seed users
    │   ├── problems.json         # 15 real problems
    │   ├── submissions.json      # User submissions
    │   └── discussions.json      # Forum threads
    ├── routes/
    │   ├── auth.routes.js
    │   ├── problems.routes.js
    │   ├── submissions.routes.js
    │   ├── users.routes.js
    │   ├── discussions.routes.js
    │   └── leaderboard.routes.js
    ├── middleware/auth.middleware.js
    ├── utils/jsonDB.js
    └── server.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v8+

### 1. Install & Run Backend

```bash
cd server
npm install
npm run dev
# ✅ Server running on http://localhost:5000
```

### 2. Install & Run Frontend

```bash
cd client
npm install
npm run dev
# ✅ App running on http://localhost:5173
```

### 3. Open in Browser

Navigate to **http://localhost:5173**

---

## 🔑 Demo Credentials

| Field | Value |
|-------|-------|
| Email | `manthan@example.com` |
| Password | `password` |

Other seed users: `arjun@example.com`, `priya@example.com`, `alex@example.com`, `sofia@example.com` — all use `password`.

---

## 🌐 API Endpoints

### Auth
```
POST   /api/auth/register         Create account
POST   /api/auth/login            Login → JWT
GET    /api/auth/me               Get current user (🔒)
GET    /api/auth/check-username/:u Check availability
```

### Problems
```
GET    /api/problems              List (search, difficulty, topic, sort, page)
GET    /api/problems/:id          Single problem by ID or slug
POST   /api/problems              Create (admin only 🔒)
```

### Submissions
```
POST   /api/submissions/run       Run code against test cases (🔒)
POST   /api/submissions/submit    Submit solution (🔒)
GET    /api/submissions/me        My submissions (🔒)
GET    /api/submissions/problem/:id  Problem submissions (🔒)
```

### Users
```
GET    /api/users/:username       Public profile
GET    /api/users/me/stats        My stats (🔒)
PUT    /api/users/me              Update profile (🔒)
```

### Leaderboard
```
GET    /api/leaderboard           Global rankings
GET    /api/leaderboard/weekly    Weekly rankings
```

### Discussions
```
GET    /api/discussions           List threads (sort, tag)
POST   /api/discussions           Create thread (🔒)
GET    /api/discussions/:id       Single thread
POST   /api/discussions/:id/comments  Add comment (🔒)
PUT    /api/discussions/:id/vote  Upvote/downvote (🔒)
```

---

## 🎨 Design System

```css
/* Brand Colors */
--primary-blue: #436b95;    /* Main brand */
--accent-gold:  #caa855;    /* Highlights, badges */

/* Difficulty */
--easy:   #4caf50;
--medium: #ff9800;
--hard:   #f44336;

/* Fonts */
Playfair Display  → Headings, titles
Inter             → Body, UI text
Poppins           → Buttons, CTAs
JetBrains Mono    → Code, editor
```

---

## 🔒 Environment Variables

### `server/.env`
```
PORT=5000
JWT_SECRET=algvault_super_secret_jwt_key_2025
NODE_ENV=development
```

---

## 📦 Dependencies

### Client
```json
{
  "react": "^18",
  "react-router-dom": "^6",
  "axios": "^1",
  "@monaco-editor/react": "^4",
  "react-hot-toast": "^2",
  "date-fns": "^3"
}
```

### Server
```json
{
  "express": "^4",
  "bcryptjs": "^2",
  "jsonwebtoken": "^9",
  "uuid": "^9",
  "cors": "^2",
  "morgan": "^1",
  "dotenv": "^16"
}
```

---

## 🗺️ Roadmap

- [ ] Python/C++ code execution (Docker sandbox)
- [ ] Real AI integration for Ava (Claude API)
- [ ] User profile pages & avatars
- [ ] Weekly challenge system with prizes
- [ ] Premium features (solution unlocks)
- [ ] PostgreSQL migration from JSON storage
- [ ] Email notifications & password reset

---

## 👤 Author

**Manthan Vinzuda** — Full-Stack Developer

*"Every algorithm begins with silence and ends in clarity."*

---

*AlgoVault 2025 — Crafted with ❤️*
