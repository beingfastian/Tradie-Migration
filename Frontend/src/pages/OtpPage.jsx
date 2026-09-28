import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { verifyOtp, resendOtp, saveToken } from '../services/api'
import illusOtp from '../assets/illus-otp.svg'

const ROLE_REDIRECT = {
  candidate:         '/setup/worker/1',
  employer:          '/setup/company/1',
  training_provider: '/setup/trainer/1',
  admin:             '/dashboard',
  migration_agent:   '/dashboard',
  company_admin:     '/dashboard',
}

const font = "'Urbanist', sans-serif"

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

export function OtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const email    = location.state?.email || ''

  const [code,          setCode]          = useState('')
  const [error,         setError]         = useState('')
  const [loading,       setLoading]       = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown,     setCountdown]     = useState(0)

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [countdown])

  async function handleSubmit(e) {
    e.preventDefault()
    if (code.length < 6) { setError('Please enter the 6-digit code.'); return }
    setLoading(true); setError('')
    try {
      const data = await verifyOtp({ email, otp_code: code })
      saveToken(data.access_token)
      navigate(ROLE_REDIRECT[data.role] || '/dashboard', { replace: true })
    } catch (err) {
      setError(err.detail || 'Invalid or expired code. Please try again.')
    } finally { setLoading(false) }
  }

  async function handleResend() {
    setResendLoading(true); setError('')
    try {
      await resendOtp({ email })
      setCountdown(60)
    } catch { setError('Failed to resend code. Please try again.') }
    finally  { setResendLoading(false) }
  }

  return (
    <div style={{
      position: 'relative', overflow: 'hidden', height: '100vh',
      background: '#f8f8f8', fontFamily: font,
      display: 'flex', alignItems: 'stretch',
    }}>
      <BgDecorations />

      {/* Left: form card */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', position: 'relative', zIndex: 1, overflowY: 'auto',
      }}>
        <div style={{
          background: '#dce8f5', borderRadius: 20, padding: 36,
          maxWidth: 380, width: '100%',
          boxShadow: '0 4px 24px rgba(65,105,225,0.08)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h1 style={{ fontFamily: font, fontSize: 24, fontWeight: 700, color: '#1a1a1a', margin: '0 0 10px' }}>
              Verify Email
            </h1>
            <p style={{ fontFamily: font, fontSize: 13, color: '#888', margin: 0, lineHeight: 1.6 }}>
              We've sent a verification code to your inbox. Please enter it below to secure your account and continue.
            </p>
            {email && (
              <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: '#4169e1', margin: '8px 0 0' }}>
                {email}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontFamily: font }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 6, display: 'block' }}>
                Code
              </label>
              <input
                type="text" inputMode="numeric" placeholder="Enter Code"
                maxLength={6} value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setError('') }}
                style={{
                  height: 50, padding: '0 16px',
                  border: '1px solid #e2e2e2', borderRadius: 10, background: '#fff',
                  fontFamily: font, fontSize: 16, color: '#1a1a1a',
                  outline: 'none', boxSizing: 'border-box', width: '100%',
                  letterSpacing: '0.15em',
                }}
                onFocus={e => e.target.style.borderColor = '#4169e1'}
                onBlur={e  => e.target.style.borderColor = '#e2e2e2'}
              />
            </div>

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
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button" onClick={handleResend}
                disabled={resendLoading || countdown > 0}
                style={{
                  background: 'none', border: 'none',
                  fontFamily: font, fontSize: 14, fontWeight: 600,
                  color: '#4169e1', textDecoration: 'underline',
                  cursor: (resendLoading || countdown > 0) ? 'not-allowed' : 'pointer',
                  opacity: (resendLoading || countdown > 0) ? 0.5 : 1,
                  padding: 0,
                }}
              >
                {countdown > 0 ? `Resend code (${countdown}s)` : resendLoading ? 'Sending…' : 'Resend code'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right: illustration */}
      <div style={{
        width: '45%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', position: 'relative', zIndex: 1,
      }}>
        <img
          src={illusOtp}
          alt="Email verification"
          style={{ width: '100%', maxWidth: 420, maxHeight: '75vh', objectFit: 'contain' }}
        />
      </div>
    </div>
  )
}
