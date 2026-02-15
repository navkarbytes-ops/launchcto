import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json();

  // Only process invitee.created event
  if (body.event !== "invitee.created") {
    return NextResponse.json({ ignored: true });
  }

  const workspaceId =
    body.payload?.questions_and_answers?.find(
      (q: any) => q.question === "workspace_id"
    )?.answer;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Insert strategy call record
  await supabase.from("strategy_calls").insert([
    {
      workspace_id: workspaceId,
      user_id: body.payload.invitee.uri.split("/").pop(),
      calendly_event_uri: body.payload.event,
      calendly_invitee_uri: body.payload.invitee.uri,
      scheduled_at: body.payload.event_start_time,
    },
  ]);

  // Update workspace stage
  await supabase
    .from("workspaces")
    .update({ stage: "strategy_scheduled" })
    .eq("id", workspaceId);

  return NextResponse.json({ success: true });
}
