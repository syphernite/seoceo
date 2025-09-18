// src/pages/Home.tsx
import React from "react";
import Hero from "../components/Hero";
import Services from "../components/Services";
import Partnership from "../components/Partnership";
import { tokens } from "../styles/tokens";
import SlideToStartCTA from "../components/SlideToStartCTA";

const plan = {
  name: "Full Access",
  price: "$32.99",
  period: "per month",
  highlights: ["Instant SEO audit", "Access to all tools", "Email support", "Cancel anytime"],
  cta: { href: "/contact", label: "Slide to start" },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />

      <section id="pricing" className={tokens.section}>
        <div className={tokens.container}>
          {/* Keep original light card structure */}
          <div className="mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-8 text-black shadow-sm">
            {/* Title + price as before */}
            <h2 className={tokens.heading.h2} data-anchor-target="true">
              {plan.name}
            </h2>
            <p className="mt-2 text-5xl font-semibold leading-tight">{plan.price}</p>
            <p className="mt-1 text-neutral-400">{plan.period}</p>

            {/* Two-column features on desktop, single on mobile */}
            <ul className="mt-6 grid grid-cols-1 gap-3 text-base text-neutral-700 md:grid-cols-2">
              {plan.highlights.map((h) => (
                <li key={h} className="relative pl-5">
                  <span className="absolute left-0 top-3 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                  {h}
                </li>
              ))}
            </ul>

            {/* Single CTA only: visible on all breakpoints */}
            <div className="mt-8 max-w-xl">
              <SlideToStartCTA to={plan.cta.href} label={plan.cta.label} />
            </div>
          </div>
        </div>
      </section>

      <Partnership />
    </main>
  );
}
