"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [idea, setIdea] = useState("");

  const handleSubmit = async () => {
    await fetch("/api/application/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workspaceId,
        idea,
      }),
    });

    router.push(`/dashboard/${workspaceId}`);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center px-6">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-neutral-200 w-full max-w-2xl">

        <h1 className="text-2xl font-semibold">
          Founder Intake
        </h1>

        <p className="mt-4 text-neutral-600">
          Describe your product vision and current stage.
        </p>

        <textarea
          className="mt-8 w-full p-4 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          rows={6}
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="mt-8 w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl"
        >
          Install Execution Structure →
        </button>

      </div>
    </div>
  );
}
