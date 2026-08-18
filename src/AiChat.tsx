import { useState, useRef, useEffect, CSSProperties } from 'react'

// ── Shared primitives ─────────────────────────────────────────────────────────

function Mono({ children, size = 12, color = 'var(--ink-2)' }: {
  children: React.ReactNode; size?: number; color?: string
}) {
  return (
    <span style={{ fontFamily: 'var(--mono)', fontSize: size, color, letterSpacing: '0.02em' }}>
      {children}
    </span>
  )
}

function DocBadge({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
      letterSpacing: '0.07em', textTransform: 'uppercase' as const,
      color: 'var(--ink-2)', background: 'var(--badge-bg)',
      border: '1px solid var(--hairline)', borderRadius: 4,
      padding: '2px 7px', lineHeight: 1.5, whiteSpace: 'nowrap' as const,
    }}>
      {children}
    </span>
  )
}

// ── Citation chip with popover ────────────────────────────────────────────────

interface CitationProps {
  label: string
  quote: string
  docTitle: string
}

function CitationChip({ label, quote, docTitle }: CitationProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpen(true)
  }
  const hide = () => {
    timerRef.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <span
      ref={ref}
      style={{ position: 'relative', display: 'inline' }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <span style={{
        fontFamily: 'var(--mono)', fontSize: 10,
        color: 'var(--link)', background: '#EEF3FA',
        border: '1px solid #C8D8EA', borderRadius: 3,
        padding: '1px 5px', cursor: 'pointer',
        display: 'inline-block', lineHeight: 1.4,
        marginLeft: 3, verticalAlign: 'baseline',
        transition: 'background 0.12s',
      }}>
        {label}
      </span>
      {open && (
        <span style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 4, padding: '10px 12px', width: 280, zIndex: 100,
          boxShadow: '0 4px 16px rgba(10,29,58,0.12)',
          pointerEvents: 'auto',
        }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <span style={{
            display: 'block',
            fontFamily: 'var(--serif)', fontSize: 13, color: 'var(--ink)',
            lineHeight: 1.6, marginBottom: 8, fontStyle: 'italic',
          }}>
            "{quote}"
          </span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)' }}>
            {docTitle}
          </span>
          {/* Arrow */}
          <span style={{
            position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
            width: 8, height: 8, background: 'var(--surface)',
            borderRight: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)',
          }} />
        </span>
      )}
    </span>
  )
}

// ── Source row ────────────────────────────────────────────────────────────────

interface SourceRow {
  relVar: string
  rel: number
  type: string
  num: string
  title: string
  page: string
}

function SourceItem({ src, index, onOpenDoc }: { src: SourceRow; index: number; onOpenDoc?: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpenDoc}
      tabIndex={onOpenDoc ? 0 : undefined}
      onKeyDown={onOpenDoc ? (e) => (e.key === 'Enter' || e.key === ' ') && onOpenDoc() : undefined}
      style={{
        display: 'flex', alignItems: 'center', overflow: 'hidden',
        borderRadius: 3, cursor: onOpenDoc ? 'pointer' : 'default',
        background: hovered ? '#F4F7FB' : 'transparent',
        transition: 'background 0.12s',
      }}
    >
      <div style={{ width: 4, height: 32, flexShrink: 0, background: src.relVar, borderRadius: '2px 0 0 2px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', flex: 1, minWidth: 0 }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)', flexShrink: 0 }}>
          {index + 1}.
        </span>
        <DocBadge>{src.type}</DocBadge>
        <Mono size={11} color="var(--ink-2)">{src.num}</Mono>
        <span style={{
          fontSize: 13, color: hovered ? 'var(--navy)' : 'var(--ink)',
          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
          transition: 'color 0.12s',
        }}>
          {src.title}
        </span>
        <Mono size={11} color="var(--ink-3)">{src.page}</Mono>
      </div>
    </div>
  )
}

// ── Question block ────────────────────────────────────────────────────────────

function QuestionBlock({ question, timestamp }: { question: string; timestamp: string }) {
  return (
    <div style={{ display: 'flex', gap: 12, marginBottom: 6 }}>
      <div style={{ width: 2, flexShrink: 0, background: 'var(--navy)', borderRadius: 1, alignSelf: 'stretch' }} />
      <div style={{ flex: 1, paddingLeft: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.08em', color: 'var(--ink-3)',
          }}>
            SAVOL
          </span>
          <Mono size={11} color="var(--ink-3)">{timestamp}</Mono>
        </div>
        <p style={{
          fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 500,
          color: 'var(--ink)', margin: 0, lineHeight: 1.55,
        }}>
          {question}
        </p>
      </div>
    </div>
  )
}

