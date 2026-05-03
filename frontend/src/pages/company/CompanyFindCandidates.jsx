/**
 * CompanyFindCandidates — Find Skilled Candidates page.
 * Matches PDF design: table, Grid/List toggle, search autocomplete,
 * Filter modal, Manage Columns modal, Invite to Role modal, tabs, pagination.
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyLayout } from './CompanyLayout'
import { getToken, getMe, searchCandidates, submitEoiAsEmployer } from '../../services/api'

const font = "'Urbanist', sans-serif"

/* ── Mock data (fallback when API unavailable) ── */
const MOCK_CANDIDATES = [
  { id:'1', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'482 Eligible',   status:'Shortlisted', shortlisted:true  },
  { id:'2', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'Skilled Ind.',   status:'Shortlisted', shortlisted:false },
  { id:'3', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'Sponsor Required',status:'Verified',    shortlisted:false },
  { id:'4', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'Skilled Ind.',   status:'Shortlisted', shortlisted:false },
  { id:'5', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'482 Eligible',   status:'Verified',    shortlisted:false },
  { id:'6', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'Sponsor Required',status:'Verified',    shortlisted:false },
  { id:'7', full_name:'John Doe', email:'john.doe@gmail.com', trade_category:'Industrial Electrician', years_experience:8, visa_status:'482 Eligible',   status:'Shortlisted', shortlisted:false },
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
  '482 Eligible':    { bg:'#e8f5e9', color:'#129578' },
  'Skilled Ind.':    { bg:'#e8ecff', color:'#5379f4' },
  'Sponsor Required':{ bg:'#343434', color:'#fff'     },
}

const STATUS_COLORS = {
  'Shortlisted': { bg:'#fff3e8', color:'#f26f37' },
  'Verified':    { bg:'#e8f5e9', color:'#129578' },
}

const ALL_COLUMNS = ['Candidate','Primary Trade','Experience','Visa Status','Status']

/* ── Small helpers ── */
function Avatar({ name, size=36 }) {
  const initials = (name||'U').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
  const colors = ['#5379f4','#f26f37','#129578','#403c8b','#156dbf']
  const bg = colors[(name||'').charCodeAt(0)%colors.length]
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:bg, display:'flex',
      alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700,
      fontSize:size*0.38, fontFamily:font, flexShrink:0 }}>
      {initials}
    </div>
  )
}

function VisaBadge({ value }) {
  const c = VISA_COLORS[value] || { bg:'#f0f0f4', color:'#6a7380' }
  return (
    <span style={{ background:c.bg, color:c.color, borderRadius:20, padding:'4px 10px',
      fontSize:12, fontWeight:700, fontFamily:font, whiteSpace:'nowrap' }}>
      {value}
    </span>
  )
}

