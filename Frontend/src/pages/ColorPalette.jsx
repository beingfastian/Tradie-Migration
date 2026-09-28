/**
 * ColorPalette — "The Core 5 Color Palette of Tradie Migration"
 * Pixel-perfect from Figma EPlK7tMF8fsZo3O9z9Loa5 node 1:982
 */
import imgHeroBg from '../assets/lp-hero-illus.svg'

const font = "'Urbanist', sans-serif"

const PALETTE = [
  {
    id: 1,
    label: '1. Primary Action Blue',
    hex: '#156DBF',
    bg: '#156DBF',
    textColor: '#ffffff',
    full: true,
  },
  {
    id: 2,
    label: '2. Second Primary (Header Button)',
    hex: '#585484',
    bg: '#585484',
    textColor: '#ffffff',
    full: true,
  },
  {
    id: 3,
    label: '3. Accent Orange',
    hex: '#F26F37',
    bg: '#F26F37',
    textColor: '#ffffff',
    full: true,
  },
  {
    id: 4,
    label: '4. Heading & Dark Text',
    hex: '#343434',
    bg: '#343434',
    textColor: '#ffffff',
    full: false,
  },
  {
    id: 5,
    label: '5. Secondary & Light Text',
    hex: '#8E8D92',
    bg: '#8E8D92',
    textColor: '#ffffff',
    full: false,
  },
]

function ColorSwatch({ label, hex, bg, textColor, height = 148 }) {
  return (
    <div style={{
      background: bg,
      borderRadius: 20,
      height,
      padding: '20px 28px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
    }}>
      <p style={{
        fontFamily: font,
        fontWeight: 800,
        fontSize: 24,
        color: textColor,
        margin: '0 0 4px',
        lineHeight: 1.2,
      }}>{label}</p>
      <p style={{
        fontFamily: font,
        fontWeight: 500,
        fontSize: 16,
        color: textColor,
        opacity: 0.85,
        margin: 0,
      }}>{hex}</p>
    </div>
  )
}

export function ColorPalette() {
  const fullSwatches = PALETTE.filter(p => p.full)
  const halfSwatches = PALETTE.filter(p => !p.full)

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      overflow: 'hidden',
      fontFamily: font,
    }}>

      {/* ── Blurred landing-page background ── */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: `
          radial-gradient(ellipse at 110% -10%,
            #156dbf 0%, #317ec6 3.5%, #4d8fce 6.6%, #86b2dc 12.7%,
            #bed4eb 18.9%, #f6f6f9 25%, #bed4eb 43.75%,
            #86b2dc 62.5%, #4d8fce 81.25%, #317ec6 90.6%, #156dbf 100%)`,
        filter: 'blur(8px)',
        transform: 'scale(1.05)',
        zIndex: 0,
      }} />
      {/* Darkening overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(255,255,255,0.3)',
        zIndex: 1,
      }} />

      {/* ── Main card container ── */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: 640,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(20px)',
        borderRadius: 32,
        padding: '48px 44px 52px',
        boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
      }}>

        {/* Title */}
        <h1 style={{
          fontFamily: font,
          fontWeight: 900,
          fontSize: 36,
          color: '#1a1a1a',
          margin: '0 0 40px',
          lineHeight: 1.2,
          textAlign: 'center',
          letterSpacing: '-0.5px',
        }}>
          The Core 5 Color Palette of<br />Tradie Migration
        </h1>

        {/* Full-width swatches (1, 2, 3) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 16 }}>
          {fullSwatches.map(s => (
            <ColorSwatch key={s.id} {...s} height={148} />
          ))}
        </div>

        {/* Half-width swatches (4 & 5) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {halfSwatches.map(s => (
            <ColorSwatch key={s.id} {...s} height={120} />
          ))}
        </div>
      </div>
    </div>
  )
}
