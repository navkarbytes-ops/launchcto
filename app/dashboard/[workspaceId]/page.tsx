import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase-server";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const { workspaceId } = await params;

  const supabase = await createSupabaseServer();

  /* ========================
     Get Authenticated User
  ======================== */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Not authenticated
      </div>
    );
  }

  /* ========================
     Fetch Profile
  ======================== */

  let fullName = "";

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  fullName = profile?.full_name ?? "";

  /* ========================
     Fetch Workspace
  ======================== */

  const { data: workspace } = await supabase
    .from("workspaces")
    .select("*")
    .eq("id", workspaceId)
    .single();

  /* ========================
     Fetch ALL Applications
  ======================== */

  const { data: applications } = await supabase
    .from("applications")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  /* ========================
     Render
  ======================== */

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-10">
      <div className="max-w-5xl mx-auto space-y-12">

        <h1 className="text-3xl font-semibold">
          Workspace
        </h1>

        {/* Workspace Header */}
        <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-neutral-500 text-sm">
                Workspace ID
              </p>
              <p className="font-medium">{workspaceId}</p>
            </div>
            <StageBadge stage={workspace?.stage || "intake"} />
          </div>
        </div>

        {/* Applications Section */}
        {!applications || applications.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-neutral-200 text-center">
            <h2 className="text-xl font-semibold">
              Founder Intake Required
            </h2>
            <p className="mt-4 text-neutral-600">
              Install execution clarity before proceeding.
            </p>

            <Link
              href={`/dashboard/${workspaceId}/onboarding`}
              className="mt-8 inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl"
            >
              Start Founder Intake →
            </Link>
          </div>
        ) : (
          <>
            {/* Ideas List */}
            <div className="bg-white p-10 rounded-3xl border border-neutral-200 space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                  Founder Ideas
                </h2>

                <Link
                  href={`/dashboard/${workspaceId}/onboarding`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Add New Idea →
                </Link>
              </div>

              {applications.map((app: any, index: number) => (
                <div
                  key={app.id}
                  className="p-6 bg-gradient-to-r from-blue-50 to-violet-50 rounded-2xl border border-neutral-200"
                >
                  <p className="text-sm text-neutral-500">
                    Idea #{applications.length - index}
                  </p>

                  <p className="mt-3 text-neutral-700">
                    {app.idea_description}
                  </p>

                  <p className="mt-3 text-xs text-neutral-400">
                    {new Date(app.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Strategy Call */}
            <div className="bg-white p-10 rounded-3xl border border-neutral-200">
              <h2 className="text-xl font-semibold">
                Strategy Call
              </h2>

              <p className="mt-4 text-neutral-600">
                Align execution before artifact generation.
              </p>

              <a
                href={`https://calendly.com/navkarbytes/30min?name=${encodeURIComponent(
                  fullName || user.email || ""
                )}&email=${encodeURIComponent(
                  user.email || ""
                )}&workspace_id=${workspaceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl"
              >
                Book Strategy Call →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ========================
   Stage Badge Component
======================== */

function StageBadge({ stage }: { stage: string }) {
  return (
    <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-violet-50 text-sm text-blue-700 border border-blue-200">
      {stage}
    </div>
  );
}
