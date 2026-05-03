/**
 * CompanySetupFlow — 3-step company profile setup.
 * Figma nodes: 1-3328 (Step 1), 1-3853 (Step 2), 1-4350 (Step 3)
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyLayout } from './CompanyLayout'
import { getToken, getMe, createCompany, updateCompany, getMyCompany } from '../../services/api'
import { MOCK_COMPANY_USER, MOCK_COMPANY } from './companyMockData'

const font = "'Urbanist', sans-serif"

const COUNTRIES = [
  'Australia','New Zealand','United Kingdom','United States','Canada','India',
  'Philippines','Pakistan','Bangladesh','Sri Lanka','Nepal','Indonesia','Malaysia',
  'China','Japan','South Korea','Singapore','UAE','Saudi Arabia','South Africa',
  'Nigeria','Kenya','Ghana','Germany','France','Italy','Spain','Netherlands',
  'Brazil','Argentina','Mexico','Colombia','Peru','Other',
]

const AU_LOCATIONS = [
  'Sydney, NSW','Parramatta, NSW','Newcastle, NSW','Wollongong, NSW',
  'Melbourne, VIC','Geelong, VIC','Ballarat, VIC',
  'Brisbane, QLD','Gold Coast, QLD','Sunshine Coast, QLD','Cairns, QLD',
  'Perth, WA','Fremantle, WA','Bunbury, WA',
  'Adelaide, SA','Darwin, NT','Canberra, ACT','Hobart, TAS',
]

const YEARS_OPTIONS = ['Less than 1','1–2','3–5','5–10','10+','20+']

const BUSINESS_TYPES = [
  'Sole Trader','Partnership','Pty Ltd','Public Company',
  'Not-for-Profit','Government','Joint Venture','Other',
]

const INDUSTRIES = [
  'Licensed Electrical Contractor','Electrical Engineering Firm',
  'Solar & Renewables','HVAC & Refrigeration','Plumbing & Gas',
  'Construction & Civil','Mining & Resources','Manufacturing',
  'Facilities Management','Other Trade Services',
]

/* ── Reusable field components ── */
function Field({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434' }}>{label}</label>
      {children}
    </div>
  )
}

function TInput({ placeholder, value, onChange }) {
  const [f, setF] = useState(false)
  return (
    <input placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      onFocus={() => setF(true)} onBlur={() => setF(false)}
      style={{ height:48, borderRadius:10, border:`1.5px solid ${f ? '#5379f4' : '#d0d5dd'}`, padding:'0 16px', fontFamily:font, fontSize:15, color:'#343434', outline:'none', width:'100%', boxSizing:'border-box', background:'#fff' }}
    />
  )
}

function TSelect({ placeholder, value, onChange, options }) {
  const [f, setF] = useState(false)
  return (
    <div style={{ position:'relative' }}>
      <select value={value} onChange={e => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
        style={{ height:48, borderRadius:10, border:`1.5px solid ${f ? '#5379f4' : '#d0d5dd'}`, padding:'0 40px 0 16px', fontFamily:font, fontSize:15, color:value ? '#343434' : '#9ca3af', outline:'none', width:'100%', background:'#fff', appearance:'none', cursor:'pointer', boxSizing:'border-box' }}>
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  )
}

function PhotoUpload({ photo, onPhoto, step }) {
  const ref = useRef(null)
  const size = 180, stroke = 10
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offsets = [0.30, 0.65, 0.90]
  const offset = circ - (offsets[step - 1] || 0.3) * circ
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <p style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434', margin:0 }}>Upload Profile Picture</p>
      <div style={{ position:'relative', width:size, height:size, cursor:'pointer' }} onClick={() => ref.current?.click()}>
        <svg width={size} height={size} style={{ transform:'rotate(-90deg)', position:'absolute', inset:0 }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e0dff0" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#5379f4" strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition:'stroke-dashoffset 0.6s ease' }}/>
        </svg>
        <div style={{ position:'absolute', top:stroke+8, left:stroke+8, right:stroke+8, bottom:stroke+8, borderRadius:'50%', background:'#f0f0f5', border:'2px dashed #b0b8d0', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
          {photo ? <img src={photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : <span style={{ fontSize:32, color:'#9ca3af' }}>+</span>}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display:'none' }} onChange={e => { const f = e.target.files[0]; if (f) onPhoto(URL.createObjectURL(f)) }}/>
    </div>
  )
}

