/**
 * TrainerSetupFlow — 3-step training provider profile setup.
 * Step 1 (1-3504): Tell us about your Institution
 * Step 2 (1-4015): What do you teach?
 * Step 3 (1-4512): Provider Overview
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrainerLayout } from './TrainerLayout'
import { getToken, getMe, createTrainingProvider, updateTrainingProvider, getTrainingProviders } from '../../services/api'
import { MOCK_TRAINER_USER, MOCK_PROVIDER } from './trainerMockData'

const font = "'Urbanist', sans-serif"

const AU_LOCATIONS = [
  'Sydney, NSW','Parramatta, NSW','Newcastle, NSW','Wollongong, NSW',
  'Melbourne, VIC','Geelong, VIC','Brisbane, QLD','Gold Coast, QLD',
  'Perth, WA','Adelaide, SA','Darwin, NT','Canberra, ACT','Hobart, TAS',
  'Cairns, QLD','Townsville, QLD','Ballarat, VIC','Bendigo, VIC',
]

const YEARS_OPTIONS = ['Less than 1','1–2','3–5','5–10','10+','20+']

const ACCREDITATION_TYPES = [
  'Government Funded','Private RTO','TAFE','University',
  'Enterprise RTO','Community College','Online Provider',
]

const CAMPUS_OPTIONS = [
  'Sydney, NSW','Melbourne, VIC','Brisbane, QLD','Perth, WA',
  'Adelaide, SA','Canberra, ACT','Darwin, NT','Hobart, TAS',
  'Online Only','Multiple Campuses',
]

const TRAINING_SECTORS = [
  'Electrical & Energy','Plumbing & Gas','Construction & Civil',
  'HVAC & Refrigeration','Mining & Resources','Automotive',
  'Manufacturing & Engineering','Information Technology',
  'Business & Finance','Health & Community Services',
]

/* ─── Shared UI ─── */
function Field({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434' }}>{label}</label>
      {children}
    </div>
  )
}
function TInput({ placeholder, value, onChange }) {
  const [f,setF]=useState(false)
  return <input placeholder={placeholder} value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
    style={{ height:48, borderRadius:10, border:`1.5px solid ${f?'#5379f4':'#d0d5dd'}`, padding:'0 16px', fontFamily:font, fontSize:15, color:'#343434', outline:'none', width:'100%', boxSizing:'border-box', background:'#fff' }}/>
}
function TSelect({ placeholder, value, onChange, options }) {
  const [f,setF]=useState(false)
  return (
    <div style={{ position:'relative' }}>
      <select value={value} onChange={e=>onChange(e.target.value)} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
        style={{ height:48, borderRadius:10, border:`1.5px solid ${f?'#5379f4':'#d0d5dd'}`, padding:'0 40px 0 16px', fontFamily:font, fontSize:15, color:value?'#343434':'#9ca3af', outline:'none', width:'100%', background:'#fff', appearance:'none', cursor:'pointer', boxSizing:'border-box' }}>
        <option value="">{placeholder}</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
      <svg style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  )
}
function MultiSelectDropdown({ placeholder, selected, onChange, options }) {
  const [open,setOpen]=useState(false)
  const ref=useRef(null)
  useEffect(()=>{
    function h(e){ if(ref.current&&!ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h)
  },[])
  function toggle(opt){ onChange(selected.includes(opt)?selected.filter(s=>s!==opt):[...selected,opt]) }
  return (
    <div ref={ref} style={{ position:'relative' }}>
      <div onClick={()=>setOpen(v=>!v)} style={{ minHeight:48, borderRadius:10, border:`1.5px solid ${open?'#5379f4':'#d0d5dd'}`, padding:'8px 40px 8px 16px', fontFamily:font, fontSize:15, color:selected.length?'#343434':'#9ca3af', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', flexWrap:'wrap', gap:6, boxSizing:'border-box' }}>
        {selected.length===0?placeholder:selected.map(s=>(
          <span key={s} style={{ background:'#e8ecff', color:'#5379f4', borderRadius:6, padding:'2px 8px', fontSize:13, fontWeight:600 }}>{s}</span>
        ))}
      </div>
      <svg style={{ position:'absolute', right:14, top:16, pointerEvents:'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      {open&&(
        <div style={{ position:'absolute', top:'calc(100% + 4px)', left:0, right:0, background:'#fff', border:'1.5px solid #d0d5dd', borderRadius:10, zIndex:50, maxHeight:200, overflowY:'auto', boxShadow:'0 4px 16px rgba(0,0,0,0.08)' }}>
          {options.map(opt=>{
            const sel=selected.includes(opt)
            return (
              <div key={opt} onClick={()=>toggle(opt)} style={{ padding:'10px 16px', fontFamily:font, fontSize:14, cursor:'pointer', display:'flex', alignItems:'center', gap:10, background:sel?'#f3f1fd':'transparent', color:sel?'#5379f4':'#343434' }}>
                <div style={{ width:16, height:16, borderRadius:4, border:`2px solid ${sel?'#5379f4':'#d0d5dd'}`, background:sel?'#5379f4':'transparent', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  {sel&&<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
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
  const ref=useRef(null)
  const size=180,stroke=10,r=(size-stroke)/2,circ=2*Math.PI*r
  const offsets=[0.30,0.65,0.90]
  const offset=circ-(offsets[step-1]||0.3)*circ
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
      <p style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434', margin:0 }}>Upload Profile Picture</p>
      <div style={{ position:'relative', width:size, height:size, cursor:'pointer' }} onClick={()=>ref.current?.click()}>
        <svg width={size} height={size} style={{ transform:'rotate(-90deg)', position:'absolute', inset:0 }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e0dff0" strokeWidth={stroke}/>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#5379f4" strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition:'stroke-dashoffset 0.6s ease' }}/>
        </svg>
        <div style={{ position:'absolute', top:stroke+8, left:stroke+8, right:stroke+8, bottom:stroke+8, borderRadius:'50%', background:'#f0f0f5', border:'2px dashed #b0b8d0', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
          {photo?<img src={photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>:<span style={{ fontSize:32, color:'#9ca3af' }}>+</span>}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>{ const f=e.target.files[0]; if(f) onPhoto(URL.createObjectURL(f)) }}/>
    </div>
  )
}

/* ═══════════════════════════════════════ */
export function TrainerSetupFlow() {
  const navigate=useNavigate()
  const [user,setUser]=useState(null)
  const [provider,setProvider]=useState(null)
  const [step,setStep]=useState(1)
  const [saving,setSaving]=useState(false)
  const [err,setErr]=useState('')
  const [photo,setPhoto]=useState(null)
  const [hasProvider,setHasProvider]=useState(false)

  // Step 1
  const [institutionName,setInstitutionName]=useState('')
  const [rtoCode,setRtoCode]=useState('')
  const [campusLocation,setCampusLocation]=useState('')
  const [phone,setPhone]=useState('')
  const [phoneCode,setPhoneCode]=useState('+61')

  // Step 2
  const [trainingSector,setTrainingSector]=useState('')
  const [cricosRegistered,setCricosRegistered]=useState('')
  const [yearsInEdu,setYearsInEdu]=useState('')

  // Step 3
  const [accreditationType,setAccreditationType]=useState('')
  const [secondaryCampuses,setSecondaryCampuses]=useState([])
  const [description,setDescription]=useState('')

  useEffect(()=>{
    const token=getToken()
    function apply(u,p){
      setUser(u)
      if(p){
        setHasProvider(true); setProvider(p)
        setInstitutionName(p.institution_name||'')
        setRtoCode(p.rto_code||'')
        setCampusLocation(p.main_campus_location||'')
        setTrainingSector(p.primary_training_sector||'')
        setCricosRegistered(p.cricos_registered?'Yes':'No')
        setYearsInEdu(p.years_in_education||'')
        setAccreditationType(p.accreditation_type||'')
        setSecondaryCampuses(p.secondary_campus_locations||[])
        setDescription(p.description||'')
      }
    }
    if(!token){ apply(MOCK_TRAINER_USER, MOCK_PROVIDER); return }
    getMe(token)
      .then(u=>{ setUser(u); return getTrainingProviders().catch(()=>null) })
      .then(data=>{ const p=Array.isArray(data)?data[0]:null; if(p) apply(MOCK_TRAINER_USER, p); else setUser(MOCK_TRAINER_USER) })
      .catch(()=>apply(MOCK_TRAINER_USER, MOCK_PROVIDER))
  },[])

  async function save(next){
    setErr('')
    const token=getToken()
    if(!token){ if(next==='done') navigate('/trainer/dashboard'); else setStep(next); return }
    setSaving(true)
    try{
      const payload={ institution_name:institutionName, rto_code:rtoCode, main_campus_location:campusLocation, phone_number:`${phoneCode} ${phone}`.trim(), primary_training_sector:trainingSector, cricos_registered:cricosRegistered==='Yes', years_in_education:yearsInEdu, accreditation_type:accreditationType, secondary_campus_locations:secondaryCampuses, description }
      if(hasProvider) await updateTrainingProvider(provider?.id, payload, token)
      else{ await createTrainingProvider(payload, token); setHasProvider(true) }
      if(next==='done') navigate('/trainer/dashboard'); else setStep(next)
    }catch(e){ setErr(e.detail||'Failed to save.') }
    finally{ setSaving(false) }
  }

  const titles=['Tell us about your Institution','What do you teach?','Provider Overview']
  const subs=[
    'Set up your provider profile to start listing courses and attracting students.',
    'Select the industries you are accredited to provide training and assessments for.',
    'Share your mission and describe the certifications you offer to prospective students.',
  ]
  const nextLabels=['Next: Training Categories','Next: Final Details','Complete Profile']

  const mockProvider={ institution_name:institutionName||MOCK_PROVIDER.institution_name }

  return (
    <TrainerLayout user={user} provider={mockProvider}>
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
            <PhotoUpload photo={photo} onPhoto={setPhoto} step={step}/>

            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              {step===1&&(
                <>
                  <Field label="Institution Name"><TInput placeholder="e.g. Sydney Trade College" value={institutionName} onChange={setInstitutionName}/></Field>
                  <Field label="RTO Registration Code"><TInput placeholder="Enter 5-digit RTO code (e.g. 12345)" value={rtoCode} onChange={setRtoCode}/></Field>
                  <Field label="Main Campus Location"><TSelect placeholder="Street, Suburb, State (e.g. Parramatta, NSW)" value={campusLocation} onChange={setCampusLocation} options={AU_LOCATIONS}/></Field>
                  <Field label="Office Contact Number">
                    <div style={{ display:'flex', gap:8 }}>
                      <div style={{ position:'relative', width:100, flexShrink:0 }}>
                        <select value={phoneCode} onChange={e=>setPhoneCode(e.target.value)} style={{ height:48, borderRadius:10, border:'1.5px solid #d0d5dd', padding:'0 28px 0 12px', fontFamily:font, fontSize:15, color:'#343434', background:'#fff', appearance:'none', width:'100%', cursor:'pointer', outline:'none' }}>
                          {['+61','+1','+44','+91','+64'].map(c=><option key={c} value={c}>{c}</option>)}
                        </select>
                        <svg style={{ position:'absolute', right:6, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                      </div>
                      <TInput placeholder="Office phone number" value={phone} onChange={setPhone}/>
                    </div>
                  </Field>
                </>
              )}
              {step===2&&(
                <>
                  <Field label="Primary Training Sector"><TInput placeholder="e.g. Electrical & Energy" value={trainingSector} onChange={setTrainingSector}/></Field>
                  <Field label="CRICOS Registered?"><TSelect placeholder="Select Yes or No" value={cricosRegistered} onChange={setCricosRegistered} options={['Yes','No']}/></Field>
                  <Field label="Years in Education"><TSelect placeholder="Select Years in Education" value={yearsInEdu} onChange={setYearsInEdu} options={YEARS_OPTIONS}/></Field>
                </>
              )}
              {step===3&&(
                <>
                  <Field label="Accreditation Type"><TSelect placeholder="e.g. Government Funded, Private RTO, TAFE" value={accreditationType} onChange={setAccreditationType} options={ACCREDITATION_TYPES}/></Field>
                  <Field label="Secondary Campus Locations"><MultiSelectDropdown placeholder="Additional Accreditations" selected={secondaryCampuses} onChange={setSecondaryCampuses} options={CAMPUS_OPTIONS}/></Field>
                  <Field label="Institution Description">
                    <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={5}
                      placeholder="Provide a brief overview of your college, facilities, and how you support international students with trade gap training..."
                      style={{ borderRadius:10, border:'1.5px solid #d0d5dd', padding:'12px 16px', fontFamily:font, fontSize:15, color:'#343434', resize:'vertical', outline:'none', width:'100%', boxSizing:'border-box', lineHeight:1.5 }}
                      onFocus={e=>e.target.style.border='1.5px solid #5379f4'} onBlur={e=>e.target.style.border='1.5px solid #d0d5dd'}/>
                    <p style={{ fontFamily:font, fontSize:13, color:'#6a7380', margin:'4px 0 0' }}>This is the first thing candidates and Company will see.</p>
                  </Field>
                </>
              )}
              {err&&<p style={{ fontFamily:font, fontSize:14, color:'#e53e3e', margin:0 }}>{err}</p>}
            </div>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', marginTop:36, paddingTop:24, borderTop:'1px solid #f0f0f4' }}>
            {step>1?(
              <button onClick={()=>setStep(s=>s-1)} style={{ height:48, padding:'0 28px', background:'transparent', border:'1.5px solid #f26f37', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:15, fontWeight:600, color:'#f26f37' }} onMouseEnter={e=>e.currentTarget.style.background='#fff5f0'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>Back</button>
            ):(
              <button onClick={()=>save(step)} disabled={saving} style={{ height:48, padding:'0 28px', background:'transparent', border:'1.5px solid #f26f37', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:15, fontWeight:600, color:'#f26f37', opacity:saving?0.7:1 }}>{saving?'Saving…':'Save'}</button>
            )}
            <button onClick={()=>{ if(step<3) save(step+1); else save('done') }} disabled={saving} style={{ height:48, padding:'0 32px', background:'#156dbf', color:'#fff', border:'none', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:15, fontWeight:600, boxShadow:'0 4px 12px rgba(21,109,191,0.25)', opacity:saving?0.7:1 }} onMouseEnter={e=>{ if(!saving) e.currentTarget.style.background='#1259a0' }} onMouseLeave={e=>{ if(!saving) e.currentTarget.style.background='#156dbf' }}>{saving?'Saving…':nextLabels[step-1]}</button>
          </div>
        </div>
      </div>
    </TrainerLayout>
  )
}