// ── Answer block — confident ──────────────────────────────────────────────────

const SOURCES_1: SourceRow[] = [
  { relVar: 'var(--rel-90)', rel: 92, type: 'FARMOYISH', num: 'D-003', title: '«Yashil makon» loyihasi doirasida ko\'chat ekish tadbirlari to\'g\'risida', page: '2–3-bet' },
  { relVar: 'var(--rel-70)', rel: 78, type: 'BUYRUQ', num: 'D-010', title: 'Ko\'chat ekish va yashil hududlarni kengaytirish mintaqaviy jadvali', page: '1-bet' },
  { relVar: 'var(--rel-50)', rel: 61, type: 'BAYONNOMA', num: 'D-007', title: 'Hududlarda ekologik holatni yaxshilash bo\'yicha yig\'ilish bayoni', page: '2-bet' },
  { relVar: 'var(--rel-50)', rel: 54, type: 'BUYRUQ', num: 'D-011', title: 'Toshkent viloyatida ko\'kalamzorlashtirish bo\'yicha qo\'shimcha tadbirlar', page: '1-bet' },
]

interface SentencePart {
  text: string
  citation?: CitationProps
}

const ANSWER_SENTENCES: SentencePart[] = [
  {
    text: 'Tuman hokimliklari har bir mahallada kamida 200 tup manzarali daraxt ko\'chatini ekishni ta\'minlashi shart',
    citation: {
      label: 'D-003 · 2-bet',
      quote: 'Tuman hokimliklari 2025-yil 1-apreldan 15-maygacha har bir mahallada kamida 200 tup manzarali daraxt ko\'chatini ekishni ta\'minlasin.',
      docTitle: '«Yashil makon» loyihasi doirasida ko\'chat ekish tadbirlari to\'g\'risida',
    },
  },
  {
    text: 'Ushbu topshiriqni bajarish muddati 2025-yil 1-apreldan 15-maygacha belgilangan',
    citation: {
      label: 'D-003 · 2-bet',
      quote: 'Tuman hokimliklari 2025-yil 1-apreldan 15-maygacha har bir mahallada kamida 200 tup manzarali daraxt ko\'chatini ekishni ta\'minlasin.',
      docTitle: '«Yashil makon» loyihasi doirasida ko\'chat ekish tadbirlari to\'g\'risida',
    },
  },
  {
    text: 'Ko\'chatlarni yetkazib berish majburiyati Ekologiya boshqarmasiga yuklatilgan va bu 1-aprelga qadar amalga oshirilishi lozim',
    citation: {
      label: 'D-003 · 3-bet',
      quote: 'Ekologiya boshqarmasiga ko\'chatlarni o\'z vaqtida yetkazib berish va ularning sifat ko\'rsatkichlarini nazorat qilish vazifasi yuklatilsin.',
      docTitle: '«Yashil makon» loyihasi doirasida ko\'chat ekish tadbirlari to\'g\'risida',
    },
  },
  {
    text: 'Alohida vazirlik buyrug\'i viloyatlar kesimida ish jadvalini belgilab, hisobotlarni har oyning 5-kuniga qadar taqdim etishni talab qiladi',
    citation: {
      label: 'D-010 · 1-bet',
      quote: 'Ilova qilingan jadval asosida viloyatlar kesimida ko\'kalamzorlashtirish ishlari bosqichma-bosqich amalga oshiriladi, hisobot har oyning 5-kuniga qadar taqdim etiladi.',
      docTitle: 'Ko\'chat ekish va yashil hududlarni kengaytirish mintaqaviy jadvali',
    },
  },
  {
    text: 'Fevral oyidagi yig\'ilish bayonida ekish mavsumiга tayyorgarlik va tegishli ko\'rsatmalar muhokama qilingan',
    citation: {
      label: 'D-007 · 2-bet',
      quote: 'Yig\'ilishda daraxt ekish mavsumiga tayyorgarlik, ko\'chatzorlar bilan ta\'minlanish masalasi ko\'rib chiqildi va tegishli topshiriqlar berildi.',
      docTitle: 'Hududlarda ekologik holatni yaxshilash bo\'yicha yig\'ilish bayoni',
    },
  },
]

