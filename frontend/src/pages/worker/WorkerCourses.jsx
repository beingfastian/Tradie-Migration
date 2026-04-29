/**
 * WorkerCourses — Recommended Training Courses page.
 * Figma node 1-5004.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { WorkerLayout } from './WorkerLayout'
import { getToken, getMe, getCandidateProfile, getCourses } from '../../services/api'

const font = "'Urbanist', sans-serif"

const TABS = ['All Courses', 'Recommended', 'Active', 'Completed']

const CATEGORY_COLORS = {
  'Electrical': { bg:'#e8ecff', color:'#5379f4' },
  'Safety':     { bg:'#fff3e8', color:'#f26f37' },
  'Plumbing':   { bg:'#e8f5e9', color:'#129578' },
  'General':    { bg:'#f3f1fd', color:'#403c8b' },
  'HVAC':       { bg:'#e8f0ff', color:'#156dbf' },
}

function CourseCard({ course }) {
  const cat = course.category || 'General'
  const catStyle = CATEGORY_COLORS[cat] || CATEGORY_COLORS['General']
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:'#fff', borderRadius:16, padding:'24px',
        boxShadow: hovered ? '0 6px 24px rgba(0,0,0,0.1)' : '0 2px 12px rgba(0,0,0,0.05)',
        transition:'box-shadow 0.15s, transform 0.15s',
        transform: hovered ? 'translateY(-2px)' : 'none',
        display:'flex', flexDirection:'column', gap:14,
      }}
    >
      {/* Category badge */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <span style={{
          background: catStyle.bg, color: catStyle.color,
          borderRadius:8, padding:'4px 12px', fontSize:12, fontWeight:600, fontFamily:font,
        }}>{cat}</span>
        {course.recommended && (
          <span style={{ background:'#fff3e8', color:'#f26f37', borderRadius:8, padding:'4px 10px', fontSize:11, fontWeight:600, fontFamily:font }}>
            ⭐ Recommended
          </span>
        )}
      </div>

      {/* Title */}
      <div>
        <h3 style={{ fontFamily:font, fontSize:17, fontWeight:700, color:'#1e1e1e', margin:'0 0 6px', lineHeight:1.4 }}>
          {course.title}
        </h3>
        <p style={{ fontFamily:font, fontSize:13, color:'#6a7380', margin:0, lineHeight:1.5 }}>
          {course.description ? course.description.slice(0, 120) + (course.description.length > 120 ? '…' : '') : 'Professional development course for trade workers seeking Australian qualification recognition.'}
        </p>
      </div>

      {/* Meta */}
      <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
        {course.duration_weeks && (
          <span style={{ display:'flex', alignItems:'center', gap:5, fontFamily:font, fontSize:12, color:'#6a7380' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {course.duration_weeks}w
          </span>
        )}
        {course.provider_name && (
          <span style={{ display:'flex', alignItems:'center', gap:5, fontFamily:font, fontSize:12, color:'#6a7380' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            {course.provider_name}
          </span>
        )}
        {course.is_online !== undefined && (
          <span style={{ display:'flex', alignItems:'center', gap:5, fontFamily:font, fontSize:12, color:'#6a7380' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            {course.is_online ? 'Online' : 'In-Person'}
          </span>
        )}
      </div>

      {/* Enroll button */}
      <button
        style={{
          height:40, borderRadius:10, border:'1.5px solid #156dbf', background:'transparent',
          color:'#156dbf', fontFamily:font, fontSize:14, fontWeight:600, cursor:'pointer',
          transition:'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background='#156dbf'; e.currentTarget.style.color='#fff' }}
        onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#156dbf' }}
      >
        Learn More
      </button>
    </div>
  )
}

/* Placeholder cards when no real data */
const FALLBACK_COURSES = [
  { id:1, title:'Certificate III in Electrotechnology Electrician', category:'Electrical', description:'The nationally recognised qualification for licensed electricians in Australia. Covers installation, maintenance, and troubleshooting.', duration_weeks:24, provider_name:'TAFE NSW', is_online:false, recommended:true },
  { id:2, title:'Electrical Safety Compliance (AS/NZS 3000)', category:'Safety', description:'Master the wiring rules and safety standards required for Australian electrical work. Essential for licence recognition.', duration_weeks:4, provider_name:'Master Electricians', is_online:true, recommended:true },
  { id:3, title:'High Voltage Switching Operations', category:'Electrical', description:'Training for high voltage operations in industrial and mining environments. Nationally accredited.', duration_weeks:2, provider_name:'Cognaratraining', is_online:false, recommended:false },
  { id:4, title:'Certificate IV in Plumbing and Services', category:'Plumbing', description:'Advanced plumbing qualification covering gas fitting, roofing, and drainage systems for the Australian market.', duration_weeks:12, provider_name:'Skills IQ', is_online:false, recommended:false },
  { id:5, title:'English for Trade Professionals (IELTS Prep)', category:'General', description:'Prepare for IELTS with a focus on trade-related vocabulary and professional communication skills.', duration_weeks:8, provider_name:'Language International', is_online:true, recommended:true },
  { id:6, title:'HVAC/R Systems Fundamentals', category:'HVAC', description:'Introduction to heating, ventilation, air conditioning and refrigeration for electricians expanding their skillset.', duration_weeks:6, provider_name:'AIRAH', is_online:true, recommended:false },
]

export function WorkerCourses() {
  const navigate = useNavigate()
  const [user, setUser]       = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('All Courses')
  const [search, setSearch]   = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) { navigate('/login', { replace:true }); return }
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
    const matchSearch = !q || (c.title || '').toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q) || (c.category || '').toLowerCase().includes(q)
    if (!matchSearch) return false
    if (tab === 'Recommended') return c.recommended
    if (tab === 'Active') return c.enrolled && !c.completed
    if (tab === 'Completed') return c.completed
    return true
  })

  return (
    <WorkerLayout user={user}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:'0 0 6px' }}>
          Recommended Courses
        </h2>
        <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', margin:0 }}>
          Upskill with Australian-recognised qualifications to improve your migration eligibility score.
        </p>
      </div>

      {/* Search + tabs */}
      <div style={{ background:'#fff', borderRadius:16, padding:'20px 24px', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          {/* Tabs */}
          <div style={{ display:'flex', gap:4 }}>
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding:'8px 18px', border:'none', cursor:'pointer', borderRadius:10,
                  fontFamily:font, fontSize:14, fontWeight: t === tab ? 700 : 500,
                  background: t === tab ? '#5379f4' : '#f6f6f9',
                  color: t === tab ? '#fff' : '#6a7380',
                  transition:'all 0.15s',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ display:'flex', alignItems:'center', gap:8, border:'1px solid #d0d5dd', borderRadius:10, padding:'8px 16px', minWidth:220 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search courses…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border:'none', outline:'none', fontFamily:font, fontSize:14, color:'#343434', background:'transparent', flex:1 }}
            />
          </div>
        </div>
      </div>

      {/* Courses grid */}
      {loading ? (
        <div style={{ textAlign:'center', padding:60 }}>
          <p style={{ fontFamily:font, color:'#6a7380' }}>Loading courses…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:60 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>📚</div>
          <p style={{ fontFamily:font, fontSize:16, color:'#6a7380' }}>No courses found.</p>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px, 1fr))', gap:20 }}>
          {filtered.map(c => <CourseCard key={c.id} course={c} />)}
        </div>
      )}
    </WorkerLayout>
  )
}
