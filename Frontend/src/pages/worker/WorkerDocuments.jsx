/**
 * WorkerDocuments — Upload & manage candidate documents.
 * Figma node 1-4685: 4-step progress, drag-drop zone, file thumbnails.
 *
 * FIXES applied:
 *  1. document_group is now sent in FormData (was missing — caused 422 from backend).
 *  2. candidate_id removed from FormData (backend derives it from the auth token).
 *  3. Upload button label now shows "Uploading & indexing for AI search…" while
 *     the backend auto-ingests the document into the RAG vector store.
 *  4. Success message confirms the document is now searchable via AI Search.
 */
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { WorkerLayout } from './WorkerLayout'
import {
  getToken, getMe, getCandidateProfile,
  uploadDocument, getDocuments, deleteDocument,
} from '../../services/api'
import { MOCK_USER, MOCK_PROFILE } from './mockData'

const font = "'Urbanist', sans-serif"

const STEP_LABELS = ['Document Type', 'Verification', 'Upload Files', 'Review']

const DOC_TYPES = [
  'Trade Certificate / Qualification',
  'Passport / Identity Document',
  'Work Experience Letter',
  'English Test Result (IELTS/PTE)',
  'Safety Compliance Certificate',
  'Electrical Licence',
  'Resume / CV',
  'Other Certification',
]

/**
 * Maps a document_type string to a document_group value.
 * document_group is a required field on the backend; we derive it from
 * the selected doc type so the user doesn't need to pick it separately.
 */
function deriveDocumentGroup(docType) {
  const t = (docType || '').toLowerCase()
  if (t.includes('passport') || t.includes('identity')) return 'identity'
  if (t.includes('resume') || t.includes('cv'))           return 'resume'
  if (t.includes('licence') || t.includes('license'))     return 'licence'
  if (t.includes('certificate') || t.includes('qualification')) return 'credential'
  if (t.includes('experience') || t.includes('reference')) return 'experience'
  if (t.includes('english') || t.includes('ielts') || t.includes('pte')) return 'language'
  if (t.includes('safety') || t.includes('compliance'))   return 'safety'
  return 'credential'   // safe default
}

function StepBar({ current }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:32 }}>
      {STEP_LABELS.map((label, i) => {
        const idx = i + 1
        const done = current > idx
        const active = current === idx
        return (
          <div key={label} style={{ display:'flex', alignItems:'center', flex: i < STEP_LABELS.length - 1 ? 1 : 'none' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
              <div style={{
                width:28, height:28, borderRadius:'50%', flexShrink:0,
                background: done ? '#5379f4' : active ? '#5379f4' : '#e0dff0',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff', fontSize:12, fontWeight:700,
              }}>
                {done
                  ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : idx
                }
              </div>
              <span style={{
                fontFamily:font, fontSize:13, fontWeight: active ? 700 : 500,
                color: active ? '#5379f4' : done ? '#5379f4' : '#9ca3af',
                whiteSpace:'nowrap',
              }}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{
                flex:1, height:2, margin:'0 12px',
                background: done ? '#5379f4' : '#e0dff0',
              }}/>
            )}
          </div>
        )
      })}
    </div>
  )
}

function UploadIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  )
}

