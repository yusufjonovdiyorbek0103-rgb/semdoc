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

// ── Highlighted appeal text ───────────────────────────────────────────────────
// Each segment is {text, highlight}

interface Seg { text: string; hl: boolean }

function AppealText({ segs }: { segs: Seg[] }) {
  return (
    <p style={{
      fontFamily: 'var(--serif)', fontSize: 14, lineHeight: 1.7,
      color: 'var(--ink)', margin: 0,
    }}>
      {segs.map((s, i) =>
        s.hl
          ? <mark key={i} style={{ background: '#E8EEF4', color: 'inherit', padding: '1px 2px', borderRadius: 2 }}>{s.text}</mark>
          : <span key={i}>{s.text}</span>
      )}
    </p>
  )
}

// ── Doc meta ──────────────────────────────────────────────────────────────────

function DocMeta({ num, date, applicant }: { num: string; date: string; applicant: string }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' as const }}>
      <Mono size={12} color="var(--navy)">{num}</Mono>
      <span style={{ color: 'var(--hairline)', fontSize: 11 }}>·</span>
      <Mono size={11} color="var(--ink-3)">{date}</Mono>
      <span style={{ color: 'var(--hairline)', fontSize: 11 }}>·</span>
      <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{applicant}</span>
    </div>
  )
}

// ── Action row ────────────────────────────────────────────────────────────────

type GroupStatus = 'pending' | 'merged' | 'linked' | 'notdup'

function ActionRow({
  status,
  onMerge,
  onLink,
  onNotDup,
}: {
  status: GroupStatus
  onMerge: () => void
  onLink: () => void
  onNotDup: () => void
}) {
  if (status !== 'pending') {
    const labels: Record<string, string> = {
      merged: 'Birlashtirildi',
      linked: "Bog'liq deb belgilandi",
      notdup: 'Dublikat emas deb belgilandi',
    }
    const colors: Record<string, string> = {
      merged: 'var(--ok)',
      linked: 'var(--navy)',
      notdup: 'var(--ink-2)',
    }
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: colors[status] }}>
          ✓ {labels[status]}
        </span>
        <button
          onClick={onMerge}
          style={{
            fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)',
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            textDecoration: 'underline', textDecorationColor: 'transparent',
          }}
          onMouseEnter={e => e.currentTarget.style.textDecorationColor = 'var(--ink-2)'}
          onMouseLeave={e => e.currentTarget.style.textDecorationColor = 'transparent'}
        >
          Qaytarish
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <PrimaryBtn onClick={onMerge}>Birlashtirish</PrimaryBtn>
      <SecondaryBtn onClick={onLink}>Bog'liq deb belgilash</SecondaryBtn>
      <TextBtn onClick={onNotDup}>Dublikat emas</TextBtn>
    </div>
  )
}

function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
        color: 'var(--navy-fg)',
        background: hov ? 'var(--navy-hover)' : 'var(--navy)',
        border: 'none', borderRadius: 4, padding: '0 14px', height: 32,
        cursor: 'pointer', transition: 'background 0.15s',
      }}
    >
      {children}
    </button>
  )
}

function SecondaryBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
        color: 'var(--ink)',
        background: hov ? '#F0F3F7' : 'var(--surface)',
        border: '1px solid var(--hairline)', borderRadius: 4,
        padding: '0 14px', height: 32, cursor: 'pointer',
        transition: 'background 0.12s',
      }}
    >
      {children}
    </button>
  )
}

function TextBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 400,
        color: hov ? 'var(--ink)' : 'var(--ink-2)',
        background: 'none', border: 'none', padding: '0 6px', height: 32,
        cursor: 'pointer', transition: 'color 0.12s',
      }}
    >
      {children}
    </button>
  )
}

// ── Group 1 — 96%, two docs, road lighting ────────────────────────────────────

const G1_LEFT: Seg[] = [
  { text: 'Chilonzor tumani ', hl: false },
  { text: '12-mavze', hl: true },
  { text: 'dagi ko\'chalarda ', hl: false },
  { text: 'yo\'l yoritilishi yo\'q', hl: true },
  { text: ', ', hl: false },
  { text: 'kechqurun harakatlanish', hl: true },
  { text: ' ', hl: false },
  { text: 'xavfli', hl: true },
  { text: '.', hl: false },
]

