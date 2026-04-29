/**
 * CompanyLayout — shared sidebar + topbar for all employer/company dashboard pages.
 * Matches Figma company flow: white sidebar 280px, bg #F6F6F9, sticky topbar.
 */
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearToken } from '../../services/api'

const font = "'Urbanist', sans-serif"

const IconHome      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
const IconSearch    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
const IconJobs      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>
const IconEOI       = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
const IconSettings  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
const IconHelp      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
const IconBell      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/></svg>
const IconMenuBar   = () => <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="#343434" strokeWidth="2" strokeLinecap="round"><line x1="0" y1="1" x2="22" y2="1"/><line x1="0" y1="8" x2="22" y2="8"/><line x1="0" y1="15" x2="22" y2="15"/></svg>
const IconChevron   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
const IconSearchSm  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>

const NAV_ITEMS = [
  { key:'home',       label:'Home',            icon:IconHome,     path:'/company/dashboard' },
  { key:'candidates', label:'Find Candidates', icon:IconSearch,   path:'/company/candidates' },
  { key:'jobs',       label:'Active Jobs',     icon:IconJobs,     path:'/company/jobs' },
  { key:'eois',       label:'Sent EOIs',       icon:IconEOI,      path:'/company/eois' },
  { key:'settings',   label:'Settings',        icon:IconSettings, path:'/company/settings' },
  { key:'help',       label:'Help',            icon:IconHelp,     path:'/company/help' },
]

function getActiveKey(pathname) {
  if (pathname.startsWith('/company/candidates')) return 'candidates'
  if (pathname.startsWith('/company/jobs'))       return 'jobs'
  if (pathname.startsWith('/company/eois'))       return 'eois'
  if (pathname.startsWith('/company/settings'))   return 'settings'
  if (pathname.startsWith('/company/help'))       return 'help'
  return 'home'
}

export function CompanyLayout({ children, user, company }) {
  const location  = useLocation()
  const navigate  = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const active = getActiveKey(location.pathname)

  function handleLogout() { clearToken(); navigate('/login', { replace:true }) }

  const displayName = company?.company_name || user?.full_name || user?.email?.split('@')[0] || 'Acme Electrical Pty Ltd'
  const subtitle    = company?.trade_type   || 'Licensed Electrical Contractor & Sponsor'
  const initials    = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#f6f6f9', fontFamily:font }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: sidebarOpen ? 280 : 0, minWidth: sidebarOpen ? 280 : 0,
        background:'#fff', boxShadow:'2px 0 12px rgba(0,0,0,0.04)',
        display:'flex', flexDirection:'column',
        transition:'width 0.22s ease, min-width 0.22s ease',
        overflow:'hidden', position:'relative', zIndex:20, flexShrink:0,
      }}>
        {/* Blue left accent */}
        <div style={{ position:'absolute', left:0, top:'9.6%', bottom:'12.8%', width:4, background:'#0b3a66', borderRadius:'0 4px 4px 0' }}/>

        <div style={{ padding:'37px 16px 24px 24px', display:'flex', flexDirection:'column', gap:40, flex:1 }}>
          {/* Logo */}
          <div style={{ paddingLeft:4 }}>
            <span style={{ fontFamily:"'Mohave','Urbanist',sans-serif", fontWeight:600, fontSize:26, lineHeight:1 }}>
              <span style={{ color:'#f26f37' }}>T</span>
              <span style={{ color:'#156dbf' }}>radie App</span>
            </span>
          </div>

          {/* Nav */}
          <nav style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {NAV_ITEMS.map(item => {
              const isActive = active === item.key
              const Icon = item.icon
              return (
                <Link key={item.key} to={item.path} style={{ textDecoration:'none' }}>
                  <div
                    style={{
                      display:'flex', alignItems:'center', gap:12,
                      padding:'10px 10px', borderRadius:8,
                      background: isActive ? '#f3f1fd' : 'transparent',
                      color: isActive ? '#156dbf' : '#6a7380',
                      fontWeight:700, fontSize:15, cursor:'pointer',
                      transition:'background 0.15s',
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.background='#f8f8fc' }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background='transparent' }}
                  >
                    <span style={{ color: isActive ? '#156dbf' : '#6a7380', display:'flex' }}><Icon /></span>
                    <span>{item.label}</span>
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>

        {/* ── Topbar ── */}
        <header style={{
          background:'#fff', boxShadow:'0 4px 12px rgba(0,0,0,0.05)',
          padding:'0 40px', height:72,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexShrink:0, zIndex:15, position:'sticky', top:0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <button onClick={() => setSidebarOpen(v => !v)} style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'flex' }}>
              <IconMenuBar />
            </button>
            <span style={{ fontFamily:"'Mohave','Urbanist',sans-serif", fontWeight:600, fontSize:26 }}>
              <span style={{ color:'#f26f37' }}>T</span>
              <span style={{ color:'#156dbf' }}>radie App</span>
            </span>
          </div>

          <div style={{ flex:1, maxWidth:520, margin:'0 40px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, border:'1px solid #c1c1c8', borderRadius:12, padding:'10px 18px', background:'#fff' }}>
              <IconSearchSm />
              <input placeholder="Search" style={{ border:'none', outline:'none', fontFamily:font, fontSize:15, color:'#6a7380', background:'transparent', flex:1 }} />
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:24 }}>
            <div style={{ position:'relative' }}>
              <div style={{ width:44, height:44, borderRadius:'50%', background:'#f3f1fd', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#5379f4' }}>
                <IconBell />
              </div>
              <div style={{ position:'absolute', top:0, right:0, width:16, height:16, borderRadius:'50%', background:'#fb4248', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color:'#fff' }}>3</div>
            </div>

            <div style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={handleLogout} title="Sign out">
              <div style={{ width:44, height:44, borderRadius:'50%', background:'#156dbf', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:15, position:'relative' }}>
                {initials}
                <div style={{ position:'absolute', bottom:0, right:0, width:13, height:13, borderRadius:'50%', background:'#129578', border:'2px solid #fff' }}/>
              </div>
              <div>
                <div style={{ fontWeight:700, fontSize:14, color:'#343434', lineHeight:1.2 }}>{displayName}</div>
                <div style={{ fontSize:12, color:'#6a7380', lineHeight:1.2 }}>{subtitle}</div>
              </div>
              <IconChevron />
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main style={{ flex:1, padding:'32px 40px', overflowY:'auto', overflowX:'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
