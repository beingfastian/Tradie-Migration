import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { forgotPassword, verifyResetOtp, resetPassword } from '../services/api'

import illusForgotPw       from '../assets/illus-forgot-pw.svg'
import illusBusinesswoman  from '../assets/illus-businesswoman.svg'
import illusVerifyEmail    from '../assets/illus-verify-email.svg'
import illusResetPw        from '../assets/illus-reset-pw.svg'

import confettiGroup       from '../assets/confetti-group-fp.svg'
import confettiGroup1      from '../assets/confetti-group1-fp.svg'
import confettiGroup2      from '../assets/confetti-group2-fp.svg'
import confettiGroup3      from '../assets/confetti-group3-fp.svg'

const font = "'Urbanist', sans-serif"

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
function BgDecorations({ includeDarkRings }) {
  return (
    <>
      {/* Top-right blobs */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 200, height: 180, background: '#b8d4f0', borderRadius: '80% 20% 80% 20%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 60, right: 60, width: 120, height: 110, background: '#c8e6a0', borderRadius: '20% 80% 20% 80%', pointerEvents: 'none' }} />
      {/* Bottom-left blobs */}
      <div style={{ position: 'absolute', bottom: -30, left: -30, width: 200, height: 180, background: '#a0d8b0', borderRadius: '20% 80% 20% 80%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 60, left: 60, width: 120, height: 100, background: '#d4e8a0', borderRadius: '80% 20% 80% 20%', pointerEvents: 'none' }} />
      {/* Orange filled dots */}
      <div style={{ position: 'absolute', top: 120, left: 80, width: 5, height: 5, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 200, right: 200, width: 4, height: 4, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 180, right: 120, width: 5, height: 5, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 100, left: 200, width: 4, height: 4, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      {/* Orange ring dots */}
      <div style={{ position: 'absolute', top: 80, right: 300, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 300, left: 40, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 250, right: 60, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 80, left: 300, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      {/* Dark/blue ring dots (for forgot/reset pages) */}
      {includeDarkRings && (
        <>
          <div style={{ position: 'absolute', top: 160, right: 100, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #3a4a8a', background: 'transparent', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 160, left: 100, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #3a4a8a', background: 'transparent', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 240, left: 160, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #3a4a8a', background: 'transparent', pointerEvents: 'none' }} />
        </>
      )}
    </>
  )
}

/* ── Shared card style ── */
const cardStyle = {
  background: '#dce8f5',
  borderRadius: 20,
  padding: 36,
  maxWidth: 380,
  width: '100%',
  boxShadow: '0 4px 24px rgba(65,105,225,0.08)',
}

const inputStyle = {
  height: 50, padding: '0 16px',
  border: '1px solid #e2e2e2', borderRadius: 10, background: '#fff',
  fontFamily: font, fontSize: 15, color: '#1a1a1a',
  outline: 'none', boxSizing: 'border-box', width: '100%',
}

const labelStyle = {
  fontFamily: font, fontSize: 14, fontWeight: 600, color: '#1a1a1a', marginBottom: 6, display: 'block',
}

const btnStyle = {
  width: '100%', height: 50,
  background: '#4169e1', color: '#fff', border: 'none', borderRadius: 30,
  fontFamily: font, fontSize: 15, fontWeight: 700,
  cursor: 'pointer', transition: 'background 0.18s',
}

function ErrorBox({ msg }) {
  return (
    <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 8, padding: '10px 14px', fontSize: 13, fontFamily: font, marginBottom: 14 }}>
      {msg}
    </div>
  )
}

/* ── Success Modal (Step 5) ── */
function SuccessModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(60,60,60,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 100, padding: '1rem',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 20, padding: 40,
        maxWidth: 400, width: '100%',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', gap: 24,
        alignItems: 'center',
      }}>
        {/* Confetti corners */}
        <img src={confettiGroup}  alt="" style={{ position: 'absolute', top: 0,    left: 0,   width: 100, pointerEvents: 'none' }} />
        <img src={confettiGroup1} alt="" style={{ position: 'absolute', top: 0,    right: 0,  width: 100, pointerEvents: 'none' }} />
        <img src={confettiGroup2} alt="" style={{ position: 'absolute', bottom: 0, left: 0,   width: 90,  pointerEvents: 'none' }} />
        <img src={confettiGroup3} alt="" style={{ position: 'absolute', bottom: 0, right: 0,  width: 90,  pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
          {/* Orange circle with checkmark */}
          <div style={{
            width: 70, height: 70, borderRadius: '50%', background: '#f26f37',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="32" height="26" viewBox="0 0 40 32" fill="none">
              <path d="M3 16L15 28L37 4" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Scattered colored dots around the circle */}
          <div style={{ position: 'absolute', top: -8, left: '30%', width: 6, height: 6, borderRadius: '50%', background: '#f26f37' }} />
          <div style={{ position: 'absolute', top: 10, right: '25%', width: 5, height: 5, borderRadius: '50%', background: '#4169e1' }} />
          <div style={{ position: 'absolute', top: 50, left: '15%', width: 5, height: 5, borderRadius: '50%', background: '#c8e6a0' }} />
          <div style={{ position: 'absolute', top: 50, right: '15%', width: 5, height: 5, borderRadius: '50%', background: '#b8d4f0' }} />

          <div>
            <h2 style={{ fontFamily: font, fontSize: 22, fontWeight: 700, color: '#1a1a1a', margin: '0 0 10px', lineHeight: 1.3 }}>
              Password updated successfully!
            </h2>
            <p style={{ fontFamily: font, fontSize: 13, color: '#888', margin: 0, lineHeight: 1.6 }}>
              Your account is now secure. You can use your new password to sign in and access your professional ecosystem.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{ ...btnStyle, position: 'relative', zIndex: 1 }}
          onMouseEnter={e => e.currentTarget.style.background = '#3458c4'}
          onMouseLeave={e => e.currentTarget.style.background = '#4169e1'}
        >
          Back to Login
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════════════════════════ */
export function ForgotPasswordPage() {
  const navigate = useNavigate()

  const [step,            setStep]            = useState(1)
  const [email,           setEmail]           = useState('')
  const [otp,             setOtp]             = useState('')
  const [resetToken,      setResetToken]      = useState('')
  const [newPassword,     setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPw,          setShowPw]          = useState(false)
  const [showPw2,         setShowPw2]         = useState(false)
  const [error,           setError]           = useState('')
  const [loading,         setLoading]         = useState(false)
  const [showModal,       setShowModal]       = useState(false)

  async function handleEmailSubmit(e) {
    e.preventDefault()
    if (!email) { setError('Email is required.'); return }
    setLoading(true); setError('')
    try { await forgotPassword({ email }) } catch { /* no enumeration */ }
    finally { setLoading(false); setStep(2) }
  }

  async function handleOtpSubmit() {
    if (otp.length < 6) { setError('Please enter the 6-digit code.'); return }
    setLoading(true); setError('')
    try {
      const data = await verifyResetOtp({ email, otp_code: otp })
      setResetToken(data.access_token)
      setStep(4)
    } catch (err) {
      setError(err.detail || 'Invalid or expired code.')
    } finally { setLoading(false) }
  }

  async function handleResetSubmit() {
    if (!newPassword)                    { setError('Password is required.'); return }
    if (newPassword.length < 8)          { setError('Minimum 8 characters.'); return }
    if (!/[A-Z]/.test(newPassword))      { setError('Must include an uppercase letter.'); return }
    if (!/\d/.test(newPassword))         { setError('Must include a number.'); return }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return }
    setLoading(true); setError('')
    try {
      await resetPassword({ reset_token: resetToken, new_password: newPassword })
      setShowModal(true)
    } catch (err) {
      setError(err.detail || 'Failed to reset password. Please start over.')
    } finally { setLoading(false) }
  }

  /* ════════════════════════════════════════════════════════
     STEP 1 — Enter email   (Card LEFT, Illustration RIGHT)
  ════════════════════════════════════════════════════════ */
  if (step === 1) return (
    <div style={{
      position: 'relative', overflow: 'hidden', height: '100vh',
      background: '#f8f8f8', fontFamily: font,
      display: 'flex', alignItems: 'stretch',
    }}>
      <BgDecorations includeDarkRings />

      {/* Left: form card */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', position: 'relative', zIndex: 1, overflowY: 'auto',
      }}>
        <div style={cardStyle}>
          <h1 style={{ fontFamily: font, fontSize: 26, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
            Forgot Password?
          </h1>
          <p style={{ fontFamily: font, fontSize: 14, color: '#888', margin: '0 0 24px', lineHeight: 1.5 }}>
            Please enter email address you use to sign in.
          </p>

          {error && <ErrorBox msg={error} />}

          <form onSubmit={handleEmailSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                type="email" placeholder="Enter Email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#4169e1'}
                onBlur={e  => e.target.style.borderColor = '#e2e2e2'}
              />
            </div>
            <button
              type="submit" disabled={loading}
              style={{ ...btnStyle, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3458c4' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4169e1' }}
            >
              {loading ? 'Sending…' : 'Send'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ fontFamily: font, fontSize: 14, color: '#4169e1', fontWeight: 600, textDecoration: 'none' }}>
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right: illustration */}
      <div style={{
        width: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', position: 'relative', zIndex: 1,
      }}>
        <img src={illusForgotPw} alt="Forgot password" style={{ width: '100%', maxWidth: 420, maxHeight: '75vh', objectFit: 'contain' }}/>
      </div>
    </div>
  )

  /* ════════════════════════════════════════════════════════
     STEP 2 — Sent confirmation  (Illustration LEFT, Card RIGHT)
  ════════════════════════════════════════════════════════ */
  if (step === 2) return (
    <div style={{
      position: 'relative', overflow: 'hidden', height: '100vh',
      background: '#f8f8f8', fontFamily: font,
      display: 'flex', alignItems: 'stretch',
    }}>
      <BgDecorations includeDarkRings />

      {/* Left: illustration */}
      <div style={{
        width: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', position: 'relative', zIndex: 1,
      }}>
        <img src={illusBusinesswoman} alt="Check email" style={{ width: '100%', maxWidth: 420, maxHeight: '75vh', objectFit: 'contain' }}/>
      </div>

      {/* Right: form card */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', position: 'relative', zIndex: 1, overflowY: 'auto',
      }}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h1 style={{ fontFamily: font, fontSize: 26, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
              Forgot Password ?
            </h1>
            <p style={{ fontFamily: font, fontSize: 14, color: '#888', margin: 0, lineHeight: 1.5 }}>
              We will send you reset Instructions by email.
            </p>
          </div>

          {/* Info box */}
          <div style={{
            borderLeft: '4px solid #4169e1',
            background: 'rgba(65,105,225,0.05)',
            padding: 14, borderRadius: 8,
            display: 'flex', gap: 10, alignItems: 'flex-start',
            marginBottom: 24,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
              <circle cx="12" cy="12" r="10" stroke="#4169e1" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="#4169e1" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1" fill="#4169e1"/>
            </svg>
            <p style={{ fontFamily: font, fontSize: 13, color: '#1a1a1a', margin: 0, lineHeight: 1.6 }}>
              If this email address is in our database, we'll send you an email with code and instrucions for resetting your password.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={() => setStep(3)}
              style={{
                background: 'none', border: 'none', padding: 0,
                fontFamily: font, fontSize: 14, fontWeight: 600,
                color: '#4169e1', textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Enter code
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  /* ════════════════════════════════════════════════════════
     STEP 3 — OTP for reset  (Card LEFT, Illustration RIGHT)
  ════════════════════════════════════════════════════════ */
  if (step === 3) return (
    <div style={{
      position: 'relative', overflow: 'hidden', height: '100vh',
      background: '#f8f8f8', fontFamily: font,
      display: 'flex', alignItems: 'stretch',
    }}>
      <BgDecorations includeDarkRings />

      {/* Left: form card */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', position: 'relative', zIndex: 1, overflowY: 'auto',
      }}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <h1 style={{ fontFamily: font, fontSize: 26, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
              Verify Email
            </h1>
            <p style={{ fontFamily: font, fontSize: 13, color: '#888', margin: 0, lineHeight: 1.6 }}>
              Please enter code sent on email address to reset your password.
            </p>
          </div>

          {error && <ErrorBox msg={error} />}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Code</label>
              <input
                type="text" inputMode="numeric" placeholder="Enter Code"
                maxLength={6} value={otp}
                onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setError('') }}
                style={{ ...inputStyle, letterSpacing: '0.15em' }}
                onFocus={e => e.target.style.borderColor = '#4169e1'}
                onBlur={e  => e.target.style.borderColor = '#e2e2e2'}
              />
            </div>
            <button
              type="button" onClick={handleOtpSubmit} disabled={loading}
              style={{ ...btnStyle, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3458c4' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4169e1' }}
            >
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => { setStep(1); setOtp(''); setError('') }}
                style={{ background: 'none', border: 'none', padding: 0, fontFamily: font, fontSize: 14, fontWeight: 600, color: '#4169e1', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Resend code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right: illustration */}
      <div style={{
        width: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', position: 'relative', zIndex: 1,
      }}>
        <img src={illusVerifyEmail} alt="Verify email" style={{ width: '100%', maxWidth: 420, maxHeight: '75vh', objectFit: 'contain' }}/>
      </div>
    </div>
  )

  /* ════════════════════════════════════════════════════════
     STEP 4 — New password  (Illustration LEFT, Card RIGHT)
     + Step 5 success modal overlay
  ════════════════════════════════════════════════════════ */
  return (
    <div style={{
      position: 'relative', overflow: 'hidden', height: '100vh',
      background: '#f8f8f8', fontFamily: font,
      display: 'flex', alignItems: 'stretch',
    }}>
      <BgDecorations includeDarkRings />

      {/* Left: illustration */}
      <div style={{
        width: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', position: 'relative', zIndex: 1,
      }}>
        <img src={illusResetPw} alt="Reset password" style={{ width: '100%', maxWidth: 420, maxHeight: '75vh', objectFit: 'contain' }}/>
      </div>

      {/* Right: form card */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 36px', position: 'relative', zIndex: 1, overflowY: 'auto',
      }}>
        <div style={cardStyle}>
          <h1 style={{ fontFamily: font, fontSize: 26, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>
            Reset Password
          </h1>
          <p style={{ fontFamily: font, fontSize: 14, color: '#888', margin: '0 0 24px', lineHeight: 1.5 }}>
            Set your new password
          </p>

          {error && <ErrorBox msg={error} />}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter Password"
                  value={newPassword}
                  onChange={e => { setNewPassword(e.target.value); setError('') }}
                  style={{ ...inputStyle, paddingRight: 46 }}
                  onFocus={e => e.target.style.borderColor = '#4169e1'}
                  onBlur={e  => e.target.style.borderColor = '#e2e2e2'}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 0, display: 'flex' }}>
                  {showPw ? <EyeOff/> : <EyeOpen/>}
                </button>
              </div>
            </div>

            {/* Repeat Password */}
            <div>
              <label style={labelStyle}>Repeat Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPw2 ? 'text' : 'password'}
                  placeholder="Enter Repeat Password"
                  value={confirmPassword}
                  onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                  style={{ ...inputStyle, paddingRight: 46 }}
                  onFocus={e => e.target.style.borderColor = '#4169e1'}
                  onBlur={e  => e.target.style.borderColor = '#e2e2e2'}
                />
                <button type="button" onClick={() => setShowPw2(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 0, display: 'flex' }}>
                  {showPw2 ? <EyeOff/> : <EyeOpen/>}
                </button>
              </div>
            </div>

            <button
              type="button" onClick={handleResetSubmit} disabled={loading}
              style={{ ...btnStyle, opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#3458c4' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#4169e1' }}
            >
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <SuccessModal onClose={() => navigate('/login', {
          state: { message: 'Password reset successfully. Please sign in.' }
        })} />
      )}
    </div>
  )
}
