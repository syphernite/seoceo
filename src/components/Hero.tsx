// src/components/Hero.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokens } from "../styles/tokens";

export default function Hero() {
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const domainRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) domainRef.current?.focus();
  }, [open]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = domain.trim();
    const m = email.trim();
    if (!d || !m) return;
    setOpen(false);
    navigate(
      `/contact?intent=audit&step=1&domain=${encodeURIComponent(d)}&email=${encodeURIComponent(m)}`
    );
  }

  return (
    <section className="relative isolate text-white">
      {/* Marble background, #010101 (1 hex from black) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#010101]" />
        {/* soft marble sheens */}
        <div
          className="absolute inset-0 opacity-80 marble-animate slow-1"
          style={{
            background:
              "conic-gradient(from 15deg at 22% 18%, rgba(255,255,255,0.05), rgba(255,255,255,0) 35%), conic-gradient(from 210deg at 78% 82%, rgba(255,255,255,0.04), rgba(255,255,255,0) 45%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-70 marble-animate slow-2"
          style={{
            background:
              "radial-gradient(900px 520px at 18% 12%, rgba(255,255,255,0.06), transparent 60%), radial-gradient(1000px 600px at 82% 88%, rgba(255,255,255,0.05), transparent 62%)",
          }}
        />
        {/* faint veins */}
        <div
          className="absolute inset-0 opacity-25 mix-blend-overlay marble-animate slow-3"
          style={{
            background:
              "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 16px)",
          }}
        />
        {/* subtle noise */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      </div>

      <div className={`${tokens?.container || "mx-auto max-w-6xl px-6"} py-20 text-center`}>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Seo that pays for itself
        </h1>
        <p className="mt-4 text-lg text-neutral-300">
          Lightning audits. Action plans. Proven growth.
        </p>

        <div className="mt-8 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group glass-btn pulse-subtle inline-flex items-center gap-2 rounded-2xl px-7 py-3 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            Get free audit ✒️
            <span aria-hidden className="transition translate-x-0 group-hover:translate-x-0.5">→</span>
          </button>
        </div>

      </div>

      {/* Popup modal */}
      {open && (
        <div
          aria-modal="true"
          role="dialog"
          className="fixed inset-0 z-50 grid place-items-center p-4"
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl glass-card p-6 shadow-2xl">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Start your free audit</h2>
              <p className="mt-1 text-sm text-white/80">
                Enter your site and email to begin.
              </p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-3">
              <label htmlFor="audit-domain" className="sr-only">
                Website
              </label>
              <input
                id="audit-domain"
                ref={domainRef}
                type="text"
                inputMode="url"
                autoComplete="url"
                placeholder="yourdomain.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
                className="glass-input w-full rounded-xl px-4 py-3 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/60"
              />

              <label htmlFor="audit-email" className="sr-only">
                Email
              </label>
              <input
                id="audit-email"
                type="email"
                autoComplete="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input w-full rounded-xl px-4 py-3 text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-white/60"
              />

              <div className="mt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="glass-cta rounded-2xl px-5 py-3 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-white/60"
                >
                  Continue →
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="glass-btn-secondary rounded-2xl px-5 py-3 text-sm text-white/90"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Component-scoped styles */}
      <style>{`
        @keyframes marbleShift {
          0% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0.95; }
          50% { transform: translate3d(0.5%, -0.5%, 0) rotate(1.2deg); opacity: 1; }
          100% { transform: translate3d(0,0,0) rotate(0deg); opacity: 0.95; }
        }
        .marble-animate { animation: marbleShift 22s ease-in-out infinite; }
        .slow-1 { animation-duration: 26s; }
        .slow-2 { animation-duration: 30s; }
        .slow-3 { animation-duration: 40s; }

        @keyframes softPulse {
          0% { box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 0 0 rgba(255,255,255,0); }
          50% { box-shadow: inset 0 1px 0 rgba(255,255,255,.25), 0 0 22px rgba(255,255,255,.12); }
          100% { box-shadow: inset 0 1px 0 rgba(255,255,255,0); }
        }
        .pulse-subtle { animation: softPulse 5s ease-in-out infinite; }

        .glass-btn {
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: background .2s ease, border-color .2s ease, transform .2s ease;
        }
        .glass-btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.28); transform: translateY(-1px); }

        .glass-card {
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          box-shadow: 0 0 28px rgba(255,255,255,0.10), inset 0 1px 0 rgba(255,255,255,.25);
        }

        .glass-input {
          border: 1px solid rgba(255,255,255,0.20);
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.25);
        }

        .glass-cta {
          border: 1px solid rgba(255,255,255,0.35);
          background: linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.10));
          color: #fff;
          box-shadow: 0 0 24px rgba(255,255,255,0.12), inset 0 1px 0 rgba(255,255,255,.35);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: opacity .2s ease, transform .2s ease, box-shadow .2s ease;
        }
        .glass-cta:hover { opacity: .95; transform: translateY(-1px); box-shadow: 0 0 30px rgba(255,255,255,0.16), inset 0 1px 0 rgba(255,255,255,.45); }

        .glass-btn-secondary {
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.10);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: background .2s ease, border-color .2s ease, transform .2s ease;
        }
        .glass-btn-secondary:hover { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.26); transform: translateY(-1px); }
      `}</style>
    </section>
  );
}
