import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase-server";
import { foundryRequest } from "@/lib/foundry-client";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Missing id" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Resolve workspace membership
    let workspaceId = "default-workspace";

    const { data: membership } = await supabase
      .from("workspace_members")
      .select("workspace_id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (membership?.workspace_id) {
      workspaceId = membership.workspace_id;
    }

    // Forward to Foundry
    const resp = await foundryRequest(
      `/api/download/${encodeURIComponent(id)}`,
      "GET",
      undefined,
      workspaceId
    );

    return NextResponse.json(resp);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    );
  }
}