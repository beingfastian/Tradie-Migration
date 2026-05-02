/**
 * LandingPage — Pixel-perfect rebuild from Figma node 1-41
 * File: KUp74wgn6I4qmd7485ciL0
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const font     = "'Urbanist', 'Inter', sans-serif"
const darkNavy = '#0d1b3e'
const blue     = '#1565c0'
const orange   = '#f26f37'
const white    = '#ffffff'

/* ─── Decorative blob assets from Figma ─── */
const blobBlueYellow   = 'https://www.figma.com/api/mcp/asset/be9569d5-cb68-4f98-9434-8259d0688294'
const blobBlue         = 'https://www.figma.com/api/mcp/asset/becffa3b-14ae-4e4b-822c-03801204813d'
const blobYellow       = 'https://www.figma.com/api/mcp/asset/06ac1147-eaf6-4dd0-b387-aa181866ee62'
const blobGroup2       = 'https://www.figma.com/api/mcp/asset/b75a4fda-99eb-4ffe-8449-2a8bb45dda3d'
const blobBlue2        = 'https://www.figma.com/api/mcp/asset/0df99576-e6ed-4c94-882b-723f97c0112c'
const blobYellow2      = 'https://www.figma.com/api/mcp/asset/3de0107e-44d8-4b74-992b-789b77fdafb9'
const ringsBg          = 'https://www.figma.com/api/mcp/asset/3cc63838-48e4-4f0b-9e74-246e26db1095'

/* ─── Inline SVG illustrations ─── */
function HeroWorkerLeft() {
  return (
    <svg width="340" height="320" viewBox="0 0 340 320" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Worker 1 - electrician */}
      <circle cx="60" cy="80" r="22" fill="#FFBE9D"/>
      <rect x="44" y="100" width="32" height="50" rx="8" fill="#1565C0"/>
      <rect x="30" y="108" width="14" height="36" rx="6" fill="#1565C0"/>
      <rect x="78" y="108" width="14" height="36" rx="6" fill="#1565C0"/>
      <rect x="46" y="148" width="12" height="44" rx="6" fill="#0d3a7a"/>
      <rect x="62" y="148" width="12" height="44" rx="6" fill="#0d3a7a"/>
      <rect x="42" y="190" width="16" height="10" rx="4" fill="#333"/>
      <rect x="62" y="190" width="16" height="10" rx="4" fill="#333"/>
      {/* Toolbox */}
      <rect x="88" y="150" width="28" height="22" rx="4" fill="#f26f37"/>
      <rect x="95" y="146" width="14" height="8" rx="3" fill="#d45a20"/>
      {/* Worker 2 - female */}
      <circle cx="180" cy="60" r="24" fill="#FFBE9D"/>
      <rect x="162" y="82" width="36" height="55" rx="8" fill="#129578"/>
      <rect x="146" y="92" width="16" height="38" rx="6" fill="#129578"/>
      <rect x="198" y="92" width="16" height="38" rx="6" fill="#129578"/>
      <rect x="164" y="135" width="14" height="46" rx="6" fill="#0a5c47"/>
      <rect x="182" y="135" width="14" height="46" rx="6" fill="#0a5c47"/>
      <rect x="160" y="179" width="18" height="10" rx="4" fill="#333"/>
      <rect x="182" y="179" width="18" height="10" rx="4" fill="#333"/>
      {/* Clipboard */}
      <rect x="205" y="105" width="24" height="30" rx="4" fill="white" stroke="#ccc" strokeWidth="1.5"/>
      <line x1="210" y1="114" x2="224" y2="114" stroke="#999" strokeWidth="1.5"/>
      <line x1="210" y1="120" x2="224" y2="120" stroke="#999" strokeWidth="1.5"/>
      <line x1="210" y1="126" x2="218" y2="126" stroke="#999" strokeWidth="1.5"/>
      {/* Worker 3 - builder */}
      <circle cx="295" cy="75" r="22" fill="#FFBE9D"/>
      <rect x="280" y="95" width="30" height="48" rx="7" fill="#f26f37"/>
      <rect x="267" y="104" width="13" height="34" rx="5" fill="#f26f37"/>
      <rect x="310" y="104" width="13" height="34" rx="5" fill="#f26f37"/>
      <rect x="282" y="141" width="12" height="44" rx="6" fill="#8B4513"/>
      <rect x="297" y="141" width="12" height="44" rx="6" fill="#8B4513"/>
      <rect x="278" y="183" width="16" height="10" rx="4" fill="#333"/>
      <rect x="297" y="183" width="16" height="10" rx="4" fill="#333"/>
      {/* Hard hat */}
      <path d="M278 72 Q295 50 312 72" fill="#FFD700" stroke="#F0C000" strokeWidth="1.5"/>
      {/* Ground shadow */}
      <ellipse cx="60" cy="202" rx="28" ry="7" fill="rgba(0,0,0,0.07)"/>
      <ellipse cx="180" cy="190" rx="30" ry="7" fill="rgba(0,0,0,0.07)"/>
      <ellipse cx="295" cy="196" rx="28" ry="7" fill="rgba(0,0,0,0.07)"/>
      {/* Decorative elements */}
      <circle cx="130" cy="30" r="8" fill="#f26f37" opacity="0.3"/>
      <circle cx="250" cy="20" r="5" fill="#1565c0" opacity="0.3"/>
      <circle cx="30" cy="180" r="6" fill="#129578" opacity="0.4"/>
    </svg>
  )
}

