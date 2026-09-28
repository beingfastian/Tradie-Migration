/**
 * WorkerEOIs — My EOIs page with split-panel chat interface.
 * Figma node 1-2137: tab nav, EOI list (left), chat panel (right).
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { WorkerLayout } from './WorkerLayout'
import {
  getToken, getMe,
  getReceivedEois, markEoiRead,
} from '../../services/api'

const font = "'Urbanist', sans-serif"

const TABS = ['All EOIs', 'Active Enquiries', 'Interview Scheduled', 'Archived']

const STATUS_COLORS = {
  'Sponsorship Offered': '#f26f37',
  'Interview: Pending':  '#f26f37',
  'Interview Scheduled': '#5379f4',
  'Active':              '#129578',
  'Archived':            '#9ca3af',
  'unread':              '#f26f37',
  'read':                '#9ca3af',
}

function Avatar({ name, size=36 }) {
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
  const colors = ['#5379f4','#f26f37','#129578','#403c8b','#156dbf']
  const color = colors[(name||'').charCodeAt(0) % colors.length]
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', background:color,
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontWeight:700, fontSize:size*0.38, fontFamily:font, flexShrink:0,
    }}>{initials}</div>
  )
}

function StarIcon({ filled, onClick }) {
  return (
    <svg
      onClick={onClick}
      width="18" height="18" viewBox="0 0 24 24"
      fill={filled ? '#f4a261' : 'none'}
      stroke={filled ? '#f4a261' : '#d0d5dd'}
      strokeWidth="1.8" style={{ cursor:'pointer', flexShrink:0 }}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#5379f4" stroke="none">
      <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
    </svg>
  )
}

/* Mock messages per EOI id */
function getMockMessages(eoiId) {
  return [
    { id:1, from:'employer', text:"Hi Joshua, we've reviewed your trade qualifications. Are you available for a technical interview next Tuesday?", time:'04:45 PM' },
    { id:2, from:'me', text:"Yes, I am available. I have also uploaded my latest skills assessment to my Documents tab for your review.", time:'04:45 PM' },
    { id:3, from:'employer', text:"Hi Joshua, we've reviewed your trade qualifications. Are you available for a technical interview next Tuesday?", time:'04:45 PM' },
    { id:4, from:'me', text:"Yes, I am available. I have also uploaded my latest skills assessment to my Documents tab for your review.", time:'04:45 PM' },
  ]
}

