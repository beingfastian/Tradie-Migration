/**
 * TrainerSetupFlow — Figma nodes 1-3501, 1-4012, 1-4509
 * 3-step provider registration form
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import trDeco1       from '../../assets/trainer-dashboard/tr-deco1.png'
import trDeco2       from '../../assets/trainer-dashboard/tr-deco2.png'
import trSetupEllipse from '../../assets/trainer-dashboard/tr-setup-ellipse.png'
import trSetupAdd    from '../../assets/trainer-dashboard/tr-setup-add.svg'
import trSetupProgress from '../../assets/trainer-dashboard/tr-setup-progress.png'

const font = "'Urbanist', sans-serif"

const STEPS = [
  { n:1, label:'Institution Details' },
  { n:2, label:'Training Categories' },
  { n:3, label:'Provider Overview' },
]

const LOCATIONS = ['Sydney, NSW','Melbourne, VIC','Brisbane, QLD','Perth, WA','Adelaide, SA','Hobart, TAS','Darwin, NT','Canberra, ACT']
const SECTORS   = ['Electrical & Electrotechnology','Plumbing & Services','Construction & Infrastructure','HVAC & Refrigeration','Automotive','Mining & Resources','General Trade']
const CRICOS    = ['Yes – CRICOS Registered','No – Domestic Only']
const ACCRED    = ['Certificate III','Certificate IV','Diploma','Advanced Diploma','Graduate Certificate','Graduate Diploma']

function StepDots({ step }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:0, marginBottom:32 }}>
      {STEPS.map((s, i) => {
        const done   = s.n < step
        const active = s.n === step
        return (
          <div key={s.n} style={{ display:'flex', alignItems:'center' }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <div style={{
                width:36, height:36, borderRadius:'50%',
                background: done ? '#129578' : active ? '#156dbf' : '#e0dff0',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:font, fontWeight:700, fontSize:15,
                color: (done || active) ? '#fff' : '#9ca3af',
              }}>
                {done ? '✓' : s.n}
              </div>
              <span style={{ fontFamily:font, fontSize:12, fontWeight:600, color: active ? '#156dbf' : '#9ca3af', whiteSpace:'nowrap' }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width:80, height:2, background: done ? '#129578' : '#e0dff0', margin:'0 8px', marginBottom:24 }}/>
            )}
          </div>
        )
      })}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <label style={{ fontFamily:font, fontWeight:600, fontSize:15, color:'#343434' }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  height:52, border:'1.5px solid #d0d5dd', borderRadius:12,
  padding:'0 16px', fontFamily:font, fontSize:15, color:'#343434',
  outline:'none', background:'#fff', width:'100%', boxSizing:'border-box',
}

const selectStyle = { ...inputStyle, cursor:'pointer', appearance:'none', backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236a7380\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'/%3E%3C/svg%3E")', backgroundRepeat:'no-repeat', backgroundPosition:'right 16px center', paddingRight:44 }

export function TrainerSetupFlow() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    institution_name:'', rto_code:'', campus_location:'', contact_number:'',
    training_sector:'', cricos:'', years_education:'',
    accreditation_type:'', secondary_locations:'', description:'',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div style={{ minHeight:'100vh', background:'#f6f6f9', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
      <div style={{ width:'100%', maxWidth:760, background:'#fff', borderRadius:24, boxShadow:'0 4px 32px rgba(0,0,0,0.08)', overflow:'hidden', position:'relative' }}>

        {/* Decorative blobs */}
        <img src={trDeco1} alt="" style={{ position:'absolute', left:20, top:'15%', width:52, opacity:0.7, pointerEvents:'none', transform:'rotate(6deg)' }}/>
        <img src={trDeco2} alt="" style={{ position:'absolute', right:20, bottom:'20%', width:52, opacity:0.7, pointerEvents:'none', transform:'rotate(-160deg)' }}/>

        <div style={{ padding:'48px 56px' }}>

          {/* Logo upload group */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:32 }}>
            <div style={{ position:'relative', width:160, height:160 }}>
              <img src={trSetupEllipse} alt="" style={{ width:160, height:160, borderRadius:'50%', objectFit:'cover', display:'block' }}/>
              <img src={trSetupProgress} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}/>
              <div style={{
                position:'absolute', bottom:4, right:4,
                width:40, height:40, borderRadius:'50%',
                background:'#156dbf', display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 2px 8px rgba(21,109,191,0.35)', cursor:'pointer',
              }}>
                <img src={trSetupAdd} alt="add" style={{ width:20, height:20 }}/>
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 style={{ fontFamily:font, fontWeight:700, fontSize:28, color:'#1e1e1e', textAlign:'center', margin:'0 0 8px' }}>
            {step === 1 && 'Tell us about your Institution'}
            {step === 2 && 'What do you teach?'}
            {step === 3 && 'Provider Overview'}
          </h2>
          <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', textAlign:'center', margin:'0 0 28px' }}>
            {step === 1 && 'Help students find your institution by completing your provider profile.'}
            {step === 2 && 'Tell students about the training programs you offer.'}
            {step === 3 && 'Add final details to complete your provider profile.'}
          </p>

          <StepDots step={step} />

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                <Field label="Institution Name">
                  <input style={inputStyle} placeholder="e.g. Trades Academy Australia" value={form.institution_name} onChange={e => set('institution_name', e.target.value)}/>
                </Field>
                <Field label="RTO Registration Code">
                  <input style={inputStyle} placeholder="e.g. 12345" value={form.rto_code} onChange={e => set('rto_code', e.target.value)}/>
                </Field>
                <Field label="Main Campus Location">
                  <select style={selectStyle} value={form.campus_location} onChange={e => set('campus_location', e.target.value)}>
                    <option value="">Select location</option>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Office Contact Number">
                  <input style={inputStyle} placeholder="e.g. +61 2 9000 0000" value={form.contact_number} onChange={e => set('contact_number', e.target.value)}/>
                </Field>
              </div>
              <div style={{ display:'flex', gap:16, marginTop:8 }}>
                <button style={{
                  flex:1, height:52, background:'#fff', border:'1.5px solid #156dbf',
                  borderRadius:12, fontFamily:font, fontWeight:700, fontSize:16, color:'#156dbf', cursor:'pointer',
                }}>Save</button>
                <button onClick={() => setStep(2)} style={{
                  flex:2, height:52, background:'#156dbf', border:'none',
                  borderRadius:12, fontFamily:font, fontWeight:700, fontSize:16, color:'#fff', cursor:'pointer',
                  boxShadow:'0 4px 12px rgba(21,109,191,0.22)',
                }}>Next: Training Categories →</button>
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                <Field label="Primary Training Sector">
                  <select style={selectStyle} value={form.training_sector} onChange={e => set('training_sector', e.target.value)}>
                    <option value="">Select sector</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="CRICOS Registered?">
                  <select style={selectStyle} value={form.cricos} onChange={e => set('cricos', e.target.value)}>
                    <option value="">Select</option>
                    {CRICOS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </Field>
                <Field label="Years in Education">
                  <input style={inputStyle} placeholder="e.g. 10" value={form.years_education} onChange={e => set('years_education', e.target.value)}/>
                </Field>
              </div>
              <div style={{ display:'flex', gap:16, marginTop:8 }}>
                <button onClick={() => setStep(1)} style={{
                  flex:1, height:52, background:'#fff', border:'1.5px solid #6a7380',
                  borderRadius:12, fontFamily:font, fontWeight:700, fontSize:16, color:'#6a7380', cursor:'pointer',
                }}>← Back</button>
                <button onClick={() => setStep(3)} style={{
                  flex:2, height:52, background:'#156dbf', border:'none',
                  borderRadius:12, fontFamily:font, fontWeight:700, fontSize:16, color:'#fff', cursor:'pointer',
                  boxShadow:'0 4px 12px rgba(21,109,191,0.22)',
                }}>Next: Final Details →</button>
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                <Field label="Accreditation Type">
                  <select style={selectStyle} value={form.accreditation_type} onChange={e => set('accreditation_type', e.target.value)}>
                    <option value="">Select type</option>
                    {ACCRED.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </Field>
                <Field label="Secondary Campus Locations">
                  <input style={inputStyle} placeholder="e.g. Melbourne, Brisbane" value={form.secondary_locations} onChange={e => set('secondary_locations', e.target.value)}/>
                </Field>
              </div>
              <Field label="Institution Description">
                <textarea style={{
                  border:'1.5px solid #d0d5dd', borderRadius:12,
                  padding:'14px 16px', fontFamily:font, fontSize:15, color:'#343434',
                  outline:'none', background:'#fff', width:'100%', boxSizing:'border-box',
                  minHeight:120, resize:'vertical',
                }} placeholder="Describe your institution, its history, and what makes it unique..." value={form.description} onChange={e => set('description', e.target.value)}/>
              </Field>
              <div style={{ display:'flex', gap:16, marginTop:8 }}>
                <button onClick={() => setStep(2)} style={{
                  flex:1, height:52, background:'#fff', border:'1.5px solid #6a7380',
                  borderRadius:12, fontFamily:font, fontWeight:700, fontSize:16, color:'#6a7380', cursor:'pointer',
                }}>← Back</button>
                <button onClick={() => navigate('/trainer/dashboard')} style={{
                  flex:2, height:52, background:'#129578', border:'none',
                  borderRadius:12, fontFamily:font, fontWeight:700, fontSize:16, color:'#fff', cursor:'pointer',
                  boxShadow:'0 4px 12px rgba(18,149,120,0.22)',
                }}>✓ Complete Profile</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
