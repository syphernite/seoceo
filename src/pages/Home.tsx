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

      <section id="pricing" className={`${tokens.section} flex flex-col items-center justify-center`}>
        <div className="w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white p-10 text-black shadow-sm flex flex-col items-center">
          <h2 className={`${tokens.heading.h2} text-center`} data-anchor-target="true">
            {plan.name}
          </h2>
          <p className="mt-2 text-5xl font-semibold leading-tight text-center">{plan.price}</p>
          <p className="mt-1 text-neutral-400 text-center">{plan.period}</p>

          {/* evenly spaced bullet columns centered */}
          <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-16 text-base text-neutral-700 w-full max-w-md">
            {plan.highlights.map((h) => (
              <li key={h} className="relative pl-6 text-center md:text-left">
                <span className="absolute left-0 top-3 h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-10 flex justify-center w-full">
            <div className="w-full max-w-sm">
              <SlideToStartCTA to={plan.cta.href} label={plan.cta.label} />
            </div>
          </div>
        </div>
      </section>

      <Partnership />
    </main>
  );
}
