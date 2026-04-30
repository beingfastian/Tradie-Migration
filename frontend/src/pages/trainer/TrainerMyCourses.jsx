/**
 * TrainerMyCourses — My Training Programs table.
 * Figma node 1-6073.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrainerLayout } from './TrainerLayout'
import { getToken, getMe } from '../../services/api'
import { MOCK_TRAINER_USER, MOCK_PROVIDER, MOCK_COURSES } from './trainerMockData'

const font = "'Urbanist', sans-serif"

const STATUS_COLORS = {
  'Enrolling':    { bg:'#e8f5e9', color:'#129578' },
  'Closing Soon': { bg:'#fff3e8', color:'#f26f37' },
  'On Hold':      { bg:'#fff0f0', color:'#e53e3e' },
  'Draft':        { bg:'#f0f0f4', color:'#6a7380' },
}

const TABS = ['Published Courses', 'Drafts']

function StatusBadge({ value }) {
  const c = STATUS_COLORS[value] || { bg:'#f0f0f4', color:'#6a7380' }
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:c.bg, borderRadius:20, padding:'4px 10px 4px 12px', cursor:'pointer' }}>
      <span style={{ fontSize:12, fontWeight:700, color:c.color, fontFamily:font }}>{value}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  )
}

/* Create Course Modal */
function CreateCourseModal({ onClose }) {
  const [title, setTitle] = useState('')
  const [delivery, setDelivery] = useState('')
  const [intake, setIntake] = useState('')
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:20, padding:'36px', width:480, boxShadow:'0 8px 40px rgba(0,0,0,0.15)' }}>
        <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#1e1e1e', margin:'0 0 24px' }}>Create New Course</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:16, marginBottom:28 }}>
          {[
            { label:'Course Title', value:title, onChange:setTitle, placeholder:'e.g. Cert III Electrotechnology' },
            { label:'Delivery Mode', value:delivery, onChange:setDelivery, placeholder:'e.g. On-Campus (Sydney)' },
            { label:'Next Intake Date', value:intake, onChange:setIntake, placeholder:'e.g. 15 Nov 2026' },
          ].map(f => (
            <div key={f.label}>
              <label style={{ fontFamily:font, fontSize:13, fontWeight:600, color:'#343434', display:'block', marginBottom:6 }}>{f.label}</label>
              <input value={f.value} onChange={e=>f.onChange(e.target.value)} placeholder={f.placeholder}
                style={{ height:44, borderRadius:10, border:'1.5px solid #d0d5dd', padding:'0 14px', fontFamily:font, fontSize:14, color:'#343434', outline:'none', width:'100%', boxSizing:'border-box' }}/>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:12, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ height:44, padding:'0 24px', background:'transparent', border:'1.5px solid #d0d5dd', borderRadius:10, cursor:'pointer', fontFamily:font, fontSize:14, fontWeight:600, color:'#6a7380' }}>Cancel</button>
          <button onClick={onClose} style={{ height:44, padding:'0 24px', background:'#156dbf', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontFamily:font, fontSize:14, fontWeight:600 }}>Create Course</button>
        </div>
      </div>
    </div>
  )
}

export function TrainerMyCourses() {
  const navigate = useNavigate()
  const [user, setUser]       = useState(null)
  const [provider, setProvider] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('Published Courses')
  const [search, setSearch]   = useState('')
  const [showModal, setShowModal] = useState(false)
  const [page, setPage]       = useState(1)

  useEffect(() => {
    const token = getToken()
    if (!token) { setUser(MOCK_TRAINER_USER); setProvider(MOCK_PROVIDER); setCourses(MOCK_COURSES); setLoading(false); return }
    getMe(token)
      .then(u => { setUser(u); setProvider(MOCK_PROVIDER); setCourses(MOCK_COURSES) })
      .catch(() => { setUser(MOCK_TRAINER_USER); setProvider(MOCK_PROVIDER); setCourses(MOCK_COURSES) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = courses.filter(c => {
    const q = search.toLowerCase()
    return !q || (c.title||'').toLowerCase().includes(q) || (c.delivery||'').toLowerCase().includes(q)
  })

  return (
    <TrainerLayout user={user} provider={provider}>
      {showModal && <CreateCourseModal onClose={()=>setShowModal(false)}/>}

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
        <button onClick={()=>navigate('/trainer/dashboard')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, color:'#6a7380', display:'flex' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h2 style={{ fontFamily:font, fontSize:26, fontWeight:700, color:'#1e1e1e', margin:0 }}>My Training Programs</h2>
          <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'4px 0 0' }}>Manage your course catalog, track student enrollments, and update training schedules.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20 }}>
        {TABS.map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'8px 20px', border:t===tab?'2px solid #5379f4':'2px solid transparent', borderRadius:20, cursor:'pointer', fontFamily:font, fontSize:14, fontWeight:600, background:t===tab?'#e8ecff':'#fff', color:t===tab?'#5379f4':'#6a7380', transition:'all 0.15s' }}>{t}</button>
        ))}
      </div>

      {/* Table card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'24px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
        {/* Toolbar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontFamily:font, fontSize:18, fontWeight:700, color:'#1e1e1e' }}>My Courses</span>
            <div style={{ display:'flex', gap:8 }}>
              <span style={{ fontFamily:font, fontSize:13, color:'#6a7380', fontWeight:600 }}>Display</span>
              {['Grid','List'].map(v=>(
                <label key={v} style={{ display:'flex', alignItems:'center', gap:4, cursor:'pointer', fontFamily:font, fontSize:13, color:'#343434' }}>
                  <input type="radio" name="courseview" defaultChecked={v==='List'} style={{ accentColor:'#5379f4' }}/> {v}
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
              <input placeholder="Search by course name, category, or code..." value={search} onChange={e=>setSearch(e.target.value)} style={{ border:'none', outline:'none', fontFamily:font, fontSize:13, color:'#343434', background:'transparent', flex:1 }}/>
            </div>
            <button onClick={()=>setShowModal(true)} style={{ height:36, padding:'0 16px', background:'#156dbf', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontFamily:font, fontSize:13, fontWeight:600, whiteSpace:'nowrap' }}
              onMouseEnter={e=>e.currentTarget.style.background='#1259a0'} onMouseLeave={e=>e.currentTarget.style.background='#156dbf'}>
              + Create Course
            </button>
          </div>
        </div>

        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:font }}>
            <thead>
              <tr style={{ borderBottom:'2px solid #f0f0f4' }}>
                {['Job Title','Delivery Mode','Enrollment','Next Intake','Status','Action'].map(h=>(
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
                <tr><td colSpan={6} style={{ padding:40, textAlign:'center', color:'#9ca3af' }}>No courses found.</td></tr>
              ) : filtered.map(c=>(
                <tr key={c.id} style={{ borderBottom:'1px solid #f8f8fc' }} onMouseEnter={e=>e.currentTarget.style.background='#fafafa'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 16px', fontSize:14, fontWeight:600, color:'#1e1e1e' }}>{c.title}</td>
                  <td style={{ padding:'14px 16px', fontSize:14, color:'#343434' }}>{c.delivery}</td>
                  <td style={{ padding:'14px 16px', fontSize:14, color:'#343434' }}>{c.enrollment}</td>
                  <td style={{ padding:'14px 16px', fontSize:14, color:'#343434' }}>{c.next_intake}</td>
                  <td style={{ padding:'14px 16px' }}><StatusBadge value={c.status}/></td>
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

        {/* Pagination */}
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
