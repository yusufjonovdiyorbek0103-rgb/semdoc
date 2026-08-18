import {
  AreaChart, Area,
  BarChart, Bar, Cell, LabelList,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

// ── Blue density palette ──────────────────────────────────────────────────────

const B90 = '#1A3A6B'  // navy
const B70 = '#2E6099'
const B50 = '#5A8DBF'
const B30 = '#C4D8EC'

// fill tones for stacked areas (flat, no gradient)
const AREA_QAROR    = '#1A3A6B'
const AREA_BUYRUQ   = '#5A8DBF'
const AREA_MUROJAAT = '#B8D0E8'

const AXIS_TICK = { fontFamily: 'var(--mono)', fontSize: 10, fill: '#9BAAB8' }

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

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 4, overflow: 'hidden', ...style,
    }}>
      {children}
    </div>
  )
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '13px 18px', borderBottom: '1px solid var(--hairline)',
      fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
      letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: 'var(--ink-3)',
    }}>
      {children}
    </div>
  )
}

// ── Row 1 — stat cards ────────────────────────────────────────────────────────

const STATS = [
  {
    label: 'Indekslangan hujjatlar',
    value: '12 428',
    delta: '+1 204',
    deltaColor: 'var(--ok)',
    up: true,
  },
  {
    label: "Oylik qidiruv so'rovlari",
    value: '3 862',
    delta: '+18%',
    deltaColor: 'var(--ok)',
    up: true,
  },
  {
    label: "O'rtacha javob vaqti",
    value: '340 ms',
    delta: '−12%',
    deltaColor: 'var(--ok)',
    up: false,
    downGood: true,
  },
  {
    label: "Muddati o'tgan topshiriqlar",
    value: '27',
    delta: '+3',
    deltaColor: 'var(--danger)',
    up: true,
    bad: true,
  },
]

function StatCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      {STATS.map((s, i) => (
        <div key={i} style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 4, padding: 16,
        }}>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.09em', textTransform: 'uppercase' as const,
            color: 'var(--ink-3)', margin: '0 0 8px',
          }}>
            {s.label}
          </p>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 26, color: 'var(--ink)', margin: '0 0 8px', lineHeight: 1 }}>
            {s.value}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path
                d={s.up && !s.bad
                  ? 'M5 8V2M2 5l3-3 3 3'
                  : s.bad
                  ? 'M5 2v6M2 5l3 3 3-3'
                  : 'M5 8V2M2 5l3-3 3 3'}
                stroke={s.deltaColor}
                strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: s.deltaColor }}>
              {s.delta}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Row 2 — stacked area chart ────────────────────────────────────────────────

const MONTHS = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyn', 'Iyl', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek']

const FLOW_DATA = [
  { m: 'Yan', qaror: 82,  buyruq: 54, murojaat: 143 },
  { m: 'Fev', qaror: 94,  buyruq: 61, murojaat: 118 },
  { m: 'Mar', qaror: 110, buyruq: 78, murojaat: 162 },
  { m: 'Apr', qaror: 103, buyruq: 69, murojaat: 175 },
  { m: 'May', qaror: 126, buyruq: 88, murojaat: 198 },
  { m: 'Iyn', qaror: 118, buyruq: 73, murojaat: 154 },
  { m: 'Iyl', qaror: 99,  buyruq: 65, murojaat: 141 },
  { m: 'Avg', qaror: 87,  buyruq: 58, murojaat: 136 },
  { m: 'Sen', qaror: 114, buyruq: 81, murojaat: 168 },
  { m: 'Okt', qaror: 131, buyruq: 94, murojaat: 187 },
  { m: 'Noy', qaror: 142, buyruq: 102, murojaat: 204 },
  { m: 'Dek', qaror: 138, buyruq: 96, murojaat: 196 },
]

const FLOW_LEGEND = [
  { key: 'qaror',    label: 'Qarorlar',    color: AREA_QAROR },
  { key: 'buyruq',   label: 'Buyruqlar',   color: AREA_BUYRUQ },
  { key: 'murojaat', label: 'Murojaatlar', color: AREA_MUROJAAT },
]

