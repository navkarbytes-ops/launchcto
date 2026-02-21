"use client"

import React, { useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"
import MetadataForm from "../components/MetadataForm"
import CapabilityChecklist from "../components/CapabilityChecklist"
import CalendlyBanner from "../components/CalendlyBanner"
import DocumentUploader from "../components/DocumentUploader"
import HandshakeModal from "../components/HandshakeModal"
import { useRouter } from "next/navigation"

export default function LaunchPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [metadata, setMetadata] = useState<any>({ productName: "", oneLine: "", industry: "", targetGeography: "", targetUsers: "", budgetTier: "", timeline: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<any[]>([])
  const [handshakeOpen, setHandshakeOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    supabaseBrowser.auth.getUser().then(({ data }) => {
      if (!mounted) return
      if (!data.user) {
        router.push('/auth/login')
      } else {
        setUser(data.user)
      }
    })
    return () => { mounted = false }
  }, [router])

  async function handleExecute() {
    setError(null)
    if (!user) return router.push('/auth/login')
    if (!metadata.productName) { setError('Product Name is required'); return }
    if (selected.length === 0) { setError('Select at least one capability'); return }

    setLoading(true)
    try {
      // Open handshake modal that performs dispatch; modal will call API on Start
      // Ensure project exists first
      const { data: project, error: pErr } = await supabaseBrowser.from('projects').insert({
        user_id: user.id,
        name: metadata.productName,
        description: metadata.oneLine,
        industry: metadata.industry
      }).select().single()
      if (pErr || !project) throw new Error(pErr?.message || 'Failed to create project')

      // prepare attachments metadata (ids expected from DocumentUploader)
      const attachRows = attachments.map(a => ({ id: a.id, fileName: a.file_name, mimeType: a.mime_type, storagePath: a.storage_path }))

      // Build ExecutionRequestV1 payload (client-side minimal mapping; server will validate)
      const requestId = cryptoRandomUUID()
      const payload = {
        protocolVersion: '1.0',
        requestId,
        tenantId: user.id,
        project: {
          id: project.id,
          name: metadata.productName,
          description: metadata.oneLine,
          industry: metadata.industry,
          geography: metadata.targetGeography,
          budgetTier: metadata.budgetTier,
          timeline: metadata.timeline
        },
        capabilities: selected.map(s => ({ id: s, category: capabilityToCategory(s) })),
        inputs: {
          ideaSummary: metadata.oneLine || '',
          attachments: attachRows
        },
        context: { source: 'LaunchCTO', environment: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'prod' : 'dev' }
      }

      // Store the payload in state for modal-run (so modal can POST it without rebuilding)
      (window as any).__foundry_payload = payload
      setHandshakeOpen(true)
    } catch (ex: any) {
      setError(ex.message || String(ex))
      setLoading(false)
    }
  }

  function cryptoRandomUUID() {
    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) return (crypto as any).randomUUID()
    // fallback
    return 'req-' + Math.random().toString(36).slice(2, 10)
  }

  function capabilityToCategory(cap: string) {
    // Minimal mapping; keep values aligned to contract
    if (cap.includes('Strategy') || cap === 'BRD' || cap === 'GTM Strategy') return 'STRATEGY'
    if (cap === 'Product & Design' || cap === 'UX Flow' || cap === 'Wireframes' || cap === 'Branding Kit') return 'DESIGN'
    if (cap === 'Engineering' || cap === 'Backend Code' || cap === 'Frontend Code' || cap === 'Database Schema') return 'ENGINEERING'
    return 'AI'
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Generate with Foundry</h1>
        <p className="text-sm text-neutral-600">Create artifacts using Foundry's orchestration. Please book a strategy call if you haven't.</p>

        {user && <CalendlyBanner userId={user.id} />}

        <MetadataForm value={metadata} onChange={setMetadata} />

        <CapabilityChecklist value={selected} onChange={setSelected} />

        {error && <div className="text-red-600">{error}</div>}

        <div>
          <h4 className="font-medium mb-2">Attachments</h4>
          {user && (
            <DocumentUploader userId={user.id} projectId={metadata.productName ? metadata.productName.replace(/\s+/g,'-').toLowerCase() : 'temp'} onUploaded={(f) => setAttachments(prev => [...prev, f])} />
          )}
          <div className="space-y-2 mt-2">
            {attachments.map(a => (
              <div key={a.id} className="text-sm text-neutral-700">{a.file_name}</div>
            ))}
          </div>
        </div>

        <HandshakeModal open={handshakeOpen} onClose={(ok) => { setHandshakeOpen(false); if (ok) {
          // modal set __foundry_result on success
          const res = (window as any).__foundry_result
          if (res && res.jobId) router.push(`/dashboard/jobs/${res.jobId}`)
        } }} run={async () => {
          try {
            const payload = (window as any).__foundry_payload
            const r = await fetch('/api/foundry/execute', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
            const json = await r.json()
            if (!r.ok) return { error: json?.error || 'execution failed' }
            (window as any).__foundry_result = json
            return { jobId: json.job_id || json.jobId }
          } catch (ex: any) {
            return { error: ex?.message || String(ex) }
          }
        }} />

        <div className="flex items-center gap-4">
          <button className="px-5 py-3 bg-blue-600 text-white rounded-lg" onClick={handleExecute} disabled={loading}>
            {loading ? 'Generating...' : 'Generate with Foundry'}
          </button>
        </div>
      </div>
    </div>
  )
}