function AnswerBlockConfident({ onOpenDoc }: { onOpenDoc?: () => void }) {
  return (
    <div style={{ marginBottom: 6 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', color: 'var(--ink-3)',
        }}>
          JAVOB
        </span>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500,
          color: 'var(--ink-2)', border: '1px solid var(--hairline)',
          borderRadius: 4, padding: '2px 9px',
        }}>
          4 manbaga asoslangan
        </span>
      </div>

      {/* Answer body */}
      <p style={{
        fontFamily: 'var(--serif)', fontSize: 15, lineHeight: 1.75,
        color: 'var(--ink)', margin: '0 0 4px',
      }}>
        {ANSWER_SENTENCES.map((s, i) => (
          <span key={i}>
            {s.text}
            {s.citation && <CitationChip {...s.citation} />}
            {i < ANSWER_SENTENCES.length - 1 ? '. ' : '.'}
          </span>
        ))}
      </p>

      {/* Caveat */}
      <p style={{
        fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-2)',
        margin: '10px 0 20px', lineHeight: 1.55,
      }}>
        Javob 12 428 hujjatdan tanlangan 4 ta manbaga asoslangan. Yuridik kuchga ega hujjat sifatida asl nusxani tekshirish tavsiya etiladi.
      </p>

      {/* Sources */}
      <div style={{ marginBottom: 18 }}>
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', color: 'var(--ink-3)',
          marginBottom: 8,
        }}>
          MANBALAR
        </div>
        <div style={{
          border: '1px solid var(--hairline)', borderRadius: 4,
          background: 'var(--surface)', overflow: 'hidden',
        }}>
          {SOURCES_1.map((src, i) => (
            <div key={i} style={{ borderBottom: i < SOURCES_1.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
              <SourceItem src={src} index={i} onOpenDoc={onOpenDoc} />
            </div>
          ))}
        </div>
      </div>

      {/* Action row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
        {['Javobni nusxalash', 'Hisobotga qo\'shish'].map(label => (
          <ActionBtn key={label}>{label}</ActionBtn>
        ))}
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)' }}>
          Javob foydali bo'ldimi?
        </span>
        <ThumbBtn up />
        <ThumbBtn up={false} />
      </div>
    </div>
  )
}

function ActionBtn({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500,
        color: hovered ? 'var(--navy)' : 'var(--ink-2)',
        background: hovered ? '#EEF3FA' : 'var(--surface)',
        border: '1px solid var(--hairline)', borderRadius: 4,
        padding: '5px 12px', cursor: 'pointer',
        transition: 'color 0.12s, background 0.12s',
      }}
    >
      {children}
    </button>
  )
}

function ThumbBtn({ up }: { up: boolean }) {
  const [active, setActive] = useState(false)
  return (
    <button
      onClick={() => setActive(v => !v)}
      style={{
        width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? (up ? 'var(--ok-bg)' : 'var(--danger-bg)') : 'var(--surface)',
        border: `1px solid ${active ? (up ? 'var(--ok-border)' : 'var(--danger-border)') : 'var(--hairline)'}`,
        borderRadius: 4, cursor: 'pointer', transition: 'background 0.15s, border-color 0.15s',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
        style={{ transform: up ? 'none' : 'rotate(180deg)', color: active ? (up ? 'var(--ok)' : 'var(--danger)') : 'var(--ink-3)' }}>
        <path d="M2 6h2v6H2zM5 6l2-5a2 2 0 012 2v1h3l-1 6H6a1 1 0 01-1-1V6z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}

// ── Answer block — no confident answer ───────────────────────────────────────

const LOW_REL_SOURCES: SourceRow[] = [
  { relVar: 'var(--rel-50)', rel: 34, type: 'HISOBOT', num: 'D-044', title: '2025-yil davlat byudjeti ijrosi to\'g\'risidagi yillik hisobot', page: '5-bet' },
  { relVar: 'var(--rel-50)', rel: 28, type: 'QAROR', num: 'D-021', title: 'O\'rta muddatli byudjet rejasini tasdiqlash to\'g\'risida', page: '2-bet' },
]

function AnswerBlockUncertain() {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', color: 'var(--ink-3)',
        }}>
          JAVOB
        </span>
      </div>

      {/* Warning notice */}
      <div style={{
        borderLeft: '2px solid var(--warn)', paddingLeft: 14,
        background: 'var(--warn-bg)', borderRadius: '0 4px 4px 0',
        padding: '12px 16px 12px 14px', marginBottom: 16,
      }}>
        <p style={{
          fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500,
          color: 'var(--warn)', margin: '0 0 6px', lineHeight: 1.5,
        }}>
          Ishonchli javob berish uchun yetarli manba topilmadi.
        </p>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>
          Indeksda bu mavzu bo'yicha 2027-yilga tegishli hujjat mavjud emas.
        </p>
      </div>

      {/* Low-relevance sources */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)', marginBottom: 8 }}>
          Eng yaqin topilgan hujjatlar:
        </div>
        <div style={{ border: '1px solid var(--hairline)', borderRadius: 4, background: 'var(--surface)', overflow: 'hidden' }}>
          {LOW_REL_SOURCES.map((src, i) => (
            <div key={i} style={{ borderBottom: i < LOW_REL_SOURCES.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <div style={{ width: 4, height: 32, flexShrink: 0, background: src.relVar, borderRadius: '2px 0 0 2px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', flex: 1 }}>
                  <Mono size={11} color="var(--ink-3)">{src.rel}%</Mono>
                  <DocBadge>{src.type}</DocBadge>
                  <Mono size={11} color="var(--ink-2)">{src.num}</Mono>
                  <span style={{ fontSize: 13, color: 'var(--ink-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                    {src.title}
                  </span>
                  <Mono size={11} color="var(--ink-3)">{src.page}</Mono>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)' }}>
          Javob foydali bo'ldimi?
        </span>
        <ThumbBtn up />
        <ThumbBtn up={false} />
      </div>
    </div>
  )
}

// ── Exchange divider ──────────────────────────────────────────────────────────

function ExchangeDivider() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--hairline)' }} />
    </div>
  )
}

// ── Right column ──────────────────────────────────────────────────────────────

const HISTORY = [
  { time: '09:41', q: "Ko'chat ekish bo'yicha qanday topshiriqlar berilgan?" },
  { time: '09:37', q: 'Ekologiya vazirligi 2025-yildagi asosiy faoliyati' },
  { time: '09:22', q: 'Elektron hujjat aylanishiga tegishli qarorlar' },
  { time: 'kecha', q: "Yo'l yoritilishi bo'yicha murojaatlar holati" },
  { time: 'kecha', q: 'Oliy ta\'lim raqamlashtirish rejalari' },
]

const RAG_STEPS = [
  "Savol vektorga aylantiriladi",
  "Gibrid qidiruv 12 428 hujjat ichidan eng mos qismlarni tanlaydi",
  "Reranker natijalarni qayta tartiblaydi",
  "Model faqat topilgan qismlar asosida javob shakllantiradi",
]

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 4, overflow: 'hidden' }}>
      <div style={{
        padding: '10px 16px', borderBottom: '1px solid var(--hairline)',
        fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--ink-3)',
      }}>
        {title}
      </div>
      <div style={{ padding: '12px 16px' }}>{children}</div>
    </div>
  )
}

