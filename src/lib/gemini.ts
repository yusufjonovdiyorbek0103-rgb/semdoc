const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY
const BASE = 'https://generativelanguage.googleapis.com/v1beta'

export async function getEmbedding(text: string): Promise<number[]> {
  const res = await fetch(
    `${BASE}/models/text-embedding-004:embedContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: { parts: [{ text }] },
      }),
    }
  )
  if (!res.ok) throw new Error(`Embedding error: ${res.status}`)
  const data = await res.json()
  return data.embedding.values
}

export async function getEmbeddings(texts: string[]): Promise<number[][]> {
  const res = await fetch(
    `${BASE}/models/text-embedding-004:batchEmbedContents?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: texts.map(text => ({
          model: 'models/text-embedding-004',
          content: { parts: [{ text }] },
        })),
      }),
    }
  )
  if (!res.ok) throw new Error(`Batch embedding error: ${res.status}`)
  const data = await res.json()
  return data.embeddings.map((e: { values: number[] }) => e.values)
}

export async function chatWithDocs(
  query: string,
  contexts: { content: string; docTitle: string; docNumber: string; page: number | null }[]
): Promise<string> {
  const contextText = contexts
    .map((c, i) => `[Manba ${i + 1}: ${c.docTitle} (${c.docNumber}), ${c.page ? c.page + '-bet' : ''}]\n${c.content}`)
    .join('\n\n---\n\n')

  const res = await fetch(
    `${BASE}/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Sen O'zbek tilida javob beradigan hujjat tahlil yordamchisisisan. Quyidagi hujjat qismlariga asoslanib savolga javob ber.

MUHIM QOIDALAR:
- Faqat berilgan hujjat qismlari asosida javob ber
- Har bir da'voni manba raqami bilan tasdiqlа, masalan [Manba 1]
- Agar javob topilmasa, "Ishonchli javob berish uchun yetarli manba topilmadi" de
- O'zbek tilida (lotin yozuvida) javob ber
- Qisqa va aniq javob ber

HUJJAT QISMLARI:
${contextText}

SAVOL: ${query}`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
      }),
    }
  )
  if (!res.ok) throw new Error(`Chat error: ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Javob olinmadi.'
}

export async function classifyDocument(text: string): Promise<{
  docType: string
  topic: string
  department: string
  confidence: number
  reason: string
}> {
  const res = await fetch(
    `${BASE}/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Quyidagi hujjat matnini tahlil qilib, JSON formatida javob ber:

{
  "docType": "Qaror|Buyruq|Farmoyish|Xat|Murojaat|Bayonnoma|Nizom|Hisobot",
  "topic": "mavzu toifasi, masalan: Ekologiya · Ko'kalamzorlashtirish",
  "department": "mas'ul bo'lim nomi",
  "confidence": 0-100 oralig'ida ishonchlilik foizi,
  "reason": "tasniflash sababi, qisqa izoh"
}

Faqat JSON qaytar, boshqa matn bo'lmasin.

HUJJAT MATNI (birinchi 2000 belgi):
${text.slice(0, 2000)}`
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 512,
        },
      }),
    }
  )
  if (!res.ok) throw new Error(`Classify error: ${res.status}`)
  const data = await res.json()
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
  const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
  return JSON.parse(cleaned)
}

export async function summarizeDocument(text: string): Promise<string> {
  const res = await fetch(
    `${BASE}/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Quyidagi hujjat matnining qisqa xulosasini o'zbek tilida (lotin yozuvida) yoz. 3-5 jumla bilan asosiy mazmunni yetkazib ber.

HUJJAT MATNI:
${text.slice(0, 4000)}`
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 512,
        },
      }),
    }
  )
  if (!res.ok) throw new Error(`Summary error: ${res.status}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text || ''
}
