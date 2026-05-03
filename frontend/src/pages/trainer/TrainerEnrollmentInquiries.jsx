/**
 * TrainerEnrollmentInquiries — Figma node 1:2805 (file Ud0NnDoXtD1Rd5t4EaAlBT)
 * All assets from Figma API. Inline styles only.
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrainerLayout } from './TrainerLayout'
import { getToken, getMe } from '../../services/api'

const font = "'Urbanist', sans-serif"

/* ─── FIGMA ASSETS — node 1:2805 ─── */
const imgAvatarSamuel  = 'https://www.figma.com/api/mcp/asset/f587302a-8419-4274-9775-17fe185a2ed1' // Rectangle1
const imgAvatarJohn    = 'https://www.figma.com/api/mcp/asset/fc66e3d5-b026-4e8f-ad6b-5261289ab3d8' // Rectangle2
const imgSearchIcon    = 'https://www.figma.com/api/mcp/asset/532fd550-6347-4d63-9e9f-40773b224db2'
const imgStarEmpty     = 'https://www.figma.com/api/mcp/asset/6bfc2455-2cd9-48aa-b6a9-78edc7ae7ead'
const imgStarFilled    = 'https://www.figma.com/api/mcp/asset/a6e9f997-f1bc-4be0-82f2-80580ce611e1'
const imgRefreshIcon   = 'https://www.figma.com/api/mcp/asset/51fb4e13-0049-4f61-8115-c1c2724ff4d0'
const imgSearchChatIcon= 'https://www.figma.com/api/mcp/asset/74f64a22-6ed1-4fa4-9b0c-521d8280f82d'
const imgMoreIcon      = 'https://www.figma.com/api/mcp/asset/f2cefcf2-68a9-48c7-b88c-4bc6d58aa3f3'
const imgNoticeBg      = 'https://www.figma.com/api/mcp/asset/726d3086-494b-46d7-aa56-c0244e38980e' // green bg
const imgEmojiIcon     = 'https://www.figma.com/api/mcp/asset/5a5418ef-d715-49bf-98e6-352bc0f7c24e'
const imgSendIcon      = 'https://www.figma.com/api/mcp/asset/8bd825d1-82e6-41ce-b3a6-daef0e38aa10'
const imgDividerLine   = 'https://www.figma.com/api/mcp/asset/81deae36-dc16-4e0a-803a-e9b8139b40ba'

const TABS = ['All Requests', 'New Requests', 'In Progress', 'Offers Sent', 'Archived']

const INQUIRIES = [
  { id:1, avatar:imgAvatarSamuel, name:'Samuel Rivera', course:'Cert III Electrotechnology',   tag:'Inquiry: Cert III Electrotechnology',    starred:false },
  { id:2, avatar:imgAvatarJohn,   name:'John Doe',       course:'Solar Grid-Connect Short Course', tag:'Inquiry: Solar Installation Gap Training',starred:true  },
  { id:3, avatar:imgAvatarSamuel, name:'Samuel Rivera', course:'Cert III Electrotechnology',   tag:'Inquiry: Cert III Electrotechnology',    starred:false },
  { id:4, avatar:imgAvatarSamuel, name:'Samuel Rivera', course:'Cert III Electrotechnology',   tag:'Inquiry: Cert III Electrotechnology',    starred:false },
  { id:5, avatar:imgAvatarSamuel, name:'Samuel Rivera', course:'Cert III Electrotechnology',   tag:'Inquiry: Cert III Electrotechnology',    starred:false },
  { id:6, avatar:imgAvatarSamuel, name:'Samuel Rivera', course:'Cert III Electrotechnology',   tag:'Inquiry: Cert III Electrotechnology',    starred:false },
]

const INITIAL_MESSAGES = [
  { id:1, from:'student', text:"Hi, I'm interested in the November intake for the Electrician course. Do you accept international students on a 482 visa?", time:'04:45 PM' },
  { id:2, from:'trainer', text:'Hi Samuel, yes we do. I have reviewed your profile. Please provide your English proficiency results and we can issue a Letter of Offer.', time:'04:45 PM' },
  { id:3, from:'student', text:"Hi, I'm interested in the November intake for the Electrician course. Do you accept international students on a 482 visa?", time:'04:45 PM' },
  { id:4, from:'trainer', text:'Hi Samuel, yes we do. I have reviewed your profile. Please provide your English proficiency results and we can issue a Letter of Offer.', time:'04:45 PM' },
]

