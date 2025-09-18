// src/components/Partnership.tsx
import React from "react";
import { tokens } from "../styles/tokens";
import ScratchCTA from "./ScratchCTA";

export default function Partnership() {
  return (
    <section className={`${tokens.section} grid place-items-center`}>
      <div className="w-full max-w-4xl px-4 md:px-6">
        <h3 className="text-center text-xl md:text-2xl font-semibold text-black mb-8">
          No Website? Follow the prompts to unlock a free, custom site.
        </h3>

        {/* hard-center wrapper */}
        <div className="grid place-items-center">
          <ScratchCTA
            revealHref="https://built4you.org"
            revealLabel="Next"
            className="w-[min(92vw,900px)] h-[min(42vw,220px)]"
          />
        </div>
      </div>
    </section>
  );
}
