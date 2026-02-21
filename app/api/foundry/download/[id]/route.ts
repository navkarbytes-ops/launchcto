import { NextResponse } from 'next/server'
import { createSupabaseServer } from '@/lib/supabase-server'
import { signServiceJwt } from '@/lib/foundry-client'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseServer()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const id = params.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    // Resolve workspace membership
    let workspaceId = 'default-workspace'
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    if (membership && (membership as any).workspace_id) workspaceId = (membership as any).workspace_id

    const base = process.env.FOUNDRY_BASE_URL
    if (!base) return NextResponse.json({ error: 'FOUNDRY_BASE_URL not configured' }, { status: 500 })

    const token = signServiceJwt(workspaceId)
    const url = `${base.replace(/\/$/, '')}/download/${encodeURIComponent(id)}?workspace_id=${encodeURIComponent(workspaceId)}`

    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

    if (!res.ok) {
      const t = await res.text()
      return new NextResponse(t, { status: res.status })
    }

    // Stream binary response
    const headers = new Headers()
    res.headers.forEach((v, k) => headers.set(k, v))
    return new NextResponse(res.body, { status: 200, headers })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
