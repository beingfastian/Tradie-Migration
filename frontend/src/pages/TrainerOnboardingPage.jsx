/**
 * TrainerOnboardingPage — 3-step trainer/training-provider onboarding + success modal
 * Figma nodes: 1-929 (Step 1), 1-1274 (Step 2), 1-1728 (Step 3), 1-1844 (Success)
 * Route: /onboarding/trainer
 */
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import illustrationStep1 from '../assets/illus-online-learning.svg'
import illustrationStep2 from '../assets/illus-professor.svg'
import illustrationStep3 from '../assets/illus-train.svg'

const font = "'Urbanist', sans-serif"
const navy = '#1e1b5e'
const blue = '#4f6ef7'
const cardBg = '#eef2ff'
const gray = '#8e8d92'

const STEPS = [
  { label: 'Step 1', sub: 'Expert Identity' },
  { label: 'Step 2', sub: 'Training Services' },
  { label: 'Step 3', sub: 'Rates & Availability' },
]

const EXPERIENCE_OPTIONS = [
  'Less than 1 year', '1–2 years', '3–5 years', '5–10 years', '10–15 years', '15+ years',
]

const TIMEZONE_OPTIONS = [
  'UTC+0 — London', 'UTC+1 — Paris, Berlin', 'UTC+2 — Cairo, Athens',
  'UTC+3 — Moscow, Riyadh', 'UTC+4 — Dubai', 'UTC+5 — Karachi',
  'UTC+5:30 — Mumbai, Delhi', 'UTC+6 — Dhaka', 'UTC+7 — Bangkok',
  'UTC+8 — Beijing, Singapore, Perth', 'UTC+9 — Tokyo, Seoul',
  'UTC+10 — Sydney, Melbourne', 'UTC+10:30 — Adelaide',
  'UTC+11 — Lord Howe Island', 'UTC+12 — Auckland',
  'UTC-5 — New York', 'UTC-6 — Chicago', 'UTC-7 — Denver',
  'UTC-8 — Los Angeles', 'UTC-9 — Alaska', 'UTC-10 — Honolulu',
]

