import { useNavigate } from 'react-router-dom'
import illusHiring from '../assets/illus-hiring.svg'
import illusTrain  from '../assets/illus-train.svg'
import illusWork   from '../assets/illus-work.svg'

const font = "'Urbanist', sans-serif"

/* ── Shared background decorations ── */
function BgDecorations() {
  return (
    <>
      {/* Top-right blobs */}
      <div style={{
        position: 'absolute', top: -30, right: -30,
        width: 200, height: 180,
        background: '#b8d4f0',
        borderRadius: '80% 20% 80% 20%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: 60, right: 60,
        width: 120, height: 110,
        background: '#c8e6a0',
        borderRadius: '20% 80% 20% 80%',
        pointerEvents: 'none',
      }} />

      {/* Bottom-left blobs */}
      <div style={{
        position: 'absolute', bottom: -30, left: -30,
        width: 200, height: 180,
        background: '#a0d8b0',
        borderRadius: '20% 80% 20% 80%',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 60, left: 60,
        width: 120, height: 100,
        background: '#d4e8a0',
        borderRadius: '80% 20% 80% 20%',
        pointerEvents: 'none',
      }} />

      {/* Orange filled dots */}
      <div style={{ position: 'absolute', top: 120, left: 80,  width: 5, height: 5, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 200, right: 200, width: 4, height: 4, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 180, right: 120, width: 5, height: 5, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 100, left: 200, width: 4, height: 4, borderRadius: '50%', background: '#f26f37', pointerEvents: 'none' }} />

      {/* Orange ring dots */}
      <div style={{ position: 'absolute', top: 80,  right: 300, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 300, left: 40,   width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 250, right: 60, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 80,  left: 300, width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #f26f37', background: 'transparent', pointerEvents: 'none' }} />
    </>
  )
}

const ROLE_CARDS = [
  {
    role:  'employer',
    label: 'I want to hire',
    illus: illusHiring,
  },
  {
    role:  'training_provider',
    label: 'I want to train',
    illus: illusTrain,
  },
  {
    role:  'candidate',
    label: 'I want to work',
    illus: illusWork,
  },
]

export function RoleSelectPage() {
  const navigate = useNavigate()

  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      minHeight: '100vh',
      background: '#f8f8f8',
      fontFamily: font,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
    }}>
      <BgDecorations />

      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: 900,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 48,
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontFamily: font,
            fontSize: 32,
            fontWeight: 700,
            color: '#1a1a1a',
            margin: '0 0 12px',
            lineHeight: 1.3,
          }}>
            Connecting world-class talent with opportunities and the skills to succeed.
          </h1>
          <p style={{
            fontFamily: font,
            fontSize: 16,
            color: '#888',
            margin: 0,
            maxWidth: 500,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.6,
          }}>
            Choose how you'd like to join our global professional ecosystem.
          </p>
        </div>

        {/* Role cards */}
        <div style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
        }}>
          {ROLE_CARDS.map(({ role, label, illus }) => (
            <RoleCard
              key={role}
              label={label}
              illus={illus}
              onClick={() => navigate(`/register?role=${role}`)}
            />
          ))}
        </div>

        <p style={{ fontFamily: font, fontSize: 14, color: '#888', margin: 0 }}>
          Already have an account?{' '}
          <a
            href="/login"
            style={{ color: '#4169e1', fontWeight: 600, textDecoration: 'none' }}
            onClick={e => { e.preventDefault(); navigate('/login') }}
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}

function RoleCard({ label, illus, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: 24,
        border: '2px solid transparent',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
        width: 240,
        transition: 'border-color 0.18s, box-shadow 0.18s',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#4169e1'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(65,105,225,0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'transparent'
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
      }}
    >
      <div style={{
        width: 180,
        height: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src={illus}
          alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
      <span style={{
        fontFamily: font,
        fontSize: 18,
        fontWeight: 700,
        color: '#1a1a1a',
        textAlign: 'center',
      }}>
        {label}
      </span>
    </div>
  )
}