export function TrainerEnrollmentInquiries() {
  const navigate = useNavigate()
  const [user, setUser]           = useState(null)
  const [provider, setProvider]   = useState(null)
  const [tab, setTab]             = useState('All Requests')
  const [search, setSearch]       = useState('')
  const [selected, setSelected]   = useState(INQUIRIES[1]) // John Doe selected by default
  const [messages, setMessages]   = useState(INITIAL_MESSAGES)
  const [reply, setReply]         = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    const token = getToken()
    if (!token) return
    getMe(token).then(u => setUser(u)).catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages])

  const filtered = INQUIRIES.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.course.toLowerCase().includes(search.toLowerCase())
  )

  function selectInquiry(inq) {
    setSelected(inq)
    setMessages(INITIAL_MESSAGES)
    setReply('')
  }

  function sendReply() {
    if (!reply.trim()) return
    const time = new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
    setMessages(p => [...p, { id:Date.now(), from:'trainer', text:reply.trim(), time }])
    setReply('')
  }

  return (
    <TrainerLayout user={user} provider={provider}>

      {/* ── Page heading ── */}
      <h1 style={{ fontFamily:font, fontWeight:700, fontSize:34, color:'#343434', lineHeight:1.3, margin:'0 0 20px' }}>
        Enrollment Inquiries
      </h1>

      {/* ── White container ── */}
      <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', minHeight:600 }}>

        {/* Tab bar */}
        <div style={{ display:'flex', gap:0, borderBottom:'1px solid #f0f0f4', padding:'0 0 0 0' }}>
          {TABS.map(t => {
            const isActive = tab === t
            return (
              <button key={t} onClick={() => setTab(t)} style={{
                padding:'14px 20px', border:'none', cursor:'pointer', fontFamily:font,
                fontSize:14, fontWeight:400, lineHeight:1.3, whiteSpace:'nowrap',
                background: isActive ? '#156dbf' : 'transparent',
                color: isActive ? '#fff' : '#6a7380',
                borderRadius: isActive ? '8px 8px 0 0' : 0,
                transition:'all 0.15s',
              }}>{t}</button>
            )
          })}
        </div>

        {/* Split panel */}
        <div style={{ display:'flex', height:'calc(100vh - 260px)', minHeight:500 }}>

          {/* Left — inquiry list */}
          <div style={{ width:390, flexShrink:0, borderRight:'1px solid #f0f0f4', display:'flex', flexDirection:'column' }}>
            {/* List header */}
            <div style={{ padding:'16px 20px 12px', borderBottom:'1px solid #f0f0f4' }}>
              <p style={{ fontFamily:"'DM Sans', 'Urbanist', sans-serif", fontWeight:700, fontSize:16, color:'#343434', margin:'0 0 12px', lineHeight:1.3 }}>
                All EOIs
              </p>
              {/* Search */}
              <div style={{ display:'flex', alignItems:'center', gap:10, border:'1px solid #c1c1c8', borderRadius:10, padding:'10px 14px', background:'#fff' }}>
                <img src={imgSearchIcon} alt="" style={{ width:20, height:20, flexShrink:0 }}/>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search" style={{
                    border:'none', outline:'none', fontFamily:font, fontSize:14,
                    color:'#343434', background:'transparent', flex:1,
                  }}/>
              </div>
            </div>

            {/* List items */}
            <div style={{ flex:1, overflowY:'auto' }}>
              {filtered.map(inq => {
                const isActive = selected?.id === inq.id
                return (
                  <div key={inq.id} onClick={() => selectInquiry(inq)} style={{
                    padding:'14px 20px', borderBottom:'1px solid #f8f8fc',
                    cursor:'pointer', background: isActive ? '#f3f1fd' : 'transparent',
                    display:'flex', alignItems:'center', gap:12, transition:'background 0.15s',
                  }}
                    onMouseEnter={e => { if(!isActive) e.currentTarget.style.background='#fafafa' }}
                    onMouseLeave={e => { if(!isActive) e.currentTarget.style.background='transparent' }}>
                    <img src={inq.avatar} alt={inq.name}
                      style={{ width:44, height:44, borderRadius:'50%', flexShrink:0, objectFit:'cover', display:'block' }}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:font, fontWeight:700, fontSize:16, color:'#343434', lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {inq.name}
                      </div>
                      <div style={{ fontFamily:font, fontWeight:400, fontSize:14, color:'#6a7380', lineHeight:1.3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginTop:2 }}>
                        {inq.course}
                      </div>
                      <div style={{ fontFamily:font, fontWeight:600, fontSize:12, color:'#f26f37', lineHeight:1.3, marginTop:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {inq.tag}
                      </div>
                    </div>
                    <img src={inq.starred ? imgStarFilled : imgStarEmpty} alt=""
                      style={{ width:20, height:20, flexShrink:0 }}/>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right — chat panel */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
            {!selected ? (
              <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <p style={{ fontFamily:font, color:'#9ca3af', fontSize:15 }}>Select an inquiry to view the conversation.</p>
              </div>
            ) : (
              <>
                {/* Chat header */}
                <div style={{ padding:'14px 24px', borderBottom:'1px solid #f0f0f4', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <img src={selected.avatar} alt={selected.name}
                      style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', display:'block', flexShrink:0 }}/>
                    <div>
                      <div style={{ fontFamily:font, fontWeight:700, fontSize:16, color:'#343434', lineHeight:1.3 }}>
                        Chat with {selected.name}
                      </div>
                      <div style={{ fontFamily:font, fontWeight:400, fontSize:14, color:'#6a7380', lineHeight:1.3, marginTop:2 }}>
                        Subject: Inquiry for {selected.course}
                      </div>
                    </div>
                  </div>
                  {/* Action icons */}
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <img src={imgRefreshIcon}    alt="refresh" style={{ width:24, height:24, cursor:'pointer' }}/>
                    <img src={imgStarEmpty}      alt="star"    style={{ width:24, height:24, cursor:'pointer' }}/>
                    <img src={imgSearchChatIcon} alt="search"  style={{ width:24, height:24, cursor:'pointer' }}/>
                    <img src={imgMoreIcon}       alt="more"    style={{ width:24, height:24, cursor:'pointer' }}/>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 }}>
                  {/* "Today" date badge */}
                  <div style={{ display:'flex', justifyContent:'center', marginBottom:4 }}>
                    <span style={{
                      fontFamily:font, fontWeight:600, fontSize:12, color:'#fff',
                      background:'#585484', borderRadius:20, padding:'4px 14px', lineHeight:1.3,
                    }}>Today</span>
                  </div>

                  {messages.map(msg => {
                    const isTrainer = msg.from === 'trainer'
                    return (
                      <div key={msg.id} style={{
                        display:'flex', flexDirection: isTrainer ? 'row-reverse' : 'row',
                        alignItems:'flex-end', gap:10,
                      }}>
                        {!isTrainer && (
                          <img src={selected.avatar} alt="" style={{ width:36, height:36, borderRadius:'50%', objectFit:'cover', flexShrink:0 }}/>
                        )}
                        <div style={{ maxWidth:'60%' }}>
                          <div style={{
                            background: isTrainer ? '#156dbf' : '#f3f1fd',
                            borderRadius: isTrainer ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            padding:'12px 16px',
                          }}>
                            <p style={{
                              fontFamily:font, fontWeight:400, fontSize:14,
                              color: isTrainer ? '#fff' : '#343434',
                              margin:0, lineHeight:1.5,
                            }}>{msg.text}</p>
                          </div>
                          <div style={{
                            fontFamily:"'Inter', sans-serif", fontWeight:400, fontSize:13,
                            color:'#9ca3af', marginTop:4,
                            textAlign: isTrainer ? 'right' : 'left',
                          }}>{msg.time}</div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={bottomRef}/>
                </div>

                {/* Green notice bar — Figma: bg image + green text */}
                <div style={{ position:'relative', margin:'0 0 0', flexShrink:0 }}>
                  <img src={imgNoticeBg} alt="" style={{ width:'100%', height:44, display:'block', objectFit:'cover', pointerEvents:'none' }}/>
                  <div style={{
                    position:'absolute', inset:0, display:'flex', alignItems:'center',
                    padding:'0 20px',
                  }}>
                    <span style={{ fontFamily:font, fontWeight:600, fontSize:14, color:'#2f9733', lineHeight:1.3 }}>
                      This student has a verified trade background. Click 'View Docs' to see their existing qualifications.
                    </span>
                  </div>
                </div>

                {/* Reply input */}
                <div style={{
                  padding:'12px 20px', borderTop:'1px solid #f0f0f4',
                  display:'flex', alignItems:'center', gap:12, background:'#fff',
                }}>
                  <img src={imgEmojiIcon} alt="emoji" style={{ width:24, height:24, flexShrink:0, cursor:'pointer' }}/>
                  <input value={reply} onChange={e => setReply(e.target.value)}
                    onKeyDown={e => e.key==='Enter' && !e.shiftKey && sendReply()}
                    placeholder={`Write a reply to ${selected.name}...`}
                    style={{
                      flex:1, border:'none', outline:'none', fontFamily:font,
                      fontSize:14, color:'#343434', background:'transparent',
                    }}/>
                  <button onClick={sendReply} style={{
                    background:'none', border:'none', cursor:'pointer', padding:0,
                    display:'flex', alignItems:'center',
                  }}>
                    <img src={imgSendIcon} alt="send" style={{ width:24, height:24 }}/>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </TrainerLayout>
  )
}
