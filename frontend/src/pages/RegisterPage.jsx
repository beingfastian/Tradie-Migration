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
import iconGoogle   from '../assets/icon-google.svg'
import iconLinkedin from '../assets/icon-linkedin.svg'

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
  },
  {
    key:   'employer',
    label: 'Employer',
    sub:   'I want to find and sponsor skilled workers',
    icon:  '🏢',
    color: '#0d7377',
    bg:    '#f0faf9',
    border:'#b2dfdb',
  },
  {
    key:   'training_provider',
    label: 'Training Provider',
    sub:   'I offer RTO courses and gap training',
    icon:  '📚',
    color: '#7c3aed',
    bg:    '#f5f3ff',
    border:'#ddd6fe',
  },
]

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

  const selectedRoleConfig = ROLES.find(r => r.key === role)

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

  const ssoBtnStyle = {
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 44, borderRadius: 10, border: '1.5px solid #d0dbf0', background: '#fff',
    fontFamily: font, fontSize: 13, fontWeight: 600, color: '#343434',
    cursor: 'pointer', transition: 'all 0.15s',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: font, background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 100%)' }}>

      {/* ── Left panel ── */}
      <div style={{
        width: 420, flexShrink: 0,
        background: 'linear-gradient(160deg, #0d2340 0%, #156dbf 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '48px 36px', gap: 28,
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Tradie Migration</div>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
            Australia's platform for<br/>skilled trades migration
          </div>
        </div>
        <img src={illusRegister} alt="" style={{ width: '100%', maxWidth: 300, objectFit: 'contain' }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          {[
            { icon: '✅', text: 'Verified candidate profiles' },
            { icon: '🔍', text: 'AI-powered document search' },
            { icon: '✈️', text: '482 visa sponsorship support' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px' }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', overflowY: 'auto' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          {/* ═══ STEP 1 — Role Selector ═══ */}
          {step === 1 && (
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e', margin: '0 0 8px' }}>Create your account</h1>
              <p style={{ fontSize: 15, color: '#6a7380', margin: '0 0 32px' }}>First, tell us who you are.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {ROLES.map(r => (
                  <button key={r.key} onClick={() => selectRole(r.key)} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px',
                    borderRadius: 14, border: `2px solid ${r.border}`, background: r.bg,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.border = `2px solid ${r.color}`; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.border = `2px solid ${r.border}`; e.currentTarget.style.transform = 'none' }}
                  >
                    <div style={{ width: 52, height: 52, borderRadius: 12, flexShrink: 0, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                      {r.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: r.color, marginBottom: 2 }}>{r.label}</div>
                      <div style={{ fontSize: 13, color: '#6a7380', lineHeight: 1.4 }}>{r.sub}</div>
                    </div>
                    <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={r.color} strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                ))}
              </div>
              <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#6a7380' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#5379f4', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
              </p>
            </div>
          )}

          {/* ═══ STEP 2 — Form + SSO ═══ */}
          {step === 2 && (
            <div>
              {/* Back + role badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <button onClick={() => { setStep(1); setError('') }} style={{
                  background: 'none', border: '1.5px solid #e0dff0', borderRadius: 8,
                  padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#6a7380',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                {selectedRoleConfig && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: selectedRoleConfig.bg, border: `1.5px solid ${selectedRoleConfig.border}`, borderRadius: 20, padding: '5px 14px' }}>
                    <span style={{ fontSize: 14 }}>{selectedRoleConfig.icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: selectedRoleConfig.color }}>{selectedRoleConfig.label}</span>
                  </div>
                )}
              </div>

              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a2e', margin: '0 0 6px' }}>Create your account</h1>
              <p style={{ fontSize: 14, color: '#6a7380', margin: '0 0 20px' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: '#5379f4', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
              </p>

              {/* ── SSO buttons — FIX: pass selected role ── */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <button type="button" style={ssoBtnStyle} onClick={handleGoogleOAuth}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#4285f4'; e.currentTarget.style.background = '#f8f9ff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0dbf0'; e.currentTarget.style.background = '#fff' }}
                >
                  <img src={iconGoogle} alt="Google" style={{ width: 18, height: 18 }}/>
                  Google
                </button>
                <button type="button" style={ssoBtnStyle} onClick={handleLinkedInOAuth}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#0a66c2'; e.currentTarget.style.background = '#f0f7ff' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0dbf0'; e.currentTarget.style.background = '#fff' }}
                >
                  <img src={iconLinkedin} alt="LinkedIn" style={{ width: 18, height: 18 }}/>
                  LinkedIn
                </button>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 1, background: '#e0dff0' }}/>
                <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 600 }}>or register with email</span>
                <div style={{ flex: 1, height: 1, background: '#e0dff0' }}/>
              </div>

              {error && (
                <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 8, padding: '10px 14px', fontSize: 14, marginBottom: 14 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                {/* Full Name */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 5 }}>Full name</label>
                  <input type="text" placeholder="Enter your full name" value={form.name} onChange={e => set('name', e.target.value)}
                    style={{ width: '100%', padding: '10px 13px', borderRadius: 10, border: '1.5px solid #d0dbf0', background: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1a1a2e', fontFamily: font }}
                    onFocus={e => e.target.style.border = '1.5px solid #5379f4'} onBlur={e => e.target.style.border = '1.5px solid #d0dbf0'}
                  />
                </div>
                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 5 }}>Email address</label>
                  <input type="email" placeholder="Enter your email" value={form.email} onChange={e => set('email', e.target.value)}
                    style={{ width: '100%', padding: '10px 13px', borderRadius: 10, border: '1.5px solid #d0dbf0', background: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1a1a2e', fontFamily: font }}
                    onFocus={e => e.target.style.border = '1.5px solid #5379f4'} onBlur={e => e.target.style.border = '1.5px solid #d0dbf0'}
                  />
                </div>
                {/* Password */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 5 }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPw ? 'text' : 'password'} placeholder="Min 8 chars, 1 uppercase, 1 number" value={form.password} onChange={e => set('password', e.target.value)}
                      style={{ width: '100%', padding: '10px 42px 10px 13px', borderRadius: 10, border: '1.5px solid #d0dbf0', background: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1a1a2e', fontFamily: font }}
                      onFocus={e => e.target.style.border = '1.5px solid #5379f4'} onBlur={e => e.target.style.border = '1.5px solid #d0dbf0'}
                    />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
                      {showPw ? <EyeOff/> : <EyeOpen/>}
                    </button>
                  </div>
                </div>
                {/* Confirm Password */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1a1a2e', marginBottom: 5 }}>Confirm password</label>
                  <div style={{ position: 'relative' }}>
                    <input type={showCpw ? 'text' : 'password'} placeholder="Re-enter your password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                      style={{ width: '100%', padding: '10px 42px 10px 13px', borderRadius: 10, border: '1.5px solid #d0dbf0', background: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box', color: '#1a1a2e', fontFamily: font }}
                      onFocus={e => e.target.style.border = '1.5px solid #5379f4'} onBlur={e => e.target.style.border = '1.5px solid #d0dbf0'}
                    />
                    <button type="button" onClick={() => setShowCpw(p => !p)}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex' }}>
                      {showCpw ? <EyeOff/> : <EyeOpen/>}
                    </button>
                  </div>
                </div>
                {/* Terms */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.terms} onChange={e => set('terms', e.target.checked)}
                    style={{ marginTop: 2, accentColor: '#5379f4', width: 16, height: 16, flexShrink: 0 }}
                  />
                  <span style={{ fontSize: 13, color: '#6a7380', lineHeight: 1.5 }}>
                    I agree to the <a href="#" style={{ color: '#5379f4', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</a> and <a href="#" style={{ color: '#5379f4', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>
                  </span>
                </label>
                {/* Submit */}
                <button type="submit" disabled={loading} style={{
                  width: '100%', height: 48,
                  background: loading ? '#9ca3af' : '#5379f4',
                  color: '#fff', border: 'none', borderRadius: 12,
                  fontFamily: font, fontSize: 15, fontWeight: 700,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(83,121,244,0.4)',
                  transition: 'all 0.18s',
                }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#4264d6' }}
                  onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#5379f4' }}
                >
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}