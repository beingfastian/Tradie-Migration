/**
 * CompanyCandidateProfile — /company/candidates/:id
 * Shows a candidate's full public profile to an employer.
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CompanyLayout } from './CompanyLayout'
import { getToken, getMe, getMyCompany, getCandidatePublicProfile } from '../../services/api'

const font = "'Urbanist', sans-serif"

function Avatar({ name = '', size = 72 }) {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
  const colors   = ['#5379f4','#f26f37','#129578','#403c8b','#156dbf','#fdb345']
  const color    = colors[(name.charCodeAt(0) || 0) % colors.length]
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', background:color,
      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
    }}>
      <span style={{ fontFamily:font, fontWeight:700, fontSize:size * 0.35, color:'#fff' }}>{initials || '?'}</span>
    </div>
  )
}

function Badge({ label, bg = '#f3f1fd', color = '#403c8b' }) {
  return (
    <span style={{
      background:bg, color, borderRadius:20, padding:'5px 14px',
      fontFamily:font, fontWeight:600, fontSize:13, whiteSpace:'nowrap',
    }}>{label}</span>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ background:'#fff', borderRadius:16, padding:'28px 32px', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', marginBottom:20 }}>
      <h3 style={{ fontFamily:font, fontWeight:700, fontSize:18, color:'#1e1e1e', margin:'0 0 20px', paddingBottom:12, borderBottom:'1px solid #f0f0f4' }}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function Row({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div style={{ display:'flex', gap:12, marginBottom:14, alignItems:'flex-start' }}>
      <span style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#9ca3af', minWidth:200, flexShrink:0 }}>{label}</span>
      <span style={{ fontFamily:font, fontSize:14, color:'#343434', fontWeight:500, flex:1 }}>{value}</span>
    </div>
  )
}

export function CompanyCandidateProfile() {
  const { id }    = useParams()
  const navigate   = useNavigate()
  const [user, setUser]       = useState(null)
  const [company, setCompany] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const token = getToken()
    if (!token) { navigate('/login', { replace:true }); return }

    Promise.all([
      getMe(token),
      getMyCompany(token).catch(() => null),
      getCandidatePublicProfile(id, token),
    ])
      .then(([u, co, p]) => {
        setUser(u)
        setCompany(co)
        setProfile(p)
      })
      .catch(err => {
        setError(err?.message || 'Could not load candidate profile.')
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  const p = profile || {}

  const visaColor = {
    '482 Eligible':     { bg:'#e8f5e9', color:'#129578' },
    'Skilled Ind.':     { bg:'#e8ecff', color:'#5379f4' },
    'Sponsor Required': { bg:'#343434', color:'#fff' },
  }[p.visa_status] || { bg:'#f3f1fd', color:'#403c8b' }

  return (
    <CompanyLayout user={user} company={company}>

      {/* ── Back + header ── */}
      <div style={{ marginBottom:24 }}>
        <button onClick={() => navigate(-1)} style={{
          display:'inline-flex', alignItems:'center', gap:8, marginBottom:16,
          background:'transparent', border:'none', cursor:'pointer',
          fontFamily:font, fontSize:14, fontWeight:600, color:'#156dbf', padding:0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back to Candidates
        </button>

        <h2 style={{ fontFamily:font, fontWeight:700, fontSize:28, color:'#1e1e1e', margin:'0 0 4px' }}>
          Candidate Profile
        </h2>
        <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', margin:0 }}>
          Review this candidate's qualifications and experience.
        </p>
      </div>

      {loading && (
        <div style={{ textAlign:'center', padding:'80px 0' }}>
          <div style={{ fontFamily:font, fontSize:16, color:'#9ca3af' }}>Loading profile…</div>
        </div>
      )}

      {!loading && error && (
        <div style={{
          background:'#fff0f0', border:'1.5px solid #fb4248', borderRadius:14,
          padding:'24px 28px', fontFamily:font, fontSize:15, color:'#fb4248', fontWeight:600,
        }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* ── Hero card ── */}
          <div style={{
            background:'#fff', borderRadius:20, padding:'32px',
            boxShadow:'0 2px 16px rgba(0,0,0,0.06)', marginBottom:20,
            display:'flex', gap:28, alignItems:'flex-start', flexWrap:'wrap',
          }}>
            <Avatar name={p.full_name} size={88}/>

            <div style={{ flex:1, minWidth:240 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:8 }}>
                <h1 style={{ fontFamily:font, fontWeight:700, fontSize:26, color:'#1e1e1e', margin:0 }}>
                  {p.full_name || '—'}
                </h1>
                {p.published && <Badge label="✓ Published" bg="#e8f5e9" color="#129578"/>}
              </div>

              <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', margin:'0 0 14px' }}>
                {p.trade_category || 'Trade Professional'}{p.nationality ? ` · ${p.nationality}` : ''}
              </p>

              {/* Badges row */}
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {p.years_experience != null && (
                  <Badge label={`${p.years_experience} yrs exp`} bg="#e8f0ff" color="#5379f4"/>
                )}
                {p.english_level && (
                  <Badge label={p.english_level} bg="#f3f1fd" color="#403c8b"/>
                )}
                {p.visa_status && (
                  <Badge label={p.visa_status} bg={visaColor.bg} color={visaColor.color}/>
                )}
                {p.is_available && (
                  <Badge label="Available" bg="#e8f5e9" color="#129578"/>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display:'flex', flexDirection:'column', gap:10, flexShrink:0 }}>
              <button onClick={() => navigate('/company/eois')} style={{
                height:44, padding:'0 24px', background:'#156dbf', border:'none',
                borderRadius:10, fontFamily:font, fontWeight:700, fontSize:14, color:'#fff',
                cursor:'pointer', boxShadow:'0 4px 12px rgba(21,109,191,0.22)',
              }}>
                Send EOI
              </button>
              <button style={{
                height:44, padding:'0 24px', background:'transparent',
                border:'1.5px solid #f26f37', borderRadius:10,
                fontFamily:font, fontWeight:700, fontSize:14, color:'#f26f37', cursor:'pointer',
              }}>
                Shortlist
              </button>
            </div>
          </div>

          {/* ── Personal Info ── */}
          <Section title="Personal Information">
            <Row label="Full Name"              value={p.full_name}/>
            <Row label="Nationality"            value={p.nationality}/>
            <Row label="Country of Residence"   value={p.country_of_residence}/>
            <Row label="Date of Birth"          value={p.date_of_birth}/>
            <Row label="Phone"                  value={p.phone}/>
            <Row label="Preferred Location"     value={Array.isArray(p.preferred_locations) ? p.preferred_locations.join(', ') : p.preferred_locations}/>
          </Section>

          {/* ── Trade & Experience ── */}
          <Section title="Trade & Experience">
            <Row label="Primary Trade"          value={p.trade_category}/>
            <Row label="Trade Specialisation"   value={p.trade_specialisation}/>
            <Row label="Years Experience"       value={p.years_experience != null ? `${p.years_experience} years` : null}/>
            <Row label="Work Types"             value={Array.isArray(p.work_types) ? p.work_types.join(', ') : p.work_types}/>
            <Row label="Licence Number"         value={p.licence_number}/>
            <Row label="Licence State"          value={p.licence_state}/>
            <Row label="Licence Expiry"         value={p.licence_expiry}/>
          </Section>

          {/* ── Language & English ── */}
          <Section title="Language & Communication">
            <Row label="English Level"          value={p.english_level}/>
            <Row label="Other Languages"        value={Array.isArray(p.other_languages) ? p.other_languages.join(', ') : p.other_languages}/>
          </Section>

          {/* ── Visa & Migration ── */}
          <Section title="Visa & Migration Status">
            <Row label="Visa Status"            value={p.visa_status}/>
            <Row label="Current Visa"           value={p.current_visa_type}/>
            <Row label="Visa Expiry"            value={p.visa_expiry}/>
            <Row label="Skills Assessment"      value={p.skills_assessment_authority}/>
            <Row label="Assessment Status"      value={p.assessment_status}/>
            <Row label="Points Score"           value={p.points_score != null ? `${p.points_score} pts` : null}/>
          </Section>

          {/* ── Bio ── */}
          {p.bio && (
            <Section title="About">
              <p style={{ fontFamily:font, fontSize:15, color:'#343434', lineHeight:1.7, margin:0 }}>
                {p.bio}
              </p>
            </Section>
          )}

          {/* ── Documents ── */}
          {Array.isArray(p.documents) && p.documents.length > 0 && (
            <Section title="Uploaded Documents">
              {p.documents.map((doc, i) => (
                <div key={i} style={{
                  display:'flex', alignItems:'center', gap:14, padding:'12px 0',
                  borderBottom: i < p.documents.length - 1 ? '1px solid #f0f0f4' : 'none',
                }}>
                  <div style={{
                    width:40, height:40, borderRadius:10, background:'#e8f0ff',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#156dbf" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434', margin:0 }}>
                      {doc.file_name || doc.document_type || 'Document'}
                    </p>
                    <p style={{ fontFamily:font, fontSize:12, color:'#9ca3af', margin:0 }}>
                      {doc.document_type || ''} {doc.uploaded_at ? `· Uploaded ${doc.uploaded_at.slice(0, 10)}` : ''}
                    </p>
                  </div>
                  <Badge label="Uploaded" bg="#e8f5e9" color="#129578"/>
                </div>
              ))}
            </Section>
          )}
        </>
      )}
    </CompanyLayout>
  )
}