const G1_RIGHT: Seg[] = [
  { text: 'Chilonzor ', hl: false },
  { text: '12-mavze', hl: true },
  { text: 'da ko\'cha ', hl: false },
  { text: 'chiroqlari ishlamaydi', hl: true },
  { text: ', kechasi qorong\'i va ', hl: false },
  { text: 'xavfli', hl: true },
  { text: '.', hl: false },
]

// ── Group 2 — 88%, two docs, road repair ─────────────────────────────────────

const G2_LEFT: Seg[] = [
  { text: 'Yunusobod tumani 7-mavzedagi ', hl: false },
  { text: 'asosiy yo\'l ta\'mirlash', hl: true },
  { text: 'ni talab qilmoqda. ', hl: false },
  { text: 'Chuqurliklar', hl: true },
  { text: ' transport vositalariga zarar yetkazmoqda va avariya xavfini oshirmoqda.', hl: false },
]

const G2_RIGHT: Seg[] = [
  { text: 'Mirzo Ulug\'bek tumani 3-mavzedagi ko\'chada katta ', hl: false },
  { text: 'chuqurliklar', hl: true },
  { text: ' mavjud, ', hl: false },
  { text: 'yo\'lni ta\'mirlash', hl: true },
  { text: ' zarur. Yuk mashinalari o\'tishi qiyin bo\'lib qolmoqda.', hl: false },
]

// ── Group 3 — 79%, three docs, digital skills ────────────────────────────────

interface StackDoc { num: string; date: string; applicant: string; segs: Seg[] }

const G3_DOCS: StackDoc[] = [
  {
    num: 'D-019', date: '02.04.2025', applicant: 'ToshDU rektori',
    segs: [
      { text: 'Toshkent davlat universiteti talabalariga ', hl: false },
      { text: 'raqamli ko\'nikmalar', hl: true },
      { text: ' bo\'yicha ', hl: false },
      { text: 'qo\'shimcha kurslar', hl: true },
      { text: ' tashkil etilishini so\'raymiz. ', hl: false },
      { text: 'Dasturiy ta\'minot', hl: true },
      { text: ' va sun\'iy intellekt sohasida kadrlar tayyorlash zaruriyati yuqori.', hl: false },
    ],
  },
  {
    num: 'D-023', date: '05.04.2025', applicant: 'NamMQI prorektori',
    segs: [
      { text: 'Namangan muhandislik-qurilish instituti uchun ', hl: false },
      { text: 'raqamli ko\'nikmalar', hl: true },
      { text: ' va ', hl: false },
      { text: 'dasturiy ta\'minot', hl: true },
      { text: ' bo\'yicha o\'quv ', hl: false },
      { text: 'qo\'shimcha kurslar', hl: true },
      { text: ' ochish iltimosidir. Sun\'iy intellekt va ma\'lumotlar tahlili yo\'nalishlari ayniqsa kerakli.', hl: false },
    ],
  },
  {
    num: 'D-028', date: '08.04.2025', applicant: 'SamDU muassasasi',
    segs: [
      { text: 'Samarqand davlat universiteti talabalarining ', hl: false },
      { text: 'raqamli ko\'nikmalar', hl: true },
      { text: ' darajasini oshirish maqsadida ', hl: false },
      { text: 'qo\'shimcha kurslar', hl: true },
      { text: ' va tajriba almashinuv dasturlarini yo\'lga qo\'yishni so\'raymiz.', hl: false },
    ],
  },
]

// ── Similarity bar ────────────────────────────────────────────────────────────

function SimilarityBar({ pct }: { pct: number }) {
  const color = pct >= 90 ? 'var(--rel-90)' : pct >= 80 ? 'var(--rel-70)' : 'var(--rel-50)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 80, height: 4, background: 'var(--hairline)', borderRadius: 2 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.4s' }} />
      </div>
    </div>
  )
}

