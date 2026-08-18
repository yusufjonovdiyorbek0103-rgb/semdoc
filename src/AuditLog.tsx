import { useState, useEffect } from 'react'
import { getAuditLog } from './lib/documents'

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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      padding: '11px 18px', borderBottom: '1px solid var(--hairline)',
      fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
      letterSpacing: '0.09em', textTransform: 'uppercase' as const, color: 'var(--ink-3)',
    }}>
      {children}
    </div>
  )
}

// ── Action badge ──────────────────────────────────────────────────────────────

const ACTION_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  'Kirish':             { color: '#1A5BB5', bg: '#EEF3FA', border: '#C8D8EA' },
  'Qidiruv':            { color: '#1A3A6B', bg: '#E8EEF4', border: '#B8CDE0' },
  "Hujjat ko'rish":     { color: '#5A6A7A', bg: '#F0F3F7', border: 'var(--hairline)' },
  'Yuklash':            { color: '#1A7A4A', bg: 'var(--ok-bg)', border: 'var(--ok-border)' },
  'Tasdiqlash':         { color: '#1A7A4A', bg: 'var(--ok-bg)', border: 'var(--ok-border)' },
  "Sozlama o'zgarishi": { color: '#8A5200', bg: 'var(--warn-bg)', border: 'var(--warn-border)' },
  "Chiqish":            { color: '#5A6A7A', bg: '#F0F3F7', border: 'var(--hairline)' },
}

function ActionBadge({ label }: { label: string }) {
  const style = ACTION_COLORS[label] ?? { color: 'var(--ink-2)', bg: 'var(--badge-bg)', border: 'var(--hairline)' }
  return (
    <span style={{
      fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
      letterSpacing: '0.04em',
      color: style.color, background: style.bg,
      border: `1px solid ${style.border}`,
      borderRadius: 3, padding: '2px 7px', whiteSpace: 'nowrap' as const,
    }}>
      {label}
    </span>
  )
}

// ── Result cell with tooltip ──────────────────────────────────────────────────

function ResultCell({ ok, reason }: { ok: boolean; reason?: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
        color: ok ? 'var(--ok)' : 'var(--danger)',
        background: ok ? 'var(--ok-bg)' : 'var(--danger-bg)',
        border: `1px solid ${ok ? 'var(--ok-border)' : 'var(--danger-border)'}`,
        borderRadius: 3, padding: '2px 7px', whiteSpace: 'nowrap' as const,
      }}>
        {ok ? 'Muvaffaqiyatli' : 'Rad etildi'}
      </span>
      {!ok && reason && (
        <span
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{ cursor: 'help', display: 'flex', alignItems: 'center' }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="5.5" stroke="var(--danger)" strokeWidth="1.2"/>
            <path d="M6.5 4.5v3M6.5 9h.01" stroke="var(--danger)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          {hov && (
            <span style={{
              position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--ink)', color: '#fff',
              fontFamily: 'var(--sans)', fontSize: 11, lineHeight: 1.4,
              padding: '6px 10px', borderRadius: 4, whiteSpace: 'nowrap' as const,
              zIndex: 200, pointerEvents: 'none',
              boxShadow: '0 2px 8px rgba(10,29,58,0.18)',
            }}>
              {reason}
              <span style={{
                position: 'absolute', top: '100%', left: '50%',
                transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: '5px solid var(--ink)',
              }} />
            </span>
          )}
        </span>
      )}
    </div>
  )
}

// ── Audit rows ────────────────────────────────────────────────────────────────

interface AuditRow {
  time: string
  user: string
  role: string
  action: string
  object: string
  ip: string
  ok: boolean
  reason?: string
}

const FALLBACK_ROWS: AuditRow[] = [
  { time: '—', user: 'admin', role: 'Admin', action: 'Kirish', object: 'Tizim', ip: '—', ok: true },
]

// ── Table ─────────────────────────────────────────────────────────────────────

const COL_HEADS = ['Vaqt', 'Foydalanuvchi', 'Rol', 'Harakat', 'Obyekt', 'IP', 'Natija']

const IP_MAP: Record<string, string> = {
  'a.karimov':   '10.0.1.12',
  'n.yusupova':  '10.0.1.27',
  'b.toshmatov': '10.0.2.44',
  'm.ergasheva': '10.0.1.63',
  's.nazarov':   '10.0.2.81',
}

