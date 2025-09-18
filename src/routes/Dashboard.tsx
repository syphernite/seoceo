import React from "react";

export default function Dashboard() {
  return (
    <main className="min-h-[80vh] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Top banner */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-600/15 via-sky-600/15 to-indigo-600/15 p-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-white">Good afternoon</h1>
          <p className="mt-1 text-neutral-300 text-sm">Here’s what’s happening with your projects today.</p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">
          {/* Sidebar */}
          <aside className="rounded-2xl border border-white/10 bg-neutral-900 p-3">
            <nav className="space-y-1">
              {[
                "Dashboard",
                "E-Commerce",
                "Community",
                "Finance",
                "Tasks",
                "Messages",
                "Inbox",
                "Calendar",
                "Campaigns",
                "Settings",
              ].map((label) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-neutral-300 hover:bg-white/5"
                >
                  <span>{label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-neutral-400">—</span>
                </div>
              ))}
            </nav>
          </aside>

          {/* Main cards */}
          <section className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {["Acme Plus", "Acme Advanced", "Acme Professional"].map((title) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-neutral-900 p-5 shadow">
                  <div className="flex items-start justify-between">
                    <h3 className="text-white font-medium">{title}</h3>
                    <div className="h-2 w-2 rounded-full bg-white/30" />
                  </div>
                  <p className="mt-3 text-3xl font-semibold text-white">$—</p>
                  <div className="mt-4 h-16 w-full rounded-md bg-white/5" />
                </div>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5">
                <p className="text-neutral-300 text-sm">Direct vs Indirect</p>
                <div className="mt-4 h-40 w-full rounded-md bg-white/5" />
              </div>
              <div className="rounded-2xl border border-white/10 bg-neutral-900 p-5">
                <p className="text-neutral-300 text-sm">Real-time value</p>
                <div className="mt-4 h-40 w-full rounded-md bg-white/5" />
              </div>
            </div>
          </section>
        </div>

        {/* Lock overlay */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="pointer-events-auto w-[min(92vw,34rem)] rounded-2xl border border-white/15 bg-neutral-950/80 p-6 text-center">
              <h2 className="text-xl md:text-2xl font-semibold text-white">Dashboard coming soon</h2>
              <p className="mt-2 text-neutral-300 text-sm">
                This area will be available for subscribed, signed-in users after launch.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
