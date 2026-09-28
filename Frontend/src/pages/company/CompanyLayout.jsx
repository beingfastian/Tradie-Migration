/**
 * CompanyLayout — shared sidebar + topbar for company/employer pages.
 * Assets stored permanently in frontend/src/assets/company-dashboard/
 */
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearToken } from '../../services/api'

import cdLogo         from '../../assets/company-dashboard/cd-logo.png'
import cdIconHome     from '../../assets/company-dashboard/cd-icon-home.svg'
import cdIconSearch   from '../../assets/company-dashboard/cd-icon-search.svg'
import cdIconJobs     from '../../assets/company-dashboard/cd-icon-jobs.svg'
import cdIconEois     from '../../assets/company-dashboard/cd-icon-eois.svg'
import cdIconSettings from '../../assets/company-dashboard/cd-icon-settings.svg'
import cdIconHelp     from '../../assets/company-dashboard/cd-icon-help.svg'
import cdIconBell     from '../../assets/company-dashboard/cd-icon-bell.svg'
import cdIconDot      from '../../assets/company-dashboard/cd-icon-dot.svg'
import cdIconArrow    from '../../assets/company-dashboard/cd-icon-arrow.svg'
import cdIconMenu     from '../../assets/company-dashboard/cd-icon-menu.svg'
import cdIconSearchBar from '../../assets/company-dashboard/cd-icon-search-bar.svg'
import cdAvatar       from '../../assets/company-dashboard/cd-avatar.png'

const font = "'Urbanist', sans-serif"

function getActive(p) {
  if (p.startsWith('/company/candidates') || p.startsWith('/company/find-candidates')) return 'candidates'
  if (p.startsWith('/company/jobs')       || p.startsWith('/company/active-jobs'))     return 'jobs'
  if (p.startsWith('/company/eois')       || p.startsWith('/company/sent-eois'))       return 'eois'
  if (p.startsWith('/company/settings'))   return 'settings'
  if (p.startsWith('/company/help'))       return 'help'
  return 'home'
}

export function CompanyLayout({ children, user, company }) {
  const location = useLocation()
  const navigate  = useNavigate()
  const active    = getActive(location.pathname)

  const displayName = company?.company_name || user?.full_name || 'Acme Electrical Pty Ltd'

  const NAV = [
    { key:'home',       label:'Home',             icon: cdIconHome,     path:'/company/dashboard' },
    { key:'candidates', label:'Find Candidates',  icon: cdIconSearch,   path:'/company/candidates' },
    { key:'jobs',       label:'Active Jobs',      icon: cdIconJobs,     path:'/company/jobs' },
    { key:'eois',       label:'Sent EOIs',        icon: cdIconEois,     path:'/company/eois' },
    { key:'settings',   label:'Settings',         icon: cdIconSettings, path:'/company/settings' },
    { key:'help',       label:'Help',             icon: cdIconHelp,     path:'/company/help' },
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
            <img src={cdLogo} alt="logo" style={{ width:47, height:33, display:'block', objectFit:'contain' }}/>
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
            <img src={cdIconMenu} alt="menu" style={{ width:30, height:30, cursor:'pointer', objectFit:'contain' }}/>
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
              <img src={cdIconSearchBar} alt="" style={{ width:24, height:24, flexShrink:0 }}/>
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
                <img src={cdIconBell} alt="notifications" style={{ width:24, height:24 }}/>
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
                <img src={cdAvatar} alt="avatar"
                  style={{ width:50, height:50, borderRadius:'50%', display:'block', objectFit:'cover' }}/>
                <div style={{
                  position:'absolute', bottom:0, right:0,
                  width:16, height:16, borderRadius:16,
                  background:'#129578', display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <img src={cdIconDot} alt="" style={{ width:8, height:8 }}/>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                <span style={{ fontFamily:font, fontWeight:700, fontSize:16, color:'#343434', lineHeight:1.3, whiteSpace:'nowrap' }}>
                  {displayName}
                </span>
                <span style={{ fontFamily:font, fontWeight:500, fontSize:14, color:'#6a7380', lineHeight:1.3, whiteSpace:'nowrap' }}>
                  Employer
                </span>
              </div>
              <img src={cdIconArrow} alt="" style={{ width:28, height:28, objectFit:'contain' }}/>
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
