import { Routes, Route, Navigate } from 'react-router-dom'

// ── Auth pages (public) ───────────────────────────────────────────────────────
import { LandingPage }        from './pages/LandingPage'
import { RoleSelectPage }     from './pages/RoleSelectPage'
import { LoginPage }          from './pages/LoginPage'
import { RegisterPage }       from './pages/RegisterPage'
import { OtpPage }            from './pages/OtpPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { OAuthCallbackPage }  from './pages/OAuthCallbackPage'
import { ColorPalette }             from './pages/ColorPalette'
import { EmployerOnboardingPage }  from './pages/EmployerOnboardingPage'
import { CandidateOnboardingPage } from './pages/CandidateOnboardingPage'
import { TrainerOnboardingPage }   from './pages/TrainerOnboardingPage'

// ── Worker / Candidate pages ──────────────────────────────────────────────────
import { WorkerSetup }      from './pages/worker/WorkerSetup'
import { WorkerHome }       from './pages/worker/WorkerHome'
import { WorkerDocuments }  from './pages/worker/WorkerDocuments'
import { WorkerEOIs }       from './pages/worker/WorkerEOIs'
import { WorkerCourses }    from './pages/worker/WorkerCourses'
import { WorkerJobs }       from './pages/worker/WorkerJobs'

// ── Company / Employer pages ──────────────────────────────────────────────────
import { CompanySetupFlow }          from './pages/company/CompanySetupFlow'
import { CompanyHome }               from './pages/company/CompanyHome'
import { CompanyFindCandidates }     from './pages/company/CompanyFindCandidates'
import { CompanyActiveJobs }         from './pages/company/CompanyActiveJobs'
import { CompanySentEOIs }           from './pages/company/CompanySentEOIs'
import { CompanyCandidateProfile }   from './pages/company/CompanyCandidateProfile'

// ── Training Provider pages ───────────────────────────────────────────────────
import { TrainerSetupFlow }           from './pages/trainer/TrainerSetupFlow'
import { TrainerHome }                from './pages/trainer/TrainerHome'
import { TrainerMyCourses }           from './pages/trainer/TrainerMyCourses'
import { TrainerStudentDirectory }    from './pages/trainer/TrainerStudentDirectory'
import { TrainerEnrollmentInquiries } from './pages/trainer/TrainerEnrollmentInquiries'
import { TrainerCourseSummary }       from './pages/trainer/TrainerCourseSummary'

// ── Admin / Shared pages ──────────────────────────────────────────────────────
import { DashboardPage } from './pages/DashboardPage'

// ── Auth guard ────────────────────────────────────────────────────────────────
import { ProtectedRoute } from './components/ProtectedRoute'

// Role constants — keep in sync with backend RBAC
const CANDIDATE  = ['candidate']
const EMPLOYER   = ['employer', 'company_admin']
const TRAINER    = ['training_provider']
const ADMIN      = ['admin', 'migration_agent', 'company_admin']
const STAFF      = ['admin', 'migration_agent', 'company_admin', 'employer']
const ANY        = []   // any authenticated user, no role restriction

