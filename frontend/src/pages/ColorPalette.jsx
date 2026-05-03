/**
 * ColorPalette — brand colour reference page for developers.
 */
const font = "'Urbanist', sans-serif"

const PALETTE = [
  { name: 'Brand Blue',     hex: '#156dbf', usage: 'Primary CTA buttons, links' },
  { name: 'Brand Orange',   hex: '#f26f37', usage: 'Highlights, accents, badges' },
  { name: 'Brand Purple',   hex: '#403c8b', usage: 'Sidebar active, headings' },
  { name: 'Indigo',         hex: '#5379f4', usage: 'Progress bars, charts' },
  { name: 'Dark Navy',      hex: '#0b3a66', usage: 'Worker sidebar indicator' },
  { name: 'Green',          hex: '#129578', usage: 'Success states, active dot' },
  { name: 'Red',            hex: '#fb4248', usage: 'Notification badges, errors' },
  { name: 'Text Primary',   hex: '#1e1e1e', usage: 'Headings, body text' },
  { name: 'Text Secondary', hex: '#6a7380', usage: 'Subtitles, placeholders' },
  { name: 'Background',     hex: '#f6f6f9', usage: 'Page background' },
  { name: 'Card White',     hex: '#ffffff', usage: 'Card surfaces' },
  { name: 'Border Grey',    hex: '#c1c1c8', usage: 'Input borders, dividers' },
]

function Swatch({ name, hex, usage }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 16, overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ height: 80, background: hex }}/>
      <div style={{ padding: '14px 16px' }}>
        <p style={{ fontFamily: font, fontWeight: 700, fontSize: 15, color: '#1e1e1e', margin: '0 0 4px' }}>
          {name}
        </p>
        <p style={{ fontFamily: 'monospace', fontSize: 13, color: '#6a7380', margin: '0 0 6px' }}>
          {hex}
        </p>
        <p style={{ fontFamily: font, fontSize: 12, color: '#9ca3af', margin: 0 }}>{usage}</p>
      </div>
    </div>
  )
}

export function ColorPalette() {
  return (
    <div style={{ minHeight: '100vh', background: '#f6f6f9', padding: '40px', fontFamily: font }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <h1 style={{ fontFamily: "'Mohave', sans-serif", fontWeight: 700, fontSize: 36, color: '#1e1e1e', margin: '0 0 8px' }}>
          <span style={{ color: '#f26f37' }}>T</span>
          <span style={{ color: '#156dbf' }}>radie App</span>
          {' '}Colour Palette
        </h1>
        <p style={{ color: '#6a7380', fontSize: 16, margin: '0 0 36px' }}>
          Brand design tokens used throughout the application.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
          {PALETTE.map(p => <Swatch key={p.hex} {...p} />)}
        </div>
      </div>
    </div>
  )
}
