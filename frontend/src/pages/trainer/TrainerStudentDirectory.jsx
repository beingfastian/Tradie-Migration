/**
 * TrainerStudentDirectory — Figma node 1-6406
 */
import { useState, useEffect } from 'react'
import { TrainerLayout } from './TrainerLayout'
import { getToken, getMe } from '../../services/api'

import trIconFilter from '../../assets/trainer-dashboard/tr-icon-filter.svg'
import trIconMore   from '../../assets/trainer-dashboard/tr-icon-more.svg'
import trIconArrowLeft  from '../../assets/trainer-dashboard/tr-icon-arrow-left.svg'
import trIconArrowRight from '../../assets/trainer-dashboard/tr-icon-arrow-right.svg'
import trChatAvatar1 from '../../assets/trainer-dashboard/tr-chat-avatar1.png'
import trChatAvatar2 from '../../assets/trainer-dashboard/tr-chat-avatar2.png'

const font = "'Urbanist', sans-serif"
const PAGE_SIZE = 7

const TABS = ['All Students', 'Completed']

const STATUS_STYLES = {
  Active:    { bg:'#f1fdfb', color:'#129578' },
  Completed: { bg:'#e8ecff', color:'#5379f4' },
  'At Risk':  { bg:'#fff0f0', color:'#fb4248' },
  Enrolled:  { bg:'#fff5e6', color:'#fdb345' },
}

const STUDENTS = [
  { id:1, name:'Samuel Rivera', email:'samuel.r@email.com', flag:'🇵🇭', course:'Cert III Electrotechnology', progress:78, last_activity:'2 days ago', status:'Active', completed:false, avatar: trChatAvatar1 },
  { id:2, name:'John Doe', email:'john.doe@email.com', flag:'🇬🇧', course:'Cert IV Electrical Engineering', progress:100, last_activity:'1 week ago', status:'Completed', completed:true, avatar: trChatAvatar2 },
  { id:3, name:'Maria Santos', email:'maria.s@email.com', flag:'🇵🇭', course:'Cert III Plumbing', progress:45, last_activity:'Today', status:'Active', completed:false, avatar: null },
  { id:4, name:'Ahmed Hassan', email:'ahmed.h@email.com', flag:'🇪🇬', course:'WHS White Card', progress:20, last_activity:'5 days ago', status:'At Risk', completed:false, avatar: null },
  { id:5, name:'Priya Sharma', email:'priya.s@email.com', flag:'🇮🇳', course:'Cert III Electrotechnology', progress:92, last_activity:'Yesterday', status:'Active', completed:false, avatar: null },
  { id:6, name:'Carlos Mendez', email:'carlos.m@email.com', flag:'🇲🇽', course:'HVAC Fundamentals', progress:100, last_activity:'2 weeks ago', status:'Completed', completed:true, avatar: null },
]

