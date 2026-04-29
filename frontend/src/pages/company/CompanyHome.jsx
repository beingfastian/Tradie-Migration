/**
 * CompanyHome — Employer dashboard home.
 * Figma node 1-1559: Company Overview, welcome banner, company card, Active Job Roles card.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyLayout } from './CompanyLayout'
import { getToken, getMe, getMyCompany } from '../../services/api'
import { MOCK_COMPANY_USER, MOCK_COMPANY } from './companyMockData'

const font = "'Urbanist', sans-serif"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

/* City skyline SVG illustration */
function SkylineIllus() {
  return (
    <svg width="260" height="140" viewBox="0 0 260 140" fill="none" style={{ flexShrink:0 }}>
      {/* Buildings */}
      <rect x="10" y="60" width="30" height="80" fill="#2d3561" rx="2"/>
      <rect x="15" y="40" width="20" height="20" fill="#2d3561" rx="1"/>
      <rect x="50" y="30" width="40" height="110" fill="#1a2340" rx="2"/>
      <rect x="100" y="50" width="35" height="90" fill="#2d3561" rx="2"/>
      <rect x="145" y="20" width="45" height="120" fill="#1a2340" rx="2"/>
      <rect x="200" y="45" width="30" height="95" fill="#2d3561" rx="2"/>
      <rect x="235" y="35" width="25" height="105" fill="#1a2340" rx="2"/>
      {/* Windows */}
      {[55,65,75,85].map(x => [35,45,55,65,75].map(y => <rect key={`${x}-${y}`} x={x} y={y} width="6" height="5" fill="#f26f37" rx="1"/>))}
      {[150,160,170,180].map(x => [25,35,45,55,65,75].map(y => <rect key={`${x}-${y}`} x={x} y={y} width="7" height="5" fill="#f8b400" rx="1"/>))}
      {/* Person */}
      <circle cx="185" cy="88" r="8" fill="#5379f4"/>
      <rect x="181" y="96" width="8" height="16" fill="#5379f4" rx="2"/>
      <line x1="181" y1="102" x2="175" y2="110" stroke="#5379f4" strokeWidth="2" strokeLinecap="round"/>
      <line x1="189" y1="102" x2="195" y2="110" stroke="#5379f4" strokeWidth="2" strokeLinecap="round"/>
      <line x1="181" y1="112" x2="179" y2="125" stroke="#5379f4" strokeWidth="2" strokeLinecap="round"/>
      <line x1="189" y1="112" x2="191" y2="125" stroke="#5379f4" strokeWidth="2" strokeLinecap="round"/>
      {/* Sun/moon */}
      <circle cx="230" cy="18" r="14" fill="#f4a261" opacity="0.8"/>
      {/* Birds */}
      <path d="M60 15 Q65 10 70 15" stroke="#403c8b" strokeWidth="1.5" fill="none"/>
      <path d="M75 8 Q80 3 85 8" stroke="#403c8b" strokeWidth="1.5" fill="none"/>
    </svg>
  )
}

/* Verified shield icon */
function VerifiedBadge() {
  return (
    <div style={{ position:'absolute', bottom:-10, left:'50%', transform:'translateX(-50%)', background:'#f26f37', color:'#fff', borderRadius:20, padding:'4px 16px', fontFamily:font, fontSize:13, fontWeight:700, whiteSpace:'nowrap' }}>
      Verified
    </div>
  )
}

/* Company logo placeholder */
function CompanyLogo({ name }) {
  const initials = (name || 'A').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
  return (
    <div style={{ width:80, height:80, borderRadius:'50%', background:'#1a2340', display:'flex', alignItems:'center', justifyContent:'center', color:'#f4a261', fontWeight:800, fontSize:22, fontFamily:font }}>
      {initials}
    </div>
  )
}

