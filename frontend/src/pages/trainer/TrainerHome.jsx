/**
 * TrainerHome — Education Provider dashboard home.
 * Figma node 1-1859.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrainerLayout } from './TrainerLayout'
import { getToken, getMe } from '../../services/api'
import { MOCK_TRAINER_USER, MOCK_PROVIDER } from './trainerMockData'

const font = "'Urbanist', sans-serif"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

/* Education banner illustration */
function EduIllus() {
  return (
    <svg width="280" height="150" viewBox="0 0 280 150" fill="none" style={{ flexShrink:0 }}>
      {/* Books stack */}
      <rect x="80" y="50" width="60" height="12" rx="3" fill="#f26f37" opacity="0.9"/>
      <rect x="76" y="62" width="68" height="12" rx="3" fill="#5379f4" opacity="0.9"/>
      <rect x="72" y="74" width="76" height="12" rx="3" fill="#f4a261" opacity="0.9"/>
      {/* Envelope */}
      <rect x="160" y="40" width="70" height="52" rx="6" fill="#fff" stroke="#5379f4" strokeWidth="2"/>
      <path d="M160 46 L195 68 L230 46" stroke="#5379f4" strokeWidth="2" fill="none"/>
      <rect x="175" y="58" width="40" height="6" rx="2" fill="#f26f37" opacity="0.7"/>
      {/* Person 1 - sitting */}
      <circle cx="40" cy="85" r="12" fill="#5379f4"/>
      <rect x="32" y="97" width="16" height="22" rx="4" fill="#5379f4"/>
      <line x1="32" y1="107" x2="22" y2="118" stroke="#5379f4" strokeWidth="3" strokeLinecap="round"/>
      <line x1="48" y1="107" x2="58" y2="118" stroke="#5379f4" strokeWidth="3" strokeLinecap="round"/>
      <line x1="34" y1="119" x2="30" y2="135" stroke="#5379f4" strokeWidth="3" strokeLinecap="round"/>
      <line x1="46" y1="119" x2="50" y2="135" stroke="#5379f4" strokeWidth="3" strokeLinecap="round"/>
      {/* Person 2 - standing */}
      <circle cx="245" cy="72" r="12" fill="#1a2340"/>
      <rect x="237" y="84" width="16" height="26" rx="4" fill="#1a2340"/>
      <line x1="237" y1="94" x2="226" y2="104" stroke="#1a2340" strokeWidth="3" strokeLinecap="round"/>
      <line x1="253" y1="94" x2="264" y2="104" stroke="#1a2340" strokeWidth="3" strokeLinecap="round"/>
      <line x1="239" y1="110" x2="235" y2="130" stroke="#1a2340" strokeWidth="3" strokeLinecap="round"/>
      <line x1="251" y1="110" x2="255" y2="130" stroke="#1a2340" strokeWidth="3" strokeLinecap="round"/>
      {/* Dots decoration */}
      {[0,1,2].map(i=><circle key={i} cx={185+i*12} cy={20} r="4" fill="#f26f37" opacity="0.6"/>)}
      <line x1="160" y1="25" x2="185" y2="25" stroke="#1a2340" strokeWidth="2" opacity="0.4"/>
      <line x1="215" y1="25" x2="240" y2="25" stroke="#1a2340" strokeWidth="2" opacity="0.4"/>
    </svg>
  )
}

