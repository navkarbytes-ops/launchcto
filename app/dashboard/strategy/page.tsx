"use client";

import { useEffect, useRef } from "react";

export default function StrategyPage() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).Calendly && ref.current) {
        (window as any).Calendly.initInlineWidget({
          url: "https://calendly.com/navkarbytes/30min",
          parentElement: ref.current,
        });
      }
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">
        Strategy Session
      </h1>

      <div
        ref={ref}
        style={{ height: "700px" }}
        className="border border-neutral-200 rounded-lg"
      />
    </div>
  );
}
