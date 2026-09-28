/**
 * TrainerLayout — shared sidebar + topbar for all trainer pages.
 * Assets stored permanently in frontend/src/assets/trainer-dashboard/
 */
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearToken } from '../../services/api'

import trLogo         from '../../assets/trainer-dashboard/tr-logo.png'
import trIconHome     from '../../assets/trainer-dashboard/tr-icon-home.svg'
import trIconCourses  from '../../assets/trainer-dashboard/tr-icon-courses.svg'
import trIconStudents from '../../assets/trainer-dashboard/tr-icon-students.svg'
import trIconInquiries from '../../assets/trainer-dashboard/tr-icon-inquiries.svg'
import trIconSummary  from '../../assets/trainer-dashboard/tr-icon-summary.svg'
import trIconSettings from '../../assets/trainer-dashboard/tr-icon-settings.svg'
import trIconHelp     from '../../assets/trainer-dashboard/tr-icon-help.svg'
import trIconBell     from '../../assets/trainer-dashboard/tr-icon-bell.svg'
import trIconMenu     from '../../assets/trainer-dashboard/tr-icon-menu.svg'
import trIconSearchBar from '../../assets/trainer-dashboard/tr-icon-search-bar.svg'
import trAvatar       from '../../assets/trainer-dashboard/tr-avatar.png'
import trIconDot      from '../../assets/trainer-dashboard/tr-icon-dot.svg'
import trIconArrow    from '../../assets/trainer-dashboard/tr-icon-arrow.svg'

const font = "'Urbanist', sans-serif"

function getActive(p) {
  if (p.startsWith('/trainer/courses'))    return 'courses'
  if (p.startsWith('/trainer/students'))   return 'students'
  if (p.startsWith('/trainer/inquiries'))  return 'inquiries'
  if (p.startsWith('/trainer/summary') || p.startsWith('/trainer/course-summary')) return 'summary'
  if (p.startsWith('/trainer/settings'))   return 'settings'
  if (p.startsWith('/trainer/help'))       return 'help'
  if (p.startsWith('/trainer/profile'))    return 'profile'
  return 'home'
}

export function TrainerLayout({ children, user }) {
  const location = useLocation()
  const navigate  = useNavigate()
  const active    = getActive(location.pathname)

  const displayName = user?.full_name || 'Trades Academy Australia'

  const NAV = [
    { key:'home',      label:'Home',                  icon: trIconHome,      path:'/trainer/dashboard' },
    { key:'courses',   label:'My Courses',            icon: trIconCourses,   path:'/trainer/courses' },
    { key:'students',  label:'Student Directory',     icon: trIconStudents,  path:'/trainer/students' },
    { key:'inquiries', label:'Enrollment Inquiries',  icon: trIconInquiries, path:'/trainer/inquiries' },
    { key:'summary',   label:'Course Summary',        icon: trIconSummary,   path:'/trainer/course-summary' },
    { key:'settings',  label:'Settings',              icon: trIconSettings,  path:'/trainer/settings' },
    { key:'help',      label:'Help',                  icon: trIconHelp,      path:'/trainer/help' },
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
        <div style={{ padding:'37px 40px 24px', display:'flex', flexDirection:'column', gap:40, flex:1 }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src={trLogo} alt="logo" style={{ width:47, height:33, display:'block', objectFit:'contain' }}/>
            <span style={{ fontFamily:"'Mohave',sans-serif", fontWeight:600, fontSize:31, lineHeight:1.3 }}>
              <span style={{ color:'#f26f37' }}>T</span>
              <span style={{ color:'#156dbf' }}>radie App</span>
            </span>
          </div>

          {/* Nav */}
          <nav style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {NAV.map(item => {
              const isActive = active === item.key
              return (
                <Link key={item.key} to={item.path} style={{ textDecoration:'none' }}>
                  <div style={{
                    display:'flex', alignItems:'center', gap:16,
                    padding:'12px 16px', borderRadius:8,
                    background: isActive ? '#f3f1fd' : 'transparent',
                    cursor:'pointer', transition:'background 0.15s',
                    position:'relative',
                  }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background='#f8f8fc' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background='transparent' }}>
                    {isActive && (
                      <div style={{
                        position:'absolute', right:0, top:'10%', bottom:'10%',
                        width:4, background:'#156dbf', borderRadius:'4px 0 0 4px',
                      }}/>
                    )}
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

      {/* ── Main area ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>

        {/* Topbar */}
        <header style={{
          background:'#fff',
          boxShadow:'0px 4px 12px rgba(0,0,0,0.05)',
          padding:'0 40px', height:72,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexShrink:0, zIndex:15, position:'sticky', top:0,
        }}>
          {/* Left */}
          <div style={{ display:'flex', alignItems:'center', gap:24, flexShrink:0 }}>
            <img src={trIconMenu} alt="menu" style={{ width:30, height:30, cursor:'pointer', objectFit:'contain' }}/>
            <span style={{ fontFamily:"'Mohave',sans-serif", fontWeight:600, fontSize:32, lineHeight:1.3, whiteSpace:'nowrap' }}>
              <span style={{ color:'#f26f37' }}>T</span>
              <span style={{ color:'#156dbf' }}>radie App</span>
            </span>
          </div>

          {/* Search */}
          <div style={{ flex:1, maxWidth:663, margin:'0 40px' }}>
            <div style={{
              display:'flex', alignItems:'center', gap:12,
              border:'1px solid #c1c1c8', borderRadius:12,
              padding:'14px 20px', background:'#fff',
            }}>
              <img src={trIconSearchBar} alt="" style={{ width:24, height:24, flexShrink:0 }}/>
              <input placeholder="Search" style={{
                border:'none', outline:'none', fontFamily:font,
                fontSize:16, color:'#6a7380', background:'transparent', flex:1,
              }}/>
            </div>
          </div>

          {/* Bell + User */}
          <div style={{ display:'flex', alignItems:'center', gap:32, flexShrink:0 }}>
            <div style={{ position:'relative' }}>
              <div style={{
                width:50, height:50, borderRadius:'50%', background:'#f3f1fd',
                display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
              }}>
                <img src={trIconBell} alt="notifications" style={{ width:24, height:24 }}/>
              </div>
              <div style={{
                position:'absolute', top:0, right:0,
                width:17, height:17, borderRadius:17,
                background:'#fb4248', display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:10, fontWeight:700, color:'#fff', fontFamily:font, lineHeight:1,
              }}>4</div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}
              onClick={() => { clearToken(); navigate('/login', { replace:true }) }}>
              <div style={{ position:'relative', width:50, height:50, flexShrink:0 }}>
                <img src={trAvatar} alt="avatar"
                  style={{ width:50, height:50, borderRadius:'50%', display:'block', objectFit:'cover' }}/>
                <div style={{
                  position:'absolute', bottom:0, right:0,
                  width:16, height:16, borderRadius:16,
                  background:'#129578', display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <img src={trIconDot} alt="" style={{ width:8, height:8 }}/>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                <span style={{ fontFamily:font, fontWeight:700, fontSize:16, color:'#343434', lineHeight:1.3, whiteSpace:'nowrap' }}>
                  {displayName}
                </span>
                <span style={{ fontFamily:font, fontWeight:500, fontSize:14, color:'#6a7380', lineHeight:1.3, whiteSpace:'nowrap' }}>
                  Trainer
                </span>
              </div>
              <img src={trIconArrow} alt="" style={{ width:28, height:28, objectFit:'contain' }}/>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex:1, padding:'27px 40px', overflowY:'auto', overflowX:'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
