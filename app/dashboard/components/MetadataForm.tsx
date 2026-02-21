"use client"

import React from "react"

export default function MetadataForm({ value, onChange }: { value: any, onChange: (v: any) => void }) {
  return (
    <div className="bg-white p-6 rounded-lg border mb-4">
      <h3 className="font-medium mb-3">Project Metadata</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-neutral-600">Product Name *</label>
          <input value={value.productName} onChange={e => onChange({...value, productName: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-neutral-600">One-line Idea</label>
          <input value={value.oneLine} onChange={e => onChange({...value, oneLine: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-neutral-600">Industry</label>
            <input value={value.industry} onChange={e => onChange({...value, industry: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm text-neutral-600">Target Users</label>
            <input value={value.targetUsers} onChange={e => onChange({...value, targetUsers: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-neutral-600">Budget Tier</label>
            <select value={value.budgetTier} onChange={e => onChange({...value, budgetTier: e.target.value })} className="mt-1 w-full border rounded px-3 py-2">
              <option value="">Select</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-neutral-600">Timeline</label>
            <select value={value.timeline} onChange={e => onChange({...value, timeline: e.target.value })} className="mt-1 w-full border rounded px-3 py-2">
              <option value="">Select</option>
              <option value="2_weeks">2 weeks</option>
              <option value="1_month">1 month</option>
              <option value="3_months">3 months</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
