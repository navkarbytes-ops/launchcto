"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="bg-[#f4f7fb] text-neutral-900 relative overflow-hidden">

      <BackgroundGlow />

      <Header />

      <main className="space-y-40 pb-40">

        <Hero />

        <StructuralProblem />

        <ExecutionSystem />

        <Deliverables />

        <InstallationModel />

        <Qualification />

        <FinalCTA />

      </main>

      <Footer />
    </div>
  );
}

/* ===================== Background ===================== */

function BackgroundGlow() {
  return (
    <>
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-[600px] h-[600px] bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-1/3 w-[500px] h-[500px] bg-indigo-400/10 blur-[120px] rounded-full pointer-events-none" />
    </>
  );
}

/* ===================== Header ===================== */

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-white/60 border-b border-white/40">
      <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
        <div className="text-lg font-semibold tracking-tight">
          LaunchCTO
        </div>

        <Link
          href="/auth/login"
          className="text-sm font-medium text-neutral-700 hover:text-black transition"
        >
          Start Execution
        </Link>
      </div>
    </header>
  );
}

/* ===================== Hero ===================== */

function Hero() {
  return (
    <section className="pt-32 px-6 text-center max-w-5xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-semibold leading-tight tracking-tight">
        Founders Don’t Fail From Lack of Effort.
        <br />
        <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
          They Fail From Lack of Execution Structure.
        </span>
      </h1>

      <p className="mt-8 text-lg text-neutral-600 max-w-3xl mx-auto leading-relaxed">
        LaunchCTO installs a structured execution system — architecture,
        sequencing, and capital discipline — before you scale team or burn rate.
      </p>

      <div className="mt-14 flex justify-center gap-6 flex-wrap">
        <Link
          href="/auth/login"
          className="px-10 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-full shadow-lg hover:opacity-90 transition-all"
        >
          Install Structured Execution →
        </Link>

        <a
          href="#framework"
          className="px-10 py-4 bg-white/80 backdrop-blur border border-neutral-300 rounded-full text-neutral-700 hover:border-neutral-500 transition"
        >
          See The Framework
        </a>
      </div>
    </section>
  );
}

/* ===================== Structural Problem ===================== */

function StructuralProblem() {
  return (
    <section className="px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-semibold text-center">
        The Hidden Cost of Unstructured Execution
      </h2>

      <div className="mt-16 grid md:grid-cols-3 gap-10">
        {[
          {
            title: "Architecture After Hiring",
            desc: "Engineers hired before system boundaries are defined.",
          },
          {
            title: "Roadmaps Without Validation",
            desc: "Features ship. Market clarity doesn’t.",
          },
          {
            title: "Burn Without Control",
            desc: "Capital disappears in iteration loops.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-10 bg-white/90 backdrop-blur rounded-3xl shadow-md border border-neutral-200 hover:shadow-xl transition"
          >
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="mt-4 text-neutral-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-14 text-center text-neutral-600 text-lg">
        Execution without structure compounds risk exponentially.
      </p>
    </section>
  );
}

/* ===================== Execution System ===================== */

function ExecutionSystem() {
  return (
    <section
      id="framework"
      className="px-6 max-w-6xl mx-auto bg-white/80 backdrop-blur-2xl rounded-3xl p-20 border border-neutral-200 shadow-xl"
    >
      <h2 className="text-3xl font-semibold text-center">
        The LaunchCTO Execution Control System
      </h2>

      <div className="mt-16 grid md:grid-cols-2 gap-14">
        {[
          {
            title: "Market Clarity Architecture",
            desc: "ICP decomposition, value surface mapping, validation sequencing.",
          },
          {
            title: "Technical Blueprint",
            desc: "System boundary design, API topology, build vs buy logic.",
          },
          {
            title: "Execution Sequencing Engine",
            desc: "Sprint-level roadmap, dependency graph, hiring timing.",
          },
          {
            title: "Capital Discipline Framework",
            desc: "Burn modeling, milestone alignment, investor readiness.",
          },
        ].map((item, i) => (
          <div key={i}>
            <h3 className="font-semibold text-xl">{item.title}</h3>
            <p className="mt-4 text-neutral-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===================== Deliverables ===================== */

function Deliverables() {
  return (
    <section className="px-6 max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-semibold">
        What You Walk Away With
      </h2>

      <div className="mt-14 grid md:grid-cols-2 gap-10">
        {[
          "Product Architecture Diagram",
          "Execution Roadmap (Sprint Sequenced)",
          "Cost Projection Model",
          "Technical Hiring Blueprint",
          "Investor-Ready BRD",
        ].map((item, i) => (
          <div
            key={i}
            className="p-8 bg-white/90 backdrop-blur rounded-2xl border border-neutral-200 shadow-sm hover:shadow-lg transition"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===================== Installation Model ===================== */

function InstallationModel() {
  return (
    <section className="px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold text-center">
        Install Execution Structure In 14 Days
      </h2>

      <div className="mt-16 space-y-6">
        {[
          "Day 1–2 → Founder Intake",
          "Day 3–5 → System Blueprint",
          "Day 6–10 → Execution Sequencing",
          "Day 11–14 → Capital Readiness Package",
        ].map((step, i) => (
          <div
            key={i}
            className="p-6 bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 rounded-2xl border border-neutral-200"
          >
            {step}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ===================== Qualification ===================== */

function Qualification() {
  return (
    <section className="px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-semibold text-center">
        This Is For Founders Who
      </h2>

      <div className="mt-14 grid md:grid-cols-2 gap-14">
        <div>
          <ul className="space-y-4 text-neutral-700">
            <li>• Are preparing to raise capital</li>
            <li>• Are hiring engineers</li>
            <li>• Need execution clarity before scaling</li>
            <li>• Want architecture before acceleration</li>
          </ul>
        </div>

        <div>
          <ul className="space-y-4 text-neutral-400">
            <li>• Not for hobby projects</li>
            <li>• Not for “just exploring” ideas</li>
            <li>• Not for outsourcing dev shops</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ===================== Final CTA ===================== */

function FinalCTA() {
  return (
    <section className="px-6 text-center">
      <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-3xl p-20 shadow-2xl">
        <h2 className="text-3xl font-semibold">
          Ready To Replace Burn With Structure?
        </h2>

        <p className="mt-6 text-blue-100">
          Install execution clarity before you scale team, scope, or capital.
        </p>

        <Link
          href="/auth/login"
          className="mt-12 inline-block px-10 py-4 bg-white text-black rounded-full font-medium shadow-md hover:shadow-xl transition"
        >
          Start Structured Execution →
        </Link>
      </div>
    </section>
  );
}

/* ===================== Footer ===================== */

function Footer() {
  return (
    <footer className="py-20 text-center text-neutral-500 text-sm">
      © {new Date().getFullYear()} LaunchCTO · Structured Execution Partner
    </footer>
  );
}