function FlowChart() {
  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 18px', borderBottom: '1px solid var(--hairline)' }}>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: 'var(--ink-3)',
        }}>
          Hujjat oqimi dinamikasi
        </span>
        <div style={{ display: 'flex', gap: 16 }}>
          {FLOW_LEGEND.map(l => (
            <div key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
              <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-2)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '20px 18px 14px' }}>
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={FLOW_DATA} margin={{ top: 4, right: 10, bottom: 0, left: -10 }}>
            <CartesianGrid stroke="var(--hairline)" vertical={false} strokeDasharray="" />
            <XAxis dataKey="m" tickLine={false} axisLine={false} tick={AXIS_TICK} />
            <YAxis tickLine={false} axisLine={false} tick={AXIS_TICK} width={30} />
            <Tooltip
              contentStyle={{
                fontFamily: 'var(--mono)', fontSize: 11,
                background: 'var(--surface)', border: '1px solid var(--hairline)',
                borderRadius: 4, boxShadow: '0 2px 8px rgba(10,29,58,0.1)',
              }}
            />
            {/* Stack from lightest to darkest so darker series visually dominates top */}
            <Area type="monotone" dataKey="murojaat" stackId="1"
              stroke={AREA_MUROJAAT} strokeWidth={1.5}
              fill={AREA_MUROJAAT} fillOpacity={0.55} />
            <Area type="monotone" dataKey="buyruq" stackId="1"
              stroke={AREA_BUYRUQ} strokeWidth={1.5}
              fill={AREA_BUYRUQ} fillOpacity={0.65} />
            <Area type="monotone" dataKey="qaror" stackId="1"
              stroke={AREA_QAROR} strokeWidth={1.5}
              fill={AREA_QAROR} fillOpacity={0.8} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── Row 3A — org bar chart ────────────────────────────────────────────────────

const ORG_DATA = [
  { org: 'Vazirlar Mahkamasi',           val: 2840 },
  { org: 'Toshkent shahar hokimligi',    val: 2210 },
  { org: 'Ekologiya vazirligi',          val: 1680 },
  { org: "Oliy ta'lim vazirligi",        val: 1420 },
  { org: 'Raqamli texnologiyalar vaz.',  val: 1190 },
  { org: 'Moliya vazirligi',             val: 980  },
]

function OrgBarLabel({ x = 0, y = 0, width = 0, height = 0, value }: {
  x?: number; y?: number; width?: number; height?: number; value?: number | string
}) {
  return (
    <text x={x + width + 6} y={y + height / 2 + 4}
      style={{ fontFamily: 'var(--mono)', fontSize: 10, fill: 'var(--ink-2)' }}>
      {Number(value).toLocaleString('uz')}
    </text>
  )
}