export function CompanyHome() {
  const navigate = useNavigate()
  const [user, setUser]       = useState(null)
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) { setUser(MOCK_COMPANY_USER); setCompany(MOCK_COMPANY); setLoading(false); return }
    Promise.all([getMe(token), getMyCompany(token).catch(() => null)])
      .then(([u, c]) => { setUser(u); setCompany(c || MOCK_COMPANY) })
      .catch(() => { setUser(MOCK_COMPANY_USER); setCompany(MOCK_COMPANY) })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <CompanyLayout user={MOCK_COMPANY_USER} company={MOCK_COMPANY}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:400 }}>
        <p style={{ fontFamily:font, color:'#6a7380' }}>Loading…</p>
      </div>
    </CompanyLayout>
  )

  const co = company || MOCK_COMPANY
  const rolesFilled = co.roles_filled ?? 3
  const rolesTotal  = co.roles_total  ?? 5
  const rolesPct    = Math.round((rolesFilled / rolesTotal) * 100)
  const isVerified  = co.verification_status === 'approved'
  const coName      = co.company_name || 'Acme Electrical Pty Ltd'

  return (
    <CompanyLayout user={user} company={co}>
      {/* Header */}
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:font, fontSize:26, fontWeight:700, color:'#1e1e1e', margin:'0 0 4px' }}>Company Overview</h2>
        <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:0 }}>Manage your active job listings and track candidate expressions of interest.</p>
      </div>

      {/* Welcome Banner */}
      <div style={{
        background:'linear-gradient(135deg, #c8d8f5 0%, #dde8f8 50%, #e0d8f8 100%)',
        borderRadius:20, padding:'32px 40px', marginBottom:24,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        overflow:'hidden', position:'relative', minHeight:140,
      }}>
        <div style={{ position:'relative', zIndex:2 }}>
          <h1 style={{ fontFamily:font, fontSize:28, fontWeight:800, color:'#1d15a7', margin:'0 0 10px', lineHeight:1.3 }}>
            {getGreeting()}, <span style={{ color:'#f26f37' }}>{coName}</span>! 🚀
          </h1>
          <p style={{ fontFamily:font, fontSize:18, fontWeight:600, color:'#1d15a7', margin:0, lineHeight:1.5, maxWidth:520 }}>
            {isVerified
              ? `Your company is verified. You have ${rolesFilled} active job roles appearing in candidate searches.`
              : 'Your company profile is pending verification. Complete your profile to start hiring.'}
          </p>
        </div>
        <div style={{ position:'relative', zIndex:2 }}>
          <SkylineIllus />
        </div>
        <div style={{ position:'absolute', top:-40, right:-40, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.18)' }}/>
      </div>

      {/* Cards Row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>

        {/* Company profile card */}
        <div style={{ background:'#fff', borderRadius:20, padding:'36px 28px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
          {/* Logo ring */}
          <div style={{ position:'relative', marginBottom:8 }}>
            <div style={{ width:140, height:140, borderRadius:'50%', border:'6px solid #e0dff0', display:'flex', alignItems:'center', justifyContent:'center', background:'#f6f6f9', position:'relative' }}>
              {/* Shield decorative */}
              <div style={{ position:'absolute', top:-8, left:-8, width:44, height:44 }}>
                <svg viewBox="0 0 44 44" fill="none" width="44" height="44">
                  <path d="M22 4L6 10v12c0 10 7 18.5 16 21 9-2.5 16-11 16-21V10L22 4z" fill="#5379f4" opacity="0.8"/>
                  <path d="M14 22l5 5 11-11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <CompanyLogo name={coName}/>
            </div>
            <VerifiedBadge />
          </div>

          {/* Badges */}
          <div style={{ display:'flex', gap:10, marginTop:16 }}>
            <span style={{ background:'#403c8b', color:'#f1fdfd', borderRadius:12, padding:'4px 14px', fontSize:13, fontWeight:600, fontFamily:font }}>
              {co.is_approved_sponsor ? 'Standard Sponsor' : 'Direct Hire'}
            </span>
            <span style={{ background:'#403c8b', color:'#f1fdfd', borderRadius:12, padding:'4px 14px', fontSize:13, fontWeight:600, fontFamily:font }}>
              ABN Verified
            </span>
          </div>

          <div style={{ textAlign:'center' }}>
            <p style={{ fontFamily:font, fontSize:20, fontWeight:800, color:'#1e1e1e', margin:'0 0 4px' }}>{coName}</p>
            <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'0 0 6px' }}>{co.trade_type || 'Licensed Electrical Contractor & Sponsor'}</p>
            {co.description && (
              <p style={{ fontFamily:font, fontSize:13, color:'#9ca3af', margin:0, maxWidth:280 }}>
                {co.description.slice(0,80)}{co.description.length > 80 ? '…' : ''}
              </p>
            )}
          </div>

          <button
            onClick={() => navigate('/company/profile')}
            style={{ width:'100%', height:48, background:'#156dbf', color:'#fff', border:'none', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:15, fontWeight:600, boxShadow:'0 4px 12px rgba(21,109,191,0.2)' }}
            onMouseEnter={e => e.currentTarget.style.background='#1259a0'}
            onMouseLeave={e => e.currentTarget.style.background='#156dbf'}
          >
            Manage Business Profile
          </button>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

          {/* Active Job Roles card */}
          <div style={{ background:'#fff', borderRadius:20, padding:'28px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#1e1e1e', margin:'0 0 6px' }}>Active Job Roles</h3>
            <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'0 0 16px' }}>{rolesFilled}/{rolesTotal} Roles Filled</p>
            <div style={{ background:'#e0dff0', borderRadius:8, height:12, marginBottom:20, overflow:'hidden' }}>
              <div style={{ width:`${rolesPct}%`, height:'100%', background:'#5379f4', borderRadius:8, transition:'width 0.6s ease' }}/>
            </div>
            <button
              onClick={() => navigate('/company/jobs')}
              style={{ width:'100%', height:44, background:'transparent', border:'1.5px solid #f26f37', borderRadius:12, cursor:'pointer', fontFamily:font, fontSize:14, fontWeight:600, color:'#f26f37' }}
              onMouseEnter={e => e.currentTarget.style.background='#fff5f0'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}
            >
              Post New Role
            </button>
          </div>

          {/* Sent EOIs waiting state */}
          <div style={{ background:'#fff', borderRadius:20, padding:'28px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)', flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
            {/* Mailbox illustration */}
            <div style={{ width:100, height:80, position:'relative', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="80" height="70" viewBox="0 0 80 70" fill="none">
                <rect x="10" y="25" width="45" height="35" rx="4" fill="#e8f0ff" stroke="#5379f4" strokeWidth="1.5"/>
                <rect x="30" y="15" width="5" height="20" fill="#5379f4" rx="2"/>
                <rect x="22" y="10" width="20" height="14" rx="3" fill="#5379f4"/>
                <rect x="55" y="30" width="18" height="25" rx="3" fill="#f26f37"/>
                <rect x="58" y="28" width="12" height="4" rx="1" fill="#f4a261"/>
                <circle cx="64" cy="35" r="2" fill="#fff"/>
                <path d="M15 35 L32 46 L50 35" stroke="#5379f4" strokeWidth="1.5" fill="none"/>
                {/* leaves */}
                <ellipse cx="8" cy="58" rx="8" ry="5" fill="#129578" opacity="0.7"/>
                <ellipse cx="72" cy="58" rx="8" ry="5" fill="#129578" opacity="0.7"/>
              </svg>
            </div>
            <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', textAlign:'center', margin:0, maxWidth:220 }}>
              Waiting for candidate responses to your sent EOIs.
            </p>
            <button
              onClick={() => navigate('/company/eois')}
              style={{ padding:'8px 24px', background:'#5379f4', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontFamily:font, fontSize:13, fontWeight:600 }}
            >
              View Sent EOIs
            </button>
          </div>
        </div>
      </div>
    </CompanyLayout>
  )
}
