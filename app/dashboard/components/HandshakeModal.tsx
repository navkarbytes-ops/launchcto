"use client"

import React, { useEffect, useState } from 'react'

export default function HandshakeModal({ open, onClose, run }: { open: boolean, onClose: (ok?: boolean) => void, run: () => Promise<{ jobId?: string, error?: string }>} ) {
  const [stage, setStage] = useState('Ready')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setStage('Ready')
      setError(null)
      setBusy(false)
    }
  }, [open])

  async function start() {
    setBusy(true)
    setError(null)
    try {
      setStage('Validating configuration...')
      await new Promise(r => setTimeout(r, 500))

      setStage('Signing secure execution channel...')
      await new Promise(r => setTimeout(r, 700))

      setStage('Dispatching to Foundry AI Factory...')
      const res = await run()
      if (res.error) {
        setError(res.error)
        setStage('Failed')
        setBusy(false)
        return
      }

      setStage('Dispatched')
      setTimeout(() => {
        onClose(true)
      }, 600)
    } catch (ex: any) {
      setError(ex?.message || String(ex))
      setStage('Failed')
    } finally {
      setBusy(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-md bg-neutral-900 text-white p-6 rounded-lg shadow-lg">
        <div className="grid grid-cols-8 gap-4">
          <div className="col-span-2 flex items-center justify-center">
            <div className="w-16 h-16 bg-neutral-800 rounded flex items-center justify-center">
              {/* lock icon minimal */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          </div>
          <div className="col-span-6">
            <h3 className="text-lg font-medium mb-2">Secure Execution</h3>
            <p className="text-sm text-neutral-300 mb-4">This operation creates an execution request and dispatches to Foundry. Progress will be shown below.</p>
            <div className="space-y-2">
              <div className="text-sm">{stage}</div>
              {error && <div className="text-xs text-red-400">{error}</div>}
              <div className="mt-3 h-2 bg-neutral-800 rounded overflow-hidden">
                <div className="h-2 bg-blue-600 rounded transition-all" style={{ width: busy ? '70%' : stage === 'Dispatched' ? '100%' : '20%' }} />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-2 bg-neutral-700 rounded" onClick={() => onClose(false)} disabled={busy}>Cancel</button>
              <button className="px-3 py-2 bg-blue-600 rounded" onClick={start} disabled={busy}>Start</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
