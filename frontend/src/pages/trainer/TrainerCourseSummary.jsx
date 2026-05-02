/**
 * TrainerCourseSummary — Course summary detail view.
 * Figma node 1-4858.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrainerLayout } from './TrainerLayout'
import { getToken, getMe } from '../../services/api'
import { MOCK_TRAINER_USER, MOCK_PROVIDER, MOCK_COURSES } from './trainerMockData'

const font = "'Urbanist', sans-serif"

const AQF_LEVELS = [
  'AQF Level 1 — Certificate I',
  'AQF Level 2 — Certificate II',
  'AQF Level 3 — Certificate III',
  'AQF Level 4 — Certificate IV',
  'AQF Level 5 — Diploma',
  'AQF Level 6 — Advanced Diploma',
  'AQF Level 7 — Bachelor Degree',
  'AQF Level 8 — Graduate Certificate / Graduate Diploma',
  'AQF Level 9 — Masters Degree',
  'AQF Level 10 — Doctoral Degree',
]

const QUAL_LEVELS = [
  'Certificate I', 'Certificate II', 'Certificate III', 'Certificate IV',
  'Diploma', 'Advanced Diploma', 'Bachelor Degree', 'Graduate Certificate',
  'Graduate Diploma', 'Masters Degree', 'Doctoral Degree',
]

function Field({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontFamily:font, fontSize:13, fontWeight:700, color:'#343434' }}>{label}</label>
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, readOnly=false }) {
  return (
    <input value={value} onChange={onChange} placeholder={placeholder} readOnly={readOnly}
      style={{ height:48, borderRadius:12, border:'1.5px solid #d0d5dd', padding:'0 16px', fontFamily:font, fontSize:14, color:'#343434', outline:'none', background: readOnly ? '#f8f8fc' : '#fff', width:'100%', boxSizing:'border-box', cursor: readOnly ? 'default' : 'text' }}
      onFocus={e=>{ if(!readOnly) e.currentTarget.style.borderColor='#5379f4' }}
      onBlur={e=>{ if(!readOnly) e.currentTarget.style.borderColor='#d0d5dd' }}
    />
  )
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <div style={{ position:'relative' }}>
      <select value={value} onChange={onChange}
        style={{ height:48, borderRadius:12, border:'1.5px solid #d0d5dd', padding:'0 40px 0 16px', fontFamily:font, fontSize:14, color: value ? '#343434' : '#9ca3af', outline:'none', background:'#fff', width:'100%', boxSizing:'border-box', appearance:'none', cursor:'pointer' }}
        onFocus={e=>e.currentTarget.style.borderColor='#5379f4'}
        onBlur={e=>e.currentTarget.style.borderColor='#d0d5dd'}>
        <option value="">{placeholder}</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
      <svg style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  )
}

export function TrainerCourseSummary() {
  const navigate = useNavigate()
  const [user, setUser]         = useState(null)
  const [provider, setProvider] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [saved, setSaved]       = useState(false)

  // Form state
  const [courseName,   setCourseName]   = useState('Certificate III in Electrotechnology Electrician')
  const [rtoCode,      setRtoCode]      = useState('12345')
  const [qualLevel,    setQualLevel]    = useState('Certificate III')
  const [aqfFramework, setAqfFramework] = useState('AQF Level 3 — Certificate III')
  const [website,      setWebsite]      = useState('https://tradesacademy.edu.au/courses/cert3-elec')
  const [brochureUrl,  setBrochureUrl]  = useState('')
  const [duration,     setDuration]     = useState('12 months')
  const [deliveryMode, setDeliveryMode] = useState('On-Campus (Sydney / Parramatta)')
  const [units,        setUnits]        = useState('22')
  const [description,  setDescription]  = useState('This qualification covers the skills and knowledge required to perform work in the electrotechnology industry. It prepares candidates for employment as a licensed electrician in Australia.')

  useEffect(() => {
    const token = getToken()
    if (!token) { setUser(MOCK_TRAINER_USER); setProvider(MOCK_PROVIDER); setLoading(false); return }
    getMe(token)
      .then(u => { setUser(u); setProvider(MOCK_PROVIDER) })
      .catch(() => { setUser(MOCK_TRAINER_USER); setProvider(MOCK_PROVIDER) })
      .finally(() => setLoading(false))
  }, [])

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <TrainerLayout user={user} provider={provider}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
        <button onClick={()=>navigate('/trainer/courses')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, color:'#6a7380', display:'flex' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h2 style={{ fontFamily:font, fontSize:26, fontWeight:700, color:'#1e1e1e', margin:0 }}>Course Summary</h2>
          <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'4px 0 0' }}>View and manage the details of your training course including AQF framework, qualification level, and delivery information.</p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, alignItems:'start' }}>

        {/* Main form card */}
        <div style={{ background:'#fff', borderRadius:20, padding:'36px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily:font, fontSize:18, fontWeight:700, color:'#1e1e1e', margin:'0 0 24px' }}>Course Details</h3>

          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <Field label="Name of Course">
                <TextInput value={courseName} onChange={e=>setCourseName(e.target.value)} placeholder="e.g. Cert III Electrotechnology"/>
              </Field>
              <Field label="RTO Code">
                <TextInput value={rtoCode} onChange={e=>setRtoCode(e.target.value)} placeholder="e.g. 12345"/>
              </Field>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <Field label="Qualification Level">
                <Select value={qualLevel} onChange={e=>setQualLevel(e.target.value)} options={QUAL_LEVELS} placeholder="Select qualification level"/>
              </Field>
              <Field label="Training Provider AQF Framework">
                <Select value={aqfFramework} onChange={e=>setAqfFramework(e.target.value)} options={AQF_LEVELS} placeholder="Select AQF level"/>
              </Field>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <Field label="Duration">
                <TextInput value={duration} onChange={e=>setDuration(e.target.value)} placeholder="e.g. 12 months"/>
              </Field>
              <Field label="Number of Units">
                <TextInput value={units} onChange={e=>setUnits(e.target.value)} placeholder="e.g. 22"/>
              </Field>
            </div>

            <Field label="Delivery Mode">
              <TextInput value={deliveryMode} onChange={e=>setDeliveryMode(e.target.value)} placeholder="e.g. On-Campus, Online, Blended"/>
            </Field>

            <Field label="Provider Website">
              <TextInput value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://yourprovider.edu.au/courses/..."/>
            </Field>

            <Field label="Course Description">
              <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={4} placeholder="Describe the course content, outcomes, and target audience..."
                style={{ borderRadius:12, border:'1.5px solid #d0d5dd', padding:'12px 16px', fontFamily:font, fontSize:14, color:'#343434', outline:'none', resize:'vertical', lineHeight:1.6, boxSizing:'border-box', width:'100%' }}
                onFocus={e=>e.currentTarget.style.borderColor='#5379f4'}
                onBlur={e=>e.currentTarget.style.borderColor='#d0d5dd'}/>
            </Field>
          </div>

          <div style={{ display:'flex', gap:12, justifyContent:'flex-end', marginTop:28, paddingTop:24, borderTop:'1px solid #f0f0f4' }}>
            <button onClick={()=>navigate('/trainer/courses')} style={{ height:48, padding:'0 28px', background:'transparent', border:'1.5px solid #d0d5dd', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:14, fontWeight:600, color:'#6a7380' }}>Cancel</button>
            <button onClick={handleSave} style={{ height:48, padding:'0 32px', background: saved ? '#129578' : '#156dbf', color:'#fff', border:'none', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:14, fontWeight:600, transition:'background 0.2s', boxShadow:'0 4px 12px rgba(21,109,191,0.2)' }}
              onMouseEnter={e=>{ if(!saved) e.currentTarget.style.background='#1259a0' }}
              onMouseLeave={e=>{ if(!saved) e.currentTarget.style.background='#156dbf' }}>
              {saved ? '✓ Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

          {/* Brochure card */}
          <div style={{ background:'#fff', borderRadius:20, padding:'28px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontFamily:font, fontSize:16, fontWeight:700, color:'#1e1e1e', margin:'0 0 16px' }}>Course Brochure</h4>
            <p style={{ fontFamily:font, fontSize:13, color:'#6a7380', margin:'0 0 16px', lineHeight:1.5 }}>Upload a PDF brochure that students can download when viewing your course listing.</p>

            {brochureUrl ? (
              <div style={{ display:'flex', alignItems:'center', gap:12, background:'#f3f1fd', borderRadius:12, padding:'12px 16px', marginBottom:16 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5379f4" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:font, fontSize:13, fontWeight:600, color:'#1e1e1e', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Course_Brochure.pdf</div>
                  <div style={{ fontFamily:font, fontSize:12, color:'#9ca3af' }}>Ready to download</div>
                </div>
                <button onClick={()=>setBrochureUrl('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#e53e3e', padding:4 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            ) : (
              <label style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:10, border:'2px dashed #d0d5dd', borderRadius:12, padding:'28px 20px', cursor:'pointer', marginBottom:16, background:'#fafafa' }}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor='#5379f4'; e.currentTarget.style.background='#f3f1fd' }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor='#d0d5dd'; e.currentTarget.style.background='#fafafa' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#5379f4" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                <span style={{ fontFamily:font, fontSize:13, fontWeight:600, color:'#5379f4' }}>Upload PDF Brochure</span>
                <span style={{ fontFamily:font, fontSize:12, color:'#9ca3af' }}>PDF up to 10 MB</span>
                <input type="file" accept=".pdf" style={{ display:'none' }} onChange={e=>{ if(e.target.files[0]) setBrochureUrl(URL.createObjectURL(e.target.files[0])) }}/>
              </label>
            )}

            <a href={brochureUrl||'#'} download="Course_Brochure.pdf"
              style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, height:44, background: brochureUrl ? '#156dbf' : '#e0dff0', color: brochureUrl ? '#fff' : '#9ca3af', borderRadius:12, textDecoration:'none', fontFamily:font, fontSize:14, fontWeight:600, pointerEvents: brochureUrl ? 'auto' : 'none', transition:'background 0.2s' }}
              onMouseEnter={e=>{ if(brochureUrl) e.currentTarget.style.background='#1259a0' }}
              onMouseLeave={e=>{ if(brochureUrl) e.currentTarget.style.background='#156dbf' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Brochure
            </a>
          </div>

          {/* Course stats card */}
          <div style={{ background:'#fff', borderRadius:20, padding:'28px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontFamily:font, fontSize:16, fontWeight:700, color:'#1e1e1e', margin:'0 0 16px' }}>Course Stats</h4>
            {[
              { label:'Enrolled Students', value:'24', icon:'👨‍🎓', color:'#5379f4' },
              { label:'Completion Rate',   value:'87%', icon:'✅', color:'#129578' },
              { label:'Avg. Progress',     value:'62%', icon:'📈', color:'#f26f37' },
              { label:'Next Intake',       value:'15 Nov 2026', icon:'📅', color:'#403c8b' },
            ].map(s=>(
              <div key={s.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid #f8f8fc' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:18 }}>{s.icon}</span>
                  <span style={{ fontFamily:font, fontSize:13, color:'#6a7380', fontWeight:600 }}>{s.label}</span>
                </div>
                <span style={{ fontFamily:font, fontSize:14, fontWeight:700, color:s.color }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div style={{ background:'#fff', borderRadius:20, padding:'28px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
            <h4 style={{ fontFamily:font, fontSize:16, fontWeight:700, color:'#1e1e1e', margin:'0 0 16px' }}>Quick Actions</h4>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { label:'View Student List', action:()=>navigate('/trainer/students'), color:'#5379f4' },
                { label:'View Inquiries',    action:()=>navigate('/trainer/inquiries'), color:'#f26f37' },
                { label:'Back to Courses',   action:()=>navigate('/trainer/courses'),  color:'#6a7380' },
              ].map(b=>(
                <button key={b.label} onClick={b.action} style={{ height:44, background:'transparent', border:`1.5px solid ${b.color}`, borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:14, fontWeight:600, color:b.color, transition:'all 0.15s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=b.color; e.currentTarget.style.color='#fff' }}
                  onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color=b.color }}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </TrainerLayout>
  )
}
