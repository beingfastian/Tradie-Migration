/**
 * LandingPage — Pixel-perfect from Figma EPlK7tMF8fsZo3O9z9Loa5 node 1:41
 * Canvas: 1440px wide. All measurements taken directly from Figma.
 * Assets: permanently stored in frontend/src/assets/lp-*.svg/png
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Permanent local assets ────────────────────────────────────────────────────
import imgNavChevron    from '../assets/lp-nav-chevron.svg'
import imgNavArrow      from '../assets/lp-nav-arrow.svg'
import imgHeroIllus     from '../assets/lp-hero-illus.svg'
import imgHeroBg        from '../assets/lp-hero-bg.svg'
import imgCardBg        from '../assets/lp-card-bg.png'
import imgCard1Illus    from '../assets/lp-card1-illus.svg'
import imgCard2Illus    from '../assets/lp-card2-illus.svg'
import imgCard3Group1   from '../assets/lp-card3-group1.svg'
import imgCard3Group2   from '../assets/lp-card3-group2.svg'
import imgCardDecor1    from '../assets/lp-card-decor1.svg'
import imgCardDecor2    from '../assets/lp-card-decor2.svg'
import imgStepsLine     from '../assets/lp-steps-line.svg'
import imgStepsDot      from '../assets/lp-steps-dot.svg'
import imgStepsIllus    from '../assets/lp-steps-illus.svg'
import imgFaqIllus      from '../assets/lp-faq-illus.svg'
import imgFaqDotClose   from '../assets/lp-faq-dot-close.svg'
import imgFaqDotOpen    from '../assets/lp-faq-dot-open.svg'
import imgFaqPlus       from '../assets/lp-faq-plus.svg'
import imgFaqMinus      from '../assets/lp-faq-minus.svg'
import imgFaqDivider    from '../assets/lp-faq-divider.svg'
import imgAboutMe       from '../assets/lp-about-me.svg'

// ── Design tokens ─────────────────────────────────────────────────────────────
const font       = "'Urbanist', sans-serif"
const fontMohave = "'Mohave', sans-serif"
const blue       = '#156dbf'
const orange     = '#f26f37'
const dark       = '#0e3b6c'
const text1      = '#343434'
const text2      = '#6a7380'
const text3      = '#8e8d92'
const purple     = '#585484'

// Figma radial gradient (exact stops from design context)
const radialBg = `radial-gradient(ellipse at 110% -10%,
  #156dbf 0%, #317ec6 3.5%, #4d8fce 6.6%, #86b2dc 12.7%,
  #bed4eb 18.9%, #f6f6f9 25%, #bed4eb 43.75%,
  #86b2dc 62.5%, #4d8fce 81.25%, #317ec6 90.6%, #156dbf 100%)`

// ── FAQ data (exact questions from Figma) ─────────────────────────────────────
const FAQS = [
  {
    q: 'How does the trade verification work?',
    a: 'Our verification process checks your licences, qualifications, and work history against Australian standards. You upload your documents and our team plus AI-powered tools validate them against the relevant ANZSCO codes and state licensing requirements.',
  },
  {
    q: 'Can employers offer visa sponsorship?',
    a: 'Yes. Approved employers can sponsor skilled tradespeople under the 482 Temporary Skill Shortage visa. The platform guides both parties through the Labour Market Testing requirements and sponsorship application steps.',
  },
  {
    q: 'What is the benefit of registering as a Trainer?',
    a: 'Registered Training Organisations (RTOs) can list their entire course catalog, manage student enrollments, and track progress. It allows you to connect directly with tradies who need gap training or specific certifications to meet Australian Standards.',
  },
  {
    q: 'Can I use the app to manage my trade documents?',
    a: 'Absolutely. You can upload, store, and share licences, certifications, and qualifications securely. Employers see only what you choose to share, and you can revoke access at any time.',
  },
  {
    q: 'Is there a cost to join the Tradie App community?',
    a: 'Creating a candidate profile is free. Employers and training providers have tiered subscription plans that unlock advanced hiring tools, sponsorship support, and analytics dashboards.',
  },
]

// ── FAQ accordion item ─────────────────────────────────────────────────────────
function FaqItem({ q, a, last }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{
      width: '100%',
      borderBottom: last ? 'none' : '1px solid #dedede',
    }}>
      <div
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 0',
          cursor: 'pointer',
          gap: 16,
        }}
      >
        <span style={{
          fontFamily: font, fontWeight: 700, fontSize: 16,
          color: text1, lineHeight: 1.4, flex: 1,
        }}>{q}</span>

        {/* Figma icon: circle bg + plus/minus */}
        <div style={{
          flexShrink: 0,
          width: 26, height: 26,
          borderRadius: '50%',
          background: open ? '#585484' : '#f3f1fd',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            {open
              ? <line x1="1" y1="5" x2="9" y2="5" stroke={open ? '#fff' : '#585484'} strokeWidth="1.8" strokeLinecap="round"/>
              : <>
                  <line x1="5" y1="1" x2="5" y2="9" stroke="#585484" strokeWidth="1.8" strokeLinecap="round"/>
                  <line x1="1" y1="5" x2="9" y2="5" stroke="#585484" strokeWidth="1.8" strokeLinecap="round"/>
                </>
            }
          </svg>
        </div>
      </div>

      {open && (
        <p style={{
          fontFamily: font, fontWeight: 500, fontSize: 14,
          color: text2, lineHeight: 1.6, margin: '0 0 16px',
          maxWidth: 520,
        }}>{a}</p>
      )}
    </div>
  )
}