function RightColumn() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <SideCard title="So'rov tarixi">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {HISTORY.map((h, i) => (
            <button
              key={i}
              style={{
                display: 'flex', alignItems: 'baseline', gap: 8,
                background: i === 0 ? '#F0F5FB' : 'none',
                border: 'none', borderRadius: 3,
                padding: '7px 8px', cursor: 'pointer', textAlign: 'left' as const, width: '100%',
              }}
              onMouseEnter={e => { if (i !== 0) e.currentTarget.style.background = '#F7F9FB' }}
              onMouseLeave={e => { if (i !== 0) e.currentTarget.style.background = 'none' }}
            >
              <Mono size={10} color="var(--ink-3)">{h.time}</Mono>
              <span style={{
                fontSize: 12, color: i === 0 ? 'var(--navy)' : 'var(--ink-2)',
                lineHeight: 1.4, overflow: 'hidden',
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
              }}>
                {h.q}
              </span>
            </button>
          ))}
        </div>
      </SideCard>

      <SideCard title="Qanday ishlaydi">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {RAG_STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 10 }}>
              <Mono size={12} color="var(--ink-3)">{i + 1}.</Mono>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.55 }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </SideCard>
    </div>
  )
}

// ── Input area ────────────────────────────────────────────────────────────────

function ToggleChip({
  label, active, disabled, tooltip,
}: {
  label: string; active: boolean; disabled?: boolean; tooltip?: string
}) {
  const [on, setOn] = useState(active)
  const [showTip, setShowTip] = useState(false)
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => !disabled && setOn(v => !v)}
        onMouseEnter={() => disabled && setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
        style={{
          fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 500,
          color: on ? 'var(--navy)' : 'var(--ink-2)',
          background: on ? '#EEF3FA' : 'var(--surface)',
          border: `1px solid ${on ? '#C8D8EA' : 'var(--hairline)'}`,
          borderRadius: 4, padding: '4px 10px', cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.75 : 1, transition: 'background 0.12s, color 0.12s',
        }}
      >
        {label}
      </button>
      {showTip && tooltip && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--ink)', color: '#fff',
          fontFamily: 'var(--sans)', fontSize: 11,
          padding: '5px 9px', borderRadius: 4, whiteSpace: 'nowrap' as const, zIndex: 200,
          pointerEvents: 'none',
        }}>
          {tooltip}
        </div>
      )}
    </div>
  )
}

