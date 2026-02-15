"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabaseBrowser.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center px-6">

      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 w-[400px] h-[400px] bg-blue-500/10 blur-3xl rounded-full" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-violet-500/10 blur-3xl rounded-full" />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl border border-neutral-200 p-10">

        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Access Your Execution System
          </h1>
          <p className="mt-3 text-sm text-neutral-600">
            Structured execution begins with controlled access.
          </p>
        </div>

        <div className="mt-10 space-y-6">

          <div>
            <label className="text-sm text-neutral-600">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full p-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="founder@startup.com"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-600">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full p-3 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-medium hover:opacity-90 transition"
          >
            {loading ? "Authenticating..." : "Enter Execution System →"}
          </button>

        </div>

        <div className="mt-8 text-center text-xs text-neutral-400">
          LaunchCTO · Structured Execution Partner
        </div>

      </div>
    </div>
  );
}
