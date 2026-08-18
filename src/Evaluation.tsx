import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, Cell, LabelList, ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

// ── Colour density scale (navy only) ─────────────────────────────────────────
// 4 shades from lightest (baseline) to darkest (best method)
const D0 = '#9DB8D9'  // BM25 baseline
const D1 = '#5A8DBF'  // dense
const D2 = '#2E6099'  // hybrid RRF
const D3 = '#1A3A6B'  // hybrid + reranker  (var(--navy))

const METHODS = ['BM25', 'Dense', 'Gibrid RRF', 'Gibrid+Reranker']
const METHOD_COLORS = [D0, D1, D2, D3]

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
      letterSpacing: '0.09em', textTransform: 'uppercase' as const,
      color: 'var(--ink-3)', marginBottom: 14,
    }}>
      {children}
    </div>
  )
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 4, padding: 20, ...style,
    }}>
      {children}
    </div>
  )
}

// ── Row 1 — metric cards ──────────────────────────────────────────────────────

const METRICS = [
  { label: 'PRECISION@5', value: '0.88', delta: '+0.34 bazisga nisbatan' },
  { label: 'RECALL@10',   value: '0.84', delta: '+0.36 bazisga nisbatan' },
  { label: 'MRR',         value: '0.86', delta: '+0.35 bazisga nisbatan' },
  { label: 'nDCG@10',     value: '0.87', delta: '+0.32 bazisga nisbatan' },
]

function MetricCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
      {METRICS.map(m => (
        <div key={m.label} style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 4, padding: 16,
        }}>
          <p style={{
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.09em', textTransform: 'uppercase' as const,
            color: 'var(--ink-3)', margin: '0 0 8px',
          }}>
            {m.label}
          </p>
          <p style={{ fontFamily: 'var(--mono)', fontSize: 26, color: 'var(--ink)', margin: '0 0 8px', lineHeight: 1 }}>
            {m.value}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none" style={{ flexShrink: 0 }}>
              <path d="M5.5 9V2M2 5.5l3.5-3.5 3.5 3.5" stroke="var(--ok)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ok)' }}>{m.delta}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Row 2 — comparison table ──────────────────────────────────────────────────

const TABLE_ROWS = [
  { method: "Kalit so'z (BM25) — bazis", p5: '0.54', r10: '0.48', mrr: '0.51', ndcg: '0.55', lat: '45 ms',  best: false },
  { method: 'Vektor qidiruv (dense)',      p5: '0.76', r10: '0.71', mrr: '0.74', ndcg: '0.77', lat: '180 ms', best: false },
  { method: 'Gibrid (BM25 + dense, RRF)',  p5: '0.83', r10: '0.79', mrr: '0.80', ndcg: '0.82', lat: '210 ms', best: false },
  { method: 'Gibrid + reranker',           p5: '0.88', r10: '0.84', mrr: '0.86', ndcg: '0.87', lat: '340 ms', best: true  },
]

const COL_HEADS = ['Usul', 'Precision@5', 'Recall@10', 'MRR', 'nDCG@10', 'Kechikish']

function ComparisonTable() {
  return (
    <Card>
      <SectionLabel>Usullar kesimida taqqoslash</SectionLabel>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F4F6FA' }}>
              {COL_HEADS.map((h, i) => (
                <th key={h} style={{
                  padding: '9px 14px',
                  fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                  color: 'var(--ink-3)', textAlign: i === 0 ? 'left' : 'right' as const,
                  borderBottom: '2px solid var(--hairline)',
                  whiteSpace: 'nowrap' as const,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map((row, ri) => (
              <tr key={ri} style={{ background: row.best ? '#F7F9FB' : 'transparent' }}>
                <td style={{
                  padding: '11px 14px', fontSize: 13,
                  fontWeight: row.best ? 600 : 400,
                  color: 'var(--ink)',
                  borderBottom: '1px solid var(--hairline)',
                  whiteSpace: 'nowrap' as const,
                }}>
                  {row.method}
                </td>
                {[row.p5, row.r10, row.mrr, row.ndcg, row.lat].map((v, ci) => (
                  <td key={ci} style={{
                    padding: '11px 14px', textAlign: 'right' as const,
                    fontFamily: 'var(--mono)', fontSize: 13,
                    fontWeight: row.best ? 600 : 400,
                    color: row.best ? D3 : 'var(--ink-2)',
                    borderBottom: '1px solid var(--hairline)',
                  }}>
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)', margin: '10px 0 0' }}>
        Eng yaxshi natija qalin ko'rsatilgan. Kechikish 95-persentil qiymati.
      </p>
    </Card>
  )
}

// ── Row 3 — charts ────────────────────────────────────────────────────────────

const PREC_AT_K = [
  { k: 1,  bm25: 0.61, dense: 0.82, hybrid: 0.89, reranker: 0.94 },
  { k: 3,  bm25: 0.58, dense: 0.79, hybrid: 0.86, reranker: 0.91 },
  { k: 5,  bm25: 0.54, dense: 0.76, hybrid: 0.83, reranker: 0.88 },
  { k: 10, bm25: 0.47, dense: 0.69, hybrid: 0.76, reranker: 0.81 },
  { k: 20, bm25: 0.39, dense: 0.60, hybrid: 0.67, reranker: 0.73 },
]

const CHART_LINES = [
  { key: 'bm25',     label: "Kalit so'z (BM25)",      color: D0 },
  { key: 'dense',    label: 'Vektor (dense)',           color: D1 },
  { key: 'hybrid',   label: 'Gibrid RRF',               color: D2 },
  { key: 'reranker', label: 'Gibrid + reranker',        color: D3 },
]

const AXIS_STYLE = { fontFamily: 'var(--mono)', fontSize: 10, fill: '#9BAAB8' }

function PrecAtKChart() {
  return (
    <Card style={{ padding: '20px 20px 14px' }}>
      <SectionLabel>Precision@k qiymatining k bo'yicha o'zgarishi</SectionLabel>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={PREC_AT_K} margin={{ top: 4, right: 16, bottom: 0, left: -8 }}>
          <CartesianGrid strokeDasharray="" stroke="var(--hairline)" vertical={false} />
          <XAxis
            dataKey="k"
            tickLine={false}
            axisLine={false}
            tick={AXIS_STYLE}
            tickFormatter={v => `k=${v}`}
          />
          <YAxis
            domain={[0.3, 1]}
            tickLine={false}
            axisLine={false}
            tick={AXIS_STYLE}
            tickFormatter={v => v.toFixed(1)}
            width={28}
          />
          <Tooltip
            contentStyle={{
              fontFamily: 'var(--mono)', fontSize: 11,
              background: 'var(--surface)', border: '1px solid var(--hairline)',
              borderRadius: 4, boxShadow: '0 2px 8px rgba(10,29,58,0.1)',
            }}
            formatter={(val: number) => val.toFixed(2)}
          />
          {CHART_LINES.map(l => (
            <Line
              key={l.key}
              type="linear"
              dataKey={l.key}
              stroke={l.color}
              strokeWidth={1.5}
              dot={{ r: 3, fill: l.color, strokeWidth: 0 }}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 10 }}>
        {CHART_LINES.map(l => (
          <div key={l.key} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 20, height: 2, background: l.color, borderRadius: 1 }} />
            <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-2)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

const BAR_DATA = [
  { method: 'Gibrid + reranker', precision: 0.88, latency: 340 },
  { method: 'Gibrid RRF',        precision: 0.83, latency: 210 },
  { method: 'Vektor (dense)',     precision: 0.76, latency: 180 },
  { method: "Kalit so'z (BM25)", precision: 0.54, latency: 45  },
]

interface CustomLabelProps {
  x?: number; y?: number; width?: number; height?: number; value?: number | string
}

function PrecisionLabel({ x = 0, y = 0, width = 0, height = 0, value }: CustomLabelProps) {
  return (
    <text
      x={x + width + 6}
      y={y + height / 2 + 4}
      style={{ fontFamily: 'var(--mono)', fontSize: 11, fill: 'var(--ink-2)' }}
    >
      {typeof value === 'number' ? value.toFixed(2) : value}
    </text>
  )
}

function LatencyLabel({ x = 0, y = 0, width = 0, height = 0, value }: CustomLabelProps) {
  return (
    <text
      x={x + width + 6}
      y={y + height / 2 - 5}
      style={{ fontFamily: 'var(--mono)', fontSize: 9, fill: 'var(--ink-3)' }}
    >
      {value} ms
    </text>
  )
}

function PrecisionLatencyChart() {
  const maxPrec = 1
  const maxLat  = 400

  return (
    <Card style={{ padding: '20px 20px 14px' }}>
      <SectionLabel>Aniqlik va kechikish muvozanati</SectionLabel>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={BAR_DATA}
          layout="vertical"
          margin={{ top: 0, right: 90, bottom: 0, left: 100 }}
          barSize={16}
          barCategoryGap={14}
        >
          <CartesianGrid strokeDasharray="" stroke="var(--hairline)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0, maxPrec]}
            tickLine={false}
            axisLine={false}
            tick={AXIS_STYLE}
            tickCount={6}
          />
          <YAxis
            type="category"
            dataKey="method"
            tickLine={false}
            axisLine={false}
            tick={{ fontFamily: 'var(--sans)', fontSize: 11, fill: 'var(--ink-2)' }}
            width={96}
          />
          <Tooltip
            contentStyle={{
              fontFamily: 'var(--mono)', fontSize: 11,
              background: 'var(--surface)', border: '1px solid var(--hairline)',
              borderRadius: 4,
            }}
            formatter={(val: number, name: string) => [
              name === 'precision' ? val.toFixed(2) : `${val} ms`,
              name === 'precision' ? 'Precision@5' : 'Kechikish',
            ]}
          />
          <Bar dataKey="precision" radius={2}>
            {BAR_DATA.map((_, i) => (
              <Cell key={i} fill={METHOD_COLORS[BAR_DATA.length - 1 - i]} />
            ))}
            <LabelList content={<PrecisionLabel />} />
          </Bar>
          {/* Latency as thin overlay reference lines */}
          {BAR_DATA.map((d, i) => {
            const scaledX = (d.latency / maxLat) * maxPrec
            // Render as a secondary bar at nearly zero width — use ReferenceLine trick instead
            return null
          })}
        </BarChart>
      </ResponsiveContainer>
      {/* Manual latency markers below */}
      <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 100 }}>
        {BAR_DATA.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 14 }}>
            <div style={{
              width: `${(d.latency / 400) * 100}%`, maxWidth: 180,
              height: 2, background: '#C8D4E4', borderRadius: 1, flexShrink: 0,
            }} />
            <Mono size={10} color="var(--ink-3)">{d.latency} ms</Mono>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 14, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 16, height: 8, background: D2, borderRadius: 1 }} />
          <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-2)' }}>Precision@5</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 16, height: 2, background: '#C8D4E4', borderRadius: 1 }} />
          <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-2)' }}>Kechikish (95p)</span>
        </div>
      </div>
    </Card>
  )
}

// ── Row 4 — categories + errors ───────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Aniq hujjat izlash',       value: 0.94 },
  { label: 'Mavzuiy qidiruv',          value: 0.89 },
  { label: 'Topshiriq va muddat',       value: 0.86 },
  { label: "Ko'p hujjatli sintez",      value: 0.79 },
  { label: "Kirill/lotin aralash so'rov", value: 0.85 },
  { label: "Rus tilidagi so'rov",       value: 0.81 },
]

function relColor(v: number) {
  if (v >= 0.90) return D3
  if (v >= 0.85) return D2
  if (v >= 0.80) return D1
  return D0
}

function CategoryCard() {
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--hairline)' }}>
        <SectionLabel>Savol toifalari bo'yicha aniqlik</SectionLabel>
      </div>
      {CATEGORIES.map((cat, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 18px',
          borderBottom: i < CATEGORIES.length - 1 ? '1px solid var(--hairline)' : 'none',
        }}>
          {/* Density bar */}
          <div style={{ width: 4, height: 28, background: relColor(cat.value), borderRadius: 2, flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 13, color: 'var(--ink)', lineHeight: 1.3 }}>{cat.label}</span>
          <Mono size={13} color={relColor(cat.value)}>{cat.value.toFixed(2)}</Mono>
          {/* Mini bar */}
          <div style={{ width: 80, height: 4, background: 'var(--hairline)', borderRadius: 2, flexShrink: 0 }}>
            <div style={{
              width: `${cat.value * 100}%`, height: '100%',
              background: relColor(cat.value), borderRadius: 2,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      ))}
    </Card>
  )
}

const ERRORS = [
  { label: "Noto'g'ri chunk tanlandi", count: 11, note: "Semantik yaqinlik chegarasida qo'shni chunk ustunlik qilgan" },
  { label: 'OCR xatosi tufayli topilmadi', count: 7,  note: "Kirill skanida tanib bo'lmaydigan belgilar indekslashni buzgan" },
  { label: 'Omonim atama',               count: 5,  note: "Bir xil atama turli mazmunga ega hujjatlarda ishlatilgan" },
  { label: "Juda uzun so'rov",           count: 3,  note: "512 tokendan ortiq so'rov trunkatsiyaga uchragan" },
]

function ErrorCard() {
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--hairline)' }}>
        <SectionLabel>Xatolar tahlili</SectionLabel>
      </div>
      {ERRORS.map((err, i) => (
        <div key={i} style={{
          padding: '12px 18px',
          borderBottom: i < ERRORS.length - 1 ? '1px solid var(--hairline)' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>{err.label}</span>
            <span style={{ marginLeft: 'auto', flexShrink: 0 }}>
              <Mono size={13} color={D2}>{err.count}</Mono>
            </span>
          </div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)', margin: 0, lineHeight: 1.5 }}>
            {err.note}
          </p>
        </div>
      ))}
      <div style={{ padding: '10px 18px', background: '#F7F9FB', borderTop: '1px solid var(--hairline)' }}>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)' }}>
          Jami 150 so'rovdan 26 tasida xatolik qayd etildi.
        </span>
      </div>
    </Card>
  )
}

// ── Row 5 — test conditions ───────────────────────────────────────────────────

const CONDITIONS = [
  { label: 'Embedding modeli',  value: 'bge-m3',                         mono: false },
  { label: "O'lcham",           value: '1024',                            mono: true  },
  { label: 'Reranker',          value: 'bge-reranker-v2-m3',              mono: false },
  { label: 'Vektor bazasi',     value: 'Qdrant, HNSW (M=16, efC=200)',    mono: true  },
  { label: 'Chunk',             value: '512 token / 64 overlap',          mono: true  },
  { label: 'Korpus hajmi',      value: '12 428 hujjat / 298 640 chunk',   mono: true  },
  { label: "Test to'plami",     value: "150 so'rov, 3 ekspert, Fleiss κ = 0.78", mono: false },
  { label: 'Apparat',           value: '1× NVIDIA A100 40GB, 64 GB RAM', mono: false },
  { label: 'Sinov sanasi',      value: '20.07.2026',                      mono: true  },
]

function TestConditions() {
  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--hairline)' }}>
        <SectionLabel>Sinov shartlari</SectionLabel>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
      }}>
        {CONDITIONS.map((c, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '180px 1fr',
            padding: '9px 18px',
            borderBottom: '1px solid var(--hairline)',
            borderRight: i % 2 === 0 ? '1px solid var(--hairline)' : 'none',
          }}>
            <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{c.label}</span>
            {c.mono
              ? <Mono size={12} color="var(--ink)">{c.value}</Mono>
              : <span style={{ fontSize: 13, color: 'var(--ink)' }}>{c.value}</span>
            }
          </div>
        ))}
      </div>
    </Card>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function Evaluation({ onNav }: { onNav?: (s: string) => void }) {
  return (
    <div style={{ background: 'var(--canvas)' }}>
      <div style={{ padding: '28px 32px 48px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 32 }}>
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
            Model samaradorligini baholash
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6, maxWidth: 680 }}>
            Gibrid semantik qidiruv algoritmining kalit so'z qidiruviga nisbatan samaradorligi.
            Test to'plami: 150 savol–hujjat jufti, 3 ekspert bahosi.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <MetricCards />
          <ComparisonTable />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <PrecAtKChart />
            <PrecisionLatencyChart />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <CategoryCard />
            <ErrorCard />
          </div>
          <TestConditions />
        </div>
      </div>
    </div>
  )
}
