/**
 * CompanySentEOIs — Manage Sent EOIs page.
 * Split-panel: left list, right chat. Tabs: All Sent EOIs / Responses Received /
 * Interviews Scheduled / Archived. Matches PDF design exactly.
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyLayout } from './CompanyLayout'
import { getToken, getMe } from '../../services/api'

const font = "'Urbanist', sans-serif"

/* ── Mock EOI list ── */
const MOCK_EOIS = [
  { id:'1', candidateName:'Joshua Co - Electrician',  subject:'Re: Senior Role - Sydney',   tag:'Sponsorship Offered', starred:false, status:'Sponsorship Offered' },
  { id:'2', candidateName:'Samuel R. - Solar Tech',   subject:'Technical interview pending', tag:'Interview: Pending',   starred:true,  status:'Interview: Pending'  },
  { id:'3', candidateName:'Joshua Co - Electrician',  subject:'Re: Senior Role - Sydney',   tag:'Sponsorship Offered', starred:false, status:'Sponsorship Offered' },
  { id:'4', candidateName:'Joshua Co - Electrician',  subject:'Re: Senior Role - Sydney',   tag:'Sponsorship Offered', starred:false, status:'Sponsorship Offered' },
  { id:'5', candidateName:'Joshua Co - Electrician',  subject:'Re: Senior Role - Sydney',   tag:'Sponsorship Offered', starred:false, status:'Sponsorship Offered' },
  { id:'6', candidateName:'Joshua Co - Electrician',  subject:'Re: Senior Role - Sydney',   tag:'Sponsorship Offered', starred:false, status:'Sponsorship Offered' },
]

const TAG_COLORS = {
  'Sponsorship Offered': '#f26f37',
  'Interview: Pending':  '#f26f37',
  'Interview Scheduled': '#5379f4',
}

const TABS = ['All Sent EOIs', 'Responses Received', 'Interviews Scheduled', 'Archived']

function getMockMessages(eoiId) {
  return [
    { id:1, from:'employer', text:"Hi Joshua, we've reviewed your trade qualifications for our Sydney project. Are you available for a technical interview next Tuesday?", time:'04:45 PM' },
    { id:2, from:'candidate', text:"es. I am available. I have also uploaded my latest skills assessment for your review.", time:'04:45 PM' },
    { id:3, from:'employer', text:"Hi Joshua, we've reviewed your trade qualifications for our Sydney project. Are you available for a technical interview next Tuesday?", time:'04:45 PM' },
    { id:4, from:'candidate', text:"es. I am available. I have also uploaded my latest skills assessment for your review.", time:'04:45 PM' },
  ]
}

function Avatar({ name, size=38 }) {
  const initials = (name||'U').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
  const colors = ['#5379f4','#f26f37','#129578','#403c8b','#156dbf']
  const bg = colors[(name||'').charCodeAt(0)%colors.length]
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:bg, display:'flex',
      alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700,
      fontSize:size*0.36, fontFamily:font, flexShrink:0 }}>
      {initials}
    </div>
  )
}