export function CompanySetupFlow() {
  const navigate = useNavigate()
  const [user, setUser]         = useState(null)
  const [company, setCompany]   = useState(null)
  const [step, setStep]         = useState(1)
  const [saving, setSaving]     = useState(false)
  const [err, setErr]           = useState('')
  const [hasCompany, setHasCompany] = useState(false)
  const [photo, setPhoto]       = useState(null)

  // Step 1
  const [companyName, setCompanyName]   = useState('')
  const [country, setCountry]           = useState('')
  const [hqLocation, setHqLocation]     = useState('')
  const [phone, setPhone]               = useState('')
  const [phoneCode, setPhoneCode]       = useState('+61')

  // Step 2
  const [industry, setIndustry]           = useState('')
  const [isApprovedSponsor, setIsApprovedSponsor] = useState('')
  const [yearsOp, setYearsOp]             = useState('')

  // Step 3
  const [bizType, setBizType]   = useState('')
  const [abn, setAbn]           = useState('')
  const [description, setDesc]  = useState('')

  useEffect(() => {
    const token = getToken()
    function applyData(u, c) {
      setUser(u)
      if (c) {
        setHasCompany(true); setCompany(c)
        setCompanyName(c.company_name || '')
        setCountry(c.country_of_registration || '')
        setHqLocation(c.headquarters_location || '')
        setIndustry(c.primary_industry || '')
        setIsApprovedSponsor(c.is_approved_sponsor ? 'Yes (Standard Business Sponsor)' : 'No (Direct Hire Only)')
        setYearsOp(c.years_in_operation || '')
        setBizType(c.business_type || '')
        setAbn(c.abn || '')
        setDesc(c.description || '')
      }
    }
    if (!token) { applyData(MOCK_COMPANY_USER, MOCK_COMPANY); return }
    Promise.all([getMe(token), getMyCompany(token).catch(() => null)])
      .then(([u, c]) => applyData(u, c))
      .catch(() => applyData(MOCK_COMPANY_USER, MOCK_COMPANY))
  }, [])

  async function save(next) {
    setErr('')
    const token = getToken()
    if (!token) { if (next === 'done') navigate('/company/dashboard'); else setStep(next); return }
    setSaving(true)
    try {
      const payload = {
        company_name: companyName,
        country_of_registration: country,
        headquarters_location: hqLocation,
        phone_number: `${phoneCode} ${phone}`.trim(),
        primary_industry: industry,
        is_approved_sponsor: isApprovedSponsor.startsWith('Yes'),
        years_in_operation: yearsOp,
        business_type: bizType,
        abn,
        description,
      }
      if (hasCompany) await updateCompany(payload, token)
      else { await createCompany(payload, token); setHasCompany(true) }
      if (next === 'done') navigate('/company/dashboard')
      else setStep(next)
    } catch (e) {
      setErr(e.detail || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const titles    = ['Tell us about your Company', 'What do you hire?', 'Final Business Touches']
  const subs      = [
    'Create your business profile to start connecting with skilled trade talent.',
    'Provide your industry details to help us match you with the right candidates.',
    "Share your company's mission and the types of projects you typically manage.",
  ]
  const nextLabels = ['Next: Hiring Details', 'Next: Business Overview', 'Complete Profile']

  const mockCompanyForLayout = { company_name: companyName || MOCK_COMPANY.company_name, trade_type: industry || MOCK_COMPANY.trade_type }

  return (
    <CompanyLayout user={user} company={mockCompanyForLayout}>
      <div style={{ position:'relative', overflow:'hidden' }}>
        {/* Blobs */}
        <div style={{ position:'absolute', top:-30, right:-40, width:260, height:260, borderRadius:'50%', background:'rgba(240,235,210,0.55)', zIndex:0, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-40, right:80, width:180, height:180, borderRadius:'50%', background:'rgba(200,220,245,0.4)', zIndex:0, pointerEvents:'none' }}/>

        <div style={{ position:'relative', zIndex:1, marginBottom:28 }}>
          <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:'0 0 6px' }}>{titles[step-1]}</h2>
          <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', margin:0 }}>{subs[step-1]}</p>
        </div>

        <div style={{ position:'relative', zIndex:1, background:'#fff', borderRadius:20, padding:'36px 40px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:48, alignItems:'start' }}>
            <PhotoUpload photo={photo} onPhoto={setPhoto} step={step} />

            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

              {step === 1 && (
                <>
                  <Field label="Company Name">
                    <TInput placeholder="e.g. Acme Electrical Pty Ltd" value={companyName} onChange={setCompanyName} />
                  </Field>
                  <Field label="Country of Registration">
                    <TSelect placeholder="Select your country" value={country} onChange={setCountry} options={COUNTRIES} />
                  </Field>
                  <Field label="Headquarters Location">
                    <TSelect placeholder="Suburb, State (e.g. Parramatta, NSW)" value={hqLocation} onChange={setHqLocation} options={AU_LOCATIONS} />
                  </Field>
                  <Field label="Business Contact Number">
                    <div style={{ display:'flex', gap:8 }}>
                      <div style={{ position:'relative', width:100, flexShrink:0 }}>
                        <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)}
                          style={{ height:48, borderRadius:10, border:'1.5px solid #d0d5dd', padding:'0 28px 0 12px', fontFamily:font, fontSize:15, color:'#343434', background:'#fff', appearance:'none', width:'100%', cursor:'pointer', outline:'none' }}>
                          {['+61','+1','+44','+91','+92','+64','+65'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <svg style={{ position:'absolute', right:6, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                      <TInput placeholder="Business phone number" value={phone} onChange={setPhone} />
                    </div>
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <Field label="Primary Industry">
                    <TInput placeholder="Select Trade (e.g. Licensed Electrical Contractor)" value={industry} onChange={setIndustry} />
                  </Field>
                  <Field label="Are you an Approved Sponsor?">
                    <TSelect
                      placeholder="Yes (Standard Business Sponsor) / No (Direct Hire Only)"
                      value={isApprovedSponsor}
                      onChange={setIsApprovedSponsor}
                      options={['Yes (Standard Business Sponsor)','No (Direct Hire Only)']}
                    />
                  </Field>
                  <Field label="Years in Operation">
                    <TSelect placeholder="Select Years in Operation" value={yearsOp} onChange={setYearsOp} options={YEARS_OPTIONS} />
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <Field label="Business Type">
                    <TSelect placeholder="Select from dropdown" value={bizType} onChange={setBizType} options={BUSINESS_TYPES} />
                  </Field>
                  <Field label="ABN / Business Registration Number">
                    <TInput placeholder="Enter 11-digit ABN" value={abn} onChange={setAbn} />
                  </Field>
                  <Field label="Company Description">
                    <textarea
                      value={description}
                      onChange={e => setDesc(e.target.value)}
                      placeholder="Briefly describe your company's mission and the types of projects you typically manage (e.g., industrial wiring, solar farms)..."
                      rows={5}
                      style={{ borderRadius:10, border:'1.5px solid #d0d5dd', padding:'12px 16px', fontFamily:font, fontSize:15, color:'#343434', resize:'vertical', outline:'none', width:'100%', boxSizing:'border-box', lineHeight:1.5 }}
                      onFocus={e => { e.target.style.border='1.5px solid #5379f4' }}
                      onBlur={e => { e.target.style.border='1.5px solid #d0d5dd' }}
                    />
                    <p style={{ fontFamily:font, fontSize:13, color:'#6a7380', margin:'4px 0 0' }}>
                      This is the first thing candidates will see about your business.
                    </p>
                  </Field>
                </>
              )}

              {err && <p style={{ fontFamily:font, fontSize:14, color:'#e53e3e', margin:0 }}>{err}</p>}
            </div>
          </div>

          {/* Nav buttons */}
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:36, paddingTop:24, borderTop:'1px solid #f0f0f4' }}>
            {step > 1 ? (
              <button onClick={() => setStep(s => s-1)}
                style={{ height:48, padding:'0 28px', background:'transparent', border:'1.5px solid #f26f37', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:15, fontWeight:600, color:'#f26f37' }}
                onMouseEnter={e => e.currentTarget.style.background='#fff5f0'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                Back
              </button>
            ) : (
              <button onClick={() => save(step)} disabled={saving}
                style={{ height:48, padding:'0 28px', background:'transparent', border:'1.5px solid #f26f37', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:15, fontWeight:600, color:'#f26f37', opacity:saving?0.7:1 }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            )}
            <button onClick={() => { if (step < 3) save(step+1); else save('done') }} disabled={saving}
              style={{ height:48, padding:'0 32px', background:'#156dbf', color:'#fff', border:'none', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:15, fontWeight:600, boxShadow:'0 4px 12px rgba(21,109,191,0.25)', opacity:saving?0.7:1 }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.background='#1259a0' }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.background='#156dbf' }}>
              {saving ? 'Saving…' : nextLabels[step-1]}
            </button>
          </div>
        </div>
      </div>
    </CompanyLayout>
  )
}