function App() {
  return (
    <Routes>

      {/* ── PUBLIC — no auth required ── */}
      <Route path="/"               element={<LandingPage />} />
      <Route path="/join"           element={<RoleSelectPage />} />
      <Route path="/login"          element={<LoginPage />} />
      <Route path="/register"       element={<RegisterPage />} />
      <Route path="/verify-otp"     element={<OtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
      <Route path="/palette"        element={<ColorPalette />} />
      <Route path="/onboarding/employer"  element={
        <ProtectedRoute roles={EMPLOYER}>
          <EmployerOnboardingPage />
        </ProtectedRoute>
      }/>
      <Route path="/onboarding/candidate" element={
        <ProtectedRoute roles={CANDIDATE}>
          <CandidateOnboardingPage />
        </ProtectedRoute>
      }/>
      <Route path="/onboarding/trainer" element={
        <ProtectedRoute roles={TRAINER}>
          <TrainerOnboardingPage />
        </ProtectedRoute>
      }/>

      {/* ── WORKER / CANDIDATE ── */}
      <Route path="/worker/dashboard" element={
        <ProtectedRoute roles={CANDIDATE}>
          <WorkerHome />
        </ProtectedRoute>
      }/>
      <Route path="/worker/profile" element={
        <ProtectedRoute roles={CANDIDATE}>
          <WorkerSetup />
        </ProtectedRoute>
      }/>
      <Route path="/worker/documents" element={
        <ProtectedRoute roles={CANDIDATE}>
          <WorkerDocuments />
        </ProtectedRoute>
      }/>
      <Route path="/worker/eois" element={
        <ProtectedRoute roles={CANDIDATE}>
          <WorkerEOIs />
        </ProtectedRoute>
      }/>
      <Route path="/worker/courses" element={
        <ProtectedRoute roles={CANDIDATE}>
          <WorkerCourses />
        </ProtectedRoute>
      }/>
      <Route path="/worker/jobs" element={
        <ProtectedRoute roles={CANDIDATE}>
          <WorkerJobs />
        </ProtectedRoute>
      }/>

      {/* Worker setup flow (first-time onboarding) */}
      <Route path="/setup/worker/:step" element={
        <ProtectedRoute roles={CANDIDATE}>
          <WorkerSetup />
        </ProtectedRoute>
      }/>

      {/* ── COMPANY / EMPLOYER ── */}
      <Route path="/company/dashboard" element={
        <ProtectedRoute roles={EMPLOYER}>
          <CompanyHome />
        </ProtectedRoute>
      }/>
      <Route path="/company/profile" element={
        <ProtectedRoute roles={EMPLOYER}>
          <CompanySetupFlow />
        </ProtectedRoute>
      }/>
      <Route path="/company/candidates" element={
        <ProtectedRoute roles={[...EMPLOYER, ...ADMIN]}>
          <CompanyFindCandidates />
        </ProtectedRoute>
      }/>
      <Route path="/company/jobs" element={
        <ProtectedRoute roles={EMPLOYER}>
          <CompanyActiveJobs />
        </ProtectedRoute>
      }/>
      <Route path="/company/eois" element={
        <ProtectedRoute roles={EMPLOYER}>
          <CompanySentEOIs />
        </ProtectedRoute>
      }/>
      <Route path="/company/candidates/:id" element={
        <ProtectedRoute roles={[...EMPLOYER, ...ADMIN]}>
          <CompanyCandidateProfile />
        </ProtectedRoute>
      }/>

      {/* Company setup flow (first-time onboarding) */}
      <Route path="/setup/company/:step" element={
        <ProtectedRoute roles={EMPLOYER}>
          <CompanySetupFlow />
        </ProtectedRoute>
      }/>
      <Route path="/setup/employer-co/:step" element={
        <ProtectedRoute roles={EMPLOYER}>
          <CompanySetupFlow />
        </ProtectedRoute>
      }/>
      {/* Legacy — some older links used /setup/employer/:step */}
      <Route path="/setup/employer/:step" element={
        <ProtectedRoute roles={EMPLOYER}>
          <CompanySetupFlow />
        </ProtectedRoute>
      }/>

      {/* ── TRAINING PROVIDER ── */}
      <Route path="/trainer/dashboard" element={
        <ProtectedRoute roles={TRAINER}>
          <TrainerHome />
        </ProtectedRoute>
      }/>
      <Route path="/trainer/profile" element={
        <ProtectedRoute roles={TRAINER}>
          <TrainerSetupFlow />
        </ProtectedRoute>
      }/>
      <Route path="/trainer/courses" element={
        <ProtectedRoute roles={TRAINER}>
          <TrainerMyCourses />
        </ProtectedRoute>
      }/>
      <Route path="/trainer/students" element={
        <ProtectedRoute roles={TRAINER}>
          <TrainerStudentDirectory />
        </ProtectedRoute>
      }/>
      <Route path="/trainer/inquiries" element={
        <ProtectedRoute roles={TRAINER}>
          <TrainerEnrollmentInquiries />
        </ProtectedRoute>
      }/>
      <Route path="/trainer/course-summary" element={
        <ProtectedRoute roles={TRAINER}>
          <TrainerCourseSummary />
        </ProtectedRoute>
      }/>

      {/* Trainer setup flow */}
      <Route path="/setup/trainer/:step" element={
        <ProtectedRoute roles={TRAINER}>
          <TrainerSetupFlow />
        </ProtectedRoute>
      }/>
      <Route path="/setup/provider/:step" element={
        <ProtectedRoute roles={TRAINER}>
          <TrainerSetupFlow />
        </ProtectedRoute>
      }/>

      {/* ── ADMIN / MIGRATION AGENT / COMPANY ADMIN ── */}
      <Route path="/dashboard" element={
        <ProtectedRoute roles={ADMIN}>
          <DashboardPage />
        </ProtectedRoute>
      }/>

      {/* ── FALLBACK ── */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

export default App