function StarIcon({ filled, onClick }) {
  return (
    <svg onClick={e=>{e.stopPropagation();onClick()}} width="18" height="18" viewBox="0 0 24 24"
      fill={filled?'#f4a261':'none'} stroke={filled?'#f4a261':'#d0d5dd'}
      strokeWidth="1.8" style={{ cursor:'pointer', flexShrink:0 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

export function CompanySentEOIs() {
  const navigate = useNavigate()
  const bottomRef = useRef(null)

  const [user,     setUser]     = useState(null)
  const [eois,     setEois]     = useState(MOCK_EOIS)
  const [tab,      setTab]      = useState('All Sent EOIs')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(MOCK_EOIS[0])
  const [messages, setMessages] = useState(getMockMessages('1'))
  const [starred,  setStarred]  = useState({ '2': true })
  const [reply,    setReply]    = useState('')

  useEffect(() => {
    const token = getToken()
    getMe(token).then(u=>setUser(u)).catch(()=>{})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages])

  function selectEoi(eoi) {
    setSelected(eoi)
    setMessages(getMockMessages(eoi.id))
    setReply('')
  }

  function toggleStar(id) {
    setStarred(prev=>({ ...prev, [id]: !prev[id] }))
  }

  function sendReply() {
    if (!reply.trim()) return
    const time = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    setMessages(prev=>[...prev, { id:Date.now(), from:'employer', text:reply.trim(), time }])
    setReply('')
  }

  const filteredEois = eois.filter(e => {
    const matchSearch = !search || e.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (tab === 'All Sent EOIs')          return true
    if (tab === 'Responses Received')     return e.status !== 'Archived'
    if (tab === 'Interviews Scheduled')   return e.tag === 'Interview Scheduled'
    if (tab === 'Archived')               return e.status === 'Archived'
    return true
  })

  return (
    <CompanyLayout user={user}>

      {/* Page heading */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
        <button onClick={()=>navigate('/company/dashboard')}
          style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center', color:'#6a7380' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:0 }}>
            Manage Sent EOIs
          </h2>
          <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'4px 0 0' }}>
            Track your communication with candidates and manage technical interview schedules.
          </p>
        </div>
      </div>

      {/* White container with tabs + split panel */}
      <div style={{ background:'#fff', borderRadius:20, overflow:'hidden',
        boxShadow:'0 2px 16px rgba(0,0,0,0.06)', minHeight:620 }}>

        {/* Tab bar */}
        <div style={{ display:'flex', borderBottom:'1px solid #f0f0f4' }}>
          {TABS.map(t => {
            const isActive = tab === t
            return (
              <button key={t} onClick={()=>setTab(t)} style={{
                padding:'14px 20px', border:'none', cursor:'pointer',
                fontFamily:font, fontSize:14, fontWeight: isActive?700:400,
                lineHeight:1.3, whiteSpace:'nowrap',
                background: isActive ? '#156dbf' : 'transparent',
                color: isActive ? '#fff' : '#6a7380',
                borderRadius: isActive ? '0' : '0',
                transition:'all 0.15s',
              }}>
                {t}
              </button>
            )
          })}
        </div>

        {/* Split panel */}
        <div style={{ display:'flex', height:560 }}>

          {/* LEFT — EOI list */}
          <div style={{ width:320, flexShrink:0, borderRight:'1px solid #f0f0f4',
            display:'flex', flexDirection:'column', overflow:'hidden' }}>

            {/* List header */}
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #f0f0f4' }}>
              <div style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#343434', marginBottom:12 }}>
                All EOIs
              </div>
              {/* Search */}
              <div style={{ display:'flex', alignItems:'center', gap:8,
                border:'1.5px solid #e0dff0', borderRadius:10, padding:'8px 12px' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Search"
                  style={{ border:'none', outline:'none', fontFamily:font, fontSize:13,
                    color:'#343434', background:'transparent', flex:1 }}/>
              </div>
            </div>

            {/* EOI items */}
            <div style={{ flex:1, overflowY:'auto' }}>
              {filteredEois.map(eoi => {
                const isActive = selected?.id === eoi.id
                const tagColor = TAG_COLORS[eoi.tag] || '#6a7380'
                return (
                  <div key={eoi.id} onClick={()=>selectEoi(eoi)}
                    style={{ padding:'16px 20px', borderBottom:'1px solid #f8f8fc',
                      background: isActive ? '#f0f4ff' : '#fff',
                      cursor:'pointer', transition:'background 0.12s',
                      borderLeft: isActive ? '3px solid #156dbf' : '3px solid transparent' }}
                    onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background='#fafafa' }}
                    onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background='#fff' }}>
                    <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                      <Avatar name={eoi.candidateName} size={38}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:6 }}>
                          <div style={{ fontFamily:font, fontSize:13, fontWeight:700, color:'#343434',
                            overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>
                            {eoi.candidateName}
                          </div>
                          <StarIcon filled={!!starred[eoi.id]} onClick={()=>toggleStar(eoi.id)}/>
                        </div>
                        <div style={{ fontFamily:font, fontSize:12, color:'#6a7380', margin:'3px 0',
                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {eoi.subject}
                        </div>
                        <span style={{ fontFamily:font, fontSize:11, fontWeight:700, color:tagColor }}>
                          {eoi.tag}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT — Chat panel */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
            {!selected ? (
              <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <p style={{ fontFamily:font, color:'#9ca3af', fontSize:15 }}>
                  Select an EOI to view the conversation.
                </p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div style={{ padding:'14px 24px', borderBottom:'1px solid #f0f0f4',
                  display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <Avatar name={selected.candidateName} size={42}/>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <span style={{ fontFamily:font, fontWeight:700, fontSize:15, color:'#343434' }}>
                          Chat with {selected.candidateName.split(' - ')[0]}
                        </span>
                        <span style={{ fontFamily:font, fontSize:12, color:'#6a7380' }}>
                          {selected.candidateName.split(' - ')[1] || ''}
                        </span>
                        {/* Disabled indicator */}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e53e3e" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  {/* Action icons */}
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    {[
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>,
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d0d5dd" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#6a7380"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>,
                    ].map((icon,i)=>(
                      <button key={i} style={{ background:'none', border:'none', cursor:'pointer',
                        display:'flex', alignItems:'center' }}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex:1, overflowY:'auto', padding:'20px 24px',
                  display:'flex', flexDirection:'column', gap:14 }}>
                  {/* Today badge */}
                  <div style={{ display:'flex', justifyContent:'center', marginBottom:4 }}>
                    <span style={{ fontFamily:font, fontWeight:600, fontSize:12, color:'#fff',
                      background:'#585484', borderRadius:20, padding:'4px 14px' }}>Today</span>
                  </div>

                  {messages.map(msg => {
                    const isEmployer = msg.from === 'employer'
                    return (
                      <div key={msg.id} style={{
                        display:'flex',
                        flexDirection: isEmployer ? 'column' : 'column',
                        alignItems: isEmployer ? 'flex-start' : 'flex-end',
                        gap:4,
                      }}>
                        <div style={{
                          maxWidth:'62%', padding:'12px 16px', borderRadius: isEmployer ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                          background: isEmployer ? '#f0f0f4' : '#156dbf',
                          fontFamily:font, fontSize:14, lineHeight:1.6,
                          color: isEmployer ? '#343434' : '#fff',
                        }}>
                          {msg.text}
                        </div>
                        <span style={{ fontFamily:font, fontSize:11, color:'#9ca3af', margin: isEmployer ? '0 0 0 4px' : '0 4px 0 0' }}>
                          {msg.time}
                        </span>
                      </div>
                    )
                  })}
                  <div ref={bottomRef}/>
                </div>

                {/* Trade-verified banner */}
                <div style={{ padding:'10px 24px', background:'#f0faf5',
                  borderTop:'1px solid #d1fae5', borderBottom:'1px solid #d1fae5' }}>
                  <span style={{ fontFamily:font, fontSize:13, color:'#129578', fontWeight:500 }}>
                    This candidate is trade verified. You can securely view their uploaded certifications in the Profile tab.
                  </span>
                </div>

                {/* Reply input */}
                <div style={{ padding:'12px 20px', borderTop:'1px solid #f0f0f4',
                  display:'flex', alignItems:'center', gap:12, background:'#fff' }}>
                  {/* Emoji icon */}
                  <button style={{ background:'none', border:'none', cursor:'pointer', padding:0, flexShrink:0 }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                      <line x1="9" y1="9" x2="9.01" y2="9"/>
                      <line x1="15" y1="9" x2="15.01" y2="9"/>
                    </svg>
                  </button>
                  <input value={reply} onChange={e=>setReply(e.target.value)}
                    onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                    placeholder={`Write a message to ${selected.candidateName.split(' - ')[0]}...`}
                    style={{ flex:1, border:'none', outline:'none', fontFamily:font, fontSize:14,
                      color:'#343434', background:'transparent' }}/>
                  <button onClick={sendReply}
                    style={{ background:'none', border:'none', cursor:'pointer', padding:0, flexShrink:0,
                      display:'flex', alignItems:'center' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#156dbf" stroke="none">
                      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </CompanyLayout>
  )
}