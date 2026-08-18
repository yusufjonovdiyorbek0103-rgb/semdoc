import { useState, useEffect, CSSProperties, PointerEvent } from 'react'
import DocumentDetail from './DocumentDetail'
import AiChat from './AiChat'
import Upload from './Upload'
import Evaluation from './Evaluation'
import Classification from './Classification'
import Duplicates from './Duplicates'
import Analytics from './Analytics'
import AuditLog from './AuditLog'

// ── Types ─────────────────────────────────────────────────────────────────────

type SearchMode = 'semantic' | 'keyword'

interface ExcerptPart {
  text: string
  highlight: boolean
}

interface Result {
  relevance: number
  relVar: string
  docType: string
  docNumber: string
  date: string
  title: string
  org: string
  excerptLabel: string
  excerpt: ExcerptPart[]
}

// ── Data ──────────────────────────────────────────────────────────────────────

const RESULTS_SEMANTIC: Result[] = [
  {
    relevance: 92,
    relVar: 'var(--rel-90)',
    docType: 'FARMOYISH',
    docNumber: '112-F',
    date: '14.03.2025',
    title: '«Yashil makon» loyihasi doirasida ko\'chat ekish tadbirlari to\'g\'risida',
    org: 'Toshkent shahar hokimligi',
    excerptLabel: 'Topilgan qism · 4-bet, 2-abzas',
    excerpt: [
      { text: 'Tuman hokimliklari 2025-yil 1-apreldan 15-maygacha har bir mahallada kamida 200 tup manzarali daraxt ', highlight: false },
      { text: 'ko\'chatini ekishni', highlight: true },
      { text: ' ta\'minlasin.', highlight: false },
    ],
  },
  {
    relevance: 78,
    relVar: 'var(--rel-70)',
    docType: 'BUYRUQ',
    docNumber: '44-B',
    date: '20.03.2025',
    title: 'Ko\'chat ekish va yashil hududlarni kengaytirish jadvali',
    org: 'Ekologiya vazirligi',
    excerptLabel: 'Topilgan qism · 2-bet, 5-abzas',
    excerpt: [
      { text: 'Ilova qilingan jadval asosida viloyatlar kesimida ', highlight: false },
      { text: 'ko\'kalamzorlashtirish ishlari', highlight: true },
      { text: ' bosqichma-bosqich amalga oshiriladi, hisobot har oyning 5-kuniga qadar taqdim etiladi.', highlight: false },
    ],
  },
  {
    relevance: 61,
    relVar: 'var(--rel-50)',
    docType: 'BAYONNOMA',
    docNumber: '7-Y',
    date: '05.02.2025',
    title: 'Hududlarda ekologik holatni yaxshilash bo\'yicha yig\'ilish bayoni',
    org: 'Ekologiya vazirligi',
    excerptLabel: 'Topilgan qism · 1-bet, 8-abzas',
    excerpt: [
      { text: 'Yig\'ilishda ', highlight: false },
      { text: 'daraxt ekish mavsumiga', highlight: true },
      { text: ' tayyorgarlik, ko\'chatzorlar bilan ta\'minlanish masalasi ko\'rib chiqildi va tegishli topshiriqlar berildi.', highlight: false },
    ],
  },
]

const SUGGESTIONS = [
  "ko'chat ekish topshiriqlari va muddatlari",
  "elektron hujjat aylanishini takomillashtirish",
  "yo'l yoritilishi bo'yicha murojaatlar",
]

const RESULT_PREVIEW_DATA = [
  {
    deadline: '15.05.2025',
    dept: 'Tuman hokimliklari',
    privacy: 'Ochiq',
    summary: "Tuman hokimliklari har bir mahallada kamida 200 tup manzarali daraxt ko'chatini ekishni ta'minlashi shart. Topshiriq 2025-yil 1-apreldan 15-maygacha bajarilishi lozim. Ko'chatlarni yetkazib berish Ekologiya boshqarmasiga yuklatilgan.",
    citLabel: 'D-003 · 2-bet',
  },
  {
    deadline: '01.04.2025',
    dept: 'Ekologiya boshqarmasi',
    privacy: 'Ochiq',
    summary: "Viloyatlar kesimida ko'kalamzorlashtirish ishlari bosqichma-bosqich amalga oshiriladi. Hisobot har oyning 5-kuniga qadar taqdim etilishi talab qilinadi. Jadval ilova sifatida berilgan.",
    citLabel: 'D-010 · 1-bet',
  },
  {
    deadline: '—',
    dept: 'Ekologiya vazirligi',
    privacy: 'Ochiq',
    summary: "Daraxt ekish mavsumiga tayyorgarlik va ko'chatzorlar bilan ta'minlanish masalasi muhokama qilindi. Tegishli topshiriqlar mas'ul bo'limlarga berildi.",
    citLabel: 'D-007 · 1-bet',
  },
]

