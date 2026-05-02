import { Routes, Route, Navigate } from 'react-router-dom'
import { LandingPage }            from './pages/LandingPage'
import { LoginPage }              from './pages/LoginPage'
import { RegisterPage }           from './pages/RegisterPage'
import { OtpPage }                from './pages/OtpPage'
import { ForgotPasswordPage }     from './pages/ForgotPasswordPage'
import { OAuthCallbackPage }      from './pages/OAuthCallbackPage'
import { DashboardPage }          from './pages/DashboardPage'

/* Worker */
import { WorkerSetup }       from './pages/worker/WorkerSetup'
import { WorkerHome }        from './pages/worker/WorkerHome'
import { WorkerDocuments }   from './pages/worker/WorkerDocuments'
import { WorkerEOIs }        from './pages/worker/WorkerEOIs'
import { WorkerCourses }     from './pages/worker/WorkerCourses'

/* Company / Employer */
import { CompanySetupFlow }        from './pages/company/CompanySetupFlow'
import { CompanyHome }             from './pages/company/CompanyHome'
import { CompanyFindCandidates }   from './pages/company/CompanyFindCandidates'
import { CompanyActiveJobs }       from './pages/company/CompanyActiveJobs'
import { CompanySentEOIs }         from './pages/company/CompanySentEOIs'

/* Training Provider */
import { TrainerSetupFlow }            from './pages/trainer/TrainerSetupFlow'
import { TrainerHome }                 from './pages/trainer/TrainerHome'
import { TrainerMyCourses }            from './pages/trainer/TrainerMyCourses'
import { TrainerStudentDirectory }     from './pages/trainer/TrainerStudentDirectory'
import { TrainerEnrollmentInquiries }  from './pages/trainer/TrainerEnrollmentInquiries'
import { TrainerCourseSummary }        from './pages/trainer/TrainerCourseSummary'

function App() {
  return (
    <Routes>
      {/* Landing */}
      <Route path="/"               element={<LandingPage />} />

      {/* Auth */}
      <Route path="/login"           element={<LoginPage />} />
      <Route path="/register"        element={<RegisterPage />} />
      <Route path="/verify-otp"      element={<OtpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/oauth-callback"  element={<OAuthCallbackPage />} />

      {/* ── Worker / Candidate dashboard ── */}
      <Route path="/worker/dashboard"  element={<WorkerHome />} />
      <Route path="/worker/profile"    element={<WorkerSetup />} />
      <Route path="/worker/documents"  element={<WorkerDocuments />} />
      <Route path="/worker/eois"       element={<WorkerEOIs />} />
      <Route path="/worker/courses"    element={<WorkerCourses />} />

      {/* Legacy worker setup entry points */}
      <Route path="/setup/worker/:step"    element={<WorkerSetup />} />
      <Route path="/setup/employer/:step"  element={<WorkerSetup />} />

      {/* ── Company / Employer dashboard ── */}
      <Route path="/company/dashboard"   element={<CompanyHome />} />
      <Route path="/company/profile"     element={<CompanySetupFlow />} />
      <Route path="/company/candidates"  element={<CompanyFindCandidates />} />
      <Route path="/company/jobs"        element={<CompanyActiveJobs />} />
      <Route path="/company/eois"        element={<CompanySentEOIs />} />

      {/* Legacy company setup entry points */}
      <Route path="/setup/company/:step"       element={<CompanySetupFlow />} />
      <Route path="/setup/employer-co/:step"   element={<CompanySetupFlow />} />

      {/* ── Training Provider dashboard ── */}
      <Route path="/trainer/dashboard"      element={<TrainerHome />} />
      <Route path="/trainer/profile"        element={<TrainerSetupFlow />} />
      <Route path="/trainer/courses"        element={<TrainerMyCourses />} />
      <Route path="/trainer/students"       element={<TrainerStudentDirectory />} />
      <Route path="/trainer/inquiries"      element={<TrainerEnrollmentInquiries />} />
      <Route path="/trainer/course-summary" element={<TrainerCourseSummary />} />

      {/* Legacy trainer setup entry points */}
      <Route path="/setup/trainer/:step"   element={<TrainerSetupFlow />} />
      <Route path="/setup/provider/:step"  element={<TrainerSetupFlow />} />

      {/* Legacy generic dashboard */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
