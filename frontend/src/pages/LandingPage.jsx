/**
 * LandingPage — Pixel-perfect rebuild from Figma KUp74wgn6I4qmd7485ciL0 node 1:41
 * All illustrations, icons and decorative assets pulled directly from Figma API.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const font     = "'Urbanist', sans-serif"
const fontMohave = "'Mohave', 'Urbanist', sans-serif"

/* ─── FIGMA ASSETS — exact URLs from API ─── */

// Navbar icons
const imgChevronDown  = 'https://www.figma.com/api/mcp/asset/8d9ef145-c582-476d-932c-e5f18cb076c6'
const imgDivider      = 'https://www.figma.com/api/mcp/asset/8bb8810f-59b0-46b6-a54b-c3d77c17a16f'
const imgArrowRight   = 'https://www.figma.com/api/mcp/asset/162f2a65-e3dc-402b-a219-4a2cce3f8389'

// Hero
const imgHeroIllus    = 'https://www.figma.com/api/mcp/asset/84af5c8e-ff93-47e8-8571-a1b727577da2'

// Background blobs
const imgBlobBlueYellow = 'https://www.figma.com/api/mcp/asset/b75a4fda-99eb-4ffe-8449-2a8bb45dda3d'
const imgBlobBlue       = 'https://www.figma.com/api/mcp/asset/becffa3b-14ae-4e4b-822c-03801204813d'
const imgBlobRings      = 'https://www.figma.com/api/mcp/asset/3cc63838-48e4-4f0b-9e74-246e26db1095'
const imgBlobGroup2     = 'https://www.figma.com/api/mcp/asset/c43f60fb-63f2-46c2-b8c6-b9f2ca6c241e'

// Feature card backgrounds + illustrations
const imgCardBg              = 'https://www.figma.com/api/mcp/asset/41f884d5-8937-48c7-8a7b-7a9586daad0f'
const imgCardBg2             = 'https://www.figma.com/api/mcp/asset/cbd58162-b8d1-493b-aae9-9f934237a97a'
const imgIllusCareer         = 'https://www.figma.com/api/mcp/asset/61f04622-e5e2-49b1-b327-7fcbe481fe5a'
const imgIllusWorkforce      = 'https://www.figma.com/api/mcp/asset/bde3846e-419a-4fb7-8bff-b87379c67ec5'
const imgIllusEnroll         = 'https://www.figma.com/api/mcp/asset/4357b8db-42c5-4c6e-8c62-dac9f898bbcc'

// Steps dashed line + dots
const imgStepsLine  = 'https://www.figma.com/api/mcp/asset/c001e7b3-bac6-4ad7-ab5a-d7deabbb8a8f'
const imgStepDot    = 'https://www.figma.com/api/mcp/asset/2eb818d9-6e9a-41c6-9f3b-1eea253be923'

// Step illustrations
const imgStep1Illus = 'https://www.figma.com/api/mcp/asset/bcbf6952-1781-480a-aa7b-0cc74bdb3ce9'
const imgStep2Illus = 'https://www.figma.com/api/mcp/asset/35da442e-6797-4450-93d2-8e87bc51df43'
const imgStep3Illus = 'https://www.figma.com/api/mcp/asset/0502fb3f-a68f-4f09-a8cf-a6c17b6155ea'

// CTA section illustration
const imgCtaIllus   = 'https://www.figma.com/api/mcp/asset/9fa64f5a-3bf3-4c9d-a182-0970371e98a8'

