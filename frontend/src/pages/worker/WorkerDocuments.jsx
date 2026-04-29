/**
 * WorkerDocuments — Upload & manage candidate documents.
 * Figma node 1-4685: 4-step progress, drag-drop zone, file thumbnails.
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
  'Other Certification',
]

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
  const isImg = file.url && /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name || '')
  return (
    <div style={{
      width:100, height:100, borderRadius:12,
      border:'1.5px solid #e0dff0', position:'relative',
      background:'#f8f8fc', display:'flex', alignItems:'center', justifyContent:'center',
      overflow:'hidden', flexShrink:0,
    }}>
      {isImg
        ? <img src={file.url} alt={file.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
        : (
          <div style={{ textAlign:'center', padding:8 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5379f4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <p style={{ fontFamily:font, fontSize:10, color:'#6a7380', margin:'4px 0 0', wordBreak:'break-all' }}>
              {(file.name || '').substring(0, 12)}
            </p>
          </div>
        )
      }
      <button
        onClick={() => onRemove(file)}
        style={{
          position:'absolute', top:4, right:4,
          width:20, height:20, borderRadius:'50%',
          background:'rgba(0,0,0,0.55)', border:'none', cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', padding:0,
        }}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M2 2l8 8M10 2l-8 8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  )
}

export function WorkerDocuments() {
  const navigate  = useNavigate()
  const [user, setUser]             = useState(null)
  const [profile, setProfile]       = useState(null)
  const [uiStep, setUiStep]         = useState(3)   // Figma shows step 3 (Upload Files)
  const [docType, setDocType]       = useState('')
  const [dragOver, setDragOver]     = useState(false)
  const [files, setFiles]           = useState([])   // {id?, name, url, file?}
  const [uploading, setUploading]   = useState(false)
  const [err, setErr]               = useState('')
  const [success, setSuccess]       = useState('')
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
              setFiles(docs.map(d => ({ id:d.id, name:d.original_filename || d.document_type, url:null })))
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
    if (!profile?.id) { setErr('Please complete your profile first.'); return }
    const token = getToken()
    setUploading(true)
    setErr('')
    setSuccess('')
    try {
      for (const f of pending) {
        const fd = new FormData()
        fd.append('file', f.file)
        fd.append('document_type', docType || 'Other Certification')
        fd.append('candidate_id', profile.id)
        const res = await uploadDocument(fd, token)
        setFiles(prev => prev.map(x => x === f ? { ...x, id:res.id, file:null } : x))
      }
      setSuccess(`${pending.length} document${pending.length > 1 ? 's' : ''} uploaded successfully!`)
    } catch (e) {
      setErr(e.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

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
            Upload and manage your professional certifications, licenses, and safety documents.
          </p>
        </div>
      </div>

      {/* Card */}
      <div style={{ background:'#fff', borderRadius:20, padding:'32px 36px', boxShadow:'0 2px 16px rgba(0,0,0,0.05)' }}>
        <StepBar current={uiStep} />

        <h3 style={{ fontFamily:font, fontSize:20, fontWeight:700, color:'#1e1e1e', margin:'0 0 6px' }}>
          Add Certifications & Files
        </h3>
        <p style={{ fontFamily:font, fontSize:14, color:'#6a7380', margin:'0 0 24px' }}>
          You must upload clear, legible copies of all required documents to be verified. You can edit this section later if needed.
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
                height:44, borderRadius:10, border:'1.5px solid #d0d5dd',
                padding:'0 40px 0 14px', fontFamily:font, fontSize:14,
                color: docType ? '#343434' : '#9ca3af', background:'#fff',
                appearance:'none', cursor:'pointer', outline:'none', width:'100%',
              }}
            >
              <option value="">Select document type</option>
              {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <svg style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6a7380" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${dragOver ? '#5379f4' : '#d0d5dd'}`,
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
            Drag and Drop image
          </p>
          <p style={{ fontFamily:font, fontSize:14, color:'#9ca3af', margin:0 }}>Or</p>
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

        {/* Messages */}
        {err && <p style={{ fontFamily:font, fontSize:14, color:'#e53e3e', margin:'0 0 16px' }}>{err}</p>}
        {success && <p style={{ fontFamily:font, fontSize:14, color:'#129578', margin:'0 0 16px' }}>{success}</p>}

        {/* Upload button */}
        {files.some(f => f.file) && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              height:48, padding:'0 32px', background:'#5379f4', color:'#fff',
              border:'none', borderRadius:12, cursor:'pointer',
              fontFamily:font, fontSize:15, fontWeight:600,
              opacity: uploading ? 0.7 : 1,
            }}
          >
            {uploading ? 'Uploading…' : `Upload ${files.filter(f => f.file).length} file(s)`}
          </button>
        )}
      </div>
    </WorkerLayout>
  )
}
