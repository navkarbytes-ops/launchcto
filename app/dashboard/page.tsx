import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // check if workspace exists
  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (workspace) {
    redirect(`/dashboard/${workspace.id}`);
  }

  // create workspace once
  const { data: newWorkspace, error } = await supabase
    .from("workspaces")
    .insert({
      name: "Founder Workspace",
      owner_id: user.id,
      stage: "intake",
    })
    .select()
    .single();

  if (error || !newWorkspace) {
    throw new Error("Workspace creation failed");
  }

  redirect(`/dashboard/${newWorkspace.id}`);
}
