/**
 * LoginPage — User sign-in.
 *
 * FIX: ROLE_REDIRECT now points to role dashboards, NOT setup flows.
 *
 * Before (broken): employer login → /setup/company/1 (re-runs setup every time)
 * After  (fixed):  employer login → /company/dashboard
 *
 * Setup flows (/setup/...) are only used during first-time registration,
 * which is handled by RegisterPage.jsx.
 */
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login, saveToken } from '../services/api'
import illusSignin  from '../assets/illus-signin.svg'
import iconLinkedin from '../assets/icon-linkedin.svg'
import iconGoogle   from '../assets/icon-google.svg'

const font = "'Urbanist', sans-serif"

// FIX: Login → dashboard (not setup). Setup is only for first-time registration.
const ROLE_REDIRECT = {
  candidate:         '/worker/dashboard',
  employer:          '/company/dashboard',
  training_provider: '/trainer/dashboard',
  admin:             '/dashboard',
  migration_agent:   '/dashboard',
  company_admin:     '/dashboard',
}

/* ── Eye icons ── */
const EyeOpen = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

const ssoBtnStyle = {
  flex: 1, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: 12, background: '#fff', border: '1.5px solid #e0dff0', borderRadius: 12,
  cursor: 'pointer', transition: 'border-color 0.15s',
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const DEV_ROLES = [
  { role: 'candidate',         label: '👷 Worker',   color: '#156dbf', bg: '#e8f4ff', redirect: '/worker/dashboard' },
  { role: 'employer',          label: '🏢 Employer', color: '#0d7377', bg: '#e8faf9', redirect: '/company/dashboard' },
  { role: 'training_provider', label: '📚 Trainer',  color: '#7c3aed', bg: '#f3f0ff', redirect: '/trainer/dashboard' },
]

export function LoginPage() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const successMsg = location.state?.message || ''

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [showPw,  setShowPw]  = useState(false)
  const [keepMe,  setKeepMe]  = useState(false)
  const [errors,  setErrors]  = useState({})
  const [apiErr,  setApiErr]  = useState('')
  const [loading, setLoading] = useState(false)
  const [devLoading, setDevLoading] = useState('')

  async function handleDevLogin(role, redirect) {
    setDevLoading(role)
    try {
      const res = await fetch(`${API_BASE}/auth/dev-login?role=${role}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Dev login failed')
      saveToken(data.access_token)
      navigate(redirect, { replace: true })
    } catch (err) {
      setApiErr(err.message)
    } finally {
      setDevLoading('')
    }
  }

  function set(f, v) {
    setForm(p   => ({ ...p, [f]: v }))
    setErrors(p => ({ ...p, [f]: '' }))
    setApiErr('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.email)    errs.email    = 'Email is required.'
    if (!form.password) errs.password = 'Password is required.'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true); setApiErr('')
    try {
      const data = await login({ email: form.email, password: form.password })
      saveToken(data.access_token)
      // FIX: redirect to dashboard, not setup
      navigate(ROLE_REDIRECT[data.role] || '/', { replace: true })
    } catch (err) {
      if (err.status === 403) setApiErr('Your email is not verified. Please check your inbox.')
      else setApiErr(err.detail || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', fontFamily: font,
      background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)',
    }}>

      {/* ── Left panel (illustration) ── */}
      <div style={{
        width: 420, flexShrink: 0,
        background: 'linear-gradient(160deg, #0d2340 0%, #156dbf 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', gap: 28,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Tradie Migration
          </div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Australia's platform for<br/>skilled trades migration
          </div>
        </div>
        <img src={illusSignin} alt="Sign in" style={{ width: '100%', maxWidth: 300, objectFit: 'contain' }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          {[
            { icon: '✅', text: 'Verified candidate profiles' },
            { icon: '🔍', text: 'AI-powered document search' },
            { icon: '✈️', text: '482 visa sponsorship support' },
          ].map(({ icon, text }) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px',
            }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', padding: '40px 32px', overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', margin: '0 0 6px' }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: '#6a7380', margin: '0 0 28px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#5379f4', fontWeight: 600, textDecoration: 'none' }}>
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Success / error alerts */}
            {successMsg && (
              <div style={{
                background: '#dcfce7', border: '1px solid #86efac', color: '#166534',
                borderRadius: 8, padding: '10px 14px', fontSize: 14,
              }}>
                {successMsg}
              </div>
            )}
            {apiErr && (
              <div style={{
                background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c',
                borderRadius: 8, padding: '10px 14px', fontSize: 14,
              }}>
                {apiErr}
              </div>
            )}

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 14, fontWeight: 700, color: '#343434' }}>
                Email address
              </label>
              <input
                type="email"
                placeholder="Enter Email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                style={{
                  height: 52, padding: '0 18px',
                  border: `1.5px solid ${errors.email ? '#ef4444' : '#d0dbf0'}`,
                  borderRadius: 12, background: '#fff',
                  fontFamily: font, fontSize: 15, color: '#343434',
                  outline: 'none', boxSizing: 'border-box', width: '100%',
                }}
                onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(83,121,244,0.15)'}
                onBlur={e  => e.target.style.boxShadow = 'none'}
              />
              {errors.email && (
                <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: 14, fontWeight: 700, color: '#343434' }}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  style={{ fontSize: 13, color: '#5379f4', textDecoration: 'none', fontWeight: 600 }}
                >
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  style={{
                    height: 52, padding: `0 48px 0 18px`,
                    border: `1.5px solid ${errors.password ? '#ef4444' : '#d0dbf0'}`,
                    borderRadius: 12, background: '#fff',
                    fontFamily: font, fontSize: 15, color: '#343434',
                    outline: 'none', boxSizing: 'border-box', width: '100%',
                  }}
                  onFocus={e => e.target.style.boxShadow = '0 0 0 3px rgba(83,121,244,0.15)'}
                  onBlur={e  => e.target.style.boxShadow = 'none'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#9ca3af', padding: 0, display: 'flex',
                  }}
                >
                  {showPw ? <EyeOff/> : <EyeOpen/>}
                </button>
              </div>
              {errors.password && (
                <p style={{ color: '#ef4444', fontSize: 13, margin: 0 }}>{errors.password}</p>
              )}
            </div>

            {/* Remember me */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={keepMe}
                onChange={e => setKeepMe(e.target.checked)}
                style={{ accentColor: '#5379f4', width: 16, height: 16 }}
              />
              <span style={{ fontSize: 14, color: '#6a7380' }}>Keep me signed in</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 52,
                background: loading ? '#9ca3af' : '#5379f4',
                color: '#fff', border: 'none', borderRadius: 12,
                fontFamily: font, fontSize: 16, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(83,121,244,0.4)',
                transition: 'all 0.18s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#4264d6' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#5379f4' }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: '#e0dff0' }}/>
              <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600 }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#e0dff0' }}/>
            </div>

            {/* SSO buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                style={ssoBtnStyle}
                onClick={() => { window.location.href = 'http://localhost:8000/auth/linkedin' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#0a66c2'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e0dff0'}
              >
                <img src={iconLinkedin} alt="LinkedIn" style={{ width: 22, height: 22 }}/>
                <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: '#403c8b' }}>
                  LinkedIn
                </span>
              </button>
              <button
                type="button"
                style={ssoBtnStyle}
                onClick={() => { window.location.href = 'http://localhost:8000/auth/google' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4285f4'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e0dff0'}
              >
                <img src={iconGoogle} alt="Google" style={{ width: 22, height: 22 }}/>
                <span style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: '#403c8b' }}>
                  Google
                </span>
              </button>
            </div>

          </form>

          {/* ── DEV QUICK LOGIN — remove before production ── */}
          <div style={{
            marginTop: 32, padding: '20px 24px',
            background: '#fffbeb', border: '1.5px dashed #f59e0b',
            borderRadius: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 16 }}>⚡</span>
              <span style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: '#92400e' }}>
                Dev Quick Login
              </span>
              <span style={{ fontFamily: font, fontSize: 11, color: '#b45309', marginLeft: 4 }}>
                (testing only — remove before production)
              </span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {DEV_ROLES.map(({ role, label, color, bg, redirect }) => (
                <button
                  key={role}
                  onClick={() => handleDevLogin(role, redirect)}
                  disabled={devLoading === role}
                  style={{
                    flex: 1, height: 44, border: `1.5px solid ${color}`,
                    borderRadius: 10, background: devLoading === role ? '#f3f4f6' : bg,
                    fontFamily: font, fontSize: 13, fontWeight: 700,
                    color: devLoading === role ? '#9ca3af' : color,
                    cursor: devLoading === role ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (devLoading !== role) e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { if (devLoading !== role) e.currentTarget.style.background = bg; e.currentTarget.style.color = color }}
                >
                  {devLoading === role ? 'Loading…' : label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}