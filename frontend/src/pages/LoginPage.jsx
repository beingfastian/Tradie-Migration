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

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const DEV_ROLES = [
  { role: 'candidate',         label: '👷 Worker',   color: '#156dbf', bg: '#e8f4ff', redirect: '/worker/dashboard' },
  { role: 'employer',          label: '🏢 Employer', color: '#0d7377', bg: '#e8faf9', redirect: '/company/dashboard' },
  { role: 'training_provider', label: '📚 Trainer',  color: '#7c3aed', bg: '#f3f0ff', redirect: '/trainer/dashboard' },
]

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

/* ── Shared background decorations ── */
function BgDecorations() {
  return (
    <>
      {/* Top-right blobs */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 200, height: 180, background: '#b8d4f0', borderRadius: '80% 20% 80% 20%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 60, right: 60, width: 120, height: 110, background: '#c8e6a0', borderRadius: '20% 80% 20% 80%', pointerEvents: 'none' }} />
      {/* Bottom-left blobs */}
      <div style={{ position: 'absolute', bottom: -30, left: -30, width: 200, height: 180, background: '#a0d8b0', borderRadius: '20% 80% 20% 80%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 60, left: 60, width: 120, height: 100, background: '#d4e8a0', borderRadius: '80% 20% 80% 20%', pointerEvents: 'none' }} />
      {/* Orange filled dots */}
      <div style={{ position: 'absolute', top: 120, left: 80,  width: 5, height: 5, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 200, right: 200, width: 4, height: 4, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 180, right: 120, width: 5, height: 5, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 100, left: 200, width: 4, height: 4, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      {/* Orange ring dots */}
      <div style={{ position: 'absolute', top: 80,  right: 300, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 300, left: 40,   width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 250, right: 60, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 80,  left: 300, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
    </>
  )
}

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
  const [devLoading,  setDevLoading]  = useState('')
  const [testEmail,   setTestEmail]   = useState('')
  const [testResult,  setTestResult]  = useState(null)
  const [testLoading, setTestLoading] = useState(false)

  async function handleTestEmail() {
    if (!testEmail) return
    setTestLoading(true)
    setTestResult(null)
    try {
      const res  = await fetch(`${API_BASE}/auth/dev-test-email?to=${encodeURIComponent(testEmail)}`)
      const data = await res.json()
      setTestResult(data)
    } catch (err) {
      setTestResult({ sent: false, message: err.message })
    } finally {
      setTestLoading(false)
    }
  }

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
      navigate(ROLE_REDIRECT[data.role] || '/', { replace: true })
    } catch (err) {
      if (err.status === 403) setApiErr('Your email is not verified. Please check your inbox.')
      else setApiErr(err.detail || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    height: 50, padding: '0 16px',
    border: '1px solid #e2e2e2',
    borderRadius: 10, background: '#fff',
    fontFamily: font, fontSize: 15, color: '#1a1a1a',
    outline: 'none', boxSizing: 'border-box', width: '100%',
  }

  const labelStyle = {
    fontFamily: font, fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 6, display: 'block',
  }

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      height: '100vh',
      background: '#f8f8f8',
      fontFamily: font,
      display: 'flex',
      alignItems: 'stretch',
    }}>
      <BgDecorations />

      {/* ── Left panel (illustration) ── */}
      <div style={{
        width: '45%',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 36px',
        position: 'relative',
        zIndex: 1,
      }}>
        <img
          src={illusSignin}
          alt="Sign in illustration"
          style={{ width: '100%', maxWidth: 420, objectFit: 'contain' }}
        />
      </div>

      {/* ── Right panel (form) ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        overflowY: 'auto',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Form card */}
        <div style={{
          background: '#dce8f5',
          borderRadius: 20,
          padding: 36,
          maxWidth: 380,
          width: '100%',
          boxShadow: '0 4px 24px rgba(65,105,225,0.08)',
        }}>
          <h1 style={{ fontFamily: font, fontSize: 28, fontWeight: 700, color: '#1a1a1a', margin: '0 0 6px' }}>
            Welcome Back
          </h1>
          <p style={{ fontFamily: font, fontSize: 14, color: '#888', margin: '0 0 24px', lineHeight: 1.5 }}>
            Please login to continue to your account.
          </p>

          {successMsg && (
            <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', borderRadius: 8, padding: '10px 14px', fontSize: 14, marginBottom: 14 }}>
              {successMsg}
            </div>
          )}
          {apiErr && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 8, padding: '10px 14px', fontSize: 14, marginBottom: 14 }}>
              {apiErr}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                placeholder="Enter Email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                style={{ ...inputStyle, borderColor: errors.email ? '#ef4444' : '#e2e2e2' }}
                onFocus={e => e.target.style.borderColor = '#4169e1'}
                onBlur={e  => e.target.style.borderColor = errors.email ? '#ef4444' : '#e2e2e2'}
              />
              {errors.email && <p style={{ color: '#ef4444', fontSize: 12, margin: '4px 0 0' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  style={{ ...inputStyle, paddingRight: 46, borderColor: errors.password ? '#ef4444' : '#e2e2e2' }}
                  onFocus={e => e.target.style.borderColor = '#4169e1'}
                  onBlur={e  => e.target.style.borderColor = errors.password ? '#ef4444' : '#e2e2e2'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 0, display: 'flex' }}
                >
                  {showPw ? <EyeOff/> : <EyeOpen/>}
                </button>
              </div>
              {errors.password && <p style={{ color: '#ef4444', fontSize: 12, margin: '4px 0 0' }}>{errors.password}</p>}
            </div>

            {/* Keep me + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: font, fontSize: 13, color: '#1a1a1a' }}>
                <input
                  type="checkbox"
                  checked={keepMe}
                  onChange={e => setKeepMe(e.target.checked)}
                  style={{ accentColor: '#4169e1', width: 15, height: 15 }}
                />
                Keep me logged in
              </label>
              <Link to="/forgot-password" style={{ fontFamily: font, fontSize: 13, color: '#4169e1', textDecoration: 'none', fontWeight: 600 }}>
                Forgot Password?
              </Link>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', height: 50,
                background: loading ? '#9ca3af' : '#4169e1',
                color: '#fff', border: 'none', borderRadius: 30,
                fontFamily: font, fontSize: 16, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.18s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3458c4' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4169e1' }}
            >
              {loading ? 'Signing in…' : 'Login'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: '#c8d8ec' }}/>
              <span style={{ fontFamily: font, fontSize: 13, color: '#888' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#c8d8ec' }}/>
            </div>

            {/* SSO buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                onClick={() => { window.location.href = `${API_BASE}/auth/linkedin` }}
                style={{
                  flex: 1, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, background: '#1a3a5c', border: 'none', borderRadius: 10,
                  fontFamily: font, fontSize: 13, fontWeight: 600, color: '#fff',
                  cursor: 'pointer', transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <img src={iconLinkedin} alt="LinkedIn" style={{ width: 18, height: 18 }}/>
                LinkedIn
              </button>
              <button
                type="button"
                onClick={() => { window.location.href = `${API_BASE}/auth/google` }}
                style={{
                  flex: 1, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: 8, background: '#fff', border: '1.5px solid #e2e2e2', borderRadius: 10,
                  fontFamily: font, fontSize: 13, fontWeight: 600, color: '#1a1a1a',
                  cursor: 'pointer', transition: 'border-color 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#4169e1'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e2e2'}
              >
                <img src={iconGoogle} alt="Google" style={{ width: 18, height: 18 }}/>
                Google
              </button>
            </div>

            {/* Sign up link */}
            <p style={{ textAlign: 'center', fontFamily: font, fontSize: 14, color: '#888', margin: 0 }}>
              Need an account?{' '}
              <Link to="/join" style={{ color: '#4169e1', fontWeight: 600, textDecoration: 'none' }}>
                Create One
              </Link>
            </p>
          </form>
        </div>

        {/* ── DEV QUICK LOGIN — remove before production ── */}
        <div style={{
          marginTop: 24,
          padding: '16px 20px',
          background: '#fffbeb',
          border: '1.5px dashed #f59e0b',
          borderRadius: 14,
          maxWidth: 380,
          width: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 14 }}>⚡</span>
            <span style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: '#92400e' }}>Dev Quick Login</span>
            <span style={{ fontFamily: font, fontSize: 10, color: '#b45309', marginLeft: 4 }}>(testing only)</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {DEV_ROLES.map(({ role, label, color, bg, redirect }) => (
              <button
                key={role}
                onClick={() => handleDevLogin(role, redirect)}
                disabled={devLoading === role}
                style={{
                  flex: 1, height: 38, border: `1.5px solid ${color}`,
                  borderRadius: 8, background: devLoading === role ? '#f3f4f6' : bg,
                  fontFamily: font, fontSize: 11, fontWeight: 700,
                  color: devLoading === role ? '#9ca3af' : color,
                  cursor: devLoading === role ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { if (devLoading !== role) { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff' }}}
                onMouseLeave={e => { if (devLoading !== role) { e.currentTarget.style.background = bg; e.currentTarget.style.color = color }}}
              >
                {devLoading === role ? 'Loading…' : label}
              </button>
            ))}
          </div>

          {/* ── Test Email ── */}
          <div style={{ marginTop: 14, borderTop: '1px dashed #f59e0b', paddingTop: 12 }}>
            <div style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: '#92400e', marginBottom: 7 }}>
              📧 Test Email (SMTP check)
            </div>
            <div style={{ display: 'flex', gap: 7 }}>
              <input
                type="email"
                placeholder="Enter email to test OTP send"
                value={testEmail}
                onChange={e => { setTestEmail(e.target.value); setTestResult(null) }}
                style={{
                  flex: 1, height: 34, padding: '0 10px',
                  border: '1.5px solid #f59e0b', borderRadius: 7,
                  fontFamily: font, fontSize: 12, outline: 'none',
                }}
              />
              <button
                onClick={handleTestEmail}
                disabled={testLoading || !testEmail}
                style={{
                  height: 34, padding: '0 12px',
                  background: testLoading ? '#9ca3af' : '#f59e0b',
                  color: '#fff', border: 'none', borderRadius: 7,
                  fontFamily: font, fontSize: 11, fontWeight: 700,
                  cursor: testLoading || !testEmail ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {testLoading ? 'Sending…' : 'Send Test OTP'}
              </button>
            </div>
            {testResult && (
              <div style={{
                marginTop: 7, padding: '8px 10px', borderRadius: 7, fontSize: 11,
                fontFamily: font, lineHeight: 1.5,
                background: testResult.sent ? '#dcfce7' : '#fee2e2',
                border: `1px solid ${testResult.sent ? '#86efac' : '#fca5a5'}`,
                color: testResult.sent ? '#166534' : '#b91c1c',
              }}>
                {testResult.sent ? '✅' : '❌'} {testResult.message}
                {testResult.sent && testResult.otp && (
                  <span style={{ marginLeft: 7, fontWeight: 700 }}>OTP: {testResult.otp}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
