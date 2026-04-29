/**
 * WorkerHome — Dashboard Home screen for candidate/worker.
 * Matches Figma node 1-1316: welcome banner, profile card, documents card, EOIs card.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { WorkerLayout } from './WorkerLayout'
import { getToken, getMe, getMyDashboard } from '../../services/api'

const font = "'Urbanist', sans-serif"

/* ─── Greeting helper ─── */
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

/* ─── Circular progress ring ─── */
function CircularProgress({ pct = 75, size = 200, stroke = 12, photo, initials }) {
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)', position:'absolute', inset:0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e0dff0" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke="#5379f4" strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition:'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      {/* Photo / initials */}
      <div style={{
        position:'absolute',
        top: stroke + 8, left: stroke + 8,
        right: stroke + 8, bottom: stroke + 8,
        borderRadius:'50%', background:'#e8ecf0',
        display:'flex', alignItems:'center', justifyContent:'center',
        overflow:'hidden',
      }}>
        {photo
          ? <img src={photo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <span style={{ fontSize:32, fontWeight:700, color:'#5379f4' }}>{initials}</span>
        }
      </div>
      {/* Percentage badge */}
      <div style={{
        position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)',
        background:'#f26f37', color:'#fff', borderRadius:20,
        padding:'3px 12px', fontWeight:700, fontSize:15, fontFamily:font,
        boxShadow:'0 2px 8px rgba(242,111,55,0.3)',
      }}>{pct}%</div>
    </div>
  )
}

