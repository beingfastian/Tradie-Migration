/**
 * TrainerLayout — shared sidebar + topbar for all trainer pages.
 * All icons pulled directly from Figma API (file Ud0NnDoXtD1Rd5t4EaAlBT).
 */
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearToken } from '../../services/api'

const font = "'Urbanist', sans-serif"

/* ─── FIGMA ASSETS — node 1:4858 / 1:2805 ─── */
// Sidebar nav icons (outline = inactive, filled/bold = active)
const imgIconDashboard     = 'https://www.figma.com/api/mcp/asset/9a7309c2-cfe8-40bd-b38e-c9c570f6af78'
const imgIconCourses       = 'https://www.figma.com/api/mcp/asset/f8721b35-91de-45a3-adb0-47e5cdec2071'
const imgIconStudents      = 'https://www.figma.com/api/mcp/asset/5e5782eb-167a-4821-83e9-dba6ddfdb3ee'
const imgIconInquiryOut    = 'https://www.figma.com/api/mcp/asset/5fcb8095-5654-4198-8d7d-481e9ce8c91a' // outline
const imgIconInquiryFilled = 'https://www.figma.com/api/mcp/asset/fae8e410-6877-44a3-ac4e-f3d8515a3a84' // active/filled
const imgIconSummaryBold   = 'https://www.figma.com/api/mcp/asset/a6c59b50-3b2d-4040-9d73-03bcf7e28076' // active/bold
const imgIconSummaryOut    = 'https://www.figma.com/api/mcp/asset/7d163516-e546-4199-8a7b-61e5bd3e28b9' // outline
const imgIconSettings      = 'https://www.figma.com/api/mcp/asset/2a605082-a972-470a-b500-82badbe3bf0c'
const imgIconHelp          = 'https://www.figma.com/api/mcp/asset/7f4609c2-be57-4dd8-a245-b8f26f6be5d1'
// Topbar assets
const imgMenu              = 'https://www.figma.com/api/mcp/asset/982c3ee8-8790-43ac-998b-4dfe8178357f'
const imgSearchIcon        = 'https://www.figma.com/api/mcp/asset/5c91ef2a-f64c-4729-8796-3e1d8ceafa88'
const imgBellIcon          = 'https://www.figma.com/api/mcp/asset/5747a08f-a218-4ec0-9f6d-4d52bf27d26e'
const imgAvatarUser        = 'https://www.figma.com/api/mcp/asset/94d53a58-f21c-4a7f-aae0-7fdd46d1cf67'
const imgStrokeDot         = 'https://www.figma.com/api/mcp/asset/24be1935-2f0e-43d5-acb3-cb24306d28f9'
const imgDropArrow         = 'https://www.figma.com/api/mcp/asset/8488a3a6-b2f3-46a4-93c6-7820b48b80ef'

function getActive(p) {
  if (p.startsWith('/trainer/courses'))        return 'courses'
  if (p.startsWith('/trainer/students'))       return 'students'
  if (p.startsWith('/trainer/inquiries'))      return 'inquiries'
  if (p.startsWith('/trainer/course-summary')) return 'summary'
  if (p.startsWith('/trainer/settings'))       return 'settings'
  if (p.startsWith('/trainer/help'))           return 'help'
  return 'home'
}