function AuditTable({ rows }: { rows: AuditRow[] }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 4, overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
          <thead>
            <tr style={{ background: '#F4F6FA' }}>
              {COL_HEADS.map((h) => (
                <th key={h} style={{
                  padding: '9px 14px',
                  fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                  color: 'var(--ink-3)', textAlign: 'left' as const,
                  borderBottom: '2px solid var(--hairline)',
                  whiteSpace: 'nowrap' as const,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                style={{
                  background: !row.ok ? '#FEF9F9' : i % 2 === 0 ? 'var(--surface)' : '#FAFBFC',
                  borderBottom: '1px solid var(--hairline)',
                }}
              >
                <td style={{ padding: '0 14px', height: 40 }}>
                  <Mono size={11} color="var(--ink-2)">{row.time}</Mono>
                </td>
                <td style={{ padding: '0 14px', height: 40 }}>
                  <Mono size={12} color="var(--navy)">{row.user}</Mono>
                </td>
                <td style={{ padding: '0 14px', height: 40, whiteSpace: 'nowrap' as const }}>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)' }}>
                    {row.role}
                  </span>
                </td>
                <td style={{ padding: '0 14px', height: 40 }}>
                  <ActionBadge label={row.action} />
                </td>
                <td style={{ padding: '0 14px', height: 40, maxWidth: 220 }}>
                  <span style={{
                    fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
                    display: 'block',
                  }}>
                    {row.object}
                  </span>
                </td>
                <td style={{ padding: '0 14px', height: 40 }}>
                  <Mono size={11} color="var(--ink-3)">{row.ip}</Mono>
                </td>
                <td style={{ padding: '0 14px', height: 40 }}>
                  <ResultCell ok={row.ok} reason={row.reason} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table footer */}
      <div style={{
        padding: '9px 14px', borderTop: '1px solid var(--hairline)',
        display: 'flex', alignItems: 'center', gap: 12, background: '#F9FAFB',
      }}>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)' }}>
          Jami <Mono size={11} color="var(--ink)">{rows.length}</Mono> ta yozuv ko'rsatilmoqda
        </span>
      </div>
    </div>
  )
}

// ── Access matrix ─────────────────────────────────────────────────────────────

const ROLES = ['Administrator', 'Rahbar', 'Ijrochi', 'Kotibiyat']
const LEVELS = ['Ochiq', 'Xizmat uchun', 'Maxfiy']

const MATRIX: boolean[][] = [
  [true,  true,  true ],   // Administrator
  [true,  true,  true ],   // Rahbar
  [true,  true,  false],   // Ijrochi
  [true,  false, false],   // Kotibiyat
]

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'block', margin: '0 auto' }}>
      <circle cx="7" cy="7" r="6" fill="var(--ok-bg)" stroke="var(--ok-border)"/>
      <path d="M4.5 7l2 2L9.5 5" stroke="var(--ok)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function DashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ display: 'block', margin: '0 auto' }}>
      <circle cx="7" cy="7" r="6" fill="#F4F6FA" stroke="var(--hairline)"/>
      <path d="M4.5 7h5" stroke="var(--ink-3)" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  )
}