const DOC_TYPES = ['Barchasi', 'Qaror', 'Buyruq', 'Farmoyish', 'Xat', 'Murojaat', 'Bayonnoma', 'Nizom', 'Hisobot']
const ORGS = ['Barchasi', 'Vazirlar Mahkamasi', 'Raqamli texnologiyalar vazirligi', 'Ekologiya vazirligi', 'Toshkent shahar hokimligi', 'Oliy ta\'lim vazirligi']
const PRIVACY = ['Barchasi', 'Ochiq', 'Xizmat uchun']

// ── Small components ──────────────────────────────────────────────────────────

function Badge({ label }: { label: string }) {
  return (
    <span style={{
      fontFamily: 'var(--sans)',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.07em',
      textTransform: 'uppercase' as const,
      color: 'var(--ink-2)',
      background: 'var(--badge-bg)',
      border: '1px solid var(--hairline)',
      borderRadius: 4,
      padding: '2px 7px',
      lineHeight: 1.5,
      whiteSpace: 'nowrap' as const,
    }}>
      {label}
    </span>
  )
}

function Mono({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span style={{
      fontFamily: 'var(--mono)',
      fontSize: 12,
      color: color || 'var(--ink-2)',
      letterSpacing: '0.02em',
    }}>
      {children}
    </span>
  )
}

function Excerpt({ parts, borderColor }: { parts: ExcerptPart[]; borderColor: string }) {
  return (
    <div style={{
      borderLeft: `2px solid ${borderColor}`,
      paddingLeft: 10,
      background: 'var(--surface-2)',
      borderRadius: '0 4px 4px 0',
      padding: '8px 10px 8px 12px',
    }}>
      <p style={{
        fontFamily: 'var(--serif)',
        fontSize: 14,
        lineHeight: 1.65,
        color: 'var(--ink)',
        margin: 0,
      }}>
        {parts.map((p, i) =>
          p.highlight
            ? <mark key={i} style={{ background: '#E8EEF4', color: 'inherit', padding: '1px 3px', borderRadius: 2 }}>{p.text}</mark>
            : <span key={i}>{p.text}</span>
        )}
      </p>
    </div>
  )
}