export function WorkerEOIs() {
  const navigate  = useNavigate()
  const [user, setUser]           = useState(null)
  const [eois, setEois]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [tab, setTab]             = useState('All EOIs')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState(null)
  const [starred, setStarred]     = useState({})
  const [reply, setReply]         = useState('')
  const [messages, setMessages]   = useState([])
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const token = getToken()
    if (!token) { setLoading(false); return }
    let _user = null
    getMe(token)
      .then(u => { _user = u; setUser(u); return getReceivedEois(token) })
      .then(data => {
        const list = Array.isArray(data) ? data : (data.items || [])
        setEois(list)
        if (list.length > 0) { setSelected(list[0]); setMessages(getMockMessages(list[0].id)); markEoiRead(list[0].id, token).catch(() => {}) }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [navigate])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages])

  function selectEoi(eoi) {
    setSelected(eoi)
    setMessages(getMockMessages(eoi.id))
    setReply('')
    markEoiRead(eoi.id, getToken()).catch(() => {})
  }

  function sendReply() {
    if (!reply.trim()) return
    setMessages(prev => [...prev, {
      id: Date.now(), from:'me', text:reply.trim(), time: new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    }])
    setReply('')
  }

  const filteredEois = eois.filter(e => {
    const matchSearch = !search || (e.employer_company || e.employer_name || '').toLowerCase().includes(search.toLowerCase())
    if (!matchSearch) return false
    if (tab === 'All EOIs') return true
    if (tab === 'Active Enquiries') return !['archived','interview_scheduled'].includes(e.status)
    if (tab === 'Interview Scheduled') return e.status === 'interview_scheduled'
    if (tab === 'Archived') return e.status === 'archived'
    return true
  })

  /* Enrich with display data */
  function eoiLabel(e) {
    if (e.status === 'interview_scheduled') return 'Interview Scheduled'
    if (e.status === 'archived') return 'Archived'
    return e.sponsorship_offered ? 'Sponsorship Offered' : 'Sponsorship Offered'
  }

  const selCompany = selected?.employer_company || selected?.employer_name || 'Acme Electrical Pty Ltd'
  const selRole    = selected?.employer_role || 'HR Manager'

  return (
    <WorkerLayout user={user}>
      <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:'0 0 20px' }}>
        My EOIs
      </h2>

      <div style={{
        background:'#fff', borderRadius:20, boxShadow:'0 2px 16px rgba(0,0,0,0.05)',
        overflow:'hidden', display:'flex', flexDirection:'column', minHeight:520,
      }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:4, padding:'16px 24px 0', borderBottom:'1px solid #f0f0f4' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding:'10px 18px', border:'none', cursor:'pointer', borderRadius:'8px 8px 0 0',
                fontFamily:font, fontSize:14, fontWeight: t === tab ? 700 : 500,
                background: t === tab ? '#5379f4' : 'transparent',
                color: t === tab ? '#fff' : '#6a7380',
                transition:'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ display:'flex', flex:1, minHeight:0 }}>
          {/* Left: EOI list */}
          <div style={{ width:340, flexShrink:0, borderRight:'1px solid #f0f0f4', display:'flex', flexDirection:'column' }}>
            <div style={{ padding:'16px 16px 12px', borderBottom:'1px solid #f0f0f4' }}>
              <p style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#1e1e1e', margin:'0 0 12px' }}>
                All EOIs
              </p>
              {/* Search */}
              <div style={{ display:'flex', alignItems:'center', gap:8, border:'1px solid #d0d5dd', borderRadius:10, padding:'8px 14px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  placeholder="Search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ border:'none', outline:'none', fontFamily:font, fontSize:14, color:'#343434', background:'transparent', flex:1 }}
                />
              </div>
            </div>

            <div style={{ overflowY:'auto', flex:1 }}>
              {loading ? (
                <p style={{ fontFamily:font, fontSize:14, color:'#9ca3af', padding:20, textAlign:'center' }}>Loading…</p>
              ) : filteredEois.length === 0 ? (
                <p style={{ fontFamily:font, fontSize:14, color:'#9ca3af', padding:20, textAlign:'center' }}>No EOIs yet.</p>
              ) : (
                filteredEois.map(eoi => {
                  const isSelected = selected?.id === eoi.id
                  const label = eoiLabel(eoi)
                  const labelColor = STATUS_COLORS[label] || '#f26f37'
                  return (
                    <div
                      key={eoi.id}
                      onClick={() => selectEoi(eoi)}
                      style={{
                        padding:'14px 16px', cursor:'pointer',
                        background: isSelected ? '#f3f1fd' : 'transparent',
                        borderBottom:'1px solid #f8f8fc',
                        display:'flex', alignItems:'flex-start', gap:12,
                        transition:'background 0.12s',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background='#fafafa' }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background='transparent' }}
                    >
                      <Avatar name={eoi.employer_company || eoi.employer_name || 'BuildCore Australia'} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                          <p style={{ fontFamily:font, fontSize:14, fontWeight:700, color:'#1e1e1e', margin:'0 0 2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>
                            {eoi.employer_company || eoi.employer_name || 'BuildCore Australia'}
                          </p>
                          <StarIcon
                            filled={!!starred[eoi.id]}
                            onClick={ev => { ev.stopPropagation(); setStarred(s => ({ ...s, [eoi.id]: !s[eoi.id] })) }}
                          />
                        </div>
                        <p style={{ fontFamily:font, fontSize:12, color:'#6a7380', margin:'0 0 4px' }}>
                          Inquiry for: {eoi.trade_type || 'Licensed Electrician'}
                        </p>
                        <span style={{ fontFamily:font, fontSize:12, fontWeight:600, color:labelColor }}>
                          {label}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right: Chat panel */}
          {selected ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
              {/* Chat header */}
              <div style={{ padding:'16px 24px', borderBottom:'1px solid #f0f0f4', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <Avatar name={selCompany} size={40} />
                  <div>
                    <p style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#1e1e1e', margin:0 }}>{selCompany}</p>
                    <p style={{ fontFamily:font, fontSize:13, color:'#6a7380', margin:0 }}>{selRole} at {selCompany}</p>
                  </div>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  {/* Action icons */}
                  {[
                    <svg key="r" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="1.8" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
                    <StarIcon key="s" filled={!!starred[selected?.id]} onClick={() => setStarred(s => ({ ...s, [selected?.id]: !s[selected?.id] }))} />,
                    <svg key="c" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
                    <svg key="m" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
                  ].map((icon, i) => (
                    <div key={i} style={{ cursor:'pointer', color:'#6a7380' }}>{icon}</div>
                  ))}
                </div>
              </div>

              {/* Messages area */}
              <div style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
                {/* "Today" separator */}
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ flex:1, height:1, background:'#f0f0f4' }}/>
                  <span style={{ fontFamily:font, fontSize:12, color:'#9ca3af', background:'#e8ecff', borderRadius:20, padding:'2px 12px' }}>Today</span>
                  <div style={{ flex:1, height:1, background:'#f0f0f4' }}/>
                </div>

                {messages.map(msg => (
                  <div key={msg.id} style={{
                    display:'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start',
                  }}>
                    <div style={{ maxWidth:'65%' }}>
                      <div style={{
                        background: msg.from === 'me' ? '#5379f4' : '#f3f1fd',
                        color: msg.from === 'me' ? '#fff' : '#1e1e1e',
                        borderRadius: msg.from === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                        padding:'12px 16px',
                        fontFamily:font, fontSize:14, lineHeight:1.5,
                      }}>
                        {msg.text}
                      </div>
                      <p style={{ fontFamily:font, fontSize:11, color:'#9ca3af', margin:'4px 0 0', textAlign: msg.from === 'me' ? 'right' : 'left' }}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}/>
              </div>

              {/* Sponsor notice */}
              <div style={{ background:'#e8f5e9', padding:'10px 24px' }}>
                <p style={{ fontFamily:font, fontSize:12, color:'#2e7d32', margin:0, textAlign:'center' }}>
                  This employer is an Approved Substandard Sponsor. Any documents shared here are encrypted.
                </p>
              </div>

              {/* Reply input */}
              <div style={{ padding:'12px 24px', borderTop:'1px solid #f0f0f4', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'#f3f1fd', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5379f4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <input
                  placeholder={`Write a reply to ${selCompany}..`}
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply() } }}
                  style={{
                    flex:1, border:'none', outline:'none', fontFamily:font, fontSize:14,
                    color:'#343434', background:'transparent',
                  }}
                />
                <button
                  onClick={sendReply}
                  style={{ background:'none', border:'none', cursor:'pointer', padding:4, display:'flex', alignItems:'center' }}
                >
                  <SendIcon />
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
    </WorkerLayout>
  )
}
