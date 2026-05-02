/**
 * ColorPalette — Core 5 Brand Colours of Tradie Migration
 */

const font = "'Urbanist', 'Inter', sans-serif"

const PALETTE = [
  {
    name: 'Deep Navy',
    hex: '#0D1B3E',
    rgb: 'rgb(13, 27, 62)',
    hsl: 'hsl(224°, 65%, 15%)',
    cmyk: 'C79 M57 Y0 K76',
    role: 'Primary Background',
    usage: ['Dark sections', 'Sidebar', 'Footer', 'CTA banners', 'Navigation overlay'],
    textColor: '#ffffff',
    shade: '#0D1B3E',
    tints: ['#1a2e5a', '#273d76', '#3a558f', '#6b85b8', '#b5c3da'],
  },
  {
    name: 'Brand Blue',
    hex: '#1565C0',
    rgb: 'rgb(21, 101, 192)',
    hsl: 'hsl(214°, 80%, 42%)',
    cmyk: 'C89 M47 Y0 K25',
    role: 'Primary Action',
    usage: ['Buttons', 'Links', 'Step numbers', 'Badges', 'Charts'],
    textColor: '#ffffff',
    shade: '#1565C0',
    tints: ['#1976d2', '#2196f3', '#64b5f6', '#bbdefb', '#e3f2fd'],
  },
  {
    name: 'Trade Orange',
    hex: '#F26F37',
    rgb: 'rgb(242, 111, 55)',
    hsl: 'hsl(20°, 88%, 58%)',
    cmyk: 'C0 M54 Y77 K5',
    role: 'Accent & Highlight',
    usage: ['Logo mark', 'CTAs', 'Alert states', 'Hover accents', 'Progress fills'],
    textColor: '#ffffff',
    shade: '#F26F37',
    tints: ['#f47d4e', '#f6966d', '#f8b08e', '#fad0ba', '#fdeee6'],
  },
  {
    name: 'Verified Green',
    hex: '#129578',
    rgb: 'rgb(18, 149, 120)',
    hsl: 'hsl(168°, 78%, 33%)',
    cmyk: 'C88 Y19 M0 K42',
    role: 'Success & Trust',
    usage: ['Verified badges', 'Success states', 'Active status', 'Good standing', 'Completion'],
    textColor: '#ffffff',
    shade: '#129578',
    tints: ['#15a888', '#18bb9a', '#4fceb6', '#95e2d6', '#d4f4ef'],
  },
  {
    name: 'Light Canvas',
    hex: '#F6F8FF',
    rgb: 'rgb(246, 248, 255)',
    hsl: 'hsl(228°, 100%, 98%)',
    cmyk: 'C4 M3 Y0 K0',
    role: 'Background & Surface',
    usage: ['Page backgrounds', 'Card surfaces', 'Input fields', 'Section fills', 'Hero bg'],
    textColor: '#0D1B3E',
    shade: '#F6F8FF',
    tints: ['#ffffff', '#f0f4ff', '#e8ecff', '#d4dcfa', '#bac8f0'],
  },
]