function ResultCard({ result, onTitleClick, selected, onSelect }: {
  result: Result; onTitleClick?: () => void; selected?: boolean; onSelect?: () => void
}) {
  return (
    <div
      onClick={onSelect}
      style={{
        background: selected ? 'var(--navy-100)' : 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderLeft: selected ? '3px solid var(--navy-700)' : '1px solid var(--hairline)',
        borderRadius: 'var(--r-md)',
        display: 'flex',
        overflow: 'hidden',
        cursor: onSelect ? 'pointer' : 'default',
        transition: 'background 0.12s, border-color 0.12s',
      }}
    >
      {/* Relevance bar */}
      {!selected && <div className="rel-bar" style={{ width: 4, flexShrink: 0, background: result.relVar }} />}

      {/* Content */}
      <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Top row: badge + number + date + relevance */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
          <Badge label={result.docType} />
          <Mono>№ {result.docNumber}</Mono>
          <Mono>·</Mono>
          <Mono>{result.date}</Mono>
          <div style={{ flex: 1 }} />
          <span style={{
            fontFamily: 'var(--mono)',
            fontSize: 12,
            fontWeight: 500,
            color: result.relVar,
            letterSpacing: '0.02em',
          }}>
            {result.relevance}% moslik
          </span>
        </div>

        {/* Title */}
        <p
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: 'var(--ink)',
            margin: 0,
            lineHeight: 1.4,
            cursor: 'pointer',
          }}
          onClick={onTitleClick}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink)')}
        >
          {result.title}
        </p>

        {/* Org */}
        <p style={{ fontSize: 12, color: 'var(--ink-2)', margin: 0 }}>{result.org}</p>

        {/* Excerpt block */}
        <div>
          <p style={{ fontSize: 11, color: 'var(--ink-3)', margin: '0 0 5px', letterSpacing: '0.02em' }}>
            {result.excerptLabel}
          </p>
          <Excerpt parts={result.excerpt} borderColor={result.relVar} />
        </div>

        {/* Bottom links */}
        <div style={{ display: 'flex', gap: 16, marginTop: 2 }}>
          {['Hujjatni ochish', "O'xshash hujjatlar (4)", 'AI xulosa'].map(label => (
            <button
              key={label}
              onClick={e => e.stopPropagation()}
              style={{
                fontFamily: 'var(--sans)',
                fontSize: 12,
                color: 'var(--navy-600)',
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                textDecoration: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Select({ label, options }: { label: string; options: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
      <label style={{ fontSize: 12, color: 'var(--ink-2)', fontWeight: 500 }}>{label}</label>
      <select style={{
        height: 32,
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: 4,
        color: 'var(--ink)',
        fontSize: 13,
        padding: '0 8px',
        cursor: 'pointer',
        fontFamily: 'var(--sans)',
        minWidth: 140,
      }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────────────────────

export default function App() {
  const [mode, setMode] = useState<SearchMode>('semantic')
  const [query, setQuery] = useState("ko'chat ekish bo'yicha qanday topshiriqlar berilgan?")
  const [hasSearched, setHasSearched] = useState(true)
  const [noResults, setNoResults] = useState(false)
  const [selectedCard, setSelectedCard] = useState<number | null>(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1400)
  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const showRail = windowWidth >= 1100
  const showPreview = windowWidth >= 1280

  const [showDetail, setShowDetail] = useState(false)
  const [showAiChat, setShowAiChat] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [showEval, setShowEval] = useState(false)
  const [showClassify, setShowClassify] = useState(false)
  const [showDuplicates, setShowDuplicates] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showAudit, setShowAudit] = useState(false)
  const [detailFromAiChat, setDetailFromAiChat] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const triggerLoad = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 380)
  }

  const handleNav = (screen: string) => {
    triggerLoad()
    setShowDetail(false)
    setDetailFromAiChat(false)
    setShowAiChat(screen === 'ai')
    setShowUpload(screen === 'upload')
    setShowEval(screen === 'eval')
    setShowClassify(screen === 'classify')
    setShowDuplicates(screen === 'duplicates')
    setShowAnalytics(screen === 'analytics')
    setShowAudit(screen === 'audit')
  }

  const handleOpenDocFromAiChat = () => {
    triggerLoad()
    setShowAiChat(false)
    setDetailFromAiChat(true)
    setShowDetail(true)
  }

  const handleDetailBack = () => {
    if (detailFromAiChat) {
      triggerLoad()
      setShowDetail(false)
      setDetailFromAiChat(false)
      setShowAiChat(true)
    } else {
      setShowDetail(false)
    }
  }
  const [hovering, setHovering] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top })
  }

  const mask = `radial-gradient(circle at ${cursor.x}px ${cursor.y}px, #000 72px, transparent 120px)`

  const results = mode === 'semantic' ? RESULTS_SEMANTIC : RESULTS_SEMANTIC.slice(0, 1)

  const handleSearch = () => {
    if (!query.trim()) {
      setHasSearched(false)
      setNoResults(false)
      return
    }
    setHasSearched(true)
    setNoResults(false)
  }

  const handleClearFilters = () => {
    setNoResults(false)
    setHasSearched(false)
    setQuery('')
  }

  const showSearch = !showAudit && !showAnalytics && !showDuplicates && !showClassify && !showEval && !showUpload && !showAiChat && !showDetail

  const bg: CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
    backgroundColor: 'var(--background)',
    overflow: 'hidden',
  }
  const dots: CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundImage: 'radial-gradient(circle at center, rgba(100,150,220,0.18) 1.2px, transparent 1.4px)',
    backgroundSize: '18px 18px',
    pointerEvents: 'none',
    zIndex: 0,
  }
  const dotsHover: CSSProperties = {
    position: 'fixed',
    inset: 0,
    backgroundImage: 'radial-gradient(circle at center, rgba(46,105,224,0.25) 2.1px, transparent 2.3px)',
    backgroundSize: '18px 18px',
    opacity: hovering ? 1 : 0,
    maskImage: mask,
    WebkitMaskImage: mask,
    pointerEvents: 'none',
    zIndex: 0,
    transition: 'opacity 0.15s',
  }

  // ── Current screen label for top bar ─────────────────────────────────────────
  const screenLabel = showAudit ? 'Audit jurnali'
    : showAnalytics ? 'Analitika'
    : showDuplicates ? 'Dublikatlar'
    : showClassify ? 'Tasniflash navbati'
    : showEval ? 'Model samaradorligi'
    : showUpload ? 'Hujjat yuklash'
    : showAiChat ? 'AI savol-javob'
    : showDetail ? 'Hujjat tafsiloti'
    : 'Semantik qidiruv'

  // ── Nav sections ──────────────────────────────────────────────────────────────
  const ic = (d: React.ReactNode) => (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {d}
    </svg>
  )
  const NAV_SECTIONS = [
    {
      label: 'QIDIRUV',
      items: [
        { label: 'Semantik qidiruv', key: 'search',
          icon: ic(<><circle cx="7" cy="7" r="4.5"/><path d="M11 11l3.5 3.5"/></>) },
        { label: 'AI savol-javob', key: 'ai',
          icon: ic(<path d="M14 3H3a1 1 0 00-1 1v5.5a1 1 0 001 1H5l2 2.5 2-2.5h5a1 1 0 001-1V4a1 1 0 00-1-1z"/>) },
      ],
    },
    {
      label: 'BOSHQARUV',
      items: [
        { label: 'Hujjat yuklash', key: 'upload',
          icon: ic(<><path d="M8.5 2v9.5M5.5 5l3-3 3 3"/><path d="M3 13v1a1 1 0 001 1h9a1 1 0 001-1v-1"/></>) },
        { label: 'Tasniflash navbati', key: 'classify', badge: '3',
          icon: ic(<><path d="M2 4.5h13M2 8.5h9.5M2 12.5h6.5"/><circle cx="13.5" cy="12.5" r="2"/></>) },
        { label: 'Dublikatlar', key: 'duplicates', badge: '2',
          icon: ic(<><rect x="5.5" y="2" width="8.5" height="10.5" rx="1.5"/><rect x="2" y="5.5" width="8.5" height="10.5" rx="1.5"/></>) },
      ],
    },
    {
      label: 'TAHLIL',
      items: [
        { label: 'Model samaradorligi', key: 'eval',
          icon: ic(<path d="M2 13l4-5 3 3 5-7"/>) },
        { label: 'Analitika', key: 'analytics',
          icon: ic(<><rect x="2" y="9" width="3.5" height="5.5"/><rect x="7" y="5" width="3.5" height="9.5"/><rect x="12" y="7" width="3.5" height="7.5"/></>) },
        { label: 'Audit jurnali', key: 'audit',
          icon: ic(<path d="M8.5 1.5L2.5 4.5v5C2.5 12.5 8.5 15 8.5 15S14.5 12.5 14.5 9.5v-5L8.5 1.5z"/>) },
      ],
    },
  ] as const

  const RECENT_QUERIES = [
    "ko’chat ekish topshiriqlari",
    "elektron hujjat aylanishi",
    "raqamli kompetensiya kurslari",
    "arxiv saqlash muddatlari",
  ]

  const activeKey = showAudit ? 'audit' : showAnalytics ? 'analytics' : showDuplicates ? 'duplicates'
    : showClassify ? 'classify' : showEval ? 'eval' : showUpload ? 'upload'
    : showAiChat ? 'ai' : 'search'

  const handleNavKey = (key: string) => {
    if (key === 'search') {
      handleNav('search')
      setShowDetail(false)
      setDetailFromAiChat(false)
      setShowAiChat(false)
      setShowUpload(false)
      setShowEval(false)
      setShowClassify(false)
      setShowDuplicates(false)
      setShowAnalytics(false)
      setShowAudit(false)
    } else {
      handleNav(key)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--canvas)' }}>

      {/* Loading bar */}
      {isLoading && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 9999,
          background: 'var(--brass-soft)', animation: 'loadbar 380ms ease-out forwards',
        }} />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{
        width: sidebarCollapsed ? 64 : 248, flexShrink: 0,
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--sidebar-border)',
        display: 'flex', flexDirection: 'column',
        height: '100vh', overflow: 'hidden',
        transition: 'width 200ms ease',
      }}>

        {/* Zone 1 — Brand block */}
        <div style={{
          height: 72, flexShrink: 0,
          borderBottom: '1px solid var(--hairline)',
          padding: '0 20px',
          display: 'flex', alignItems: 'center',
          position: 'relative',
        }}>
          {sidebarCollapsed ? (
            <span style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.01em', margin: '0 auto' }}>S</span>
          ) : (
            <div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.01em', lineHeight: 1 }}>
                SEMDOC
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 400, color: 'var(--ink-3)', marginTop: 5, lineHeight: 1 }}>
                Semantik tahlil tizimi
              </div>
            </div>
          )}
          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(v => !v)}
            title={sidebarCollapsed ? 'Kengaytirish' : 'Qisqartirish'}
            style={{
              position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
              width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--canvas)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-xs)',
              cursor: 'pointer', color: 'var(--ink-3)', transition: 'background 0.12s, color 0.12s',
              padding: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--canvas)'; e.currentTarget.style.color = 'var(--ink-3)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
              {sidebarCollapsed
                ? <><path d="M4 2l4 4-4 4"/></>
                : <><path d="M8 2L4 6l4 4"/></>
              }
            </svg>
          </button>
        </div>

        {/* Zone 2+3 — Nav + Recent queries (scrollable middle) */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px 12px' }}>
          {/* Nav sections */}
          {NAV_SECTIONS.map(section => (
            <div key={section.label}>
              {!sidebarCollapsed && (
                <div style={{
                  fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.11em', textTransform: 'uppercase',
                  color: 'var(--ink-3)',
                  paddingLeft: 10, marginTop: 20, marginBottom: 6,
                }}>
                  {section.label}
                </div>
              )}
              {sidebarCollapsed && <div style={{ height: 16 }} />}
              {section.items.map(item => {
                const active = activeKey === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => handleNavKey(item.key)}
                    title={sidebarCollapsed ? item.label : undefined}
                    style={{
                      display: 'flex', alignItems: 'center',
                      gap: sidebarCollapsed ? 0 : 9,
                      justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                      width: '100%', height: 38,
                      padding: sidebarCollapsed ? '0' : '0 10px',
                      background: active ? 'var(--accent-light)' : 'transparent',
                      border: 'none', borderRadius: 'var(--r-sm)', cursor: 'pointer',
                      position: 'relative', textAlign: 'left',
                      transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--canvas)' }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
                  >
                    {/* Active brass bar */}
                    {active && (
                      <div style={{
                        position: 'absolute', left: 0, top: 6, bottom: 6,
                        width: 3, background: 'var(--accent)', borderRadius: 'var(--r-pill)',
                      }} />
                    )}
                    {/* Icon */}
                    <span style={{
                      color: active ? 'var(--accent)' : 'var(--sidebar-muted)',
                      flexShrink: 0, display: 'flex',
                      transition: 'color 0.12s',
                    }}>
                      {item.icon}
                    </span>
                    {/* Label */}
                    {!sidebarCollapsed && (
                      <span style={{
                        fontFamily: 'var(--sans)', fontSize: 13, fontWeight: active ? 600 : 500,
                        color: active ? 'var(--accent)' : 'var(--sidebar-text)',
                        flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        transition: 'color 0.12s',
                      }}>
                        {item.label}
                      </span>
                    )}
                    {/* Badge */}
                    {!sidebarCollapsed && 'badge' in item && item.badge && (
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: 10,
                        color: 'var(--accent)',
                        background: 'var(--accent-light)',
                        borderRadius: 'var(--r-pill)', padding: '1px 6px',
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}

          {/* SO'NGGI SO'ROVLAR block */}
          {!sidebarCollapsed && (
            <>
              <div style={{ height: 1, background: 'var(--hairline)', margin: '18px 0' }} />
              <div style={{
                fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600,
                letterSpacing: '0.11em', textTransform: 'uppercase',
                color: 'var(--ink-3)',
                paddingLeft: 10, marginBottom: 6,
              }}>
                SO'NGGI SO'ROVLAR
              </div>
              {RECENT_QUERIES.map((q, i) => (
                <button
                  key={i}
                  onClick={() => {}}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    width: '100%', height: 32, padding: '0 10px',
                    background: 'transparent', border: 'none',
                    borderRadius: 'var(--r-sm)', cursor: 'pointer',
                    transition: 'background 0.12s',
                    textAlign: 'left',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--canvas)'; (e.currentTarget.querySelector('span.rq') as HTMLElement).style.color = 'var(--ink)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; (e.currentTarget.querySelector('span.rq') as HTMLElement).style.color = 'var(--ink-3)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <circle cx="6" cy="6" r="4.5"/>
                    <path d="M6 3.5V6l2 1.5"/>
                  </svg>
                  <span className="rq" style={{
                    fontFamily: 'var(--sans)', fontSize: 12,
                    color: 'var(--ink-3)',
                    flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    transition: 'color 0.12s',
                  }}>
                    {q}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>

        {/* Zone 3 — Footer */}
        <div style={{ borderTop: '1px solid var(--hairline)', padding: '14px 18px 16px', flexShrink: 0 }}>
          {sidebarCollapsed ? (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round"><path d="M8 2v12M2 8h12"/></svg>
            </div>
          ) : (
            <>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 6 }}>
                INDEKSLANGAN HUJJATLAR
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 22, color: 'var(--ink)', lineHeight: 1, letterSpacing: '0', marginBottom: 10 }}>
                12{' '}428
              </div>
              {/* Progress track */}
              <div style={{ height: 4, background: 'var(--canvas)', borderRadius: 'var(--r-pill)', marginBottom: 6, overflow: 'hidden', border: '1px solid var(--hairline)' }}>
                <div style={{ width: '68%', height: '100%', background: 'var(--brass-soft)', borderRadius: 'var(--r-pill)' }} />
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--ink-3)', marginBottom: 8 }}>
                Indeks hajmi · 68%
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--ink-3)', opacity: 0.7 }}>
                SEMDOC v0.9 · prototip
              </div>
            </>
          )}
        </div>
      </aside>

      {/* ── Main area ───────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>

        {/* Top bar */}
        <header style={{
          height: 52, flexShrink: 0,
          background: 'var(--surface)',
          borderBottom: '1px solid var(--hairline)',
          display: 'flex', alignItems: 'center',
          padding: '0 24px', gap: 12,
        }}>
          {/* Screen label */}
          <span style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500, color: 'var(--ink)', flex: 1 }}>
            {screenLabel}
          </span>
          {/* Keyboard hint */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)',
            padding: '4px 10px',
          }}>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>⌘K</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--ink-3)' }}>Tezkor qidiruv</span>
          </div>
          {/* Yopiq kontur badge */}
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            color: 'var(--ink-2)',
            border: '1px solid var(--hairline)',
            borderRadius: 'var(--r-sm)', padding: '4px 8px',
          }}>
            Yopiq kontur
          </span>
          {/* User block */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 'var(--r-pill)',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600, color: '#fff',
              outline: '1px solid var(--accent-light)', outlineOffset: 1,
            }}>
              A
            </div>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)' }}>Admin</span>
          </div>
        </header>

        {/* Content area */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--canvas)' }}>
          {showAudit && <AuditLog onNav={handleNavKey} />}
          {showAnalytics && <Analytics onNav={handleNavKey} />}
          {showDuplicates && <Duplicates onNav={handleNavKey} />}
          {showClassify && <Classification onNav={handleNavKey} />}
          {showEval && <Evaluation onNav={handleNavKey} />}
          {showUpload && <Upload onNav={handleNavKey} />}
          {showAiChat && <AiChat onBack={() => handleNavKey('search')} onNav={handleNavKey} onOpenDoc={handleOpenDocFromAiChat} />}
          {showDetail && <DocumentDetail onBack={handleDetailBack} onAiChat={() => handleNavKey('ai')} />}

          {showSearch && (
            <div
              style={{ position: 'relative', minHeight: '100%', background: 'var(--canvas)' }}
              onPointerEnter={() => setHovering(true)}
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setHovering(false)}
            >
              <div style={dots} />
              <div style={dotsHover} />
              {/* ── NEW LAYOUT: margin rail + two-pane ── */}
              <div style={{ position: 'relative', zIndex: 1, maxWidth: 1560, margin: '0 auto', padding: '36px 32px 80px' }}>

                {/* Gutter + inner content */}
                <div style={{ position: 'relative' }}>

                  {/* ── Page header ── */}
                  <div style={{ position: 'relative', marginBottom: 32 }}>
                    <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', color: 'var(--ink-3)', textTransform: 'uppercase', margin: '0 0 10px' }}>
                      QIDIRUV
                    </p>
                    <h1 style={{ fontFamily: 'var(--serif)', fontSize: 34, fontWeight: 600, color: 'var(--ink)', margin: '0 0 10px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
                      Semantik qidiruv
                    </h1>
                    <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: '0 0 16px', lineHeight: 1.5, maxWidth: '60ch' }}>
                      Tabiiy tilda savol bering — tizim ma'no bo'yicha mos hujjatlarni topadi.
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', height: 2 }}>
                      <div style={{ width: 64, height: 2, background: 'var(--hairline-strong)', flexShrink: 0 }} />
                      <div style={{ flex: 1, height: 1, background: 'var(--hairline)' }} />
                    </div>
                  </div>

                  {/* ── Sticky search area ── */}
                  <div style={{
                    position: 'sticky', top: 0, zIndex: 10,
                    background: 'var(--canvas)',
                    borderBottom: '1px solid var(--hairline)',
                    padding: '12px 0',
                    marginBottom: 20,
                  }}>
                    {/* Search bar */}
                    <div style={{
                      display: 'flex', alignItems: 'center', height: 52,
                      background: 'var(--surface)', border: '1px solid var(--hairline)',
                      borderRadius: 'var(--r-lg)', padding: '0 8px 0 14px', gap: 10,
                    }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, color: 'var(--ink-3)' }}>
                        <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <input
                        type="text" value={query}
                        onChange={e => setQuery(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        placeholder="Masalan: ko'chat ekish bo'yicha qanday topshiriqlar berilgan?"
                        style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, color: 'var(--ink)', background: 'transparent', fontFamily: 'var(--sans)' }}
                      />
                      <button
                        onClick={handleSearch}
                        style={{
                          height: 36, padding: '0 16px', background: 'var(--navy-700)', color: 'var(--ink-inv)',
                          border: 'none', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 600,
                          fontFamily: 'var(--sans)', cursor: 'pointer', flexShrink: 0, letterSpacing: '0.01em', transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy-600)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--navy-700)')}
                      >
                        Qidirish
                      </button>
                    </div>

                    {/* Chips + segmented control */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 500, letterSpacing: '0.03em' }}>Namuna savollar:</span>
                        {SUGGESTIONS.map(s => (
                          <button key={s} onClick={() => { setQuery(s); setHasSearched(true); setNoResults(false) }}
                            style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-2)', background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-xs)', padding: '3px 9px', cursor: 'pointer', lineHeight: 1.5 }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy-600)'; e.currentTarget.style.color = 'var(--navy-600)' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hairline)'; e.currentTarget.style.color = 'var(--ink-2)' }}
                          >{s}</button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)', padding: 2, gap: 2 }}>
                        {(['semantic', 'keyword'] as SearchMode[]).map(m => {
                          const label = m === 'semantic' ? 'Semantik' : "Kalit so'z"
                          const active = mode === m
                          return (
                            <button key={m} onClick={() => setMode(m)} style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: active ? 600 : 400, color: active ? 'var(--ink-inv)' : 'var(--ink-2)', background: active ? 'var(--navy-700)' : 'transparent', border: 'none', borderRadius: 'var(--r-xs)', padding: '4px 12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* ── Two-pane layout ── */}
                  <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

                    {/* Left pane */}
                    <div style={{ flex: 1, minWidth: 0 }}>

                      {/* Filter row */}
                      <div style={{
                        background: 'var(--surface)', border: '1px solid var(--hairline)',
                        borderRadius: 'var(--r-md)', padding: '12px 16px', marginBottom: 20,
                        display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap',
                      }}>
                        <Select label="Hujjat turi" options={DOC_TYPES} />
                        <Select label="Tashkilot" options={ORGS} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          <label style={{ fontSize: 12, color: 'var(--ink-2)', fontWeight: 500 }}>Sana oralig'i</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <input type="date" style={{ height: 36, background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)', color: 'var(--ink)', fontSize: 12, padding: '0 8px', fontFamily: 'var(--sans)' }} />
                            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>—</span>
                            <input type="date" style={{ height: 36, background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-sm)', color: 'var(--ink)', fontSize: 12, padding: '0 8px', fontFamily: 'var(--sans)' }} />
                          </div>
                        </div>
                        <Select label="Maxfiylik" options={PRIVACY} />
                        <div style={{ flex: 1 }} />
                        <button onClick={handleClearFilters}
                          style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)', background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', alignSelf: 'center' }}
                          onMouseEnter={e => { e.currentTarget.style.color = 'var(--ink)'; e.currentTarget.style.textDecoration = 'underline' }}
                          onMouseLeave={e => { e.currentTarget.style.color = 'var(--ink-2)'; e.currentTarget.style.textDecoration = 'none' }}
                        >
                          Filtrlarni tozalash
                        </button>
                      </div>

                      {/* Results */}
                      {hasSearched && !noResults && (
                        <div>
                          {/* Count line */}
                          <p style={{ fontSize: 12, color: 'var(--ink-2)', margin: '0 0 12px', lineHeight: 1.5 }}>
                            <span style={{ fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--ink)' }}>{results.length}</span>
                            {' '}ta hujjat topildi{' '}
                            <span style={{ color: 'var(--ink-3)' }}>·</span>{' '}
                            <span style={{ fontFamily: 'var(--mono)' }}>{mode === 'semantic' ? '340' : '45'} ms</span>
                            {' '}<span style={{ color: 'var(--ink-3)' }}>·</span>{' '}
                            {mode === 'semantic' ? 'gibrid qidiruv (BM25 + vektor + reranker)' : "kalit so'z bo'yicha qidiruv (BM25)"}
                          </p>

                          {/* Keyword notice */}
                          {mode === 'keyword' && (
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: 'var(--warn-bg)', border: '1px solid var(--warn-border)', borderRadius: 'var(--r-sm)', padding: '10px 14px', marginBottom: 12 }}>
                              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                                <circle cx="7.5" cy="7.5" r="6.5" stroke="var(--warn)" strokeWidth="1.5"/>
                                <path d="M7.5 4.5V8" stroke="var(--warn)" strokeWidth="1.5" strokeLinecap="round"/>
                                <circle cx="7.5" cy="10.5" r="0.75" fill="var(--warn)"/>
                              </svg>
                              <p style={{ fontSize: 13, color: 'var(--warn)', margin: 0, lineHeight: 1.5 }}>
                                Kalit so'z qidiruvi «ko'kalamzorlashtirish» va «daraxt ekish» kabi ma'no jihatidan yaqin iboralarni topmaydi.
                              </p>
                            </div>
                          )}

                          {/* Result cards with gutter indices */}
                          <div className="row-stagger" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {results.map((r, i) => (
                              <div key={i}>
                                <ResultCard
                                  result={r}
                                  selected={selectedCard === i}
                                  onSelect={showPreview ? () => setSelectedCard(i) : undefined}
                                  onTitleClick={!showPreview && i === 0 ? () => setShowDetail(true) : undefined}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Empty state */}
                      {(!hasSearched || noResults) && !query && (
                        <div style={{ textAlign: 'center', padding: '64px 24px', background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 'var(--r-md)' }}>
                          <h2 style={{ fontFamily: 'var(--sans)', fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: '0 0 10px' }}>Hujjat topilmadi</h2>
                          <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: '0 0 20px', lineHeight: 1.6 }}>Savolni boshqacha ifodalab ko'ring yoki filtrlarni kengaytiring.</p>
                          <button
                            onClick={() => { setHasSearched(true); setNoResults(false); setQuery("ko'chat ekish bo'yicha qanday topshiriqlar berilgan?") }}
                            style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, color: 'var(--ink-inv)', background: 'var(--navy-700)', border: 'none', borderRadius: 'var(--r-sm)', padding: '8px 18px', cursor: 'pointer' }}
                          >
                            Filtrlarni tozalash
                          </button>
                        </div>
                      )}
                    </div>

                    {/* ── Right pane: Preview panel ── */}
                    {showPreview && (
                      <div style={{ width: 480, flexShrink: 0, position: 'sticky', top: 0, maxHeight: 'calc(100vh - 52px)', overflowY: 'auto' }}>
                        {selectedCard === null || !hasSearched ? (
                          /* Empty state */
                          <div style={{
                            background: 'var(--surface)', border: '1px solid var(--hairline)',
                            borderRadius: 'var(--r-lg)', padding: '48px 24px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                          }}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 3h8l4 4v10a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1z"/>
                              <path d="M12 3v5h5M7 10h6M7 13h4"/>
                            </svg>
                            <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-2)', textAlign: 'center' }}>
                              Ko'rib chiqish uchun natijani tanlang
                            </span>
                          </div>
                        ) : (() => {
                          const r = results[selectedCard]
                          const pd = RESULT_PREVIEW_DATA[selectedCard] || RESULT_PREVIEW_DATA[0]
                          return (
                            <div style={{
                              background: 'var(--surface)', border: '1px solid var(--hairline)',
                              borderRadius: 'var(--r-lg)', overflow: 'hidden',
                              display: 'flex', flexDirection: 'column',
                            }}>
                              {/* Header */}
                              <div style={{ padding: '14px 16px 12px', borderBottom: '1px solid var(--hairline)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-3)' }}>
                                    KO'RIB CHIQISH
                                  </span>
                                  <button onClick={() => setSelectedCard(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', fontSize: 16, lineHeight: 1, padding: '0 2px' }}
                                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--ink)')}
                                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-3)')}
                                  >×</button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                                  <Badge label={r.docType} />
                                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-2)' }}>№ {r.docNumber}</span>
                                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)' }}>·</span>
                                  <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-2)' }}>{r.date}</span>
                                </div>
                                <p style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: '0 0 6px', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                                  {r.title}
                                </p>
                                <p style={{ fontSize: 12, color: 'var(--ink-2)', margin: 0 }}>{r.org}</p>
                              </div>

                              {/* AI summary */}
                              <div style={{ padding: '16px', borderBottom: '1px solid var(--hairline)' }}>
                                <p style={{ fontFamily: 'var(--mono)', fontSize: 10, fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--ink-3)', margin: '0 0 10px' }}>
                                  AI XULOSA
                                </p>
                                <p style={{ fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>
                                  {pd.summary}
                                  <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--brass)', background: 'var(--brass-bg)', border: '1px solid var(--brass-soft)', borderRadius: 'var(--r-xs)', padding: '1px 5px', marginLeft: 4, display: 'inline-block' }}>
                                    {pd.citLabel}
                                  </span>
                                </p>
                              </div>

                              {/* Attributes */}
                              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--hairline)' }}>
                                {[
                                  { label: "Ijro muddati", value: pd.deadline },
                                  { label: "Mas'ul bo'lim", value: pd.dept },
                                  { label: "Maxfiylik", value: pd.privacy },
                                ].map(attr => (
                                  <div key={attr.label} style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                                    <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)', flexShrink: 0, minWidth: 100 }}>{attr.label}</span>
                                    <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink)', fontWeight: 500 }}>{attr.value}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Action buttons */}
                              <div style={{ padding: '14px 16px', display: 'flex', gap: 10 }}>
                                <button
                                  onClick={() => setShowDetail(true)}
                                  style={{ flex: 1, height: 36, background: 'var(--navy-700)', color: 'var(--ink-inv)', border: 'none', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--sans)', cursor: 'pointer', transition: 'background 0.15s' }}
                                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy-600)')}
                                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--navy-700)')}
                                >
                                  Hujjatni to'liq ochish
                                </button>
                                <button
                                  onClick={() => handleNavKey('ai')}
                                  style={{ flex: 1, height: 36, background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--hairline-strong)', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 500, fontFamily: 'var(--sans)', cursor: 'pointer', transition: 'border-color 0.15s' }}
                                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--navy-600)')}
                                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--hairline-strong)')}
                                >
                                  AI savol berish
                                </button>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* END new layout */}

            </div>
          )}
        </main>
      </div>
    </div>
  )
}