function AccessMatrix() {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 4, overflow: 'hidden',
    }}>
      <SectionLabel>Maxfiylik darajalari va kirish matritsasi</SectionLabel>
      <div style={{ padding: '0 0 14px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F4F6FA' }}>
              <th style={{
                padding: '9px 18px', textAlign: 'left' as const,
                fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                color: 'var(--ink-3)', borderBottom: '1px solid var(--hairline)',
              }}>
                Rol
              </th>
              {LEVELS.map(l => (
                <th key={l} style={{
                  padding: '9px 18px', textAlign: 'center' as const, width: 120,
                  fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                  color: 'var(--ink-3)', borderBottom: '1px solid var(--hairline)',
                }}>
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLES.map((role, ri) => (
              <tr key={role} style={{ borderBottom: ri < ROLES.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
                <td style={{ padding: '11px 18px', fontSize: 13, fontWeight: 500, color: 'var(--ink)' }}>
                  {role}
                </td>
                {MATRIX[ri].map((allowed, ci) => (
                  <td key={ci} style={{ padding: '11px 18px', textAlign: 'center' as const }}>
                    {allowed ? <CheckIcon /> : <DashIcon />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{
          fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-3)',
          margin: '12px 18px 0', lineHeight: 1.55,
        }}>
          Matritsa tizim sozlamalarida belgilanadi. O'zgartirish faqat administrator huquqi bilan amalga oshiriladi.
        </p>
      </div>
    </div>
  )
}

// ── Data locality card ────────────────────────────────────────────────────────

const LOCALITY_ITEMS = [
  "Barcha ma'lumotlar yopiq konturda saqlanadi",
  "Tashqi API'ga so'rov yuborilmaydi",
  "Embedding va generatsiya modellari lokal serverda ishlaydi",
  "Zaxira nusxa: har kuni 02:00, saqlash muddati 90 kun",
]

function LocalityCard() {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 4, overflow: 'hidden',
    }}>
      <SectionLabel>Ma'lumotlar joylashuvi</SectionLabel>
      <div style={{ padding: '4px 0 8px' }}>
        {LOCALITY_ITEMS.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 18px',
            borderBottom: i < LOCALITY_ITEMS.length - 1 ? '1px solid var(--hairline)' : 'none',
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
              <circle cx="8" cy="8" r="7" fill="var(--ok-bg)" stroke="var(--ok-border)"/>
              <path d="M5 8l2.5 2.5L11 6" stroke="var(--ok)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Filter row ────────────────────────────────────────────────────────────────

function FilterRow() {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)',
      borderRadius: 4, padding: '12px 16px',
      display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' as const,
      marginBottom: 18,
    }}>
      {[
        {
          label: 'Foydalanuvchi',
          options: ['Barchasi', 'a.karimov', 'n.yusupova', 'b.toshmatov', 'm.ergasheva', 's.nazarov'],
        },
        {
          label: 'Harakat turi',
          options: ['Barchasi', 'Kirish', 'Qidiruv', "Hujjat ko'rish", 'Yuklash', 'Tasdiqlash', "Sozlama o'zgarishi"],
        },
        {
          label: 'Maxfiylik darajasi',
          options: ['Barchasi', 'Ochiq', 'Xizmat uchun', 'Maxfiy'],
        },
      ].map(({ label, options }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, color: 'var(--ink-2)' }}>
            {label}
          </label>
          <select style={{
            height: 32, background: 'var(--background)',
            border: '1px solid var(--hairline)', borderRadius: 4,
            color: 'var(--ink)', fontSize: 13, padding: '0 10px',
            fontFamily: 'var(--sans)', minWidth: 160, cursor: 'pointer',
          }}>
            {options.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      ))}

      {/* Date range */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={{ fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500, color: 'var(--ink-2)' }}>
          Sana oralig'i
        </label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="date" defaultValue="2026-08-08" style={{
            height: 32, background: 'var(--background)',
            border: '1px solid var(--hairline)', borderRadius: 4,
            color: 'var(--ink)', fontSize: 12, padding: '0 8px',
            fontFamily: 'var(--sans)',
          }} />
          <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>—</span>
          <input type="date" defaultValue="2026-08-08" style={{
            height: 32, background: 'var(--background)',
            border: '1px solid var(--hairline)', borderRadius: 4,
            color: 'var(--ink)', fontSize: 12, padding: '0 8px',
            fontFamily: 'var(--sans)',
          }} />
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Export */}
      <button style={{
        fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
        color: 'var(--ink)', background: 'var(--surface)',
        border: '1px solid var(--hairline)', borderRadius: 4,
        padding: '0 16px', height: 32, cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 7,
        transition: 'background 0.12s, border-color 0.12s',
        alignSelf: 'flex-end',
      }}
        onMouseEnter={e => { e.currentTarget.style.background = '#F0F3F7'; e.currentTarget.style.borderColor = '#C8D0DA' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.borderColor = 'var(--hairline)' }}
      >
        <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
          <path d="M6.5 1v7M3.5 5.5l3 3 3-3M2 9v1.5A1.5 1.5 0 003.5 12h6A1.5 1.5 0 0011 10.5V9"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        CSV ga eksport
      </button>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

export default function AuditLog({ onNav }: { onNav?: (s: string) => void }) {
  const [rows, setRows] = useState<AuditRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAuditLog(100).then(data => {
      const mapped: AuditRow[] = data.map((r: any) => ({
        time: new Date(r.created_at).toLocaleString('uz-Latn'),
        user: r.user_email || 'admin',
        role: 'Admin',
        action: r.action || '—',
        object: r.details?.file_name || r.details?.query || r.entity_type || '—',
        ip: '—',
        ok: true,
      }))
      setRows(mapped.length > 0 ? mapped : FALLBACK_ROWS)
      setLoading(false)
    }).catch(() => {
      setRows(FALLBACK_ROWS)
      setLoading(false)
    })
  }, [])

  return (
    <div style={{ background: 'var(--canvas)' }}>
      <div style={{ padding: '28px 32px 48px' }}>

        {/* Page header */}
        <div style={{ marginBottom: 24 }}>
          <p style={{
            fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.10em',
            color: 'var(--ink-3)', textTransform: 'uppercase', margin: '0 0 8px',
          }}>
            TIZIM
          </p>
          <h1 style={{
            fontFamily: 'var(--sans)', fontSize: 28, fontWeight: 700,
            color: 'var(--ink)', margin: '0 0 8px', lineHeight: 1.2,
          }}>
            Audit jurnali
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
            Tizimdagi barcha harakatlar o'zgartirilmas tarzda qayd etiladi.
          </p>
        </div>

        <FilterRow />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Yuklanmoqda...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <AuditTable rows={rows} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
              <AccessMatrix />
              <LocalityCard />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