function InputArea() {
  const [text, setText] = useState('')

  return (
    <div style={{
      borderTop: '1px solid var(--hairline)', background: 'var(--surface)',
      padding: '16px 20px 14px',
    }}>
      <div style={{ position: 'relative' }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Savolingizni yozing…"
          rows={3}
          style={{
            width: '100%', height: 72, resize: 'none',
            fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink)',
            background: 'var(--background)', border: '1px solid var(--hairline)',
            borderRadius: 4, padding: '10px 14px',
            outline: 'none', lineHeight: 1.55,
            boxSizing: 'border-box',
          }}
          onFocus={e => (e.currentTarget.style.borderColor = 'var(--navy)')}
          onBlur={e => (e.currentTarget.style.borderColor = 'var(--hairline)')}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' as const }}>
        <ToggleChip label="Faqat ochiq hujjatlar" active={true} />
        <ToggleChip label="So'nggi 12 oy" active={false} />
        <ToggleChip
          label="Manba ko'rsatish"
          active={true}
          disabled
          tooltip="Bu parametr o'chirilmaydi"
        />
        <div style={{ flex: 1 }} />
        <button
          style={{
            fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
            color: 'var(--navy-fg)', background: 'var(--navy)',
            border: 'none', borderRadius: 4, padding: '0 18px', height: 36,
            cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--navy)')}
        >
          Yuborish
        </button>
      </div>
      <p style={{
        fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)',
        margin: '8px 0 0', lineHeight: 1.4,
      }}>
        Model: lokal · ma'lumotlar yopiq konturdan chiqmaydi.
      </p>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function AiChat({ onBack, onNav, onOpenDoc }: { onBack?: () => void; onNav?: (s: string) => void; onOpenDoc?: () => void } = {}) {
  const transcriptRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [])

  const columnStyle: CSSProperties = {
    display: 'flex', flexDirection: 'column',
    background: 'var(--surface)',
    border: '1px solid var(--hairline)', borderRadius: 4,
    overflow: 'hidden',
    minHeight: 0,
  }

  return (
    <div style={{ background: 'var(--canvas)' }}>
      <div style={{ padding: '28px 32px 48px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.10em',
            color: 'var(--ink-3)', textTransform: 'uppercase', margin: '0 0 8px',
          }}>
            QIDIRUV
          </p>
          <h1 style={{
            fontFamily: 'var(--sans)', fontSize: 28, fontWeight: 700,
            color: 'var(--ink)', margin: '0 0 8px', lineHeight: 1.2,
          }}>
            AI savol-javob
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
            Hujjat massivi bo'yicha savol bering. Har bir javob manbaga havola bilan beriladi.
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>

          {/* Main conversation column */}
          <div style={{ ...columnStyle }}>
            {/* Transcript */}
            <div
              ref={transcriptRef}
              style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 8px' }}
            >
              {/* Exchange 1 */}
              <QuestionBlock
                question="Ko'chat ekish bo'yicha qanday topshiriqlar berilgan va muddatlari qanday?"
                timestamp="09:41"
              />
              <div style={{ height: 16 }} />
              <AnswerBlockConfident onOpenDoc={onOpenDoc} />

              <ExchangeDivider />

              {/* Exchange 2 */}
              <QuestionBlock
                question="2027-yilgi byudjet taqsimoti qanday?"
                timestamp="09:44"
              />
              <div style={{ height: 16 }} />
              <AnswerBlockUncertain />

              <div style={{ height: 16 }} />
            </div>

            {/* Input */}
            <InputArea />
          </div>

          {/* Right column */}
          <div style={{ position: 'sticky', top: 24 }}>
            <RightColumn />
          </div>
        </div>
      </div>
    </div>
  )
}