function FeatureIllustrationCareer() {
  return (
    <svg width="180" height="160" viewBox="0 0 180 160" fill="none">
      <circle cx="90" cy="55" r="28" fill="#FFBE9D"/>
      <rect x="72" y="80" width="36" height="55" rx="10" fill="#1565C0"/>
      <rect x="56" y="92" width="16" height="38" rx="6" fill="#1565C0"/>
      <rect x="108" y="92" width="16" height="38" rx="6" fill="#1565C0"/>
      <rect x="74" y="133" width="14" height="22" rx="5" fill="#0d3a7a"/>
      <rect x="92" y="133" width="14" height="22" rx="5" fill="#0d3a7a"/>
      <rect x="44" y="80" width="30" height="38" rx="6" fill="white" opacity="0.15"/>
      <rect x="106" y="85" width="30" height="30" rx="6" fill="white" opacity="0.15"/>
      <path d="M50 95 L70 95 M50 102 L70 102 M50 109 L62 109" stroke="white" strokeWidth="2" opacity="0.5"/>
      <circle cx="90" cy="155" rx="24" ry="6" fill="rgba(255,255,255,0.15)"/>
    </svg>
  )
}

function FeatureIllustrationWorkforce() {
  return (
    <svg width="180" height="160" viewBox="0 0 180 160" fill="none">
      <circle cx="65" cy="50" r="22" fill="#FFBE9D"/>
      <rect x="50" y="70" width="30" height="45" rx="8" fill="#129578"/>
      <rect x="36" y="80" width="14" height="30" rx="5" fill="#129578"/>
      <rect x="80" y="80" width="14" height="30" rx="5" fill="#129578"/>
      <circle cx="120" cy="55" r="22" fill="#FFBE9D"/>
      <rect x="105" y="75" width="30" height="45" rx="8" fill="#f26f37"/>
      <rect x="91" y="85" width="14" height="30" rx="5" fill="#f26f37"/>
      <rect x="135" y="85" width="14" height="30" rx="5" fill="#f26f37"/>
      <path d="M80 85 Q92 78 105 85" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="92" cy="75" r="6" fill="#FFD700"/>
      <path d="M89 75 L91.5 77.5 L96 72" stroke="#0d1b3e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function FeatureIllustrationEnroll() {
  return (
    <svg width="160" height="200" viewBox="0 0 160 200" fill="none">
      {/* Phone */}
      <rect x="45" y="20" width="70" height="130" rx="14" fill="white" stroke="#e0e0e0" strokeWidth="2"/>
      <rect x="49" y="30" width="62" height="100" rx="6" fill="#f3f6ff"/>
      {/* Screen content */}
      <rect x="55" y="38" width="40" height="6" rx="3" fill="#1565C0"/>
      <rect x="55" y="50" width="50" height="4" rx="2" fill="#ccc"/>
      <rect x="55" y="58" width="35" height="4" rx="2" fill="#ccc"/>
      <rect x="55" y="70" width="50" height="28" rx="6" fill="#e8f0fe"/>
      <circle cx="70" cy="84" r="8" fill="#1565C0" opacity="0.7"/>
      <rect x="82" y="79" width="18" height="4" rx="2" fill="#1565C0"/>
      <rect x="82" y="86" width="12" height="3" rx="1.5" fill="#888"/>
      <rect x="55" y="104" width="50" height="20" rx="5" fill="#f26f37" opacity="0.9"/>
      <rect x="67" y="110" width="26" height="8" rx="3" fill="white"/>
      {/* Notch */}
      <rect x="68" y="22" width="24" height="8" rx="4" fill="#e0e0e0"/>
      {/* Person beside phone */}
      <circle cx="130" cy="80" r="18" fill="#FFBE9D"/>
      <rect x="115" y="96" width="30" height="40" rx="7" fill="#403c8b"/>
      <rect x="103" y="104" width="12" height="26" rx="5" fill="#403c8b"/>
      <rect x="145" y="104" width="12" height="26" rx="5" fill="#403c8b"/>
    </svg>
  )
}

function StepIllustration1() {
  return (
    <svg width="280" height="240" viewBox="0 0 280 240" fill="none">
      {/* Document */}
      <rect x="60" y="30" width="140" height="180" rx="12" fill="white" stroke="#e0e8ff" strokeWidth="2"/>
      <rect x="76" y="55" width="80" height="10" rx="5" fill="#1565C0" opacity="0.7"/>
      <rect x="76" y="74" width="108" height="6" rx="3" fill="#e0e0e0"/>
      <rect x="76" y="86" width="95" height="6" rx="3" fill="#e0e0e0"/>
      <rect x="76" y="98" width="108" height="6" rx="3" fill="#e0e0e0"/>
      <rect x="76" y="115" width="50" height="6" rx="3" fill="#e0e0e0"/>
      <rect x="76" y="127" width="70" height="6" rx="3" fill="#e0e0e0"/>
      {/* Verified badge */}
      <circle cx="185" cy="50" r="20" fill="#129578"/>
      <path d="M176 50 L182 56 L194 44" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Person */}
      <circle cx="225" cy="100" r="24" fill="#FFBE9D"/>
      <rect x="208" y="122" width="34" height="50" rx="9" fill="#f26f37"/>
      <rect x="193" y="132" width="15" height="34" rx="6" fill="#f26f37"/>
      <rect x="242" y="132" width="15" height="34" rx="6" fill="#f26f37"/>
      <rect x="210" y="170" width="14" height="40" rx="6" fill="#d45a20"/>
      <rect x="228" y="170" width="14" height="40" rx="6" fill="#d45a20"/>
      {/* Magnifier */}
      <circle cx="44" cy="150" r="28" fill="none" stroke="#1565C0" strokeWidth="3"/>
      <line x1="64" y1="170" x2="80" y2="186" stroke="#1565C0" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="44" cy="150" r="18" fill="#e8f0fe"/>
    </svg>
  )
}

