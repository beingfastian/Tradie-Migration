/**
 * TrainerEnrollmentInquiries — Enrollment inquiry chat.
 * Figma node 1-2805.
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrainerLayout } from './TrainerLayout'
import { getToken, getMe } from '../../services/api'
import { MOCK_TRAINER_USER, MOCK_PROVIDER, MOCK_INQUIRIES } from './trainerMockData'

const font = "'Urbanist', sans-serif"

const TABS = ['All Requests','New Requests','In Progress','Offers Sent','Archived']

const STATUS_COLORS = {
  'New':         { bg:'#e8f5e9', color:'#129578' },
  'In Progress': { bg:'#e8ecff', color:'#5379f4' },
  'Offer Sent':  { bg:'#fff3e8', color:'#f26f37' },
  'Archived':    { bg:'#f0f0f4', color:'#6a7380' },
}

function Avatar({ name, size=36 }) {
  const initials = (name||'U').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
  const colors = ['#5379f4','#f26f37','#129578','#403c8b','#156dbf']
  const bg = colors[(name||'').charCodeAt(0)%colors.length]
  return <div style={{ width:size, height:size, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:size*0.38, fontFamily:font, flexShrink:0 }}>{initials}</div>
}

function getMockMessages(id) {
  return [
    { id:1, from:'student', text:'Hi, I am interested in enrolling in the Cert III Electrotechnology course. Could you tell me more about the next intake?', time:'9:14 AM' },
    { id:2, from:'trainer', text:'Hi! Great to hear from you. Our next intake starts on 15 November 2026. The course runs for 12 months and covers all key electrical theory and practical components.', time:'9:20 AM' },
    { id:3, from:'student', text:'That sounds great. What are the entry requirements?', time:'9:22 AM' },
    { id:4, from:'trainer', text:'You will need a minimum of Year 10 completion or equivalent, and a basic English proficiency. We also conduct a pre-enrolment interview to make sure you are a good fit for the program.', time:'9:25 AM' },
  ]
}

export function TrainerEnrollmentInquiries() {
  const navigate = useNavigate()
  const [user, setUser]         = useState(null)
  const [provider, setProvider] = useState(null)
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('All Requests')
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState(null)
  const [reply, setReply]       = useState('')
  const [messages, setMessages] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    const token = getToken()
    if (!token) { setUser(MOCK_TRAINER_USER); setProvider(MOCK_PROVIDER); setInquiries(MOCK_INQUIRIES); setLoading(false); return }
    getMe(token)
      .then(u => { setUser(u); setProvider(MOCK_PROVIDER); setInquiries(MOCK_INQUIRIES) })
      .catch(() => { setUser(MOCK_TRAINER_USER); setProvider(MOCK_PROVIDER); setInquiries(MOCK_INQUIRIES) })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (inquiries.length && !selected) {
      setSelected(inquiries[0])
      setMessages(getMockMessages(inquiries[0].id))
    }
  }, [inquiries])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages])

  const filtered = inquiries.filter(i => {
    const q = search.toLowerCase()
    return !q || (i.name||'').toLowerCase().includes(q) || (i.course||'').toLowerCase().includes(q)
  })

  function selectInquiry(inq) {
    setSelected(inq)
    setMessages(getMockMessages(inq.id))
  }

  function sendReply() {
    if (!reply.trim()) return
    const now = new Date()
    const time = now.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    setMessages(prev => [...prev, { id: Date.now(), from:'trainer', text:reply.trim(), time }])
    setReply('')
  }

  return (
    <TrainerLayout user={user} provider={provider}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
        <button onClick={()=>navigate('/trainer/dashboard')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, color:'#6a7380', display:'flex' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h2 style={{ fontFamily:font, fontSize:26, fontWeight:700, color:'#1e1e1e', margin:0 }}>Enrollment Inquiries</h2>
          <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'4px 0 0' }}>Manage student enrollment requests, respond to inquiries, and track application progress.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, flexWrap:'wrap' }}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:'8px 20px', border:t===tab?'2px solid #5379f4':'2px solid transparent', borderRadius:20, cursor:'pointer', fontFamily:font, fontSize:14, fontWeight:600, background:t===tab?'#e8ecff':'#fff', color:t===tab?'#5379f4':'#6a7380', transition:'all 0.15s' }}>{t}</button>
        ))}
      </div>

      {/* Split panel */}
      <div style={{ display:'flex', gap:20, height:'calc(100vh - 280px)', minHeight:500 }}>

        {/* Left — inquiry list */}
        <div style={{ width:320, flexShrink:0, background:'#fff', borderRadius:20, boxShadow:'0 2px 16px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ padding:'16px 16px 12px', borderBottom:'1px solid #f0f0f4' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, border:'1px solid #d0d5dd', borderRadius:10, padding:'8px 12px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search inquiries…" value={search} onChange={e=>setSearch(e.target.value)} style={{ border:'none', outline:'none', fontFamily:font, fontSize:13, color:'#343434', background:'transparent', flex:1 }}/>
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {loading ? (
              <p style={{ padding:20, fontFamily:font, color:'#9ca3af', fontSize:13 }}>Loading…</p>
            ) : filtered.length===0 ? (
              <p style={{ padding:20, fontFamily:font, color:'#9ca3af', fontSize:13 }}>No inquiries found.</p>
            ) : filtered.map(inq => {
              const isActive = selected?.id===inq.id
              const sc = STATUS_COLORS[inq.status] || { bg:'#f0f0f4', color:'#6a7380' }
              return (
                <div key={inq.id} onClick={()=>selectInquiry(inq)} style={{ padding:'14px 16px', borderBottom:'1px solid #f8f8fc', cursor:'pointer', background:isActive?'#f3f1fd':'transparent', transition:'background 0.15s' }}
                  onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.background='#fafafa' }}
                  onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.background='transparent' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                    <Avatar name={inq.name}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:'#1e1e1e', fontFamily:font, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inq.name}</div>
                      <div style={{ fontSize:12, color:'#9ca3af', fontFamily:font, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inq.course}</div>
                    </div>
                    <div style={{ display:'inline-flex', background:sc.bg, borderRadius:20, padding:'2px 10px' }}>
                      <span style={{ fontSize:11, fontWeight:700, color:sc.color, fontFamily:font, whiteSpace:'nowrap' }}>{inq.status}</span>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:'#6a7380', fontFamily:font }}>{inq.preview||'Inquiry about enrollment...'}</div>
                  <div style={{ fontSize:11, color:'#9ca3af', fontFamily:font, marginTop:4 }}>{inq.time||'Today'}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right — chat */}
        <div style={{ flex:1, background:'#fff', borderRadius:20, boxShadow:'0 2px 16px rgba(0,0,0,0.05)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {!selected ? (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <p style={{ fontFamily:font, color:'#9ca3af', fontSize:15 }}>Select an inquiry to view the conversation.</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div style={{ padding:'16px 24px', borderBottom:'1px solid #f0f0f4', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <Avatar name={selected.name} size={44}/>
                  <div>
                    <div style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#1e1e1e' }}>{selected.name}</div>
                    <div style={{ fontFamily:font, fontSize:13, color:'#9ca3af' }}>{selected.course}</div>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <button style={{ padding:'6px 16px', background:'#e8f5e9', border:'none', borderRadius:20, cursor:'pointer', fontFamily:font, fontSize:13, fontWeight:600, color:'#129578' }}>Send Offer</button>
                  <button style={{ padding:'6px 16px', background:'#fff0f0', border:'none', borderRadius:20, cursor:'pointer', fontFamily:font, fontSize:13, fontWeight:600, color:'#e53e3e' }}>Archive</button>
                </div>
              </div>

              {/* Verified notice */}
              <div style={{ background:'#e8f5e9', padding:'10px 24px', display:'flex', alignItems:'center', gap:8, borderBottom:'1px solid #c8e6c9' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#129578" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                <span style={{ fontFamily:font, fontSize:13, fontWeight:600, color:'#129578' }}>This candidate is trade-verified and eligible for enrollment.</span>
              </div>

              {/* Messages */}
              <div style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
                {messages.map(msg => {
                  const isTrainer = msg.from==='trainer'
                  return (
                    <div key={msg.id} style={{ display:'flex', flexDirection:isTrainer?'row-reverse':'row', alignItems:'flex-end', gap:10 }}>
                      {!isTrainer && <Avatar name={selected.name} size={32}/>}
                      <div style={{ maxWidth:'65%' }}>
                        <div style={{ background:isTrainer?'#5379f4':'#f3f1fd', borderRadius:isTrainer?'16px 16px 4px 16px':'16px 16px 16px 4px', padding:'12px 16px' }}>
                          <p style={{ fontFamily:font, fontSize:14, color:isTrainer?'#fff':'#1e1e1e', margin:0, lineHeight:1.5 }}>{msg.text}</p>
                        </div>
                        <div style={{ fontFamily:font, fontSize:11, color:'#9ca3af', marginTop:4, textAlign:isTrainer?'right':'left' }}>{msg.time}</div>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef}/>
              </div>

              {/* Reply input */}
              <div style={{ padding:'16px 24px', borderTop:'1px solid #f0f0f4', display:'flex', gap:12, alignItems:'center' }}>
                <input value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==='Enter'&&!e.shiftKey&&sendReply()} placeholder="Type a reply to the student…"
                  style={{ flex:1, height:44, borderRadius:12, border:'1.5px solid #d0d5dd', padding:'0 16px', fontFamily:font, fontSize:14, color:'#343434', outline:'none' }}/>
                <button onClick={sendReply} style={{ width:44, height:44, borderRadius:12, background:'#5379f4', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}
                  onMouseEnter={e=>e.currentTarget.style.background='#3d64e8'} onMouseLeave={e=>e.currentTarget.style.background='#5379f4'}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </TrainerLayout>
  )
}
