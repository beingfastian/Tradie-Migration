/**
 * TrainerCourseSummary — Figma node 1-4855
 */
import { useState, useEffect } from 'react'
import { TrainerLayout } from './TrainerLayout'
import { getToken, getMe } from '../../services/api'

const font = "'Urbanist', sans-serif"

const FIELDS = [
  { label:'Name of Course', value:'Certificate III in Electrotechnology Electrician' },
  { label:'RTO Code', value:'#12345' },
  { label:'Qualification Level', value:'Certificate III' },
  { label:'Training Provider AQF Framework', value:'AQF Level 3' },
  { label:'Provider Website', value:'www.tradesaustralia.edu.au' },
]

export function TrainerCourseSummary() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    getMe(token).then(u => setUser(u)).catch(() => {})
  }, [])

  return (
    <TrainerLayout user={user}>

      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:font, fontWeight:700, fontSize:28, color:'#1e1e1e', margin:'0 0 4px' }}>
          Course Summary
        </h2>
        <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', margin:0 }}>
          Overview of your registered course details.
        </p>
      </div>

      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 16px rgba(0,0,0,0.05)', padding:'40px 48px', maxWidth:760 }}>

        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          {FIELDS.map(f => (
            <div key={f.label} style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontFamily:font, fontWeight:600, fontSize:14, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.04em' }}>
                {f.label}
              </label>
              <div style={{
                height:52, border:'1.5px solid #e0dff0', borderRadius:12,
                padding:'0 16px', display:'flex', alignItems:'center',
                background:'#f8f8fc',
              }}>
                <span style={{ fontFamily:font, fontSize:16, fontWeight:600, color:'#343434' }}>{f.value}</span>
              </div>
            </div>
          ))}
        </div>

        <button style={{
          marginTop:36, width:'100%', height:56,
          background:'#156dbf', border:'none', borderRadius:14,
          fontFamily:font, fontWeight:700, fontSize:16, color:'#fff',
          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:12,
          boxShadow:'0 6px 20px rgba(21,109,191,0.30)',
          transition:'background 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background='#1259a0'}
          onMouseLeave={e => e.currentTarget.style.background='#156dbf'}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Course Brochure: Download PDF
        </button>

      </div>
    </TrainerLayout>
  )
}