function StepIllustration2() {
  return (
    <svg width="280" height="240" viewBox="0 0 280 240" fill="none">
      {/* Dashboard */}
      <rect x="30" y="20" width="180" height="140" rx="12" fill="white" stroke="#e0e8ff" strokeWidth="2"/>
      <rect x="30" y="20" width="180" height="32" rx="12" fill="#1565C0"/>
      <rect x="30" y="40" width="180" height="12" fill="#1565C0"/>
      <circle cx="48" cy="36" r="5" fill="white" opacity="0.5"/>
      <circle cx="64" cy="36" r="5" fill="white" opacity="0.5"/>
      <circle cx="80" cy="36" r="5" fill="white" opacity="0.5"/>
      {/* Chart bars */}
      <rect x="48" y="100" width="20" height="46" rx="4" fill="#1565C0" opacity="0.7"/>
      <rect x="76" y="80" width="20" height="66" rx="4" fill="#f26f37" opacity="0.8"/>
      <rect x="104" y="90" width="20" height="56" rx="4" fill="#129578" opacity="0.7"/>
      <rect x="132" y="70" width="20" height="76" rx="4" fill="#403c8b" opacity="0.7"/>
      <rect x="160" y="88" width="20" height="58" rx="4" fill="#1565C0" opacity="0.5"/>
      {/* Person left */}
      <circle cx="234" cy="90" r="22" fill="#FFBE9D"/>
      <rect x="219" y="110" width="30" height="44" rx="8" fill="#129578"/>
      <rect x="205" y="120" width="14" height="30" rx="5" fill="#129578"/>
      <rect x="249" y="120" width="14" height="30" rx="5" fill="#129578"/>
      <rect x="221" y="152" width="12" height="38" rx="5" fill="#0a5c47"/>
      <rect x="237" y="152" width="12" height="38" rx="5" fill="#0a5c47"/>
      {/* Arrow / connection */}
      <path d="M210 105 L215 100 L210 95" stroke="#f26f37" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  )
}

