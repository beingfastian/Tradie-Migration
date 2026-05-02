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

  const firstName = user?.full_name?.split(' ')[0] || 'John'

  return (
    <TrainerLayout user={user} provider={provider}>

      {/* ── Hero Banner ── */}
      <div style={{
        position:'relative', borderRadius:30, overflow:'hidden',
        height:220, marginBottom:28, flexShrink:0,
      }}>
        {/* background */}
        <img src={imgHeroBg} alt=""
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>

        {/* text */}
        <div style={{
          position:'absolute', inset:0, padding:'32px 40px',
          display:'flex', flexDirection:'column', justifyContent:'center',
          zIndex:2, maxWidth:'55%',
        }}>
          <h1 style={{
            fontFamily:font, fontWeight:700, fontSize:28, lineHeight:1.3,
            color:'#403c8b', margin:'0 0 10px',
          }}>
            {getGreeting()},{' '}
            <span style={{ color:'#f26f37' }}>{firstName} Smith</span>! 🚀
          </h1>
          <p style={{
            fontFamily:font, fontWeight:600, fontSize:16, lineHeight:1.5,
            color:'#1d15a7', margin:0,
          }}>
            Your institution is active. You have 5 new enrollment inquiries waiting for review.
          </p>
        </div>

        {/* illustration — upright, anchored to right */}
        <img src={imgHeroIllus} alt=""
          style={{
            position:'absolute', right:32, top:'50%',
            transform:'translateY(-50%)',
            height:190, width:'auto', display:'block',
            zIndex:2,
          }}/>
      </div>

      {/* ── Section heading ── */}
      <h2 style={{
        fontFamily:font, fontWeight:700, fontSize:28,
        color:'#1e1e1e', margin:'0 0 20px', lineHeight:1.3,
      }}>
        Education Provider Overview
      </h2>

      {/* ── Two-column cards ── */}
      <div style={{ display:'flex', gap:20, alignItems:'stretch' }}>

        {/* ── LEFT card — provider profile ── */}
        <div style={{
          flex:'0 0 55%',
          background:'#fff', borderRadius:20, padding:'28px 24px',
          boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:16,
        }}>
          {/* Avatar ring + donut */}
          <div style={{ position:'relative', width:160, height:160, flexShrink:0 }}>
            <img src={imgEllipseRing} alt=""
              style={{ width:160, height:160, display:'block', borderRadius:'50%', objectFit:'cover' }}/>
            <img src={imgDonutChart} alt=""
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}/>
            {/* orange % badge */}
            <div style={{
              position:'absolute', bottom:4, left:'50%', transform:'translateX(-50%)',
              background:'#f26f37', color:'#fff', borderRadius:20,
              padding:'3px 14px', fontFamily:font, fontWeight:700, fontSize:13,
              whiteSpace:'nowrap', boxShadow:'0 2px 8px rgba(242,111,55,0.35)',
            }}>98%</div>
          </div>

          {/* Purple badges */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            <span style={{
              background:'#403c8b', color:'#f1fdfd',
              borderRadius:10, padding:'5px 16px',
              fontFamily:font, fontWeight:600, fontSize:13,
            }}>RTO: #12345</span>
            <span style={{
              background:'#403c8b', color:'#f1fdfd',
              borderRadius:10, padding:'5px 16px',
              fontFamily:font, fontWeight:600, fontSize:13,
            }}>10+ Courses</span>
          </div>

          {/* Name + desc */}
          <div style={{ textAlign:'center' }}>
            <p style={{ fontFamily:font, fontWeight:800, fontSize:20, color:'#1e1e1e', margin:'0 0 6px' }}>
              Trades Academy Australia
            </p>
            <p style={{
              fontFamily:font, fontWeight:400, fontSize:13, color:'#9ca3af',
              margin:0, lineHeight:1.6,
            }}>
              Specializing in Australian Standards certification and trade skills assessment for international workers seeking skilled migration pathways.
            </p>
          </div>

          {/* Manage Course Catalog */}
          <button onClick={() => navigate('/trainer/courses')} style={{
            width:'100%', height:48,
            background:'#156dbf', color:'#fff',
            border:'none', borderRadius:12, cursor:'pointer',
            fontFamily:font, fontWeight:600, fontSize:15,
            boxShadow:'0 4px 12px rgba(21,109,191,0.22)',
            transition:'background 0.15s', marginTop:'auto',
          }}
            onMouseEnter={e => e.currentTarget.style.background='#1259a0'}
            onMouseLeave={e => e.currentTarget.style.background='#156dbf'}>
            Manage Course Catalog
          </button>
        </div>

        {/* ── RIGHT column ── */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:20 }}>

          {/* Active Courses card */}
          <div style={{
            flex:1,
            background:'#fff', borderRadius:20, padding:'24px 22px',
            boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
            display:'flex', flexDirection:'column', gap:14,
          }}>
            <div>
              <h3 style={{ fontFamily:font, fontWeight:700, fontSize:20, color:'#1e1e1e', margin:'0 0 4px' }}>
                Active Courses
              </h3>
              <p style={{ fontFamily:font, fontWeight:400, fontSize:15, color:'#6a7380', margin:0 }}>
                12 Courses Published
              </p>
            </div>

            {/* Progress bar */}
            <div style={{
              background:'#cccccc', borderRadius:8, height:12, overflow:'hidden',
            }}>
              <div style={{
                width:'36%', height:'100%',
                background:'#156dbf', borderRadius:8,
                transition:'width 0.6s ease',
              }}/>
            </div>

            {/* Add New Course */}
            <button onClick={() => navigate('/trainer/courses')} style={{
              width:'100%', height:46,
              background:'transparent',
              border:'1.5px solid #f26f37',
              borderRadius:12, cursor:'pointer',
              fontFamily:font, fontWeight:600, fontSize:15, color:'#f26f37',
              transition:'background 0.15s', marginTop:'auto',
            }}
              onMouseEnter={e => e.currentTarget.style.background='#fff5f0'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              + Add New Course
            </button>
          </div>

          {/* Waiting for student questions card */}
          <div style={{
            flex:1,
            background:'#fff', borderRadius:20, padding:'24px 22px',
            boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
            display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:12,
          }}>
            <img src={imgMailbox} alt="mailbox"
              style={{ width:130, height:'auto', display:'block' }}/>
            <p style={{
              fontFamily:font, fontWeight:600, fontSize:14, color:'#6a7380',
              textAlign:'center', margin:0, lineHeight:1.5,
            }}>
              Waiting for student questions
            </p>
            <button onClick={() => navigate('/trainer/inquiries')} style={{
              padding:'9px 28px',
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
