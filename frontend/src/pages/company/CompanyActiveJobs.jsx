/**
 * CompanyActiveJobs — Active Job Postings table + 3-step Add Job wizard + View Job Role detail.
 * Matches PDF: table with All/Open/Filled tabs, search, filter, Grid/List toggle,
 * pagination, status badges; 3-step wizard (Basic Info → Salary → Description);
 * View Job Role Posting detail page.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyLayout } from './CompanyLayout'
import { getToken, getMe, listJobs, createJob, updateJobStatus as apiUpdateJobStatus, deleteJob as apiDeleteJob } from '../../services/api'

const font = "'Urbanist', sans-serif"


const STATUS_COLORS = {
  'Hiring':       { bg:'#e8f5e9', color:'#129578' },
  'Closing Soon': { bg:'#fff3e8', color:'#f26f37' },
  'On Hold':      { bg:'#fff0f0', color:'#e53e3e' },
  'Draft':        { bg:'#f0f0f4', color:'#6a7380' },
}

const TABS = ['All Roles', 'Open Roles', 'Filled / Archived']
const TRADE_CATEGORIES = ['Electrical & Energy','Plumbing','HVAC','Solar','Construction','Mining']
const EMPLOYMENT_TYPES = ['Full-Time / Permanent','Part-Time','Contract / Casual','Apprenticeship']
const VISA_OPTIONS     = ['Available (Standard Business Sponsor)','Not Available','Direct Hire Only']
const CURRENCIES       = ['AUD / Per Annum','AUD / Per Hour','USD / Per Annum']

/* ── Status Badge with dropdown ── */
function StatusBadge({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const c = STATUS_COLORS[value] || { bg:'#f0f0f4', color:'#6a7380' }
  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      <div onClick={() => setOpen(o=>!o)}
        style={{ display:'inline-flex', alignItems:'center', gap:4, background:c.bg,
          borderRadius:20, padding:'5px 12px 5px 14px', cursor:'pointer' }}>
        <span style={{ fontSize:12, fontWeight:700, color:c.color, fontFamily:font }}>{value}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {open && (
        <div style={{ position:'absolute', top:'110%', left:0, background:'#fff', borderRadius:10,
          boxShadow:'0 4px 20px rgba(0,0,0,0.12)', zIndex:50, minWidth:130, overflow:'hidden' }}>
          {Object.keys(STATUS_COLORS).map(s => (
            <div key={s} onClick={()=>{ onChange(s); setOpen(false) }}
              style={{ padding:'10px 16px', fontFamily:font, fontSize:13, fontWeight:600,
                cursor:'pointer', color: STATUS_COLORS[s].color, background:'#fff' }}
              onMouseEnter={e=>e.currentTarget.style.background='#f6f6f9'}
              onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Shared input helpers ── */
const inputStyle = {
  width:'100%', height:44, border:'1.5px solid #e0dff0', borderRadius:10,
  padding:'0 14px', fontFamily:font, fontSize:14, color:'#343434',
  outline:'none', boxSizing:'border-box', background:'#fff',
}
const labelStyle = { fontFamily:font, fontSize:14, fontWeight:600, color:'#343434', display:'block', marginBottom:6 }

function Field({ label, children }) {
  return <div><label style={labelStyle}>{label}</label>{children}</div>
}

function TInput({ placeholder, value, onChange, type='text' }) {
  return (
    <input type={type} placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)}
      style={inputStyle}/>
  )
}

function TSelect({ placeholder, value, onChange, options=[] }) {
  return (
    <div style={{ position:'relative' }}>
      <select value={value} onChange={e=>onChange(e.target.value)}
        style={{ ...inputStyle, appearance:'none', paddingRight:36, color: value?'#343434':'#9ca3af' }}>
        <option value="">{placeholder}</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
      <svg style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  )
}

function Toggle({ label, value, onChange }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <span style={{ fontFamily:font, fontSize:13, fontWeight:600, color:'#343434' }}>{label}</span>
      <div style={{ display:'flex', gap:10 }}>
        {['Yes','No'].map(opt => (
          <label key={opt} style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
            <div style={{ width:18, height:18, borderRadius:'50%', border:'2px solid',
              borderColor: value===opt ? '#156dbf' : '#d0d5dd',
              background: value===opt ? '#156dbf' : '#fff',
              display:'flex', alignItems:'center', justifyContent:'center' }}
              onClick={()=>onChange(opt)}>
              {value===opt && <div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }}/>}
            </div>
            <span style={{ fontFamily:font, fontSize:14, color:'#343434' }}>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

/* ── Step indicator (for 3-step wizard) ── */
function StepSidebar({ step }) {
  const steps = [
    { n:1, label:'Basic Job Information',  sub:'Section 1' },
    { n:2, label:'Salary & Compensation',  sub:'Section 2' },
    { n:3, label:'Detailed Description',   sub:'Section 3' },
  ]
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      {steps.map((s,i) => {
        const active  = step === s.n
        const done    = step > s.n
        return (
          <div key={s.n} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', border:'2px solid',
                borderColor: active||done ? '#156dbf' : '#e0dff0',
                background: active||done ? '#156dbf' : '#fff',
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {done
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  : <span style={{ fontFamily:font, fontSize:12, fontWeight:700, color: active?'#fff':'#6a7380' }}>{s.n}</span>
                }
              </div>
              {i < steps.length-1 && (
                <div style={{ width:2, height:36, background: done?'#156dbf':'#e0dff0', margin:'4px 0' }}/>
              )}
            </div>
            <div style={{ paddingTop:4, paddingBottom: i<steps.length-1 ? 36 : 0 }}>
              <div style={{ fontFamily:font, fontSize:14, fontWeight:700,
                color: active ? '#156dbf' : done ? '#343434' : '#9ca3af' }}>
                {s.sub}
              </div>
              <div style={{ fontFamily:font, fontSize:12, color: active ? '#156dbf' : '#9ca3af', marginTop:2 }}>
                {s.label}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ── Rich text description editor ── */
function RichField({ label, value, onChange }) {
  const [bold, setBold]   = useState(false)
  const [italic,setItalic]= useState(false)
  return (
    <div>
      <label style={{ ...labelStyle, marginBottom:10 }}>{label}</label>
      <div style={{ border:'1.5px solid #e0dff0', borderRadius:12, overflow:'hidden' }}>
        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', gap:2, padding:'8px 12px',
          borderBottom:'1px solid #f0f0f4', background:'#fafafa' }}>
          {[{l:'B',s:{fontWeight:700},act:()=>setBold(b=>!b),on:bold},
            {l:'I',s:{fontStyle:'italic'},act:()=>setItalic(i=>!i),on:italic}].map(btn=>(
            <button key={btn.l} onClick={btn.act}
              style={{ width:28, height:28, borderRadius:6, border:'none', cursor:'pointer',
                fontFamily:font, fontSize:13, ...btn.s,
                background:btn.on?'#e8ecff':'transparent',
                color:btn.on?'#5379f4':'#6a7380' }}>
              {btn.l}
            </button>
          ))}
          <div style={{ width:1, height:18, background:'#e0dff0', margin:'0 6px' }}/>
          {['≡','—','⊘'].map((ic,i)=>(
            <button key={i} style={{ width:28, height:28, borderRadius:6, border:'none',
              cursor:'pointer', background:'transparent', color:'#6a7380', fontSize:14 }}>
              {ic}
            </button>
          ))}
          <div style={{ marginLeft:'auto', fontFamily:font, fontSize:12, color:'#9ca3af' }}>
            {(value||'').length}/350
          </div>
        </div>
        <textarea value={value} onChange={e=>onChange(e.target.value)}
          style={{ width:'100%', minHeight:130, border:'none', padding:'14px 16px',
            fontFamily:font, fontSize:14, color:'#343434', resize:'vertical',
            outline:'none', boxSizing:'border-box', lineHeight:1.6,
            fontWeight: bold?700:400, fontStyle: italic?'italic':'normal' }}/>
      </div>
    </div>
  )
}

/* ── View Job Role Posting ── */
function ViewJobRole({ job, onBack }) {
  const rows = [
    ['Role/Job Title', job.title],
    ['Trade Category', job.tradeCategory || 'Electrical & Energy'],
    ['Visa Sponsorship', job.visa || 'Available (Standard Business Sponsor)'],
    ['Location', job.location],
    ['Employment Type', job.employmentType || 'Full-Time / Permanent'],
    ['Minimum Salary', job.minSalary ? `${job.minSalary}` : '95,000'],
    ['Maximum Salary', job.maxSalary ? `${job.maxSalary}` : '115,000'],
    ['Currency/Frequency', job.currency || 'AUD / Per Annum'],
    ['Company Vehicle', job.vehicle || 'Yes'],
    ['Overtime', job.overtime || 'Yes'],
  ]

  const desc = [
    { title:'Role Overview', content: job.roleOverview || 'We are seeking a highly skilled and motivated Licensed A-Grade Electrician to join our industrial projects team. You will be responsible for the installation, maintenance, and repair of electrical systems across major infrastructure sites, ensuring all work meets Australian Standards (AS/NZS 3000).' },
    { title:'Key Requirements', content: job.keyReqs || '• Valid Australian State Electrical License (A-Grade)\n• Minimum 3–5 years of industrial/commercial experience\n• Current White Card & commitment to OH&S\n• Proficient in reading blueprints & fault finding\n• Ability to sign off on Certificates of Electrical Safety (COES)' },
    { title:'Benefits & Perks', content: job.benefits || '• Competitive Salary: $95,000 – $115,000 + Super\n• Abundant Overtime at penalty rates\n• Fully maintained Company Vehicle & Fuel Card\n• Access to specialized gap training via RTO partners\n• Sponsorship available for qualified international candidates' },
    { title:'Primary Responsibilities', content: job.responsibilities || '• Executing electrical installations on large-scale infrastructure\n• Testing and commissioning electrical circuits\n• Performing routine maintenance and emergency repairs\n• Mentoring apprentices and maintaining site documentation' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button onClick={onBack}
            style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center', color:'#6a7380' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <div>
            <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:0 }}>
              View job Role posting
            </h2>
          </div>
        </div>
        <button onClick={onBack}
          style={{ height:40, padding:'0 24px', background:'#156dbf', color:'#fff', border:'none',
            borderRadius:10, fontFamily:font, fontSize:14, fontWeight:600, cursor:'pointer' }}>
          Edit
        </button>
      </div>

      {/* Details card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'36px', boxShadow:'0 2px 16px rgba(0,0,0,0.06)', marginBottom:20 }}>
        <h3 style={{ fontFamily:font, fontSize:18, fontWeight:700, color:'#343434', margin:'0 0 24px',
          paddingBottom:16, borderBottom:'1px solid #f0f0f4' }}>
          Job Role Details
        </h3>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'20px 32px', marginBottom:32 }}>
          {rows.map(([label, val]) => (
            <div key={label}>
              <div style={{ fontFamily:font, fontSize:12, color:'#9ca3af', marginBottom:4 }}>{label}</div>
              <div style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434' }}>{val || '—'}</div>
            </div>
          ))}
        </div>

        <h3 style={{ fontFamily:font, fontSize:18, fontWeight:700, color:'#343434', margin:'0 0 20px' }}>
          Detailed Description
        </h3>
        {desc.map(d => (
          <div key={d.title} style={{ marginBottom:20 }}>
            <div style={{ fontFamily:font, fontSize:13, color:'#9ca3af', marginBottom:6 }}>{d.title}</div>
            <div style={{ fontFamily:font, fontSize:14, color:'#343434', lineHeight:1.7,
              whiteSpace:'pre-line' }}>
              {d.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Add Job Wizard ── */
function AddJobWizard({ onBack, onDone }) {
  const [step, setStep] = useState(1)
  // Step 1
  const [title,    setTitle]    = useState('')
  const [tradecat, setTradecat] = useState('')
  const [location, setLocation] = useState('')
  const [empType,  setEmpType]  = useState('')
  const [visa,     setVisa]     = useState('')
  // Step 2
  const [minSal,   setMinSal]   = useState('')
  const [maxSal,   setMaxSal]   = useState('')
  const [currency, setCurrency] = useState('')
  const [vehicle,  setVehicle]  = useState('Yes')
  const [overtime, setOvertime] = useState('Yes')
  const [superann, setSuperann] = useState('No')
  // Step 3
  const [roleOv,   setRoleOv]   = useState('')
  const [keyReqs,  setKeyReqs]  = useState('')
  const [benefits, setBenefits] = useState('')
  const [resps,    setResps]    = useState('')

  const stepTitles = ['Basic Job Information', 'Salary & Compensation', 'Detailed Description']
  const stepSubs   = [
    'Add primary details about the position to help candidates find your role.',
    'Define the salary range and additional benefits included with this role.',
    'Provide a comprehensive breakdown of the role to help candidates understand the specific requirements, daily responsibilities, and the unique benefits your company offers.',
  ]

  /* Decorative illustrations per step */
  const StepIllus = ({ step }) => {
    const illus = {
      1: (
        <svg viewBox="0 0 200 260" width="200" height="260">
          <rect x="60" y="80" width="80" height="100" rx="8" fill="#f0f4ff" stroke="#5379f4" strokeWidth="2"/>
          <rect x="75" y="95" width="50" height="6" rx="3" fill="#5379f4"/>
          <rect x="75" y="108" width="35" height="4" rx="2" fill="#d0d5dd"/>
          <rect x="75" y="119" width="42" height="4" rx="2" fill="#d0d5dd"/>
          <ellipse cx="100" cy="65" rx="22" ry="22" fill="#f26f37" opacity="0.15"/>
          <ellipse cx="100" cy="65" rx="14" ry="14" fill="#f26f37" opacity="0.3"/>
          <circle cx="140" cy="150" r="10" fill="#5379f4" opacity="0.12"/>
          <circle cx="60" cy="120" r="7" fill="#f26f37" opacity="0.18"/>
        </svg>
      ),
      2: (
        <svg viewBox="0 0 200 260" width="200" height="260">
          <circle cx="80" cy="130" r="40" fill="#fff3e8" stroke="#f26f37" strokeWidth="2"/>
          <text x="80" y="135" textAnchor="middle" fontFamily="sans-serif" fontSize="22" fontWeight="700" fill="#f26f37">$</text>
          <circle cx="140" cy="110" r="30" fill="#fff3e8" stroke="#f26f37" strokeWidth="2"/>
          <text x="140" y="115" textAnchor="middle" fontFamily="sans-serif" fontSize="18" fontWeight="700" fill="#f26f37">$</text>
          <circle cx="60" cy="80" r="12" fill="#f26f37" opacity="0.15"/>
          <rect x="90" y="170" width="60" height="8" rx="4" fill="#e8ecff"/>
        </svg>
      ),
      3: (
        <svg viewBox="0 0 200 260" width="200" height="260">
          <rect x="40" y="60" width="120" height="150" rx="10" fill="#f0f4ff" stroke="#5379f4" strokeWidth="2"/>
          {[80,96,112,128,144,160,176].map((y,i)=>(
            <rect key={y} x="55" y={y} width={i%2===0?90:65} height="5" rx="2.5" fill="#d0d5dd"/>
          ))}
          <circle cx="155" cy="55" r="20" fill="#f26f37" opacity="0.15"/>
          <circle cx="45" cy="195" r="14" fill="#5379f4" opacity="0.12"/>
        </svg>
      ),
    }
    return illus[step] || null
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
        <button onClick={onBack}
          style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center', color:'#6a7380' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:0 }}>
            {step < 3 ? 'Active Job Postings' : 'Add Job Role Posting'}
          </h2>
          <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'4px 0 0' }}>
            {step < 3 ? 'Manage your open vacancies, track applicant volume, and update role requirements for Australian sponsorship.' : 'Create and manage job postings for your institution. Add role details, requirements, and responsibilities to attract qualified candidates.'}
          </p>
        </div>
      </div>

      {step < 3 ? (
        /* Steps 1 & 2: centered card with illustration */
        <div style={{ display:'flex', justifyContent:'center', paddingTop:20 }}>
          <div style={{ position:'relative', background:'#f0f4ff', borderRadius:24, padding:'40px 48px',
            width:700, boxShadow:'0 4px 24px rgba(83,121,244,0.10)', overflow:'hidden' }}>
            {/* Step sidebar */}
            <div style={{ position:'absolute', left:32, top:40 }}>
              <StepSidebar step={step}/>
            </div>

            {/* Illustration right */}
            <div style={{ position:'absolute', right:0, bottom:0, opacity:0.9, pointerEvents:'none' }}>
              <StepIllus step={step}/>
            </div>

            {/* Form card */}
            <div style={{ marginLeft:160, background:'#fff', borderRadius:16, padding:'32px',
              boxShadow:'0 2px 12px rgba(0,0,0,0.07)', position:'relative', zIndex:1 }}>
              <h3 style={{ fontFamily:font, fontSize:18, fontWeight:700, color:'#343434', margin:'0 0 6px' }}>
                {stepTitles[step-1]}
              </h3>
              <p style={{ fontFamily:font, fontSize:13, color:'#6a7380', margin:'0 0 24px' }}>
                {stepSubs[step-1]}
              </p>

              {step === 1 && (
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  <Field label="Role/Job Title: (e.g., Senior Electrician, Site Supervisor).">
                    <TInput placeholder="Enter Role/Job Title" value={title} onChange={setTitle}/>
                  </Field>
                  <Field label="Trade Category: (e.g., Electrical & Energy).">
                    <TSelect placeholder="Enter Trade Category" value={tradecat} onChange={setTradecat} options={TRADE_CATEGORIES}/>
                  </Field>
                  <Field label="Location: (e.g., Sydney, NSW).">
                    <TInput placeholder="Enter Location" value={location} onChange={setLocation}/>
                  </Field>
                  <Field label="Employment Type: (e.g., Full-Time / Permanent).">
                    <TSelect placeholder="Enter Employment Type" value={empType} onChange={setEmpType} options={EMPLOYMENT_TYPES}/>
                  </Field>
                  <Field label="Visa Sponsorship: (e.g., Available (Standard Business Sponsor)).">
                    <TSelect placeholder="Enter Visa Sponsorship" value={visa} onChange={setVisa} options={VISA_OPTIONS}/>
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                    <Field label="Minimum Salary: (e.g., 95,000).">
                      <TInput placeholder="Enter Minimum Salary" value={minSal} onChange={setMinSal} type="number"/>
                    </Field>
                    <Field label="Maximum Salary: (e.g., 115,000).">
                      <TInput placeholder="Enter Maximum Salary" value={maxSal} onChange={setMaxSal} type="number"/>
                    </Field>
                  </div>
                  <Field label="Currency/Frequency: (e.g., AUD / Per Annum).">
                    <TSelect placeholder="Enter Currency/Frequency" value={currency} onChange={setCurrency} options={CURRENCIES}/>
                  </Field>
                  <div>
                    <label style={labelStyle}>Additional Benefits</label>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20, marginTop:8 }}>
                      <Toggle label="Company Vehicle" value={vehicle}  onChange={setVehicle}/>
                      <Toggle label="Overtime"        value={overtime} onChange={setOvertime}/>
                      <Toggle label="Superannuation"  value={superann} onChange={setSuperann}/>
                    </div>
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div style={{ display:'flex', justifyContent: step===1?'flex-end':'space-between', marginTop:28, paddingTop:20, borderTop:'1px solid #f0f0f4' }}>
                {step > 1 && (
                  <button onClick={()=>setStep(s=>s-1)}
                    style={{ height:44, padding:'0 24px', background:'transparent', border:'none',
                      fontFamily:font, fontSize:14, fontWeight:600, color:'#f26f37', cursor:'pointer' }}>
                    Go Back
                  </button>
                )}
                <button onClick={()=>setStep(s=>s+1)}
                  style={{ height:44, padding:'0 28px', background:'#156dbf', color:'#fff', border:'none',
                    borderRadius:12, fontFamily:font, fontSize:14, fontWeight:600, cursor:'pointer',
                    boxShadow:'0 4px 12px rgba(21,109,191,0.25)' }}>
                  Next Step
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Step 3: Full-width description form (matches PDF Add_job_post) */
        <div>
          {/* Section 1 – read-only summary */}
          <div style={{ background:'#fff', borderRadius:16, padding:'28px 32px', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:24, height:24, borderRadius:6, background:'#f0f4ff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5379f4" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="9"/>
                  <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="13" y2="17"/>
                </svg>
              </div>
              <h4 style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#343434', margin:0 }}>Section 1: Basic Job Information</h4>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px 24px' }}>
              {[['Role/Job Title', title||'Enter Role/Job Title'],['Trade Category', tradecat||'Enter Trade Category'],
                ['Location', location||'Enter Location'],['Employment Type', empType||'Enter Employment Type'],
                ['Visa Sponsorship', visa||'Enter Visa Sponsorship']].map(([l,v])=>(
                <div key={l}>
                  <div style={{ fontFamily:font, fontSize:12, color:'#9ca3af' }}>{l}:</div>
                  <div style={{ fontFamily:font, fontSize:13, color: v.startsWith('Enter')?'#d0d5dd':'#343434' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 – read-only summary */}
          <div style={{ background:'#fff', borderRadius:16, padding:'28px 32px', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:24, height:24, borderRadius:6, background:'#fff3e8', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f26f37" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <h4 style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#343434', margin:0 }}>Section 2: Salary & Compensation</h4>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px 24px' }}>
              {[['Min Salary', minSal||'—'],['Max Salary', maxSal||'—'],['Currency', currency||'—'],
                ['Company Vehicle', vehicle],['Overtime', overtime],['Superannuation', superann]].map(([l,v])=>(
                <div key={l}>
                  <div style={{ fontFamily:font, fontSize:12, color:'#9ca3af' }}>{l}:</div>
                  <div style={{ fontFamily:font, fontSize:13, fontWeight:600, color:'#343434' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3 – editable */}
          <div style={{ background:'#fff', borderRadius:16, padding:'28px 32px', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <div style={{ width:24, height:24, borderRadius:6, background:'#e8f5e9', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#129578" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <h4 style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#343434', margin:0 }}>Section 3: Detailed Description</h4>
            </div>
            <p style={{ fontFamily:font, fontSize:13, color:'#6a7380', margin:'0 0 20px' }}>
              Provide a comprehensive breakdown of the role to help candidates understand the specific requirements, daily responsibilities, and the unique benefits your company offers.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <RichField label="Field: Role Overview" value={roleOv} onChange={setRoleOv}/>
              <RichField label="Field: Key Requirements" value={keyReqs} onChange={setKeyReqs}/>
              <RichField label="Field: Benefits & Perks" value={benefits} onChange={setBenefits}/>
              <RichField label="Field: Primary Responsibilities" value={resps} onChange={setResps}/>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <button onClick={()=>setStep(2)}
              style={{ height:44, padding:'0 24px', background:'transparent', border:'none',
                fontFamily:font, fontSize:14, fontWeight:600, color:'#f26f37', cursor:'pointer' }}>
              Go Back
            </button>
            <div style={{ display:'flex', gap:12 }}>
              <button
                style={{ height:44, padding:'0 24px', background:'transparent', border:'1.5px solid #f26f37',
                  borderRadius:12, fontFamily:font, fontSize:14, fontWeight:600, color:'#f26f37', cursor:'pointer' }}>
                Save as Draft
              </button>
              <button onClick={()=>onDone({ title,tradecat,location,empType,visa,minSal,maxSal,currency,vehicle,overtime,superann,roleOv,keyReqs,benefits,resps })}
                style={{ height:44, padding:'0 28px', background:'#156dbf', color:'#fff', border:'none',
                  borderRadius:12, fontFamily:font, fontSize:14, fontWeight:600, cursor:'pointer',
                  boxShadow:'0 4px 12px rgba(21,109,191,0.25)' }}>
                + Post New Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Main Page ── */
export function CompanyActiveJobs() {
  const navigate = useNavigate()
  const [user,     setUser]     = useState(null)
  const [jobs,     setJobs]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [tab,      setTab]      = useState('All Roles')
  const [viewMode, setViewMode] = useState('List')
  const [search,   setSearch]   = useState('')
  const [page,     setPage]     = useState(1)
  const [statuses, setStatuses] = useState({})
  const [view,     setView]     = useState('list')   // 'list' | 'add' | 'detail'
  const [selected, setSelected] = useState(null)
  const [company,  setCompany]  = useState(null)

  useEffect(() => {
    const token = getToken()
    getMe(token)
      .then(u => { setUser(u); return u })
      .then(() => listJobs({}, token))
      .then(data => {
        const list = Array.isArray(data) ? data : []
        setJobs(list)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = jobs.filter(j => {
    const matchTab = tab==='All Roles' ? true :
      tab==='Open Roles'       ? ['Hiring','Closing Soon'].includes(statuses[j.id]||j.status) :
      ['On Hold','Draft'].includes(statuses[j.id]||j.status)
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  async function handleJobDone(data) {
    const token = getToken()
    try {
      const payload = {
        title:            data.title || 'New Role',
        trade_category:   data.tradecat || null,
        location:         data.location || null,
        employment_type:  data.empType  || null,
        visa_sponsorship: data.visa     || null,
        min_salary:       data.minSal   ? parseInt(data.minSal) : null,
        max_salary:       data.maxSal   ? parseInt(data.maxSal) : null,
        currency:         data.currency || null,
        company_vehicle:  data.vehicle  === 'Yes',
        overtime:         data.overtime === 'Yes',
        superannuation:   data.superann === 'Yes',
        role_overview:    data.roleOv   || null,
        key_requirements: data.keyReqs  || null,
        benefits:         data.benefits || null,
        responsibilities: data.resps    || null,
        status:           'Hiring',
      }
      const created = await createJob(payload, token)
      setJobs(prev => [created, ...prev])
    } catch (e) {
      alert(e.detail || 'Failed to create job')
    }
    setView('list')
  }

  if (view === 'add') {
    return (
      <CompanyLayout user={user}>
        <AddJobWizard onBack={()=>setView('list')} onDone={handleJobDone}/>
      </CompanyLayout>
    )
  }

  if (view === 'detail' && selected) {
    return (
      <CompanyLayout user={user}>
        <ViewJobRole job={selected} onBack={()=>setView('list')}/>
      </CompanyLayout>
    )
  }

  return (
    <CompanyLayout user={user}>

      {/* Page heading */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:6 }}>
        <button onClick={()=>navigate('/company/dashboard')}
          style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center', color:'#6a7380' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:0 }}>Active Job Postings</h2>
          <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'4px 0 0' }}>
            Manage your open vacancies, track applicant volume, and update role requirements for Australian sponsorship.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, marginTop:16 }}>
        {TABS.map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{
            padding:'8px 20px', border:'none', borderRadius:20, cursor:'pointer',
            fontFamily:font, fontSize:14, fontWeight:600,
            background: t===tab ? '#156dbf' : '#fff',
            color: t===tab ? '#fff' : '#6a7380',
            transition:'all 0.15s',
          }}>{t}</button>
        ))}
      </div>

      {/* Main card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'28px',
        boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#343434', margin:0 }}>
              Current Vacancies
            </h3>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:8 }}>
              <span style={{ fontFamily:font, fontSize:13, color:'#6a7380' }}>Display</span>
              {['Grid','List'].map(m=>(
                <label key={m} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', border:'2px solid',
                    borderColor:viewMode===m?'#156dbf':'#d0d5dd',
                    background:viewMode===m?'#156dbf':'#fff',
                    display:'flex', alignItems:'center', justifyContent:'center' }}
                    onClick={()=>setViewMode(m)}>
                    {viewMode===m && <div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }}/>}
                  </div>
                  <span style={{ fontFamily:font, fontSize:13, color:'#343434' }}>{m}</span>
                </label>
              ))}
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {/* Filter + columns icons */}
            {[
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
            ].map((icon,i)=>(
              <button key={i} style={{ width:40, height:40, borderRadius:10, border:'1.5px solid #e0dff0',
                background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {icon}
              </button>
            ))}
            {/* Search */}
            <div style={{ display:'flex', alignItems:'center', gap:8, border:'1.5px solid #e0dff0',
              borderRadius:10, padding:'8px 14px', background:'#fff', width:240 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="Search by job title or location..."
                style={{ border:'none', outline:'none', fontFamily:font, fontSize:13,
                  color:'#343434', background:'transparent', flex:1 }}/>
            </div>
            <button style={{ height:40, padding:'0 16px', background:'#fff', border:'1.5px solid #e0dff0',
              borderRadius:10, fontFamily:font, fontSize:13, fontWeight:600, color:'#343434', cursor:'pointer' }}>
              Drafts
            </button>
            <button onClick={()=>setView('add')}
              style={{ height:40, padding:'0 18px', background:'#156dbf', border:'none',
                borderRadius:10, fontFamily:font, fontSize:13, fontWeight:600, color:'#fff',
                cursor:'pointer', whiteSpace:'nowrap' }}>
              + Post New Job
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1.5px solid #f0f0f4' }}>
                {['Job Title','Location','Applicants','Status','Action'].map(col=>(
                  <th key={col} style={{ padding:'10px 14px', textAlign:'left', fontFamily:font,
                    fontSize:13, fontWeight:700, color:'#6a7380' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      {col}
                      {col!=='Action' && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                          <polyline points="18 15 12 9 6 15"/>
                        </svg>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:40, fontFamily:font, color:'#6a7380' }}>
                  Loading jobs...
                </td></tr>
              ) : filtered.map(job => (
                <tr key={job.id}
                  style={{ borderBottom:'1px solid #f8f8fc', cursor:'pointer', transition:'background 0.1s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#fafafa'}
                  onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'16px 14px', fontFamily:font, fontSize:14, fontWeight:600, color:'#343434' }}
                    onClick={()=>{ setSelected(job); setView('detail') }}>
                    {job.title}
                  </td>
                  <td style={{ padding:'16px 14px', fontFamily:font, fontSize:14, color:'#6a7380' }}>
                    {job.location}
                  </td>
                  <td style={{ padding:'16px 14px', fontFamily:font, fontSize:14, color:'#6a7380' }}>
                    {job.applicants ? `${job.applicants.new} New / ${job.applicants.total} Total` : '—'}
                  </td>
                  <td style={{ padding:'16px 14px' }}>
                    <StatusBadge value={statuses[job.id]||job.status}
                      onChange={async val => {
                        const token = getToken()
                        try { await apiUpdateJobStatus(job.id, val, token) } catch {}
                        setStatuses(p=>({...p,[job.id]:val}))
                      }}/>
                  </td>
                  <td style={{ padding:'16px 14px' }}>
                    <button style={{ width:32, height:32, borderRadius:8, border:'1.5px solid #e0dff0',
                      background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#6a7380">
                        <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontFamily:font, fontSize:13, color:'#6a7380' }}>Rows per page</span>
            <select defaultValue="10" style={{ height:32, border:'1.5px solid #e0dff0', borderRadius:8,
              fontFamily:font, fontSize:13, padding:'0 8px', outline:'none' }}>
              <option>10</option><option>25</option><option>50</option>
            </select>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))}
              style={{ width:32, height:32, borderRadius:8, border:'1.5px solid #e0dff0',
                background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            {[1,2,3,4].map(p=>(
              <button key={p} onClick={()=>setPage(p)}
                style={{ width:32, height:32, borderRadius:8, cursor:'pointer',
                  fontFamily:font, fontSize:13, fontWeight:600,
                  background: page===p?'#156dbf':'#fff',
                  color: page===p?'#fff':'#6a7380',
                  border: page===p?'none':'1.5px solid #e0dff0' }}>
                {p}
              </button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(4,p+1))}
              style={{ width:32, height:32, borderRadius:8, border:'1.5px solid #e0dff0',
                background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </CompanyLayout>
  )
}