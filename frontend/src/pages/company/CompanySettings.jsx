import { useState, useEffect } from 'react'
import { CompanyLayout } from './CompanyLayout'
import { getToken, getMe } from '../../services/api'
const font = "'Urbanist', sans-serif"
export function CompanySettings() {
  const [user, setUser] = useState(null)
  useEffect(() => { const t = getToken(); if (t) getMe(t).then(setUser).catch(() => {}) }, [])
  return (
    <CompanyLayout user={user}>
      <div style={{ marginBottom:24 }}>
        <h2 style={{ fontFamily:font, fontWeight:700, fontSize:28, color:'#1e1e1e', margin:'0 0 4px' }}>Settings</h2>
        <p style={{ fontFamily:font, fontSize:15, color:'#6a7380', margin:0 }}>Manage your company account preferences.</p>
      </div>
      <div style={{ background:'#fff', borderRadius:20, boxShadow:'0 2px 16px rgba(0,0,0,0.05)', padding:'60px 40px', textAlign:'center' }}>
        <div style={{ fontSize:56, marginBottom:16 }}>⚙️</div>
        <h3 style={{ fontFamily:font, fontWeight:700, fontSize:22, color:'#1e1e1e', margin:'0 0 8px' }}>Settings</h3>
        <p style={{ fontFamily:font, fontSize:15, color:'#9ca3af', margin:0 }}>Company account settings and preferences coming soon.</p>
      </div>
    </CompanyLayout>
  )
}
