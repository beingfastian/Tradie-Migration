/**
 * RegisterPage — Account creation with built-in role selector + OAuth SSO.
 *
 * FIXES:
 *  1. Step 1 role picker — user selects Skilled Worker / Employer / Trainer
 *     before seeing any form. ?role= query param pre-selects and skips Step 1.
 *  2. Step 2 Google + LinkedIn buttons pass ?role=<selectedRole> to backend
 *     so OAuth new users get the correct role (not always 'candidate').
 *  3. ROLE_REDIRECT stays on /setup/... because this is the registration page —
 *     new users always need onboarding. Login uses /dashboard redirects.
 *
 * OAuth flow for new users:
 *   Click "Continue with Google" (role=employer selected)
 *   → GET /auth/google?role=employer
 *   → Google consent
 *   → /oauth-callback?token=...&role=employer&is_new=true
 *   → OAuthCallbackPage reads is_new=true → /setup/company/1
 */
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { register, saveToken } from '../services/api'
import illusRegister from '../assets/illus-register.svg'
import illusHiring   from '../assets/illus-hiring.svg'
import illusTrain    from '../assets/illus-train.svg'
import illusWork     from '../assets/illus-work.svg'
import iconGoogle    from '../assets/icon-google.svg'
import iconLinkedin  from '../assets/icon-linkedin.svg'

const font     = "'Urbanist', sans-serif"
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const ROLE_REDIRECT = {
  candidate:         '/setup/worker/1',
  employer:          '/setup/company/1',
  training_provider: '/setup/trainer/1',
  admin:             '/dashboard',
  migration_agent:   '/dashboard',
  company_admin:     '/dashboard',
}

const ROLES = [
  {
    key:   'candidate',
    label: 'Skilled Worker',
    sub:   "I'm a tradie looking for work in Australia",
    icon:  '👷',
    color: '#156dbf',
    bg:    '#f0f7ff',
    border:'#c7dff7',
    illus: illusWork,
    cardLabel: 'I want to work',
  },
  {
    key:   'employer',
    label: 'Employer',
    sub:   'I want to find and sponsor skilled workers',
    icon:  '🏢',
    color: '#0d7377',
    bg:    '#f0faf9',
    border:'#b2dfdb',
    illus: illusHiring,
    cardLabel: 'I want to hire',
  },
  {
    key:   'training_provider',
    label: 'Training Provider',
    sub:   'I offer RTO courses and gap training',
    icon:  '📚',
    color: '#7c3aed',
    bg:    '#f5f3ff',
    border:'#ddd6fe',
    illus: illusTrain,
    cardLabel: 'I want to train',
  },
]

/* ── Eye icons ── */
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

