import { supabase } from './supabase'
import { getEmbedding, getEmbeddings, classifyDocument, summarizeDocument } from './gemini'

function chunkText(text: string, chunkSize = 500, overlap = 100): { content: string; index: number }[] {
  const words = text.split(/\s+/)
  const chunks: { content: string; index: number }[] = []
  let i = 0
  let idx = 0
  while (i < words.length) {
    const chunk = words.slice(i, i + chunkSize).join(' ')
    if (chunk.trim()) {
      chunks.push({ content: chunk, index: idx++ })
    }
    i += chunkSize - overlap
  }
  return chunks
}

export async function processDocument(
  text: string,
  fileName: string,
  metadata?: { org?: string; docType?: string; privacy?: string },
  onProgress?: (stage: string, detail?: string) => void
) {
  onProgress?.('upload', 'Hujjat saqlanmoqda...')

  const { data: doc, error: docErr } = await supabase
    .from('documents')
    .insert({
      title: fileName.replace(/\.[^.]+$/, ''),
      file_name: fileName,
      full_text: text,
      status: 'processing',
      org: metadata?.org || null,
      doc_type: metadata?.docType || null,
      privacy: metadata?.privacy || 'Ochiq',
    })
    .select()
    .single()

  if (docErr || !doc) throw new Error(docErr?.message || 'Document insert failed')

  try {
    onProgress?.('classify', 'Tasniflanmoqda...')
    const classification = await classifyDocument(text)

    onProgress?.('summary', 'Xulosa yaratilmoqda...')
    const summary = await summarizeDocument(text)

    onProgress?.('chunk', 'Matn bo\'linmoqda...')
    const chunks = chunkText(text)

    onProgress?.('embed', `${chunks.length} ta chunk vektorlanmoqda...`)
    const batchSize = 20
    const allEmbeddings: number[][] = []
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      const embeddings = await getEmbeddings(batch.map(c => c.content))
      allEmbeddings.push(...embeddings)
    }

    onProgress?.('index', 'Indekslanmoqda...')
    const chunkRows = chunks.map((c, i) => ({
      document_id: doc.id,
      content: c.content,
      chunk_index: c.index,
      page_number: null,
      embedding: JSON.stringify(allEmbeddings[i]),
    }))

    const { error: chunkErr } = await supabase.from('chunks').insert(chunkRows)
    if (chunkErr) throw new Error(chunkErr.message)

    await supabase
      .from('documents')
      .update({
        title: classification.docType
          ? `${fileName.replace(/\.[^.]+$/, '')}`
          : doc.title,
        doc_type: metadata?.docType || classification.docType || null,
        topic: classification.topic || null,
        department: metadata?.org ? undefined : classification.department || null,
        summary,
        chunk_count: chunks.length,
        classification_confidence: classification.confidence / 100,
        status: 'indexed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', doc.id)

    await supabase.from('audit_log').insert({
      action: 'Yuklash',
      entity_type: 'document',
      entity_id: doc.id,
      details: {
        file_name: fileName,
        chunks: chunks.length,
        doc_type: classification.docType,
        confidence: classification.confidence,
      },
    })

    onProgress?.('done', 'Tayyor!')
    return { ...doc, classification, summary, chunkCount: chunks.length }
  } catch (err) {
    await supabase.from('documents').update({ status: 'error' }).eq('id', doc.id)
    throw err
  }
}

export async function searchDocuments(
  query: string,
  options?: { docType?: string; org?: string; privacy?: string; limit?: number }
) {
  const startTime = Date.now()
  const embedding = await getEmbedding(query)

  const { data, error } = await supabase.rpc('search_documents', {
    query_embedding: JSON.stringify(embedding),
    match_count: options?.limit || 10,
    similarity_threshold: 0.3,
    filter_doc_type: options?.docType || null,
    filter_org: options?.org || null,
    filter_privacy: options?.privacy || null,
  })

  const duration = Date.now() - startTime

  if (error) throw new Error(error.message)

  await supabase.from('search_history').insert({
    query,
    mode: 'semantic',
    result_count: data?.length || 0,
    duration_ms: duration,
  })

  await supabase.from('audit_log').insert({
    action: 'Qidiruv',
    entity_type: 'search',
    details: { query, results: data?.length || 0, duration_ms: duration },
  })

  const grouped = new Map<string, {
    document_id: string
    doc_title: string
    doc_type: string
    doc_number: string
    doc_date: string
    doc_org: string
    doc_department: string
    doc_privacy: string
    maxSimilarity: number
    chunks: { content: string; page: number | null; similarity: number }[]
  }>()

  for (const row of data || []) {
    const existing = grouped.get(row.document_id)
    if (existing) {
      existing.chunks.push({
        content: row.content,
        page: row.page_number,
        similarity: row.similarity,
      })
      if (row.similarity > existing.maxSimilarity) {
        existing.maxSimilarity = row.similarity
      }
    } else {
      grouped.set(row.document_id, {
        document_id: row.document_id,
        doc_title: row.doc_title,
        doc_type: row.doc_type,
        doc_number: row.doc_number,
        doc_date: row.doc_date,
        doc_org: row.doc_org,
        doc_department: row.doc_department,
        doc_privacy: row.doc_privacy,
        maxSimilarity: row.similarity,
        chunks: [{ content: row.content, page: row.page_number, similarity: row.similarity }],
      })
    }
  }

  const results = Array.from(grouped.values())
    .sort((a, b) => b.maxSimilarity - a.maxSimilarity)

  return { results, duration }
}

export async function getDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data || []
}

export async function getDocument(id: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw new Error(error.message)
  return data
}

export async function getStats() {
  const { data, error } = await supabase
    .from('document_stats')
    .select('*')
    .single()
  if (error) return { total_documents: 0, indexed_documents: 0, processing_documents: 0, error_documents: 0, total_chunks: 0 }
  return data
}

export async function getAuditLog(limit = 50) {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return data || []
}

export async function getSearchHistory(limit = 20) {
  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  return data || []
}
