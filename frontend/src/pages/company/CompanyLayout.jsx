/**
 * CompanyLayout — shared sidebar + topbar for all company/employer pages.
 * Figma node 1:1559 (file Ud0NnDoXtD1Rd5t4EaAlBT). All assets from Figma API.
 */
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearToken } from '../../services/api'

const font = "'Urbanist', sans-serif"

/* ─── FIGMA ASSETS — node 1:1559 ─── */
const imgLogoIcon       = 'https://www.figma.com/api/mcp/asset/f5734962-1b47-4cf1-8eb0-b89c5e7625b8'  // Layer_1
const imgIconHomeActive = 'https://www.figma.com/api/mcp/asset/a2a4a83c-5d34-4d08-99ba-16d0759ae82a'  // vuesax/bold/category
const imgIconCandidates = 'https://www.figma.com/api/mcp/asset/440adbb6-9d24-47aa-985a-50e5720e8325'  // mingcute--search-line
const imgIconJobs       = 'https://www.figma.com/api/mcp/asset/82bd10e9-3960-4367-bfda-cc304528cd00'  // streamline--job-bag
const imgIconEOIs       = 'https://www.figma.com/api/mcp/asset/10552c78-27a3-4e4c-bb7f-785707241410'  // tabler--message
const imgIconSettings   = 'https://www.figma.com/api/mcp/asset/3ba53eb9-7ef6-4a35-8b57-a2a9d6e42970'  // vuesax/outline/setting-2
const imgIconHelp       = 'https://www.figma.com/api/mcp/asset/745026f1-c6f1-4e73-8fae-3db927603261'  // vuesax/outline/lamp-on
const imgSearchIcon     = 'https://www.figma.com/api/mcp/asset/a4ec06e0-9b04-4217-acf5-2fc1012c92c8'  // vuesax/outline/search-normal
const imgBellIcon       = 'https://www.figma.com/api/mcp/asset/389fe99f-105c-4ad6-a8d9-a758ac8f2322'  // vuesax/bold/notification
const imgAvatarUser     = 'https://www.figma.com/api/mcp/asset/a38e0744-5bdf-46e9-a277-124f3dc69794'  // Default avatar
const imgStrokeDot      = 'https://www.figma.com/api/mcp/asset/ccd1579a-ad89-44f8-b85f-2dfdd5ead59c'  // Stroke dot
const imgDropArrow      = 'https://www.figma.com/api/mcp/asset/358fbb27-625a-479e-adff-924f446e653e'  // arrow_drop_down
const imgMenu           = 'https://www.figma.com/api/mcp/asset/7d87c33c-7a01-4e17-89d2-b4e30b9178cd'  // menu

function getActive(p) {
  if (p.startsWith('/company/candidates')) return 'candidates'
  if (p.startsWith('/company/jobs'))       return 'jobs'
  if (p.startsWith('/company/eois'))       return 'eois'
  if (p.startsWith('/company/settings'))   return 'settings'
  if (p.startsWith('/company/help'))       return 'help'
  return 'home'
}

export function CompanyLayout({ children, user, company }) {
  const location = useLocation()
  const navigate = useNavigate()
  const active   = getActive(location.pathname)

  const displayName = company?.company_name || user?.full_name || 'Acme Electrical Pty Ltd'
  const roleLabel   = company?.trade_type   || 'Licensed Electrical Contractor & Sponsor'

  const NAV = [
    { key:'home',       label:'Home',            icon: active==='home' ? imgIconHomeActive : imgIconCandidates, path:'/company/dashboard' },
    { key:'candidates', label:'Find Candidates', icon: imgIconCandidates, path:'/company/candidates' },
    { key:'jobs',       label:'Active Jobs',      icon: imgIconJobs,       path:'/company/jobs' },
    { key:'eois',       label:'Sent EOIs',        icon: imgIconEOIs,       path:'/company/eois' },
    { key:'settings',   label:'Settings',         icon: imgIconSettings,   path:'/company/settings' },
    { key:'help',       label:'Help',             icon: imgIconHelp,       path:'/company/help' },
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
        {/* Active blue indicator bar — right edge */}
        <div style={{
          position:'absolute', right:0,
          top:'9.63%', bottom:'87.14%',
          width:4, background:'#156dbf',
          borderRadius:'4px 0 0 4px', zIndex:2,
        }}/>

        <div style={{ padding:'37px 40px 24px', display:'flex', flexDirection:'column', gap:40, flex:1 }}>
          {/* Logo */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src={imgLogoIcon} alt="" style={{ width:47, height:33, display:'block' }}/>
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
                    padding:'12px 8px', borderRadius:8, width:262,
                    background: isActive ? '#f3f1fd' : 'transparent',
                    cursor:'pointer', transition:'background 0.15s',
                  }}
                    onMouseEnter={e => { if(!isActive) e.currentTarget.style.background='#f8f8fc' }}
                    onMouseLeave={e => { if(!isActive) e.currentTarget.style.background='transparent' }}>
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
          <div style={{ display:'flex', alignItems:'center', gap:24 }}>
            <img src={imgMenu} alt="menu" style={{ width:30, height:34, cursor:'pointer' }}/>
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
              <img src={imgSearchIcon} alt="" style={{ width:24, height:24, flexShrink:0 }}/>
              <input placeholder="Search" style={{
                border:'none', outline:'none', fontFamily:font,
                fontSize:16, color:'#6a7380', background:'transparent', flex:1,
              }}/>
            </div>
          </div>

          {/* Bell + User */}
          <div style={{ display:'flex', alignItems:'center', gap:32 }}>
            {/* Bell */}
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
                <span style={{ fontFamily:font, fontWeight:500, fontSize:16, color:'#6a7380', lineHeight:1.3, whiteSpace:'nowrap' }}>
                  {roleLabel}
                </span>
              </div>
              <img src={imgDropArrow} alt="" style={{ width:32, height:32 }}/>
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