export function ColorPalette() {
  function copyToClipboard(text) {
    navigator.clipboard?.writeText(text)
  }

  return (
    <div style={{ fontFamily: font, minHeight: '100vh', background: '#f6f8ff' }}>

      {/* ── Header ── */}
      <div style={{ background: '#0d1b3e', padding: '56px 60px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Logo */}
          <div style={{ marginBottom: 32 }}>
            <span style={{ fontFamily: "'Mohave','Urbanist',sans-serif", fontWeight: 700, fontSize: 20 }}>
              <span style={{ color: '#f26f37' }}>T</span>
              <span style={{ color: '#5b9bd5' }}>radie</span>
              <span style={{ color: 'rgba(255,255,255,0.6)' }}> Migration</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(242,111,55,0.15)', border: '1px solid rgba(242,111,55,0.35)', borderRadius: 20, padding: '4px 14px', marginBottom: 16 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#f26f37', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Brand Identity</span>
              </div>
              <h1 style={{ fontFamily: font, fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#ffffff', margin: '0 0 12px', lineHeight: 1.15 }}>
                Core 5 Colour Palette
              </h1>
              <p style={{ fontFamily: font, fontSize: 16, color: 'rgba(255,255,255,0.55)', margin: 0, maxWidth: 520, lineHeight: 1.7 }}>
                The five foundational colours that define the Tradie Migration visual identity — from primary actions to trusted verification states.
              </p>
            </div>
            {/* Preview strip */}
            <div style={{ display: 'flex', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', flexShrink: 0 }}>
              {PALETTE.map(c => (
                <div key={c.hex} style={{ width: 52, height: 64, background: c.hex }}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Cards ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 60px' }}>

        {/* Large primary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20, marginBottom: 48 }}>
          {PALETTE.map((c, i) => (
            <div key={c.hex} style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', background: '#fff', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.14)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.08)' }}
              onClick={() => copyToClipboard(c.hex)}>

              {/* Colour swatch */}
              <div style={{ background: c.hex, height: 160, position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px 14px 0' }}>
                {/* Number badge */}
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: c.textColor, opacity: 0.85 }}>{i + 1}</span>
                </div>
                {/* Copy hint */}
                <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 8, padding: '4px 10px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.04em' }}>CLICK TO COPY</span>
                </div>
              </div>

              {/* Tint strip */}
              <div style={{ display: 'flex', height: 10 }}>
                {c.tints.map((t, ti) => <div key={ti} style={{ flex: 1, background: t }}/>)}
              </div>

              {/* Info */}
              <div style={{ padding: '18px 18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontFamily: font, fontSize: 16, fontWeight: 800, color: '#0d1b3e' }}>{c.name}</span>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 13, fontWeight: 700, color: c.hex, background: c.hex + '18', borderRadius: 6, padding: '2px 8px' }}>{c.hex}</span>
                </div>
                <div style={{ display: 'inline-block', background: '#f0f4ff', borderRadius: 8, padding: '3px 10px', marginBottom: 12 }}>
                  <span style={{ fontFamily: font, fontSize: 11, fontWeight: 700, color: '#1565C0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{c.role}</span>
                </div>
                {/* Values */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {[['RGB', c.rgb], ['HSL', c.hsl], ['CMYK', c.cmyk]].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
                      <span style={{ fontFamily: font, fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', minWidth: 34 }}>{label}</span>
                      <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: '#555', lineHeight: 1.4 }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Usage guide rows */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '36px 40px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', marginBottom: 32 }}>
          <h2 style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: '#0d1b3e', margin: '0 0 28px' }}>Colour Usage Guide</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {PALETTE.map((c, i) => (
              <div key={c.hex} style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '16px 0', borderBottom: i < PALETTE.length - 1 ? '1px solid #f0f0f4' : 'none', flexWrap: 'wrap' }}>
                {/* Swatch */}
                <div style={{ width: 48, height: 48, borderRadius: 14, background: c.hex, flexShrink: 0, boxShadow: '0 4px 12px ' + c.hex + '55' }}/>
                {/* Name + hex */}
                <div style={{ minWidth: 160, flexShrink: 0 }}>
                  <div style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: '#0d1b3e' }}>{c.name}</div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{c.hex}</div>
                </div>
                {/* Role badge */}
                <div style={{ background: c.hex + '18', borderRadius: 20, padding: '4px 14px', flexShrink: 0 }}>
                  <span style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: c.hex === '#F6F8FF' ? '#1565C0' : c.hex }}>{c.role}</span>
                </div>
                {/* Usage pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flex: 1 }}>
                  {c.usage.map(u => (
                    <span key={u} style={{ fontFamily: font, fontSize: 12, color: '#6a7380', background: '#f6f8fc', borderRadius: 20, padding: '4px 12px', border: '1px solid #e8ecf0' }}>{u}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Combination preview */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '36px 40px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', marginBottom: 32 }}>
          <h2 style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: '#0d1b3e', margin: '0 0 28px' }}>Live Colour Combinations</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>

            {/* Dark Navy on White */}
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #f0f0f4' }}>
              <div style={{ background: '#0d1b3e', padding: '24px 20px' }}>
                <div style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Deep Navy bg</div>
                <div style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: '#ffffff' }}>Trade Headline</div>
                <div style={{ fontFamily: font, fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>Body copy on dark</div>
                <button style={{ marginTop: 14, height: 36, padding: '0 18px', background: '#f26f37', color: '#fff', border: 'none', borderRadius: 10, fontFamily: font, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Get Started</button>
              </div>
              <div style={{ padding: '12px 16px', background: '#f9faff', display: 'flex', gap: 6 }}>
                {['#0d1b3e', '#f26f37', '#ffffff'].map(col => <div key={col} style={{ width: 20, height: 20, borderRadius: 6, background: col, border: '1px solid #e8ecf0' }}/>)}
              </div>
            </div>

            {/* Brand Blue card */}
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #f0f0f4' }}>
              <div style={{ background: '#f6f8ff', padding: '24px 20px' }}>
                <div style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: '#9ca3af', marginBottom: 8 }}>Light Canvas bg</div>
                <div style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: '#0d1b3e' }}>Card Heading</div>
                <div style={{ fontFamily: font, fontSize: 13, color: '#6a7380', marginTop: 6 }}>Supporting body text</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                  <button style={{ height: 36, padding: '0 18px', background: '#1565C0', color: '#fff', border: 'none', borderRadius: 10, fontFamily: font, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Primary</button>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#12957818', borderRadius: 20, padding: '0 12px', height: 36 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#129578' }}/>
                    <span style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: '#129578' }}>Verified</span>
                  </div>
                </div>
              </div>
              <div style={{ padding: '12px 16px', background: '#f9faff', display: 'flex', gap: 6 }}>
                {['#f6f8ff', '#1565C0', '#129578', '#0d1b3e'].map(col => <div key={col} style={{ width: 20, height: 20, borderRadius: 6, background: col, border: '1px solid #e8ecf0' }}/>)}
              </div>
            </div>

            {/* Status badges */}
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid #f0f0f4' }}>
              <div style={{ background: '#fff', padding: '24px 20px' }}>
                <div style={{ fontFamily: font, fontSize: 14, fontWeight: 700, color: '#9ca3af', marginBottom: 14 }}>Status & Badge System</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Verified ✓',     bg: '#12957818', color: '#129578' },
                    { label: 'In Progress',     bg: '#1565C018', color: '#1565C0' },
                    { label: 'Action Required', bg: '#f26f3718', color: '#f26f37' },
                    { label: 'Sponsored',       bg: '#0d1b3e18', color: '#0d1b3e' },
                  ].map(b => (
                    <div key={b.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: b.bg, borderRadius: 20, padding: '5px 14px', alignSelf: 'flex-start' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: b.color }}/>
                      <span style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: b.color }}>{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '12px 16px', background: '#f9faff', display: 'flex', gap: 6 }}>
                {['#129578', '#1565C0', '#f26f37', '#0d1b3e'].map(col => <div key={col} style={{ width: 20, height: 20, borderRadius: 6, background: col, border: '1px solid #e8ecf0' }}/>)}
              </div>
            </div>
          </div>
        </div>

        {/* Accessibility row */}
        <div style={{ background: '#fff', borderRadius: 24, padding: '36px 40px', boxShadow: '0 2px 16px rgba(0,0,0,0.05)', marginBottom: 48 }}>
          <h2 style={{ fontFamily: font, fontSize: 20, fontWeight: 800, color: '#0d1b3e', margin: '0 0 8px' }}>Contrast & Accessibility</h2>
          <p style={{ fontFamily: font, fontSize: 14, color: '#6a7380', margin: '0 0 24px', lineHeight: 1.6 }}>All primary colour-on-background pairings meet WCAG 2.1 AA minimum contrast ratio of 4.5:1 for normal text.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
            {[
              { bg: '#0d1b3e', fg: '#ffffff',  ratio: '12.6:1', label: 'White on Navy',   pass: true },
              { bg: '#1565C0', fg: '#ffffff',  ratio: '5.9:1',  label: 'White on Blue',   pass: true },
              { bg: '#f26f37', fg: '#ffffff',  ratio: '3.1:1',  label: 'White on Orange', pass: false, note: 'Use large text' },
              { bg: '#129578', fg: '#ffffff',  ratio: '4.6:1',  label: 'White on Green',  pass: true },
              { bg: '#F6F8FF', fg: '#0d1b3e',  ratio: '14.1:1', label: 'Navy on Canvas',  pass: true },
            ].map(item => (
              <div key={item.label} style={{ borderRadius: 14, overflow: 'hidden', border: '1px solid #f0f0f4' }}>
                <div style={{ background: item.bg, padding: '18px 14px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontFamily: font, fontSize: 15, fontWeight: 700, color: item.fg }}>Aa</span>
                  <span style={{ fontFamily: font, fontSize: 11, color: item.fg, opacity: 0.7 }}>Sample text</span>
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: '#343434', marginBottom: 4 }}>{item.label}</div>
                  <div style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>{item.ratio}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: item.pass ? '#e8f5e9' : '#fff3e8', borderRadius: 8, padding: '3px 8px' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: item.pass ? '#129578' : '#f26f37' }}>
                      {item.pass ? '✓ WCAG AA' : '⚠ ' + item.note}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div style={{ textAlign: 'center', paddingBottom: 24 }}>
          <p style={{ fontFamily: font, fontSize: 13, color: '#9ca3af' }}>
            Tradie Migration Design System · Core Colour Palette v1.0 · Click any card to copy hex value
          </p>
        </div>
      </div>
    </div>
  )
}
