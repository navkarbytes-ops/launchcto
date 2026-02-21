"use client"

import React from "react"

export default function CalendlyBanner({ userId }: { userId: string }) {
  const calendlyUrl = `https://calendly.com/navkarbytes/30min?a1=${encodeURIComponent(userId)}`
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-300 p-4 mb-4 rounded">
      <p className="text-sm">Please book a strategy call before execution.</p>
      <a href={calendlyUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">Book Strategy Call →</a>
    </div>
  )
}
