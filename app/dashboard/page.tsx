import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function DashboardRoot() {
  const supabase = await createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  /* Ensure profile exists */
  await supabase.from("profiles").upsert({
    id: user.id,
    full_name: user.user_metadata?.full_name ?? "",
  });

  /* Check workspace */
  const { data: existing } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .limit(1);

  if (existing && existing.length > 0) {
    redirect(`/dashboard/${existing[0].id}`);
  }

  /* Create workspace */
  const { data: workspace, error } = await supabase
    .from("workspaces")
    .insert([
      {
        name: "Founder Workspace",
        owner_id: user.id,
        stage: "intake",
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);

  redirect(`/dashboard/${workspace.id}`);
}
