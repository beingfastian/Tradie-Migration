/**
 * CompanyHome — Figma node 1:1559 (file Ud0NnDoXtD1Rd5t4EaAlBT)
 * All assets from Figma API. Inline styles only.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyLayout } from './CompanyLayout'
import { getToken, getMe } from '../../services/api'

const font = "'Urbanist', sans-serif"

/* ─── FIGMA ASSETS — node 1:1559 ─── */
const imgHeroBg      = 'https://www.figma.com/api/mcp/asset/e8c44ff9-2f95-422b-b16f-0dfc77b70e98'  // image 6074
const imgHeroIllus   = 'https://www.figma.com/api/mcp/asset/0c744a54-f44d-479a-a597-520d716da979'  // undraw_walk-in-the-city
const imgEllipseRing = 'https://www.figma.com/api/mcp/asset/8bd72468-9b06-4c16-99f5-46bba3c998d8'  // Ellipse 4336
const imgDonutChart  = 'https://www.figma.com/api/mcp/asset/9a75a8e6-9b45-4b26-8229-c9ec80ccf00e'  // Group 3
const imgMailbox     = 'https://www.figma.com/api/mcp/asset/5b9a3b35-a16f-4fce-aeb6-acd0b1e0c918'  // undraw_mailbox_e7nc 2
const imgDeco1       = 'https://www.figma.com/api/mcp/asset/498b1ed3-aae9-429e-bb63-dca429ca19eb'  // Group1686552118
const imgDeco2       = 'https://www.figma.com/api/mcp/asset/2a4f3237-e9a1-4316-ae6f-082681dd456f'  // Group1686552119
const imgDeco3       = 'https://www.figma.com/api/mcp/asset/3e0e8a59-1a0c-42d8-b096-0e96202e0b93'  // Group1686552135

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export function CompanyHome() {
  const navigate  = useNavigate()
  const [user, setUser]       = useState(null)
  const [company, setCompany] = useState(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    getMe(token).then(u => setUser(u)).catch(() => {})
  }, [])

  const companyName = company?.company_name || user?.full_name || 'Acme Electrical Pty Ltd'

  return (
    <CompanyLayout user={user} company={company}>

      {/* ── Section heading ── */}
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:font, fontWeight:700, fontSize:34, color:'#1e1e1e', margin:'0 0 4px', lineHeight:1.3 }}>
          Company Overview
        </h2>
        <p style={{ fontFamily:font, fontWeight:500, fontSize:18, color:'#6a7380', margin:0, lineHeight:1.3 }}>
          Manage your active job listings and track candidate expressions of interest.
        </p>
      </div>

      {/* ── Hero Banner ── */}
      <div style={{
        position:'relative', borderRadius:50, overflow:'hidden',
        height:220, marginBottom:28, flexShrink:0,
      }}>
        {/* bg wave */}
        <img src={imgHeroBg} alt=""
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>

        {/* text */}
        <div style={{
          position:'absolute', inset:0, padding:'32px 48px',
          display:'flex', flexDirection:'column', justifyContent:'center',
          zIndex:2, maxWidth:'60%',
        }}>
          <h1 style={{
            fontFamily:font, fontWeight:700, fontSize:28, lineHeight:1.3,
            color:'#403c8b', margin:'0 0 14px',
          }}>
            {getGreeting()},{' '}
            <span style={{ color:'#f26f37' }}>{companyName}</span>! 🚀
          </h1>
          <p style={{
            fontFamily:font, fontWeight:600, fontSize:18, lineHeight:1.5,
            color:'#1d15a7', margin:0,
          }}>
            Your company is verified. You have 3 active job roles appearing in candidate searches.
          </p>
        </div>

        {/* city illustration */}
        <img src={imgHeroIllus} alt=""
          style={{
            position:'absolute', right:0, top:0,
            height:'100%', width:'auto', display:'block', zIndex:2,
            objectFit:'contain', objectPosition:'right center',
          }}/>
      </div>

      {/* ── Two-column cards ── */}
      <div style={{ display:'flex', gap:20, alignItems:'stretch' }}>

        {/* ── LEFT card — company profile ── */}
        <div style={{
          flex:'0 0 55%',
          background:'#fff', borderRadius:16, padding:'28px 24px',
          boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:14,
          position:'relative', overflow:'hidden',
        }}>
          {/* Decorative circles */}
          <img src={imgDeco1} alt="" style={{ position:'absolute', left:32, top:'42%', width:55, height:'auto', opacity:0.85, transform:'rotate(6deg)', pointerEvents:'none' }}/>
          <img src={imgDeco2} alt="" style={{ position:'absolute', left:160, top:'55%', width:55, height:'auto', opacity:0.85, transform:'rotate(-164deg)', pointerEvents:'none' }}/>
          <img src={imgDeco3} alt="" style={{ position:'absolute', right:40, top:'30%', width:40, height:'auto', opacity:0.6, pointerEvents:'none' }}/>

          {/* Avatar ring + donut */}
          <div style={{ position:'relative', width:180, height:180, flexShrink:0, marginTop:8 }}>
            <img src={imgEllipseRing} alt=""
              style={{ width:180, height:180, display:'block', borderRadius:'50%', objectFit:'cover' }}/>
            <img src={imgDonutChart} alt=""
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}/>
            {/* Verified orange badge */}
            <div style={{
              position:'absolute', bottom:4, left:'50%', transform:'translateX(-50%)',
              background:'#f26f37', color:'#fff', borderRadius:16,
              padding:'4px 14px', fontFamily:font, fontWeight:600, fontSize:14,
              whiteSpace:'nowrap', boxShadow:'0 2px 8px rgba(242,111,55,0.35)',
            }}>Verified</div>
          </div>

          {/* Purple badges */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            <span style={{
              background:'#403c8b', color:'#f1fdfd',
              borderRadius:13, padding:'5px 16px',
              fontFamily:font, fontWeight:600, fontSize:13,
            }}>Standard Sponsor</span>
            <span style={{
              background:'#403c8b', color:'#f1fdfd',
              borderRadius:13, padding:'5px 16px',
              fontFamily:font, fontWeight:600, fontSize:13,
            }}>ABN Verified</span>
          </div>

          {/* Company name + subtitle + description */}
          <div style={{ textAlign:'center' }}>
            <p style={{ fontFamily:font, fontWeight:700, fontSize:22, color:'#1e1e1e', margin:'0 0 4px' }}>
              {companyName}
            </p>
            <p style={{ fontFamily:font, fontWeight:500, fontSize:14, color:'#6a7380', margin:'0 0 6px', lineHeight:1.5 }}>
              Licensed Electrical Contractor &amp; Sponsor
            </p>
            <p style={{ fontFamily:font, fontWeight:400, fontSize:13, color:'#9ca3af', margin:0, lineHeight:1.5, maxWidth:320 }}>
              Specializing in industrial infrastructure and large-scale residential projects across NSW.
            </p>
          </div>

          {/* Manage Business Profile button */}
          <button onClick={() => navigate('/company/profile')} style={{
            width:'100%', height:53,
            background:'#156dbf', color:'#fff',
            border:'none', borderRadius:12, cursor:'pointer',
            fontFamily:font, fontWeight:600, fontSize:16,
            boxShadow:'0 4px 12px rgba(21,109,191,0.22)',
            transition:'background 0.15s', marginTop:'auto',
          }}
            onMouseEnter={e => e.currentTarget.style.background='#1259a0'}
            onMouseLeave={e => e.currentTarget.style.background='#156dbf'}>
            Manage Business Profile
          </button>
        </div>

        {/* ── RIGHT column ── */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:20 }}>

          {/* Active Job Roles card */}
          <div style={{
            flex:1,
            background:'#fff', borderRadius:16, padding:'28px 24px',
            boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
            display:'flex', flexDirection:'column', gap:16,
          }}>
            <div>
              <h3 style={{ fontFamily:font, fontWeight:700, fontSize:22, color:'#1e1e1e', margin:'0 0 4px' }}>
                Active Job Roles
              </h3>
              <p style={{ fontFamily:font, fontWeight:500, fontSize:16, color:'#6a7380', margin:0 }}>
                3/5 Roles Filled
              </p>
            </div>

            {/* Progress bar — 3/5 = 60% */}
            <div style={{ background:'#cccccc', borderRadius:48, height:15, overflow:'hidden' }}>
              <div style={{
                width:'60%', height:'100%',
                background:'#5379f4', borderRadius:48,
                transition:'width 0.6s ease',
              }}/>
            </div>

            {/* Post New Role button */}
            <button onClick={() => navigate('/company/jobs')} style={{
              width:'100%', height:53,
              background:'transparent',
              border:'1px solid #f26f37',
              borderRadius:12, cursor:'pointer',
              fontFamily:font, fontWeight:600, fontSize:16, color:'#f26f37',
              transition:'background 0.15s', marginTop:'auto',
            }}
              onMouseEnter={e => e.currentTarget.style.background='#fff5f0'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              Post New Role
            </button>
          </div>

          {/* EOI waiting card */}
          <div style={{
            flex:1,
            background:'#fff', borderRadius:16, padding:'28px 24px',
            boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
            display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:12,
          }}>
            <img src={imgMailbox} alt="mailbox"
              style={{ width:140, height:'auto', display:'block' }}/>
            <p style={{
              fontFamily:font, fontWeight:500, fontSize:16, color:'#6a7380',
              textAlign:'center', margin:0, lineHeight:1.5, maxWidth:300,
            }}>
              Waiting for candidate responses to your sent EOIs.
            </p>
          </div>

        </div>
      </div>

    </CompanyLayout>
  )
}
