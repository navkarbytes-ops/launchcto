"use client";

import { useState } from "react";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    // Later: call API to generate artifacts

    setTimeout(() => {
      alert("Initial execution system generated.");
      setLoading(false);
    }, 1000);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">
        Founder Intake
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

        <div>
          <label className="block text-sm mb-2">
            Describe your product idea
          </label>
          <textarea
            className="w-full border border-neutral-300 rounded-md p-3"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-2">
            Current stage
          </label>
          <select className="w-full border border-neutral-300 rounded-md p-3">
            <option>Idea Momentum</option>
            <option>Reactive Building</option>
            <option>Capital Leakage</option>
            <option>Fundraising Friction</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-2">
            Budget Range
          </label>
          <select className="w-full border border-neutral-300 rounded-md p-3">
            <option>Under $25k</option>
            <option>$25k – $100k</option>
            <option>$100k+</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-black text-white rounded-md text-sm"
        >
          {loading ? "Generating..." : "Generate Execution System"}
        </button>
      </form>
    </div>
  );
}