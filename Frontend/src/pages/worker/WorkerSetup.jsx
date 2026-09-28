/**
 * WorkerSetup — 3-step profile setup for worker/candidate.
 * Figma nodes: 1-3152 (Step 1), 1-3691 (Step 2), 1-4188 (Step 3)
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { WorkerLayout } from './WorkerLayout'
import {
  getToken, getMe,
  getCandidateProfile, createCandidateProfile, updateCandidateProfile,
} from '../../services/api'
import { MOCK_USER, MOCK_PROFILE } from './mockData'

// Local assets
import wdEllipseRing from '../../assets/worker-dashboard/wd-ellipse-ring.png'
import wdAvatar2     from '../../assets/worker-dashboard/wd-avatar2.png'

const font = "'Urbanist', sans-serif"

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Brazil','Canada','Chile','China','Colombia','Croatia','Czech Republic',
  'Denmark','Egypt','Ethiopia','Finland','France','Germany','Ghana','Greece','Hungary',
  'India','Indonesia','Iran','Iraq','Ireland','Israel','Italy','Japan','Jordan',
  'Kenya','Malaysia','Mexico','Morocco','Netherlands','New Zealand','Nigeria','Norway',
  'Pakistan','Peru','Philippines','Poland','Portugal','Romania','Russia','Saudi Arabia',
  'Serbia','Singapore','South Africa','South Korea','Spain','Sri Lanka','Sweden',
  'Switzerland','Thailand','Turkey','UAE','Ukraine','United Kingdom','United States',
  'Vietnam','Zimbabwe',
]

const EXPERIENCE_OPTIONS = [
  'Less than 1 year','1','2','3','4','5','6','7','8','9','10','15','20+',
]

const ENGLISH_OPTIONS = [
  'Native / Fluent','IELTS 7.0+','IELTS 6.5','IELTS 6.0','IELTS 5.5','IELTS 5.0',
  'PTE 65+','PTE 58+','PTE 50+','Basic English','No formal test taken',
]

const LANGUAGE_OPTIONS = [
  'Arabic','Bengali','Chinese (Mandarin)','Chinese (Cantonese)','Dutch','Farsi',
  'Filipino/Tagalog','French','German','Greek','Gujarati','Hebrew','Hindi',
  'Indonesian','Italian','Japanese','Korean','Malay','Nepali','Polish',
  'Portuguese','Punjabi','Romanian','Russian','Sinhalese','Somali','Spanish',
  'Swahili','Tamil','Thai','Turkish','Ukrainian','Urdu','Vietnamese',
]

function Field({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434' }}>{label}</label>
      {children}
    </div>
  )
}

function TextInput({ placeholder, value, onChange, type='text' }) {
  const [focused, setFocused] = useState(false)
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        height:48, borderRadius:10,
        border: focused ? '1.5px solid #5379f4' : '1.5px solid #d0d5dd',
        padding:'0 16px', fontFamily:font, fontSize:15, color:'#343434',
        outline:'none', width:'100%', boxSizing:'border-box', background:'#fff',
      }}
    />
  )
}

function SelectInput({ placeholder, value, onChange, options }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ position:'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          height:48, borderRadius:10,
          border: focused ? '1.5px solid #5379f4' : '1.5px solid #d0d5dd',
          padding:'0 40px 0 16px', fontFamily:font, fontSize:15,
          color: value ? '#343434' : '#9ca3af',
          outline:'none', width:'100%', background:'#fff',
          appearance:'none', cursor:'pointer', boxSizing:'border-box',
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <svg style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  )
}

function MultiSelect({ placeholder, selected, onChange, options }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  function toggle(opt) {
    onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])
  }

  return (
    <div ref={ref} style={{ position:'relative' }}>
      <div
        onClick={() => setOpen(v => !v)}
        style={{
          minHeight:48, borderRadius:10,
          border: open ? '1.5px solid #5379f4' : '1.5px solid #d0d5dd',
          padding:'8px 40px 8px 16px', fontFamily:font, fontSize:15,
          color: selected.length ? '#343434' : '#9ca3af',
          background:'#fff', cursor:'pointer', display:'flex',
          alignItems:'center', flexWrap:'wrap', gap:6, boxSizing:'border-box',
        }}
      >
        {selected.length === 0
          ? placeholder
          : selected.map(s => (
            <span key={s} style={{
              background:'#e8ecff', color:'#5379f4', borderRadius:6,
              padding:'2px 8px', fontSize:13, fontWeight:600,
            }}>{s}</span>
          ))
        }
      </div>
      <svg style={{ position:'absolute', right:14, top:16, pointerEvents:'none' }}
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
      {open && (
        <div style={{
          position:'absolute', top:'calc(100% + 4px)', left:0, right:0,
          background:'#fff', border:'1.5px solid #d0d5dd', borderRadius:10,
          zIndex:50, maxHeight:220, overflowY:'auto',
          boxShadow:'0 4px 16px rgba(0,0,0,0.08)',
        }}>
          {options.map(opt => {
            const sel = selected.includes(opt)
            return (
              <div
                key={opt}
                onClick={() => toggle(opt)}
                style={{
                  padding:'10px 16px', fontFamily:font, fontSize:14,
                  cursor:'pointer', display:'flex', alignItems:'center', gap:10,
                  background: sel ? '#f3f1fd' : 'transparent',
                  color: sel ? '#5379f4' : '#343434',
                }}
              >
                <div style={{
                  width:16, height:16, borderRadius:4, border:'2px solid',
                  borderColor: sel ? '#5379f4' : '#d0d5dd',
                  background: sel ? '#5379f4' : 'transparent',
                  flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  {sel && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </div>
                {opt}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function PhotoUpload({ photo, onPhoto, step }) {
  const fileRef = useRef(null)
  const size = 300, stroke = 12
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const pcts = [0.30, 0.65, 0.90]
  const offset = circ - (pcts[step - 1] || 0.30) * circ

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, width:300, flexShrink:0 }}>
      <p style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#343434', margin:0, alignSelf:'flex-start' }}>
        Upload Profile Picture
      </p>
      <div
        style={{ position:'relative', width:size, height:size, cursor:'pointer' }}
        onClick={() => fileRef.current?.click()}
      >
        {/* Progress ring */}
        <svg width={size} height={size} style={{ transform:'rotate(-90deg)', position:'absolute', inset:0, zIndex:2 }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e0dff0" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none"
            stroke="#5379f4" strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition:'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        {/* Avatar circle */}
        <div style={{
          position:'absolute', top:stroke+10, left:stroke+10,
          right:stroke+10, bottom:stroke+10,
          borderRadius:'50%', overflow:'hidden', zIndex:1,
        }}>
          {photo
            ? <img src={photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
            : <img src={wdEllipseRing} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          }
        </div>
        {/* + add button */}
        {!photo && (
          <div style={{
            position:'absolute', bottom:stroke+10, right:stroke+10,
            width:52, height:52, borderRadius:'50%',
            background:'#5379f4', boxShadow:'0 4px 12px rgba(83,121,244,0.4)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:3,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
        )}
      </div>
      {/* Progress label */}
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <div style={{ flex:1, height:6, background:'#e0dff0', borderRadius:6, width:120, overflow:'hidden' }}>
          <div style={{ width:`${pcts[step-1]*100}%`, height:'100%', background:'#5379f4', borderRadius:6, transition:'width 0.6s ease' }}/>
        </div>
        <span style={{ fontFamily:font, fontSize:13, fontWeight:700, color:'#5379f4' }}>{Math.round(pcts[step-1]*100)}%</span>
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }}
        onChange={e => { const f = e.target.files[0]; if (f) onPhoto(URL.createObjectURL(f)) }}
      />
    </div>
  )
}

