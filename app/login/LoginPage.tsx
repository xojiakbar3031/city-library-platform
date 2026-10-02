'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // kirish animatsiyasi birinchi kadrdan keyin boshlanadi
    const id = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.8 + 0.4,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.35 + 0.05,
    }))

    let animId: number
    function animate() {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.speedX
        p.y += p.speedY
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212,175,55,${p.opacity})`
        ctx.fill()
      })
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = (await res.json()) as { error?: string }

      if (!res.ok) {
        setError(data.error ?? "Login yoki parol noto'g'ri kiritildi")
        setLoading(false)
        return
      }

      const redirectTo = searchParams.get('from') || '/admin'
      router.push(redirectTo)
      router.refresh()
    } catch {
      setError("Tarmoq xatosi. Qayta urinib ko'ring")
      setLoading(false)
    }
  }

  return (
    <div className="login-root">
      <canvas ref={canvasRef} className="login-canvas" aria-hidden="true" />

      <div className="login-glow login-glow--left" aria-hidden="true" />
      <div className="login-glow login-glow--right" aria-hidden="true" />

      <Link href="/" className="login-back">
        <span aria-hidden="true">←</span> Bosh sahifaga
      </Link>

      <div className={`login-container ${mounted ? 'login-container--visible' : ''}`}>
        <div className="login-brand">
          <div className="login-brand-inner">
            <div className="login-brand-badge">
              <span className="login-brand-dot" />
              XAVFSIZ KIRISH TIZIMI
            </div>

            <div className="login-brand-icon-wrap">
              <div className="login-brand-ring login-brand-ring--outer" />
              <div className="login-brand-ring login-brand-ring--middle" />
              <div className="login-brand-ring login-brand-ring--inner" />
              <div className="login-brand-icon">📚</div>
            </div>

            <h1 className="login-brand-title">
              Angren<br />
              <span>Kutubxonasi</span>
            </h1>

            <p className="login-brand-quote">
              &ldquo;Bilim — eng katta boylik. Bu portal faqat mas&apos;ul xodimlar uchun mo&apos;ljallangan.&rdquo;
            </p>

            <div className="login-brand-stats">
              {[
                { num: '50K+', label: 'Kitoblar' },
                { num: '1967', label: 'Yildan beri' },
                { num: '24/7', label: 'Himoya' },
              ].map((s) => (
                <div key={s.label} className="login-brand-stat">
                  <div className="login-brand-stat-num">{s.num}</div>
                  <div className="login-brand-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="login-form-panel">
          <div className={`login-card ${error ? 'login-card--shake' : ''}`}>
            <div className="login-card-header">
              <div className="login-lock-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                </svg>
              </div>
              <h2 className="login-card-title">Tizimga kirish</h2>
              <p className="login-card-subtitle">Boshqaruv paneliga kirish uchun ma&apos;lumotlaringizni kiriting</p>
            </div>

            {error && (
              <div className="login-error" role="alert">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M12 8v5M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="login-form">
              <div className="login-field">
                <label htmlFor="username" className="login-label">FOYDALANUVCHI NOMI</label>
                <div className={`login-input-wrap ${focusedField === 'username' ? 'login-input-wrap--focused' : ''}`}>
                  <span className="login-input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    id="username"
                    type="text"
                    required
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onFocus={() => setFocusedField('username')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="admin"
                    className="login-input"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="login-field">
                <label htmlFor="password" className="login-label">PAROL</label>
                <div className={`login-input-wrap ${focusedField === 'password' ? 'login-input-wrap--focused' : ''}`}>
                  <span className="login-input-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••••"
                    className="login-input login-input--password"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="login-toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Parolni yashirish' : "Parolni ko'rsatish"}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A9.9 9.9 0 0 1 12 5c5 0 9 4 9 7a9.6 9.6 0 0 1-2.1 2.8M6.1 6.1A9.6 9.6 0 0 0 3 12c0 3 4 7 9 7 1.1 0 2.1-.2 3-.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" stroke="currentColor" strokeWidth="1.5" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="login-spinner" aria-hidden="true" />
                    Tekshirilmoqda...
                  </>
                ) : (
                  <>
                    XAVFSIZ KIRISH
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="login-footer-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
              Ushbu tizimga ruxsatsiz kirish qonun bilan taqiqlangan
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