function FileThumb({ file, onRemove }) {
  const isImg = file.url && /\.(png|jpe?g)$/i.test(file.name)
  return (
    <div style={{
      width:120, borderRadius:12, border:'1.5px solid #e5e7eb',
      overflow:'hidden', position:'relative', background:'#fafafa',
    }}>
      {isImg
        ? <img src={file.url} alt={file.name} style={{ width:'100%', height:80, objectFit:'cover', display:'block' }}/>
        : (
          <div style={{ height:80, display:'flex', alignItems:'center', justifyContent:'center', background:'#f3f4f6' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
        )
      }
      <div style={{ padding:'6px 8px' }}>
        <p style={{ fontFamily:font, fontSize:10, color:'#6a7380', margin:0, wordBreak:'break-all', lineHeight:1.3 }}>
          {file.name.length > 20 ? file.name.slice(0,18) + '…' : file.name}
        </p>
        {file.id && (
          <p style={{ fontFamily:font, fontSize:9, color:'#129578', margin:'2px 0 0', fontWeight:600 }}>
            ✓ Uploaded
          </p>
        )}
      </div>
      <button
        onClick={() => onRemove(file)}
        style={{
          position:'absolute', top:4, right:4,
          width:20, height:20, borderRadius:'50%',
          background:'rgba(0,0,0,0.5)', border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#fff', fontSize:12, lineHeight:1,
        }}
      >×</button>
    </div>
  )
}

export function WorkerDocuments() {
  const navigate  = useNavigate()
  const [user,     setUser]     = useState(null)
  const [profile,  setProfile]  = useState(null)
  const [uiStep,   setUiStep]   = useState(3)
  const [docType,  setDocType]  = useState('')
  const [files,    setFiles]    = useState([])
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [err,      setErr]      = useState('')
  const [success,  setSuccess]  = useState('')
  const fileRef = useRef(null)

  useEffect(() => {
    const token = getToken()
    if (!token) { setUser(MOCK_USER); setProfile(MOCK_PROFILE); return }
    getMe(token)
      .then(u => {
        setUser(u)
        return getCandidateProfile(token).catch(() => null)
      })
      .then(p => {
        setProfile(p || MOCK_PROFILE)
        if (p?.id) {
          getDocuments(p.id, token)
            .then(docs => {
              setFiles(docs.map(d => ({ id:d.id, name:d.file_name || d.document_type, url:null })))
            })
            .catch(() => {})
        }
      })
      .catch(() => { setUser(MOCK_USER); setProfile(MOCK_PROFILE) })
  }, [navigate])

  function addLocalFiles(selected) {
    const newFiles = Array.from(selected).map(f => ({
      name: f.name,
      url: URL.createObjectURL(f),
      file: f,
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    addLocalFiles(e.dataTransfer.files)
  }

  async function handleRemove(f) {
    if (f.id) {
      const token = getToken()
      try { await deleteDocument(f.id, token) } catch {}
    }
    setFiles(prev => prev.filter(x => x !== f))
  }

  async function handleUpload() {
    const pending = files.filter(f => f.file)
    if (!pending.length) { setSuccess('All documents already uploaded.'); return }
    if (!profile?.id)    { setErr('Please complete your profile first.'); return }
    if (!docType)        { setErr('Please select a document type first.'); return }

    const token = getToken()
    setUploading(true)
    setErr('')
    setSuccess('')

    try {
      for (const f of pending) {
        const fd = new FormData()
        fd.append('file', f.file)
        // FIX 1: document_group is REQUIRED by the backend — derive it from docType
        fd.append('document_group', deriveDocumentGroup(docType))
        fd.append('document_type', docType)
        // NOTE: do NOT append candidate_id — the backend reads it from the JWT token

        const res = await uploadDocument(fd, token)
        setFiles(prev => prev.map(x => x === f ? { ...x, id: res.id, file: null } : x))
      }

      // FIX 2: success message now reflects that AI search indexing also happened
      const isPdfOrDocx = pending.some(f => /\.(pdf|docx|doc)$/i.test(f.name))
      setSuccess(
        isPdfOrDocx
          ? `✅ ${pending.length} document${pending.length > 1 ? 's' : ''} uploaded and indexed for AI search! Employers can now find you via the AI candidate search.`
          : `✅ ${pending.length} document${pending.length > 1 ? 's' : ''} uploaded successfully!`
      )
    } catch (e) {
      setErr(e.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const pendingCount = files.filter(f => f.file).length
  const isPdfOrDocxPending = files.some(f => f.file && /\.(pdf|docx|doc)$/i.test(f.name))

  return (
    <WorkerLayout user={user}>
      {/* Header row with back arrow */}
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:6 }}>
        <button
          onClick={() => navigate('/worker/dashboard')}
          style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', alignItems:'center', color:'#6a7380' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <h2 style={{ fontFamily:font, fontSize:26, fontWeight:700, color:'#1e1e1e', margin:0 }}>Add Documents</h2>
          <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'4px 0 0' }}>
            Upload your professional certifications, licences, and résumé. PDF and DOCX files are automatically indexed for AI candidate search.
          </p>
        </div>
      </div>

      {/* Card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'32px 36px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
        <StepBar current={uiStep} />

        <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#1e1e1e', margin:'0 0 6px' }}>
          Add Certifications &amp; Files
        </h3>
        <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'0 0 24px' }}>
          Upload clear, legible copies of all required documents. PDF and Word files will also be indexed so employers can find you through AI-powered search.
        </p>

        {/* Document type selector */}
        <div style={{ marginBottom:20 }}>
          <label style={{ fontFamily:font, fontSize:14, fontWeight:600, color:'#343434', display:'block', marginBottom:6 }}>
            Document Type
          </label>
          <div style={{ position:'relative', maxWidth:380 }}>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              style={{
                width:'100%', height:44, borderRadius:10,
                border:'1.5px solid #d0d5dd',
                padding:'0 40px 0 14px', fontFamily:font, fontSize:14,
                color: docType ? '#1e1e1e' : '#9ca3af',
                background:'#fff', appearance:'none', cursor:'pointer',
                outline:'none',
              }}
            >
              <option value="">Select document type…</option>
              {DOC_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <svg style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>

          {/* Show derived group as a hint */}
          {docType && (
            <p style={{ fontFamily:font, fontSize:12, color:'#9ca3af', margin:'6px 0 0' }}>
              Group: <strong style={{ color:'#5379f4' }}>{deriveDocumentGroup(docType)}</strong>
            </p>
          )}
        </div>

        {/* AI search info banner for PDF/DOCX */}
        <div style={{
          display:'flex', alignItems:'flex-start', gap:10, padding:'12px 14px',
          background:'#f0f3ff', borderRadius:10, border:'1px solid #c7d4ff',
          marginBottom:20,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5379f4" strokeWidth="2" style={{ flexShrink:0, marginTop:1 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p style={{ fontFamily:font, fontSize:13, color:'#5379f4', margin:0, lineHeight:1.5 }}>
            <strong>PDF and Word files</strong> are automatically indexed for AI search after upload — no extra steps needed. Employers searching for your skills will be matched to your documents.
          </p>
        </div>

        {/* Drag-and-drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border:`2px dashed ${dragOver ? '#5379f4' : '#d0d5dd'}`,
            borderRadius:16, padding:'48px 24px',
            background: dragOver ? '#f3f1fd' : '#fafafa',
            display:'flex', flexDirection:'column', alignItems:'center', gap:12,
            cursor:'pointer', transition:'all 0.15s',
            marginBottom:24,
          }}
          onClick={() => fileRef.current?.click()}
        >
          <UploadIcon />
          <p style={{ fontFamily:font, fontSize:16, fontWeight:600, color:'#6a7380', margin:0 }}>
            Drag &amp; drop files here
          </p>
          <p style={{ fontFamily:font, fontSize:13, color:'#9ca3af', margin:0 }}>
            PDF, DOCX, DOC, PNG, JPG — max 10 MB each
          </p>
          <button
            onClick={e => { e.stopPropagation(); fileRef.current?.click() }}
            style={{
              height:40, padding:'0 32px', background:'#156dbf', color:'#fff',
              border:'none', borderRadius:10, cursor:'pointer',
              fontFamily:font, fontSize:14, fontWeight:600,
            }}
          >
            Browse
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            style={{ display:'none' }}
            onChange={e => { addLocalFiles(e.target.files); e.target.value = '' }}
          />
        </div>

        {/* File thumbnails */}
        {files.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:16, marginBottom:24 }}>
            {files.map((f, i) => (
              <FileThumb key={f.id || f.name + i} file={f} onRemove={handleRemove} />
            ))}
          </div>
        )}

        {/* Error / success messages */}
        {err && (
          <p style={{ fontFamily:font, fontSize:14, color:'#e53e3e', margin:'0 0 16px', lineHeight:1.5 }}>
            ⚠ {err}
          </p>
        )}
        {success && (
          <p style={{ fontFamily:font, fontSize:14, color:'#129578', margin:'0 0 16px', lineHeight:1.5 }}>
            {success}
          </p>
        )}

        {/* Upload button */}
        {pendingCount > 0 && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              height:48, padding:'0 32px', background:'#5379f4', color:'#fff',
              border:'none', borderRadius:12, cursor: uploading ? 'not-allowed' : 'pointer',
              fontFamily:font, fontSize:15, fontWeight:600,
              opacity: uploading ? 0.7 : 1,
              display:'flex', alignItems:'center', gap:10,
            }}
          >
            {uploading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"
                  style={{ animation:'spin 1s linear infinite' }}>
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                {isPdfOrDocxPending ? 'Uploading & indexing for AI search…' : 'Uploading…'}
              </>
            ) : (
              `Upload ${pendingCount} file${pendingCount > 1 ? 's' : ''}`
            )}
          </button>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </WorkerLayout>
  )
}