function StepIllustration3() {
  return (
    <svg width="280" height="240" viewBox="0 0 280 240" fill="none">
      {/* Two people shaking hands / agreement */}
      <circle cx="75" cy="72" r="26" fill="#FFBE9D"/>
      <rect x="57" y="96" width="36" height="55" rx="10" fill="#1565C0"/>
      <rect x="41" y="108" width="16" height="38" rx="6" fill="#1565C0"/>
      <rect x="93" y="108" width="16" height="38" rx="6" fill="#1565C0"/>
      <rect x="59" y="149" width="14" height="46" rx="6" fill="#0d3a7a"/>
      <rect x="77" y="149" width="14" height="46" rx="6" fill="#0d3a7a"/>

      <circle cx="200" cy="72" r="26" fill="#FFBE9D"/>
      <rect x="182" y="96" width="36" height="55" rx="10" fill="#f26f37"/>
      <rect x="166" y="108" width="16" height="38" rx="6" fill="#f26f37"/>
      <rect x="218" y="108" width="16" height="38" rx="6" fill="#f26f37"/>
      <rect x="184" y="149" width="14" height="46" rx="6" fill="#d45a20"/>
      <rect x="202" y="149" width="14" height="46" rx="6" fill="#d45a20"/>

      {/* Handshake in middle */}
      <path d="M110 130 Q137 118 165 130" stroke="#FFD700" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <circle cx="137" cy="120" r="12" fill="#FFD700" opacity="0.9"/>
      <path d="M131 120 L135 124 L143 115" stroke="#0d1b3e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>

      {/* Document */}
      <rect x="108" y="155" width="58" height="72" rx="8" fill="white" stroke="#e0e8ff" strokeWidth="2"/>
      <rect x="118" y="168" width="38" height="5" rx="2.5" fill="#1565C0"/>
      <rect x="118" y="178" width="30" height="4" rx="2" fill="#e0e0e0"/>
      <rect x="118" y="188" width="38" height="4" rx="2" fill="#e0e0e0"/>
      <rect x="118" y="198" width="22" height="4" rx="2" fill="#e0e0e0"/>
      <rect x="118" y="212" width="38" height="8" rx="4" fill="#f26f37"/>
    </svg>
  )
}

function FAQIllustration() {
  return (
    <svg width="320" height="340" viewBox="0 0 320 340" fill="none">
      {/* Chat bubbles */}
      <rect x="60" y="20" width="180" height="60" rx="16" fill="#e8f0fe"/>
      <path d="M80 80 L70 100 L100 80" fill="#e8f0fe"/>
      <rect x="74" y="38" width="120" height="8" rx="4" fill="#1565C0" opacity="0.5"/>
      <rect x="74" y="52" width="90" height="8" rx="4" fill="#1565C0" opacity="0.3"/>

      <rect x="30" y="118" width="200" height="60" rx="16" fill="#1565C0"/>
      <path d="M210 178 L225 198 L195 178" fill="#1565C0"/>
      <rect x="46" y="136" width="130" height="8" rx="4" fill="white" opacity="0.7"/>
      <rect x="46" y="150" width="100" height="8" rx="4" fill="white" opacity="0.5"/>

      <rect x="70" y="216" width="170" height="60" rx="16" fill="#e8f5e9"/>
      <path d="M90 276 L75 296 L108 276" fill="#e8f5e9"/>
      <rect x="86" y="234" width="110" height="8" rx="4" fill="#129578" opacity="0.5"/>
      <rect x="86" y="248" width="80" height="8" rx="4" fill="#129578" opacity="0.3"/>

      {/* Person */}
      <circle cx="255" cy="130" r="28" fill="#FFBE9D"/>
      <rect x="236" y="156" width="38" height="55" rx="10" fill="#403c8b"/>
      <rect x="220" y="168" width="16" height="38" rx="6" fill="#403c8b"/>
      <rect x="274" y="168" width="16" height="38" rx="6" fill="#403c8b"/>
      <rect x="238" y="209" width="15" height="46" rx="6" fill="#2a2460"/>
      <rect x="258" y="209" width="15" height="46" rx="6" fill="#2a2460"/>

      {/* Question marks */}
      <text x="268" y="88" fontSize="28" fill="#f26f37" fontWeight="700" opacity="0.7">?</text>
      <text x="30" y="310" fontSize="20" fill="#1565C0" fontWeight="700" opacity="0.5">?</text>
    </svg>
  )
}

