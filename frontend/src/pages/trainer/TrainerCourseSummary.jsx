/**
 * TrainerCourseSummary — Figma node 1:4858 (file Ud0NnDoXtD1Rd5t4EaAlBT)
 * All assets from Figma API. Inline styles only.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrainerLayout } from './TrainerLayout'
import { getToken, getMe } from '../../services/api'

const font = "'Urbanist', sans-serif"

/* ─── FIGMA ASSET — back arrow icon ─── */
const imgBackArrow = 'https://www.figma.com/api/mcp/asset/0df9014f-1709-41aa-a3ce-416679c14bbd'

export function TrainerCourseSummary() {
  const navigate    = useNavigate()
  const [user, setUser]         = useState(null)
  const [provider, setProvider] = useState(null)
  const [saved, setSaved]       = useState(false)

  const [form, setForm] = useState({
    courseName:   'Cert III Electrotechnology',
    rtoCode:      '#12345',
    qualLevel:    'Certificate III',
    aqfFramework: 'AQF Level 3',
    website:      'www.tradesaustralia.edu.au (Example)',
  })

  useEffect(() => {
    const token = getToken()
    if (!token) return
    getMe(token).then(u => setUser(u)).catch(() => {})
  }, [])

  function handleSave(e) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <TrainerLayout user={user} provider={provider}>

      {/* ── Page header ── */}
      <div style={{ display:'flex', alignItems:'flex-start', gap:16, marginBottom:24 }}>
        <button onClick={() => navigate('/trainer/dashboard')} style={{
          background:'none', border:'none', cursor:'pointer', padding:'10px 0',
          display:'flex', alignItems:'center', flexShrink:0,
        }}>
          <img src={imgBackArrow} alt="back" style={{ width:24, height:24, display:'block' }}/>
        </button>
        <div style={{ display:'flex', flexDirection:'column', gap:8, flex:1 }}>
          <h1 style={{ fontFamily:font, fontWeight:700, fontSize:34, color:'#343434', lineHeight:1.3, margin:0 }}>
            Course Summary
          </h1>
          <p style={{ fontFamily:font, fontWeight:500, fontSize:18, color:'#6a7380', lineHeight:1.3, margin:0 }}>
            View the core accreditation details, framework levels, and public-facing resources for your training institution.
          </p>
        </div>
      </div>

      {/* ── White form card ── */}
      <div style={{ background:'#fff', borderRadius:24, padding:32 }}>
        <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:16 }}>

          <FormField label="Name of Course:"
            value={form.courseName} onChange={v => setForm(f=>({...f, courseName:v}))}
            placeholder="Cert III Electrotechnology"/>

          <FormField label="RTO Code:"
            value={form.rtoCode} onChange={v => setForm(f=>({...f, rtoCode:v}))}
            placeholder="#12345"/>

          <FormField label="Qualification Level:"
            value={form.qualLevel} onChange={v => setForm(f=>({...f, qualLevel:v}))}
            placeholder="Certificate III"/>

          <FormField label="Training Provider AQF Framework:"
            value={form.aqfFramework} onChange={v => setForm(f=>({...f, aqfFramework:v}))}
            placeholder="AQF Level 3"/>

          <FormField label="Provider Website:"
            value={form.website} onChange={v => setForm(f=>({...f, website:v}))}
            placeholder="www.tradesaustralia.edu.au (Example)"/>

          {/* Download PDF — exact Figma: #5379f4, shadow #97b6fd */}
          <button type="button" style={{
            background:'#5379f4',
            boxShadow:'0px 4px 6.8px #97b6fd',
            border:'none', borderRadius:12, height:53,
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', width:'100%',
          }}>
            <span style={{ fontFamily:font, fontWeight:600, fontSize:16, color:'#fff', lineHeight:1.3 }}>
              Course Brochure: Download PDF
            </span>
          </button>

          {/* Save */}
          <button type="submit" style={{
            background: saved ? '#129578' : '#156dbf',
            border:'none', borderRadius:12, height:53,
            display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', width:'100%', transition:'background 0.25s',
          }}>
            <span style={{ fontFamily:font, fontWeight:600, fontSize:16, color:'#fff', lineHeight:1.3 }}>
              {saved ? '✓ Changes Saved' : 'Save Changes'}
            </span>
          </button>

        </form>
      </div>
    </TrainerLayout>
  )
}

function FormField({ label, value, onChange, placeholder }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <label style={{ fontFamily:font, fontWeight:700, fontSize:16, color:'#343434', lineHeight:1.3 }}>
        {label}
      </label>
      <div style={{
        background:'#fff', border:'1px solid #6a7380', borderRadius:12,
        display:'flex', alignItems:'center', height:56, padding:'0 20px',
      }}>
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{
            border:'none', outline:'none', flex:1,
            fontFamily:font, fontWeight:400, fontSize:16,
            color:'#6a7380', lineHeight:1.3, background:'transparent',
          }}/>
      </div>
    </div>
  )
}
