"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"

export default function JobPage() {
  const router = useRouter()
  const params = useParams() as { jobId: string }
  const { jobId } = params
  const [status, setStatus] = useState<string>('loading')
  const [logs, setLogs] = useState<string[]>([])
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function poll() {
      try {
        const res = await fetch(`/api/foundry/jobs/${jobId}`)
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        if (!mounted) return
        setStatus(json.status || json.state || 'unknown')
        if (json.logs) setLogs(json.logs)
        if (json.artifact_url) setDownloadUrl(`/api/foundry/download/${jobId}`)
      } catch (e) {
        // ignore transient
      }
    }
    poll()
    const id = setInterval(poll, 5000)
    return () => { mounted = false; clearInterval(id) }
  }, [jobId])

  async function handleDownload() {
    if (!downloadUrl) return
    window.open(downloadUrl, '_blank')
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Job {jobId}</h1>
        <div className="bg-white p-4 rounded border">
          <p>Status: <strong>{status}</strong></p>
          <div className="mt-3">
            <h4 className="font-medium">Logs</h4>
            <div className="mt-2 h-64 overflow-auto bg-black text-white p-3 text-xs rounded">
              {logs.length === 0 ? <div className="text-neutral-400">No logs yet</div> : logs.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </div>

          <div className="mt-4">
            <button onClick={handleDownload} disabled={!downloadUrl} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">Download Artifact</button>
          </div>
        </div>
      </div>
    </div>
  )
}
