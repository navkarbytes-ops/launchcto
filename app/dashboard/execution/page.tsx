export default function ExecutionPage() {
  const weeks = [
    "Week 1: Market & Validation",
    "Week 2: Architecture Finalization",
    "Week 3: Core Build Sprint",
    "Week 4: Launch Preparation",
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">
        Execution Timeline
      </h1>

      <div className="space-y-6">
        {weeks.map((w, i) => (
          <div
            key={i}
            className="border border-neutral-200 p-6 rounded-lg"
          >
            <p className="font-medium">{w}</p>
          </div>
        ))}
      </div>
    </div>
  );
}