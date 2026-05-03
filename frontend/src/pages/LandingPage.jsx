/**
 * LandingPage — Pixel-perfect from Figma KUp74wgn6I4qmd7485ciL0 node 1:41
 * ALL assets pulled directly from Figma API (fresh URLs).
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const font      = "'Urbanist', sans-serif"
const fontMohave = "'Mohave', sans-serif"

/* ─── FRESH FIGMA ASSET URLs ─── */
// Navbar
const imgChevron   = 'https://www.figma.com/api/mcp/asset/e173ba3b-23e2-4872-b8fe-b3fb66476c5e'
const imgDivider   = 'https://www.figma.com/api/mcp/asset/0bb498ef-d6e8-4860-ac10-179b971608a0'
const imgArrow     = 'https://www.figma.com/api/mcp/asset/695bce7c-9ab0-4bb7-9e8a-a49c5c362afc'
// Hero (node 1:219 — 1251.6×572px)
const imgHero      = 'https://www.figma.com/api/mcp/asset/6d50ea20-40a5-4f6a-ba04-08d6420589f1'
// Feature cards — all 3 share same background
const imgCardBg    = 'https://www.figma.com/api/mcp/asset/a1484485-1d19-4bc6-a520-d188fd9bfebb'
// Feature card illustrations
const imgCard1Illus = 'https://www.figma.com/api/mcp/asset/46931c2a-8003-4b47-a93f-8da522879c0e' // undraw_maker-launch
const imgCard2Illus = 'https://www.figma.com/api/mcp/asset/3fc88649-aa9c-4c9b-9bf5-faec796925c8' // undraw_team-work
const imgCard3Illus = 'https://www.figma.com/api/mcp/asset/5e2632f1-d2b6-473f-b965-703a3c519b80' // phone mockup group
// Steps (node 1:627 = 477×363, 1:672 = 443×494, 1:814 = 506×577)
const imgStep1     = 'https://www.figma.com/api/mcp/asset/07aee1aa-4ef4-4711-946d-758575d1acea'
const imgStep2     = 'https://www.figma.com/api/mcp/asset/6f32956d-1d18-4257-8f88-4aa3c894ead7'
const imgStep3     = 'https://www.figma.com/api/mcp/asset/a9dde15f-3191-41e8-8b70-8b459cfc7772'
// FAQ illustration (node 1:859 — 712×700px)
const imgFaqIllus  = 'https://www.figma.com/api/mcp/asset/16704717-686f-43ca-bab2-0b78bb3ff911'

/* radial gradient used for Features + CTA sections (exact from Figma) */
const radialGrad = `url("data:image/svg+xml;utf8,<svg viewBox='0 0 1 1' xmlns='http://www.w3.org/2000/svg'><rect x='0' y='0' height='100%25' width='100%25' fill='url(%23g)'/><defs><radialGradient id='g' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(-169 -100 206 -71 1804 945)'><stop stop-color='rgba(21,109,191,1)' offset='0'/><stop stop-color='rgba(49,126,198,1)' offset='0.035'/><stop stop-color='rgba(77,143,206,1)' offset='0.066'/><stop stop-color='rgba(134,178,220,1)' offset='0.127'/><stop stop-color='rgba(190,212,235,1)' offset='0.188'/><stop stop-color='rgba(246,246,249,1)' offset='0.25'/><stop stop-color='rgba(190,212,235,1)' offset='0.437'/><stop stop-color='rgba(134,178,220,1)' offset='0.625'/><stop stop-color='rgba(77,143,206,1)' offset='0.812'/><stop stop-color='rgba(21,109,191,1)' offset='1'/></radialGradient></defs></svg>")`

