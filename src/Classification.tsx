import { useState } from 'react'

// ── Helpers ───────────────────────────────────────────────────────────────────

function Mono({ children, size = 12, color = 'var(--ink-2)' }: {
  children: React.ReactNode; size?: number; color?: string
}) {
  return (
    <span style={{ fontFamily: 'var(--mono)', fontSize: size, color, letterSpacing: '0.02em' }}>
      {children}
    </span>
  )
}

function confColor(conf: number) {
  if (conf >= 85) return 'var(--ok)'
  if (conf >= 60) return 'var(--warn)'
  return 'var(--danger)'
}
function confBg(conf: number) {
  if (conf >= 85) return 'var(--ok-bg)'
  if (conf >= 60) return 'var(--warn-bg)'
  return 'var(--danger-bg)'
}
function confBorder(conf: number) {
  if (conf >= 85) return 'var(--ok-border)'
  if (conf >= 60) return 'var(--warn-border)'
  return 'var(--danger-border)'
}

// ── Data ──────────────────────────────────────────────────────────────────────

type CardStatus = 'pending' | 'confirmed' | 'rejected'

interface DocCard {
  id: string
  docNum: string
  uploadDate: string
  confidence: number
  title: string
  suggestedType: string
  topic: string
  department: string
  reason: string
  lowConf?: boolean
}

const INITIAL_CARDS: DocCard[] = [
  {
    id: '1',
    docNum: '112-F',
    uploadDate: '14.03.2025',
    confidence: 94,
    title: '«Yashil makon» loyihasi doirasida ko\'chat ekish tadbirlari to\'g\'risida',
    suggestedType: 'Farmoyish',
    topic: 'Ekologiya · Ko\'kalamzorlashtirish',
    department: 'Ekologiya boshqarmasi',
    reason: 'Hujjatning 1-betidagi «ko\'chat ekish», «ko\'kalamzorlashtirish» iboralari va 44-B raqamli buyruqqa o\'xshashligi (81%) asosida tasnif qilindi.',
  },
  {
    id: '2',
    docNum: '78-R',
    uploadDate: '15.03.2025',
    confidence: 89,
    title: 'Toshkent shahrida raqamli infratuzilmani rivojlantirish rejasi to\'g\'risida',
    suggestedType: 'Qaror',
    topic: 'Raqamli texnologiyalar · Infratuzilma',
    department: 'Raqamli texnologiyalar bo\'limi',
    reason: 'Hujjatning sarlavhasi va 2-betidagi «raqamli infratuzilma», «elektron xizmatlar» iboralari, shuningdek 2024-yilgi 65-son qarorga referans aniqlandi.',
  },
  {
    id: '3',
    docNum: '19-X',
    uploadDate: '16.03.2025',
    confidence: 76,
    title: 'Oliy ta\'lim muassasalarida raqamli kompetensiyalarni oshirish bo\'yicha',
    suggestedType: 'Xat',
    topic: "Oliy ta'lim · Raqamlashtirish",
    department: "Ta'lim va kadrlar bo'limi",
    reason: 'Hujjat «xat» shaklidagi murojaat sifatida aniqlandi, ammo «buyruq» yoki «farmoyish» bilan o\'xshashlik 61% ni tashkil etgani sababli ishonchlilik o\'rtacha.',
  },
  {
    id: '4',
    docNum: '44-B',
    uploadDate: '20.03.2025',
    confidence: 92,
    title: 'Ko\'chat ekish va yashil hududlarni kengaytirish jadvali',
    suggestedType: 'Buyruq',
    topic: 'Ekologiya · Ko\'kalamzorlashtirish',
    department: 'Ekologiya boshqarmasi',
    reason: 'Hujjatda «buyruq», «muddat», «mas\'ul» kalit so\'zlari va ilova sifatida jadval mavjud, 112-F farmoyishi bilan bog\'liqlik 89% ni tashkil etdi.',
  },
  {
    id: '5',
    docNum: '7-Y',
    uploadDate: '05.02.2025',
    confidence: 68,
    title: 'Hududlarda ekologik holatni yaxshilash bo\'yicha yig\'ilish bayoni',
    suggestedType: 'Bayonnoma',
    topic: 'Ekologiya · Yig\'ilish',
    department: 'Ekologiya boshqarmasi',
    reason: '«Yig\'ilish bayoni» tuzilishiga mos, ammo hujjat ichida bir nechta qaror elementi mavjud bo\'lgani uchun «qaror» bilan aralashtirish ehtimoli (34%) bor.',
  },
  {
    id: '6',
    docNum: '31-N',
    uploadDate: '21.03.2025',
    confidence: 87,
    title: 'Kommunal xo\'jalik xizmatlarini ko\'rsatish tartibi to\'g\'risidagi nizom',
    suggestedType: 'Nizom',
    topic: 'Kommunal xo\'jalik · Tartibga solish',
    department: 'Kommunal xizmatlar bo\'limi',
    reason: 'Hujjat «nizom» tuzilishiga to\'liq mos: bo\'limlar, moddalar va ilovalar mavjud. O\'xshash 5 ta nizom bilan yuqori o\'xshashlik (78–91%).',
  },
  {
    id: '7',
    docNum: '??-??',
    uploadDate: '22.03.2025',
    confidence: 48,
    title: 'Nomlanmagan hujjat (128 so\'z)',
    suggestedType: '',
    topic: '',
    department: '',
    reason: 'Hujjat matni juda qisqa (128 so\'z) va aniq atamalar topilmadi. Qo\'lda tasniflash talab etiladi.',
    lowConf: true,
  },
]