// Footer social icon SVG paths (exact from Figma)
const imgIconTwitter   = 'https://www.figma.com/api/mcp/asset/6f8d0eac-d5dd-4881-a8ee-3e01c5c91b02'
const imgIconFacebook  = 'https://www.figma.com/api/mcp/asset/0bad45b4-5666-4508-9844-b6687c5bfcc8'
const imgIconInstaOuter= 'https://www.figma.com/api/mcp/asset/af58fa35-f2e1-43d5-b1ae-b67ad481edfd'
const imgIconInstaInner= 'https://www.figma.com/api/mcp/asset/b51a6fd4-db19-4609-8ad9-2600295588de'
const imgIconInstaDot  = 'https://www.figma.com/api/mcp/asset/cbb2abd0-e43e-4c5a-b489-37db7458e190'
const imgIconGithub    = 'https://www.figma.com/api/mcp/asset/965eb942-8bf8-4501-9f07-414ec0646d95'
const imgFooterLine    = 'https://www.figma.com/api/mcp/asset/b6f1511e-d5fa-411a-aa64-ff332152c101'

/* ─── FAQ data (exact from Figma) ─── */
const FAQS = [
  { q: 'How does the trade verification work?',               a: 'Our verification process checks your licences, qualifications, and work history against Australian Standards. You upload your documents and our team reviews them within 48 hours, issuing a Verified badge on your profile.' },
  { q: 'Can employers offer visa sponsorship?',               a: 'Yes. Registered employers with Standard Business Sponsorship (SBS) approval can directly offer 482 Temporary Skill Shortage visa sponsorship to eligible tradies through the platform.' },
  { q: 'What is the benefit of registering as a Trainer?',    a: 'Registered Training Organisations (RTOs) can list their entire course catalog, manage student enrollments, and track progress. It allows you to connect directly with tradies who need gap training or specific certifications to meet Australian Standards.' },
  { q: 'Can I use the app to manage my trade documents?',     a: 'Absolutely. You can securely upload, store, and share all your trade documents — licences, certificates, safety tickets, and more — directly from your dashboard.' },
  { q: 'Is there a cost to join the Tradie App community?',   a: 'Basic membership for tradies is free. Employers and Training Providers have tiered plans depending on the number of active roles and courses they manage.' },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div onClick={() => setOpen(o => !o)} style={{ borderBottom: '1px solid #e8ecf0', padding: '20px 0', cursor: 'pointer' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
        <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.4, flex: 1 }}>{q}</span>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          border: `2px solid ${open ? '#156dbf' : '#d0d5dd'}`,
          background: open ? '#156dbf' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            {open
              ? <line x1="2" y1="6" x2="10" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              : <>
                  <line x1="6" y1="2" x2="6" y2="10" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="2" y1="6" x2="10" y2="6" stroke="#555" strokeWidth="2" strokeLinecap="round"/>
                </>
            }
          </svg>
        </div>
      </div>
      {open && (
        <p style={{ fontFamily: font, fontSize: 15, color: '#6a7380', lineHeight: 1.7, margin: '14px 0 4px', paddingRight: 52 }}>
          {a}
        </p>
      )}
    </div>
  )
}

