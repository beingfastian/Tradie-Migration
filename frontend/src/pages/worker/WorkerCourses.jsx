/**
 * WorkerCourses — Recommended Training Courses (Figma node 1-5001, TBMfzE63R7DuhAN61xzpiZ)
 * Table layout: tabs + Course Title/Thumbnail, Provider, Duration, Status badges, pagination
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { WorkerLayout } from './WorkerLayout'
import { getToken, getMe, getCourses } from '../../services/api'
import { MOCK_USER } from './mockData'

const font = "'Urbanist', sans-serif"

const TABS = ['All Courses', 'Active', 'Completed']

const STATUS_STYLES = {
  Active:    { bg:'#e8f5e9', color:'#129578' },
  Completed: { bg:'#e8ecff', color:'#5379f4' },
  Enrolled:  { bg:'#fff3e8', color:'#f26f37' },
  Available: { bg:'#f3f1fd', color:'#403c8b' },
}

/* Thumb placeholder colors by category */
const THUMB_COLORS = {
  Electrical: '#4f6ef7',
  Safety:     '#f26f37',
  Plumbing:   '#129578',
  General:    '#403c8b',
  HVAC:       '#156dbf',
}

const PAGE_SIZE = 7

const FALLBACK_COURSES = [
  { id:1, title:'Certificate III in Electrotechnology Electrician', category:'Electrical', provider_name:'TAFE NSW',            duration_weeks:24, is_online:false, status:'Active',    recommended:true,  enrolled:true,  completed:false, thumbnail:null },
  { id:2, title:'Electrical Safety Compliance (AS/NZS 3000)',       category:'Safety',     provider_name:'Master Electricians',  duration_weeks:4,  is_online:true,  status:'Active',    recommended:true,  enrolled:true,  completed:false, thumbnail:null },
  { id:3, title:'High Voltage Switching Operations',                 category:'Electrical', provider_name:'Cognaratraining',      duration_weeks:2,  is_online:false, status:'Completed', recommended:false, enrolled:true,  completed:true,  thumbnail:null },
  { id:4, title:'Certificate IV in Plumbing and Services',           category:'Plumbing',   provider_name:'Skills IQ',            duration_weeks:12, is_online:false, status:'Available', recommended:false, enrolled:false, completed:false, thumbnail:null },
  { id:5, title:'English for Trade Professionals (IELTS Prep)',      category:'General',    provider_name:'Language International',duration_weeks:8,  is_online:true,  status:'Completed', recommended:true,  enrolled:true,  completed:true,  thumbnail:null },
  { id:6, title:'HVAC/R Systems Fundamentals',                       category:'HVAC',       provider_name:'AIRAH',                duration_weeks:6,  is_online:true,  status:'Available', recommended:false, enrolled:false, completed:false, thumbnail:null },
  { id:7, title:'Workplace Health & Safety (White Card)',            category:'Safety',     provider_name:'SafeWork Australia',   duration_weeks:1,  is_online:true,  status:'Completed', recommended:true,  enrolled:true,  completed:true,  thumbnail:null },
  { id:8, title:'Gas Fitting Licence Preparation',                   category:'Plumbing',   provider_name:'TAFE QLD',             duration_weeks:10, is_online:false, status:'Available', recommended:false, enrolled:false, completed:false, thumbnail:null },
]

function CourseThumbnail({ course }) {
  const color = THUMB_COLORS[course.category] || '#6a7380'
  if (course.thumbnail) {
    return (
      <img src={course.thumbnail} alt={course.title}
        style={{ width:64, height:44, borderRadius:8, objectFit:'cover', flexShrink:0 }}/>
    )
  }
  return (
    <div style={{
      width:64, height:44, borderRadius:8, background:color,
      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
    }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    </div>
  )
}

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES['Available']
  return (
    <span style={{
      background:s.bg, color:s.color, borderRadius:8,
      padding:'4px 14px', fontFamily:font, fontWeight:600, fontSize:13,
      whiteSpace:'nowrap',
    }}>{status}</span>
  )
}

