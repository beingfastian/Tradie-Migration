/**
 * OAuthCallbackPage — handles the OAuth / social-login redirect.
 * Reads the access_token from the URL hash or query param, stores it,
 * then redirects to the correct dashboard based on the user's role.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveToken, getMe } from '../services/api'

const font = "'Urbanist', sans-serif"

export function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    async function handleCallback() {
      // Support token in URL hash (#access_token=...) or query (?token=...)
      const hash  = new URLSearchParams(window.location.hash.replace('#', '?'))
      const query = new URLSearchParams(window.location.search)
      const token =
        hash.get('access_token')  ||
        query.get('access_token') ||
        query.get('token')        ||
        null

      if (!token) {
        setError('No access token received. Please try logging in again.')
        setTimeout(() => navigate('/login', { replace: true }), 3000)
        return
      }

      try {
        saveToken(token)
        const user = await getMe(token)
        const role = user?.role || 'candidate'

        if (role === 'employer' || role === 'company_admin') {
          navigate('/company/dashboard', { replace: true })
        } else if (role === 'training_provider') {
          navigate('/trainer/dashboard', { replace: true })
        } else if (role === 'admin' || role === 'migration_agent') {
          navigate('/dashboard', { replace: true })
        } else {
          navigate('/worker/dashboard', { replace: true })
        }
      } catch {
        setError('Authentication failed. Redirecting to login…')
        setTimeout(() => navigate('/login', { replace: true }), 2500)
      }
    }

    handleCallback()
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f6f6f9', fontFamily: font,
    }}>
      <div style={{
        background: '#fff', borderRadius: 20, padding: '48px 56px',
        boxShadow: '0 4px 32px rgba(0,0,0,0.08)', textAlign: 'center', maxWidth: 400,
      }}>
        {error ? (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <p style={{ color: '#e53e3e', fontSize: 16, fontWeight: 600 }}>{error}</p>
          </>
        ) : (
          <>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              border: '4px solid #e0dff0', borderTopColor: '#5379f4',
              margin: '0 auto 24px',
              animation: 'spin 0.8s linear infinite',
            }}/>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1e1e1e', margin: '0 0 8px' }}>
              Signing you in…
            </h2>
            <p style={{ color: '#6a7380', fontSize: 15, margin: 0 }}>
              Please wait while we verify your account.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