function OrgChart() {
  return (
    <Card>
      <CardHeader>Tashkilotlar kesimida</CardHeader>
      <div style={{ padding: '14px 18px 12px' }}>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={ORG_DATA} layout="vertical"
            margin={{ top: 0, right: 60, bottom: 0, left: 0 }} barSize={14} barCategoryGap={10}>
            <CartesianGrid stroke="var(--hairline)" horizontal={false} strokeDasharray="" />
            <XAxis type="number" tickLine={false} axisLine={false} tick={AXIS_TICK} tickCount={5} />
            <YAxis type="category" dataKey="org" tickLine={false} axisLine={false}
              tick={{ fontFamily: 'var(--sans)', fontSize: 11, fill: 'var(--ink-2)' }} width={160} />
            <Tooltip
              contentStyle={{
                fontFamily: 'var(--mono)', fontSize: 11,
                background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 4,
              }}
            />
            <Bar dataKey="val" radius={2}>
              {ORG_DATA.map((_, i) => (
                <Cell key={i} fill={[B90, B70, B50, B70, B50, B30][i]} />
              ))}
              <LabelList content={<OrgBarLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

// ── Row 3B — topic ranked list ────────────────────────────────────────────────

const TOPICS = [
  { label: 'Ekologiya',         pct: 22 },
  { label: 'Raqamlashtirish',   pct: 19 },
  { label: "Ta'lim",            pct: 16 },
  { label: 'Infratuzilma',      pct: 14 },
  { label: 'Ijtimoiy soha',     pct: 12 },
  { label: 'Byudjet',           pct: 9  },
  { label: 'Boshqa',            pct: 8  },
]

function barColor(i: number) {
  const cols = [B90, B70, B70, B50, B50, B30, B30]
  return cols[i] ?? B30
}

function TopicList() {
  return (
    <Card>
      <CardHeader>Mavzu toifalari</CardHeader>
      <div style={{ padding: '8px 0' }}>
        {TOPICS.map((t, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 18px',
            borderBottom: i < TOPICS.length - 1 ? '1px solid var(--hairline)' : 'none',
          }}>
            <div style={{ width: 4, height: 28, background: barColor(i), borderRadius: 2, flexShrink: 0 }} />
            <span style={{ flex: 1, fontSize: 13, color: 'var(--ink)', lineHeight: 1.3 }}>{t.label}</span>
            <div style={{ width: 70, height: 3, background: 'var(--hairline)', borderRadius: 2, flexShrink: 0 }}>
              <div style={{ width: `${(t.pct / 22) * 100}%`, height: '100%', background: barColor(i), borderRadius: 2 }} />
            </div>
            <Mono size={12} color={barColor(i)}>{t.pct}%</Mono>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Row 3C — execution discipline ────────────────────────────────────────────

const EXEC = [
  { label: 'Muddatida bajarilgan', pct: 74, color: 'var(--ok)',     bgColor: 'var(--ok-bg)',     textColor: 'var(--ok)'     },
  { label: "Muddati yaqin",        pct: 18, color: 'var(--warn)',   bgColor: 'var(--warn-bg)',   textColor: 'var(--warn)'   },
  { label: "Muddati o'tgan",       pct: 8,  color: 'var(--danger)', bgColor: 'var(--danger-bg)', textColor: 'var(--danger)' },
]

function ExecCard() {
  return (
    <Card>
      <CardHeader>Ijro intizomi</CardHeader>
      <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {EXEC.map((e, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink)' }}>{e.label}</span>
              <Mono size={14} color={e.textColor}>{e.pct}%</Mono>
            </div>
            {/* Track */}
            <div style={{ height: 6, background: 'var(--hairline)', borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: `${e.pct}%`, background: e.color,
                borderRadius: 3, transition: 'width 0.6s ease',
              }} />
            </div>
          </div>
        ))}
        {/* Total note */}
        <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)', margin: 0 }}>
          Jami faol topshiriqlar: <Mono size={11} color="var(--ink)">338</Mono> ta
        </p>
      </div>
    </Card>
  )
}

// ── Row 4A — top queries ──────────────────────────────────────────────────────

const TOP_QUERIES = [
  { q: "ko'chat ekish topshiriqlari",     n: 214 },
  { q: 'elektron hujjat aylanishi',        n: 187 },
  { q: 'raqamli kompetensiya kurslari',    n: 156 },
  { q: "yo'l yoritilishi murojaatlari",    n: 142 },
  { q: 'arxiv saqlash muddatlari',         n: 118 },
  { q: 'byudjet taqsimoti',               n: 97  },
]

function TopQueriesCard() {
  const max = TOP_QUERIES[0].n
  return (
    <Card>
      <CardHeader>Eng ko'p so'ralgan savollar</CardHeader>
      <div style={{ padding: '8px 0' }}>
        {TOP_QUERIES.map((q, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 18px',
            borderBottom: i < TOP_QUERIES.length - 1 ? '1px solid var(--hairline)' : 'none',
          }}>
            <Mono size={11} color="var(--ink-3)">{String(i + 1).padStart(2, '0')}</Mono>
            <span style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{q.q}</span>
            {/* Mini bar */}
            <div style={{ width: 60, height: 3, background: 'var(--hairline)', borderRadius: 2, flexShrink: 0 }}>
              <div style={{
                width: `${(q.n / max) * 100}%`, height: '100%',
                background: B90, borderRadius: 2,
              }} />
            </div>
            <Mono size={12} color={B90}>{q.n}</Mono>
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Row 4B — zero-result queries ──────────────────────────────────────────────

const EMPTY_QUERIES = [
  { q: '2027-yilgi byudjet taqsimoti',             n: 34 },
  { q: "qishloq xo'jaligi sug'orish rejalari",     n: 28 },
  { q: "uy-joy qurilishi ruxsatnomasi namunasi",   n: 22 },
  { q: 'pensiya hisoblash tartibi',                n: 17 },
  { q: "soliq imtiyozlari ro'yxati 2026",          n: 14 },
]

function EmptyQueriesCard() {
  return (
    <Card>
      <CardHeader>Natijasiz so'rovlar</CardHeader>
      <div style={{ padding: '8px 0' }}>
        {EMPTY_QUERIES.map((q, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 18px',
            borderBottom: '1px solid var(--hairline)',
          }}>
            <Mono size={11} color="var(--ink-3)">{String(i + 1).padStart(2, '0')}</Mono>
            <span style={{ flex: 1, fontSize: 13, color: 'var(--ink)' }}>{q.q}</span>
            <span style={{
              fontFamily: 'var(--mono)', fontSize: 11,
              background: 'var(--warn-bg)', color: 'var(--warn)',
              border: '1px solid var(--warn-border)', borderRadius: 3,
              padding: '1px 6px',
            }}>
              {q.n}×
            </span>
          </div>
        ))}
      </div>
      {/* Warning note */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: '12px 18px', borderTop: '1px solid var(--hairline)',
        background: 'var(--warn-bg)',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="7" cy="7" r="6" stroke="var(--warn)" strokeWidth="1.4"/>
          <path d="M7 4.5v3M7 9.5h.01" stroke="var(--warn)" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--warn)', margin: 0, lineHeight: 1.55 }}>
          Bu so'rovlar indeksdagi bo'shliqlarni ko'rsatadi — tegishli hujjatlarni yuklash tavsiya etiladi.
        </p>
      </div>
    </Card>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function Analytics({ onNav }: { onNav?: (s: string) => void }) {
  return (
    <div style={{ background: 'var(--canvas)' }}>
      <div style={{ padding: '28px 32px 48px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 24 }}>
          <div>
            <p style={{
              fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.10em',
              color: 'var(--ink-3)', textTransform: 'uppercase', margin: '0 0 8px',
            }}>
              TAHLIL
            </p>
            <h1 style={{
              fontFamily: 'var(--sans)', fontSize: 28, fontWeight: 700,
              color: 'var(--ink)', margin: '0 0 8px', lineHeight: 1.2,
            }}>
              Analitika
            </h1>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
              Hujjat oqimi, mavzu taqsimoti va ijro intizomi ko'rsatkichlari.
            </p>
          </div>
          <div style={{ flexShrink: 0, paddingTop: 4 }}>
            <label style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)', marginRight: 8 }}>
              Davr:
            </label>
            <select style={{
              height: 34, background: 'var(--surface)',
              border: '1px solid var(--hairline)', borderRadius: 4,
              color: 'var(--ink)', fontSize: 13, padding: '0 12px',
              fontFamily: 'var(--sans)', cursor: 'pointer',
            }}>
              {["So'nggi 12 oy", "So'nggi 6 oy", "So'nggi 30 kun", "2025-yil", "2024-yil"].map(o => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Row 1 */}
          <StatCards />

          {/* Row 2 */}
          <FlowChart />

          {/* Row 3 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: 20, alignItems: 'start' }}>
            <OrgChart />
            <TopicList />
            <ExecCard />
          </div>

          {/* Row 4 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
            <TopQueriesCard />
            <EmptyQueriesCard />
          </div>

        </div>
      </div>
    </div>
  )
}