/* ─── LOGO (reused in Navbar + Footer) ─── */
function TradieLogoText({ size = 28 }) {
  return (
    <span style={{ fontFamily: fontMohave, fontWeight: 600, fontSize: size, letterSpacing: 0.3, lineHeight: 1 }}>
      <span style={{ color: '#f26f37' }}>T</span>
      <span style={{ color: '#156dbf' }}>radie Migration</span>
    </span>
  )
}

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ fontFamily: font, background: '#fff', overflowX: 'hidden' }}>

      {/* ══════════════════════════════════════════
          NAVBAR
          Layout: [Find Jobs  Hire Talent  Blogs  Contact]  [Tradie Migration]  [Eng | Login  Join Now→]
      ══════════════════════════════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #f0f0f4',
        height: 72, display: 'flex', alignItems: 'center',
        padding: '0 60px',
      }}>
        <div style={{ maxWidth: 1380, width: '100%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* LEFT — nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
            {['Find Jobs', 'Hire Talent', 'Blogs', 'Contact'].map(l => (
              <a key={l} href="#" style={{ fontFamily: font, fontSize: 18, fontWeight: 500, color: '#343434', textDecoration: 'none', transition: 'color 0.15s', whiteSpace: 'nowrap' }}
                onMouseEnter={e => e.currentTarget.style.color = '#156dbf'}
                onMouseLeave={e => e.currentTarget.style.color = '#343434'}>{l}</a>
            ))}
          </div>

          {/* CENTER — logo */}
          <Link to="/" style={{ textDecoration: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <TradieLogoText size={28} />
          </Link>

          {/* RIGHT — Eng | Login  Join Now */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {/* Eng dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: '#585484' }}>Eng</span>
              <img src={imgChevronDown} alt="" style={{ width: 18, height: 14, display: 'block' }}/>
            </div>
            {/* Divider */}
            <div style={{ width: 1, height: 29, background: '#d0d5dd' }}/>
            {/* Login */}
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: '#585484', cursor: 'pointer', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#156dbf'}
                onMouseLeave={e => e.currentTarget.style.color = '#585484'}>Login</span>
            </Link>
            {/* Join Now */}
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button style={{
                height: 48, width: 176, borderRadius: 32, border: '1.5px solid #585484',
                background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                cursor: 'pointer', transition: 'all 0.15s',
                boxShadow: '0 4px 6px -2px rgba(16,24,40,0.03), 0 12px 16px -4px rgba(16,24,40,0.08)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#156dbf'; e.currentTarget.style.borderColor = '#156dbf'; e.currentTarget.querySelector('span').style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#585484'; e.currentTarget.querySelector('span').style.color='#585484' }}>
                <span style={{ fontFamily: font, fontSize: 16, fontWeight: 600, color: '#585484', transition: 'color 0.15s' }}>Join Now</span>
                <img src={imgArrowRight} alt="" style={{ width: 18, height: 14, display: 'block' }}/>
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden', background: '#f6f8ff', paddingTop: 80, paddingBottom: 0, minHeight: 660 }}>
        {/* Background blobs */}
        <img src={imgBlobBlue}       alt="" style={{ position:'absolute', top:-40, left:-60, width:300, height:280, opacity:0.8, pointerEvents:'none', zIndex:0 }}/>
        <img src={imgBlobBlueYellow} alt="" style={{ position:'absolute', top:0, right:-40, width:280, height:260, opacity:0.7, pointerEvents:'none', zIndex:0 }}/>
        <img src={imgBlobGroup2}     alt="" style={{ position:'absolute', bottom:100, right:60, width:200, height:200, opacity:0.5, pointerEvents:'none', zIndex:0 }}/>

        <div style={{ position:'relative', zIndex:2, maxWidth:1280, margin:'0 auto', padding:'0 60px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center' }}>

          {/* Headline */}
          <h1 style={{ fontFamily: font, fontSize: 'clamp(2rem,3.8vw,3rem)', fontWeight: 800, lineHeight: 1.18, margin: '0 0 20px', color: '#1a1a2e', maxWidth: 700 }}>
            Connecting Global Talent to<br/>
            <span style={{ color: '#156dbf' }}>Australia's Trade Industry.</span>
          </h1>

          {/* Sub */}
          <p style={{ fontFamily: font, fontSize: 18, color: '#585484', maxWidth: 560, lineHeight: 1.6, margin: '0 0 32px', fontWeight: 400 }}>
            The all-in-one platform for skilled tradies, employers, and training providers. Verified skills, simplified sponsorship.
          </p>

          {/* Search bar */}
          <div style={{
            display:'flex', alignItems:'center', gap:10,
            background:'#fff', borderRadius:32, border:'1.5px solid #d0d5dd',
            padding:'10px 10px 10px 20px', width:'100%', maxWidth:460,
            marginBottom: 28,
            boxShadow:'0 4px 20px rgba(0,0,0,0.06)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{ flexShrink:0 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search for trades (e.g. Electrician, Plumber)..."
              style={{ flex:1, border:'none', outline:'none', fontFamily:font, fontSize:14, color:'#343434', background:'transparent' }}
            />
          </div>

          {/* Browse Jobs CTA */}
          <button onClick={() => navigate('/register')} style={{
            height:52, padding:'0 48px', background:'#156dbf', color:'#fff',
            border:'none', borderRadius:32, cursor:'pointer',
            fontFamily:font, fontSize:16, fontWeight:700,
            boxShadow:'0 8px 24px rgba(21,109,191,0.3)',
            transition:'all 0.2s', marginBottom: 48,
          }}
            onMouseEnter={e=>{ e.currentTarget.style.background='#1255a8'; e.currentTarget.style.transform='translateY(-2px)' }}
            onMouseLeave={e=>{ e.currentTarget.style.background='#156dbf'; e.currentTarget.style.transform='' }}>
            Browse Jobs
          </button>

          {/* Hero illustration — actual Figma asset */}
          <div style={{ width:'100%', maxWidth:1100, margin:'0 auto' }}>
            <img src={imgHeroIllus} alt="Tradie workers illustration"
              style={{ width:'100%', display:'block', objectFit:'contain' }}/>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURE ECOSYSTEM  (blue radial gradient bg)
      ══════════════════════════════════════════ */}
      <section style={{
        background: 'radial-gradient(ellipse at 80% 50%, #156dbf 0%, #4d8fce 20%, #bed4eb 40%, #f6f6f9 55%, #bed4eb 65%, #86b2dc 80%, #156dbf 100%)',
        padding: '72px 60px 80px',
        position: 'relative', overflow:'hidden',
      }}>
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>

          {/* Heading row */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:40, marginBottom:48, flexWrap:'wrap' }}>
            <h2 style={{ fontFamily:font, fontSize:'clamp(1.8rem,3vw,3rem)', fontWeight:800, color:'#fff', lineHeight:1.15, margin:0, maxWidth:480 }}>
              A Powerful Ecosystem<br/>for the Trade Industry
            </h2>
            <p style={{ fontFamily:font, fontSize:20, color:'#fff', lineHeight:1.5, margin:0, maxWidth:545, fontWeight:400, paddingTop:8 }}>
              Whether you're looking for a career move, a top-tier hire, or professional training, Tradie App connects you to the right opportunity.
            </p>
          </div>

          {/* 3 feature cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24 }}>
            {[
              {
                bg: imgCardBg,
                illus: imgIllusCareer,
                title: 'Launch Your Australian Career',
                desc: 'Get your skills verified, browse visa-sponsored roles, and access gap training to meet Australian licensing standards. Your global career starts here.',
                illusTop: true,
              },
              {
                bg: imgCardBg2,
                illus: imgIllusWorkforce,
                title: 'Build a Verified Workforce',
                desc: 'Connect with pre-screened local and international talent. Simplify your recruitment with verified background checks and sponsorship tools.',
                illusBottom: true,
              },
              {
                bg: imgCardBg,
                illus: imgIllusEnroll,
                title: 'Enroll the Next Generation',
                desc: 'List your RTO courses and certification programs directly to students and workers looking to upskill or convert their international licenses.',
                illusTop: true,
              },
            ].map((card, i) => (
              <div key={i} style={{
                background:'#fff', borderRadius:21,
                boxShadow:'0 4px 24px rgba(0,0,0,0.13)',
                overflow:'hidden', display:'flex', flexDirection:'column',
                minHeight:536,
                transition:'transform 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-6px)'}
                onMouseLeave={e => e.currentTarget.style.transform=''}>
                {/* Illustration area */}
                <div style={{ flex:1, position:'relative', overflow:'hidden', minHeight:300 }}>
                  <img src={card.bg} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', borderRadius:21, pointerEvents:'none' }}/>
                  {/* Gradient overlay */}
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'45%', background:'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))', borderRadius:'0 0 21px 21px' }}/>
                  <img src={card.illus} alt="" style={{ position:'relative', zIndex:1, width:'100%', height:'100%', objectFit:'contain', display:'block', padding:16 }}/>
                </div>
                {/* Text area */}
                <div style={{ padding:'0 28px 32px' }}>
                  <h3 style={{ fontFamily:font, fontSize:36, fontWeight:700, color:'#156dbf', lineHeight:1.16, letterSpacing:-0.32, margin:'0 0 12px' }}>
                    {card.title}
                  </h3>
                  <p style={{ fontFamily:font, fontSize:16, color:'#8e8d92', lineHeight:1.5, margin:0, fontWeight:400 }}>
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3 EASY STEPS
      ══════════════════════════════════════════ */}
      <section style={{ background:'#fff', padding:'100px 60px', position:'relative', overflow:'hidden' }}>
        {/* Background blobs */}
        <img src={imgBlobBlueYellow} alt="" style={{ position:'absolute', left:-100, top:'5%', width:280, height:280, opacity:0.45, pointerEvents:'none' }}/>
        <img src={imgBlobBlue}       alt="" style={{ position:'absolute', right:-80, bottom:'5%', width:260, height:260, opacity:0.35, pointerEvents:'none' }}/>

        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>
          {/* Header */}
          <div style={{ textAlign:'center', marginBottom:80 }}>
            <h2 style={{ fontFamily:font, fontSize:'clamp(1.8rem,3vw,2.8rem)', fontWeight:800, color:'#1a1a2e', lineHeight:1.2, margin:'0 0 16px' }}>
              Your Path to Success in<br/>
              <span style={{ color:'#156dbf' }}>3 Easy Steps</span>
            </h2>
            <p style={{ fontFamily:font, fontSize:18, color:'#585484', maxWidth:560, margin:'0 auto', lineHeight:1.6 }}>
              Whether you're hiring or looking for work, we've simplified the process to get you moving faster.
            </p>
          </div>

          {/* Steps — dashed vertical line + numbers + alternating illustrations */}
          <div style={{ display:'flex', gap:60, alignItems:'flex-start' }}>

            {/* Left dashed line + numbers column */}
            <div style={{ position:'relative', flexShrink:0, width:90 }}>
              <img src={imgStepsLine} alt="" style={{ width:90, display:'block' }}/>
            </div>

            {/* Steps content */}
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:100 }}>

              {[
                { num:'1', title:'Build a Profile That Stands Out',      illus:imgStep1Illus, reverse:false,
                  desc:'Register and upload your documents. We verify your licences and attempt to match you to your next role with confidence. Your profile becomes your digital trade passport.' },
                { num:'2', title:'Find Your Perfect Industry Match',      illus:imgStep2Illus, reverse:true,
                  desc:"Our smart dashboard connects skilled tradies with registered sponsors and links students to the right RTO training programs. Let the platform do the heavy lifting." },
                { num:'3', title:'Sign, Enrol, and Start',               illus:imgStep3Illus, reverse:false,
                  desc:"Once you've found your perfect opportunity or training program, finalise everything within the Tradie App. From offer to onboarding in days, not months." },
              ].map((step, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:60, flexDirection: step.reverse ? 'row-reverse' : 'row', flexWrap:'wrap' }}>
                  {/* Illustration */}
                  <div style={{ flex:'0 0 auto' }}>
                    <img src={step.illus} alt={step.title} style={{ width:380, maxWidth:'100%', display:'block', objectFit:'contain' }}/>
                  </div>
                  {/* Text */}
                  <div style={{ flex:1, minWidth:260 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
                      <span style={{ fontFamily:font, fontSize:120, fontWeight:800, color:'#156dbf', lineHeight:1, letterSpacing:-0.5 }}>{step.num}</span>
                      <img src={imgStepDot} alt="" style={{ width:31, height:31, display:'block', flexShrink:0 }}/>
                    </div>
                    <h3 style={{ fontFamily:font, fontSize:'clamp(1.4rem,2vw,1.9rem)', fontWeight:800, color:'#1a1a2e', lineHeight:1.25, margin:'0 0 16px' }}>
                      {step.title}
                    </h3>
                    <p style={{ fontFamily:font, fontSize:17, color:'#6a7380', lineHeight:1.7, margin:0, maxWidth:440 }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FAQ SECTION
      ══════════════════════════════════════════ */}
      <section style={{ background:'#f6f8ff', padding:'100px 60px', position:'relative', overflow:'hidden' }}>
        <img src={imgBlobRings} alt="" style={{ position:'absolute', right:-140, top:'50%', transform:'translateY(-50%)', width:420, height:420, opacity:0.06, pointerEvents:'none' }}/>

        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', gap:80, alignItems:'flex-start', flexWrap:'wrap', position:'relative', zIndex:2 }}>

          {/* Left — heading + accordion */}
          <div style={{ flex:1, minWidth:320 }}>
            <h2 style={{ fontFamily:font, fontSize:'clamp(1.8rem,3vw,2.8rem)', fontWeight:800, color:'#1a1a2e', lineHeight:1.2, margin:'0 0 16px' }}>
              Got Questions?<br/><span style={{ color:'#156dbf' }}>We've Got Answers.</span>
            </h2>
            <p style={{ fontFamily:font, fontSize:16, color:'#6a7380', margin:'0 0 40px', lineHeight:1.7, maxWidth:460 }}>
              Find quick answers to common inquiries and learn how we help tradies, employers, and trainers connect safely and efficiently across Australia.
            </p>
            <div>
              {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a}/>)}
            </div>
          </div>

          {/* Right — illustration */}
          <div style={{ flex:'0 0 auto', paddingTop:40 }}>
            <img src={imgStep2Illus} alt="FAQ illustration" style={{ width:380, maxWidth:'100%', display:'block', objectFit:'contain' }}/>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section style={{
        padding: '80px 60px',
        background: 'radial-gradient(ellipse at 80% 50%, #156dbf 0%, #4d8fce 20%, #bed4eb 40%, #f6f6f9 55%, #bed4eb 65%, #86b2dc 80%, #156dbf 100%)',
        position: 'relative', overflow:'hidden',
      }}>
        {/* White opacity decorative pills (from Figma) */}
        <div style={{ position:'absolute', width:232, height:248, borderRadius:308, background:'rgba(255,255,255,0.1)', top:75, right:160, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', width:76,  height:79,  borderRadius:34,  background:'rgba(255,255,255,0.1)', top:34, right:70, pointerEvents:'none' }}/>
        <div style={{ position:'absolute', width:86,  height:92,  borderRadius:34,  background:'rgba(255,255,255,0.1)', left:50, bottom:80, pointerEvents:'none' }}/>

        <div style={{ maxWidth:1280, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', gap:40, flexWrap:'wrap', position:'relative', zIndex:2 }}>
          {/* Text + buttons */}
          <div style={{ maxWidth:560 }}>
            <h2 style={{ fontFamily:font, fontSize:'clamp(1.8rem,3vw,2.8rem)', fontWeight:800, color:'#fff', lineHeight:1.2, margin:'0 0 20px' }}>
              Build Your Future<br/>with Tradie App.
            </h2>
            <p style={{ fontFamily:font, fontSize:18, color:'rgba(255,255,255,0.85)', lineHeight:1.65, margin:'0 0 36px', maxWidth:460 }}>
              Join Australia's leading network of verified trades, top employers, and RTO trainers.
            </p>
            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
              <button onClick={() => navigate('/register')} style={{
                height:52, padding:'0 40px', background:'#fff', color:'#156dbf',
                border:'none', borderRadius:32, cursor:'pointer',
                fontFamily:font, fontSize:16, fontWeight:700,
                boxShadow:'0 8px 24px rgba(0,0,0,0.15)', transition:'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)' }}>
                Get Started
              </button>
              <Link to="/login" style={{ textDecoration:'none' }}>
                <button style={{
                  height:52, padding:'0 36px', background:'transparent',
                  color:'#fff', border:'2px solid rgba(255,255,255,0.6)',
                  borderRadius:32, cursor:'pointer', fontFamily:font,
                  fontSize:16, fontWeight:600, transition:'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='rgba(255,255,255,1)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='rgba(255,255,255,0.6)'}>
                  Login
                </button>
              </Link>
            </div>
          </div>

          {/* CTA illustration — actual Figma asset */}
          <div>
            <img src={imgCtaIllus} alt="CTA illustration" style={{ width:480, maxWidth:'100%', display:'block', objectFit:'contain' }}/>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER  — exact from Figma node 1:103
      ══════════════════════════════════════════ */}
      <footer style={{ background:'#fff', borderTop:'1px solid #f0f0f4', padding:'40px 60px 0' }}>
        <div style={{ maxWidth:1380, margin:'0 auto' }}>

          {/* Main footer row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingBottom:40, flexWrap:'wrap', gap:24 }}>

            {/* Logo */}
            <Link to="/" style={{ textDecoration:'none' }}>
              <TradieLogoText size={28}/>
            </Link>

            {/* Nav links */}
            <div style={{ display:'flex', alignItems:'center', gap:48 }}>
              {['Find Jobs','Hire Talent','About','Contact'].map(l => (
                <a key={l} href="#" style={{ fontFamily:font, fontSize:16, fontWeight:400, color:'#343434', textDecoration:'none', transition:'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color='#156dbf'}
                  onMouseLeave={e => e.currentTarget.style.color='#343434'}>{l}</a>
              ))}
            </div>

            {/* Social icons — actual Figma SVG assets */}
            <div style={{ display:'flex', alignItems:'center', gap:40 }}>
              {/* Twitter */}
              <a href="#" style={{ display:'flex', alignItems:'center', justifyContent:'center', opacity:0.7, transition:'opacity 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.opacity='1'} onMouseLeave={e=>e.currentTarget.style.opacity='0.7'}>
                <img src={imgIconTwitter} alt="Twitter" style={{ width:18, height:15, display:'block' }}/>
              </a>
              {/* Facebook */}
              <a href="#" style={{ display:'flex', alignItems:'center', justifyContent:'center', opacity:0.7, transition:'opacity 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.opacity='1'} onMouseLeave={e=>e.currentTarget.style.opacity='0.7'}>
                <img src={imgIconFacebook} alt="Facebook" style={{ width:10, height:18, display:'block' }}/>
              </a>
              {/* Instagram (3-layer: outer, inner, dot) */}
              <a href="#" style={{ position:'relative', display:'flex', width:20, height:20, opacity:0.7, transition:'opacity 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.opacity='1'} onMouseLeave={e=>e.currentTarget.style.opacity='0.7'}>
                <img src={imgIconInstaOuter} alt="Instagram" style={{ position:'absolute', inset:0, width:'100%', height:'100%', display:'block' }}/>
                <img src={imgIconInstaInner} alt="" style={{ position:'absolute', top:'24%', left:'24%', width:'52%', height:'52%', display:'block' }}/>
                <img src={imgIconInstaDot}   alt="" style={{ position:'absolute', top:'18%', right:'18%', width:'12%', height:'12%', display:'block' }}/>
              </a>
              {/* GitHub */}
              <a href="#" style={{ display:'flex', alignItems:'center', justifyContent:'center', opacity:0.7, transition:'opacity 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.opacity='1'} onMouseLeave={e=>e.currentTarget.style.opacity='0.7'}>
                <img src={imgIconGithub} alt="GitHub" style={{ width:19, height:18, display:'block' }}/>
              </a>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height:1, background:'#e8ecf0', margin:'0 0 0' }}/>

          {/* Bottom copyright row */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 0', flexWrap:'wrap', gap:12 }}>
            <p style={{ fontFamily:font, fontSize:16, fontWeight:400, color:'#343434', margin:0 }}>
              © Copyright Tradie Migration 2026, All Rights Reserved
            </p>
            <div style={{ display:'flex', gap:32 }}>
              <a href="#" style={{ fontFamily:font, fontSize:16, fontWeight:600, color:'#6a7380', textDecoration:'underline' }}>Privacy Policy</a>
              <a href="#" style={{ fontFamily:font, fontSize:16, fontWeight:600, color:'#6a7380', textDecoration:'underline' }}>Terms &amp; Conditions</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
