import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase-server';
import { signServiceJwt } from '@/lib/foundry-client';
import type { ExecutionRequestV1 } from '@/contracts/foundry-contract';
import crypto from 'crypto';

type ValidationError = {
  error: string;
  code?: string;
  details?: any;
};

function badRequest(msg: string, details?: any) {
  const out: ValidationError = { error: msg, code: 'VALIDATION_ERROR', details };
  return NextResponse.json(out, { status: 400 });
}

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as Partial<ExecutionRequestV1> | null;
    if (!body) return badRequest('Missing body');

    // Basic shape validation
    if (body.protocolVersion !== '1.0') return badRequest('Unsupported protocolVersion');
    if (!body.requestId || typeof body.requestId !== 'string') return badRequest('requestId required');
    if (!body.tenantId || body.tenantId !== user.id) return badRequest('tenantId mismatch or missing');
    if (!body.project || !body.project.id) return badRequest('project.id required');
    if (!Array.isArray(body.capabilities) || body.capabilities.length === 0) return badRequest('capabilities must be a non-empty array');
    if (!body.inputs || typeof body.inputs.ideaSummary !== 'string' || body.inputs.ideaSummary.length <= 20) return badRequest('ideaSummary must be > 20 characters');

    const projectId = body.project.id;

    // Verify project ownership
    const { data: projectRow, error: projectErr } = await supabase.from('projects').select('id,user_id').eq('id', projectId).maybeSingle();
    if (projectErr) return NextResponse.json({ error: 'Failed to query project', details: projectErr.message }, { status: 500 });
    if (!projectRow) return badRequest('Project not found');
    if (projectRow.user_id !== user.id) return badRequest('User does not own project');

    // Validate attachments exist in project_files if provided
    if (body.inputs.attachments && body.inputs.attachments.length > 0) {
      for (const a of body.inputs.attachments) {
        const { data: fileRow, error: fileErr } = await supabase.from('project_files').select('id,project_id').eq('id', a.id).maybeSingle();
        if (fileErr) return NextResponse.json({ error: 'Failed to query project_files', details: fileErr.message }, { status: 500 });
        if (!fileRow) return badRequest('Attachment not found: ' + a.id);
        if (fileRow.project_id !== projectId) return badRequest('Attachment does not belong to project: ' + a.id);
      }
    }

    // Idempotency: check jobs table for existing requestId
    let existingJob: any = null;
    try {
      const { data: existing, error: existingErr } = await supabase.from('jobs').select('*').eq('request_id', body.requestId).maybeSingle();
      if (existingErr) {
        // Column might not exist — surface helpful migration message
        return NextResponse.json({ error: 'jobs.request_id column missing. Run migration: ALTER TABLE jobs ADD COLUMN request_id TEXT;' }, { status: 500 });
      }
      existingJob = existing;
    } catch (ex) {
      return NextResponse.json({ error: 'Idempotency check failed', details: String(ex) }, { status: 500 });
    }

    if (existingJob && existingJob.foundry_job_id) {
      return NextResponse.json({ job_id: existingJob.foundry_job_id, status: existingJob.status || 'queued' });
    }

    // Forward to Foundry with service JWT and HMAC header
    const base = process.env.FOUNDRY_BASE_URL || process.env.FOUNDRY_URL;
    if (!base) return NextResponse.json({ error: 'FOUNDRY_BASE_URL or FOUNDRY_URL not configured' }, { status: 500 });

    const payloadStr = JSON.stringify(body);
    const sharedSecret = process.env.FOUNDRY_SHARED_SECRET;
    if (!sharedSecret) return NextResponse.json({ error: 'FOUNDRY_SHARED_SECRET not configured' }, { status: 500 });
    const signature = crypto.createHmac('sha256', sharedSecret).update(payloadStr).digest('hex');

    // Sign service JWT scoped to project/workspace (use project id as workspace context)
    const serviceJwt = signServiceJwt(projectId);

    const resp = await fetch(`${base.replace(/\/$/, '')}/api/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceJwt}`,
        'X-Foundry-Signature': signature,
      },
      body: payloadStr,
    });

    const text = await resp.text();
    let json: any = null;
    try { json = JSON.parse(text); } catch { json = { status: resp.status, body: text }; }

    if (!resp.ok) {
      return NextResponse.json({ error: 'Foundry forwarded error', details: json }, { status: resp.status });
    }

    // Persist job mapping (attempt to write request_id; if schema missing, surface instruction)
    const foundryJobId = json.job_id || json.jobId || json.jobId || null;
    const jobStatus = json.status || 'queued';
    try {
      const { error: insertErr } = await supabase.from('jobs').insert({ project_id: projectId, foundry_job_id: foundryJobId, request_id: body.requestId, status: jobStatus });
      if (insertErr) {
        return NextResponse.json({ error: 'Failed to persist job, ensure jobs.request_id column exists', details: insertErr.message }, { status: 500 });
      }
    } catch (ex: any) {
      return NextResponse.json({ error: 'Failed to persist job', details: String(ex) }, { status: 500 });
    }

    return NextResponse.json(json);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