/* ─── Background decorations ─── */
function BgDecorations() {
  return (
    <>
      <div style={{ position: 'fixed', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(196,218,247,0.55)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: 30, right: 60, width: 180, height: 180, borderRadius: '50%', background: 'rgba(180,230,210,0.4)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: -60, left: -60, width: 280, height: 220, borderRadius: '60% 40% 50% 50%', background: 'rgba(200,235,200,0.5)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: 60, left: 20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(220,240,215,0.4)', pointerEvents: 'none', zIndex: 0 }} />
      {[
        [120, 90], [90, 130], [70, 165],
        [1340, 300], [1380, 480],
        [200, 700], [160, 740],
      ].map(([x, y], i) => (
        <div key={i} style={{ position: 'fixed', left: x, top: y, width: 22 + (i % 3) * 8, height: 22 + (i % 3) * 8, borderRadius: '50%', border: '2.5px solid #f26f37', opacity: 0.55, pointerEvents: 'none', zIndex: 0 }} />
      ))}
    </>
  )
}

/* ─── Left stepper ─── */
function Stepper({ current }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 170, flexShrink: 0 }}>
      {STEPS.map((s, i) => {
        const idx = i + 1
        const active = idx <= current
        const isCurrent = idx === current
        return (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: active ? navy : 'transparent',
                border: `2.5px solid ${active ? navy : '#c0bede'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {active && <svg width="10" height="10" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3.5" fill="#fff" /></svg>}
              </div>
              <div>
                <p style={{ fontFamily: font, fontWeight: 700, fontSize: 15, color: active ? navy : gray, margin: 0, lineHeight: 1.2 }}>{s.label}</p>
                <p style={{ fontFamily: font, fontSize: 12, color: isCurrent ? navy : gray, margin: 0, lineHeight: 1.3, marginTop: 2 }}>{s.sub}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 2, height: 36, background: active ? navy : '#e0deee', marginLeft: 13, marginTop: 2 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Field wrapper ─── */
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontFamily: font, fontSize: 13, fontWeight: 600, color: '#343434' }}>{label}</label>
      {children}
    </div>
  )
}

/* ─── Text input ─── */
function TInput({ placeholder, value, onChange }) {
  const [f, setF] = useState(false)
  return (
    <input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ height: 48, borderRadius: 10, border: `1.5px solid ${f ? blue : '#d0d5dd'}`, padding: '0 16px', fontFamily: font, fontSize: 15, color: '#343434', outline: 'none', width: '100%', boxSizing: 'border-box', background: '#fff' }}
    />
  )
}

/* ─── Select ─── */
function TSelect({ placeholder, value, onChange, options }) {
  const [f, setF] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ height: 48, borderRadius: 10, border: `1.5px solid ${f ? blue : '#d0d5dd'}`, padding: '0 40px 0 16px', fontFamily: font, fontSize: 15, color: value ? '#343434' : '#9ca3af', outline: 'none', width: '100%', background: '#fff', appearance: 'none', cursor: 'pointer', boxSizing: 'border-box' }}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
    </div>
  )
}

/* ─── Tag search input ─── */
function TagInput({ placeholder, tags, onChange }) {
  const [val, setVal] = useState('')
  const [f, setF] = useState(false)
  function add() {
    const t = val.trim()
    if (t && !tags.includes(t)) onChange([...tags, t])
    setVal('')
  }
  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '8px 12px', border: `1.5px solid ${f ? blue : '#d0d5dd'}`, borderRadius: 10, background: '#fff', minHeight: 48, alignItems: 'center', boxSizing: 'border-box' }}>
        {tags.map(t => (
          <span key={t} style={{ background: '#e8ecff', color: blue, borderRadius: 6, padding: '2px 8px', fontSize: 13, fontFamily: font, display: 'flex', alignItems: 'center', gap: 4 }}>
            {t}
            <span onClick={() => onChange(tags.filter(x => x !== t))} style={{ cursor: 'pointer', fontWeight: 700, lineHeight: 1 }}>×</span>
          </span>
        ))}
        <input value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() } }}
          onFocus={() => setF(true)} onBlur={() => { setF(false); add() }}
          placeholder={tags.length === 0 ? placeholder : ''}
          style={{ border: 'none', outline: 'none', fontFamily: font, fontSize: 15, flex: 1, minWidth: 100, background: 'transparent', color: '#343434' }}
        />
      </div>
      <p style={{ fontFamily: font, fontSize: 12, color: gray, margin: '4px 0 0' }}>Press Enter or comma to add</p>
    </div>
  )
}

/* ─── File upload box ─── */
function FileUpload({ label, file, onChange, accept = '.pdf' }) {
  const ref = useRef(null)
  const [drag, setDrag] = useState(false)
  function handleDrop(e) {
    e.preventDefault(); setDrag(false)
    const f = e.dataTransfer.files[0]
    if (f) onChange(f)
  }
  return (
    <div
      onClick={() => ref.current?.click()}
      onDragOver={e => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      style={{ border: `2px dashed ${drag ? blue : '#c0bede'}`, borderRadius: 12, padding: '20px', textAlign: 'center', cursor: 'pointer', background: drag ? '#f0f4ff' : 'transparent', transition: 'all 0.2s' }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 6 }}>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <p style={{ fontFamily: font, fontWeight: 700, fontSize: 14, color: '#343434', margin: '0 0 4px' }}>
        {file ? file.name : label}
      </p>
      <p style={{ fontFamily: font, fontSize: 13, color: gray, margin: 0 }}>Drag or Click to Browse</p>
      <input ref={ref} type="file" accept={accept} style={{ display: 'none' }} onChange={e => e.target.files[0] && onChange(e.target.files[0])} />
    </div>
  )
}

/* ─── Success Modal ─── */
function SuccessModal({ onGo }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: '48px 44px', maxWidth: 480, width: '90%', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
        {/* Icon + confetti */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f26f37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          {/* Party hat */}
          <svg style={{ position: 'absolute', top: -18, right: -8 }} width="32" height="40" viewBox="0 0 32 40" fill="none">
            <polygon points="16,2 2,36 30,36" fill="#1e1b5e" opacity="0.85" />
            <polygon points="16,2 10,18 22,18" fill="#fff" opacity="0.2" />
            <circle cx="2" cy="36" r="3" fill="#f26f37" />
            <circle cx="30" cy="36" r="3" fill="#f26f37" />
          </svg>
          {/* Confetti dots */}
          {[[-28,-8,'#f26f37'],[-20,12,'#4f6ef7'],[26,-4,'#f26f37'],[22,14,'#1e1b5e'],[-14,-20,'#4f6ef7'],[18,-18,'#f26f37']].map(([dx,dy,c],i) => (
            <div key={i} style={{ position: 'absolute', width: 7, height: 7, borderRadius: '50%', background: c, top: '50%', left: '50%', transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))` }} />
          ))}
        </div>

        <h2 style={{ fontFamily: font, fontWeight: 800, fontSize: 24, color: '#1a1a1a', margin: '0 0 12px' }}>Your expert profile is live!</h2>
        <p style={{ fontFamily: font, fontSize: 15, color: gray, margin: '0 0 32px', lineHeight: 1.6 }}>
          You're all set to start sharing your knowledge. We'll notify you as soon as companies or professionals request your services.
        </p>
        <button onClick={onGo}
          style={{ width: '100%', height: 52, background: blue, color: '#fff', border: 'none', borderRadius: 30, cursor: 'pointer', fontFamily: font, fontSize: 16, fontWeight: 700 }}>
          Go to Instructor Dashboard
        </button>
      </div>
    </div>
  )
}

