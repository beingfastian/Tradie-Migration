/**
 * TrainerHome — Figma node 1:1859 (file Ud0NnDoXtD1Rd5t4EaAlBT)
 * All assets from Figma API. Inline styles only.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrainerLayout } from './TrainerLayout'
import { getToken, getMe } from '../../services/api'

const font = "'Urbanist', sans-serif"

/* ─── FIGMA ASSETS — node 1:1859 ─── */
const imgHeroBg      = 'https://www.figma.com/api/mcp/asset/10a35d57-ed65-48fb-9241-116f7dd4ce1a'
const imgHeroIllus   = 'https://www.figma.com/api/mcp/asset/f04c5fe3-bbd2-465e-9654-53e591b1e870'
const imgEllipseRing = 'https://www.figma.com/api/mcp/asset/69d6afa0-44d1-403c-89ea-d0ca53a336fa'
const imgDonutChart  = 'https://www.figma.com/api/mcp/asset/9002a1f5-6f92-49bf-8a84-676071169f86'
const imgMailbox     = 'https://www.figma.com/api/mcp/asset/d5df3de6-fb8e-4011-8a46-6052a4f013f6'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export function TrainerHome() {
  const navigate = useNavigate()
  const [user, setUser]         = useState(null)
  const [provider, setProvider] = useState(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    getMe(token).then(u => setUser(u)).catch(() => {})
  }, [])

  const firstName   = user?.full_name?.split(' ')[0] || 'John'

  return (
    <TrainerLayout user={user} provider={provider}>

      {/* ── Hero Banner ── */}
      <div style={{
        position:'relative', borderRadius:50, overflow:'hidden',
        height:311, marginBottom:32, flexShrink:0,
      }}>
        {/* background image */}
        <img src={imgHeroBg} alt=""
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>

        {/* text content */}
        <div style={{
          position:'absolute', inset:0, padding:'44px 48px',
          display:'flex', flexDirection:'column', justifyContent:'center',
          zIndex:2,
        }}>
          <h1 style={{
            fontFamily:font, fontWeight:700, fontSize:34, lineHeight:1.3,
            color:'#403c8b', margin:'0 0 12px',
          }}>
            {getGreeting()},{' '}
            <span style={{ color:'#f26f37' }}>{firstName} Smith</span>! 🚀
          </h1>
          <p style={{
            fontFamily:font, fontWeight:600, fontSize:20, lineHeight:1.5,
            color:'#1d15a7', margin:0, maxWidth:560,
          }}>
            Your institution is active. You have 5 new enrollment inquiries waiting for review.
          </p>
        </div>

        {/* illustration — flipped vertically per Figma */}
        <img src={imgHeroIllus} alt=""
          style={{
            position:'absolute', right:48, bottom:0,
            height:280, width:'auto', display:'block',
            transform:'scaleY(-1)', zIndex:2,
          }}/>
      </div>

      {/* ── Section heading ── */}
      <h2 style={{
        fontFamily:font, fontWeight:700, fontSize:34,
        color:'#1e1e1e', margin:'0 0 24px', lineHeight:1.3,
      }}>
        Education Provider Overview
      </h2>

      {/* ── Two-column cards ── */}
      <div style={{ display:'flex', gap:24, alignItems:'flex-start' }}>

        {/* ── LEFT card — provider profile (751px) ── */}
        <div style={{
          width:751, flexShrink:0,
          background:'#fff', borderRadius:24, padding:'40px 36px',
          boxShadow:'0 2px 20px rgba(0,0,0,0.05)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:20,
          minHeight:669,
        }}>
          {/* Avatar with ring + donut overlay */}
          <div style={{ position:'relative', width:200, height:200, flexShrink:0 }}>
            <img src={imgEllipseRing} alt=""
              style={{ width:200, height:200, display:'block', borderRadius:'50%', objectFit:'cover' }}/>
            <img src={imgDonutChart} alt=""
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}/>
            {/* orange % badge */}
            <div style={{
              position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)',
              background:'#f26f37', color:'#fff', borderRadius:20,
              padding:'4px 16px', fontFamily:font, fontWeight:700, fontSize:14,
              whiteSpace:'nowrap', boxShadow:'0 2px 8px rgba(242,111,55,0.35)',
            }}>98%</div>
          </div>

          {/* Purple badges */}
          <div style={{ display:'flex', gap:12 }}>
            <span style={{
              background:'#403c8b', color:'#f1fdfd',
              borderRadius:12, padding:'6px 18px',
              fontFamily:font, fontWeight:600, fontSize:13,
            }}>RTO: #12345</span>
            <span style={{
              background:'#403c8b', color:'#f1fdfd',
              borderRadius:12, padding:'6px 18px',
              fontFamily:font, fontWeight:600, fontSize:13,
            }}>10+ Courses</span>
          </div>

          {/* Name + desc */}
          <div style={{ textAlign:'center' }}>
            <p style={{ fontFamily:font, fontWeight:800, fontSize:22, color:'#1e1e1e', margin:'0 0 8px' }}>
              Trades Academy Australia
            </p>
            <p style={{
              fontFamily:font, fontWeight:400, fontSize:14, color:'#9ca3af',
              margin:0, maxWidth:340, lineHeight:1.6,
            }}>
              Specializing in Australian Standards certification and trade skills assessment for international workers seeking skilled migration pathways.
            </p>
          </div>

          {/* Manage Course Catalog button */}
          <button onClick={() => navigate('/trainer/courses')} style={{
            width:'100%', height:53,
            background:'#156dbf', color:'#fff',
            border:'none', borderRadius:12, cursor:'pointer',
            fontFamily:font, fontWeight:600, fontSize:16,
            boxShadow:'0 4px 12px rgba(21,109,191,0.22)',
            transition:'background 0.15s', marginTop:'auto',
          }}
            onMouseEnter={e => e.currentTarget.style.background='#1259a0'}
            onMouseLeave={e => e.currentTarget.style.background='#156dbf'}>
            Manage Course Catalog
          </button>
        </div>

        {/* ── RIGHT column ── */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:24 }}>

          {/* Active Courses card (609×315) */}
          <div style={{
            background:'#fff', borderRadius:24, padding:'32px 28px',
            boxShadow:'0 2px 20px rgba(0,0,0,0.05)', minHeight:315,
            display:'flex', flexDirection:'column', gap:16,
          }}>
            <div>
              <h3 style={{ fontFamily:font, fontWeight:700, fontSize:22, color:'#1e1e1e', margin:'0 0 6px' }}>
                Active Courses
              </h3>
              <p style={{ fontFamily:font, fontWeight:400, fontSize:16, color:'#6a7380', margin:0 }}>
                12 Courses Published
              </p>
            </div>

            {/* Progress bar */}
            <div style={{
              background:'#cccccc', borderRadius:8, height:14, overflow:'hidden',
            }}>
              <div style={{
                width:'36%', height:'100%',
                background:'#156dbf', borderRadius:8,
                transition:'width 0.6s ease',
              }}/>
            </div>

            {/* Add New Course button */}
            <button onClick={() => navigate('/trainer/courses')} style={{
              width:'100%', height:53,
              background:'transparent',
              border:'1.5px solid #f26f37',
              borderRadius:12, cursor:'pointer',
              fontFamily:font, fontWeight:600, fontSize:16, color:'#f26f37',
              transition:'background 0.15s', marginTop:'auto',
            }}
              onMouseEnter={e => e.currentTarget.style.background='#fff5f0'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              + Add New Course
            </button>
          </div>

          {/* Waiting for student questions card (609×324) */}
          <div style={{
            background:'#fff', borderRadius:24, padding:'32px 28px',
            boxShadow:'0 2px 20px rgba(0,0,0,0.05)', minHeight:324,
            display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:16,
          }}>
            <img src={imgMailbox} alt="mailbox"
              style={{ width:180, height:'auto', display:'block' }}/>
            <p style={{
              fontFamily:font, fontWeight:600, fontSize:16, color:'#6a7380',
              textAlign:'center', margin:0, maxWidth:260, lineHeight:1.5,
            }}>
              Waiting for student questions
            </p>
            <button onClick={() => navigate('/trainer/inquiries')} style={{
              padding:'10px 32px',
              background:'#5379f4', color:'#fff',
              border:'none', borderRadius:10, cursor:'pointer',
              fontFamily:font, fontWeight:600, fontSize:14,
              transition:'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background='#3f62d4'}
              onMouseLeave={e => e.currentTarget.style.background='#5379f4'}>
              View Inquiries
            </button>
          </div>

        </div>
      </div>

    </TrainerLayout>
  )
}