export function WorkerCourses() {
  const navigate = useNavigate()
  const [user, setUser]     = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]       = useState('All Courses')
  const [search, setSearch] = useState('')
  const [page, setPage]     = useState(1)

  useEffect(() => {
    const token = getToken()
    if (!token) { setUser(MOCK_USER); setCourses(FALLBACK_COURSES); setLoading(false); return }
    getMe(token)
      .then(u => {
        setUser(u)
        return getCourses({}).catch(() => ({ items: [] }))
      })
      .then(data => {
        const list = Array.isArray(data) ? data : (data.items || data.courses || [])
        setCourses(list.length > 0 ? list : FALLBACK_COURSES)
      })
      .catch(() => setCourses(FALLBACK_COURSES))
      .finally(() => setLoading(false))
  }, [navigate])

  const filtered = courses.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || (c.title || '').toLowerCase().includes(q) || (c.provider_name || '').toLowerCase().includes(q) || (c.category || '').toLowerCase().includes(q)
    if (!matchSearch) return false
    if (tab === 'Active')    return c.enrolled && !c.completed
    if (tab === 'Completed') return c.completed
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function getStatus(c) {
    if (c.status) return c.status
    if (c.completed) return 'Completed'
    if (c.enrolled)  return 'Active'
    return 'Available'
  }

  return (
    <WorkerLayout user={user}>

      {/* ── Header ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div>
          <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:'0 0 4px' }}>
            Recommended Courses
          </h2>
          <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', margin:0 }}>
            Upskill with Australian-recognised qualifications to improve your migration score.
          </p>
        </div>
      </div>

      {/* ── Card ── */}
      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 16px rgba(0,0,0,0.05)', overflow:'hidden' }}>

        {/* Tabs + search row */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'20px 28px', borderBottom:'1px solid #f0f0f4', gap:20, flexWrap:'wrap',
        }}>
          <div style={{ display:'flex', gap:4 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => { setTab(t); setPage(1) }} style={{
                padding:'9px 22px', border:'none', cursor:'pointer', borderRadius:10,
                fontFamily:font, fontSize:14, fontWeight: t === tab ? 700 : 500,
                background: t === tab ? '#5379f4' : '#f6f6f9',
                color: t === tab ? '#fff' : '#6a7380',
                transition:'all 0.15s',
              }}>{t}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{ display:'flex', alignItems:'center', gap:10, border:'1px solid #d0d5dd', borderRadius:10, padding:'10px 16px', minWidth:240 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search courses…"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              style={{ border:'none', outline:'none', fontFamily:font, fontSize:14, color:'#343434', background:'transparent', flex:1 }}
            />
          </div>
        </div>

        {/* Table header */}
        <div style={{
          display:'grid', gridTemplateColumns:'2fr 1.2fr 120px 140px 120px',
          padding:'12px 28px', background:'#f8f8fc',
          borderBottom:'1px solid #f0f0f4',
        }}>
          {['Course Title', 'Provider', 'Duration', 'Status', 'Action'].map(col => (
            <span key={col} style={{ fontFamily:font, fontSize:13, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.04em' }}>
              {col}
            </span>
          ))}
        </div>

        {/* Table rows */}
        {loading ? (
          <div style={{ padding:'60px 28px', textAlign:'center' }}>
            <p style={{ fontFamily:font, color:'#9ca3af' }}>Loading courses…</p>
          </div>
        ) : paged.length === 0 ? (
          <div style={{ padding:'60px 28px', textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📚</div>
            <p style={{ fontFamily:font, fontSize:15, color:'#9ca3af' }}>No courses found.</p>
          </div>
        ) : (
          paged.map((c, i) => {
            const status = getStatus(c)
            return (
              <div key={c.id} style={{
                display:'grid', gridTemplateColumns:'2fr 1.2fr 120px 140px 120px',
                padding:'16px 28px', borderBottom:'1px solid #f8f8fc',
                alignItems:'center',
                background: i % 2 === 0 ? '#fff' : '#fafafa',
                transition:'background 0.12s',
              }}
                onMouseEnter={e => e.currentTarget.style.background='#f3f1fd'}
                onMouseLeave={e => e.currentTarget.style.background= i % 2 === 0 ? '#fff' : '#fafafa'}>

                {/* Course title + thumbnail */}
                <div style={{ display:'flex', alignItems:'center', gap:14, minWidth:0, paddingRight:16 }}>
                  <CourseThumbnail course={c} />
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontFamily:font, fontWeight:700, fontSize:14, color:'#1e1e1e', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {c.title}
                    </p>
                    <p style={{ fontFamily:font, fontSize:12, color:'#9ca3af', margin:0 }}>
                      {c.category} · {c.is_online ? 'Online' : 'In-Person'}
                    </p>
                  </div>
                </div>

                {/* Provider */}
                <span style={{ fontFamily:font, fontSize:14, color:'#6a7380', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', paddingRight:8 }}>
                  {c.provider_name || '—'}
                </span>

                {/* Duration */}
                <span style={{ fontFamily:font, fontSize:14, color:'#6a7380' }}>
                  {c.duration_weeks ? `${c.duration_weeks}w` : '—'}
                </span>

                {/* Status badge */}
                <StatusBadge status={status} />

                {/* Action */}
                <button style={{
                  height:36, padding:'0 18px', borderRadius:8,
                  border:'1.5px solid #5379f4', background:'transparent',
                  color:'#5379f4', fontFamily:font, fontSize:13, fontWeight:600, cursor:'pointer',
                  transition:'all 0.15s', whiteSpace:'nowrap',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background='#5379f4'; e.currentTarget.style.color='#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#5379f4' }}>
                  {status === 'Available' ? 'Enrol' : 'View'}
                </button>
              </div>
            )
          })
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'16px 28px', borderTop:'1px solid #f0f0f4',
          }}>
            <span style={{ fontFamily:font, fontSize:13, color:'#9ca3af' }}>
              Showing {((page-1)*PAGE_SIZE)+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length} courses
            </span>
            <div style={{ display:'flex', gap:6 }}>
              <button
                onClick={() => setPage(p => Math.max(1, p-1))}
                disabled={page === 1}
                style={{
                  width:36, height:36, borderRadius:8, border:'1px solid #e0dff0',
                  background:'#fff', cursor: page === 1 ? 'not-allowed' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  opacity: page === 1 ? 0.4 : 1, transition:'all 0.15s',
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i+1).map(n => (
                <button key={n} onClick={() => setPage(n)} style={{
                  width:36, height:36, borderRadius:8,
                  border: n === page ? 'none' : '1px solid #e0dff0',
                  background: n === page ? '#5379f4' : '#fff',
                  color: n === page ? '#fff' : '#6a7380',
                  fontFamily:font, fontSize:14, fontWeight: n === page ? 700 : 500,
                  cursor:'pointer', transition:'all 0.15s',
                }}>{n}</button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p+1))}
                disabled={page === totalPages}
                style={{
                  width:36, height:36, borderRadius:8, border:'1px solid #e0dff0',
                  background:'#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  opacity: page === totalPages ? 0.4 : 1, transition:'all 0.15s',
                }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </WorkerLayout>
  )
}
