/**
 * ProtectedRoute — wraps any route that requires authentication.
 *
 * Usage:
 *   <ProtectedRoute>                          → any logged-in user
 *   <ProtectedRoute roles={['employer']}>     → only employer role
 *   <ProtectedRoute roles={['candidate']}>    → only candidate role
 *
 * Behaviour:
 *   - No token            → redirect to /login (saves intended path for post-login redirect)
 *   - Token but wrong role → redirect to their own dashboard
 *   - Token + correct role → render children
 */
import { Navigate, useLocation } from 'react-router-dom'

const ROLE_DASHBOARDS = {
  candidate:         '/worker/dashboard',
  employer:          '/company/dashboard',
  training_provider: '/trainer/dashboard',
  admin:             '/dashboard',
  migration_agent:   '/dashboard',
  company_admin:     '/dashboard',
}

function getTokenPayload() {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) return null
    const payload = JSON.parse(atob(token.split('.')[1]))
    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem('access_token')
      return null
    }
    return payload
  } catch {
    return null
  }
}

export function ProtectedRoute({ children, roles }) {
  const location = useLocation()
  const payload  = getTokenPayload()

  // Not logged in → go to login, remember where they were trying to go
  if (!payload) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  const userRole = payload.role

  // Wrong role → send to their own dashboard
  if (roles && roles.length > 0 && !roles.includes(userRole)) {
    const dashboard = ROLE_DASHBOARDS[userRole] || '/'
    return <Navigate to={dashboard} replace />
  }

  return children
}