function StatusBadge({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const c = STATUS_COLORS[value] || { bg:'#f0f0f4', color:'#6a7380' }
  return (
    <div style={{ position:'relative', display:'inline-block' }}>
      <div onClick={() => setOpen(o=>!o)} style={{ display:'inline-flex', alignItems:'center',
        gap:4, background:c.bg, borderRadius:20, padding:'4px 10px 4px 12px', cursor:'pointer' }}>
        <span style={{ fontSize:12, fontWeight:700, color:c.color, fontFamily:font }}>{value}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      {open && (
        <div style={{ position:'absolute', top:'110%', left:0, background:'#fff', borderRadius:10,
          boxShadow:'0 4px 20px rgba(0,0,0,0.12)', zIndex:50, minWidth:130, overflow:'hidden' }}>
          {Object.keys(STATUS_COLORS).map(s => (
            <div key={s} onClick={() => { onChange(s); setOpen(false) }}
              style={{ padding:'10px 16px', fontFamily:font, fontSize:13, fontWeight:600,
                cursor:'pointer', color: STATUS_COLORS[s].color,
                background:'#fff', transition:'background 0.12s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#f6f6f9'}
              onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
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
      fill={filled?'#f4a261':'none'} stroke={filled?'#f4a261':'#d0d5dd'}
      strokeWidth="1.8" style={{ cursor:'pointer', flexShrink:0 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  )
}

/* ── Filter Modal ── */
function FilterModal({ onClose, onSave }) {
  const [fromDate, setFromDate] = useState('12-03-2024')
  const [toDate,   setToDate]   = useState('12-03-2024')
  const [email,    setEmail]    = useState('')
  const [status,   setStatus]   = useState('')

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:200,
      display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:20, padding:'32px', width:520,
        boxShadow:'0 8px 40px rgba(0,0,0,0.15)' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#343434', margin:0 }}>Filter</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Date range */}
        <div style={{ marginBottom:24 }}>
          <p style={{ fontFamily:font, fontSize:14, fontWeight:700, color:'#343434', margin:'0 0 12px' }}>Date range</p>
          <div style={{ display:'flex', gap:16 }}>
            {[['From', fromDate, setFromDate], ['To', toDate, setToDate]].map(([label, val, set]) => (
              <div key={label} style={{ flex:1 }}>
                <label style={{ fontFamily:font, fontSize:12, color:'#6a7380', display:'block', marginBottom:6 }}>{label}</label>
                <div style={{ position:'relative' }}>
                  <input type="text" value={val} onChange={e=>set(e.target.value)}
                    style={{ width:'100%', height:44, border:'1.5px solid #e0dff0', borderRadius:10,
                      padding:'0 40px 0 14px', fontFamily:font, fontSize:14, color:'#343434',
                      boxSizing:'border-box', outline:'none' }}/>
                  <svg style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
                    width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Name / Email */}
        <div style={{ marginBottom:20 }}>
          <p style={{ fontFamily:font, fontSize:14, fontWeight:700, color:'#343434', margin:'0 0 8px' }}>Name / Email</p>
          <div style={{ position:'relative' }}>
            <select value={email} onChange={e=>setEmail(e.target.value)}
              style={{ width:'100%', height:44, border:'1.5px solid #e0dff0', borderRadius:10,
                padding:'0 40px 0 14px', fontFamily:font, fontSize:14, color: email?'#343434':'#9ca3af',
                appearance:'none', background:'#fff', outline:'none', boxSizing:'border-box' }}>
              <option value="">Select Email</option>
              {MOCK_CANDIDATES.map(c=>(
                <option key={c.id} value={c.email}>{c.email}</option>
              ))}
            </select>
            <svg style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        {/* Status */}
        <div style={{ marginBottom:32 }}>
          <p style={{ fontFamily:font, fontSize:14, fontWeight:700, color:'#343434', margin:'0 0 8px' }}>Status</p>
          <div style={{ position:'relative' }}>
            <select value={status} onChange={e=>setStatus(e.target.value)}
              style={{ width:'100%', height:44, border:'1.5px solid #e0dff0', borderRadius:10,
                padding:'0 40px 0 14px', fontFamily:font, fontSize:14, color: status?'#343434':'#9ca3af',
                appearance:'none', background:'#fff', outline:'none', boxSizing:'border-box' }}>
              <option value="">Select Status</option>
              <option>Shortlisted</option>
              <option>Verified</option>
            </select>
            <svg style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={()=>onSave({ fromDate, toDate, email, status })}
            style={{ flex:1, height:48, background:'#156dbf', color:'#fff', border:'none',
              borderRadius:12, fontFamily:font, fontSize:15, fontWeight:600, cursor:'pointer' }}>
            Save
          </button>
          <button onClick={()=>{ setFromDate(''); setToDate(''); setEmail(''); setStatus('') }}
            style={{ flex:1, height:48, background:'#fff', color:'#343434', border:'1.5px solid #e0dff0',
              borderRadius:12, fontFamily:font, fontSize:15, fontWeight:600, cursor:'pointer' }}>
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Manage Columns Modal ── */
function ManageColumnsModal({ visibleCols, onSave, onClose }) {
  const [cols, setCols] = useState([...visibleCols])
  const toggle = col => setCols(prev => prev.includes(col) ? prev.filter(c=>c!==col) : [...prev, col])

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:200,
      display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:20, padding:'32px', width:480,
        boxShadow:'0 8px 40px rgba(0,0,0,0.15)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
          <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#343434', margin:0 }}>Manage Columns</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:4, marginBottom:28 }}>
          {ALL_COLUMNS.map(col => (
            <div key={col} onClick={()=>toggle(col)}
              style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'14px 16px', border:'1.5px solid #e0dff0', borderRadius:12,
                cursor:'pointer', marginBottom:4,
                background: cols.includes(col) ? '#f0f4ff' : '#fff' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:20, height:20, borderRadius:6, border:'2px solid',
                  borderColor: cols.includes(col) ? '#5379f4' : '#d0d5dd',
                  background: cols.includes(col) ? '#5379f4' : '#fff',
                  display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {cols.includes(col) && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </div>
                <span style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434' }}>{col}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d0d5dd" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <button onClick={()=>onSave(cols)}
            style={{ flex:1, height:48, background:'#156dbf', color:'#fff', border:'none',
              borderRadius:12, fontFamily:font, fontSize:15, fontWeight:600, cursor:'pointer' }}>
            Save
          </button>
          <button onClick={onClose}
            style={{ flex:1, height:48, background:'#fff', color:'#343434',
              border:'1.5px solid #e0dff0', borderRadius:12, fontFamily:font, fontSize:15, fontWeight:600, cursor:'pointer' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Invite to Role Modal ── */
function InviteModal({ onClose, onSend }) {
  const [job,   setJob]   = useState('')
  const [email, setEmail] = useState('')
  const [note,  setNote]  = useState('')
  const [bold,  setBold]  = useState(false)
  const [italic,setItalic]= useState(false)

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:200,
      display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:'#fff', borderRadius:20, padding:'36px', width:620,
        boxShadow:'0 8px 40px rgba(0,0,0,0.15)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
          <h3 style={{ fontFamily:font, fontSize:22, fontWeight:700, color:'#343434', margin:0 }}>Invite to Job Opening</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', padding:4 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Select Active Job */}
        <div style={{ marginBottom:20 }}>
          <label style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434', display:'block', marginBottom:8 }}>
            Select Active Job
          </label>
          <div style={{ position:'relative' }}>
            <select value={job} onChange={e=>setJob(e.target.value)}
              style={{ width:'100%', height:48, border:'1.5px solid #e0dff0', borderRadius:12,
                padding:'0 40px 0 16px', fontFamily:font, fontSize:14,
                color: job?'#343434':'#9ca3af', appearance:'none', background:'#fff',
                outline:'none', boxSizing:'border-box' }}>
              <option value="">Select from active jobs (eg., Licensed A-Grade Electrician - Sydney)</option>
              {MOCK_ACTIVE_JOBS.map(j=><option key={j} value={j}>{j}</option>)}
            </select>
            <svg style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        {/* Email */}
        <div style={{ marginBottom:20 }}>
          <label style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434', display:'block', marginBottom:8 }}>
            Email Address
          </label>
          <input value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="Enter email address"
            style={{ width:'100%', height:48, border:'1.5px solid #e0dff0', borderRadius:12,
              padding:'0 16px', fontFamily:font, fontSize:14, color:'#343434',
              outline:'none', boxSizing:'border-box' }}/>
        </div>

        {/* Personal Note */}
        <div style={{ marginBottom:32 }}>
          <label style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434', display:'block', marginBottom:8 }}>
            Add a Personal Note <span style={{ color:'#9ca3af', fontWeight:400 }}>(Optional)</span>
          </label>
          {/* Rich text toolbar */}
          <div style={{ border:'1.5px solid #e0dff0', borderRadius:12, overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', gap:2, padding:'8px 12px',
              borderBottom:'1px solid #f0f0f4', background:'#fafafa' }}>
              {[
                { label:'B', style:{ fontWeight:700 }, action:()=>setBold(b=>!b), active:bold },
                { label:'I', style:{ fontStyle:'italic' }, action:()=>setItalic(i=>!i), active:italic },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action}
                  style={{ width:28, height:28, borderRadius:6, border:'none', cursor:'pointer',
                    fontFamily:font, fontSize:13, ...btn.style,
                    background: btn.active ? '#e8ecff' : 'transparent',
                    color: btn.active ? '#5379f4' : '#6a7380' }}>
                  {btn.label}
                </button>
              ))}
              <div style={{ width:1, height:18, background:'#e0dff0', margin:'0 6px' }}/>
              {['≡', '⊘', '⊡'].map((icon,i) => (
                <button key={i} style={{ width:28, height:28, borderRadius:6, border:'none',
                  cursor:'pointer', background:'transparent', color:'#6a7380', fontSize:14 }}>
                  {icon}
                </button>
              ))}
            </div>
            <textarea value={note} onChange={e=>setNote(e.target.value)}
              placeholder="Hi Samuel, we reviewed your profile and think you'd be a great fit for our Sydney industrial project. Let's chat!"
              style={{ width:'100%', minHeight:120, border:'none', padding:'14px 16px',
                fontFamily:font, fontSize:14, color:'#343434', resize:'vertical',
                outline:'none', boxSizing:'border-box',
                fontWeight: bold?700:400, fontStyle: italic?'italic':'normal',
                lineHeight:1.6 }}/>
          </div>
        </div>

        <button onClick={()=>onSend({ job, email, note })}
          style={{ width:'100%', height:52, background:'#156dbf', color:'#fff', border:'none',
            borderRadius:14, fontFamily:font, fontSize:16, fontWeight:600, cursor:'pointer',
            boxShadow:'0 4px 12px rgba(21,109,191,0.25)' }}
          onMouseEnter={e=>e.currentTarget.style.background='#1259a0'}
          onMouseLeave={e=>e.currentTarget.style.background='#156dbf'}>
          Send Invitation
        </button>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export function CompanyFindCandidates() {
  const navigate = useNavigate()
  const searchRef = useRef(null)

  const [user,       setUser]       = useState(null)
  const [candidates, setCandidates] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [tab,        setTab]        = useState('Available Talent')
  const [viewMode,   setViewMode]   = useState('List')  // 'Grid' | 'List'
  const [search,     setSearch]     = useState('')
  const [showSugg,   setShowSugg]   = useState(false)
  const [page,       setPage]       = useState(1)
  const [selected,   setSelected]   = useState({})
  const [starred,    setStarred]    = useState({})
  const [statuses,   setStatuses]   = useState({})
  const [visibleCols,setVisibleCols]= useState(ALL_COLUMNS)
  const [showFilter, setShowFilter] = useState(false)
  const [showCols,   setShowCols]   = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [filters,    setFilters]    = useState({})

  const ROWS_PER_PAGE = 10
  const totalPages = 4

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

  const filtered = candidates.filter(c => {
    if (tab === 'My Shortlist') return starred[c.id]
    if (!search) return true
    return (c.trade_category||'').toLowerCase().includes(search.toLowerCase()) ||
           (c.full_name||'').toLowerCase().includes(search.toLowerCase())
  })

  const suggestions = TRADE_SUGGESTIONS.filter(s =>
    search && s.toLowerCase().includes(search.toLowerCase())
  )

  function toggleSelect(id) {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }))
  }
  function toggleStar(id) {
    setStarred(prev => ({ ...prev, [id]: !prev[id] }))
  }
  function setStatus(id, val) {
    setStatuses(prev => ({ ...prev, [id]: val }))
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
          <h2 style={{ fontFamily:font, fontSize:28, fontWeight:700, color:'#1e1e1e', margin:0 }}>Find Skilled Candidates</h2>
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
            background: t===tab ? '#156dbf' : '#fff',
            color: t===tab ? '#fff' : '#6a7380',
            transition:'all 0.15s',
          }}>
            {t}
          </button>
        ))}
      </div>

      {/* Main card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'28px',
        boxShadow:'0 2px 16px rgba(0,0,0,0.06)' }}>

        {/* Table header row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#343434', margin:0 }}>
              Candidate Directory
            </h3>
            {/* Display toggle */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginLeft:8 }}>
              <span style={{ fontFamily:font, fontSize:13, color:'#6a7380', fontWeight:500 }}>Display</span>
              {['Grid','List'].map(mode => (
                <label key={mode} style={{ display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', border:'2px solid',
                    borderColor: viewMode===mode ? '#156dbf' : '#d0d5dd',
                    background: viewMode===mode ? '#156dbf' : '#fff',
                    display:'flex', alignItems:'center', justifyContent:'center' }}
                    onClick={()=>setViewMode(mode)}>
                    {viewMode===mode && <div style={{ width:7, height:7, borderRadius:'50%', background:'#fff' }}/>}
                  </div>
                  <span style={{ fontFamily:font, fontSize:13, color:'#343434', fontWeight:500 }}>{mode}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {/* Filter button */}
            <button onClick={() => setShowFilter(true)}
              style={{ width:40, height:40, borderRadius:10, border:'1.5px solid #e0dff0',
                background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </button>
            {/* Manage columns button */}
            <button onClick={() => setShowCols(true)}
              style={{ width:40, height:40, borderRadius:10, border:'1.5px solid #e0dff0',
                background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>

            {/* Search with autocomplete */}
            <div style={{ position:'relative' }} ref={searchRef}>
              <div style={{ display:'flex', alignItems:'center', gap:8, border:'1.5px solid #e0dff0',
                borderRadius:10, padding:'8px 14px', background:'#fff', width:260 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input value={search} onChange={e=>{ setSearch(e.target.value); setShowSugg(true) }}
                  onFocus={()=>setShowSugg(true)}
                  onBlur={()=>setTimeout(()=>setShowSugg(false),150)}
                  placeholder="Search by trade, skill, or visa type..."
                  style={{ border:'none', outline:'none', fontFamily:font, fontSize:13,
                    color:'#343434', background:'transparent', flex:1 }}/>
              </div>
              {/* Suggestions dropdown */}
              {showSugg && suggestions.length > 0 && (
                <div style={{ position:'absolute', top:'110%', left:0, right:0, background:'#fff',
                  borderRadius:12, boxShadow:'0 4px 24px rgba(0,0,0,0.12)', zIndex:100,
                  overflow:'hidden', border:'1.5px solid #e0dff0' }}>
                  <div style={{ padding:'10px 14px', borderBottom:'1px solid #f0f0f4' }}>
                    <span style={{ fontFamily:font, fontSize:12, fontWeight:700, color:'#6a7380',
                      textTransform:'uppercase', letterSpacing:0.5 }}>Suggested Words</span>
                  </div>
                  {suggestions.map(s => (
                    <div key={s} onMouseDown={()=>{ setSearch(s); setShowSugg(false) }}
                      style={{ padding:'11px 16px', fontFamily:font, fontSize:14, color:'#343434',
                        cursor:'pointer', transition:'background 0.12s' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#f6f6f9'}
                      onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button style={{ height:40, padding:'0 16px', background:'#fff', border:'1.5px solid #e0dff0',
              borderRadius:10, fontFamily:font, fontSize:13, fontWeight:600, color:'#343434', cursor:'pointer' }}>
              Export List
            </button>
            <button onClick={() => setShowInvite(true)}
              style={{ height:40, padding:'0 18px', background:'#156dbf', border:'none',
                borderRadius:10, fontFamily:font, fontSize:13, fontWeight:600, color:'#fff',
                cursor:'pointer', whiteSpace:'nowrap' }}>
              Invite to Role
            </button>
          </div>
        </div>

        {/* Table */}
        {viewMode === 'List' ? (
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1.5px solid #f0f0f4' }}>
                  <th style={{ width:40, padding:'10px 8px' }}>
                    <input type="checkbox" style={{ cursor:'pointer' }}
                      onChange={e => {
                        const sel = {}
                        if (e.target.checked) filtered.forEach(c => sel[c.id]=true)
                        setSelected(sel)
                      }}/>
                  </th>
                  {visibleCols.map(col => (
                    <th key={col} style={{ padding:'10px 12px', textAlign:'left', fontFamily:font,
                      fontSize:13, fontWeight:700, color:'#6a7380', whiteSpace:'nowrap' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                        {col}
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                          <polyline points="18 15 12 9 6 15"/>
                        </svg>
                      </div>
                    </th>
                  ))}
                  <th style={{ padding:'10px 12px', textAlign:'left', fontFamily:font,
                    fontSize:13, fontWeight:700, color:'#6a7380' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={visibleCols.length+2} style={{ textAlign:'center', padding:40,
                    fontFamily:font, color:'#6a7380' }}>Loading candidates...</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={visibleCols.length+2} style={{ textAlign:'center', padding:40,
                    fontFamily:font, color:'#6a7380' }}>No candidates found.</td></tr>
                ) : filtered.map(c => (
                  <tr key={c.id} style={{ borderBottom:'1px solid #f8f8fc', transition:'background 0.1s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#fafafa'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'14px 8px' }}>
                      <input type="checkbox" checked={!!selected[c.id]}
                        onChange={()=>toggleSelect(c.id)} style={{ cursor:'pointer' }}/>
                    </td>
                    {visibleCols.includes('Candidate') && (
                      <td style={{ padding:'14px 12px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <Avatar name={c.full_name} size={36}/>
                          <div>
                            <div style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434' }}>
                              {c.full_name || 'John Doe'}
                            </div>
                            <div style={{ fontFamily:font, fontSize:12, color:'#9ca3af' }}>
                              {c.email || 'john.doe@gmail.com'}
                            </div>
                          </div>
                          <StarIcon filled={!!starred[c.id]} onClick={()=>toggleStar(c.id)}/>
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
                        <StatusBadge value={statuses[c.id] || c.status || 'Verified'}
                          onChange={val=>setStatus(c.id, val)}/>
                      </td>
                    )}
                    <td style={{ padding:'14px 12px' }}>
                      <button style={{ width:32, height:32, borderRadius:8, border:'1.5px solid #e0dff0',
                        background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#6a7380">
                          <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
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
            {filtered.map(c => {
              const st = statuses[c.id] || c.status || 'Verified'
              const sc = STATUS_COLORS[st] || { bg:'#f0f0f4', color:'#6a7380' }
              return (
                <div key={c.id} style={{ background:'#f8f8fc', borderRadius:16, padding:'20px',
                  border:'1.5px solid #f0f0f4', transition:'box-shadow 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,0.08)'}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                    <Avatar name={c.full_name} size={44}/>
                    <StarIcon filled={!!starred[c.id]} onClick={()=>toggleStar(c.id)}/>
                  </div>
                  <div style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#343434', marginBottom:4 }}>
                    {c.full_name || 'John Doe'}
                  </div>
                  <div style={{ fontFamily:font, fontSize:12, color:'#9ca3af', marginBottom:10 }}>
                    {c.email || 'john.doe@gmail.com'}
                  </div>
                  <div style={{ fontFamily:font, fontSize:13, color:'#6a7380', marginBottom:6 }}>
                    {c.trade_category || 'Industrial Electrician'} · {c.years_experience || 8} Yrs
                  </div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    <VisaBadge value={c.visa_status || '482 Eligible'}/>
                    <span style={{ background:sc.bg, color:sc.color, borderRadius:20, padding:'4px 10px',
                      fontSize:12, fontWeight:700, fontFamily:font }}>{st}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontFamily:font, fontSize:13, color:'#6a7380' }}>Rows per page</span>
            <select defaultValue="10" style={{ height:32, border:'1.5px solid #e0dff0', borderRadius:8,
              fontFamily:font, fontSize:13, padding:'0 8px', outline:'none' }}>
              <option>10</option><option>25</option><option>50</option>
            </select>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))}
              style={{ width:32, height:32, borderRadius:8, border:'1.5px solid #e0dff0',
                background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            {[1,2,3,4].map(p => (
              <button key={p} onClick={()=>setPage(p)}
                style={{ width:32, height:32, borderRadius:8, cursor:'pointer',
                  fontFamily:font, fontSize:13, fontWeight:600,
                  background: page===p ? '#156dbf' : '#fff',
                  color: page===p ? '#fff' : '#6a7380',
                  border: page===p ? 'none' : '1.5px solid #e0dff0' }}>
                {p}
              </button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))}
              style={{ width:32, height:32, borderRadius:8, border:'1.5px solid #e0dff0',
                background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </CompanyLayout>
  )
}