/**
 * CompanyFindCandidates — Find & filter skilled candidates.
 * Figma node 1-5665: Candidate Directory table, tabs, visa status badges.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CompanyLayout } from './CompanyLayout'
import { getToken, getMe, getMyCompany, searchCandidates } from '../../services/api'
import { MOCK_COMPANY_USER, MOCK_COMPANY, MOCK_CANDIDATES } from './companyMockData'

const font = "'Urbanist', sans-serif"

const VISA_COLORS = {
  '482 Eligible':    { bg:'#e8f5e9', color:'#129578' },
  'Skilled Ind.':    { bg:'#e8ecff', color:'#5379f4' },
  'Sponsor Required':{ bg:'#1a2340', color:'#fff'    },
}

const STATUS_COLORS = {
  'Shortlisted': { bg:'#fff3e8', color:'#f26f37' },
  'Verified':    { bg:'#e8f5e9', color:'#129578' },
}

function Avatar({ name, size=36 }) {
  const initials = (name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2)
  const colors = ['#5379f4','#f26f37','#129578','#403c8b','#156dbf']
  const bg = colors[(name || '').charCodeAt(0) % colors.length]
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:size*0.38, fontFamily:font, flexShrink:0 }}>
      {initials}
    </div>
  )
}

function Badge({ label, colors }) {
  const c = colors[label] || { bg:'#f0f0f4', color:'#6a7380' }
  return (
    <span style={{ background:c.bg, color:c.color, borderRadius:20, padding:'3px 12px', fontSize:12, fontWeight:600, fontFamily:font, whiteSpace:'nowrap' }}>
      {label}
    </span>
  )
}

function StatusDropdown({ value }) {
  const c = STATUS_COLORS[value] || { bg:'#f0f0f4', color:'#6a7380' }
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:4, background:c.bg, borderRadius:20, padding:'3px 10px 3px 12px', cursor:'pointer' }}>
      <span style={{ fontSize:12, fontWeight:600, color:c.color, fontFamily:font }}>{value}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={c.color} strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
  )
}

const TABS = ['Available Talent', 'My Shortlist']

export function CompanyFindCandidates() {
  const navigate = useNavigate()
  const [user, setUser]         = useState(null)
  const [company, setCompany]   = useState(null)
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState('Available Talent')
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState({})
  const [rowsPerPage] = useState(10)
  const [page, setPage]         = useState(1)

  useEffect(() => {
    const token = getToken()
    if (!token) { setUser(MOCK_COMPANY_USER); setCompany(MOCK_COMPANY); setCandidates(MOCK_CANDIDATES); setLoading(false); return }
    Promise.all([getMe(token), getMyCompany(token).catch(() => null)])
      .then(([u, c]) => {
        setUser(u); setCompany(c || MOCK_COMPANY)
        return searchCandidates({}, token).catch(() => ({ items: [] }))
      })
      .then(data => {
        const list = Array.isArray(data) ? data : (data.items || data.candidates || [])
        setCandidates(list.length > 0 ? list : MOCK_CANDIDATES)
      })
      .catch(() => { setUser(MOCK_COMPANY_USER); setCompany(MOCK_COMPANY); setCandidates(MOCK_CANDIDATES) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = candidates.filter(c => {
    const q = search.toLowerCase()
    return !q || (c.full_name || '').toLowerCase().includes(q) || (c.trade_type || '').toLowerCase().includes(q)
  })

  function toggleAll(e) {
    if (e.target.checked) {
      const s = {}; filtered.forEach(c => { s[c.id] = true }); setSelected(s)
    } else setSelected({})
  }

  return (
    <CompanyLayout user={user} company={company}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
        <button onClick={() => navigate('/company/dashboard')} style={{ background:'none', border:'none', cursor:'pointer', padding:0, color:'#6a7380', display:'flex' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div>
          <h2 style={{ fontFamily:font, fontSize:26, fontWeight:700, color:'#1e1e1e', margin:0 }}>Find Skilled Candidates</h2>
          <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'4px 0 0' }}>Search and filter verified skilled workers available for Australian sponsorship.</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:20 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding:'8px 20px', border: t === tab ? '2px solid #5379f4' : '2px solid transparent', borderRadius:20, cursor:'pointer', fontFamily:font, fontSize:14, fontWeight:600, background: t === tab ? '#e8ecff' : '#fff', color: t === tab ? '#5379f4' : '#6a7380', transition:'all 0.15s' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Table card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'24px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
        {/* Table header row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <span style={{ fontFamily:font, fontSize:18, fontWeight:700, color:'#1e1e1e' }}>Candidate Directory</span>
            <div style={{ display:'flex', gap:8 }}>
              <span style={{ fontFamily:font, fontSize:13, color:'#6a7380', fontWeight:600 }}>Display</span>
              {['Grid','List'].map(v => (
                <label key={v} style={{ display:'flex', alignItems:'center', gap:4, cursor:'pointer', fontFamily:font, fontSize:13, color:'#343434' }}>
                  <input type="radio" name="view" defaultChecked={v==='List'} style={{ accentColor:'#5379f4' }}/> {v}
                </label>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {/* Filter / Columns icons */}
            {[
              <svg key="f" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="1.8" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
              <svg key="c" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="1.8" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            ].map((icon, i) => (
              <div key={i} style={{ width:36, height:36, borderRadius:8, border:'1px solid #d0d5dd', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{icon}</div>
            ))}
            <div style={{ display:'flex', alignItems:'center', gap:8, border:'1px solid #d0d5dd', borderRadius:10, padding:'8px 14px', minWidth:200 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input placeholder="Search by trade, skill, or visa type..." value={search} onChange={e => setSearch(e.target.value)}
                style={{ border:'none', outline:'none', fontFamily:font, fontSize:13, color:'#343434', background:'transparent', flex:1 }}/>
            </div>
            <button style={{ height:36, padding:'0 16px', background:'transparent', border:'1.5px solid #d0d5dd', borderRadius:10, cursor:'pointer', fontFamily:font, fontSize:13, fontWeight:600, color:'#343434' }}>
              Export List
            </button>
            <button style={{ height:36, padding:'0 16px', background:'#156dbf', color:'#fff', border:'none', borderRadius:10, cursor:'pointer', fontFamily:font, fontSize:13, fontWeight:600 }}
              onMouseEnter={e => e.currentTarget.style.background='#1259a0'} onMouseLeave={e => e.currentTarget.style.background='#156dbf'}>
              Invite to Role
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:font }}>
            <thead>
              <tr style={{ borderBottom:'2px solid #f0f0f4' }}>
                <th style={{ width:40, padding:'12px 8px' }}><input type="checkbox" onChange={toggleAll} style={{ accentColor:'#5379f4' }}/></th>
                {['Candidate','Primary Trade','Experience','Visa Status','Status','Action'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:13, fontWeight:700, color:'#6a7380', whiteSpace:'nowrap' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                      {h}
                      {h !== 'Action' && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M7 15l5 5 5-5M7 9l5-5 5 5"/></svg>}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#9ca3af', fontFamily:font }}>Loading…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ padding:40, textAlign:'center', color:'#9ca3af', fontFamily:font }}>No candidates found.</td></tr>
              ) : filtered.map((c, i) => (
                <tr key={c.id} style={{ borderBottom:'1px solid #f8f8fc', transition:'background 0.1s' }}
                  onMouseEnter={e => e.currentTarget.style.background='#fafafa'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'14px 8px' }}><input type="checkbox" checked={!!selected[c.id]} onChange={ev => setSelected(s => ({ ...s, [c.id]: ev.target.checked }))} style={{ accentColor:'#5379f4' }}/></td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <Avatar name={c.full_name} />
                      <div>
                        <div style={{ fontSize:14, fontWeight:600, color:'#1e1e1e' }}>{c.full_name}</div>
                        <div style={{ fontSize:12, color:'#9ca3af' }}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px', fontSize:14, color:'#343434' }}>{c.trade_type}</td>
                  <td style={{ padding:'14px 16px', fontSize:14, color:'#343434' }}>{c.years_experience} Years</td>
                  <td style={{ padding:'14px 16px' }}><Badge label={c.visa_status || '482 Eligible'} colors={VISA_COLORS}/></td>
                  <td style={{ padding:'14px 16px' }}><StatusDropdown value={c.status || 'Shortlisted'}/></td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ width:28, height:28, borderRadius:6, border:'1px solid #d0d5dd', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:20, paddingTop:16, borderTop:'1px solid #f0f0f4' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:font, fontSize:13, color:'#6a7380' }}>
            <span>Rows per page</span>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ fontWeight:600, color:'#343434' }}>{rowsPerPage}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            {['‹', 1, 2, 3, 4, '›'].map((p, i) => (
              <button key={i} onClick={() => typeof p === 'number' && setPage(p)}
                style={{ width:32, height:32, borderRadius:8, border:'none', cursor:'pointer', fontFamily:font, fontSize:13, fontWeight:600, background: p === page ? '#5379f4' : 'transparent', color: p === page ? '#fff' : '#6a7380', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CompanyLayout>
  )
}
