"use client"

import React from "react"

// TODO: replace static GROUPS with dynamic capability config fetched from Foundry
const GROUPS: Record<string, string[]> = {
  Strategy: ["Strategy", "BRD", "Technical Architecture Document", "PRD", "GTM Strategy", "Pricing Strategy"],
  "Product & Design": ["Product & Design", "UX Flow", "Wireframes", "Branding Kit", "Landing Page Copy"],
  Engineering: ["Engineering", "Backend Code", "Frontend Code", "Database Schema", "API Contracts", "Docker Setup", "Deployment Scripts"],
  AI: ["Agent Architecture", "Prompt Library", "LLM Infra Setup", "Vector DB Setup"]
}

export default function CapabilityChecklist({ value, onChange }: { value: string[]; onChange: (s: string[]) => void }) {
  function toggle(item: string) {
    const exists = value.includes(item)
    if (exists) onChange(value.filter(v => v !== item))
    else onChange([...value, item])
  }

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h3 className="font-medium mb-3">Select Capabilities</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(GROUPS).map(([group, items]) => (
          <div key={group} className="p-3 border rounded">
            <h4 className="font-semibold mb-2">{group}</h4>
            <div className="space-y-2">
              {items.map(item => (
                <label key={item} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={value.includes(item)} onChange={() => toggle(item)} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
