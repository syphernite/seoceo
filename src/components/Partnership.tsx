// src/components/Partnership.tsx
import React from "react";
import { tokens } from "../styles/tokens";
import ScratchCTA from "./ScratchCTA";

export default function Partnership() {
  return (
    <section className={tokens.section}>
      <div className={tokens.container}>
        <div className={`${tokens.card} p-0 overflow-hidden`}>
          <div className="bg-neutral-900 text-white px-6 py-10 md:px-10">
            <h3 className="text-xl md:text-2xl font-semibold text-center">
              You made it to the end — unlock a free website audit and demo proposal
            </h3>
            <p className="mt-2 text-sm md:text-base text-white/80 text-center">
            </p>

            <div className="mt-6 flex justify-center">
              <ScratchCTA
                width={720}
                height={180}
                revealHref="https://built4you.org"
                revealLabel="Start priority demo"
                code="PRIORITY-END"
              />
            </div>

            <p className="mt-4 text-xs text-white/70 text-center">
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
