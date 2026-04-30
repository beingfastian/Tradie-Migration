/**
 * TrainerStudentDirectory — Student Directory with progress tracking.
 * Figma node 1-6409.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrainerLayout } from './TrainerLayout'
import { getToken, getMe } from '../../services/api'
import { MOCK_TRAINER_USER, MOCK_PROVIDER, MOCK_STUDENTS } from './trainerMockData'

const font = "'Urbanist', sans-serif"

const STATUS_COLORS = {
  'In Good Standing':    { bg:'#e8f5e9', color:'#129578' },
  'In Average Standing': { bg:'#fff3e8', color:'#f26f37' },
  'In Bad Standing':     { bg:'#fff0f0', color:'#e53e3e' },
}

const TABS = ['Active Students', 'Graduated / Past Students']

function Avatar({ name, size=36 }) {
  const initials = (name||'U').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
  const colors = ['#5379f4','#f26f37','#129578','#403c8b','#156dbf']
  const bg = colors[(name||'').charCodeAt(0)%colors.length]
  return <div style={{ width:size, height:size, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:size*0.38, fontFamily:font, flexShrink:0 }}>{initials}</div>
}

function ProgressBar({ pct }) {
  const color = pct >= 70 ? '#129578' : pct >= 40 ? '#f26f37' : '#e53e3e'
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ flex:1, background:'#e0dff0', borderRadius:6, height:8, overflow:'hidden' }}>
        <div style={{ width:`${pct}%`, height:'100%', background:color, borderRadius:6, transition:'width 0.4s ease' }}/>
      </div>
      <span style={{ fontFamily:font, fontSize:12, fontWeight:600, color, minWidth:32 }}>{pct}%</span>
    </div>
  )
}

function StatusDropdown({ value }) {
  const c = STATUS_COLORS[value] || { bg:'#f0f0f4', color:'#6a7380' }
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:c.bg, borderRadius:20, padding:'4px 10px 4px 12px', cursor:'pointer' }}>
      <span style={{ fontSize:12, fontWeight:700, color:c.color, fontFamily:font, whiteSpace:'nowrap' }}>{value}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  )
}

export function TrainerStudentDirectory() {
  const navigate = useNavigate()
  const [user, setUser]       = useState(null)
  const [provider, setProvider] = useState(null)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('Active Students')
  const [search, setSearch]   = useState('')
  const [page, setPage]       = useState(1)

  useEffect(() => {
    const token = getToken()
    if (!token) { setUser(MOCK_TRAINER_USER); setProvider(MOCK_PROVIDER); setStudents(MOCK_STUDENTS); setLoading(false); return }
    getMe(token)
      .then(u => { setUser(u); setProvider(MOCK_PROVIDER); setStudents(MOCK_STUDENTS) })
      .catch(() => { setUser(MOCK_TRAINER_USER); setProvider(MOCK_PROVIDER); setStudents(MOCK_STUDENTS) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = students.filter(s => {
    const q = search.toLowerCase()
    return !q || (s.name||'').toLowerCase().includes(q) || (s.course||'').toLowerCase().includes(q)
  })

  return (
    <TrainerLayout user={user} provider={provider}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
        <button onClick={()=>navigate('/trainer/dashboard')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, color:'#6a7380', display:'flex' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h2 style={{ fontFamily:font, fontSize:26, fontWeight:700, color:'#1e1e1e', margin:0 }}>Student Directory</h2>
          <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'4px 0 0' }}>Manage active enrollments, track student progress, and verify course completion for certification.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20 }}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'8px 20px', border:t===tab?'2px solid #5379f4':'2px solid transparent', borderRadius:20, cursor:'pointer', fontFamily:font, fontSize:14, fontWeight:600, background:t===tab?'#e8ecff':'#fff', color:t===tab?'#5379f4':'#6a7380', transition:'all 0.15s' }}>{t}</button>
        ))}
      </div>

      {/* Table card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'24px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontFamily:font, fontSize:18, fontWeight:700, color:'#1e1e1e' }}>My Courses</span>
            <div style={{ display:'flex', gap:8 }}>
              <span style={{ fontFamily:font, fontSize:13, color:'#6a7380', fontWeight:600 }}>Display</span>
              {['Grid','List'].map(v=>(
                <label key={v} style={{ display:'flex', alignItems:'center', gap:4, cursor:'pointer', fontFamily:font, fontSize:13, color:'#343434' }}>
                  <input type="radio" name="stuview" defaultChecked={v==='List'} style={{ accentColor:'#5379f4' }}/> {v}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {[
              <svg key="f" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="1.8" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
              <svg key="c" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="1.8" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            ].map((icon,i)=>(
              <div key={i} style={{ width:36, height:36, borderRadius:8, border:'1px solid #d0d5dd', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{icon}</div>
            ))}
            <div style={{ display:'flex', alignItems:'center', gap:8, border:'1px solid #d0d5dd', borderRadius:10, padding:'8px 14px', minWidth:220 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search by student name, ID, or course..." value={search} onChange={e=>setSearch(e.target.value)} style={{ border:'none', outline:'none', fontFamily:font, fontSize:13, color:'#343434', background:'transparent', flex:1 }}/>
            </div>
            <button style={{ height:36, padding:'0 14px', background:'transparent', border:'1.5px solid #d0d5dd', borderRadius:10, cursor:'pointer', fontFamily:font, fontSize:13, fontWeight:600, color:'#343434', whiteSpace:'nowrap' }}>Export Grades</button>
            <button style={{ height:36, padding:'0 14px', background:'#156dbf', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontFamily:font, fontSize:13, fontWeight:600, whiteSpace:'nowrap' }}
              onMouseEnter={e=>e.currentTarget.style.background='#1259a0'} onMouseLeave={e=>e.currentTarget.style.background='#156dbf'}>
              + Add Student
            </button>
          </div>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:font }}>
            <thead>
              <tr style={{ borderBottom:'2px solid #f0f0f4' }}>
                {['Student Name','Enrolled Course','Progress','Last Activity','Status','Action'].map(h=>(
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:13, fontWeight:700, color:'#6a7380', whiteSpace:'nowrap' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>{h}{h!=='Action'&&<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding:40, textAlign:'center', color:'#9ca3af' }}>Loading…</td></tr>
              ) : filtered.length===0 ? (
                <tr><td colSpan={6} style={{ padding:40, textAlign:'center', color:'#9ca3af' }}>No students found.</td></tr>
              ) : filtered.map(s=>(
                <tr key={s.id} style={{ borderBottom:'1px solid #f8f8fc' }} onMouseEnter={e=>e.currentTarget.style.background='#fafafa'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Avatar name={s.name}/>
                      <div>
                        <div style={{ fontSize:14, fontWeight:600, color:'#1e1e1e' }}>{s.name}</div>
                        <div style={{ fontSize:12, color:'#9ca3af' }}>{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px', fontSize:14, color:'#343434' }}>{s.course}</td>
                  <td style={{ padding:'14px 16px', minWidth:140 }}><ProgressBar pct={s.progress}/></td>
                  <td style={{ padding:'14px 16px', fontSize:13, color:'#6a7380', whiteSpace:'nowrap' }}>{s.last_activity}</td>
                  <td style={{ padding:'14px 16px' }}><StatusDropdown value={s.status}/></td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ width:28, height:28, borderRadius:6, border:'1px solid #d0d5dd', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:20, paddingTop:16, borderTop:'1px solid #f0f0f4' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:font, fontSize:13, color:'#6a7380' }}>
            <span>Rows per page</span>
            <span style={{ fontWeight:600, color:'#343434' }}>10</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            {['‹',1,2,3,4,'›'].map((p,i)=>(
              <button key={i} onClick={()=>typeof p==='number'&&setPage(p)} style={{ width:32, height:32, borderRadius:8, border:'none', cursor:'pointer', fontFamily:font, fontSize:13, fontWeight:600, background:p===page?'#5379f4':'transparent', color:p===page?'#fff':'#6a7380' }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </TrainerLayout>
  )
}
