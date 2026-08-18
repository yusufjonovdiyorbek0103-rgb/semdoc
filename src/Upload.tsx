import { useState, useRef, useEffect, CSSProperties } from 'react'
import { processDocument, getStats } from './lib/documents'
import { extractTextFromPdf } from './lib/pdf'

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

// ── Stage types ───────────────────────────────────────────────────────────────

type StageState = 'done' | 'active' | 'pending'

const STAGE_LABELS = ['YUKLASH', 'MATN AJRATISH', 'OCR', 'NORMALIZATSIYA', 'CHUNKING', 'INDEKSLASH']

interface StageInfo {
  state: StageState
  duration?: string
}

// ── Pipeline indicator ────────────────────────────────────────────────────────

function PipelineBar({ stages }: { stages: StageInfo[] }) {
  return (
    <div style={{ display: 'flex', gap: 0, alignItems: 'flex-start', width: '100%' }}>
      {stages.map((stage, i) => {
        const isLast = i === stages.length - 1
        const segColor =
          stage.state === 'done' ? 'var(--navy)'
          : stage.state === 'active' ? 'var(--rel-50)'
          : 'var(--hairline)'

        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Segment */}
              <div style={{
                flex: 1, height: 5, background: segColor, borderRadius: i === 0 ? '3px 0 0 3px' : isLast ? '0 3px 3px 0' : 0,
                position: 'relative', overflow: 'visible',
                animation: stage.state === 'active' ? 'pulse-seg 1.4s ease-in-out infinite' : 'none',
              }} />
              {/* Connector dot (not on last) */}
              {!isLast && (
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: stage.state === 'done' ? 'var(--navy)' : 'var(--hairline)',
                  border: `1.5px solid ${stage.state === 'active' ? 'var(--rel-50)' : stage.state === 'done' ? 'var(--navy)' : 'var(--hairline)'}`,
                }} />
              )}
            </div>
            {/* Label + duration */}
            <div style={{ paddingTop: 4, paddingRight: isLast ? 0 : 6 }}>
              <div style={{
                fontFamily: 'var(--sans)', fontSize: 9, fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase' as const,
                color: stage.state === 'done' ? 'var(--navy)' : stage.state === 'active' ? 'var(--rel-50)' : 'var(--ink-3)',
                lineHeight: 1.3,
              }}>
                {STAGE_LABELS[i]}
              </div>
              {stage.duration && (
                <Mono size={9} color={stage.state === 'done' ? 'var(--ink-2)' : 'var(--rel-50)'}>
                  {stage.duration}
                </Mono>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Expanded detail panel ─────────────────────────────────────────────────────

function DetailPanel() {
  const attrStyle: CSSProperties = {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '7px 0', borderBottom: '1px solid var(--hairline)', gap: 8,
  }

  const attrs = [
    { label: 'Hujjat turi', value: 'Qaror', conf: '97%' },
    { label: "Ro'yxat raqami", value: '812', conf: '94%' },
    { label: 'Sana', value: '15.11.2024', conf: '99%' },
    { label: 'Chiqaruvchi organ', value: 'Vazirlar Mahkamasi', conf: '91%' },
  ]

  return (
    <div style={{
      borderTop: '1px solid var(--hairline)',
      background: '#F7F9FB',
      padding: '16px 20px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 24,
    }}>
      {/* Attributes */}
      <div>
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase' as const,
          color: 'var(--ink-3)', marginBottom: 10,
        }}>
          Ajratilgan atributlar
        </div>
        {attrs.map((a, i) => (
          <div key={i} style={{ ...attrStyle, borderBottom: i < attrs.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--ink-2)', marginBottom: 1 }}>{a.label}</div>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{a.value}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <Mono size={11} color="var(--ok)">{a.conf}</Mono>
              <button style={{
                background: 'none', border: 'none', padding: 2, cursor: 'pointer', color: 'var(--ink-3)',
                display: 'flex', alignItems: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M8.5 1.5l2 2L4 10H2V8L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Normalization */}
      <div>
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase' as const,
          color: 'var(--ink-3)', marginBottom: 10,
        }}>
          Normalizatsiya
        </div>
        {[
          ["Yozuv", "kirill → lotin (1 240 so'z)"],
          ['Lemmatizatsiya', '3 480 token'],
          ["Stop-so'zlar", 'olib tashlandi: 412'],
          ["Qisqartmalar", 'yozildi: 18'],
        ].map(([k, v], i, arr) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column',
            padding: '7px 0',
            borderBottom: i < arr.length - 1 ? '1px solid var(--hairline)' : 'none',
          }}>
            <span style={{ fontSize: 11, color: 'var(--ink-2)' }}>{k}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink)', marginTop: 2 }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Vectorization */}
      <div>
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase' as const,
          color: 'var(--ink-3)', marginBottom: 10,
        }}>
          Vektorlashtirish
        </div>
        {[
          ['Model', 'bge-m3'],
          ["Chunk o'lchami", '512 token, 64 overlap'],
          ['Chunklar', '24'],
          ["Vektor o'lchami", '1024'],
          ['Indeks', 'Qdrant · gov_docs'],
        ].map(([k, v], i, arr) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column',
            padding: '7px 0',
            borderBottom: i < arr.length - 1 ? '1px solid var(--hairline)' : 'none',
          }}>
            <span style={{ fontSize: 11, color: 'var(--ink-2)' }}>{k}</span>
            <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink)', marginTop: 2 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── File row ──────────────────────────────────────────────────────────────────

type RowStatus = 'done' | 'active' | 'warn' | 'error'

interface FileRow {
  name: string
  size: string
  stages: StageInfo[]
  status: RowStatus
  statusNote?: React.ReactNode
  summary?: string
  expandable?: boolean
}

function FileIcon({ ext }: { ext: string }) {
  const color = ext === 'pdf' ? '#C0392B' : ext === 'docx' ? '#2E5EA8' : 'var(--ink-3)'
  return (
    <div style={{
      width: 32, height: 38, background: color, borderRadius: 3,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      paddingBottom: 5, flexShrink: 0,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 0, height: 0,
        borderStyle: 'solid',
        borderWidth: '0 10px 10px 0',
        borderColor: `transparent rgba(255,255,255,0.35) transparent transparent`,
      }} />
      <span style={{ fontFamily: 'var(--mono)', fontSize: 8, color: '#fff', fontWeight: 700, letterSpacing: '0.05em' }}>
        {ext.toUpperCase()}
      </span>
    </div>
  )
}

function StatusIcon({ status }: { status: RowStatus }) {
  if (status === 'done' || status === 'warn') {
    return (
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: status === 'done' ? 'var(--ok-bg)' : 'var(--warn-bg)',
        border: `1.5px solid ${status === 'done' ? 'var(--ok-border)' : 'var(--warn-border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d={status === 'done' ? 'M2 5l2.5 2.5L8 3' : 'M5 3v2.5M5 7h.01'}
            stroke={status === 'done' ? 'var(--ok)' : 'var(--warn)'}
            strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: 'var(--danger-bg)', border: '1.5px solid var(--danger-border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M3 3l4 4M7 3l-4 4" stroke="var(--danger)" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </div>
    )
  }
  // active — spinner
  return (
    <div style={{
      width: 20, height: 20, borderRadius: '50%',
      border: '2px solid var(--hairline)',
      borderTopColor: 'var(--navy)',
      animation: 'spin 0.9s linear infinite', flexShrink: 0,
    }} />
  )
}

function FileRowItem({ row }: { row: FileRow }) {
  const [expanded, setExpanded] = useState(false)
  const ext = row.name.split('.').pop() || 'pdf'

  return (
    <div style={{ borderBottom: '1px solid var(--hairline)' }}>
      {/* Main row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '36px 1fr auto',
        gap: 14,
        padding: '14px 20px',
        alignItems: 'start',
        cursor: row.expandable ? 'pointer' : 'default',
        background: expanded ? '#F7F9FB' : 'transparent',
        transition: 'background 0.12s',
      }}
        onClick={() => row.expandable && setExpanded(v => !v)}
      >
        <FileIcon ext={ext} />

        <div style={{ minWidth: 0 }}>
          {/* Name + size + status icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <StatusIcon status={row.status} />
            <span style={{
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
              color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const,
              flex: 1,
            }}>
              {row.name}
            </span>
            <Mono size={12} color="var(--ink-2)">{row.size}</Mono>
            {row.expandable && (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ color: 'var(--ink-3)', transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>

          {/* Pipeline */}
          <PipelineBar stages={row.stages} />

          {/* Status note */}
          {row.summary && (
            <p style={{
              fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ok)',
              margin: '8px 0 0', lineHeight: 1.4,
            }}>
              {row.summary}
            </p>
          )}
          {row.statusNote && (
            <div style={{ marginTop: 8 }}>{row.statusNote}</div>
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {expanded && row.expandable && <DetailPanel />}
    </div>
  )
}

// ── Upload zone ───────────────────────────────────────────────────────────────

function UploadZone({ onFilesSelected }: { onFilesSelected: (files: File[]) => void }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (fileList: FileList | null) => {
    if (fileList && fileList.length > 0) {
      onFilesSelected(Array.from(fileList))
    }
  }

  return (
    <div
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
      style={{
        height: 140,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        gap: 8,
        background: dragging ? '#EEF3FA' : 'var(--surface)',
        border: `2px dashed ${dragging ? 'var(--navy)' : 'var(--hairline)'}`,
        borderRadius: 4,
        cursor: 'pointer',
        transition: 'background 0.15s, border-color 0.15s',
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input ref={inputRef} type="file" multiple accept=".pdf,.docx,.doc,.txt" style={{ display: 'none' }}
        onChange={e => handleFiles(e.target.files)} />
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ color: 'var(--ink-3)' }}>
        <path d="M10 13V4M6 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <p style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 500, color: 'var(--ink)', margin: 0 }}>
        Fayllarni bu yerga tashlang yoki tanlang
      </p>
      <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-3)', margin: 0 }}>
        TXT, PDF, DOCX · maksimal 50 MB
      </p>
      <button
        onClick={e => { e.stopPropagation(); inputRef.current?.click() }}
        style={{
          marginTop: 4,
          fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500,
          color: 'var(--ink)', background: 'var(--surface)',
          border: '1px solid var(--hairline)', borderRadius: 4,
          padding: '5px 14px', cursor: 'pointer',
          transition: 'border-color 0.12s, color 0.12s',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.color = 'var(--navy)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--hairline)'; e.currentTarget.style.color = 'var(--ink)' }}
      >
        Fayl tanlash
      </button>
    </div>
  )
}

// ── Metadata form row ─────────────────────────────────────────────────────────

function MetaForm() {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 4,
      padding: '14px 16px',
      display: 'flex', gap: 16, flexWrap: 'wrap' as const, alignItems: 'flex-end',
    }}>
      {[
        { label: 'Tashkilot', options: ['Tashkilotni tanlang', 'Vazirlar Mahkamasi', 'Ekologiya vazirligi', 'Toshkent shahar hokimligi', "Oliy ta'lim vazirligi"] },
        { label: 'Hujjat turi', options: ['Avtomatik aniqlash', 'Qaror', 'Buyruq', 'Farmoyish', 'Xat', 'Bayonnoma'] },
        { label: 'Maxfiylik darajasi', options: ['Ochiq', 'Xizmat uchun'] },
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
      <label style={{
        display: 'flex', alignItems: 'center', gap: 7,
        fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)',
        cursor: 'pointer', paddingBottom: 6,
      }}>
        <input type="checkbox" style={{ width: 14, height: 14, accentColor: 'var(--navy)' }} />
        Skaner qilingan hujjat — OCR ni yoqish
      </label>
    </div>
  )
}

// ── Mock file rows ────────────────────────────────────────────────────────────

const ALL_DONE: StageInfo[] = [
  { state: 'done', duration: '0.3 s' },
  { state: 'done', duration: '0.6 s' },
  { state: 'done', duration: '—' },
  { state: 'done', duration: '0.4 s' },
  { state: 'done', duration: '0.1 s' },
  { state: 'done', duration: '1.4 s' },
]

const ACTIVE_ON_OCR: StageInfo[] = [
  { state: 'done', duration: '0.5 s' },
  { state: 'done', duration: '0.8 s' },
  { state: 'active', duration: '…' },
  { state: 'pending' },
  { state: 'pending' },
  { state: 'pending' },
]

const WARN_DONE: StageInfo[] = [
  { state: 'done', duration: '0.1 s' },
  { state: 'done', duration: '0.2 s' },
  { state: 'done', duration: '—' },
  { state: 'done', duration: '0.3 s' },
  { state: 'done', duration: '0.1 s' },
  { state: 'done', duration: '0.9 s' },
]

const FAILED_AT_2: StageInfo[] = [
  { state: 'done', duration: '0.4 s' },
  { state: 'active' },
  { state: 'pending' },
  { state: 'pending' },
  { state: 'pending' },
  { state: 'pending' },
]

function RetryButton() {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
        color: hovered ? 'var(--navy-fg)' : 'var(--danger)',
        background: hovered ? 'var(--navy)' : 'var(--danger-bg)',
        border: `1px solid ${hovered ? 'var(--navy)' : 'var(--danger-border)'}`,
        borderRadius: 4, padding: '3px 10px', cursor: 'pointer',
        transition: 'background 0.15s, color 0.15s, border-color 0.15s',
        marginLeft: 8,
      }}
    >
      Qayta urinish
    </button>
  )
}

const MOCK_ROWS: FileRow[] = [
  {
    name: '812-son_qaror_2024.pdf',
    size: '2.4 MB',
    stages: ALL_DONE,
    status: 'done',
    summary: "24 ta chunk · o'zbek (lotin) · 1.4 s",
    expandable: true,
  },
  {
    name: 'arxiv_skan_2023.pdf',
    size: '8.1 MB',
    stages: ACTIVE_ON_OCR,
    status: 'active',
    statusNote: (
      <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--rel-50)', margin: 0, lineHeight: 1.5 }}>
        OCR bajarilmoqda · 3/12 bet · aniqlangan til:{' '}
        <Mono size={12} color="var(--rel-50)">o'zbek (kirill)</Mono>
      </p>
    ),
  },
  {
    name: 'murojaat_0509.docx',
    size: '340 KB',
    stages: WARN_DONE,
    status: 'warn',
    statusNote: (
      <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--warn)', margin: 0, lineHeight: 1.5 }}>
        Hujjat kirill yozuvida — lotin transliteratsiyasi qo'shildi.
      </p>
    ),
  },
  {
    name: 'hisobot_2024.pdf',
    size: '12.7 MB',
    stages: FAILED_AT_2,
    status: 'error',
    statusNote: (
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0 }}>
        <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--danger)', margin: 0, lineHeight: 1.5 }}>
          Faylda matn qatlami topilmadi. OCR ni yoqib qayta yuklang.
        </p>
        <RetryButton />
      </div>
    ),
  },
]

// ── Stats card ────────────────────────────────────────────────────────────────

function StatsCard() {
  const stats = [
    { n: '47', label: 'Yuklangan hujjatlar' },
    { n: '44', label: 'Muvaffaqiyatli indekslangan' },
    { n: '12', label: 'OCR talab qilgan' },
    { n: '3', label: 'Xatolik bilan yakunlangan' },
  ]
  const colors = ['var(--ink)', 'var(--ok)', 'var(--warn)', 'var(--danger)']

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 4, overflow: 'hidden',
      position: 'sticky', top: 24,
    }}>
      <div style={{
        padding: '10px 16px', borderBottom: '1px solid var(--hairline)',
        fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--ink-3)',
      }}>
        Bugungi statistika
      </div>
      <div>
        {stats.map((s, i) => (
          <div key={i} style={{
            padding: '16px 20px',
            borderBottom: i < stats.length - 1 ? '1px solid var(--hairline)' : 'none',
          }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 500,
              color: colors[i], lineHeight: 1,
              marginBottom: 4,
            }}>
              {s.n}
            </div>
            <div style={{
              fontFamily: 'var(--sans)', fontSize: 11,
              color: 'var(--ink-3)', lineHeight: 1.4,
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div style={{
        padding: '10px 16px', borderTop: '1px solid var(--hairline)',
        background: '#F7F9FB',
      }}>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--ink-2)' }}>
          O'rtacha qayta ishlash vaqti:{' '}
          <Mono size={11} color="var(--ink)">6.2 s</Mono> / hujjat
        </span>
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────

interface UploadJob {
  file: File
  status: RowStatus
  stage: string
  detail?: string
  stages: StageInfo[]
  summary?: string
  error?: string
}

const STAGE_MAP: Record<string, number> = {
  upload: 0, classify: 1, summary: 2, chunk: 3, embed: 4, index: 5, done: 5,
}

function jobToStages(stage: string, status: RowStatus): StageInfo[] {
  const idx = STAGE_MAP[stage] ?? 0
  return STAGE_LABELS.map((_, i) => {
    if (status === 'error' && i === idx) return { state: 'active' as StageState }
    if (i < idx) return { state: 'done' as StageState, duration: '' }
    if (i === idx && status !== 'done') return { state: 'active' as StageState, duration: '...' }
    if (status === 'done') return { state: 'done' as StageState, duration: '' }
    return { state: 'pending' as StageState }
  })
}

export default function Upload({ onNav }: { onNav?: (screen: string) => void }) {
  const [jobs, setJobs] = useState<UploadJob[]>([])
  const [stats, setStats] = useState({ total: 0, indexed: 0, processing: 0, errors: 0 })

  useEffect(() => {
    getStats().then(s => setStats({
      total: s.total_documents || 0,
      indexed: s.indexed_documents || 0,
      processing: s.processing_documents || 0,
      errors: s.error_documents || 0,
    })).catch(() => {})
  }, [])

  const handleFiles = async (files: File[]) => {
    for (const file of files) {
      const job: UploadJob = {
        file,
        status: 'active',
        stage: 'upload',
        stages: jobToStages('upload', 'active'),
      }
      setJobs(prev => [job, ...prev])

      try {
        const isPdf = file.name.toLowerCase().endsWith('.pdf')
        const text = isPdf ? await extractTextFromPdf(file) : await file.text()
        if (!text.trim()) {
          setJobs(prev => prev.map(j => j.file === file ? {
            ...j, status: 'error' as RowStatus, error: isPdf ? 'PDF dan matn ajratib bo\'linmadi. OCR kerak bo\'lishi mumkin.' : 'Faylda matn topilmadi',
            stages: jobToStages('upload', 'error'),
          } : j))
          continue
        }

        await processDocument(text, file.name, {}, (stage, detail) => {
          setJobs(prev => prev.map(j => j.file === file ? {
            ...j, stage, detail, status: 'active' as RowStatus,
            stages: jobToStages(stage, 'active'),
          } : j))
        })

        setJobs(prev => prev.map(j => j.file === file ? {
          ...j, status: 'done' as RowStatus, stage: 'done',
          summary: 'Muvaffaqiyatli indekslandi',
          stages: jobToStages('done', 'done'),
        } : j))

        getStats().then(s => setStats({
          total: s.total_documents || 0,
          indexed: s.indexed_documents || 0,
          processing: s.processing_documents || 0,
          errors: s.error_documents || 0,
        })).catch(() => {})
      } catch (err: any) {
        setJobs(prev => prev.map(j => j.file === file ? {
          ...j, status: 'error' as RowStatus,
          error: err.message || 'Xatolik yuz berdi',
          stages: jobToStages(j.stage, 'error'),
        } : j))
      }
    }
  }

  const doneCount = jobs.filter(j => j.status === 'done').length
  const activeCount = jobs.filter(j => j.status === 'active').length
  const errorCount = jobs.filter(j => j.status === 'error').length

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse-seg {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>

      <div style={{ background: 'var(--canvas)' }}>
        <div style={{ padding: '28px 32px 48px' }}>

          {/* Page header */}
          <div style={{ marginBottom: 28 }}>
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
              Hujjat yuklash
            </h1>
            <p style={{ fontSize: 14, color: 'var(--ink-2)', margin: 0, lineHeight: 1.6 }}>
              TXT fayllarni yuklang. Tizim matnni tahlil qiladi, chunklarga bo'ladi va indekslaydi.
            </p>
          </div>

          {/* Two-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>

            {/* Left: upload + queue */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <UploadZone onFilesSelected={handleFiles} />
              <MetaForm />

              {/* Queue */}
              {jobs.length > 0 && (
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--hairline)',
                  borderRadius: 4, overflow: 'hidden',
                }}>
                  {/* Queue header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 20px', borderBottom: '1px solid var(--hairline)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{
                        fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--ink-3)',
                      }}>
                        Navbat
                      </span>
                      <span style={{
                        fontFamily: 'var(--mono)', fontSize: 11,
                        background: 'var(--badge-bg)', border: '1px solid var(--hairline)',
                        borderRadius: 4, padding: '1px 8px', color: 'var(--ink-2)',
                      }}>
                        {jobs.length} fayl
                      </span>
                      {doneCount > 0 && <span style={{ fontSize: 11, color: 'var(--ok)', fontWeight: 500 }}>{doneCount} tugallandi</span>}
                      {activeCount > 0 && <span style={{ fontSize: 11, color: 'var(--rel-50)', fontWeight: 500 }}>{activeCount} jarayonda</span>}
                      {errorCount > 0 && <span style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 500 }}>{errorCount} xatolik</span>}
                    </div>
                    <button onClick={() => setJobs([])} style={{
                      fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-2)',
                      background: 'none', border: '1px solid var(--hairline)', borderRadius: 4,
                      padding: '4px 12px', cursor: 'pointer',
                    }}>
                      Tozalash
                    </button>
                  </div>

                  {/* File rows */}
                  {jobs.map((job, i) => (
                    <FileRowItem key={i} row={{
                      name: job.file.name,
                      size: `${(job.file.size / 1024).toFixed(0)} KB`,
                      stages: job.stages,
                      status: job.status,
                      summary: job.summary,
                      statusNote: job.error ? (
                        <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--danger)', margin: 0, lineHeight: 1.5 }}>
                          {job.error}
                        </p>
                      ) : job.detail ? (
                        <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--rel-50)', margin: 0, lineHeight: 1.5 }}>
                          {job.detail}
                        </p>
                      ) : undefined,
                    }} />
                  ))}
                </div>
              )}

              {/* Show empty state when no jobs */}
              {jobs.length === 0 && (
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--hairline)',
                  borderRadius: 4, padding: '32px 20px', textAlign: 'center',
                }}>
                  <p style={{ fontSize: 13, color: 'var(--ink-3)', margin: 0 }}>
                    Hujjat yuklash uchun faylni tanlang yoki tortib tashlang.
                  </p>
                </div>
              )}
            </div>

            {/* Right: stats */}
            <div style={{
              background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 4, overflow: 'hidden',
              position: 'sticky', top: 24,
            }}>
              <div style={{
                padding: '10px 16px', borderBottom: '1px solid var(--hairline)',
                fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase' as const, color: 'var(--ink-3)',
              }}>
                Statistika
              </div>
              {[
                { n: String(stats.total), label: 'Jami hujjatlar', color: 'var(--ink)' },
                { n: String(stats.indexed), label: 'Indekslangan', color: 'var(--ok)' },
                { n: String(stats.processing), label: 'Jarayonda', color: 'var(--warn)' },
                { n: String(stats.errors), label: 'Xatolik', color: 'var(--danger)' },
              ].map((s, i, arr) => (
                <div key={i} style={{
                  padding: '16px 20px',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--hairline)' : 'none',
                }}>
                  <div style={{
                    fontFamily: 'var(--mono)', fontSize: 26, fontWeight: 500,
                    color: s.color, lineHeight: 1, marginBottom: 4,
                  }}>
                    {s.n}
                  </div>
                  <div style={{
                    fontFamily: 'var(--sans)', fontSize: 11,
                    color: 'var(--ink-3)', lineHeight: 1.4,
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
