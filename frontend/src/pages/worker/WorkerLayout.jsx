/**
 * WorkerLayout — shared sidebar + topbar for all worker/candidate pages.
 * Figma node 1:1316 (file Ud0NnDoXtD1Rd5t4EaAlBT). All assets from Figma API.
 */
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { clearToken } from '../../services/api'

const font = "'Urbanist', sans-serif"

/* ─── FIGMA ASSETS — node 1:1316 ─── */
const imgLogoIcon       = 'https://www.figma.com/api/mcp/asset/abe72eb9-39b4-4dfa-a003-8cbf0583d2d7'  // Layer_1
const imgIconHomeActive = 'https://www.figma.com/api/mcp/asset/eefed488-1762-472f-9f96-0651ebf05759'  // vuesax/bold/category
const imgIconDocuments  = 'https://www.figma.com/api/mcp/asset/411e75e2-1fe6-4751-94ba-0cd63e9f6de8'  // solar--document
const imgIconEOIs       = 'https://www.figma.com/api/mcp/asset/b850d02a-0d14-4152-b1da-b4ae1abdf13c'  // tabler--message
const imgIconCourses    = 'https://www.figma.com/api/mcp/asset/c9f75557-239b-4a3d-9ad4-9627deb6f5e2'  // boxicons--education
const imgIconSettings   = 'https://www.figma.com/api/mcp/asset/fca5eb5c-a092-47bd-90f0-6edc4273b9d3'  // vuesax/outline/setting-2
const imgIconHelp       = 'https://www.figma.com/api/mcp/asset/15037cb7-7c47-4e94-aa71-c318bc5c9712'  // vuesax/outline/lamp-on
const imgSearchIcon     = 'https://www.figma.com/api/mcp/asset/b24fbb95-73d4-492c-b200-bea52b781733'  // vuesax/outline/search-normal
const imgBellIcon       = 'https://www.figma.com/api/mcp/asset/d4577ff5-57a5-4798-ada6-8206e38a84fd'  // vuesax/bold/notification
const imgAvatarUser     = 'https://www.figma.com/api/mcp/asset/86c2d6e7-2fbb-498f-a9ba-8181d5e4e619'  // Default avatar
const imgStrokeDot      = 'https://www.figma.com/api/mcp/asset/a18c91fe-3f27-41f8-a073-9617a46fe7a6'  // Stroke dot
const imgDropArrow      = 'https://www.figma.com/api/mcp/asset/373efffd-bc51-413b-9a14-c4f34b7bb4d6'  // arrow_drop_down
const imgMenu           = 'https://www.figma.com/api/mcp/asset/b2a41913-98ec-4e77-be04-16dc0315941b'  // menu

function getActive(p) {
  if (p.startsWith('/worker/documents')) return 'docs'
  if (p.startsWith('/worker/eois'))      return 'eois'
  if (p.startsWith('/worker/courses'))   return 'courses'
  if (p.startsWith('/worker/settings'))  return 'settings'
  if (p.startsWith('/worker/help'))      return 'help'
  return 'home'
}

export function WorkerLayout({ children, user }) {
  const location = useLocation()
  const navigate = useNavigate()
  const active   = getActive(location.pathname)

  const displayName = user?.full_name || 'Joshua Co'

  const NAV = [
    { key:'home',     label:'Home',                 icon: active==='home' ? imgIconHomeActive : imgIconDocuments, path:'/worker/dashboard' },
    { key:'docs',     label:'My Documents',         icon: imgIconDocuments, path:'/worker/documents' },
    { key:'eois',     label:'My EOIs',              icon: imgIconEOIs,      path:'/worker/eois' },
    { key:'courses',  label:'Recommended Courses',  icon: imgIconCourses,   path:'/worker/courses' },
    { key:'settings', label:'Settings',             icon: imgIconSettings,  path:'/worker/settings' },
    { key:'help',     label:'Help',                 icon: imgIconHelp,      path:'/worker/help' },
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
        {/* Active indicator bar — right edge, dark navy per Figma */}
        <div style={{
          position:'absolute', right:0,
          top:'9.63%', bottom:'87.14%',
          width:4, background:'#0b3a66',
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
                  Employee
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
