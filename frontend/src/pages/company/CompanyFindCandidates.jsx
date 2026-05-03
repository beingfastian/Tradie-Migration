/**
 * CompanyFindCandidates — Find Skilled Candidates page.
 * Matches PDF design: table, Grid/List toggle, search autocomplete,
 * Filter modal, Manage Columns modal, Invite to Role modal, tabs, pagination.
 *
 * RAG SEARCH: When "AI Search" mode is toggled on, the search bar calls
 * POST /rag/search which performs BM25 + semantic search across all ingested
 * candidate resumes and credential documents, returning ranked results with
 * match excerpts from the actual documents.
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyLayout } from './CompanyLayout'
import { getToken, getMe, searchCandidates, submitEoiAsEmployer, ragSearch } from '../../services/api'

const font = "'Urbanist', sans-serif"

/* ── Mock data (fallback when API unavailable) ── */
const MOCK_CANDIDATES = [
  { id:'1', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'482 Eligible',    status:'Shortlisted', shortlisted:true  },
  { id:'2', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'Skilled Ind.',    status:'Shortlisted', shortlisted:false },
  { id:'3', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'Sponsor Required', status:'Verified',    shortlisted:false },
  { id:'4', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'Skilled Ind.',    status:'Shortlisted', shortlisted:false },
  { id:'5', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'482 Eligible',    status:'Verified',    shortlisted:false },
  { id:'6', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'Sponsor Required', status:'Verified',    shortlisted:false },
  { id:'7', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'482 Eligible',    status:'Shortlisted', shortlisted:false },
]

const MOCK_ACTIVE_JOBS = [
  'Licensed A-Grade Electrician - Sydney',
  'Senior Electrician - Melbourne',
  'Solar Installer - Perth',
  'HVAC Technician - Brisbane',
]

const TRADE_SUGGESTIONS = [
  'Residential / Domestic Electrician',
  'Commercial Electrician',
  'Construction Electrician',
  'Industrial Electrician',
  'Maintenance / Service Electrician',
  'Field Service Electrician',
  'Electrical Installer / Electrical Technician',
  'Electrical Fitter',
]

const TABS = ['Available Talent', 'My Shortlist']

const VISA_COLORS = {
  '482 Eligible':     { bg:'#e8f5e9', color:'#129578' },
  'Skilled Ind.':     { bg:'#e8ecff', color:'#5379f4' },
  'Sponsor Required': { bg:'#343434', color:'#fff'     },
}

const STATUS_COLORS = {
  'Shortlisted': { bg:'#fff3e8', color:'#f26f37' },
  'Verified':    { bg:'#e8f5e9', color:'#129578' },
}

const ALL_COLUMNS = ['Candidate', 'Primary Trade', 'Experience', 'Visa Status', 'Status']

/* ── Document type labels for RAG results ── */
const DOC_TYPE_LABELS = {
  resume:               'Resume',
  trade_certificate:    'Trade Certificate',
  passport:             'Passport',
  safety_certificate:   'Safety Certificate',
  english_test:         'English Test',
  reference_letter:     'Reference Letter',
  employment_reference: 'Employment Reference',
  visa_application:     'Visa Application',
}

/* ── Small helpers ─────────────────────────────────────────────────────────── */

function Avatar({ name, size = 36 }) {
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  const colors   = ['#5379f4', '#f26f37', '#129578', '#403c8b', '#156dbf']
  const bg       = colors[(name || '').charCodeAt(0) % colors.length]
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', background:bg,
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontWeight:700, fontSize:size * 0.38, fontFamily:font, flexShrink:0,
    }}>
      {initials}
    </div>
  )
}

function VisaBadge({ value }) {
  const c = VISA_COLORS[value] || { bg:'#f0f0f4', color:'#6a7380' }
  return (
    <span style={{
      background:c.bg, color:c.color, borderRadius:20, padding:'4px 10px',
      fontSize:12, fontWeight:700, fontFamily:font, whiteSpace:'nowrap',
    }}>
      {value}
    </span>
  )
}

