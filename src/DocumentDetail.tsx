import { useState, CSSProperties } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'ai' | 'text' | 'similar'

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

function Pill({ children, color = 'var(--ink-2)', bg = 'var(--badge-bg)', border = 'var(--hairline)' }: {
  children: React.ReactNode; color?: string; bg?: string; border?: string
}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
      letterSpacing: '0.07em', textTransform: 'uppercase' as const,
      color, background: bg, border: `1px solid ${border}`,
      borderRadius: 4, padding: '3px 8px', lineHeight: 1.5, whiteSpace: 'nowrap' as const,
    }}>
      {children}
    </span>
  )
}

function SideCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 4, overflow: 'hidden',
    }}>
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

// ── Tab 1: AI xulosa ──────────────────────────────────────────────────────────

function CitationChip({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <sup
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--mono)', fontSize: 10,
        color: hovered ? 'var(--navy)' : 'var(--link)',
        background: hovered ? '#E8EEF4' : '#EEF3FA',
        borderRadius: 3, padding: '1px 4px',
        cursor: 'pointer', marginLeft: 2, verticalAlign: 'super',
        lineHeight: 1, display: 'inline-block', transition: 'background 0.12s, color 0.12s',
        border: '1px solid #C8D8EA',
      }}
    >
      {label}
    </sup>
  )
}

function AiTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Summary card */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--hairline)',
        borderRadius: 4, padding: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--ink-3)',
          }}>
            Sun'iy intellekt xulosasi
          </span>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
            color: 'var(--ok)', background: 'var(--ok-bg)',
            border: '1px solid var(--ok-border)', borderRadius: 4,
            padding: '2px 8px', letterSpacing: '0.03em',
          }}>
            Ishonchlilik: yuqori
          </span>
        </div>

        <p style={{
          fontFamily: 'var(--serif)', fontSize: 15, lineHeight: 1.75,
          color: 'var(--ink)', margin: '0 0 16px',
        }}>
          Farmoyish tuman hokimliklariga 2025-yil 1-apreldan 15-maygacha har bir mahallada kamida 200 tup manzarali daraxt ko'chatini ekishni ta'minlashni topshiradi.<CitationChip label="1-bet" />
          {' '}Moliyalashtirish tegishli tuman byudjetining «Ko'kalamzorlashtirish» moddasi hisobidan amalga oshirilishi belgilanadi.<CitationChip label="2-bet" />
          {' '}Ekologiya boshqarmasiga ko'chatlarni vaqtida yetkazib berish va ularning sifatini nazorat qilish majburiyati yuklatiladi.<CitationChip label="2-bet" />
          {' '}Har bir tuman hokimligi amalga oshirilgan ishlar to'g'risida oyning 5-kuniga qadar shahar hokimligiga hisobot taqdim etishi shart.<CitationChip label="3-bet" />
          {' '}Ijroni nazorat qilish Toshkent shahar hokimining o'rinbosariga yuklatiladi.<CitationChip label="3-bet" />
        </p>

        <div style={{ borderTop: '1px solid var(--hairline)', paddingTop: 12 }}>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)' }}>
            Xulosa hujjatning 1–3-betlaridan avtomatik shakllantirildi. Har bir jumla manbaga bog'langan.
          </span>
        </div>
      </div>

      {/* Attributes */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 4, overflow: 'hidden',
      }}>
        <div style={{
          padding: '10px 16px', borderBottom: '1px solid var(--hairline)',
          fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--ink-3)',
        }}>
          Ajratilgan atributlar
        </div>
        {[
          ['Hujjat turi', 'Farmoyish'],
          ["Ro'yxat raqami", <Mono key="rn">112-F</Mono>],
          ['Qabul qilingan sana', <Mono key="sana">14.03.2025</Mono>],
          ['Chiqaruvchi organ', 'Toshkent shahar hokimligi'],
          ['Imzolagan', "Hokim o'rinbosari"],
          ['Ijro muddati', <Mono key="muddat">15.05.2025</Mono>],
          ["Mas'ul bo'limlar", "Tuman hokimliklari, Ekologiya boshqarmasi"],
          ["Bog'liq hujjatlar", <span key="bj" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--link)', cursor: 'pointer' }}>44-B, 7-Y</span>],
          ['Mavzu toifasi', 'Ekologiya · Ko\'kalamzorlashtirish'],
          ['Manba fayl', <span key="mf" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Mono key="fn" color="var(--link)">112-F_2025.pdf</Mono>
            <span key="meta" style={{ fontSize: 11, color: 'var(--ink-3)' }}>· 4 bet · matnli PDF</span>
          </span>],
        ].map(([label, value], i, arr) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '180px 1fr',
            padding: '9px 16px',
            borderBottom: i < arr.length - 1 ? '1px solid var(--hairline)' : 'none',
          }}>
            <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{label}</span>
            <span style={{ fontSize: 13, color: 'var(--ink)' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Tasks table */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 4, overflow: 'hidden',
      }}>
        <div style={{
          padding: '10px 16px', borderBottom: '1px solid var(--hairline)',
          fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--ink-3)',
        }}>
          Aniqlangan topshiriqlar
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F7F9FB' }}>
              {['№', 'Topshiriq', "Mas'ul", 'Muddat', 'Holat'].map(h => (
                <th key={h} style={{
                  padding: '8px 12px', textAlign: 'left' as const,
                  fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
                  color: 'var(--ink-3)', letterSpacing: '0.04em',
                  borderBottom: '1px solid var(--hairline)', whiteSpace: 'nowrap' as const,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {
                n: 1, task: "Har bir mahallada kamida 200 tup ko'chat ekish",
                resp: 'Tuman hokimliklari', deadline: '15.05.2025',
                status: "Muddati o'tgan", statusColor: 'var(--danger)', statusBg: 'var(--danger-bg)', statusBorder: 'var(--danger-border)',
              },
              {
                n: 2, task: "Ko'chatlar bilan ta'minlash",
                resp: 'Ekologiya boshqarmasi', deadline: '01.04.2025',
                status: 'Bajarilgan', statusColor: 'var(--ok)', statusBg: 'var(--ok-bg)', statusBorder: 'var(--ok-border)',
              },
              {
                n: 3, task: 'Oylik hisobot taqdim etish',
                resp: 'Tuman hokimliklari', deadline: 'har oy 5-kun',
                status: 'Jarayonda', statusColor: 'var(--warn)', statusBg: 'var(--warn-bg)', statusBorder: 'var(--warn-border)',
              },
            ].map((row, i, arr) => (
              <tr key={row.n} style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
                <td style={{ padding: '10px 12px', fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-3)' }}>
                  {row.n}
                </td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--ink)', lineHeight: 1.4 }}>
                  {row.task}
                </td>
                <td style={{ padding: '10px 12px', fontSize: 12, color: 'var(--ink-2)', whiteSpace: 'nowrap' as const }}>
                  {row.resp}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <Mono color="var(--ink-2)">{row.deadline}</Mono>
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{
                    fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
                    color: row.statusColor, background: row.statusBg,
                    border: `1px solid ${row.statusBorder}`,
                    borderRadius: 4, padding: '2px 8px', whiteSpace: 'nowrap' as const,
                  }}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Tab 2: Hujjat matni ───────────────────────────────────────────────────────

function TextTab() {
  const paragraphs = [
    {
      page: '1-bet',
      highlighted: false,
      text: "Toshkent shahri aholisining yashash sifatini oshirish, shahar ko'rinishini yaxshilash va ekologik muhitni mustahkamlash maqsadida, «Yashil makon» milliy dasturining 2025-yilgi rejasini amalga oshirish doirasida farmoyish qilinadi: barcha tuman hokimliklariga 2025-yil 1-apreldan boshlab ko'kalamzorlashtirish tadbirlarini boshlash topshiriladi.",
    },
    {
      page: '2-bet',
      highlighted: true,
      text: "Tuman hokimliklari 2025-yil 1-apreldan 15-maygacha har bir mahallada kamida 200 tup manzarali daraxt ko'chatini ekishni ta'minlasin. Moliyalashtirish tegishli tuman byudjetining «Ko'kalamzorlashtirish» moddasi, 2025-yil uchun ajratilgan mablag'lar hisobidan amalga oshirilsin. Ekologiya boshqarmasiga ko'chatlarni o'z vaqtida yetkazib berish va ularning sifat ko'rsatkichlarini nazorat qilish vazifasi yuklatilsin.",
    },
    {
      page: '3-bet',
      highlighted: false,
      text: "Har bir tuman hokimligi amalga oshirilgan ko'kalamzorlashtirish ishlari to'g'risida oyning 5-kuniga qadar Toshkent shahar hokimligiga hisobot taqdim etsin. Hisobot shaklini Shahar arxitektura boshqarmasi 2025-yil 20-martga qadar ishlab chiqadi va tuman hokimliklariga taqdim etadi.",
    },
    {
      page: '3-bet',
      highlighted: false,
      text: "Ushbu farmoyishning ijrosini nazorat qilish Toshkent shahar hokimining qurilish va kommunal xo'jalik masalalari bo'yicha o'rinbosariga yuklatilsin. Farmoyish imzolangan kundan e'tiboran kuchga kiradi.",
    },
  ]

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 4, padding: '28px 32px',
    }}>
      <div style={{ maxWidth: '68ch', margin: '0 auto', position: 'relative' }}>
        {paragraphs.map((p, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 16, marginBottom: 24 }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink-3)',
              paddingTop: 4, textAlign: 'right' as const,
            }}>
              {p.page}
            </div>
            <div style={{ position: 'relative' }}>
              {p.highlighted && (
                <span style={{
                  position: 'absolute', top: -6, right: 0,
                  fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600,
                  color: 'var(--navy)', background: '#E8EEF4',
                  border: '1px solid #C8D8EA', borderRadius: 3,
                  padding: '2px 7px', letterSpacing: '0.04em',
                }}>
                  Qidiruvda topilgan qism
                </span>
              )}
              <p style={{
                fontFamily: 'var(--serif)', fontSize: 15, lineHeight: 1.75,
                color: 'var(--ink)', margin: 0,
                background: p.highlighted ? '#E8EEF4' : 'transparent',
                padding: p.highlighted ? '10px 12px' : 0,
                borderRadius: p.highlighted ? 3 : 0,
                marginTop: p.highlighted ? 8 : 0,
              }}>
                {p.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab 3: O'xshash hujjatlar ─────────────────────────────────────────────────

const SIMILAR = [
  { rel: 84, relVar: 'var(--rel-90)', type: 'BUYRUQ', num: '44-B', title: "Ko'chat ekish va yashil hududlarni kengaytirish jadvali", org: 'Ekologiya vazirligi' },
  { rel: 71, relVar: 'var(--rel-70)', type: 'BAYONNOMA', num: '7-Y', title: "Hududlarda ekologik holatni yaxshilash bo'yicha yig'ilish bayoni", org: 'Ekologiya vazirligi' },
  { rel: 58, relVar: 'var(--rel-50)', type: 'QAROR', num: '812', title: "Elektron hujjat aylanishi tizimini takomillashtirish chora-tadbirlari to'g'risida", org: 'Vazirlar Mahkamasi' },
  { rel: 52, relVar: 'var(--rel-50)', type: 'XAT', num: '19-X', title: "Oliy ta'lim muassasalarida raqamli kompetensiyalarni oshirish bo'yicha", org: "Oliy ta'lim vazirligi" },
]

function SimilarTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {SIMILAR.map((doc, i) => (
        <div key={i} style={{
          display: 'flex', overflow: 'hidden',
          background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 4,
        }}>
          <div style={{ width: 4, flexShrink: 0, background: doc.relVar }} />
          <div style={{
            flex: 1, padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <Mono size={12} color={doc.relVar as string}>{doc.rel}%</Mono>
            <span style={{
              fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
              letterSpacing: '0.07em', textTransform: 'uppercase' as const,
              color: 'var(--ink-2)', background: 'var(--badge-bg)',
              border: '1px solid var(--hairline)', borderRadius: 4,
              padding: '2px 7px', whiteSpace: 'nowrap' as const,
            }}>
              {doc.type}
            </span>
            <Mono size={12} color="var(--ink-2)">{doc.num}</Mono>
            <p
              style={{
                flex: 1, fontSize: 13, fontWeight: 500, color: 'var(--ink)',
                margin: 0, cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink)')}
            >
              {doc.title}
            </p>
            <span style={{ fontSize: 12, color: 'var(--ink-2)', whiteSpace: 'nowrap' as const, flexShrink: 0 }}>
              {doc.org}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Right sidebar ─────────────────────────────────────────────────────────────

function RightColumn() {
  const pipelineSteps = [
    { label: 'Matn ajratildi', timing: '0.8 s' },
    { label: "Til aniqlandi: o'zbek (lotin)", timing: null },
    { label: 'Normalizatsiya bajarildi', timing: null },
    { label: '24 ta chunk yaratildi', timing: null },
    { label: 'Vektorlashtirildi · bge-m3', timing: null },
    { label: "Indeksga qo'shildi", timing: '1.4 s' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Pipeline */}
      <SideCard title="Qayta ishlash bosqichlari">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pipelineSteps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="7" cy="7" r="6.5" fill="var(--ok-bg)" stroke="var(--ok-border)"/>
                <path d="M4 7l2 2 4-4" stroke="var(--ok)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ flex: 1, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.4 }}>{s.label}</span>
              {s.timing && (
                <Mono size={11} color="var(--ink-3)">{s.timing}</Mono>
              )}
            </div>
          ))}
        </div>
      </SideCard>

      {/* Privacy */}
      <SideCard title="Maxfiylik va kirish">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            ['Maxfiylik darajasi', 'Ochiq'],
            ['Kirish huquqi', 'Barcha xodimlar'],
            ["Ko'rishlar soni", '47'],
            ["So'nggi ko'rish", '07.08.2026'],
          ].map(([k, v], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 12, color: 'var(--ink-2)' }}>{k}</span>
              <span style={{
                fontSize: 12, color: 'var(--ink)', fontWeight: 500,
                fontFamily: (k === "Ko'rishlar soni" || k === "So'nggi ko'rish") ? 'var(--mono)' : 'var(--sans)',
              }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      </SideCard>

      {/* Audit */}
      <SideCard title="Audit">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { time: '2025-03-14 09:12', event: 'Hujjat yuklandi', user: 'admin@hokimlik.uz' },
            { time: '2025-03-14 09:13', event: 'Indekslandi va vektorlashtirildi', user: 'sistema' },
            { time: '2025-03-14 09:14', event: 'AI xulosa yaratildi', user: 'gpt-service' },
          ].map((log, i) => (
            <div key={i} style={{ borderBottom: i < 2 ? '1px solid var(--hairline)' : 'none', paddingBottom: i < 2 ? 10 : 0 }}>
              <Mono size={11} color="var(--ink-3)">{log.time}</Mono>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)', margin: '2px 0 0' }}>
                {log.event}
              </p>
              <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--ink-3)' }}>{log.user}</span>
            </div>
          ))}
        </div>
      </SideCard>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function DocumentDetail({ onBack, onAiChat }: { onBack: () => void; onAiChat?: () => void }) {
  const [tab, setTab] = useState<Tab>('ai')

  const tabs: { id: Tab; label: string }[] = [
    { id: 'ai', label: 'AI xulosa' },
    { id: 'text', label: 'Hujjat matni' },
    { id: 'similar', label: "O'xshash hujjatlar (4)" },
  ]

  const btnBase: CSSProperties = {
    fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600,
    borderRadius: 4, padding: '0 16px', height: 36, cursor: 'pointer',
    border: 'none', display: 'inline-flex', alignItems: 'center', gap: 6,
    transition: 'background 0.15s, color 0.15s',
  }

  return (
    <div style={{ background: 'var(--canvas)' }}>
      <div style={{ padding: '28px 32px 48px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20 }}>
          <button
            onClick={onBack}
            style={{
              fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)',
              background: 'none', border: 'none', padding: 0, cursor: 'pointer',
              transition: 'color 0.12s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--navy)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink-2)')}
          >
            Semantik qidiruv
          </button>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: 'var(--ink-3)', flexShrink: 0 }}>
            <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-2)' }}>Farmoyish 112-F</span>
        </div>

        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24, marginBottom: 16 }}>
          <h1 style={{
            fontFamily: 'var(--sans)', fontSize: 26, fontWeight: 600,
            color: 'var(--ink)', margin: 0, lineHeight: 1.3,
          }}>
            «Yashil makon» loyihasi doirasida ko'chat ekish tadbirlari to'g'risida
          </h1>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0, marginTop: 4 }}>
            <button
              style={{ ...btnBase, color: 'var(--ink)', background: 'var(--surface)', border: '1px solid var(--hairline)' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F0F3F7')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v8M4 6l3 3 3-3M2 10v1.5A1.5 1.5 0 003.5 13h7a1.5 1.5 0 001.5-1.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Yuklab olish
            </button>
            <button
              onClick={onAiChat}
              style={{ ...btnBase, color: 'var(--navy-fg)', background: 'var(--navy)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--navy-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--navy)')}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7a5 5 0 1010 0A5 5 0 002 7z" stroke="currentColor" strokeWidth="1.3"/>
                <path d="M5 7h4M7 5v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              AI savol berish
            </button>
          </div>
        </div>

        {/* Metadata pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          <Pill>Farmoyish</Pill>
          <Pill color="var(--ink-2)" bg="var(--badge-bg)">
            <Mono size={12} color="var(--ink-2)">112-F</Mono>
          </Pill>
          <Pill color="var(--ink-2)" bg="var(--badge-bg)">
            <Mono size={12} color="var(--ink-2)">14.03.2025</Mono>
          </Pill>
          <Pill color="var(--ink-2)" bg="var(--badge-bg)" border="var(--hairline)">
            Toshkent shahar hokimligi
          </Pill>
          <span style={{
            display: 'inline-flex', alignItems: 'center',
            fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
            letterSpacing: '0.07em', textTransform: 'uppercase' as const,
            color: 'var(--ok)', background: 'var(--ok-bg)',
            border: '1px solid var(--ok-border)', borderRadius: 4,
            padding: '3px 8px', lineHeight: 1.5,
          }}>
            Ochiq
          </span>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Main column */}
          <div>
            {/* Tabs */}
            <div style={{
              display: 'flex', borderBottom: '1px solid var(--hairline)',
              marginBottom: 20, gap: 0,
            }}>
              {tabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    fontFamily: 'var(--sans)', fontSize: 13,
                    fontWeight: tab === t.id ? 600 : 400,
                    color: tab === t.id ? 'var(--navy)' : 'var(--ink-2)',
                    background: 'none', border: 'none',
                    borderBottom: tab === t.id ? '2px solid var(--navy)' : '2px solid transparent',
                    padding: '0 16px 10px',
                    cursor: 'pointer', marginBottom: -1,
                    transition: 'color 0.12s, border-color 0.12s',
                  }}
                  onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = 'var(--ink)' }}
                  onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = 'var(--ink-2)' }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {tab === 'ai' && <AiTab />}
            {tab === 'text' && <TextTab />}
            {tab === 'similar' && <SimilarTab />}
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
