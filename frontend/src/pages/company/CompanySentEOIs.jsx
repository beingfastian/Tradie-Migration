/**
 * CompanySentEOIs — Manage sent EOIs with chat panel.
 * Figma node 1-2469: split panel, tabs, conversation view.
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyLayout } from './CompanyLayout'
import { getToken, getMe, getMyCompany } from '../../services/api'
import { MOCK_COMPANY_USER, MOCK_COMPANY, MOCK_SENT_EOIS } from './companyMockData'

const font = "'Urbanist', sans-serif"

const TABS = ['All Sent EOIs', 'Responses Received', 'Interviews Scheduled', 'Archived']

const STATUS_COLORS = {
  'Sponsorship Offered': '#f26f37',
  'Interview: Pending':  '#f26f37',
  'Interview Scheduled': '#5379f4',
}

function Avatar({ name, size=36 }) {
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
  const colors = ['#5379f4','#f26f37','#129578','#403c8b']
  const bg = colors[(name || '').charCodeAt(0) % colors.length]
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:size*0.38, fontFamily:font, flexShrink:0 }}>
      {initials}
    </div>
  )
}

function StarIcon({ filled, onClick }) {
  return (
    <svg onClick={onClick} width="18" height="18" viewBox="0 0 24 24"
      fill={filled ? '#f4a261' : 'none'} stroke={filled ? '#f4a261' : '#d0d5dd'} strokeWidth="1.8" style={{ cursor:'pointer', flexShrink:0 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

const MOCK_MESSAGES = [
  { id:1, from:'me', text:"Hi Joshua, we've reviewed your trade qualifications for our Sydney project. Are you available for a technical interview next Tuesday?", time:'04:45 PM' },
  { id:2, from:'candidate', text:"es, I am available. I have also uploaded my latest skills assessment for your review.", time:'04:45 PM' },
  { id:3, from:'me', text:"Hi Joshua, we've reviewed your trade qualifications for our Sydney project. Are you available for a technical interview next Tuesday?", time:'04:45 PM' },
  { id:4, from:'candidate', text:"es, I am available. I have also uploaded my latest skills assessment for your review.", time:'04:45 PM' },
]

export function CompanySentEOIs() {
  const navigate  = useNavigate()
  const [user, setUser]       = useState(null)
  const [company, setCompany] = useState(null)
  const [eois, setEois]       = useState([])
  const [tab, setTab]         = useState('All Sent EOIs')
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [starred, setStarred] = useState({})
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [reply, setReply]     = useState('')
  const messagesEndRef        = useRef(null)

  useEffect(() => {
    const token = getToken()
    if (!token) { setUser(MOCK_COMPANY_USER); setCompany(MOCK_COMPANY); setEois(MOCK_SENT_EOIS); setSelected(MOCK_SENT_EOIS[0]); return }
    Promise.all([getMe(token), getMyCompany(token).catch(() => null)])
      .then(([u, c]) => { setUser(u); setCompany(c || MOCK_COMPANY); setEois(MOCK_SENT_EOIS); setSelected(MOCK_SENT_EOIS[0]) })
      .catch(() => { setUser(MOCK_COMPANY_USER); setCompany(MOCK_COMPANY); setEois(MOCK_SENT_EOIS); setSelected(MOCK_SENT_EOIS[0]) })
  }, [])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  function sendReply() {
    if (!reply.trim()) return
    setMessages(prev => [...prev, { id:Date.now(), from:'me', text:reply.trim(), time:new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) }])
    setReply('')
  }

  const filtered = eois.filter(e => {
    const q = search.toLowerCase()
    return !q || (e.candidate_name || '').toLowerCase().includes(q)
  })

  const selName = selected?.candidate_name?.split(' - ')[0] || 'Joshua Co'
  const selRole = selected?.candidate_name?.split(' - ')[1] || 'Senior Industrial Electrician'

  return (
    <CompanyLayout user={user} company={company}>
      <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:'0 0 6px' }}>Manage Sent EOIs</h2>
      <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'0 0 20px' }}>Track your communication with candidates and manage technical interview schedules.</p>

      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 16px rgba(0,0,0,0.05)', overflow:'hidden', display:'flex', flexDirection:'column', minHeight:540 }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:4, padding:'16px 24px 0', borderBottom:'1px solid #f0f0f4' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding:'10px 18px', border:'none', cursor:'pointer', borderRadius:'8px 8px 0 0', fontFamily:font, fontSize:13, fontWeight: t===tab ? 700 : 500, background: t===tab ? '#5379f4' : 'transparent', color: t===tab ? '#fff' : '#6a7380', transition:'all 0.15s' }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', flex:1, minHeight:0 }}>
          {/* Left: EOI list */}
          <div style={{ width:320, flexShrink:0, borderRight:'1px solid #f0f0f4', display:'flex', flexDirection:'column' }}>
            <div style={{ padding:'16px 16px 12px', borderBottom:'1px solid #f0f0f4' }}>
              <p style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#1e1e1e', margin:'0 0 12px' }}>All EOIs</p>
              <div style={{ display:'flex', alignItems:'center', gap:8, border:'1px solid #d0d5dd', borderRadius:10, padding:'8px 14px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)}
                  style={{ border:'none', outline:'none', fontFamily:font, fontSize:14, color:'#343434', background:'transparent', flex:1 }}/>
              </div>
            </div>

            <div style={{ overflowY:'auto', flex:1 }}>
              {filtered.map(eoi => {
                const isSel = selected?.id === eoi.id
                const labelColor = STATUS_COLORS[eoi.status] || '#f26f37'
                return (
                  <div key={eoi.id} onClick={() => setSelected(eoi)}
                    style={{ padding:'14px 16px', cursor:'pointer', background: isSel ? '#f3f1fd' : 'transparent', borderBottom:'1px solid #f8f8fc', display:'flex', alignItems:'flex-start', gap:12, transition:'background 0.12s' }}
                    onMouseEnter={e => { if (!isSel) e.currentTarget.style.background='#fafafa' }}
                    onMouseLeave={e => { if (!isSel) e.currentTarget.style.background='transparent' }}>
                    <Avatar name={eoi.candidate_name} />
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                        <p style={{ fontFamily:font, fontSize:13, fontWeight:700, color:'#1e1e1e', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>
                          {eoi.candidate_name}
                        </p>
                        <StarIcon filled={!!starred[eoi.id]} onClick={ev => { ev.stopPropagation(); setStarred(s => ({ ...s, [eoi.id]: !s[eoi.id] })) }}/>
                      </div>
                      <p style={{ fontFamily:font, fontSize:12, color:'#6a7380', margin:'0 0 4px' }}>{eoi.sub}</p>
                      <span style={{ fontFamily:font, fontSize:12, fontWeight:600, color:labelColor }}>{eoi.status}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right: Chat */}
          {selected ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
              {/* Chat header */}
              <div style={{ padding:'16px 24px', borderBottom:'1px solid #f0f0f4', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <Avatar name={selName} size={40}/>
                  <div>
                    <p style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#1e1e1e', margin:0 }}>Chat with {selName}</p>
                    <p style={{ fontFamily:font, fontSize:12, color:'#6a7380', margin:0 }}>{selRole}</p>
                  </div>
                  {/* Block icon */}
                  <div style={{ width:28, height:28, borderRadius:'50%', border:'1.5px solid #e53e3e', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', marginLeft:4 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  {[
                    <svg key="r" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="1.8" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
                    <StarIcon key="s" filled={!!starred[selected?.id]} onClick={() => setStarred(s => ({ ...s, [selected?.id]: !s[selected?.id] }))}/>,
                    <svg key="c" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
                    <svg key="m" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
                  ].map((icon, i) => <div key={i} style={{ cursor:'pointer' }}>{icon}</div>)}
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ flex:1, height:1, background:'#f0f0f4' }}/>
                  <span style={{ fontFamily:font, fontSize:12, color:'#9ca3af', background:'#e8ecff', borderRadius:20, padding:'2px 12px' }}>Today</span>
                  <div style={{ flex:1, height:1, background:'#f0f0f4' }}/>
                </div>
                {messages.map(msg => (
                  <div key={msg.id} style={{ display:'flex', justifyContent: msg.from==='me' ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth:'65%' }}>
                      <div style={{ background: msg.from==='me' ? '#f3f1fd' : '#5379f4', color: msg.from==='me' ? '#1e1e1e' : '#fff', borderRadius: msg.from==='me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding:'12px 16px', fontFamily:font, fontSize:14, lineHeight:1.5 }}>
                        {msg.text}
                      </div>
                      <p style={{ fontFamily:font, fontSize:11, color:'#9ca3af', margin:'4px 0 0', textAlign: msg.from==='me' ? 'right' : 'left' }}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}/>
              </div>

              {/* Verified notice */}
              <div style={{ background:'#e8f5e9', padding:'10px 24px' }}>
                <p style={{ fontFamily:font, fontSize:12, color:'#2e7d32', margin:0, textAlign:'center' }}>
                  This candidate is trade-verified. You can securely view their uploaded certifications in the Profile tab.
                </p>
              </div>

              {/* Reply */}
              <div style={{ padding:'12px 24px', borderTop:'1px solid #f0f0f4', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'#f3f1fd', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5379f4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </div>
                <input placeholder={`Write a message to ${selName}..`} value={reply} onChange={e => setReply(e.target.value)}
                  onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                  style={{ flex:1, border:'none', outline:'none', fontFamily:font, fontSize:14, color:'#343434', background:'transparent' }}/>
                <button onClick={sendReply} style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', alignItems:'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#5379f4"><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/></svg>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <p style={{ fontFamily:font, fontSize:15, color:'#9ca3af' }}>Select an EOI to view the conversation.</p>
            </div>
          )}
        </div>
      </div>
    </CompanyLayout>
  )
}