export function WorkerHome() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [dash, setDash] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) { navigate('/login', { replace:true }); return }
    Promise.all([getMe(token), getMyDashboard(token)])
      .then(([u, d]) => { setUser(u); setDash(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) return (
    <WorkerLayout user={user}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:400 }}>
        <div style={{ color:'#6a7380', fontFamily:font }}>Loading…</div>
      </div>
    </WorkerLayout>
  )

  const displayName = user?.full_name || user?.email?.split('@')[0] || 'Joshua'
  const firstName   = displayName.split(' ')[0]
  const initials    = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
  const docsUploaded = dash?.documents?.uploaded ?? 3
  const docsTotal    = 8
  const docsPct      = Math.round((docsUploaded / docsTotal) * 100)
  const eoiCount     = dash?.expressions_of_interest?.received ?? 0
  const profilePct   = 75  // TODO: compute from profile completeness

  return (
    <WorkerLayout user={user}>
      {/* ── Welcome banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #dde8f8 0%, #c8d8f5 40%, #e8d8f8 100%)',
        borderRadius:20, padding:'36px 48px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        marginBottom:24, overflow:'hidden', position:'relative', minHeight:160,
      }}>
        <div style={{ position:'relative', zIndex:2 }}>
          <h1 style={{
            fontFamily:font, fontSize:32, fontWeight:700, color:'#403c8b',
            margin:'0 0 10px', lineHeight:1.3,
          }}>
            {getGreeting()}, <span style={{ color:'#f26f37' }}>{firstName}</span>! 🚀
          </h1>
          <p style={{
            fontFamily:font, fontSize:20, fontWeight:600, color:'#1d15a7',
            margin:0, lineHeight:1.4, maxWidth:600,
          }}>
            Your profile is <span style={{ color:'#f26f37' }}>{profilePct}%</span> complete.{' '}
            Publish your profile to start appearing in employer searches!
          </p>
        </div>
        {/* Decorative circles */}
        <div style={{ position:'absolute', top:-40, right:-40, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.18)' }} />
        <div style={{ position:'absolute', bottom:-30, right:120, width:140, height:140, borderRadius:'50%', background:'rgba(83,121,244,0.12)' }} />
      </div>

      {/* ── Section title ── */}
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:'0 0 6px' }}>
          My Career Dashboard
        </h2>
        <p style={{ fontFamily:font, fontSize:16, color:'#6a7380', margin:0 }}>
          Your profile is almost ready! Finish the remaining steps to get noticed by Australian employers.
        </p>
      </div>

      {/* ── Cards row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>

        {/* ── Profile card ── */}
        <div style={{
          background:'#fff', borderRadius:20, padding:'32px 28px',
          display:'flex', flexDirection:'column', alignItems:'center', gap:16,
          boxShadow:'0 2px 16px rgba(0,0,0,0.05)',
        }}>
          <CircularProgress pct={profilePct} size={180} stroke={10} initials={initials} />

          {/* Badges */}
          <div style={{ display:'flex', gap:10 }}>
            <span style={{ background:'#403c8b', color:'#f1fdfd', borderRadius:12, padding:'4px 14px', fontSize:14, fontWeight:600, fontFamily:font }}>
              English: B2
            </span>
            <span style={{ background:'#403c8b', color:'#f1fdfd', borderRadius:12, padding:'4px 14px', fontSize:14, fontWeight:600, fontFamily:font }}>
              5+ Years Exp
            </span>
          </div>

          {/* Name */}
          <div style={{ textAlign:'center' }}>
            <p style={{ fontFamily:font, fontSize:22, fontWeight:700, color:'#1e1e1e', margin:'0 0 4px' }}>
              {displayName}
            </p>
            <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:0 }}>
              {user?.trade_type || 'Licensed Electrician (or selected trade).'}
            </p>
          </div>

          {/* Publish button */}
          <button
            onClick={() => navigate('/worker/profile')}
            style={{
              width:'100%', height:48, background:'#156dbf', color:'#fff',
              border:'none', borderRadius:12, cursor:'pointer',
              fontFamily:font, fontSize:16, fontWeight:600,
              boxShadow:'0 4px 12px rgba(21,109,191,0.25)',
              transition:'background 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='#1259a0' }}
            onMouseLeave={e => { e.currentTarget.style.background='#156dbf' }}
          >
            Publish Profile
          </button>
        </div>

        {/* ── Right column ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

          {/* Documents card */}
          <div style={{
            background:'#fff', borderRadius:20, padding:'28px 28px',
            boxShadow:'0 2px 16px rgba(0,0,0,0.05)',
          }}>
            <h3 style={{ fontFamily:font, fontSize:22, fontWeight:700, color:'#1e1e1e', margin:'0 0 6px' }}>
              My Documents
            </h3>
            <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', margin:'0 0 18px' }}>
              {docsUploaded}/{docsTotal} Documents Uploaded
            </p>

            {/* Progress bar */}
            <div style={{ background:'#ccc', borderRadius:8, height:12, marginBottom:20, overflow:'hidden' }}>
              <div style={{
                width:`${docsPct}%`, height:'100%',
                background:'#5379f4', borderRadius:8,
                transition:'width 0.6s ease',
              }} />
            </div>

            <button
              onClick={() => navigate('/worker/documents')}
              style={{
                width:'100%', height:48, background:'transparent',
                border:'1.5px solid #f26f37', borderRadius:12, cursor:'pointer',
                fontFamily:font, fontSize:15, fontWeight:600, color:'#f26f37',
                transition:'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='#fff5f0' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent' }}
            >
              Upload Documents
            </button>
          </div>

          {/* EOIs card */}
          <div style={{
            background:'#fff', borderRadius:20, padding:'28px 28px',
            boxShadow:'0 2px 16px rgba(0,0,0,0.05)',
            display:'flex', flexDirection:'column', alignItems:'center',
            flex:1, justifyContent:'center',
          }}>
            {eoiCount === 0 ? (
              <>
                {/* Mailbox illustration placeholder */}
                <div style={{
                  width:100, height:80, background:'linear-gradient(135deg, #f26f37 0%, #f4a261 100%)',
                  borderRadius:12, marginBottom:16, display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:36,
                }}>📬</div>
                <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', textAlign:'center', margin:0, maxWidth:260 }}>
                  Waiting for your first Expression of Interest (EOI).
                </p>
              </>
            ) : (
              <>
                <h3 style={{ fontFamily:font, fontSize:22, fontWeight:700, color:'#1e1e1e', margin:'0 0 8px' }}>
                  My EOIs
                </h3>
                <div style={{ fontFamily:font, fontSize:36, fontWeight:800, color:'#5379f4' }}>{eoiCount}</div>
                <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'4px 0 16px' }}>Expressions of Interest received</p>
                <button
                  onClick={() => navigate('/worker/eois')}
                  style={{
                    padding:'10px 24px', background:'#5379f4', color:'#fff',
                    border:'none', borderRadius:12, cursor:'pointer',
                    fontFamily:font, fontSize:14, fontWeight:600,
                  }}
                >View All EOIs</button>
              </>
            )}
          </div>
        </div>
      </div>
    </WorkerLayout>
  )
}