const FAQS = [
  { q: 'How does the trade verification work?',
    a: 'Our verification process checks your licences, qualifications, and work history against Australian Standards. You upload your documents and our team reviews them within 48 hours, issuing a Verified badge on your profile.' },
  { q: 'Can employers offer visa sponsorship?',
    a: 'Yes. Registered employers with Standard Business Sponsorship (SBS) approval can directly offer 482 Temporary Skill Shortage visa sponsorship to eligible tradies through the platform.' },
  { q: 'What is the benefit of registering as a Trainer?',
    a: 'Registered Training Organisations (RTOs) can list their entire course catalog, manage student enrollments, and track progress. It allows you to connect directly with tradies who need gap training or specific certifications to meet Australian Standards.' },
  { q: 'Can I use the app to manage my trade documents?',
    a: 'Absolutely. You can securely upload, store, and share all your trade documents — licences, certificates, safety tickets, and more — directly from your dashboard.' },
  { q: 'Is there a cost to join the Tradie App community?',
    a: 'Basic membership for tradies is free. Employers and Training Providers have tiered plans depending on the number of active roles and courses they manage.' },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div onClick={() => setOpen(o => !o)}
      style={{ borderBottom: '1px solid #e8ecf0', padding: '20px 0', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
        <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.4, flex: 1 }}>{q}</span>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: open ? '#156dbf' : 'rgba(83,121,244,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          {open
            ? <svg width="12" height="12" viewBox="0 0 12 12"><line x1="2" y1="6" x2="10" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            : <svg width="12" height="12" viewBox="0 0 12 12"><line x1="6" y1="2" x2="6" y2="10" stroke="#156dbf" strokeWidth="2" strokeLinecap="round"/><line x1="2" y1="6" x2="10" y2="6" stroke="#156dbf" strokeWidth="2" strokeLinecap="round"/></svg>
          }
        </div>
      </div>
      {open && (
        <p style={{ fontFamily: font, fontSize: 15, color: '#6a7380', lineHeight: 1.7, margin: '14px 0 4px', maxWidth: 580 }}>
          {a}
        </p>
      )}
    </div>
  )
}

