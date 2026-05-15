/**
 * WorkerHome — Career Dashboard (Figma node 1-1316, file TBMfzE63R7DuhAN61xzpiZ)
 * All assets stored permanently in frontend/src/assets/worker-dashboard/
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { WorkerLayout } from './WorkerLayout'
import { getToken, getMe } from '../../services/api'

// ── Local permanent assets ──────────────────────────────────────────────────
import wdHeroBg      from '../../assets/worker-dashboard/wd-hero-bg.png'
import wdHeroIllus   from '../../assets/worker-dashboard/wd-hero-illus.png'
import wdEllipseRing from '../../assets/worker-dashboard/wd-ellipse-ring.png'
import wdDonut       from '../../assets/worker-dashboard/wd-donut.png'
import wdMailbox     from '../../assets/worker-dashboard/wd-mailbox.png'
import wdDeco1       from '../../assets/worker-dashboard/wd-deco1.png'
import wdDeco2       from '../../assets/worker-dashboard/wd-deco2.png'
import wdAvatar2     from '../../assets/worker-dashboard/wd-avatar2.png'

const font = "'Urbanist', sans-serif"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export function WorkerHome() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    getMe(token).then(u => setUser(u)).catch(() => {})
  }, [])

  const firstName = user?.full_name?.split(' ')[0] || 'Joshua'
  const fullName  = user?.full_name || 'Joshua Co'

  return (
    <WorkerLayout user={user}>

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
        position:'relative', borderRadius:32, overflow:'hidden',
        height:220, marginBottom:28, flexShrink:0,
      }}>
        <img src={wdHeroBg} alt=""
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display:'block' }}/>

        <div style={{
          position:'absolute', inset:0, padding:'32px 48px',
          display:'flex', flexDirection:'column', justifyContent:'center',
          zIndex:2, maxWidth:'60%',
        }}>
          <h1 style={{
            fontFamily:font, fontWeight:700, fontSize:28, lineHeight:1.4,
            color:'#403c8b', margin:'0 0 14px',
          }}>
            {getGreeting()},{' '}
            <span style={{ color:'#f26f37' }}>{firstName}</span>! 🚀
          </h1>
          <p style={{
            fontFamily:font, fontWeight:600, fontSize:17, lineHeight:1.5,
            color:'#1d15a7', margin:0,
          }}>
            Your profile is{' '}
            <span style={{ color:'#f26f37' }}>75%</span>
            {' '}complete. Publish your profile to start appearing in employer searches!
          </p>
        </div>

        <img src={wdHeroIllus} alt=""
          style={{
            position:'absolute', right:40, top:'50%',
            transform:'translateY(-50%)',
            height:196, width:'auto', display:'block', zIndex:2,
          }}/>
      </div>

      {/* ── Two-column cards ── */}
      <div style={{ display:'flex', gap:20, alignItems:'stretch' }}>

        {/* LEFT — profile card */}
        <div style={{
          flex:'0 0 360px',
          background:'#fff', borderRadius:20, padding:'32px 28px',
          boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
          display:'flex', flexDirection:'column', alignItems:'center', gap:16,
          position:'relative', overflow:'hidden',
        }}>
          {/* Decorative blobs */}
          <img src={wdDeco1} alt="" style={{
            position:'absolute', left:20, top:'38%',
            width:52, height:'auto', opacity:0.8, transform:'rotate(6deg)', pointerEvents:'none',
          }}/>
          <img src={wdDeco2} alt="" style={{
            position:'absolute', right:20, bottom:'25%',
            width:52, height:'auto', opacity:0.8, transform:'rotate(-160deg)', pointerEvents:'none',
          }}/>

          {/* Avatar ring + donut progress */}
          <div style={{ position:'relative', width:190, height:190, flexShrink:0, marginTop:8 }}>
            {/* Ellipse ring (background circle/avatar) */}
            <img src={wdEllipseRing} alt=""
              style={{ width:190, height:190, display:'block', borderRadius:'50%', objectFit:'cover' }}/>
            {/* Donut progress overlay */}
            <img src={wdDonut} alt=""
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}/>
            {/* 75% label */}
            <div style={{
              position:'absolute', bottom:6, left:'50%', transform:'translateX(-50%)',
              background:'#f26f37', color:'#fff', borderRadius:16,
              padding:'4px 16px', fontFamily:font, fontWeight:700, fontSize:14,
              whiteSpace:'nowrap', boxShadow:'0 2px 8px rgba(242,111,55,0.35)',
            }}>75%</div>
          </div>

          {/* Skill badges */}
          <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center' }}>
            {['English: B2', '5+ Years Exp'].map(tag => (
              <span key={tag} style={{
                background:'#403c8b', color:'#f1fdfd', borderRadius:13,
                padding:'5px 16px', fontFamily:font, fontWeight:600, fontSize:13,
              }}>{tag}</span>
            ))}
          </div>

          {/* Name + trade */}
          <div style={{ textAlign:'center' }}>
            <p style={{ fontFamily:font, fontWeight:700, fontSize:22, color:'#1e1e1e', margin:'0 0 4px' }}>{fullName}</p>
            <p style={{ fontFamily:font, fontWeight:500, fontSize:14, color:'#6a7380', margin:0, lineHeight:1.5 }}>
              Licensed Electrician
            </p>
          </div>

          <button onClick={() => navigate('/worker/profile')} style={{
            width:'100%', height:53, background:'#156dbf', color:'#fff',
            border:'none', borderRadius:12, cursor:'pointer',
            fontFamily:font, fontWeight:700, fontSize:16,
            boxShadow:'0 4px 12px rgba(21,109,191,0.22)',
            transition:'background 0.15s', marginTop:'auto',
          }}
            onMouseEnter={e => e.currentTarget.style.background='#1259a0'}
            onMouseLeave={e => e.currentTarget.style.background='#156dbf'}>
            Publish Profile
          </button>
        </div>

        {/* RIGHT column */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', gap:20, minWidth:0 }}>

          {/* My Documents card */}
          <div style={{
            flex:1, background:'#fff', borderRadius:20, padding:'28px 28px',
            boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
            display:'flex', flexDirection:'column', gap:16,
          }}>
            <div>
              <h3 style={{ fontFamily:font, fontWeight:700, fontSize:22, color:'#1e1e1e', margin:'0 0 4px' }}>My Documents</h3>
              <p style={{ fontFamily:font, fontWeight:500, fontSize:15, color:'#6a7380', margin:0 }}>3/8 Documents Uploaded</p>
            </div>
            {/* Progress bar — 3/8 ≈ 37.5% */}
            <div style={{ background:'#e0dff0', borderRadius:48, height:14, overflow:'hidden' }}>
              <div style={{ width:'37.5%', height:'100%', background:'#5379f4', borderRadius:48, transition:'width 0.6s ease' }}/>
            </div>
            <button onClick={() => navigate('/worker/documents')} style={{
              width:'100%', height:50, background:'transparent',
              border:'1.5px solid #f26f37', borderRadius:12, cursor:'pointer',
              fontFamily:font, fontWeight:700, fontSize:15, color:'#f26f37',
              transition:'background 0.15s', marginTop:'auto',
            }}
              onMouseEnter={e => e.currentTarget.style.background='#fff5f0'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              Upload Documents
            </button>
          </div>

          {/* EOI waiting card */}
          <div style={{
            flex:1, background:'#fff', borderRadius:20, padding:'28px 28px',
            boxShadow:'0 2px 16px rgba(0,0,0,0.06)',
            display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', gap:12,
          }}>
            <img src={wdMailbox} alt="mailbox" style={{ width:130, height:'auto', display:'block' }}/>
            <p style={{
              fontFamily:font, fontWeight:600, fontSize:15, color:'#6a7380',
              textAlign:'center', margin:0, lineHeight:1.5, maxWidth:280,
            }}>
              Waiting for your first Expression of Interest (EOI).
            </p>
            <button onClick={() => navigate('/worker/eois')} style={{
              height:44, padding:'0 28px', background:'transparent',
              border:'1.5px solid #5379f4', borderRadius:12, cursor:'pointer',
              fontFamily:font, fontWeight:700, fontSize:14, color:'#5379f4',
              transition:'background 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.background='#eef2ff'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              View EOIs
            </button>
          </div>

        </div>
      </div>

    </WorkerLayout>
  )
}