// ── Card component — exact Figma 380×536px with absolute-positioned illustrations ──
function EcosystemCard({ card }) {
  return (
    <div style={{
      width: 380, height: 536,
      borderRadius: 21,
      overflow: 'hidden',
      boxShadow: '0px 4px 24px 0px rgba(0,0,0,0.13)',
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Full-cover background image */}
      <img src={imgCardBg} alt="" style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover', borderRadius: 21,
        pointerEvents: 'none',
      }} />

      {/* Card-specific illustration layer */}
      {card.id === 1 && (
        <>
          {/* undraw_maker-launch: 380×258.578px at top=277.83, flipped vertically */}
          <div style={{
            position: 'absolute',
            top: 277.83, left: 0,
            width: 380, height: 258.578,
            transform: 'scaleY(-1) rotate(180deg)',
            transformOrigin: 'center',
          }}>
            <img src={imgCard1Illus} alt="" style={{ width: '100%', height: '100%' }} />
          </div>
          {/* Decor top-left */}
          <img src={imgCardDecor1} alt="" style={{
            position: 'absolute',
            top: '49.81%', left: '8.69%',
            width: '27.96%', height: '20.44%',
          }} />
        </>
      )}

      {card.id === 2 && (
        <>
          {/* undraw_team-work: 436.753×319.368px at top=224.83, left=0.05, rotate=-0.14deg */}
          <div style={{
            position: 'absolute',
            top: 224.83, left: 0.05,
            width: 436.753, height: 319.368,
            transform: 'rotate(-0.14deg)',
          }}>
            <img src={imgCard2Illus} alt="" style={{ width: '100%', height: '100%' }} />
          </div>
        </>
      )}

      {card.id === 3 && (
        <>
          {/* Group1 illustration: inset=[9.89%_13%_43.84%_65.26%]
              top=9.89%*536≈53px, right=13%*380≈49px, bottom=43.84%*536≈235px, left=65.26%*380≈248px */}
          <div style={{
            position: 'absolute',
            top: '9.89%', left: '65.26%',
            right: '13%', bottom: '43.84%',
          }}>
            <img src={imgCard3Group2} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          </div>
          {/* Group illustration rotated: inset=[-17.64%_34.85%_41.31%_-12.39%] */}
          <div style={{
            position: 'absolute',
            top: '-17.64%', left: '-12.39%',
            right: '34.85%', bottom: '41.31%',
          }}>
            <img src={imgCard3Group1} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-14.73deg)' }} />
          </div>
          {/* Decor */}
          <img src={imgCardDecor2} alt="" style={{
            position: 'absolute',
            top: '0.56%', left: '69.21%',
            right: '2.03%', bottom: '80.03%',
          }} />
        </>
      )}

      {/* White gradient overlay — bottom fade */}
      <div style={{
        position: 'absolute',
        top: card.id === 2 ? 0 : card.id === 3 ? 107 : 0,
        left: 0, width: 380,
        height: card.id === 2 ? 259 : card.id === 3 ? 429 : 317,
        background: card.id === 2
          ? 'linear-gradient(to bottom, rgba(255,255,255,0) 32.257%, #fff 59.742%)'
          : card.id === 3
          ? 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.8) 78.433%, #fff)'
          : 'linear-gradient(to top, rgba(255,255,255,0) 32.257%, #fff 59.742%)',
        borderRadius: 21,
        pointerEvents: 'none',
      }} />

      {/* Card text — positioned exactly as in Figma */}
      <p style={{
        position: 'absolute',
        top: card.textTop,
        left: 'calc(50% - 160px)',
        width: 285,
        fontFamily: font, fontWeight: 700, fontSize: 36,
        color: blue, lineHeight: 1.16,
        letterSpacing: '-0.32px',
        margin: 0,
      }}>{card.title}</p>

      <div style={{
        position: 'absolute',
        top: card.descTop,
        left: 'calc(50% - 156px)',
        width: 311,
        fontFamily: font, fontWeight: 500, fontSize: 16,
        color: text3, lineHeight: 1.5,
      }}>{card.desc}</div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export function LandingPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  // Cards config — textTop/descTop from Figma (card-relative: subtract card top=233 from section-absolute values)
  const cards = [
    {
      id: 1,
      title: 'Launch Your Australian Career',
      desc: 'Get your skills verified, browse visa-sponsored roles, and access gap training to meet Australian licensing standards. Your global career starts here.',
      textTop: 261 - 233,   // = 28px
      descTop: 409 - 233,   // = 176px
      to: '/register?role=candidate',
      cta: 'Find Jobs',
    },
    {
      id: 2,
      title: 'Build a Verified Workforce',
      desc: 'Connect with pre-screened local and international talent. Simplify your recruitment with verified background checks and sponsorship tools.',
      textTop: 28,
      descTop: 172,
      to: '/register?role=employer',
      cta: 'Hire Talent',
    },
    {
      id: 3,
      title: 'Enroll the Next Generation',
      desc: 'List your RTO courses and certification programs directly to students and workers looking to upskill or convert their international licenses.',
      textTop: 316,
      descTop: 460,
      to: '/register?role=training_provider',
      cta: 'List Courses',
    },
  ]

  return (
    <div style={{ fontFamily: font, background: '#fff', overflowX: 'hidden', minWidth: 1280 }}>

      {/* ════════ NAVBAR — height=72px, padding=0 66px ════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        height: 72,
        display: 'flex', alignItems: 'center',
        padding: '0 66px',
        gap: 0,
      }}>
        {/* Left nav links */}
        <div style={{ display: 'flex', gap: 48, alignItems: 'center' }}>
          {['Find Jobs', 'Hire Talent', 'Blogs', 'Contact'].map(l => (
            <a key={l} href="#" style={{
              fontFamily: font, fontWeight: 500, fontSize: 18,
              color: text1, textDecoration: 'none', lineHeight: 1.3,
            }}
            onMouseEnter={e => e.currentTarget.style.color = blue}
            onMouseLeave={e => e.currentTarget.style.color = text1}
            >{l}</a>
          ))}
        </div>

        {/* Center logo */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <span
            onClick={() => navigate('/')}
            style={{ fontFamily: fontMohave, fontWeight: 600, fontSize: 39.127, cursor: 'pointer', lineHeight: 1.3 }}
          >
            <span style={{ color: orange }}>T</span>
            <span style={{ color: blue }}>radie Migration</span>
          </span>
        </div>

        {/* Right: lang + divider + login + join */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
            <span style={{ fontFamily: font, fontWeight: 600, fontSize: 16, color: purple }}>Eng</span>
            <img src={imgNavChevron} alt="" style={{ width: 18, height: 14 }} />
          </div>
          {/* vertical divider */}
          <img src={imgNavChevron} alt="" style={{ width: 0, height: 29.051, opacity: 0 }} />
          <div style={{ width: 1, height: 29, background: '#c8c7d8' }} />
          <button onClick={() => navigate('/login')} style={{
            fontFamily: font, fontWeight: 600, fontSize: 16,
            color: purple, background: 'none', border: 'none', cursor: 'pointer',
            lineHeight: 1.3,
          }}>Login</button>
          <button onClick={() => navigate('/register')} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            height: 48, padding: '0 28px 0 20px',
            border: '1px solid ' + purple, borderRadius: 32,
            fontFamily: font, fontWeight: 600, fontSize: 16, color: purple,
            background: '#fff', cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(16,24,40,0.03), 0 12px 16px rgba(16,24,40,0.08)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = blue; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = blue }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = purple; e.currentTarget.style.borderColor = purple }}
          >
            Join Now
            <img src={imgNavArrow} alt="" style={{ width: 18, height: 14 }} />
          </button>
        </div>
      </nav>

      {/* ════════ HERO — radial gradient bg, full width ════════ */}
      <section style={{
        position: 'relative',
        background: radialBg,
        padding: '90px 66px 0',
        overflow: 'hidden',
        minHeight: 640,
      }}>
        {/* Subtle decorative bottom wave */}
        <img src={imgHeroBg} alt="" style={{
          position: 'absolute', bottom: 0, left: 0,
          width: '55%', pointerEvents: 'none', opacity: 0.12,
        }} />

        {/* Text column */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 580, paddingBottom: 80 }}>
          <h1 style={{
            fontFamily: font, fontWeight: 800, fontSize: 52,
            color: dark, margin: '0 0 20px',
            lineHeight: 1.1, letterSpacing: '-0.5px',
          }}>
            Connecting Global Talent to Australia's Trade Industry.
          </h1>
          <p style={{
            fontFamily: font, fontWeight: 500, fontSize: 18,
            color: text2, lineHeight: 1.6, margin: '0 0 36px',
          }}>
            The all-in-one platform for skilled tradies, employers, and training providers. Verified skills, simplified sponsorship.
          </p>

          {/* Search bar */}
          <div style={{
            display: 'flex', alignItems: 'center',
            background: '#fff', borderRadius: 40,
            padding: '6px 6px 6px 20px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            maxWidth: 520, marginBottom: 20,
          }}>
            <svg width="18" height="18" fill="none" stroke={text2} strokeWidth="2" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="6"/><path d="M14 14l3 3"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for a trade, role or location..."
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'none',
                fontFamily: font, fontSize: 15, color: text1, padding: '8px 12px',
              }}
            />
            <button onClick={() => navigate(`/worker/jobs${search ? `?q=${encodeURIComponent(search)}` : ''}`)} style={{
              height: 44, padding: '0 24px', borderRadius: 32,
              background: blue, color: '#fff', border: 'none',
              fontFamily: font, fontWeight: 700, fontSize: 15, cursor: 'pointer',
            }}>Browse Jobs</button>
          </div>
          <p style={{ fontFamily: font, fontSize: 13, color: text2 }}>
            Popular:&nbsp;
            {['Electrician', 'Plumber', 'Welder', 'HVAC'].map((t, i) => (
              <span key={t}>
                <span style={{ color: blue, cursor: 'pointer' }}
                  onClick={() => navigate(`/worker/jobs?q=${t}`)}>{t}</span>
                {i < 3 && <span style={{ margin: '0 4px' }}>·</span>}
              </span>
            ))}
          </p>
        </div>

        {/* Hero illustration — anchored to bottom-right per Figma */}
        <div style={{
          position: 'absolute', zIndex: 1,
          right: 0, bottom: 0,
          width: '52%',
        }}>
          <img src={imgHeroIllus} alt="Tradie workers" style={{
            width: '100%', display: 'block',
          }} />
        </div>
      </section>

      {/* ════════ ECOSYSTEM — 3 cards, exact Figma layout ════════
          Container: 1305×634px at page centre, cards 380×536 each
          gaps: left=60, between=24, right=60+remaining             */}
      <section style={{ background: radialBg, padding: '0 66px 80px' }}>
        {/* Section wrapper — matches Figma 1305px container */}
        <div style={{
          position: 'relative',
          borderRadius: 34,
          padding: '55px 60px 80px',
          background: radialBg,
          overflow: 'hidden',
        }}>

          {/* Decorative white blobs (from Figma 1:363) */}
          {[
            { w:76,  h:80,  t:'77%', l:'25%',  op:0.1, br:34 },
            { w:53,  h:56,  t:'82%', l:'89%',  op:0.1, br:34 },
            { w:76,  h:79,  t:'5%',  l:'91%',  op:0.1, br:34 },
            { w:86,  h:92,  t:'50%', l:'4%',   op:0.1, br:34 },
            { w:232, h:248, t:'12%', l:'74%',  op:0.1, br:308 },
          ].map((b,i) => (
            <div key={i} style={{
              position:'absolute', background:'#fff', borderRadius:b.br,
              width:b.w, height:b.h, top:b.t, left:b.l, opacity:b.op, pointerEvents:'none',
            }}/>
          ))}

          {/* Heading + subtitle row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 40, position: 'relative', zIndex: 1 }}>
            <h2 style={{
              fontFamily: font, fontWeight: 800, fontSize: 48,
              color: '#fff', margin: 0,
              lineHeight: 1.15, maxWidth: 480, letterSpacing: '-0.32px',
            }}>
              A Powerful Ecosystem for the Trade Industry
            </h2>
            <p style={{
              fontFamily: font, fontWeight: 500, fontSize: 18,
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.5, maxWidth: 545, margin: 0, paddingTop: 8,
            }}>
              Whether you're looking for a career move, a top-tier hire, or professional training, Tradie App connects you to the right opportunity.
            </p>
          </div>

          {/* Cards row — exact Figma gaps: 24px between cards */}
          <div style={{ display: 'flex', gap: 24, position: 'relative', zIndex: 1 }}>
            {cards.map(card => (
              <div key={card.id} style={{ position: 'relative' }}>
                <EcosystemCard card={card} />
                {/* CTA button below card text */}
                <button
                  onClick={() => navigate(card.to)}
                  style={{
                    position: 'absolute',
                    bottom: 24, left: 28,
                    height: 40, padding: '0 20px',
                    background: blue, color: '#fff', border: 'none',
                    borderRadius: 20, fontFamily: font, fontWeight: 700,
                    fontSize: 14, cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(21,109,191,0.35)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#0d5da0'}
                  onMouseLeave={e => e.currentTarget.style.background = blue}
                >{card.cta} →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════ 3 EASY STEPS ════════ */}
      <section style={{ background: '#fff', padding: '80px 66px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{
            fontFamily: font, fontWeight: 800, fontSize: 48,
            color: dark, margin: '0 0 16px', letterSpacing: '-0.3px',
          }}>
            Your Path to Success in<br />3 Easy Steps
          </h2>
          <p style={{ fontFamily: font, fontWeight: 500, fontSize: 18, color: text2, lineHeight: 1.6, maxWidth: 520, margin: '0 auto' }}>
            Whether you're hiring or looking for work, we've simplified the process to get you moving faster.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 80, alignItems: 'flex-start', maxWidth: 1150, margin: '0 auto' }}>
          {/* Steps list with Figma-style number + connecting line */}
          <div style={{ flex: 1 }}>
            {[
              {
                num: '1', title: 'Build a Profile That Stands Out',
                desc: 'Register and upload your credentials. We verify your licences and qualifications so you can connect with confidence.',
              },
              {
                num: '2', title: 'Find Your Perfect Industry Match',
                desc: 'Our smart dashboard connects skilled tradies with employers and links students to the right training programs.',
              },
              {
                num: '3', title: 'Sign, Enrol, and Start',
                desc: 'Once matched, accept your employer sponsorship or enrol in your course. Tradie App handles the paperwork.',
              },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 0, marginBottom: i < 2 ? 0 : 0 }}>
                {/* Number column with Figma line+dot assets */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 180, flexShrink: 0 }}>
                  <span style={{
                    fontFamily: font, fontWeight: 800, fontSize: 149.637,
                    color: blue, lineHeight: 1.01,
                    letterSpacing: '-0.7147px',
                    display: 'block',
                    marginLeft: i === 1 ? 38 : i === 2 ? -44 : -27,
                  }}>{step.num}</span>
                  {i < 2 && (
                    <div style={{ position: 'relative', width: 88.873, height: 120 }}>
                      <img src={imgStepsLine} alt="" style={{ position: 'absolute', left: -1.26, top: 0, width: '102.52%', height: '100%' }} />
                      <img src={imgStepsDot} alt="" style={{
                        position: 'absolute',
                        top: i === 0 ? 126.07 - 149.637 : 10,
                        left: i === 0 ? 97.27 - 86.46 : 87.52,
                        width: 31.267, height: 31.267,
                      }} />
                    </div>
                  )}
                </div>
                {/* Step text */}
                <div style={{ paddingTop: 20, flex: 1 }}>
                  <h3 style={{
                    fontFamily: font, fontWeight: 700, fontSize: 26,
                    color: dark, margin: '0 0 12px', letterSpacing: '-0.2px',
                  }}>{step.title}</h3>
                  <p style={{ fontFamily: font, fontWeight: 500, fontSize: 16, color: text2, lineHeight: 1.65, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
            <button onClick={() => navigate('/register')} style={{
              marginTop: 48, height: 52, padding: '0 32px',
              background: blue, color: '#fff', border: 'none', borderRadius: 28,
              fontFamily: font, fontWeight: 700, fontSize: 16, cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(21,109,191,0.35)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#0d5da0'}
            onMouseLeave={e => e.currentTarget.style.background = blue}
            >Get Started Now →</button>
          </div>

          {/* Steps illustration — node 1:731, full SVG */}
          <div style={{ flexShrink: 0, width: 460 }}>
            <img src={imgStepsIllus} alt="Steps" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ════════ FAQ — exact Figma layout ════════
          Left: FAQ list width=745.887px  |  Right: illustration  */}
      <section style={{ background: '#f8faff', padding: '80px 66px' }}>
        <div style={{ display: 'flex', gap: 80, alignItems: 'flex-start', maxWidth: 1310, margin: '0 auto' }}>

          {/* Left — FAQ list */}
          <div style={{ flex: '0 0 745.887px' }}>
            <h2 style={{
              fontFamily: font, fontWeight: 800, fontSize: 48,
              color: blue, margin: '0 0 8px',
              letterSpacing: '-0.3px', lineHeight: 1.01,
            }}>
              Got Questions?<br />We've Got Answers.
            </h2>
            <p style={{
              fontFamily: font, fontWeight: 500, fontSize: 16,
              color: text2, lineHeight: 1.6,
              margin: '0 0 36px', maxWidth: 460,
            }}>
              Find answers to the most common questions about visa sponsorship, trade verification, and how the platform works.
            </p>
            <div style={{ paddingTop: 12, maxWidth: 641 }}>
              {FAQS.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} last={i === FAQS.length - 1} />
              ))}
            </div>
          </div>

          {/* Right — illustrations */}
          <div style={{ flex: 1, paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <img src={imgFaqIllus} alt="Support" style={{ width: '100%', display: 'block' }} />
            <img src={imgAboutMe} alt="About" style={{ width: '100%', display: 'block' }} />
          </div>
        </div>
      </section>

      {/* ════════ BOTTOM CTA BANNER ════════
          Figma node 1:859 — 547.931×482.094px card + 712.217×700.234px illustration  */}
      <section style={{ background: '#fff', padding: '60px 66px 80px' }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          position: 'relative', overflow: 'hidden',
          borderRadius: 37.338,
          display: 'flex', alignItems: 'center',
          minHeight: 482,
        }}>
          {/* Gradient card bg (Figma radial — same palette) */}
          <div style={{
            position: 'absolute', inset: 0,
            background: radialBg,
            borderRadius: 37.338,
          }} />

          {/* White blob decorations */}
          {[
            { w:31.877, h:98.575, t:'79%', l:'23%', br:93 },
            { w:21.915, h:67.77,  t:'88%', l:'52%', br:93 },
            { w:31.877, h:98.575, t:'5%',  l:'53%', br:93 },
            { w:36.369, h:113.978,t:'49%', l:'13%', br:93 },
            { w:97.845, h:308.047,t:'56%', l:'13%', br:112 },
          ].map((b,i) => (
            <div key={i} style={{
              position:'absolute', background:'#fff', borderRadius:b.br,
              width:b.w, height:b.h, top:b.t, left:b.l, opacity:0.1, pointerEvents:'none',
            }}/>
          ))}

          {/* Illustration left — node 1:868 */}
          <div style={{
            position: 'absolute', left: 0, top: 0,
            width: '55%', height: '100%',
            zIndex: 0,
          }}>
            <img src={imgAboutMe} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'left bottom' }} />
          </div>

          {/* Text content right */}
          <div style={{
            marginLeft: 'auto', width: 520,
            position: 'relative', zIndex: 1,
            padding: '60px 60px 60px 0',
          }}>
            <h2 style={{
              fontFamily: font, fontWeight: 800, fontSize: 42,
              color: '#fff', margin: '0 0 16px',
              letterSpacing: '-0.3px', lineHeight: 1.2,
            }}>
              Build Your Future<br />with Tradie App
            </h2>
            <p style={{
              fontFamily: font, fontWeight: 500, fontSize: 17,
              color: 'rgba(255,255,255,0.88)', lineHeight: 1.6,
              margin: '0 0 32px', maxWidth: 420,
            }}>
              Join thousands of skilled tradespeople and employers already using Tradie Migration to connect, verify, and grow.
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={() => navigate('/register?role=candidate')} style={{
                height: 52, padding: '0 28px', background: '#fff', color: blue,
                border: 'none', borderRadius: 28,
                fontFamily: font, fontWeight: 700, fontSize: 15, cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#eaf2fc'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              >Find Jobs →</button>
              <button onClick={() => navigate('/register?role=employer')} style={{
                height: 52, padding: '0 28px',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.5)', borderRadius: 28,
                fontFamily: font, fontWeight: 700, fontSize: 15, cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
              >Hire Talent →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ FOOTER ════════ */}
      <footer style={{
        background: '#fff',
        borderTop: '1px solid #e5e7eb',
        padding: '36px 66px 24px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 24,
        }}>
          <span onClick={() => navigate('/')} style={{
            fontFamily: fontMohave, fontWeight: 600, fontSize: 28, cursor: 'pointer',
          }}>
            <span style={{ color: orange }}>T</span>
            <span style={{ color: blue }}>radie Migration</span>
          </span>

          <div style={{ display: 'flex', gap: 40 }}>
            {['Find Jobs','Hire Talent','About','Contact'].map(l => (
              <a key={l} href="#" style={{ fontFamily: font, fontSize: 15, color: text2, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = blue}
                onMouseLeave={e => e.currentTarget.style.color = text2}
              >{l}</a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            {[
              { d:'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
              { d:'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
              { d:'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 20.5h9a5 5 0 005-5v-9a5 5 0 00-5-5h-9a5 5 0 00-5 5v9a5 5 0 005 5z' },
              { d:'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
            ].map(({ d }, i) => (
              <a key={i} href="#" style={{ color: text2, display: 'flex' }}
                onMouseEnter={e => e.currentTarget.style.color = blue}
                onMouseLeave={e => e.currentTarget.style.color = text2}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={d}/>
                </svg>
              </a>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #e5e7eb', paddingTop: 18,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontFamily: font, fontSize: 13, color: text2 }}>
            © Copyright Tradie Migration 2026. All Rights Reserved
          </span>
          <div style={{ display: 'flex', gap: 24 }}>
            {['Privacy Policy','Terms & Conditions'].map(l => (
              <a key={l} href="#" style={{ fontFamily: font, fontSize: 13, color: text2, textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.color = blue}
                onMouseLeave={e => e.currentTarget.style.color = text2}
              >{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  )
}