export function WorkerSetup() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')
  const [photo, setPhoto] = useState(null)
  const [hasProfile, setHasProfile] = useState(false)

  const [fullName, setFullName]       = useState('')
  const [nationality, setNationality] = useState('')
  const [country, setCountry]         = useState('')
  const [phone, setPhone]             = useState('')
  const [phoneCode, setPhoneCode]     = useState('+61')
  const [tradeType, setTradeType]     = useState('')
  const [isElectrical, setIsElectrical] = useState('')
  const [experience, setExperience]   = useState('')
  const [englishLevel, setEnglishLevel] = useState('')
  const [languages, setLanguages]     = useState([])
  const [bio, setBio]                 = useState('')

  useEffect(() => {
    const token = getToken()
    function applyProfile(u, p) {
      setUser(u)
      setFullName(u.full_name || '')
      if (p) {
        setHasProfile(true)
        setTradeType(p.trade_type || '')
        setExperience(p.years_experience ? String(p.years_experience) : '')
        setIsElectrical(p.is_electrical_worker ? 'Yes' : 'No')
        setEnglishLevel(p.english_level || '')
        setLanguages(p.other_languages || [])
        setBio(p.bio || '')
      }
    }
    if (!token) { applyProfile(MOCK_USER, MOCK_PROFILE); return }
    Promise.all([getMe(token), getCandidateProfile(token).catch(() => null)])
      .then(([u, p]) => applyProfile(u, p))
      .catch(() => applyProfile(MOCK_USER, MOCK_PROFILE))
  }, [navigate])

  async function save(next) {
    setErr('')
    setSaving(true)
    const token = getToken()
    try {
      const payload = {
        full_name: fullName,
        nationality,
        country_of_residence: country,
        phone_number: `${phoneCode} ${phone}`.trim(),
        trade_type: tradeType,
        is_electrical_worker: isElectrical === 'Yes',
        years_experience: parseInt(experience) || null,
        english_level: englishLevel,
        other_languages: languages,
        bio,
        published: false,
      }
      if (hasProfile) await updateCandidateProfile(payload, token)
      else { await createCandidateProfile(payload, token); setHasProfile(true) }
      if (next === 'done') navigate('/worker/dashboard')
      else setStep(next)
    } catch (e) {
      setErr(e.detail || 'Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const titles = ['Tell us about yourself', 'What is your trade?', 'Final Touches']
  const subs = [
    'Create your professional profile to start matching with Australian employers.',
    'Provide your trade details to calculate your Australian suitability score.',
    'Tell us about your language skills and give a brief overview of your professional background.',
  ]
  const nextLabels = ['Next: Trade Details', 'Next: Languages', 'Save']

  return (
    <WorkerLayout user={user}>
      <div style={{ position:'relative', overflow:'hidden' }}>
        {/* Decorative blobs */}
        <div style={{ position:'absolute', top:-30, right:-40, width:260, height:260, borderRadius:'50%', background:'rgba(240,235,210,0.55)', zIndex:0, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:-40, right:80, width:180, height:180, borderRadius:'50%', background:'rgba(200,220,245,0.4)', zIndex:0, pointerEvents:'none' }}/>

        {/* Page header */}
        <div style={{ position:'relative', zIndex:1, marginBottom:28 }}>
          <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:'0 0 6px' }}>
            {titles[step-1]}
          </h2>
          <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', margin:0 }}>
            {subs[step-1]}
          </p>
        </div>

        {/* Card */}
        <div style={{ position:'relative', zIndex:1, background:'#fff', borderRadius:20, padding:'36px 40px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:48, alignItems:'start' }}>
            <PhotoUpload photo={photo} onPhoto={setPhoto} step={step} />

            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {step === 1 && (
                <>
                  <Field label="Full Name">
                    <TextInput placeholder="Enter your full name" value={fullName} onChange={setFullName} />
                  </Field>
                  <Field label="Nationality">
                    <SelectInput placeholder="Select your country" value={nationality} onChange={setNationality} options={COUNTRIES} />
                  </Field>
                  <Field label="Country of Residence">
                    <SelectInput placeholder="Where are you currently living?" value={country} onChange={setCountry} options={COUNTRIES} />
                  </Field>
                  <Field label="Phone Number">
                    <div style={{ display:'flex', gap:8 }}>
                      <div style={{ position:'relative', width:100, flexShrink:0 }}>
                        <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)}
                          style={{ height:48, borderRadius:10, border:'1.5px solid #d0d5dd', padding:'0 28px 0 12px', fontFamily:font, fontSize:15, color:'#343434', background:'#fff', appearance:'none', width:'100%', cursor:'pointer', outline:'none' }}>
                          {['+61','+1','+44','+91','+92','+971','+966','+880','+62','+63','+84','+27','+234'].map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <svg style={{ position:'absolute', right:6, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
                          width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </div>
                      <TextInput placeholder="Enter phone number" value={phone} onChange={setPhone} type="tel" />
                    </div>
                  </Field>
                </>
              )}

              {step === 2 && (
                <>
                  <Field label="Primary Trade Category">
                    <TextInput placeholder="Select your trade (e.g. Licensed Electrician)" value={tradeType} onChange={setTradeType} />
                  </Field>
                  <Field label="Are you an Electrical Worker?">
                    <SelectInput placeholder="Select Yes or No" value={isElectrical} onChange={setIsElectrical} options={['Yes','No']} />
                  </Field>
                  <Field label="Years of Experience">
                    <SelectInput placeholder="Enter years of experience" value={experience} onChange={setExperience} options={EXPERIENCE_OPTIONS} />
                  </Field>
                </>
              )}

              {step === 3 && (
                <>
                  <Field label="English Proficiency (IELTS/PTE)">
                    <SelectInput placeholder="Select from dropdown" value={englishLevel} onChange={setEnglishLevel} options={ENGLISH_OPTIONS} />
                  </Field>
                  <Field label="Other Languages">
                    <MultiSelect
                      placeholder="e.g. Urdu, Hindi, Arabic (you can multi-select)"
                      selected={languages}
                      onChange={setLanguages}
                      options={LANGUAGE_OPTIONS}
                    />
                  </Field>
                  <Field label="Profile Summary">
                    <textarea
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      placeholder='Briefly describe your expertise (e.g. "Licensed electrician with 10 years of experience in industrial wiring and motor controls...")'
                      rows={5}
                      style={{
                        borderRadius:10, border:'1.5px solid #d0d5dd',
                        padding:'12px 16px', fontFamily:font, fontSize:15,
                        color:'#343434', resize:'vertical', outline:'none',
                        width:'100%', boxSizing:'border-box', lineHeight:1.5,
                      }}
                      onFocus={e => { e.target.style.border='1.5px solid #5379f4' }}
                      onBlur={e => { e.target.style.border='1.5px solid #d0d5dd' }}
                    />
                    <p style={{ fontFamily:font, fontSize:13, color:'#6a7380', margin:'4px 0 0' }}>
                      This is the first thing employers will read about you.
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
              <button
                onClick={() => setStep(s => s - 1)}
                style={{ height:48, padding:'0 28px', background:'transparent', border:'1.5px solid #f26f37', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:15, fontWeight:600, color:'#f26f37' }}
                onMouseEnter={e => { e.currentTarget.style.background='#fff5f0' }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent' }}
              >
                Back
              </button>
            ) : (
              <button
                onClick={() => save(step)}
                disabled={saving}
                style={{ height:48, padding:'0 28px', background:'transparent', border:'1.5px solid #f26f37', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:15, fontWeight:600, color:'#f26f37', opacity:saving?0.7:1 }}
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            )}
            <button
              onClick={() => { if (step < 3) save(step + 1); else save('done') }}
              disabled={saving}
              style={{ height:48, padding:'0 32px', background:'#156dbf', color:'#fff', border:'none', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:15, fontWeight:600, boxShadow:'0 4px 12px rgba(21,109,191,0.25)', opacity:saving?0.7:1 }}
              onMouseEnter={e => { if (!saving) e.currentTarget.style.background='#1259a0' }}
              onMouseLeave={e => { if (!saving) e.currentTarget.style.background='#156dbf' }}
            >
              {saving ? 'Saving…' : nextLabels[step-1]}
            </button>
          </div>
        </div>
      </div>
    </WorkerLayout>
  )
}
