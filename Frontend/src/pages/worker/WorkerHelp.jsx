import { useState, useEffect } from 'react'
import { WorkerLayout } from './WorkerLayout'
import { getToken, getMe } from '../../services/api'
const font = "'Urbanist', sans-serif"
export function WorkerHelp() {
  const [user, setUser] = useState(null)
  useEffect(() => { const t = getToken(); if (t) getMe(t).then(setUser).catch(() => {}) }, [])
  return (
    <WorkerLayout user={user}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:font, fontWeight:700, fontSize:28, color:'#1e1e1e', margin:'0 0 4px' }}>Help & Support</h2>
        <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', margin:0 }}>Get help with your account and application.</p>
      </div>
      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 16px rgba(0,0,0,0.05)', padding:'60px 40px', textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:16 }}>🆘</div>
        <h3 style={{ fontFamily:font, fontWeight:700, fontSize:22, color:'#1e1e1e', margin:'0 0 8px' }}>Help Centre</h3>
        <p style={{ fontFamily:font, fontSize:15, color:'#9ca3af', margin:0 }}>Help documentation and support resources coming soon.</p>
      </div>
    </WorkerLayout>
  )
}
