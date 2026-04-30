/**
 * TrainerLayout — shared sidebar + topbar for all training provider pages.
 */
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearToken } from '../../services/api'

const font = "'Urbanist', sans-serif"

const IconHome    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const IconCourses = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
const IconStudents= () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IconInquiry = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const IconSummary = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
const IconSettings= () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
const IconHelp    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const IconBell    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IconMenu    = () => <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round"><line x1="0" y1="1" x2="22" y2="1"/><line x1="0" y1="8" x2="22" y2="8"/><line x1="0" y1="15" x2="22" y2="15"/></svg>
const IconChevron = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
const IconSearchSm= () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>

const NAV_ITEMS = [
  { key:'home',     label:'Dashboard (Home)',      icon:IconHome,     path:'/trainer/dashboard' },
  { key:'courses',  label:'My Courses',            icon:IconCourses,  path:'/trainer/courses' },
  { key:'students', label:'Student Directory',     icon:IconStudents, path:'/trainer/students' },
  { key:'inquiries',label:'Enrollment Inquiries',  icon:IconInquiry,  path:'/trainer/inquiries' },
  { key:'summary',  label:'Course Summary',        icon:IconSummary,  path:'/trainer/course-summary' },
  { key:'settings', label:'Settings',              icon:IconSettings, path:'/trainer/settings' },
  { key:'help',     label:'Help',                  icon:IconHelp,     path:'/trainer/help' },
]

function getActiveKey(p) {
  if (p.startsWith('/trainer/courses'))       return 'courses'
  if (p.startsWith('/trainer/students'))      return 'students'
  if (p.startsWith('/trainer/inquiries'))     return 'inquiries'
  if (p.startsWith('/trainer/course-summary'))return 'summary'
  if (p.startsWith('/trainer/settings'))      return 'settings'
  if (p.startsWith('/trainer/help'))          return 'help'
  if (p.startsWith('/trainer/profile'))       return 'profile'
  return 'home'
}

export function TrainerLayout({ children, user, provider }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const active = getActiveKey(location.pathname)

  const displayName = provider?.institution_name || user?.full_name || 'Trades Academy Australia'
  const subtitle    = 'Education Provider'
  const initials    = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f6f6f9', fontFamily:font }}>

      {/* Sidebar */}
      <aside style={{
        width:sidebarOpen?280:0, minWidth:sidebarOpen?280:0,
        background:'#fff', boxShadow:'2px 0 12px rgba(0,0,0,0.04)',
        display:'flex', flexDirection:'column',
        transition:'width 0.22s ease, min-width 0.22s ease',
        overflow:'hidden', position:'relative', zIndex:20, flexShrink:0,
      }}>
        <div style={{ position:'absolute', left:0, top:'9.6%', bottom:'12.8%', width:4, background:'#0b3a66', borderRadius:'0 4px 4px 0' }}/>
        <div style={{ padding:'37px 16px 24px 24px', display:'flex', flexDirection:'column', gap:40, flex:1 }}>
          <div style={{ paddingLeft:4 }}>
            <span style={{ fontFamily:"'Mohave','Urbanist',sans-serif", fontWeight:600, fontSize:26, lineHeight:1 }}>
              <span style={{ color:'#f26f37' }}>T</span>
              <span style={{ color:'#156dbf' }}>radie App</span>
            </span>
          </div>
          <nav style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {NAV_ITEMS.map(item => {
              const isActive = active === item.key
              const Icon = item.icon
              return (
                <Link key={item.key} to={item.path} style={{ textDecoration:'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px', borderRadius:8, background:isActive?'#f3f1fd':'transparent', color:isActive?'#156dbf':'#6a7380', fontWeight:700, fontSize:15, cursor:'pointer', transition:'background 0.15s' }}
                    onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background='#f8f8fc' }}
                    onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background='transparent' }}>
                    <span style={{ color:isActive?'#156dbf':'#6a7380', display:'flex' }}><Icon/></span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <header style={{ background:'#fff', boxShadow:'0 4px 12px rgba(0,0,0,0.05)', padding:'0 40px', height:72, display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, zIndex:15, position:'sticky', top:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <button onClick={()=>setSidebarOpen(v=>!v)} style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'flex' }}><IconMenu/></button>
            <span style={{ fontFamily:"'Mohave','Urbanist',sans-serif", fontWeight:600, fontSize:26 }}>
              <span style={{ color:'#f26f37' }}>T</span><span style={{ color:'#156dbf' }}>radie App</span>
            </span>
          </div>
          <div style={{ flex:1, maxWidth:520, margin:'0 40px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, border:'1px solid #c1c1c8', borderRadius:12, padding:'10px 18px', background:'#fff' }}>
              <IconSearchSm/>
              <input placeholder="Search" style={{ border:'none', outline:'none', fontFamily:font, fontSize:15, color:'#6a7380', background:'transparent', flex:1 }}/>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:24 }}>
            <div style={{ position:'relative' }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:'#f3f1fd', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#5379f4' }}><IconBell/></div>
              <div style={{ position:'absolute', top:0, right:0, width:16, height:16, borderRadius:'50%', background:'#fb4248', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color:'#fff' }}>5</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={()=>{ clearToken(); navigate('/login',{replace:true}) }} title="Sign out">
              <div style={{ width:44, height:44, borderRadius:'50%', background:'#5379f4', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:15, position:'relative' }}>
                {initials}
                <div style={{ position:'absolute', bottom:0, right:0, width:13, height:13, borderRadius:'50%', background:'#129578', border:'2px solid #fff' }}/>
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:'#343434', lineHeight:1.2 }}>{displayName}</div>
                <div style={{ fontSize:12, color:'#6a7380', lineHeight:1.2 }}>{subtitle}</div>
              </div>
              <IconChevron/>
            </div>
          </div>
        </header>
        <main style={{ flex:1, padding:'32px 40px', overflowY:'auto', overflowX:'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