function StatusBadge({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const c = STATUS_COLORS[value] || { bg:'#f0f0f4', color:'#6a7380' }
  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      <div onClick={() => setOpen(o => !o)} style={{
        display:'inline-flex', alignItems:'center', gap:4,
        background:c.bg, borderRadius:20, padding:'4px 10px 4px 12px', cursor:'pointer',
      }}>
        <span style={{ fontSize:12, fontWeight:700, color:c.color, fontFamily:font }}>{value}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {open && (
        <div style={{
          position:'absolute', top:'110%', left:0, background:'#fff', borderRadius:10,
          boxShadow:'0 4px 20px rgba(0,0,0,0.12)', zIndex:50, minWidth:130, overflow:'hidden',
        }}>
          {Object.keys(STATUS_COLORS).map(s => (
            <div key={s}
              onClick={() => { onChange(s); setOpen(false) }}
              style={{
                padding:'10px 16px', fontFamily:font, fontSize:13, fontWeight:600,
                cursor:'pointer', color:STATUS_COLORS[s].color,
                background:'#fff', transition:'background 0.12s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#f6f6f9'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
            >
              {s}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StarIcon({ filled, onClick }) {
  return (
    <svg onClick={onClick} width="18" height="18" viewBox="0 0 24 24"
      fill={filled ? '#f4a261' : 'none'} stroke={filled ? '#f4a261' : '#d0d5dd'}
      strokeWidth="1.8" style={{ cursor:'pointer', flexShrink:0 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

/* ── Filter Modal ─────────────────────────────────────────────────────────── */
function FilterModal({ onClose, onSave }) {
  const [fromDate, setFromDate] = useState('12-03-2024')
  const [toDate,   setToDate]   = useState('12-03-2024')
  const [email,    setEmail]    = useState('')
  const [status,   setStatus]   = useState('')

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:200,
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        background:'#fff', borderRadius:20, padding:'32px', width:520,
        boxShadow:'0 8px 40px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#343434', margin:0 }}>Filter</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ marginBottom:24 }}>
          <p style={{ fontFamily:font, fontSize:14, fontWeight:700, color:'#343434', margin:'0 0 12px' }}>Date range</p>
          <div style={{ display:'flex', gap:16 }}>
            {[['From', fromDate, setFromDate], ['To', toDate, setToDate]].map(([label, val, set]) => (
              <div key={label} style={{ flex:1 }}>
                <label style={{ fontFamily:font, fontSize:12, color:'#6a7380', display:'block', marginBottom:6 }}>{label}</label>
                <input type="text" value={val} onChange={e => set(e.target.value)}
                  style={{
                    width:'100%', height:44, border:'1.5px solid #e0dff0', borderRadius:10,
                    padding:'0 14px', fontFamily:font, fontSize:14, color:'#343434',
                    outline:'none', boxSizing:'border-box',
                  }}/>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom:24 }}>
          <label style={{ fontFamily:font, fontSize:14, fontWeight:700, color:'#343434', display:'block', marginBottom:8 }}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email"
            style={{
              width:'100%', height:44, border:'1.5px solid #e0dff0', borderRadius:10,
              padding:'0 14px', fontFamily:font, fontSize:14, color:'#343434',
              outline:'none', boxSizing:'border-box',
            }}/>
        </div>

        <div style={{ marginBottom:32 }}>
          <label style={{ fontFamily:font, fontSize:14, fontWeight:700, color:'#343434', display:'block', marginBottom:8 }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{
              width:'100%', height:44, border:'1.5px solid #e0dff0', borderRadius:10,
              padding:'0 14px', fontFamily:font, fontSize:14, color:'#343434',
              outline:'none', background:'#fff', cursor:'pointer',
            }}>
            <option value="">All statuses</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Verified">Verified</option>
          </select>
        </div>

        <div style={{ display:'flex', gap:12 }}>
          <button onClick={onClose} style={{
            flex:1, height:48, background:'#f4f4f8', color:'#343434', border:'none',
            borderRadius:12, fontFamily:font, fontSize:15, fontWeight:600, cursor:'pointer',
          }}>
            Cancel
          </button>
          <button onClick={() => onSave({ fromDate, toDate, email, status })} style={{
            flex:1, height:48, background:'#156dbf', color:'#fff', border:'none',
            borderRadius:12, fontFamily:font, fontSize:15, fontWeight:600, cursor:'pointer',
          }}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Manage Columns Modal ─────────────────────────────────────────────────── */
function ManageColumnsModal({ visibleCols, onSave, onClose }) {
  const [cols, setCols] = useState(visibleCols)
  function toggle(col) {
    setCols(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col])
  }
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:200,
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        background:'#fff', borderRadius:20, padding:'32px', width:400,
        boxShadow:'0 8px 40px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#343434', margin:0 }}>Manage Columns</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        {ALL_COLUMNS.map(col => (
          <label key={col} style={{
            display:'flex', alignItems:'center', gap:12, padding:'12px 0',
            borderBottom:'1px solid #f4f4f8', cursor:'pointer',
          }}>
            <input type="checkbox" checked={cols.includes(col)} onChange={() => toggle(col)}
              style={{ width:18, height:18, cursor:'pointer' }}/>
            <span style={{ fontFamily:font, fontSize:14, fontWeight:500, color:'#343434' }}>{col}</span>
          </label>
        ))}
        <div style={{ display:'flex', gap:12, marginTop:24 }}>
          <button onClick={onClose} style={{
            flex:1, height:44, background:'#f4f4f8', color:'#343434', border:'none',
            borderRadius:10, fontFamily:font, fontSize:14, fontWeight:600, cursor:'pointer',
          }}>Cancel</button>
          <button onClick={() => onSave(cols)} style={{
            flex:1, height:44, background:'#156dbf', color:'#fff', border:'none',
            borderRadius:10, fontFamily:font, fontSize:14, fontWeight:600, cursor:'pointer',
          }}>Save</button>
        </div>
      </div>
    </div>
  )
}

/* ── Invite Modal ─────────────────────────────────────────────────────────── */
function InviteModal({ onClose, onSend }) {
  const [job,    setJob]    = useState('')
  const [email,  setEmail]  = useState('')
  const [note,   setNote]   = useState('')
  const [bold,   setBold]   = useState(false)
  const [italic, setItalic] = useState(false)

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:200,
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        background:'#fff', borderRadius:20, padding:'32px', width:520,
        boxShadow:'0 8px 40px rgba(0,0,0,0.15)',
      }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#343434', margin:0 }}>Invite to Role</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ fontFamily:font, fontSize:13, fontWeight:700, color:'#343434', display:'block', marginBottom:8 }}>
            Select Job Role
          </label>
          <select value={job} onChange={e => setJob(e.target.value)}
            style={{
              width:'100%', height:44, border:'1.5px solid #e0dff0', borderRadius:10,
              padding:'0 14px', fontFamily:font, fontSize:14, color:'#343434',
              outline:'none', background:'#fff', cursor:'pointer',
            }}>
            <option value="">Choose a job posting...</option>
            {MOCK_ACTIVE_JOBS.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>

        <div style={{ marginBottom:20 }}>
          <label style={{ fontFamily:font, fontSize:13, fontWeight:700, color:'#343434', display:'block', marginBottom:8 }}>
            Candidate Email
          </label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="candidate@email.com"
            style={{
              width:'100%', height:44, border:'1.5px solid #e0dff0', borderRadius:10,
              padding:'0 14px', fontFamily:font, fontSize:14, color:'#343434',
              outline:'none', boxSizing:'border-box',
            }}/>
        </div>

        <div style={{ marginBottom:28 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
            <label style={{ fontFamily:font, fontSize:13, fontWeight:700, color:'#343434' }}>Message</label>
            <div style={{ display:'flex', gap:6 }}>
              {[['B', setBold, bold], ['I', setItalic, italic]].map(([lbl, setter, active]) => (
                <button key={lbl} onClick={() => setter(p => !p)} style={{
                  width:28, height:28, borderRadius:6, border:'1.5px solid #e0dff0',
                  background: active ? '#156dbf' : '#fff', color: active ? '#fff' : '#6a7380',
                  fontFamily:font, fontSize:13, fontWeight:700, cursor:'pointer',
                }}>{lbl}</button>
              ))}
            </div>
          </div>
          <div style={{ border:'1.5px solid #e0dff0', borderRadius:12, overflow:'hidden' }}>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              placeholder="Hi! We came across your profile and think you'd be a great fit for our team. Let's chat!"
              style={{
                width:'100%', minHeight:120, border:'none', padding:'14px 16px',
                fontFamily:font, fontSize:14, color:'#343434', resize:'vertical',
                outline:'none', boxSizing:'border-box',
                fontWeight:bold ? 700 : 400, fontStyle:italic ? 'italic' : 'normal', lineHeight:1.6,
              }}/>
          </div>
        </div>

        <button onClick={() => onSend({ job, email, note })} style={{
          width:'100%', height:52, background:'#156dbf', color:'#fff', border:'none',
          borderRadius:14, fontFamily:font, fontSize:16, fontWeight:600, cursor:'pointer',
          boxShadow:'0 4px 12px rgba(21,109,191,0.25)',
        }}
          onMouseEnter={e => e.currentTarget.style.background = '#1259a0'}
          onMouseLeave={e => e.currentTarget.style.background = '#156dbf'}
        >
          Send Invitation
        </button>
      </div>
    </div>
  )
}

/* ── RAG Result Card ──────────────────────────────────────────────────────── */
function RagResultCard({ result, onViewProfile }) {
  const { candidate, matched_document, match_excerpt, relevance_score } = result
  const docLabel = DOC_TYPE_LABELS[matched_document?.document_type] || matched_document?.document_type || 'Document'
  const scorePercent = Math.round((relevance_score || 0) * 100)

  /* score colour: green ≥70, amber 40–69, grey <40 */
  const scoreColor = scorePercent >= 70 ? '#129578' : scorePercent >= 40 ? '#f26f37' : '#9ca3af'
  const scoreBg    = scorePercent >= 70 ? '#e8f5e9' : scorePercent >= 40 ? '#fff3e8' : '#f4f4f8'

  return (
    <div style={{
      background:'#fff', borderRadius:16, border:'1.5px solid #e8eaf0',
      padding:'20px 24px', transition:'box-shadow 0.15s',
      boxShadow:'0 1px 4px rgba(0,0,0,0.04)',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(21,109,191,0.10)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
    >
      {/* Top row — avatar + name + badges */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12, marginBottom:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <Avatar name={candidate?.full_name} size={44}/>
          <div>
            <div style={{ fontFamily:font, fontSize:16, fontWeight:700, color:'#1e1e1e' }}>
              {candidate?.full_name || 'Unknown Candidate'}
            </div>
            <div style={{ fontFamily:font, fontSize:13, color:'#6a7380', marginTop:2 }}>
              {candidate?.trade_category || '—'}
              {candidate?.nationality ? ` · ${candidate.nationality}` : ''}
              {candidate?.years_experience != null ? ` · ${candidate.years_experience} yrs exp` : ''}
            </div>
          </div>
        </div>

        {/* Relevance score pill */}
        <div style={{
          background:scoreBg, color:scoreColor, borderRadius:20, padding:'4px 12px',
          fontSize:12, fontWeight:700, fontFamily:font, whiteSpace:'nowrap', flexShrink:0,
        }}>
          {scorePercent}% match
        </div>
      </div>

      {/* Matched document badge */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#156dbf" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14 2 14 8 20 8"/>
        </svg>
        <span style={{
          fontFamily:font, fontSize:12, fontWeight:700, color:'#156dbf',
          background:'#e8f0ff', borderRadius:6, padding:'2px 8px',
        }}>
          {docLabel}
        </span>
        {matched_document?.file_name && (
          <span style={{ fontFamily:font, fontSize:12, color:'#9ca3af' }}>
            {matched_document.file_name}
          </span>
        )}
      </div>

      {/* Match excerpt */}
      {match_excerpt && (
        <div style={{
          background:'#f8f9ff', borderLeft:'3px solid #5379f4', borderRadius:'0 8px 8px 0',
          padding:'10px 14px', marginBottom:16,
        }}>
          <p style={{
            fontFamily:font, fontSize:13, color:'#343434', margin:0, lineHeight:1.6,
            fontStyle:'italic',
          }}>
            "{match_excerpt}"
          </p>
        </div>
      )}

      {/* View Profile button */}
      <button
        onClick={() => onViewProfile(result)}
        style={{
          height:36, padding:'0 20px', background:'#156dbf', color:'#fff', border:'none',
          borderRadius:9, fontFamily:font, fontSize:13, fontWeight:600, cursor:'pointer',
          transition:'background 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#1259a0'}
        onMouseLeave={e => e.currentTarget.style.background = '#156dbf'}
      >
        View Profile
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════════ */
export function CompanyFindCandidates() {
  const navigate   = useNavigate()
  const searchRef  = useRef(null)

  /* ── Regular candidate list state ── */
  const [user,        setUser]        = useState(null)
  const [candidates,  setCandidates]  = useState([])
  const [loading,     setLoading]     = useState(true)
  const [tab,         setTab]         = useState('Available Talent')
  const [viewMode,    setViewMode]    = useState('List')
  const [search,      setSearch]      = useState('')
  const [showSugg,    setShowSugg]    = useState(false)
  const [page,        setPage]        = useState(1)
  const [selected,    setSelected]    = useState({})
  const [starred,     setStarred]     = useState({})
  const [statuses,    setStatuses]    = useState({})
  const [visibleCols, setVisibleCols] = useState(ALL_COLUMNS)
  const [showFilter,  setShowFilter]  = useState(false)
  const [showCols,    setShowCols]    = useState(false)
  const [showInvite,  setShowInvite]  = useState(false)
  const [filters,     setFilters]     = useState({})

  /* ── RAG search state ── */
  const [isAiSearch,  setIsAiSearch]  = useState(false)   // AI mode toggle
  const [ragResults,  setRagResults]  = useState([])       // results from /rag/search
  const [ragLoading,  setRagLoading]  = useState(false)
  const [ragError,    setRagError]    = useState('')

  const ROWS_PER_PAGE = 10
  const totalPages    = 4

  /* ── Load regular candidates on mount ── */
  useEffect(() => {
    const token = getToken()
    if (!token) { setCandidates(MOCK_CANDIDATES); setLoading(false); return }
    getMe(token)
      .then(u => { setUser(u); return searchCandidates({}, token) })
      .then(data => {
        const list = Array.isArray(data) ? data : (data.items || [])
        setCandidates(list.length > 0 ? list : MOCK_CANDIDATES)
      })
      .catch(() => setCandidates(MOCK_CANDIDATES))
      .finally(() => setLoading(false))
  }, [])

  /* ── RAG search handler — called on Enter or search button click ── */
  async function handleRagSearch() {
    const term = search.trim()
    if (!term || term.length < 2) return

    const token = getToken()
    setRagLoading(true)
    setRagError('')
    setRagResults([])

    try {
      const payload = {
        search_term: term,
        top_k: 20,
      }
      const data = await ragSearch(payload, token)

      if (data.status === 'no_matches' || !data.results?.length) {
        setRagResults([])
        setRagError('No ingested documents matched your search. Ensure candidate documents have been uploaded and ingested into the AI index first.')
      } else {
        setRagResults(data.results)
      }
    } catch (err) {
      setRagError(err?.detail || 'AI search failed. Please try again.')
    } finally {
      setRagLoading(false)
    }
  }

  /* ── Toggle AI search mode — clears RAG results when turning off ── */
  function toggleAiSearch() {
    setIsAiSearch(prev => {
      if (prev) {
        setRagResults([])
        setRagError('')
      }
      return !prev
    })
  }

  /* ── Client-side filter for regular table ── */
  const filtered = candidates.filter(c => {
    if (tab === 'My Shortlist') return starred[c.id]
    if (!search || isAiSearch) return true
    return (c.trade_category || '').toLowerCase().includes(search.toLowerCase()) ||
           (c.full_name || '').toLowerCase().includes(search.toLowerCase())
  })

  const suggestions = TRADE_SUGGESTIONS.filter(s =>
    search && s.toLowerCase().includes(search.toLowerCase())
  )

  function toggleSelect(id) { setSelected(prev => ({ ...prev, [id]: !prev[id] })) }
  function toggleStar(id)   { setStarred(prev  => ({ ...prev, [id]: !prev[id] })) }
  function setStatus(id, v) { setStatuses(prev => ({ ...prev, [id]: v })) }

  /* ── Keyboard handler for search input ── */
  function onSearchKeyDown(e) {
    if (e.key === 'Enter' && isAiSearch) {
      e.preventDefault()
      setShowSugg(false)
      handleRagSearch()
    }
  }

  return (
    <CompanyLayout user={user}>

      {/* Modals */}
      {showFilter && (
        <FilterModal
          onClose={() => setShowFilter(false)}
          onSave={f => { setFilters(f); setShowFilter(false) }}
        />
      )}
      {showCols && (
        <ManageColumnsModal
          visibleCols={visibleCols}
          onSave={cols => { setVisibleCols(cols); setShowCols(false) }}
          onClose={() => setShowCols(false)}
        />
      )}
      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onSend={data => { alert(`Invitation sent to ${data.email}`); setShowInvite(false) }}
        />
      )}

      {/* Page heading */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:6 }}>
        <button onClick={() => navigate('/company/dashboard')}
          style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center', color:'#6a7380' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:0 }}>
            Find Skilled Candidates
          </h2>
          <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'4px 0 0' }}>
            Search and filter verified skilled workers available for Australian sponsorship.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20, marginTop:16 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding:'8px 20px', border:'none', borderRadius:20, cursor:'pointer',
            fontFamily:font, fontSize:14, fontWeight:600,
            background:t === tab ? '#156dbf' : '#fff',
            color:t === tab ? '#fff' : '#6a7380',
            transition:'all 0.15s',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Main card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'28px', boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>

        {/* Toolbar row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>

          {/* Left — title + display toggle */}
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#343434', margin:0 }}>
              Candidate Directory
            </h3>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:8 }}>
              <span style={{ fontFamily:font, fontSize:13, color:'#6a7380', fontWeight:500 }}>Display</span>
              {['Grid', 'List'].map(mode => (
                <label key={mode} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}>
                  <div style={{
                    width:18, height:18, borderRadius:'50%', border:'2px solid',
                    borderColor:viewMode === mode ? '#156dbf' : '#d0d5dd',
                    background:viewMode === mode ? '#156dbf' : '#fff',
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }} onClick={() => setViewMode(mode)}>
                    {viewMode === mode && <div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }}/>}
                  </div>
                  <span style={{ fontFamily:font, fontSize:13, color:'#343434', fontWeight:500 }}>{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>

            {/* Filter button */}
            <button onClick={() => setShowFilter(true)} style={{
              width:40, height:40, borderRadius:10, border:'1.5px solid #e0dff0',
              background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </button>

            {/* Manage columns button */}
            <button onClick={() => setShowCols(true)} style={{
              width:40, height:40, borderRadius:10, border:'1.5px solid #e0dff0',
              background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>

            {/* ── AI Search toggle + search bar ──────────────────────────── */}
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>

              {/* AI toggle button */}
              <button
                onClick={toggleAiSearch}
                title={isAiSearch ? 'Switch to regular search' : 'Switch to AI document search'}
                style={{
                  display:'flex', alignItems:'center', gap:6,
                  height:40, padding:'0 14px', borderRadius:10,
                  border: isAiSearch ? 'none' : '1.5px solid #e0dff0',
                  background: isAiSearch ? 'linear-gradient(135deg, #5379f4 0%, #156dbf 100%)' : '#fff',
                  color: isAiSearch ? '#fff' : '#6a7380',
                  cursor:'pointer', fontFamily:font, fontSize:13, fontWeight:600,
                  boxShadow: isAiSearch ? '0 2px 10px rgba(83,121,244,0.3)' : 'none',
                  transition:'all 0.2s',
                  whiteSpace:'nowrap',
                }}
              >
                {/* Sparkle / AI icon */}
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke={isAiSearch ? '#fff' : '#5379f4'} strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
                AI Search
              </button>

              {/* Search input */}
              <div style={{ position:'relative' }} ref={searchRef}>
                <div style={{
                  display:'flex', alignItems:'center', gap:8,
                  border: isAiSearch ? '1.5px solid #5379f4' : '1.5px solid #e0dff0',
                  borderRadius:10, padding:'8px 14px', background:'#fff',
                  width:280, boxShadow: isAiSearch ? '0 0 0 3px rgba(83,121,244,0.08)' : 'none',
                  transition:'border-color 0.2s, box-shadow 0.2s',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke={isAiSearch ? '#5379f4' : '#9ca3af'} strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setShowSugg(true) }}
                    onFocus={() => setShowSugg(true)}
                    onBlur={() => setTimeout(() => setShowSugg(false), 150)}
                    onKeyDown={onSearchKeyDown}
                    placeholder={isAiSearch
                      ? 'e.g. licensed electrician high voltage...'
                      : 'Search by trade, skill, or visa type...'}
                    style={{
                      border:'none', outline:'none', fontFamily:font, fontSize:13,
                      color:'#343434', background:'transparent', flex:1,
                    }}
                  />
                  {/* Search button — only visible in AI mode */}
                  {isAiSearch && search.trim().length >= 2 && (
                    <button
                      onClick={() => { setShowSugg(false); handleRagSearch() }}
                      style={{
                        background:'#5379f4', color:'#fff', border:'none', borderRadius:6,
                        padding:'4px 10px', fontFamily:font, fontSize:12, fontWeight:600,
                        cursor:'pointer', flexShrink:0,
                      }}
                    >
                      Search
                    </button>
                  )}
                </div>

                {/* Autocomplete suggestions (regular mode only) */}
                {showSugg && !isAiSearch && suggestions.length > 0 && (
                  <div style={{
                    position:'absolute', top:'110%', left:0, right:0, background:'#fff',
                    borderRadius:12, boxShadow:'0 4px 24px rgba(0,0,0,0.12)', zIndex:100,
                    overflow:'hidden', border:'1.5px solid #e0dff0',
                  }}>
                    {suggestions.map(s => (
                      <div key={s}
                        onMouseDown={() => { setSearch(s); setShowSugg(false) }}
                        style={{
                          padding:'10px 16px', fontFamily:font, fontSize:13, color:'#343434',
                          cursor:'pointer', transition:'background 0.1s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f4f4f8'}
                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* ── End AI Search + search bar ── */}

            {/* Invite button */}
            <button onClick={() => setShowInvite(true)} style={{
              height:40, padding:'0 18px', background:'#156dbf', color:'#fff', border:'none',
              borderRadius:10, fontFamily:font, fontSize:14, fontWeight:600, cursor:'pointer',
            }}>
              + Invite
            </button>
          </div>
        </div>

        {/* ── AI Search mode hint banner ── */}
        {isAiSearch && (
          <div style={{
            display:'flex', alignItems:'center', gap:10, padding:'10px 16px',
            background:'linear-gradient(135deg, #f0f3ff 0%, #e8f0ff 100%)',
            borderRadius:10, border:'1px solid #c7d4ff', marginBottom:16,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5379f4" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p style={{ fontFamily:font, fontSize:13, color:'#5379f4', margin:0, fontWeight:500 }}>
              <strong>AI Document Search is ON.</strong> Type a natural-language query and press Enter or click Search — the AI will scan resumes and credential documents across all candidates to find the best matches.
            </p>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            RAG SEARCH RESULTS — shown only in AI mode
        ════════════════════════════════════════════════════════════════════ */}
        {isAiSearch && (ragLoading || ragError || ragResults.length > 0) && (
          <div style={{ marginBottom:24 }}>

            {/* Loading state */}
            {ragLoading && (
              <div style={{
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                padding:'48px 0', gap:16,
              }}>
                {/* Spinner */}
                <div style={{
                  width:40, height:40, borderRadius:'50%',
                  border:'3px solid #e0dff0', borderTopColor:'#5379f4',
                  animation:'rag-spin 0.8s linear infinite',
                }}/>
                <style>{`@keyframes rag-spin { to { transform: rotate(360deg); } }`}</style>
                <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:0 }}>
                  Searching across candidate documents…
                </p>
              </div>
            )}

            {/* Error state */}
            {!ragLoading && ragError && (
              <div style={{
                display:'flex', alignItems:'flex-start', gap:12, padding:'16px 20px',
                background:'#fff8f6', borderRadius:12, border:'1.5px solid #fde4da',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f26f37" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <p style={{ fontFamily:font, fontSize:14, color:'#c0522a', margin:0, lineHeight:1.5 }}>
                  {ragError}
                </p>
              </div>
            )}

            {/* Results */}
            {!ragLoading && ragResults.length > 0 && (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5379f4" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <span style={{ fontFamily:font, fontSize:14, fontWeight:700, color:'#343434' }}>
                    {ragResults.length} candidate{ragResults.length !== 1 ? 's' : ''} matched
                  </span>
                  <span style={{ fontFamily:font, fontSize:13, color:'#9ca3af' }}>
                    — ranked by document relevance
                  </span>
                  <button
                    onClick={() => { setRagResults([]); setRagError(''); setSearch('') }}
                    style={{
                      marginLeft:'auto', background:'none', border:'none', cursor:'pointer',
                      fontFamily:font, fontSize:13, color:'#9ca3af', textDecoration:'underline',
                    }}
                  >
                    Clear results
                  </button>
                </div>

                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {ragResults.map((result, idx) => (
                    <RagResultCard
                      key={result.candidate_id || idx}
                      result={result}
                      onViewProfile={r => navigate(`/company/candidates/${r.candidate_id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════════
            REGULAR CANDIDATE TABLE / GRID
            Hidden when AI search has returned results — shown otherwise
        ════════════════════════════════════════════════════════════════════ */}
        {!(isAiSearch && ragResults.length > 0) && (
          viewMode === 'List' ? (
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ borderBottom:'1.5px solid #f0f0f4' }}>
                    <th style={{ width:40, padding:'10px 8px' }}>
                      <input type="checkbox" style={{ cursor:'pointer' }}
                        onChange={e => {
                          const sel = {}
                          if (e.target.checked) filtered.forEach(c => sel[c.id] = true)
                          setSelected(sel)
                        }}/>
                    </th>
                    {visibleCols.map(col => (
                      <th key={col} style={{
                        padding:'10px 12px', textAlign:'left', fontFamily:font,
                        fontSize:13, fontWeight:700, color:'#6a7380', whiteSpace:'nowrap',
                      }}>
                        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                          {col}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                            <polyline points="18 15 12 9 6 15"/>
                          </svg>
                        </div>
                      </th>
                    ))}
                    <th style={{ padding:'10px 12px', textAlign:'left', fontFamily:font, fontSize:13, fontWeight:700, color:'#6a7380' }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={visibleCols.length + 2}
                        style={{ textAlign:'center', padding:40, fontFamily:font, color:'#6a7380' }}>
                        Loading candidates…
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={visibleCols.length + 2}
                        style={{ textAlign:'center', padding:40, fontFamily:font, color:'#6a7380' }}>
                        No candidates found.
                      </td>
                    </tr>
                  ) : filtered.map(c => (
                    <tr key={c.id}
                      style={{ borderBottom:'1px solid #f8f8fc', transition:'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding:'14px 8px' }}>
                        <input type="checkbox" checked={!!selected[c.id]}
                          onChange={() => toggleSelect(c.id)} style={{ cursor:'pointer' }}/>
                      </td>

                      {visibleCols.includes('Candidate') && (
                        <td style={{ padding:'14px 12px' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                            <Avatar name={c.full_name}/>
                            <div>
                              <div style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434' }}>
                                {c.full_name}
                              </div>
                              <div style={{ fontFamily:font, fontSize:12, color:'#9ca3af' }}>
                                {c.email}
                              </div>
                            </div>
                            <StarIcon filled={!!starred[c.id]} onClick={() => toggleStar(c.id)}/>
                          </div>
                        </td>
                      )}

                      {visibleCols.includes('Primary Trade') && (
                        <td style={{ padding:'14px 12px', fontFamily:font, fontSize:14, color:'#343434' }}>
                          {c.trade_category || 'Industrial Electrician'}
                        </td>
                      )}

                      {visibleCols.includes('Experience') && (
                        <td style={{ padding:'14px 12px', fontFamily:font, fontSize:14, color:'#343434' }}>
                          {c.years_experience || 8} Years
                        </td>
                      )}

                      {visibleCols.includes('Visa Status') && (
                        <td style={{ padding:'14px 12px' }}>
                          <VisaBadge value={c.visa_status || '482 Eligible'}/>
                        </td>
                      )}

                      {visibleCols.includes('Status') && (
                        <td style={{ padding:'14px 12px' }}>
                          <StatusBadge
                            value={statuses[c.id] || c.status || 'Verified'}
                            onChange={val => setStatus(c.id, val)}
                          />
                        </td>
                      )}

                      <td style={{ padding:'14px 12px' }}>
                        <button style={{
                          width:32, height:32, borderRadius:8, border:'1.5px solid #e0dff0',
                          background:'#fff', cursor:'pointer',
                          display:'flex', alignItems:'center', justifyContent:'center',
                        }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#6a7380">
                            <circle cx="12" cy="5" r="1.5"/>
                            <circle cx="12" cy="12" r="1.5"/>
                            <circle cx="12" cy="19" r="1.5"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px, 1fr))', gap:16 }}>
              {loading ? (
                <p style={{ fontFamily:font, color:'#6a7380', gridColumn:'1/-1', textAlign:'center', padding:40 }}>
                  Loading candidates…
                </p>
              ) : filtered.length === 0 ? (
                <p style={{ fontFamily:font, color:'#6a7380', gridColumn:'1/-1', textAlign:'center', padding:40 }}>
                  No candidates found.
                </p>
              ) : filtered.map(c => {
                const st = statuses[c.id] || c.status || 'Verified'
                const sc = STATUS_COLORS[st] || { bg:'#f0f0f4', color:'#6a7380' }
                return (
                  <div key={c.id} style={{
                    background:'#f8f8fc', borderRadius:16, padding:'20px',
                    border:'1.5px solid #f0f0f4', transition:'box-shadow 0.15s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                  >
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                      <Avatar name={c.full_name} size={44}/>
                      <StarIcon filled={!!starred[c.id]} onClick={() => toggleStar(c.id)}/>
                    </div>
                    <div style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#343434', marginBottom:4 }}>
                      {c.full_name}
                    </div>
                    <div style={{ fontFamily:font, fontSize:13, color:'#6a7380', marginBottom:12 }}>
                      {c.trade_category || 'Industrial Electrician'}
                    </div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      <VisaBadge value={c.visa_status || '482 Eligible'}/>
                      <span style={{
                        background:sc.bg, color:sc.color, borderRadius:20, padding:'4px 10px',
                        fontSize:12, fontWeight:700, fontFamily:font,
                      }}>
                        {st}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {/* Pagination — hidden in AI search results mode */}
        {!(isAiSearch && ragResults.length > 0) && (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:24 }}>
            <p style={{ fontFamily:font, fontSize:13, color:'#6a7380', margin:0 }}>
              Showing {Math.min((page - 1) * ROWS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} candidates
            </p>
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  width:34, height:34, borderRadius:8, border:'1.5px solid #e0dff0',
                  background:'#fff', cursor:page === 1 ? 'not-allowed' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  opacity:page === 1 ? 0.4 : 1,
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{
                  width:34, height:34, borderRadius:8, fontFamily:font, fontSize:13, fontWeight:600,
                  border:'1.5px solid #e0dff0', cursor:'pointer',
                  background:p === page ? '#156dbf' : '#fff',
                  color:p === page ? '#fff' : '#343434',
                }}>
                  {p}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  width:34, height:34, borderRadius:8, border:'1.5px solid #e0dff0',
                  background:'#fff', cursor:page === totalPages ? 'not-allowed' : 'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  opacity:page === totalPages ? 0.4 : 1,
                }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        )}

      </div>
    </CompanyLayout>
  )
}