/* ─── Main component ─── */
export function TrainerOnboardingPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)

  // Step 1
  const [headline, setHeadline] = useState('')
  const [expertise, setExpertise] = useState('')
  const [experience, setExperience] = useState('')

  // Step 2
  const [serviceTypes, setServiceTypes] = useState([])
  const [languages, setLanguages] = useState([])
  const [portfolio, setPortfolio] = useState('')
  const [certFile, setCertFile] = useState(null)

  // Step 3
  const [hourlyRate, setHourlyRate] = useState('')
  const [calendar, setCalendar] = useState('')
  const [timezone, setTimezone] = useState('')

  const illustrations = [illustrationStep1, illustrationStep2, illustrationStep3]

  const formTitles = [
    'Set up your Trainer profile',
    'How do you teach?',
    'Set your schedule',
  ]
  const formSubs = [
    'Showcase your expertise and start connecting with companies and professionals looking to grow.',
    'Tell us about the types of training services you offer to help us find the right students.',
    'Define your availability and pricing to start receiving training inquiries directly.',
  ]

  function handleNext() {
    if (step < 3) setStep(s => s + 1)
    else setShowSuccess(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', position: 'relative', overflow: 'hidden', fontFamily: font }}>
      <BgDecorations />

      {showSuccess && <SuccessModal onGo={() => navigate('/trainer/dashboard')} />}

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', minHeight: '100vh', padding: '40px 60px', gap: 48 }}>

        {/* Left stepper */}
        <Stepper current={step} />

        {/* Center form card */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: cardBg, borderRadius: 20, padding: '40px 44px', width: '100%', maxWidth: 500 }}>
            <h2 style={{ fontFamily: font, fontWeight: 800, fontSize: 26, color: '#1a1a1a', margin: '0 0 8px' }}>{formTitles[step - 1]}</h2>
            <p style={{ fontFamily: font, fontSize: 14, color: gray, margin: '0 0 28px', lineHeight: 1.5 }}>{formSubs[step - 1]}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {step === 1 && (
                <>
                  <Field label="Professional Headline">
                    <TInput placeholder="Enter Professional Headline  e.g., Certified Python Instructor" value={headline} onChange={setHeadline} />
                  </Field>
                  <Field label="Area of Expertise">
                    <TInput placeholder="Enter Your Area of Expertise  e.g., Technology, Leadership" value={expertise} onChange={setExpertise} />
                  </Field>
                  <Field label="Years of Experience">
                    <TSelect placeholder="Select Years of Experience" value={experience} onChange={setExperience} options={EXPERIENCE_OPTIONS} />
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <Field label="Service Types">
                    <TagInput placeholder="Search Service Types" tags={serviceTypes} onChange={setServiceTypes} />
                  </Field>
                  <Field label="Languages you teach in">
                    <TagInput placeholder="Search Languages" tags={languages} onChange={setLanguages} />
                  </Field>
                  <Field label="Links to Portfolio">
                    <TInput placeholder="Paste Links to Portfolio" value={portfolio} onChange={setPortfolio} />
                  </Field>
                  <FileUpload label="Upload Certifications (PDF)" file={certFile} onChange={setCertFile} accept=".pdf,.doc,.docx" />
                </>
              )}

              {step === 3 && (
                <>
                  <Field label="Hourly Rate ($)">
                    <TInput placeholder="Enter amount or range" value={hourlyRate} onChange={setHourlyRate} />
                  </Field>
                  <Field label="Connect Calendar">
                    <TInput placeholder="(Google/Outlook)" value={calendar} onChange={setCalendar} />
                  </Field>
                  <Field label="Timezone">
                    <TSelect placeholder="Choose Timezone" value={timezone} onChange={setTimezone} options={TIMEZONE_OPTIONS} />
                  </Field>
                </>
              )}

            </div>

            <button onClick={handleNext}
              style={{ width: '100%', height: 52, background: blue, color: '#fff', border: 'none', borderRadius: 30, cursor: 'pointer', fontFamily: font, fontSize: 16, fontWeight: 700, marginTop: 28 }}>
              {step < 3 ? 'Next Step' : 'Finish Setup'}
            </button>

            {step > 1 && (
              <p onClick={() => setStep(s => s - 1)}
                style={{ fontFamily: font, fontSize: 14, color: blue, textAlign: 'center', marginTop: 14, cursor: 'pointer', textDecoration: 'underline' }}>
                Go Back
              </p>
            )}
          </div>
        </div>

        {/* Right illustration */}
        <div style={{ width: '36%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={illustrations[step - 1]} alt="" style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
        </div>

      </div>
    </div>
  )
}
