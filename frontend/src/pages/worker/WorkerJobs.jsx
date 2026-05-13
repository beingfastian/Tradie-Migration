/**
 * WorkerJobs — Job board for candidates to browse employer job postings.
 */
import { useState, useEffect } from 'react'
import { WorkerLayout } from './WorkerLayout'
import { getToken, getMe, listJobs } from '../../services/api'

const font = "'Urbanist', sans-serif"

const TRADE_CATEGORIES = ['', 'Electrical & Energy', 'Plumbing', 'HVAC', 'Solar', 'Construction', 'Mining']

const STATUS_COLORS = {
  'Hiring':       { bg: '#e8f5e9', color: '#129578' },
  'Closing Soon': { bg: '#fff3e8', color: '#f26f37' },
  'On Hold':      { bg: '#fff0f0', color: '#e53e3e' },
  'Draft':        { bg: '#f0f0f4', color: '#6a7380' },
}

function StatusBadge({ value }) {
  const c = STATUS_COLORS[value] || { bg: '#f0f0f4', color: '#6a7380' }
  return (
    <span style={{
      display: 'inline-block', background: c.bg, color: c.color,
      borderRadius: 20, padding: '4px 12px',
      fontSize: 12, fontWeight: 700, fontFamily: font,
    }}>{value}</span>
  )
}

function JobCard({ job }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={{
      background: '#fff', borderRadius: 16, padding: '24px 28px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ fontFamily: font, fontSize: 18, fontWeight: 700, color: '#1e1e1e', margin: '0 0 4px' }}>
            {job.title}
          </h3>
          <p style={{ fontFamily: font, fontSize: 14, color: '#6a7380', margin: '0 0 8px' }}>
            {job.company_name || 'Company'} {job.location ? `· ${job.location}` : ''}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            {job.trade_category && (
              <span style={{ fontFamily: font, fontSize: 12, background: '#f0f4ff', color: '#5379f4', borderRadius: 8, padding: '3px 10px' }}>
                {job.trade_category}
              </span>
            )}
            {job.employment_type && (
              <span style={{ fontFamily: font, fontSize: 12, background: '#f6f6f9', color: '#6a7380', borderRadius: 8, padding: '3px 10px' }}>
                {job.employment_type}
              </span>
            )}
            {job.visa_sponsorship && (
              <span style={{ fontFamily: font, fontSize: 12, background: '#e8f5e9', color: '#129578', borderRadius: 8, padding: '3px 10px' }}>
                Visa: {job.visa_sponsorship}
              </span>
            )}
            {(job.min_salary || job.max_salary) && (
              <span style={{ fontFamily: font, fontSize: 12, background: '#fff3e8', color: '#f26f37', borderRadius: 8, padding: '3px 10px' }}>
                {job.currency || 'AUD'} {job.min_salary ? job.min_salary.toLocaleString() : ''}{job.max_salary ? ` – ${job.max_salary.toLocaleString()}` : ''}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <StatusBadge value={job.status} />
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              height: 36, padding: '0 18px', background: '#156dbf', color: '#fff', border: 'none',
              borderRadius: 10, fontFamily: font, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>
            {expanded ? 'Hide Details' : 'View Details'}
          </button>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f0f0f4' }}>
          {job.role_overview && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: font, fontSize: 13, color: '#9ca3af', margin: '0 0 6px' }}>Role Overview</p>
              <p style={{ fontFamily: font, fontSize: 14, color: '#343434', lineHeight: 1.7, margin: 0 }}>{job.role_overview}</p>
            </div>
          )}
          {job.key_requirements && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: font, fontSize: 13, color: '#9ca3af', margin: '0 0 6px' }}>Key Requirements</p>
              <p style={{ fontFamily: font, fontSize: 14, color: '#343434', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{job.key_requirements}</p>
            </div>
          )}
          {job.benefits && (
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontFamily: font, fontSize: 13, color: '#9ca3af', margin: '0 0 6px' }}>Benefits & Perks</p>
              <p style={{ fontFamily: font, fontSize: 14, color: '#343434', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{job.benefits}</p>
            </div>
          )}
          {job.responsibilities && (
            <div>
              <p style={{ fontFamily: font, fontSize: 13, color: '#9ca3af', margin: '0 0 6px' }}>Responsibilities</p>
              <p style={{ fontFamily: font, fontSize: 14, color: '#343434', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-line' }}>{job.responsibilities}</p>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px 20px', marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f4' }}>
            {[
              ['Company Vehicle', job.company_vehicle ? 'Yes' : 'No'],
              ['Overtime', job.overtime ? 'Yes' : 'No'],
              ['Superannuation', job.superannuation ? 'Yes' : 'No'],
            ].map(([label, val]) => (
              <div key={label}>
                <p style={{ fontFamily: font, fontSize: 12, color: '#9ca3af', margin: '0 0 4px' }}>{label}</p>
                <p style={{ fontFamily: font, fontSize: 14, fontWeight: 600, color: '#343434', margin: 0 }}>{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function WorkerJobs() {
  const [user,     setUser]     = useState(null)
  const [jobs,     setJobs]     = useState([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    const token = getToken()
    getMe(token).then(u => setUser(u)).catch(() => {})
    listJobs({ status: 'Hiring' }, token)
      .then(data => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = jobs.filter(j => {
    const matchSearch = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.location || '').toLowerCase().includes(search.toLowerCase()) ||
      (j.company_name || '').toLowerCase().includes(search.toLowerCase())
    const matchCat = !category || j.trade_category === category
    return matchSearch && matchCat
  })

  return (
    <WorkerLayout user={user}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontFamily: font, fontSize: 28, fontWeight: 700, color: '#1e1e1e', margin: '0 0 4px' }}>
            Browse Jobs
          </h2>
          <p style={{ fontFamily: font, fontSize: 14, color: '#6a7380', margin: 0 }}>
            Discover job opportunities from verified Australian employers.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, border: '1.5px solid #e0dff0', borderRadius: 10, padding: '8px 14px', background: '#fff', flex: 1, minWidth: 200 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by title, company, or location..."
            style={{ border: 'none', outline: 'none', fontFamily: font, fontSize: 14, color: '#343434', background: 'transparent', flex: 1 }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <select
            value={category} onChange={e => setCategory(e.target.value)}
            style={{ height: 42, border: '1.5px solid #e0dff0', borderRadius: 10, padding: '0 36px 0 14px', fontFamily: font, fontSize: 14, color: category ? '#343434' : '#9ca3af', outline: 'none', appearance: 'none', background: '#fff', minWidth: 180 }}>
            <option value="">All Trades</option>
            {TRADE_CATEGORIES.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {loading ? (
        <p style={{ fontFamily: font, fontSize: 15, color: '#9ca3af', textAlign: 'center', padding: 40 }}>Loading jobs…</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60 }}>
          <p style={{ fontFamily: font, fontSize: 16, color: '#9ca3af' }}>No job postings found.</p>
          <p style={{ fontFamily: font, fontSize: 14, color: '#c0c0c8' }}>Check back later or adjust your filters.</p>
        </div>
      ) : (
        filtered.map(job => <JobCard key={job.id} job={job} />)
      )}
    </WorkerLayout>
  )
}
