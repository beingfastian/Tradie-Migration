/**
 * CompanyHome — Figma node 1:1316 (file Ud0NnDoXtD1Rd5t4EaAlBT)
 * All assets from Figma API. Inline styles only.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyLayout } from './CompanyLayout'
import { getToken, getMe } from '../../services/api'

const font = "'Urbanist', sans-serif"

/* ─── FIGMA ASSETS — node 1:1316 ─── */
const imgHeroBg          = 'https://www.figma.com/api/mcp/asset/40b21323-f8dc-4e68-bc84-c3aefb5c8e47' // image 6074
const imgHeroIllus       = 'https://www.figma.com/api/mcp/asset/d62d6f2d-5da6-4c5f-af7e-0a6cd04d039b' // undraw_welcoming_42an
const imgEllipseRing     = 'https://www.figma.com/api/mcp/asset/588a81d2-5ad7-478b-9b45-553dcd224ac2' // Ellipse 4336
const imgDonutChart      = 'https://www.figma.com/api/mcp/asset/708ed41c-5a42-42dd-a4a8-81591192dd2a' // Group 3
const imgMailbox         = 'https://www.figma.com/api/mcp/asset/85ad9baa-8664-48c3-b9de-144771f05ead' // undraw_mailbox_e7nc 2
const imgDecoCircle1     = 'https://www.figma.com/api/mcp/asset/4880e809-4c7d-424c-908d-70e86aded273' // Group 1686552116
const imgDecoCircle2     = 'https://www.figma.com/api/mcp/asset/e83216cb-4ab5-4574-8fb1-355704316079' // Group 1686552117

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export function CompanyHome() {
  const navigate = useNavigate()
  const [user, setUser]       = useState(null)
  const [company, setCompany] = useState(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    getMe(token).then(u => setUser(u)).catch(() => {})
  }, [])

  const firstName   = user?.full_name?.split(' ')[0] || 'Joshua'
  const companyName = company?.company_name || user?.full_name || 'Joshua Co'

  return (
    <CompanyLayout user={user} company={company}>

      {/* ── Section heading ── */}
      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:font, fontWeight:700, fontSize:34, color:'#1e1e1e', margin:'0 0 4px', lineHeight:1.3 }}>
          My Career Dashboard
        </h2>
        <p style={{ fontFamily:font, fontWeight:500, fontSize:18, color:'#6a7380', margin:0, lineHeight:1.3 }}>
          Your profile is almost ready! Finish the remaining steps to get noticed by Australian employers.
        </p>
      </div>

      {/* ── Hero Banner ── */}
      <div style={{
        position:'relative', borderRadius:50, overflow:'hidden',
        height:220, marginBottom:28, flexShrink:0,
      }}>
        <img src={imgHeroBg} alt=""
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>

        {/* Text */}
        <div style={{
          position:'absolute', inset:0, padding:'32px 48px',
          display:'flex', flexDirection:'column', justifyContent:'center',
          zIndex:2, maxWidth:'60%',
        }}>
          <h1 style={{
            fontFamily:font, fontWeight:700, fontSize:30, lineHeight:1.3,
            color:'#403c8b', margin:'0 0 14px',
          }}>
            {getGreeting()},{' '}
            <span style={{ color:'#f26f37' }}>{firstName}</span>! 🚀
          </h1>
          <p style={{
            fontFamily:font, fontWeight:600, fontSize:18, lineHeight:1.5,
            color:'#1d15a7', margin:0,
          }}>
            Your profile is{' '}
            <span style={{ color:'#f26f37' }}>75%</span>
            {' '}complete. Publish your profile to start appearing in employer searches!
          </p>
        </div>

        {/* Hero illustration */}
        <img src={imgHeroIllus} alt=""
          style={{
            position:'absolute', right:40, top:'50%',
            transform:'translateY(-50%)',
            height:200, width:'auto', display:'block', zIndex:2,
          }}/>

        {/* Decorative circles */}
        <img src={imgDecoCircle1} alt=""
          style={{ position:'absolute', left:80, bottom:20, width:60, height:auto, zIndex:3, opacity:0.85, transform:'rotate(6deg)' }}/>
        <img src={imgDecoCircle2} alt=""
          style={{ position:'absolute', left:260, bottom:-10, width:60, height:'auto', zIndex:3, opacity:0.85, transform:'rotate(-164deg)' }}/>
      </div>

      {/* ── Two-column cards ── */}
      <div style={{ display:'flex', gap:20, alignItems:'stretch' }}>

        {/* LEFT card — profile + donut */}
        <div style={{
          flex:'0 0 55%',
          background:'#fff', borderRadius:16, padding:'28px 24px',
          boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:16,
          position:'relative', overflow:'hidden',
        }}>
          {/* Avatar ring + donut */}
          <div style={{ position:'relative', width:180, height:180, flexShrink:0, marginTop:8 }}>
            <img src={imgEllipseRing} alt=""
              style={{ width:180, height:180, display:'block', borderRadius:'50%', objectFit:'cover' }}/>
            <img src={imgDonutChart} alt=""
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}/>
            {/* 75% orange badge */}
            <div style={{
              position:'absolute', bottom:4, left:'50%', transform:'translateX(-50%)',
              background:'#f26f37', color:'#fff', borderRadius:16,
              padding:'4px 14px', fontFamily:font, fontWeight:600, fontSize:14,
              whiteSpace:'nowrap', boxShadow:'0 2px 8px rgba(242,111,55,0.35)',
            }}>75%</div>
          </div>

          {/* Purple badges */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            <span style={{
              background:'#403c8b', color:'#f1fdfd',
              borderRadius:13, padding:'5px 16px',
              fontFamily:font, fontWeight:600, fontSize:13,
            }}>English: B2</span>
            <span style={{
              background:'#403c8b', color:'#f1fdfd',
              borderRadius:13, padding:'5px 16px',
              fontFamily:font, fontWeight:600, fontSize:13,
            }}>5+ Years Exp</span>
          </div>

          {/* Name + trade */}
          <div style={{ textAlign:'center' }}>
            <p style={{ fontFamily:font, fontWeight:700, fontSize:22, color:'#1e1e1e', margin:'0 0 4px' }}>
              {companyName}
            </p>
            <p style={{ fontFamily:font, fontWeight:500, fontSize:14, color:'#6a7380', margin:0, lineHeight:1.5 }}>
              Licensed Electrician (or selected trade).
            </p>
          </div>

          {/* Publish Profile button */}
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
            Publish Profile
          </button>
        </div>

        {/* RIGHT column */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:20 }}>

          {/* My Documents card */}
          <div style={{
            flex:1,
            background:'#fff', borderRadius:16, padding:'28px 24px',
            boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
            display:'flex', flexDirection:'column', gap:16,
          }}>
            <div>
              <h3 style={{ fontFamily:font, fontWeight:700, fontSize:22, color:'#1e1e1e', margin:'0 0 4px' }}>
                My Documents
              </h3>
              <p style={{ fontFamily:font, fontWeight:500, fontSize:16, color:'#6a7380', margin:0 }}>
                3/8 Documents Uploaded
              </p>
            </div>

            {/* Progress bar — 3/8 = ~37.5% */}
            <div style={{ background:'#cccccc', borderRadius:48, height:15, overflow:'hidden' }}>
              <div style={{
                width:'37.5%', height:'100%',
                background:'#5379f4', borderRadius:48,
                transition:'width 0.6s ease',
              }}/>
            </div>

            {/* Save button */}
            <button onClick={() => navigate('/worker/documents')} style={{
              width:'100%', height:53,
              background:'transparent',
              border:'1px solid #f26f37',
              borderRadius:12, cursor:'pointer',
              fontFamily:font, fontWeight:600, fontSize:16, color:'#f26f37',
              transition:'background 0.15s', marginTop:'auto',
            }}
              onMouseEnter={e => e.currentTarget.style.background='#fff5f0'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              Save
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
              textAlign:'center', margin:0, lineHeight:1.5, maxWidth:280,
            }}>
              Waiting for your first Expression of Interest (EOI).
            </p>
          </div>

        </div>
      </div>

    </CompanyLayout>
  )
}
