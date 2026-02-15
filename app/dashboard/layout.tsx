import Link from "next/link";
import { ReactNode } from "react";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <div className="flex">

        {/* Sidebar */}
        <aside className="w-64 border-r border-neutral-200 p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold">LaunchCTO</h2>
            <p className="text-xs text-neutral-500">
              Structured Execution
            </p>
          </div>

          <nav className="space-y-3 text-sm">
            <Link href="/dashboard" className="block hover:text-black text-neutral-600">
              Overview
            </Link>
            <Link href="/dashboard/artifacts" className="block hover:text-black text-neutral-600">
              Artifacts
            </Link>
            <Link href="/dashboard/execution" className="block hover:text-black text-neutral-600">
              Execution Plan
            </Link>
            <Link href="/dashboard/architecture" className="block hover:text-black text-neutral-600">
              Architecture
            </Link>
            <Link href="/dashboard/settings" className="block hover:text-black text-neutral-600">
              Settings
            </Link>
          </nav>

          <div className="mt-12 pt-6 border-t border-neutral-200">
            <Link
              href="/dashboard/strategy"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Book Strategy Session →
            </Link>
          </div>
        </aside>

        {/* Main Area */}
        <div className="flex-1">

          {/* Topbar */}
          <div className="h-16 border-b border-neutral-200 flex items-center justify-between px-8">
            <div className="text-sm text-neutral-500">
              Workspace
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <span className="text-neutral-600">Free Tier</span>
              <div className="w-8 h-8 rounded-full bg-neutral-200" />
            </div>
          </div>

          {/* Page Content */}
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