function CTAIllustration() {
  return (
    <svg width="300" height="260" viewBox="0 0 300 260" fill="none">
      {/* Worker with phone */}
      <circle cx="150" cy="65" r="32" fill="#FFBE9D"/>
      <rect x="128" y="94" width="44" height="65" rx="12" fill="#f26f37"/>
      <rect x="108" y="108" width="20" height="44" rx="7" fill="#f26f37"/>
      <rect x="172" y="108" width="20" height="44" rx="7" fill="#f26f37"/>
      <rect x="130" y="157" width="18" height="54" rx="7" fill="#d45a20"/>
      <rect x="152" y="157" width="18" height="54" rx="7" fill="#d45a20"/>
      <rect x="126" y="209" width="22" height="12" rx="5" fill="#555"/>
      <rect x="152" y="209" width="22" height="12" rx="5" fill="#555"/>
      {/* Phone in hand */}
      <rect x="172" y="115" width="44" height="76" rx="10" fill="white" opacity="0.9"/>
      <rect x="176" y="123" width="36" height="56" rx="6" fill="#e8f0fe"/>
      <rect x="183" y="130" width="22" height="5" rx="2.5" fill="#1565C0"/>
      <rect x="183" y="140" width="22" height="4" rx="2" fill="#ccc"/>
      <rect x="183" y="149" width="22" height="14" rx="4" fill="#f26f37" opacity="0.8"/>
      <rect x="185" y="153" width="18" height="6" rx="3" fill="white"/>
      {/* Stars */}
      <text x="52" y="88" fontSize="18" fill="#FFD700" opacity="0.8">★</text>
      <text x="235" y="70" fontSize="14" fill="#FFD700" opacity="0.7">★</text>
      <text x="76" y="170" fontSize="12" fill="#FFD700" opacity="0.6">★</text>
      {/* Floating badge */}
      <rect x="20" y="120" width="80" height="32" rx="10" fill="white" opacity="0.15"/>
      <circle cx="36" cy="136" r="8" fill="#129578" opacity="0.8"/>
      <rect x="50" y="130" width="38" height="5" rx="2.5" fill="white" opacity="0.7"/>
      <rect x="50" y="139" width="28" height="4" rx="2" fill="white" opacity="0.5"/>
    </svg>
  )
}

/* ─── FAQ Item ─── */
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      onClick={() => setOpen(o => !o)}
      style={{ borderBottom: '1px solid #e8ecf0', padding: '20px 0', cursor: 'pointer' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.4 }}>{question}</span>
        <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #d0d5dd', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', background: open ? '#1565C0' : 'transparent', borderColor: open ? '#1565C0' : '#d0d5dd' }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            {open
              ? <line x1="1" y1="6" x2="11" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              : <><line x1="6" y1="1" x2="6" y2="11" stroke="#555" strokeWidth="2" strokeLinecap="round"/><line x1="1" y1="6" x2="11" y2="6" stroke="#555" strokeWidth="2" strokeLinecap="round"/></>
            }
          </svg>
        </div>
      </div>
      {open && (
        <p style={{ fontFamily: font, fontSize: 15, color: '#6a7380', lineHeight: 1.7, margin: '12px 0 4px' }}>
          {answer}
        </p>
      )}
    </div>
  )
}

const FAQS = [
  { question: 'How do I create an account on Tradie App?', answer: 'Simply click "Sign Up", choose your role (Worker, Employer, or Training Provider), fill in your details, and verify your email. The whole process takes less than 5 minutes.' },
  { question: 'What are the benefits of registering as a Trainee?', answer: 'As a registered trainee you get access to verified course listings, direct connections with RTOs, employer visibility, and a dashboard to track your qualification progress and visa pathway.' },
  { question: 'How does employer verification work on Tradie App?', answer: 'Employers submit their ABN, company documents, and sponsorship details. Our team reviews each submission within 48 hours and issues a Verified Employer badge upon approval.' },
  { question: 'Can I manage multiple training programs through Tradie App?', answer: 'Yes! Training providers can create and manage multiple courses, track enrollments, communicate with students, and export completion reports — all from a single dashboard.' },
  { question: 'Is there support available if I have issues?', answer: 'Absolutely. We offer live chat support, a comprehensive help centre, and a dedicated onboarding team for Training Providers and Employers. Workers also have access to our community forum.' },
]