export function TrainerHome() {
  const navigate = useNavigate()
  const [user, setUser]       = useState(null)
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) { setUser(MOCK_TRAINER_USER); setProvider(MOCK_PROVIDER); setLoading(false); return }
    getMe(token)
      .then(u => { setUser(u); setProvider(MOCK_PROVIDER) })
      .catch(() => { setUser(MOCK_TRAINER_USER); setProvider(MOCK_PROVIDER) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <TrainerLayout user={MOCK_TRAINER_USER} provider={MOCK_PROVIDER}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:400 }}>
        <p style={{ fontFamily:font, color:'#6a7380' }}>Loading…</p>
      </div>
    </TrainerLayout>
  )

  const prov = provider || MOCK_PROVIDER
  const provName    = prov.institution_name || 'Trades Academy Australia'
  const activeCourses = prov.active_courses ?? 12
  const profilePct  = prov.profile_pct ?? 98
  const firstName   = user?.full_name?.split(' ')[0] || 'John'
  const initials    = provName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)

  return (
    <TrainerLayout user={user} provider={prov}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:font, fontSize:26, fontWeight:700, color:'#1e1e1e', margin:'0 0 4px' }}>Education Provider Overview</h2>
        <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:0 }}>Manage your training programs and track student enrollment progress.</p>
      </div>

      {/* Welcome Banner */}
      <div style={{ background:'linear-gradient(135deg, #c8d8f5 0%, #dde8f8 50%, #e0d8f8 100%)', borderRadius:20, padding:'32px 40px', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'space-between', overflow:'hidden', position:'relative', minHeight:140 }}>
        <div style={{ position:'relative', zIndex:2, maxWidth:520 }}>
          <h1 style={{ fontFamily:font, fontSize:28, fontWeight:800, color:'#1d15a7', margin:'0 0 10px', lineHeight:1.3 }}>
            {getGreeting()}, <span style={{ color:'#f26f37' }}>{firstName} Smith</span>! 🚀
          </h1>
          <p style={{ fontFamily:font, fontSize:18, fontWeight:600, color:'#1d15a7', margin:0, lineHeight:1.5 }}>
            Your institution is active. You have 5 new enrollment inquiries waiting for review.
          </p>
        </div>
        <div style={{ position:'relative', zIndex:2 }}><EduIllus/></div>
        <div style={{ position:'absolute', top:-40, right:-40, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.18)' }}/>
      </div>

      {/* Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>

        {/* Provider profile card */}
        <div style={{ background:'#fff', borderRadius:20, padding:'36px 28px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
          {/* Circular progress with photo */}
          <div style={{ position:'relative', width:160, height:160, flexShrink:0 }}>
            {(() => {
              const size=160, stroke=10, r=(size-stroke)/2, circ=2*Math.PI*r, offset=circ-(profilePct/100)*circ
              return (
                <>
                  <svg width={size} height={size} style={{ transform:'rotate(-90deg)', position:'absolute', inset:0 }}>
                    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e0dff0" strokeWidth={stroke}/>
                    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#5379f4" strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" style={{ transition:'stroke-dashoffset 0.6s ease' }}/>
                  </svg>
                  <div style={{ position:'absolute', top:stroke+8, left:stroke+8, right:stroke+8, bottom:stroke+8, borderRadius:'50%', background:'#e8ecf0', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                    <span style={{ fontSize:28, fontWeight:700, color:'#5379f4' }}>{initials}</span>
                  </div>
                  <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', background:'#f26f37', color:'#fff', borderRadius:20, padding:'2px 10px', fontWeight:700, fontSize:13, fontFamily:font, whiteSpace:'nowrap' }}>{profilePct}%</div>
                </>
              )
            })()}
          </div>

          {/* Badges */}
          <div style={{ display:'flex', gap:10 }}>
            <span style={{ background:'#403c8b', color:'#f1fdfd', borderRadius:12, padding:'4px 14px', fontSize:13, fontWeight:600, fontFamily:font }}>RTO: #{prov.rto_code||'12345'}</span>
            <span style={{ background:'#403c8b', color:'#f1fdfd', borderRadius:12, padding:'4px 14px', fontSize:13, fontWeight:600, fontFamily:font }}>10+ Courses</span>
          </div>

          <div style={{ textAlign:'center' }}>
            <p style={{ fontFamily:font, fontSize:20, fontWeight:800, color:'#1e1e1e', margin:'0 0 4px' }}>{provName}</p>
            <p style={{ fontFamily:font, fontSize:13, color:'#9ca3af', margin:0, maxWidth:280 }}>
              {prov.description?.slice(0,100) || 'Specializing in Australian Standards certification and trade skills assessment for international workers.'}
              {(prov.description?.length||0)>100?'…':''}
            </p>
          </div>

          <button onClick={()=>navigate('/trainer/courses')} style={{ width:'100%', height:48, background:'#156dbf', color:'#fff', border:'none', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:15, fontWeight:600, boxShadow:'0 4px 12px rgba(21,109,191,0.2)' }}
            onMouseEnter={e=>e.currentTarget.style.background='#1259a0'} onMouseLeave={e=>e.currentTarget.style.background='#156dbf'}>
            Manage Course Catalog
          </button>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          {/* Active Courses card */}
          <div style={{ background:'#fff', borderRadius:20, padding:'28px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#1e1e1e', margin:'0 0 6px' }}>Active Courses</h3>
            <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'0 0 16px' }}>{activeCourses} Courses Published</p>
            <div style={{ background:'#e0dff0', borderRadius:8, height:12, marginBottom:20, overflow:'hidden' }}>
              <div style={{ width:`${Math.min((activeCourses/20)*100,100)}%`, height:'100%', background:'#5379f4', borderRadius:8, transition:'width 0.6s ease' }}/>
            </div>
            <button onClick={()=>navigate('/trainer/courses')} style={{ width:'100%', height:44, background:'transparent', border:'1.5px solid #f26f37', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:14, fontWeight:600, color:'#f26f37' }}
              onMouseEnter={e=>e.currentTarget.style.background='#fff5f0'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
              + Add New Course
            </button>
          </div>

          {/* Inquiry waiting state */}
          <div style={{ background:'#fff', borderRadius:20, padding:'28px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)', flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
            <div style={{ width:100, height:80, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
                <rect x="10" y="25" width="45" height="35" rx="4" fill="#e8f0ff" stroke="#5379f4" strokeWidth="1.5"/>
                <rect x="30" y="15" width="5" height="20" fill="#5379f4" rx="2"/>
                <rect x="22" y="10" width="20" height="14" rx="3" fill="#5379f4"/>
                <rect x="55" y="30" width="18" height="25" rx="3" fill="#f26f37"/>
                <rect x="58" y="28" width="12" height="4" rx="1" fill="#f4a261"/>
                <circle cx="64" cy="35" r="2" fill="#fff"/>
                <path d="M15 35 L32 46 L50 35" stroke="#5379f4" strokeWidth="1.5" fill="none"/>
                <ellipse cx="8" cy="58" rx="8" ry="5" fill="#129578" opacity="0.7"/>
                <ellipse cx="72" cy="58" rx="8" ry="5" fill="#129578" opacity="0.7"/>
              </svg>
            </div>
            <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', textAlign:'center', margin:0, maxWidth:220 }}>
              Waiting for student questions
            </p>
            <button onClick={()=>navigate('/trainer/inquiries')} style={{ padding:'8px 24px', background:'#5379f4', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontFamily:font, fontSize:13, fontWeight:600 }}>
              View Inquiries
            </button>
          </div>
        </div>
      </div>
    </TrainerLayout>
  )
}
