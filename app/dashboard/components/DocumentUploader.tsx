"use client"

import React, { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase-browser'

export type UploadedFileMeta = {
  id: string
  file_name: string
  mime_type: string
  storage_path: string
  created_at?: string
}

export default function DocumentUploader({ userId, projectId, onUploaded }: { userId: string, projectId: string, onUploaded: (f: UploadedFileMeta) => void }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    const files = e.target.files
    if (!files || files.length === 0) return
    const file = files[0]
    const fileName = file.name
    const path = `${userId}/${projectId}/${fileName}`
    setUploading(true)
    try {
      const { data, error: upErr } = await supabaseBrowser.storage
        .from('project-documents')
        .upload(path, file, { upsert: false })
      if (upErr) throw upErr

      const storagePath = data?.path || path

      // Insert metadata row into project_files
      const { data: row, error: rowErr } = await supabaseBrowser
        .from('project_files')
        .insert({ project_id: projectId, file_name: fileName, mime_type: file.type, storage_path: storagePath })
        .select()
        .single()

      if (rowErr) throw rowErr

      const meta: UploadedFileMeta = {
        id: row.id,
        file_name: row.file_name,
        mime_type: row.mime_type,
        storage_path: row.storage_path,
        created_at: row.created_at
      }

      onUploaded(meta)
    } catch (ex: any) {
      setError(ex?.message || String(ex))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white p-4 rounded border mb-4">
      <label className="block text-sm mb-2">Attach supporting document</label>
      <input type="file" onChange={handleFile} />
      {uploading && <div className="text-sm text-neutral-500 mt-2">Uploading...</div>}
      {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
    </div>
  )
}