/* ─── Main Component ─── */
export function LandingPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div style={{ fontFamily: font, background: white, overflowX: 'hidden' }}>

      {/* ════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════ */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', borderBottom: '1px solid #f0f0f4', height: 68, display: 'flex', alignItems: 'center', padding: '0 60px' }}>
        <div style={{ maxWidth: 1280, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: "'Mohave','Urbanist',sans-serif", fontWeight: 700, fontSize: 22, letterSpacing: 0.5 }}>
              <span style={{ color: orange }}>T</span>
              <span style={{ color: blue }}>radie</span>
              <span style={{ color: '#1a1a2e' }}> Migration</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 36 }}>
            {['Find Work', 'Find Talent', 'About', 'Contact'].map(link => (
              <a key={link} href="#" style={{ fontFamily: font, fontSize: 15, fontWeight: 500, color: '#4a4a6a', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = blue}
                onMouseLeave={e => e.currentTarget.style.color = '#4a4a6a'}>
                {link}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={{ height: 40, padding: '0 22px', background: 'transparent', border: '1.5px solid #d0d5dd', borderRadius: 10, cursor: 'pointer', fontFamily: font, fontSize: 14, fontWeight: 600, color: '#343434', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = blue; e.currentTarget.style.color = blue }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#d0d5dd'; e.currentTarget.style.color = '#343434' }}>
                Sign In
              </button>
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button style={{ height: 40, padding: '0 22px', background: blue, color: white, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: font, fontSize: 14, fontWeight: 600, transition: 'background 0.15s', boxShadow: '0 4px 12px rgba(21,101,192,0.25)' }}
                onMouseEnter={e => e.currentTarget.style.background = '#1255a8'}
                onMouseLeave={e => e.currentTarget.style.background = blue}>
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#fafbff', padding: '80px 60px 60px', minHeight: 580 }}>
        {/* Background blobs */}
        <img src={blobBlueYellow} alt="" style={{ position: 'absolute', top: -40, left: -60, width: 320, height: 280, opacity: 0.85, zIndex: 0, pointerEvents: 'none' }}/>
        <img src={blobBlue} alt="" style={{ position: 'absolute', top: 20, right: -50, width: 280, height: 280, opacity: 0.7, zIndex: 0, pointerEvents: 'none' }}/>
        <img src={blobYellow} alt="" style={{ position: 'absolute', bottom: -30, right: 100, width: 200, height: 200, opacity: 0.6, zIndex: 0, pointerEvents: 'none' }}/>
        {/* Small dots */}
        <div style={{ position: 'absolute', top: '18%', left: '7%', width: 8, height: 8, borderRadius: '50%', background: orange, opacity: 0.6, zIndex: 1 }}/>
        <div style={{ position: 'absolute', top: '14%', left: '9.5%', width: 5, height: 5, borderRadius: '50%', background: orange, opacity: 0.4, zIndex: 1 }}/>
        <div style={{ position: 'absolute', top: '22%', right: '9%', width: 6, height: 6, borderRadius: '50%', background: '#c8d8f5', zIndex: 1 }}/>
        <div style={{ position: 'absolute', bottom: '20%', left: '5%', width: 10, height: 10, borderRadius: '50%', background: '#b4eb50', opacity: 0.7, zIndex: 1 }}/>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {/* Hero Illustration */}
          <div style={{ marginBottom: 24 }}>
            <HeroWorkerLeft />
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: font, fontSize: 'clamp(2rem, 4vw, 3.1rem)', fontWeight: 800, color: '#1a1a2e', lineHeight: 1.2, maxWidth: 720, margin: '0 0 20px' }}>
            Connecting Global Talent to<br />
            <span style={{ color: blue }}>Australia's Trade Industry.</span>
          </h1>

          {/* Sub-headline */}
          <p style={{ fontFamily: font, fontSize: 17, color: '#6a7380', maxWidth: 560, lineHeight: 1.7, margin: '0 0 32px' }}>
            The all-in-one platform for skilled tradies, employers, and training providers. Verified skills, simplified sponsorship.
          </p>

          {/* Search bar */}
          <div style={{ display: 'flex', alignItems: 'center', background: white, borderRadius: 14, border: '1.5px solid #d0d5dd', padding: '10px 16px', width: '100%', maxWidth: 520, marginBottom: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search for Tradie opportunities in Australia..." style={{ flex: 1, border: 'none', outline: 'none', fontFamily: font, fontSize: 14, color: '#343434', background: 'transparent', margin: '0 12px' }}/>
            <button style={{ height: 36, padding: '0 20px', background: blue, color: white, border: 'none', borderRadius: 10, cursor: 'pointer', fontFamily: font, fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
              Search
            </button>
          </div>

          {/* CTA Button */}
          <button onClick={() => navigate('/register')} style={{ height: 52, padding: '0 40px', background: blue, color: white, border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: font, fontSize: 16, fontWeight: 700, boxShadow: '0 6px 20px rgba(21,101,192,0.3)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#1255a8'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = blue; e.currentTarget.style.transform = '' }}>
            Browse Jobs
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FEATURE ECOSYSTEM SECTION  (dark navy)
      ════════════════════════════════════════ */}
      <section style={{ background: darkNavy, padding: '80px 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Subtle rings bg */}
        <img src={ringsBg} alt="" style={{ position: 'absolute', right: -120, top: '50%', transform: 'translateY(-50%)', width: 500, height: 500, opacity: 0.08, pointerEvents: 'none' }}/>

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap', marginBottom: 56 }}>
            <div style={{ maxWidth: 380 }}>
              <h2 style={{ fontFamily: font, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 800, color: white, lineHeight: 1.2, margin: '0 0 16px' }}>
                A Powerful Ecosystem<br />for the Trade Industry
              </h2>
            </div>
            <div style={{ maxWidth: 440 }}>
              <p style={{ fontFamily: font, fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: 0 }}>
                Whether you're looking to launch your career, build a verified workforce, or deliver industry-leading training — Tradie Migration brings everyone together in one powerful platform built for the Australian market.
              </p>
            </div>
          </div>

          {/* 3 Feature Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              {
                title: 'Launch Your Australian Career',
                desc: 'Register, upload your trade documents, and get matched to verified employers looking for your exact skill set. Your Australian journey starts here.',
                illus: <FeatureIllustrationCareer />,
                accent: blue,
              },
              {
                title: 'Build a Verified Workforce',
                desc: 'Source pre-screened, licensed tradies with confirmed qualifications. Post roles, review applications, and sponsor skilled workers — all in one place.',
                illus: <FeatureIllustrationWorkforce />,
                accent: '#129578',
              },
              {
                title: 'Enrol the Next Generation',
                desc: 'Connect with aspiring tradies, manage course enrolments, and issue certifications that employers trust. Grow your institution with smart digital tools.',
                illus: <FeatureIllustrationEnroll />,
                accent: '#f26f37',
              },
            ].map((card, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: '32px 28px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', gap: 20, transition: 'transform 0.2s, background 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = '' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 170 }}>
                  {card.illus}
                </div>
                <div>
                  <h3 style={{ fontFamily: font, fontSize: 20, fontWeight: 700, color: white, margin: '0 0 12px', lineHeight: 1.3 }}>{card.title}</h3>
                  <p style={{ fontFamily: font, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, margin: 0 }}>{card.desc}</p>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <span style={{ fontFamily: font, fontSize: 13, fontWeight: 700, color: card.accent, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                    Learn More
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          3 EASY STEPS SECTION
      ════════════════════════════════════════ */}
      <section style={{ background: white, padding: '100px 60px', position: 'relative', overflow: 'hidden' }}>
        {/* Blob decorations */}
        <img src={blobGroup2} alt="" style={{ position: 'absolute', left: -100, top: '10%', width: 260, height: 260, opacity: 0.5, pointerEvents: 'none' }}/>
        <img src={blobBlue2} alt="" style={{ position: 'absolute', right: -80, bottom: '10%', width: 240, height: 240, opacity: 0.45, pointerEvents: 'none' }}/>

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(1.8rem, 3.2vw, 2.6rem)', fontWeight: 800, color: '#1a1a2e', lineHeight: 1.2, margin: '0 0 16px' }}>
              Your Path to Success in<br />
              <span style={{ color: blue }}>3 Easy Steps</span>
            </h2>
            <p style={{ fontFamily: font, fontSize: 16, color: '#6a7380', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
              Whether you're hiring or looking for work, we've simplified the process to get you moving faster.
            </p>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 80 }}>
            {[
              {
                num: '1',
                title: 'Build a Profile That Stands Out',
                desc: 'Register and upload your documents. We verify your licences and attempt to match you to your next role with confidence. Your profile becomes your digital trade passport.',
                illus: <StepIllustration1 />,
                reverse: false,
              },
              {
                num: '2',
                title: 'Find Your Perfect Industry Match',
                desc: "Our smart dashboard connects skilled tradies with registered sponsors and links students to the right RTO training programs. Let the platform do the heavy lifting.",
                illus: <StepIllustration2 />,
                reverse: true,
              },
              {
                num: '3',
                title: 'Sign, Enrol, and Start',
                desc: "Once you've found your perfect opportunity or training program, finalise everything within the Tradie App. From offer to onboarding in days, not months.",
                illus: <StepIllustration3 />,
                reverse: false,
              },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 60, flexDirection: step.reverse ? 'row-reverse' : 'row', flexWrap: 'wrap' }}>
                {/* Illustration side */}
                <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center' }}>
                  {step.illus}
                </div>
                {/* Text side */}
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 20 }}>
                    <div style={{ width: 52, height: 52, borderRadius: '50%', background: blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 6px 18px rgba(21,101,192,0.3)' }}>
                      <span style={{ fontFamily: font, fontSize: 22, fontWeight: 800, color: white }}>{step.num}</span>
                    </div>
                    <div style={{ height: 2, flex: 1, background: 'linear-gradient(90deg, #e8f0fe, transparent)', borderRadius: 2 }}/>
                  </div>
                  <h3 style={{ fontFamily: font, fontSize: 'clamp(1.3rem, 2vw, 1.75rem)', fontWeight: 800, color: '#1a1a2e', margin: '0 0 16px', lineHeight: 1.3 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontFamily: font, fontSize: 16, color: '#6a7380', lineHeight: 1.75, margin: 0, maxWidth: 460 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FAQ SECTION
      ════════════════════════════════════════ */}
      <section style={{ background: '#f6f8fc', padding: '100px 60px', position: 'relative', overflow: 'hidden' }}>
        <img src={blobYellow2} alt="" style={{ position: 'absolute', left: -80, bottom: -60, width: 260, height: 260, opacity: 0.5, pointerEvents: 'none' }}/>

        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 60, alignItems: 'flex-start', flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
          {/* Left — text + accordion */}
          <div style={{ flex: 1, minWidth: 320 }}>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(1.6rem, 2.8vw, 2.4rem)', fontWeight: 800, color: '#1a1a2e', lineHeight: 1.25, margin: '0 0 12px' }}>
              Got Questions?<br /><span style={{ color: blue }}>We've Got Answers.</span>
            </h2>
            <p style={{ fontFamily: font, fontSize: 15, color: '#6a7380', margin: '0 0 36px', lineHeight: 1.7, maxWidth: 420 }}>
              Find answers to the most common questions about getting started, managing your account, and getting the most out of Tradie Migration.
            </p>
            <div>
              {FAQS.map((faq, i) => <FaqItem key={i} {...faq} />)}
            </div>
          </div>

          {/* Right — illustration */}
          <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
            <FAQIllustration />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA BANNER  (dark navy)
      ════════════════════════════════════════ */}
      <section style={{ background: darkNavy, padding: '80px 60px', position: 'relative', overflow: 'hidden' }}>
        <img src={ringsBg} alt="" style={{ position: 'absolute', left: -120, top: '50%', transform: 'translateY(-50%)', width: 480, height: 480, opacity: 0.07, pointerEvents: 'none' }}/>

        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40, flexWrap: 'wrap', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 540 }}>
            <h2 style={{ fontFamily: font, fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, color: white, lineHeight: 1.25, margin: '0 0 16px' }}>
              Build Your Future<br />with <span style={{ color: orange }}>Tradie App.</span>
            </h2>
            <p style={{ fontFamily: font, fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, margin: '0 0 32px', maxWidth: 440 }}>
              Join thousands of skilled workers, registered employers, and trusted training providers already using Tradie Migration to shape Australia's trade industry.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')} style={{ height: 52, padding: '0 36px', background: orange, color: white, border: 'none', borderRadius: 14, cursor: 'pointer', fontFamily: font, fontSize: 16, fontWeight: 700, boxShadow: '0 6px 20px rgba(242,111,55,0.4)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#d95e25'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = orange; e.currentTarget.style.transform = '' }}>
                Get Started Free
              </button>
              <button onClick={() => navigate('/login')} style={{ height: 52, padding: '0 32px', background: 'transparent', color: white, border: '2px solid rgba(255,255,255,0.3)', borderRadius: 14, cursor: 'pointer', fontFamily: font, fontSize: 16, fontWeight: 600, transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}>
                Sign In
              </button>
            </div>
          </div>
          <div>
            <CTAIllustration />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════ */}
      <footer style={{ background: darkNavy, borderTop: '1px solid rgba(255,255,255,0.08)', padding: '48px 60px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, flexWrap: 'wrap', gap: 32 }}>
            {/* Logo + desc */}
            <div style={{ maxWidth: 300 }}>
              <div style={{ fontFamily: "'Mohave','Urbanist',sans-serif", fontWeight: 700, fontSize: 20, marginBottom: 12 }}>
                <span style={{ color: orange }}>T</span>
                <span style={{ color: '#5b9bd5' }}>radie</span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}> Migration</span>
              </div>
              <p style={{ fontFamily: font, fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0 }}>
                Connecting skilled tradespeople with opportunity across Australia's growing infrastructure and construction sectors.
              </p>
            </div>

            {/* Nav links */}
            <div style={{ display: 'flex', gap: 60, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Platform</div>
                {['Find Work', 'Find Talent', 'Training Providers', 'How It Works'].map(l => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ fontFamily: font, fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = white}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{l}</a>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Company</div>
                {['About', 'Contact', 'Privacy Policy', 'Terms of Service'].map(l => (
                  <div key={l} style={{ marginBottom: 10 }}>
                    <a href="#" style={{ fontFamily: font, fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = white}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>{l}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 24 }}/>

          {/* Bottom row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <p style={{ fontFamily: font, fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
              © {new Date().getFullYear()} Tradie Migration. All rights reserved.
            </p>
            {/* Social icons */}
            <div style={{ display: 'flex', gap: 14 }}>
              {[
                /* Twitter/X */
                <svg key="x" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                /* Facebook */
                <svg key="fb" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                /* Instagram */
                <svg key="ig" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
                /* LinkedIn */
                <svg key="li" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              ].map((icon, i) => (
                <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = white }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
