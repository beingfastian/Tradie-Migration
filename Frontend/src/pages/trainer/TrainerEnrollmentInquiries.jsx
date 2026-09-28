/**
 * TrainerEnrollmentInquiries — Figma node 1-2802
 * Split-panel chat layout
 */
import { useState, useEffect } from 'react'
import { TrainerLayout } from './TrainerLayout'
import { getToken, getMe } from '../../services/api'

import trChatAvatar1 from '../../assets/trainer-dashboard/tr-chat-avatar1.png'
import trChatAvatar2 from '../../assets/trainer-dashboard/tr-chat-avatar2.png'
import trIconSend    from '../../assets/trainer-dashboard/tr-icon-send.svg'
import trIconEmoji   from '../../assets/trainer-dashboard/tr-icon-emoji.svg'

const font = "'Urbanist', sans-serif"

const TABS = ['All Requests', 'New Requests', 'In Progress', 'Offers Sent', 'Archived']

const CONVERSATIONS = [
  {
    id:1, name:'Samuel Rivera', flag:'🇵🇭', avatar: trChatAvatar1,
    subject:'Inquiry about Cert III Electrotechnology',
    lastMsg:'Hi, I wanted to ask about the next intake date...',
    time:'10:23 AM', unread:2, starred:true,
    messages:[
      { id:1, from:'student', text:"Hi, I'm interested in enrolling in the Certificate III Electrotechnology program. When is the next intake?", time:'10:15 AM' },
      { id:2, from:'trainer', text:"Hello Samuel! Great to hear from you. The next intake for Cert III Electrotechnology is 15 November 2026. Would you like me to send you the enrollment form?", time:'10:18 AM' },
      { id:3, from:'student', text:"Yes please! Also, is there any prerequisite for this course?", time:'10:23 AM' },
    ],
  },
  {
    id:2, name:'John Doe', flag:'🇬🇧', avatar: trChatAvatar2,
    subject:'Certificate IV Electrical inquiry',
    lastMsg:"Thank you for the information!",
    time:'Yesterday', unread:0, starred:false,
    messages:[
      { id:1, from:'student', text:"I completed my Cert III last year. Am I eligible to apply for the Cert IV?", time:'Yesterday' },
      { id:2, from:'trainer', text:"Absolutely! Your Cert III qualification makes you directly eligible. I'll send you the advanced standing form.", time:'Yesterday' },
      { id:3, from:'student', text:"Thank you for the information!", time:'Yesterday' },
    ],
  },
]