// ── Suggestion field ──────────────────────────────────────────────────────────

function SuggestionField({
  label,
  value,
  options,
  onChange,
  placeholder,
  disabled,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase' as const,
        color: 'var(--ink-3)',
      }}>
        {label}
      </span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        style={{
          height: 32,
          background: value === '' ? '#FFF8ED' : 'var(--background)',
          border: `1px solid ${value === '' ? 'var(--warn-border)' : 'var(--hairline)'}`,
          borderRadius: 4,
          color: value === '' ? 'var(--warn)' : 'var(--ink)',
          fontSize: 13,
          fontFamily: 'var(--sans)',
          padding: '0 10px',
          cursor: 'pointer',
          width: '100%',
        }}
      >
        {value === '' && <option value="">Aniqlanmadi</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────

const TYPE_OPTIONS = ['Farmoyish', 'Buyruq', 'Qaror', 'Xat', 'Murojaat', 'Bayonnoma', 'Nizom', 'Hisobot']
const TOPIC_OPTIONS = [
  'Ekologiya · Ko\'kalamzorlashtirish',
  'Raqamli texnologiyalar · Infratuzilma',
  "Oliy ta'lim · Raqamlashtirish",
  'Ekologiya · Yig\'ilish',
  'Kommunal xo\'jalik · Tartibga solish',
  'Iqtisodiyot · Byudjet',
  'Sog\'liqni saqlash',
]
const DEPT_OPTIONS = [
  'Ekologiya boshqarmasi',
  'Raqamli texnologiyalar bo\'limi',
  "Ta'lim va kadrlar bo'limi",
  'Kommunal xizmatlar bo\'limi',
  'Moliya bo\'limi',
  'Huquqiy bo\'lim',
  'Umumiy bo\'lim',
]

function DocCardItem({
  card,
  onConfirm,
  onReject,
}: {
  card: DocCard & { status: CardStatus; type: string; topic: string; dept: string }
  onConfirm: (id: string) => void
  onReject: (id: string) => void
}) {
  const { confidence, status } = card
  const color = confColor(confidence)
  const bg    = confBg(confidence)
  const bdr   = confBorder(confidence)
  const done  = status === 'confirmed' || status === 'rejected'

  return (
    <div style={{
      background: status === 'confirmed' ? '#F9FBF9' : status === 'rejected' ? '#FBF9F9' : 'var(--surface)',
      border: '1px solid var(--hairline)',
      borderRadius: 4,
      padding: 16,
      opacity: done ? 0.72 : 1,
      transition: 'opacity 0.2s',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' as const }}>
        <Mono size={12} color="var(--ink-2)">{card.docNum}</Mono>
        <span style={{ color: 'var(--hairline)', fontSize: 12 }}>·</span>
        <Mono size={12} color="var(--ink-3)">{card.uploadDate}</Mono>

        {status === 'confirmed' && (
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
            color: 'var(--ok)', background: 'var(--ok-bg)',
            border: '1px solid var(--ok-border)', borderRadius: 4,
            padding: '2px 8px', marginLeft: 'auto',
          }}>
            ✓ Tasdiqlangan
          </span>
        )}
        {status === 'rejected' && (
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
            color: 'var(--danger)', background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)', borderRadius: 4,
            padding: '2px 8px', marginLeft: 'auto',
          }}>
            Rad etilgan
          </span>
        )}
        {status === 'pending' && (
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
            color, background: bg, border: `1px solid ${bdr}`,
            borderRadius: 4, padding: '2px 9px', marginLeft: 'auto',
            letterSpacing: '0.02em',
          }}>
            Ishonchlilik {confidence}%
          </span>
        )}
      </div>

      {/* Title */}
      <p style={{
        fontFamily: 'var(--sans)', fontSize: 15, fontWeight: 600,
        color: 'var(--ink)', margin: '0 0 14px', lineHeight: 1.4,
      }}>
        {card.title}
      </p>

      {/* Three-column suggestion grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14,
        marginBottom: 12,
      }}>
        <SuggestionField
          label="Taklif etilgan tur"
          value={card.type}
          options={TYPE_OPTIONS}
          onChange={() => {}}
          placeholder="Aniqlanmadi"
          disabled={done}
        />
        <SuggestionField
          label="Mavzu toifasi"
          value={card.topic}
          options={TOPIC_OPTIONS}
          onChange={() => {}}
          disabled={done}
        />
        <SuggestionField
          label="Mas'ul bo'lim"
          value={card.dept}
          options={DEPT_OPTIONS}
          onChange={() => {}}
          disabled={done}
        />
      </div>

      {/* Reason / explainability line */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 7,
        borderLeft: `2px solid ${card.lowConf ? 'var(--danger)' : 'var(--hairline)'}`,
        paddingLeft: 10, marginBottom: 16,
      }}>
        <p style={{
          fontFamily: 'var(--sans)', fontSize: 12,
          color: card.lowConf ? 'var(--danger)' : 'var(--ink-2)',
          margin: 0, lineHeight: 1.55,
        }}>
          <span style={{ fontWeight: 600 }}>Asos: </span>
          {card.reason}
        </p>
      </div>

      {/* Action row */}
      {!done && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ConfirmButton onClick={() => onConfirm(card.id)} disabled={card.lowConf && card.type === ''} />
          <EditButton />
          <RejectBtn onClick={() => onReject(card.id)} />
        </div>
      )}
      {done && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => {}}
            style={{
              fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)',
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              textDecoration: 'underline', textDecorationColor: 'transparent',
            }}
            onMouseEnter={e => e.currentTarget.style.textDecorationColor = 'var(--ink-2)'}
            onMouseLeave={e => e.currentTarget.style.textDecorationColor = 'transparent'}
          >
            Bekor qilish
          </button>
        </div>
      )}
    </div>
  )
}

function ConfirmButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
        color: 'var(--navy-fg)',
        background: disabled ? '#A0B4CC' : hov ? 'var(--navy-hover)' : 'var(--navy)',
        border: 'none', borderRadius: 4, padding: '0 16px', height: 34,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'background 0.15s',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
        <path d="M2 6.5l3.5 3.5L11 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Tasdiqlash
    </button>
  )
}

function EditButton() {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
        color: 'var(--ink)',
        background: hov ? '#F0F3F7' : 'var(--surface)',
        border: '1px solid var(--hairline)', borderRadius: 4,
        padding: '0 14px', height: 34, cursor: 'pointer',
        transition: 'background 0.12s',
      }}
    >
      Tahrirlash
    </button>
  )
}

function RejectBtn({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 400,
        color: hov ? 'var(--danger)' : 'var(--ink-2)',
        background: 'none', border: 'none', padding: '0 6px', height: 34,
        cursor: 'pointer', transition: 'color 0.12s',
      }}
    >
      Rad etish
    </button>
  )
}

// ── Filter chips ──────────────────────────────────────────────────────────────

type Filter = 'all' | 'low' | 'confirmed'

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: 'var(--sans)', fontSize: 12, fontWeight: active ? 600 : 400,
        color: active ? 'var(--navy)' : 'var(--ink-2)',
        background: active ? '#EEF3FA' : 'var(--surface)',
        border: `1px solid ${active ? '#C8D8EA' : 'var(--hairline)'}`,
        borderRadius: 4, padding: '5px 14px',
        cursor: 'pointer', transition: 'background 0.12s, color 0.12s',
      }}
    >
      {label}
    </button>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function Classification({ onNav }: { onNav?: (s: string) => void }) {
  const [filter, setFilter] = useState<Filter>('all')

  const [cards, setCards] = useState(
    INITIAL_CARDS.map(c => ({
      ...c,
      status: 'pending' as CardStatus,
      type:  c.suggestedType,
      topic: c.topic,
      dept:  c.department,
    }))
  )

  const confirm = (id: string) =>
    setCards(cs => cs.map(c => c.id === id ? { ...c, status: 'confirmed' } : c))

  const reject = (id: string) =>
    setCards(cs => cs.map(c => c.id === id ? { ...c, status: 'rejected' } : c))

  const confirmAll = () =>
    setCards(cs => cs.map(c =>
      c.status === 'pending' && c.confidence >= 85 && !c.lowConf
        ? { ...c, status: 'confirmed' }
        : c
    ))

  const confirmedCount = cards.filter(c => c.status === 'confirmed').length
  const lowConfCount   = cards.filter(c => c.confidence < 60 || (c.confidence < 85 && c.status === 'pending')).length

  const filtered = cards.filter(c => {
    if (filter === 'all') return c.status !== 'confirmed'
    if (filter === 'low') return c.confidence < 85 && c.status === 'pending'
    if (filter === 'confirmed') return c.status === 'confirmed'
    return true
  })

  return (
    <div style={{ background: 'var(--canvas)' }}>
      <div style={{ padding: '28px 32px 48px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.10em',
            color: 'var(--ink-3)', textTransform: 'uppercase', margin: '0 0 8px',
          }}>
            HUJJATLAR
          </p>
          <h1 style={{
            fontFamily: 'var(--sans)', fontSize: 28, fontWeight: 700,
            color: 'var(--ink)', margin: '0 0 8px', lineHeight: 1.2,
          }}>
            Tasniflash navbati
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
            Tizim hujjat turini va mas'ul bo'limni taklif qiladi. Yakuniy qaror xodim tomonidan tasdiqlanadi.
          </p>
        </div>

        {/* Toolbar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' as const,
          background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 4,
          padding: '10px 16px',
        }}>
          <FilterChip
            label={`Barchasi (${cards.filter(c => c.status !== 'confirmed').length})`}
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          />
          <FilterChip
            label={`Past ishonchlilik (${lowConfCount})`}
            active={filter === 'low'}
            onClick={() => setFilter('low')}
          />
          <FilterChip
            label={`Tasdiqlangan (${confirmedCount + 128})`}
            active={filter === 'confirmed'}
            onClick={() => setFilter('confirmed')}
          />

          <div style={{ flex: 1 }} />

          <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)' }}>
            Ishonchliligi 85% dan yuqori hujjatlar uchun
          </span>
          <button
            onClick={confirmAll}
            style={{
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              color: 'var(--navy)', background: 'none',
              border: '1px solid #C8D8EA', borderRadius: 4,
              padding: '5px 14px', cursor: 'pointer',
              transition: 'background 0.12s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#EEF3FA'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            Barchasini tasdiqlash
          </button>
        </div>

        {/* Card list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length === 0 ? (
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--hairline)',
              borderRadius: 4, padding: '48px 24px', textAlign: 'center',
            }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)', margin: '0 0 8px' }}>
                {filter === 'confirmed' ? 'Tasdiqlangan hujjatlar yo\'q' : 'Navbatda hujjat yo\'q'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--ink-2)', margin: 0 }}>
                {filter === 'confirmed' ? 'Hali biror hujjat tasdiqlanmadi.' : 'Barcha hujjatlar tasniflangan.'}
              </p>
            </div>
          ) : (
            filtered.map(card => (
              <DocCardItem
                key={card.id}
                card={card}
                onConfirm={confirm}
                onReject={reject}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
