"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
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

    // IMPORTANT: Full reload so SSR sees fresh session cookie
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-violet-50 px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md space-y-6 border border-neutral-200">

        <h1 className="text-2xl font-semibold text-center">
          Welcome Back
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl"
        >
          {loading ? "Signing in..." : "Login →"}
        </button>

        <p className="text-sm text-center text-neutral-600">
          Don’t have an account?{" "}
          <a href="/auth/signup" className="text-blue-600 hover:underline">
            Create one
          </a>
        </p>

      </div>
    </div>
  );
}