export function TrainerEnrollmentInquiries() {
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('All Requests')
  const [selected, setSelected] = useState(CONVERSATIONS[0])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = getToken()
    if (!token) return
    getMe(token).then(u => setUser(u)).catch(() => {})
  }, [])

  return (
    <TrainerLayout user={user}>

      <div style={{ marginBottom:20 }}>
        <h2 style={{ fontFamily:font, fontWeight:700, fontSize:28, color:'#1e1e1e', margin:'0 0 4px' }}>
          Enrollment Inquiries
        </h2>
        <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', margin:0 }}>
          Respond to student questions about your courses.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, flexWrap:'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'9px 20px', border:'none', cursor:'pointer', borderRadius:10,
            fontFamily:font, fontSize:14, fontWeight: t === tab ? 700 : 500,
            background: t === tab ? '#5379f4' : '#fff',
            color: t === tab ? '#fff' : '#6a7380',
            boxShadow: t === tab ? 'none' : '0 1px 4px rgba(0,0,0,0.06)',
          }}>{t}</button>
        ))}
      </div>

      {/* Split panel */}
      <div style={{ display:'flex', gap:0, background:'#fff', borderRadius:20, boxShadow:'0 2px 16px rgba(0,0,0,0.05)', overflow:'hidden', height:'calc(100vh - 300px)', minHeight:500 }}>

        {/* Left — conversation list */}
        <div style={{ width:340, flexShrink:0, borderRight:'1px solid #f0f0f4', overflowY:'auto' }}>
          {CONVERSATIONS.map(c => (
            <div key={c.id} onClick={() => setSelected(c)} style={{
              padding:'18px 20px', cursor:'pointer', borderBottom:'1px solid #f8f8fc',
              background: selected?.id === c.id ? '#f3f1fd' : '#fff',
              transition:'background 0.12s',
            }}
              onMouseEnter={e => { if (selected?.id !== c.id) e.currentTarget.style.background='#f8f8fc' }}
              onMouseLeave={e => { if (selected?.id !== c.id) e.currentTarget.style.background='#fff' }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <img src={c.avatar} alt={c.name} style={{ width:48, height:48, borderRadius:'50%', objectFit:'cover' }}/>
                  {c.unread > 0 && (
                    <div style={{
                      position:'absolute', top:-2, right:-2,
                      width:18, height:18, borderRadius:18,
                      background:'#fb4248', display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:10, fontWeight:700, color:'#fff', fontFamily:font,
                    }}>{c.unread}</div>
                  )}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                    <span style={{ fontFamily:font, fontWeight:700, fontSize:15, color:'#1e1e1e' }}>
                      {c.flag} {c.name}
                    </span>
                    <span style={{ fontFamily:font, fontSize:12, color:'#9ca3af' }}>{c.time}</span>
                  </div>
                  <p style={{ fontFamily:font, fontSize:13, fontWeight:600, color:'#403c8b', margin:'0 0 3px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {c.subject}
                  </p>
                  <p style={{ fontFamily:font, fontSize:13, color:'#9ca3af', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {c.lastMsg}
                  </p>
                </div>
                {c.starred && <span style={{ color:'#fdb345', fontSize:16, flexShrink:0 }}>★</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Right — chat */}
        {selected ? (
          <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

            {/* Chat header */}
            <div style={{
              padding:'18px 28px', borderBottom:'1px solid #f0f0f4',
              display:'flex', alignItems:'center', gap:14,
            }}>
              <img src={selected.avatar} alt={selected.name} style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover' }}/>
              <div>
                <p style={{ fontFamily:font, fontWeight:700, fontSize:16, color:'#1e1e1e', margin:0 }}>
                  {selected.flag} {selected.name}
                </p>
                <p style={{ fontFamily:font, fontSize:13, color:'#129578', margin:0, fontWeight:600 }}>● Online</p>
              </div>
            </div>

            {/* Verified banner */}
            <div style={{
              margin:'16px 28px 0', padding:'12px 20px',
              background:'#f1fdfb', borderRadius:10,
              display:'flex', alignItems:'center', gap:10,
            }}>
              <span style={{ fontSize:18 }}>✅</span>
              <p style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#129578', margin:0 }}>
                Verified student inquiry. This student has completed identity verification.
              </p>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:'auto', padding:'16px 28px', display:'flex', flexDirection:'column', gap:16 }}>
              {/* Today badge */}
              <div style={{ display:'flex', justifyContent:'center' }}>
                <span style={{ fontFamily:font, fontSize:12, fontWeight:600, color:'#9ca3af', background:'#f3f1fd', borderRadius:20, padding:'4px 16px' }}>Today</span>
              </div>

              {selected.messages.map(m => (
                <div key={m.id} style={{
                  display:'flex', justifyContent: m.from === 'trainer' ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth:'65%', padding:'12px 16px', borderRadius:16,
                    background: m.from === 'trainer' ? '#156dbf' : '#f3f1fd',
                    color: m.from === 'trainer' ? '#fff' : '#1e1e1e',
                    borderBottomRightRadius: m.from === 'trainer' ? 4 : 16,
                    borderBottomLeftRadius: m.from === 'student' ? 4 : 16,
                  }}>
                    <p style={{ fontFamily:font, fontSize:14, margin:'0 0 6px', lineHeight:1.5 }}>{m.text}</p>
                    <p style={{ fontFamily:font, fontSize:11, margin:0, opacity:0.7, textAlign:'right' }}>{m.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div style={{ padding:'16px 28px', borderTop:'1px solid #f0f0f4' }}>
              <div style={{
                display:'flex', alignItems:'center', gap:12,
                border:'1.5px solid #d0d5dd', borderRadius:16, padding:'12px 16px',
              }}>
                <img src={trIconEmoji} alt="" style={{ width:24, height:24, cursor:'pointer', flexShrink:0 }}/>
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && message.trim()) setMessage('') }}
                  placeholder="Type a message..."
                  style={{ flex:1, border:'none', outline:'none', fontFamily:font, fontSize:15, color:'#343434', background:'transparent' }}
                />
                <button onClick={() => setMessage('')} style={{
                  width:40, height:40, borderRadius:10, background:'#156dbf', border:'none',
                  display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0,
                }}>
                  <img src={trIconSend} alt="send" style={{ width:20, height:20 }}/>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <p style={{ fontFamily:font, color:'#9ca3af', fontSize:16 }}>Select a conversation</p>
          </div>
        )}
      </div>
    </TrainerLayout>
  )
}