/* ── Shared background decorations ── */
function BgDecorations() {
  return (
    <>
      <div style={{ position: 'absolute', top: -30, right: -30, width: 200, height: 180, background: '#b8d4f0', borderRadius: '80% 20% 80% 20%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 60, right: 60, width: 120, height: 110, background: '#c8e6a0', borderRadius: '20% 80% 20% 80%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -30, left: -30, width: 200, height: 180, background: '#a0d8b0', borderRadius: '20% 80% 20% 80%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 60, left: 60, width: 120, height: 100, background: '#d4e8a0', borderRadius: '80% 20% 80% 20%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 120, left: 80, width: 5, height: 5, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 200, right: 200, width: 4, height: 4, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 180, right: 120, width: 5, height: 5, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 100, left: 200, width: 4, height: 4, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 80, right: 300, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 300, left: 40, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 250, right: 60, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 80, left: 300, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
    </>
  )
}

export function RegisterPage() {
  const navigate  = useNavigate()
  const [params]  = useSearchParams()

  const preselectedRole = params.get('role')
  const [step,  setStep]  = useState(preselectedRole ? 2 : 1)
  const [role,  setRole]  = useState(preselectedRole || '')

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', terms: false,
  })
  const [showPw,  setShowPw]  = useState(false)
  const [showCpw, setShowCpw] = useState(false)
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function set(f, v) { setForm(p => ({ ...p, [f]: v })); setError('') }
  function selectRole(r) { setRole(r); setStep(2) }

  // FIX: OAuth buttons pass the selected role to the backend
  function handleGoogleOAuth()   { window.location.href = `${API_BASE}/auth/google?role=${role || 'candidate'}` }
  function handleLinkedInOAuth() { window.location.href = `${API_BASE}/auth/linkedin?role=${role || 'candidate'}` }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim())                      { setError('Full name is required.'); return }
    if (!form.email)                            { setError('Email is required.'); return }
    if (form.password.length < 8)              { setError('Password must be at least 8 characters.'); return }
    if (!/[A-Z]/.test(form.password))          { setError('Password must include an uppercase letter.'); return }
    if (!/\d/.test(form.password))             { setError('Password must include a number.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }
    if (!form.terms)                            { setError('Please accept the terms and conditions.'); return }
    setLoading(true); setError('')
    try {
      const data = await register({ name: form.name.trim(), email: form.email, password: form.password, role })
      if (data.skip_otp && data.access_token) {
        saveToken(data.access_token)
        navigate(ROLE_REDIRECT[data.role] || '/dashboard', { replace: true })
      } else {
        navigate('/verify-otp', { state: { email: form.email } })
      }
    } catch (err) {
      setError(err.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    height: 50, padding: '0 16px',
    border: '1px solid #e2e2e2', borderRadius: 10, background: '#fff',
    fontFamily: font, fontSize: 14, color: '#1a1a1a',
    outline: 'none', boxSizing: 'border-box', width: '100%',
  }

  const labelStyle = {
    fontFamily: font, fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 6, display: 'block',
  }

  /* ── STEP 1 — Role cards ── */
  if (step === 1) return (
    <div style={{
      position: 'relative', overflow: 'hidden', minHeight: '100vh',
      background: '#f8f8f8', fontFamily: font,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px',
    }}>
      <BgDecorations />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: font, fontSize: 32, fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px', lineHeight: 1.3 }}>
            Join as a Professional
          </h1>
          <p style={{ fontFamily: font, fontSize: 16, color: '#888', margin: 0, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Join our global ecosystem to connect with top-tier talent, expert trainers, and world-class opportunities.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          {ROLES.map(r => (
            <div
              key={r.key}
              onClick={() => selectRole(r.key)}
              style={{
                background: '#fff', borderRadius: 16, padding: 24,
                border: '2px solid transparent', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                width: 240, transition: 'border-color 0.18s, box-shadow 0.18s',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#4169e1'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(65,105,225,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)' }}
            >
              <div style={{ width: 180, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={r.illus} alt={r.cardLabel} style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
              </div>
              <span style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: '#1a1a1a', textAlign: 'center' }}>
                {r.cardLabel}
              </span>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: font, fontSize: 14, color: '#888', margin: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4169e1', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  )

  /* ── STEP 2 — Registration form ── */
  return (
    <div style={{
      position: 'relative', overflow: 'hidden', height: '100vh',
      background: '#f8f8f8', fontFamily: font,
      display: 'flex', alignItems: 'stretch',
    }}>
      <BgDecorations />

      {/* Left illustration */}
      <div style={{
        width: '40%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', position: 'relative', zIndex: 1,
      }}>
        <img src={illusRegister} alt="Register illustration" style={{ width: '100%', maxWidth: 420, maxHeight: '75vh', objectFit: 'contain' }}/>
      </div>

      {/* Right form */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 32px', overflowY: 'auto', position: 'relative', zIndex: 1,
      }}>
        <div style={{
          background: '#dce8f5', borderRadius: 20, padding: 36,
          maxWidth: 380, width: '100%',
          boxShadow: '0 4px 24px rgba(65,105,225,0.08)',
        }}>
          {/* Back button + role badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <button
              onClick={() => { setStep(1); setError('') }}
              style={{
                background: 'none', border: '1.5px solid #c8d8ec', borderRadius: 8,
                padding: '5px 9px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#888',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            {ROLES.find(r => r.key === role) && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: ROLES.find(r => r.key === role).bg,
                border: `1.5px solid ${ROLES.find(r => r.key === role).border}`,
                borderRadius: 20, padding: '4px 12px',
              }}>
                <span style={{ fontSize: 13 }}>{ROLES.find(r => r.key === role).icon}</span>
                <span style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: ROLES.find(r => r.key === role).color }}>
                  {ROLES.find(r => r.key === role).label}
                </span>
              </div>
            )}
          </div>

          <h1 style={{ fontFamily: font, fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
            Join as a Professional
          </h1>
          <p style={{ fontFamily: font, fontSize: 13, color: '#888', margin: '0 0 20px', lineHeight: 1.5 }}>
            Join our global ecosystem to connect with top-tier talent, expert trainers, and world-class opportunities.
          </p>

          {error && (
            <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Email */}
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                type="email" placeholder="Enter your email" value={form.email}
                onChange={e => set('email', e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4169e1'}
                onBlur={e => e.target.style.borderColor = '#e2e2e2'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  value={form.password} onChange={e => set('password', e.target.value)}
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = '#4169e1'}
                  onBlur={e => e.target.style.borderColor = '#e2e2e2'}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 0, display: 'flex' }}>
                  {showPw ? <EyeOff/> : <EyeOpen/>}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCpw ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = '#4169e1'}
                  onBlur={e => e.target.style.borderColor = '#e2e2e2'}
                />
                <button type="button" onClick={() => setShowCpw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 0, display: 'flex' }}>
                  {showCpw ? <EyeOff/> : <EyeOpen/>}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer' }}>
              <input
                type="checkbox" checked={form.terms}
                onChange={e => set('terms', e.target.checked)}
                style={{ marginTop: 2, accentColor: '#4169e1', width: 15, height: 15, flexShrink: 0 }}
              />
              <span style={{ fontFamily: font, fontSize: 13, color: '#888', lineHeight: 1.5 }}>
                Accepting the{' '}
                <a href="#" style={{ color: '#4169e1', textDecoration: 'none', fontWeight: 600 }}>terms and conditions</a>.
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                width: '100%', height: 50,
                background: loading ? '#9ca3af' : '#4169e1',
                color: '#fff', border: 'none', borderRadius: 30,
                fontFamily: font, fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.18s',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3458c4' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4169e1' }}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: '#c8d8ec' }}/>
              <span style={{ fontFamily: font, fontSize: 12, color: '#888' }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#c8d8ec' }}/>
            </div>

            {/* SSO buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={handleLinkedInOAuth}
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
              <button type="button" onClick={handleGoogleOAuth}
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

            <p style={{ textAlign: 'center', fontFamily: font, fontSize: 14, color: '#888', margin: 0 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#4169e1', fontWeight: 600, textDecoration: 'none' }}>Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
