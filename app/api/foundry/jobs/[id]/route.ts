import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { foundryRequest } from '@/lib/foundry-client';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    // Resolve workspace membership if available
    let workspaceId = 'default-workspace';
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (membership && (membership as any).workspace_id) {
      workspaceId = (membership as any).workspace_id;
    }

    const resp = await foundryRequest(`/api/jobs/${encodeURIComponent(id)}`, 'GET', undefined, workspaceId);
    return NextResponse.json(resp);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
