import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage }        from './pages/LandingPage'
import { LoginPage }          from './pages/LoginPage'
import { RegisterPage }       from './pages/RegisterPage'
import { OtpPage }            from './pages/OtpPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { OAuthCallbackPage }  from './pages/OAuthCallbackPage'
import { WorkerSetup }        from './pages/worker/WorkerSetup'
import { WorkerHome }         from './pages/worker/WorkerHome'
import { WorkerDocuments }    from './pages/worker/WorkerDocuments'
import { WorkerEOIs }         from './pages/worker/WorkerEOIs'
import { WorkerCourses }      from './pages/worker/WorkerCourses'
import { CompanySetup }       from './pages/company/CompanySetup'
import { TrainerSetup }       from './pages/trainer/TrainerSetup'
import { DashboardPage }      from './pages/DashboardPage'

function App() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/" element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/verify-otp"      element={<OtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/oauth-callback"  element={<OAuthCallbackPage />} />

      {/* Worker dashboard */}
      <Route path="/worker/dashboard"  element={<WorkerHome />} />
      <Route path="/worker/profile"    element={<WorkerSetup />} />
      <Route path="/worker/documents"  element={<WorkerDocuments />} />
      <Route path="/worker/eois"       element={<WorkerEOIs />} />
      <Route path="/worker/courses"    element={<WorkerCourses />} />

      {/* Worker / Candidate setup (legacy entry points) */}
      <Route path="/setup/worker/:step"   element={<WorkerSetup />} />
      <Route path="/setup/employer/:step" element={<WorkerSetup />} />

      {/* Employer / Company setup */}
      <Route path="/setup/company/:step"      element={<CompanySetup />} />
      <Route path="/setup/employer-co/:step"  element={<CompanySetup />} />

      {/* Training Provider setup */}
      <Route path="/setup/trainer/:step"  element={<TrainerSetup />} />
      <Route path="/setup/provider/:step" element={<TrainerSetup />} />

      {/* Legacy dashboard — redirect candidates to worker dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
