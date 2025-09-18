// src/components/Partnership.tsx
import React from "react";
import { tokens } from "../styles/tokens";
import ScratchCTA from "./ScratchCTA";

export default function Partnership() {
  return (
    <section className={tokens.section}>
      <div className={tokens.container}>
        {/* Heading moved above the scratch field and flipped to black */}
        <h3 className="text-xl md:text-2xl font-semibold text-center text-black mb-4">
          No Website? Follow the prompts to unlock a free, custom site.
        </h3>

        <div className={`${tokens.card} p-6`}>
          <div className="flex justify-center">
            <ScratchCTA
              width={720}
              height={180}
              revealHref="https://built4you.org"
              revealLabel="Next"
              code="PRIORITY-END"
              className="w-full max-w-3xl h-44"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