export function LandingPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  return (
    <div style={{ fontFamily: font, background: '#fff', overflowX: 'hidden' }}>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        padding: '0 66px', height: 72,
        display: 'flex', alignItems: 'center',
        maxWidth: '100%',
      }}>
        {/* Left — nav links */}
        <div style={{ display: 'flex', gap: 48, alignItems: 'center', flex: 1 }}>
          {['Find Jobs', 'Hire Talent', 'Blogs', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontFamily: font, fontWeight: 500, fontSize: 18, color: '#343434', textDecoration: 'none', lineHeight: 1.3, whiteSpace: 'nowrap' }}>{l}</a>
          ))}
        </div>

        {/* Center — logo */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span style={{ fontFamily: fontMohave, fontWeight: 600, fontSize: 32, lineHeight: 1.3, whiteSpace: 'nowrap' }}>
            <span style={{ color: '#f26f37' }}>T</span>
            <span style={{ color: '#156dbf' }}>radie Migration</span>
          </span>
        </div>

        {/* Right — CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1, justifyContent: 'flex-end' }}>
          {/* Eng + chevron */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontFamily: font, fontWeight: 600, fontSize: 16, color: '#585484' }}>Eng</span>
            <img src={imgChevron} alt="" style={{ width: 18, height: 14, display: 'block' }}/>
          </div>
          {/* Divider */}
          <div style={{ position: 'relative', width: 0, height: 29 }}>
            <img src={imgDivider} alt="" style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 29 }}/>
          </div>
          {/* Login */}
          <span style={{ fontFamily: font, fontWeight: 600, fontSize: 16, color: '#585484', cursor: 'pointer' }}
            onClick={() => navigate('/login')}>Login</span>
          {/* Join Now */}
          <button onClick={() => navigate('/register')} style={{
            width: 176, height: 48, borderRadius: 32,
            border: '1px solid #585484', background: 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: 'pointer',
            boxShadow: '0px 4px 6px -2px rgba(16,24,40,0.03), 0px 12px 16px -4px rgba(16,24,40,0.08)',
          }}>
            <span style={{ fontFamily: font, fontWeight: 600, fontSize: 16, color: '#585484' }}>Join Now</span>
            <img src={imgArrow} alt="" style={{ width: 18, height: 14, display: 'block' }}/>
          </button>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{
        background: 'linear-gradient(135deg, #daeaf8 0%, #eaf3fb 30%, #f3f7fd 60%, #f8f9ff 100%)',
        position: 'relative', overflow: 'hidden',
        paddingTop: 80, paddingBottom: 0,
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(21,109,191,0.12) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', top: 120, right: 60, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(242,111,55,0.1) 0%, transparent 70%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'absolute', bottom: 140, left: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(21,109,191,0.09) 0%, transparent 70%)', pointerEvents: 'none' }}/>

        {/* Hero text content */}
        <div style={{ maxWidth: 1308, margin: '0 auto', padding: '0 66px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <h1 style={{
            fontFamily: font, fontWeight: 800, fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            color: '#1a1a2e', lineHeight: 1.15, margin: '0 0 24px',
            letterSpacing: -1,
          }}>
            Connecting Global Talent to<br/>
            <span style={{ color: '#156dbf' }}>Australia's Trade Industry.</span>
          </h1>
          <p style={{
            fontFamily: font, fontWeight: 400, fontSize: 18, color: '#585484',
            lineHeight: 1.6, maxWidth: 560, margin: '0 auto 40px',
          }}>
            The all-in-one platform for skilled tradies, employers, and training providers. Verified skills, simplified sponsorship.
          </p>

          {/* Search bar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#fff', borderRadius: 50, border: '1.5px solid #d0d5dd',
            padding: '10px 24px', maxWidth: 520, margin: '0 auto 28px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search for trades (e.g. Electrician, Plumber)..."
              style={{
                border: 'none', outline: 'none', fontFamily: font, fontSize: 15,
                color: '#343434', background: 'transparent', flex: 1,
              }}
            />
          </div>

          {/* Browse Jobs */}
          <button onClick={() => navigate('/login')} style={{
            background: '#156dbf', color: '#fff', border: 'none',
            borderRadius: 50, padding: '14px 48px', fontFamily: font,
            fontWeight: 700, fontSize: 16, cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(21,109,191,0.3)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#0f5ca0'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#156dbf'; e.currentTarget.style.transform = '' }}>
            Browse Jobs
          </button>
        </div>

        {/* Hero Illustration — Figma node 1:219 — 1251.6×572px */}
        <div style={{ maxWidth: 1252, margin: '60px auto 0', padding: '0 0', overflow: 'hidden' }}>
          <img src={imgHero} alt="Skilled trade workers"
            style={{ width: '100%', height: 'auto', aspectRatio: '1251.6/572', display: 'block', objectFit: 'contain' }}/>
        </div>
      </section>

      {/* ══ FEATURES SECTION ══ */}
      <section style={{ background: '#f6f8ff', padding: '80px 66px' }}>
        <div style={{
          maxWidth: 1308, margin: '0 auto',
          backgroundImage: radialGrad,
          backgroundSize: 'cover',
          borderRadius: 34,
          padding: '55px 60px 40px',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative white pills */}
          <div style={{ position: 'absolute', left: 380, bottom: 30, width: 76, height: 80, borderRadius: 34, background: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', right: 110, bottom: 20, width: 53, height: 56, borderRadius: 34, background: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', right: 90, top: 34, width: 76, height: 79, borderRadius: 34, background: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', left: 100, top: 100, width: 86, height: 92, borderRadius: 34, background: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', right: 270, top: 75, width: 232, height: 248, borderRadius: 308, background: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }}/>

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 60, marginBottom: 44, position: 'relative', zIndex: 2 }}>
            <h2 style={{
              fontFamily: font, fontWeight: 700, fontSize: 48, color: '#fff',
              lineHeight: 1.16, letterSpacing: -0.32, margin: 0, flex: '0 0 500px',
            }}>
              A Powerful Ecosystem for the Trade Industry
            </h2>
            <p style={{
              fontFamily: font, fontWeight: 500, fontSize: 20, color: '#fff',
              lineHeight: 1.5, margin: 0, flex: 1, paddingTop: 8,
            }}>
              Whether you're looking for a career move, a top-tier hire, or professional training, Tradie App connects you to the right opportunity.
            </p>
          </div>

          {/* 3 Cards — 380×536px each, gap 24px */}
          <div style={{ display: 'flex', gap: 24, position: 'relative', zIndex: 2, alignItems: 'flex-start' }}>

            {/* Card 1 — title top, illustration bottom */}
            <div style={{
              width: 380, height: 536, borderRadius: 21, overflow: 'hidden',
              position: 'relative', flexShrink: 0,
              boxShadow: '0px 4px 24px 0px rgba(0,0,0,0.13)',
            }}>
              <img src={imgCardBg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}/>
              {/* Gradient overlay bottom-half fade to white */}
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 317, background: 'linear-gradient(to bottom, rgba(255,255,255,0) 32%, #fff 60%)', borderRadius: '0 0 21px 21px', zIndex: 1 }}/>
              {/* Title */}
              <p style={{ position: 'absolute', top: 28, left: 28, width: 285, fontFamily: font, fontWeight: 700, fontSize: 36, color: '#156dbf', lineHeight: 1.16, letterSpacing: -0.32, margin: 0, zIndex: 3 }}>
                Launch Your Australian Career
              </p>
              {/* Description */}
              <p style={{ position: 'absolute', top: 172, left: 28, width: 311, fontFamily: font, fontWeight: 500, fontSize: 16, color: '#8e8d92', lineHeight: 1.5, margin: 0, zIndex: 3 }}>
                Get your skills verified, browse visa-sponsored roles, and access gap training to meet Australian licensing standards. Your global career starts here.
              </p>
              {/* Illustration at bottom, flipped */}
              <div style={{ position: 'absolute', left: 0, top: 277, width: 380, height: 259, zIndex: 2, transform: 'scaleY(-1) rotate(180deg)' }}>
                <img src={imgCard1Illus} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}/>
              </div>
            </div>

            {/* Card 2 — title top, illustration bottom */}
            <div style={{
              width: 380, height: 536, borderRadius: 21, overflow: 'hidden',
              position: 'relative', flexShrink: 0,
              boxShadow: '0px 4px 24px 0px rgba(0,0,0,0.13)',
            }}>
              <img src={imgCardBg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}/>
              {/* Gradient overlay top fade from transparent to white */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 259, background: 'linear-gradient(to bottom, rgba(255,255,255,0) 32%, #fff 60%)', borderRadius: '21px 21px 0 0', zIndex: 1 }}/>
              {/* Title */}
              <p style={{ position: 'absolute', top: 28, left: 28, width: 285, fontFamily: font, fontWeight: 700, fontSize: 36, color: '#156dbf', lineHeight: 1.16, letterSpacing: -0.32, margin: 0, zIndex: 3 }}>
                Build a Verified Workforce
              </p>
              {/* Description */}
              <p style={{ position: 'absolute', top: 172, left: 28, width: 311, fontFamily: font, fontWeight: 500, fontSize: 16, color: '#8e8d92', lineHeight: 1.5, margin: 0, zIndex: 3 }}>
                Connect with pre-screened local and international talent. Simplify your recruitment with verified background checks and sponsorship tools.
              </p>
              {/* Illustration overflows right side */}
              <div style={{ position: 'absolute', left: 0, top: 224, width: 437, height: 320, zIndex: 2 }}>
                <img src={imgCard2Illus} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}/>
              </div>
            </div>

            {/* Card 3 — illustration top, title + desc bottom */}
            <div style={{
              width: 380, height: 536, borderRadius: 21, overflow: 'hidden',
              position: 'relative', flexShrink: 0,
              boxShadow: '0px 4px 24px 0px rgba(0,0,0,0.13)',
            }}>
              <img src={imgCardBg} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}/>
              {/* Gradient overlay — from transparent to white, starting at 107px */}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 107, height: 429, background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1) 78%)', borderRadius: '0 0 21px 21px', zIndex: 1 }}/>
              {/* Illustration at top — phone mockup */}
              <div style={{ position: 'absolute', left: -47, top: -95, width: 500, height: 480, zIndex: 2, transform: 'rotate(-14.73deg)' }}>
                <img src={imgCard3Illus} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}/>
              </div>
              {/* Title */}
              <p style={{ position: 'absolute', top: 316, left: 34, width: 285, fontFamily: font, fontWeight: 700, fontSize: 36, color: '#156dbf', lineHeight: 1.16, letterSpacing: -0.32, margin: 0, zIndex: 3 }}>
                Enroll the Next Generation
              </p>
              {/* Description */}
              <p style={{ position: 'absolute', top: 460, left: 34, width: 295, fontFamily: font, fontWeight: 500, fontSize: 14, color: '#8e8d92', lineHeight: 1.5, margin: 0, zIndex: 3 }}>
                List your RTO courses and certification programs directly to students and workers looking to upskill or convert their international licenses.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ══ STEPS SECTION ══ */}
      <section style={{ background: '#fff', padding: '100px 66px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1308, margin: '0 auto' }}>
          {/* Heading */}
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontFamily: font, fontWeight: 800, fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#1a1a2e', lineHeight: 1.2, margin: '0 0 16px' }}>
              Your Path to Success in<br/><span style={{ color: '#156dbf' }}>3 Easy Steps</span>
            </h2>
            <p style={{ fontFamily: font, fontWeight: 500, fontSize: 18, color: '#585484', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
              Whether you're hiring or looking for work, we've simplified the process to get you moving faster.
            </p>
          </div>

          {/* Steps layout: dashed line column + alternating steps */}
          <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>

            {/* Dashed timeline column — 248px wide, SVG path */}
            <div style={{ flexShrink: 0, width: 248, position: 'relative', paddingTop: 20 }}>
              {/* Step numbers with dots */}
              {[
                { n: '1', top: 0 },
                { n: '2', top: 460 },
                { n: '3', top: 940 },
              ].map(({ n, top }) => (
                <div key={n} style={{ position: 'absolute', top, left: n === '2' ? 90 : 0, display: 'flex', alignItems: 'center', gap: 0 }}>
                  <span style={{ fontFamily: font, fontWeight: 800, fontSize: 120, color: '#156dbf', lineHeight: 1, letterSpacing: -2, display: 'block' }}>{n}</span>
                  <div style={{ width: 31, height: 31, borderRadius: '50%', background: '#f26f37', flexShrink: 0, marginLeft: 4 }}/>
                </div>
              ))}
              {/* Curved dashed line SVG */}
              <svg width="248" height="1378" viewBox="0 0 248 1378" fill="none" xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block', marginTop: 60 }}>
                <path d="M 60 60 C 180 200, 180 350, 200 480 C 220 610, 60 700, 60 830 C 60 960, 200 1050, 200 1200 C 200 1280, 120 1330, 120 1378"
                  stroke="#c8ccd4" strokeWidth="3" strokeDasharray="12 10" strokeLinecap="round" fill="none"/>
              </svg>
            </div>

            {/* Steps content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 80 }}>

              {/* Step 1 — text left, illus right */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <h3 style={{ fontFamily: font, fontWeight: 800, fontSize: 32, color: '#1a1a2e', lineHeight: 1.25, margin: '0 0 16px' }}>
                    Build a Profile That Stands Out
                  </h3>
                  <p style={{ fontFamily: font, fontWeight: 400, fontSize: 17, color: '#6a7380', lineHeight: 1.7, margin: 0, maxWidth: 420 }}>
                    Register and upload your documents. We verify your licences and attempt to match you to your next role with confidence. Your profile becomes your digital trade passport.
                  </p>
                </div>
                {/* Figma node 1:627 — 477×363px */}
                <img src={imgStep1} alt="Build a profile illustration"
                  style={{ width: 477, height: 363, maxWidth: '100%', display: 'block', objectFit: 'contain', flexShrink: 0 }}/>
              </div>

              {/* Step 2 — illus left, text right */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 60, flexDirection: 'row-reverse', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <h3 style={{ fontFamily: font, fontWeight: 800, fontSize: 32, color: '#1a1a2e', lineHeight: 1.25, margin: '0 0 16px' }}>
                    Find Your Perfect Industry Match
                  </h3>
                  <p style={{ fontFamily: font, fontWeight: 400, fontSize: 17, color: '#6a7380', lineHeight: 1.7, margin: 0, maxWidth: 420 }}>
                    Our smart dashboard connects skilled tradies with registered sponsors and links students to the right RTO training programs. Let the platform do the heavy lifting.
                  </p>
                </div>
                {/* Figma node 1:672 — 443×494px */}
                <img src={imgStep2} alt="Find your match illustration"
                  style={{ width: 443, height: 494, maxWidth: '100%', display: 'block', objectFit: 'contain', flexShrink: 0 }}/>
              </div>

              {/* Step 3 — text left, illus right */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 60, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 280 }}>
                  <h3 style={{ fontFamily: font, fontWeight: 800, fontSize: 32, color: '#1a1a2e', lineHeight: 1.25, margin: '0 0 16px' }}>
                    Sign, Enrol, and Start
                  </h3>
                  <p style={{ fontFamily: font, fontWeight: 400, fontSize: 17, color: '#6a7380', lineHeight: 1.7, margin: 0, maxWidth: 420 }}>
                    Once you've found your perfect opportunity or training program, finalise everything within the Tradie App. From offer to onboarding in days, not months.
                  </p>
                </div>
                {/* Figma node 1:814 — 506×577px */}
                <img src={imgStep3} alt="Sign enrol and start illustration"
                  style={{ width: 506, height: 577, maxWidth: '100%', display: 'block', objectFit: 'contain', flexShrink: 0 }}/>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ══ FAQ SECTION ══ */}
      <section style={{ background: '#f6f8ff', padding: '100px 66px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1308, margin: '0 auto', display: 'flex', gap: 80, alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Left — heading + accordion */}
          <div style={{ flex: 1, minWidth: 340 }}>
            <h2 style={{ fontFamily: font, fontWeight: 800, fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: '#1a1a2e', lineHeight: 1.2, margin: '0 0 16px' }}>
              Got Questions?<br/><span style={{ color: '#156dbf' }}>We've Got Answers.</span>
            </h2>
            <p style={{ fontFamily: font, fontSize: 16, color: '#6a7380', margin: '0 0 40px', lineHeight: 1.7, maxWidth: 460 }}>
              Find quick answers to common inquiries and learn how we help tradies, employers, and trainers connect safely and efficiently across Australia.
            </p>
            <div>
              {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a}/>)}
            </div>
          </div>

          {/* Right — Figma node 1:859 — 712×700px */}
          <div style={{ flexShrink: 0, paddingTop: 20 }}>
            <img src={imgFaqIllus} alt="FAQ illustration"
              style={{ width: 460, height: 452, maxWidth: '100%', display: 'block', objectFit: 'contain' }}/>
          </div>
        </div>
      </section>

      {/* ══ CTA SECTION ══ */}
      <section style={{ padding: '60px 66px', background: '#fff' }}>
        <div style={{
          maxWidth: 1308, margin: '0 auto',
          backgroundImage: radialGrad,
          backgroundSize: 'cover',
          borderRadius: 40, padding: '60px 80px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 40, flexWrap: 'wrap',
          position: 'relative', overflow: 'hidden', minHeight: 300,
        }}>
          {/* Decorative white pills */}
          <div style={{ position: 'absolute', left: 310, bottom: 28, width: 66, height: 78, borderRadius: 100, background: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', right: 100, bottom: 55, width: 46, height: 68, borderRadius: 100, background: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', right: 75, top: 34, width: 66, height: 78, borderRadius: 100, background: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', left: 150, top: 80, width: 76, height: 90, borderRadius: 100, background: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }}/>
          <div style={{ position: 'absolute', left: 140, bottom: 20, width: 203, height: 243, borderRadius: 120, background: 'rgba(255,255,255,0.10)', pointerEvents: 'none' }}/>

          {/* Text + buttons */}
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 500 }}>
            <h2 style={{ fontFamily: font, fontWeight: 800, fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#fff', lineHeight: 1.2, margin: '0 0 16px' }}>
              Build Your Future<br/>with Tradie App.
            </h2>
            <p style={{ fontFamily: font, fontWeight: 400, fontSize: 18, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6, margin: '0 0 36px', maxWidth: 420 }}>
              Join Australia's leading network of verified trades, top employers, and RTO trainers.
            </p>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')} style={{
                background: '#fff', color: '#156dbf', border: 'none', borderRadius: 32,
                padding: '14px 36px', fontFamily: font, fontWeight: 700, fontSize: 16,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0f7ff'}
                onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                Join for Free
              </button>
              <button onClick={() => navigate('/login')} style={{
                background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.7)',
                borderRadius: 32, padding: '14px 36px', fontFamily: font, fontWeight: 600, fontSize: 16,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                Login
              </button>
            </div>
          </div>

          {/* CTA illustration — reuse hero illustration (same trade workers) */}
          <div style={{ position: 'relative', zIndex: 2, flexShrink: 0 }}>
            <img src={imgHero} alt="Trade workers"
              style={{ width: 520, height: 240, maxWidth: '100%', display: 'block', objectFit: 'contain', objectPosition: 'center' }}/>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#fff', padding: '40px 66px 0', borderTop: '1px solid #f0f0f4' }}>
        <div style={{ maxWidth: 1308, margin: '0 auto' }}>

          {/* Top row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 32, flexWrap: 'wrap', gap: 24 }}>
            {/* Logo */}
            <span style={{ fontFamily: fontMohave, fontWeight: 600, fontSize: 28, cursor: 'pointer' }} onClick={() => navigate('/')}>
              <span style={{ color: '#f26f37' }}>T</span>
              <span style={{ color: '#156dbf' }}>radie Migration</span>
            </span>

            {/* Nav */}
            <nav style={{ display: 'flex', gap: 48 }}>
              {['Find Jobs', 'Hire Talent', 'About', 'Contact'].map(l => (
                <a key={l} href="#" style={{ fontFamily: font, fontWeight: 400, fontSize: 16, color: '#343434', textDecoration: 'none' }}>{l}</a>
              ))}
            </nav>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
              {/* Twitter */}
              <a href="#" style={{ color: '#343434', display: 'block' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
              </a>
              {/* Facebook */}
              <a href="#" style={{ color: '#343434', display: 'block' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.74h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z"/></svg>
              </a>
              {/* Instagram */}
              <a href="#" style={{ color: '#343434', display: 'block' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              {/* GitHub */}
              <a href="#" style={{ color: '#343434', display: 'block' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: '#e8ecf0', margin: '0 0 24px' }}/>

          {/* Bottom row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 32, flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontFamily: font, fontSize: 14, color: '#6a7380', margin: 0 }}>
              © Copyright Tradie Migration 2026, All Rights Reserved
            </p>
            <div style={{ display: 'flex', gap: 32 }}>
              <a href="#" style={{ fontFamily: font, fontSize: 14, color: '#6a7380', textDecoration: 'underline' }}>Privacy Policy</a>
              <a href="#" style={{ fontFamily: font, fontSize: 14, color: '#6a7380', textDecoration: 'underline' }}>Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