// ── Group card ────────────────────────────────────────────────────────────────

function GroupCard({
  index,
  similarity,
  docCount,
  status,
  onAction,
  badge,
  children,
}: {
  index: number
  similarity: number
  docCount: number
  status: GroupStatus
  onAction: (action: 'merged' | 'linked' | 'notdup' | 'pending') => void
  badge?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 4, overflow: 'hidden',
      opacity: status !== 'pending' ? 0.75 : 1,
      transition: 'opacity 0.2s',
    }}>
      {/* Group header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '13px 18px', borderBottom: '1px solid var(--hairline)',
        background: '#F9FAFB',
      }}>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
          {index}-guruh
        </span>
        <span style={{ color: 'var(--hairline)', fontSize: 14 }}>·</span>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-2)' }}>
          o'xshashlik{' '}
          <Mono size={13} color="var(--ink)">{similarity}%</Mono>
        </span>
        <SimilarityBar pct={similarity} />
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)' }}>
          {docCount} ta hujjat
        </span>
        <div style={{ flex: 1 }} />
        {badge}
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px' }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 18px', borderTop: '1px solid var(--hairline)',
        background: '#F9FAFB',
      }}>
        <ActionRow
          status={status}
          onMerge={() => onAction(status === 'pending' ? 'merged' : 'pending')}
          onLink={() => onAction('linked')}
          onNotDup={() => onAction('notdup')}
        />
      </div>
    </div>
  )
}

// ── Two-column comparison ─────────────────────────────────────────────────────

function TwoColumnComparison({
  left,
  right,
}: {
  left: { num: string; date: string; applicant: string; segs: Seg[] }
  right: { num: string; date: string; applicant: string; segs: Seg[] }
}) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1px 1fr', gap: '0 0',
      border: '1px solid var(--hairline)', borderRadius: 4, overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 16px' }}>
        <DocMeta num={left.num} date={left.date} applicant={left.applicant} />
        <AppealText segs={left.segs} />
      </div>
      <div style={{ background: 'var(--hairline)' }} />
      <div style={{ padding: '14px 16px' }}>
        <DocMeta num={right.num} date={right.date} applicant={right.applicant} />
        <AppealText segs={right.segs} />
      </div>
    </div>
  )
}

// ── Three-doc stacked list ────────────────────────────────────────────────────

function StackedDocs({ docs }: { docs: StackDoc[] }) {
  return (
    <div style={{
      border: '1px solid var(--hairline)', borderRadius: 4, overflow: 'hidden',
    }}>
      {docs.map((doc, i) => (
        <div key={doc.num} style={{
          padding: '14px 16px',
          borderBottom: i < docs.length - 1 ? '1px solid var(--hairline)' : 'none',
          display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0 16px',
        }}>
          {/* Left meta column */}
          <div style={{ borderRight: '1px solid var(--hairline)', paddingRight: 16 }}>
            <Mono size={12} color="var(--navy)">{doc.num}</Mono>
            <div style={{ marginTop: 4 }}>
              <Mono size={11} color="var(--ink-3)">{doc.date}</Mono>
            </div>
            <div style={{ marginTop: 4, fontSize: 11, color: 'var(--ink-2)', lineHeight: 1.4 }}>
              {doc.applicant}
            </div>
          </div>
          {/* Appeal text */}
          <AppealText segs={doc.segs} />
        </div>
      ))}
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function Duplicates({ onNav }: { onNav?: (s: string) => void }) {
  const [statuses, setStatuses] = useState<GroupStatus[]>(['pending', 'pending', 'pending'])

  const setStatus = (i: number, s: GroupStatus) =>
    setStatuses(prev => prev.map((v, idx) => idx === i ? s : v))

  const activeGroups = statuses.filter(s => s === 'pending').length

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
            Dublikatlar va o'xshash murojaatlar
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
            Mazmuni bir xil yoki juda yaqin hujjatlar guruhlangan holda ko'rsatiladi.
          </p>
        </div>

        {/* Summary strip */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--hairline)',
          borderRadius: 4, display: 'flex', marginBottom: 24, overflow: 'hidden',
        }}>
          {[
            { n: activeGroups.toString(), label: 'Aniqlangan guruhlar', total: '3' },
            { n: '8', label: 'Jami hujjatlar', total: null },
            { n: '6', label: 'Taxminiy tejalgan ish vaqti', suffix: 'soat' },
          ].map((stat, i) => (
            <div key={i} style={{
              flex: 1, padding: '16px 24px',
              borderRight: i < 2 ? '1px solid var(--hairline)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 20, color: 'var(--ink)', fontWeight: 500 }}>
                  {stat.n}
                  {stat.total && stat.n !== stat.total && (
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--ink-3)' }}>
                      /{stat.total}
                    </span>
                  )}
                </span>
                {stat.suffix && (
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-2)' }}>
                    {stat.suffix}
                  </span>
                )}
              </div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)', marginTop: 3 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Group cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Group 1 — 96%, road lighting, strong merge recommendation */}
          <GroupCard
            index={1}
            similarity={96}
            docCount={2}
            status={statuses[0]}
            onAction={s => setStatus(0, s)}
            badge={
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
                color: 'var(--warn)', background: 'var(--warn-bg)',
                border: '1px solid var(--warn-border)',
                borderRadius: 4, padding: '3px 9px',
              }}>
                Birlashtirish tavsiya etiladi
              </span>
            }
          >
            <TwoColumnComparison
              left={{
                num: 'D-004', date: '09.05.2025', applicant: 'A. Karimov',
                segs: G1_LEFT,
              }}
              right={{
                num: 'D-005', date: '11.05.2025', applicant: 'N. Yusupova',
                segs: G1_RIGHT,
              }}
            />
            <p style={{
              fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)',
              margin: '10px 0 0', lineHeight: 1.55,
            }}>
              Ikkala murojaat Chilonzor tumani 12-mavzedagi ko'cha yoritishga tegishli. Muallif, sana va iboralar farqli bo'lsa-da, talab bir xil.
            </p>
          </GroupCard>

          {/* Group 2 — 88%, road repair, review needed */}
          <GroupCard
            index={2}
            similarity={88}
            docCount={2}
            status={statuses[1]}
            onAction={s => setStatus(1, s)}
            badge={
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
                color: 'var(--ink-2)', background: 'var(--badge-bg)',
                border: '1px solid var(--hairline)',
                borderRadius: 4, padding: '3px 9px',
              }}>
                Ko'rib chiqish talab etiladi
              </span>
            }
          >
            <TwoColumnComparison
              left={{
                num: 'D-012', date: '14.05.2025', applicant: 'B. Toshmatov',
                segs: G2_LEFT,
              }}
              right={{
                num: 'D-015', date: '17.05.2025', applicant: 'M. Ergasheva',
                segs: G2_RIGHT,
              }}
            />
            <p style={{
              fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)',
              margin: '10px 0 0', lineHeight: 1.55,
            }}>
              Ikki murojaat yo'l ta'mirlash haqida, ammo har xil tuman — birlashtirish yoki alohida ko'rish kerakligini tekshiring.
            </p>
          </GroupCard>

          {/* Group 3 — 79%, digital skills, three docs, stacked */}
          <GroupCard
            index={3}
            similarity={79}
            docCount={3}
            status={statuses[2]}
            onAction={s => setStatus(2, s)}
            badge={
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
                color: 'var(--ink-2)', background: 'var(--badge-bg)',
                border: '1px solid var(--hairline)',
                borderRadius: 4, padding: '3px 9px',
              }}>
                Ko'rib chiqish talab etiladi
              </span>
            }
          >
            <StackedDocs docs={G3_DOCS} />
            <p style={{
              fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)',
              margin: '10px 0 0', lineHeight: 1.55,
            }}>
              Uchta universitetning bir xil mazmundagi so'rovlari — bitta umumiy topshiriq sifatida ko'rib chiqish tavsiya etiladi.
            </p>
          </GroupCard>

        </div>
      </div>
    </div>
  )
}
