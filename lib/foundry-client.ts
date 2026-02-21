import crypto from "crypto";

function base64Url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function signServiceJwt(workspaceId: string): string {
  const secret = process.env.FOUNDRY_SERVICE_SECRET;
  if (!secret) {
    throw new Error("FOUNDRY_SERVICE_SECRET is not set");
  }

  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    iss: "launchcto",
    role: "service",
    workspace_id: workspaceId,
    iat: now,              // ✅ REQUIRED
    exp: now + 300,        // 5 minutes
  };

  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const toSign = `${encodedHeader}.${encodedPayload}`;

  const signature = base64Url(
    crypto.createHmac("sha256", secret).update(toSign).digest()
  );

  return `${toSign}.${signature}`;
}

export async function foundryRequest(path: string, method: string = 'GET', body?: any, workspaceId: string = 'default-workspace') {
  const base = process.env.FOUNDRY_BASE_URL;
  if (!base) throw new Error('FOUNDRY_BASE_URL not configured');

  const token = signServiceJwt(workspaceId);

  const url = `${base.replace(/\/$/, '')}${path}`;

  const headers: Record<string,string> = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json',
  };

  let init: RequestInit = { method, headers };
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify(body);
  }

  const res = await fetch(url, init as any);
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (e) {
    // if not JSON, return raw text
    return { status: res.status, body: text };
  }
}