export function TrainerLayout({ children, user, provider }) {
  const location = useLocation()
  const navigate = useNavigate()
  const active = getActive(location.pathname)

  const displayName = provider?.institution_name || user?.full_name || 'Trades Academy Australia'

  const NAV = [
    { key:'home',      label:'Dashboard (Home)',     icon:imgIconDashboard,  path:'/trainer/dashboard' },
    { key:'courses',   label:'My Courses',           icon:imgIconCourses,    path:'/trainer/courses' },
    { key:'students',  label:'Student Directory',    icon:imgIconStudents,   path:'/trainer/students' },
    {
      key:'inquiries', label:'Enrollment Inquiries',
      icon: active==='inquiries' ? imgIconInquiryFilled : imgIconInquiryOut,
      path:'/trainer/inquiries',
    },
    {
      key:'summary',   label:'Course Summary',
      icon: active==='summary' ? imgIconSummaryBold : imgIconSummaryOut,
      path:'/trainer/course-summary',
    },
    { key:'settings',  label:'Settings',             icon:imgIconSettings,   path:'/trainer/settings' },
    { key:'help',      label:'Help',                 icon:imgIconHelp,       path:'/trainer/help' },
  ]

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f6f6f9', fontFamily:font }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width:345, flexShrink:0, background:'#fff',
        display:'flex', flexDirection:'column',
        position:'relative', zIndex:20,
        boxShadow:'2px 0 8px rgba(0,0,0,0.04)',
      }}>
        {/* Active blue indicator bar */}
        <div style={{
          position:'absolute', right:0,
          top:'28.96%', bottom:'67.8%',
          width:4, background:'#156dbf',
          borderRadius:'4px 0 0 4px', zIndex:2,
        }}/>

        <div style={{ padding:'37px 40px 24px', display:'flex', flexDirection:'column', gap:40, flex:1 }}>
          {/* Logo — "Tradie App" */}
          <div>
            <span style={{ fontFamily:"'Mohave',sans-serif", fontWeight:600, fontSize:32, lineHeight:1.3 }}>
              <span style={{ color:'#f26f37' }}>T</span>
              <span style={{ color:'#156dbf' }}>radie App</span>
            </span>
          </div>

          {/* Nav items */}
          <nav style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {NAV.map(item => {
              const isActive = active === item.key
              return (
                <Link key={item.key} to={item.path} style={{ textDecoration:'none' }}>
                  <div style={{
                    display:'flex', alignItems:'center', gap:16,
                    padding:'12px 8px', borderRadius:8, width:262,
                    background: isActive ? '#f3f1fd' : 'transparent',
                    cursor:'pointer', transition:'background 0.15s',
                  }}
                    onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background='#f8f8fc' }}
                    onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background='transparent' }}>
                    <img src={item.icon} alt="" style={{ width:24, height:24, flexShrink:0, display:'block' }}/>
                    <span style={{
                      fontFamily:font, fontWeight:700, fontSize:16, lineHeight:1.3,
                      color: isActive ? '#156dbf' : '#6a7380', whiteSpace:'nowrap',
                    }}>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* ── Right side ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>

        {/* Topbar */}
        <header style={{
          background:'#fff',
          boxShadow:'0px 4px 12px rgba(0,0,0,0.05)',
          padding:'0 40px', height:72,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexShrink:0, zIndex:15, position:'sticky', top:0,
        }}>
          {/* Left — menu + logo */}
          <div style={{ display:'flex', alignItems:'center', gap:24 }}>
            <img src={imgMenu} alt="menu" style={{ width:30, height:34, display:'block', cursor:'pointer' }}/>
            <span style={{ fontFamily:"'Mohave',sans-serif", fontWeight:600, fontSize:32, lineHeight:1.3, whiteSpace:'nowrap' }}>
              <span style={{ color:'#f26f37' }}>T</span>
              <span style={{ color:'#156dbf' }}>radie App</span>
            </span>
          </div>

          {/* Center — search */}
          <div style={{ flex:1, maxWidth:663, margin:'0 40px' }}>
            <div style={{
              display:'flex', alignItems:'center', gap:12,
              border:'1px solid #c1c1c8', borderRadius:12,
              padding:'14px 20px', background:'#fff',
            }}>
              <img src={imgSearchIcon} alt="" style={{ width:24, height:24, flexShrink:0 }}/>
              <input placeholder="Search" style={{
                border:'none', outline:'none', fontFamily:font,
                fontSize:16, color:'#6a7380', background:'transparent', flex:1,
              }}/>
            </div>
          </div>

          {/* Right — bell + user */}
          <div style={{ display:'flex', alignItems:'center', gap:32 }}>
            {/* Bell with badge */}
            <div style={{ position:'relative' }}>
              <div style={{
                width:50, height:50, borderRadius:'50%', background:'#f3f1fd',
                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              }}>
                <img src={imgBellIcon} alt="notifications" style={{ width:24, height:24 }}/>
              </div>
              <div style={{
                position:'absolute', top:0, right:0,
                width:16.65, height:16.65, borderRadius:16,
                background:'#fb4248', display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:12, fontWeight:600, color:'#fff', fontFamily:font, lineHeight:1,
              }}>4</div>
            </div>

            {/* User */}
            <div style={{ display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}
              onClick={() => { clearToken(); navigate('/login', { replace:true }) }}>
              <div style={{ position:'relative', width:50, height:50, flexShrink:0 }}>
                <img src={imgAvatarUser} alt="avatar"
                  style={{ width:50, height:50, borderRadius:'50%', display:'block', objectFit:'cover' }}/>
                <div style={{
                  position:'absolute', bottom:0, right:0,
                  width:16, height:16, borderRadius:16,
                  background:'#129578', display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <img src={imgStrokeDot} alt="" style={{ width:16, height:16 }}/>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
                <span style={{ fontFamily:font, fontWeight:700, fontSize:18, color:'#343434', lineHeight:1.3, whiteSpace:'nowrap' }}>
                  {displayName}
                </span>
                <span style={{ fontFamily:font, fontWeight:500, fontSize:18, color:'#6a7380', lineHeight:1.3, whiteSpace:'nowrap' }}>
                  Education Provider
                </span>
              </div>
              <img src={imgDropArrow} alt="" style={{ width:32, height:32 }}/>
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex:1, padding:'27px 40px', overflowY:'auto', overflowX:'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