function AvatarCell({ student }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <div style={{
        width:40, height:40, borderRadius:'50%', flexShrink:0, overflow:'hidden',
        background:'#e0dff0', display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        {student.avatar
          ? <img src={student.avatar} alt={student.name} style={{ width:40, height:40, objectFit:'cover' }}/>
          : <span style={{ fontFamily:font, fontWeight:700, fontSize:15, color:'#403c8b' }}>
              {student.name.charAt(0)}
            </span>
        }
      </div>
      <div style={{ minWidth:0 }}>
        <p style={{ fontFamily:font, fontWeight:700, fontSize:14, color:'#1e1e1e', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {student.flag} {student.name}
        </p>
        <p style={{ fontFamily:font, fontSize:12, color:'#9ca3af', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
          {student.email}
        </p>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES['Enrolled']
  return <span style={{ background:s.bg, color:s.color, borderRadius:8, padding:'4px 14px', fontFamily:font, fontWeight:600, fontSize:13, whiteSpace:'nowrap' }}>{status}</span>
}

export function TrainerStudentDirectory() {
  const [user, setUser] = useState(null)
  const [tab, setTab]   = useState('All Students')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    getMe(token).then(u => setUser(u)).catch(() => {})
  }, [])

  const filtered = STUDENTS.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = !q || s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.course.toLowerCase().includes(q)
    const matchTab = tab === 'All Students' ? true : s.completed
    return matchSearch && matchTab
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <TrainerLayout user={user}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:'0 0 4px' }}>
            Student Directory
          </h2>
          <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', margin:0 }}>
            Track your enrolled students and their progress.
          </p>
        </div>
        <button style={{
          height:44, padding:'0 20px', background:'#156dbf', border:'none',
          borderRadius:10, fontFamily:font, fontWeight:700, fontSize:14, color:'#fff',
          cursor:'pointer', boxShadow:'0 4px 12px rgba(21,109,191,0.22)',
        }}>
          Export Grades
        </button>
      </div>

      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 16px rgba(0,0,0,0.05)', overflow:'hidden' }}>

        {/* Tabs + controls */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 28px', borderBottom:'1px solid #f0f0f4', gap:20, flexWrap:'wrap' }}>
          <div style={{ display:'flex', gap:4 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => { setTab(t); setPage(1) }} style={{
                padding:'9px 22px', border:'none', cursor:'pointer', borderRadius:10,
                fontFamily:font, fontSize:14, fontWeight: t === tab ? 700 : 500,
                background: t === tab ? '#5379f4' : '#f6f6f9',
                color: t === tab ? '#fff' : '#6a7380',
              }}>{t}</button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ display:'flex', gap:8 }}>
              <button style={{ width:40, height:40, borderRadius:10, border:'1px solid #e0dff0', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                <img src={trIconFilter} alt="filter" style={{ width:20, height:20 }}/>
              </button>
              <button style={{ width:40, height:40, borderRadius:10, border:'1px solid #e0dff0', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                <img src={trIconMore} alt="more" style={{ width:20, height:20 }}/>
              </button>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, border:'1px solid #d0d5dd', borderRadius:10, padding:'10px 16px', minWidth:280 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input placeholder="by student name, ID, or course..."
                value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                style={{ border:'none', outline:'none', fontFamily:font, fontSize:14, color:'#343434', background:'transparent', flex:1 }}/>
            </div>
          </div>
        </div>

        {/* Table header */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1.8fr 120px 140px 130px 110px', padding:'12px 28px', background:'#f8f8fc', borderBottom:'1px solid #f0f0f4' }}>
          {['Student Name', 'Enrolled Course', 'Progress', 'Last Activity', 'Status', 'Action'].map(col => (
            <span key={col} style={{ fontFamily:font, fontSize:13, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.04em' }}>{col}</span>
          ))}
        </div>

        {/* Rows */}
        {paged.map((s, i) => (
          <div key={s.id} style={{
            display:'grid', gridTemplateColumns:'2fr 1.8fr 120px 140px 130px 110px',
            padding:'16px 28px', borderBottom:'1px solid #f8f8fc', alignItems:'center',
            background: i % 2 === 0 ? '#fff' : '#fafafa', transition:'background 0.12s',
          }}
            onMouseEnter={e => e.currentTarget.style.background='#f3f1fd'}
            onMouseLeave={e => e.currentTarget.style.background= i % 2 === 0 ? '#fff' : '#fafafa'}>
            <AvatarCell student={s}/>
            <span style={{ fontFamily:font, fontSize:14, color:'#6a7380', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.course}</span>
            <div>
              <span style={{ fontFamily:font, fontSize:13, fontWeight:700, color:'#1e1e1e' }}>{s.progress}%</span>
              <div style={{ background:'#e0dff0', borderRadius:4, height:4, marginTop:4, overflow:'hidden' }}>
                <div style={{ width:`${s.progress}%`, height:'100%', background:'#5379f4', borderRadius:4 }}/>
              </div>
            </div>
            <span style={{ fontFamily:font, fontSize:14, color:'#6a7380' }}>{s.last_activity}</span>
            <StatusBadge status={s.status}/>
            <button style={{
              height:36, padding:'0 14px', borderRadius:8, border:'1.5px solid #5379f4',
              background:'transparent', color:'#5379f4', fontFamily:font, fontSize:13, fontWeight:600, cursor:'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.background='#5379f4'; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#5379f4' }}>
              View
            </button>
          </div>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 28px', borderTop:'1px solid #f0f0f4' }}>
            <span style={{ fontFamily:font, fontSize:13, color:'#9ca3af' }}>
              Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length} students
            </span>
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                style={{ width:36, height:36, borderRadius:8, border:'1px solid #e0dff0', background:'#fff', cursor: page===1 ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity: page===1 ? 0.4 : 1 }}>
                <img src={trIconArrowLeft} alt="" style={{ width:16, height:16 }}/>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
                <button key={n} onClick={() => setPage(n)} style={{
                  width:36, height:36, borderRadius:8, border: n===page ? 'none' : '1px solid #e0dff0',
                  background: n===page ? '#5379f4' : '#fff', color: n===page ? '#fff' : '#6a7380',
                  fontFamily:font, fontSize:14, fontWeight: n===page ? 700 : 500, cursor:'pointer',
                }}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                style={{ width:36, height:36, borderRadius:8, border:'1px solid #e0dff0', background:'#fff', cursor: page===totalPages ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity: page===totalPages ? 0.4 : 1 }}>
                <img src={trIconArrowRight} alt="" style={{ width:16, height:16 }}/>
              </button>
            </div>
          </div>
        )}
      </div>
    </TrainerLayout>
  )
}
