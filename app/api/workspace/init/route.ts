import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId } = await req.json();

  // Check existing membership
  const { data: membership } = await supabase
    .from("workspace_members")
    .select("workspace_id")
    .eq("user_id", userId)
    .single();

  if (membership) {
    return NextResponse.json({ workspaceId: membership.workspace_id });
  }

  // Create workspace
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert([
      {
        name: "My LaunchCTO Workspace",
        owner_id: userId,
      },
    ])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Create membership
  await supabase.from("workspace_members").insert([
    {
      workspace_id: workspace.id,
      user_id: userId,
      role: "owner",
    },
  ]);

  return NextResponse.json({ workspaceId: workspace.id });
}
