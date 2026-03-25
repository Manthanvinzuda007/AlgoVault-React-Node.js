// Created By Manthan Vinzuda
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoadingScreen } from './components/LoadingScreen'
import { useState } from 'react'

// Pages
import LandingPage from './pages/LandingPage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import HomePage from './pages/HomePage'
import ExplorePage from './pages/ExplorePage'
import ProblemPage from './pages/ProblemPage'
import LeaderboardPage from './pages/LeaderboardPage'
import DiscussPage from './pages/DiscussPage'
import { PracticePage, AboutPage, NotFoundPage } from './pages/OtherPages'

function AppRoutes() {
  const location = useLocation()
  return (
    <Routes location={location} key={location.pathname}>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/leaderboard" element={<LeaderboardPage />} />
      <Route path="/discuss" element={<DiscussPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Protected */}
      <Route path="/dashboard" element={
        <ProtectedRoute><HomePage /></ProtectedRoute>
      } />
      <Route path="/practice" element={
        <ProtectedRoute><PracticePage /></ProtectedRoute>
      } />
      <Route path="/problem/:id" element={
        <ProtectedRoute><ProblemPage /></ProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {isLoading && <LoadingScreen onDone={() => setIsLoading(false)} />}
          {!isLoading && (
            <>
              <AppRoutes />
              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.875rem',
                    boxShadow: 'var(--shadow-lg)',
                  },
                  success: { iconTheme: { primary: '#4caf50', secondary: '#fff' } },
                  error: { iconTheme: { primary: '#f44336', secondary: '#fff' } },
                }}
              />
            </>
          )}
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
