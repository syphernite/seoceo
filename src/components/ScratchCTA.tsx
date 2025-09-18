// src/components/ScratchCTA.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  revealHref: string;      // supports absolute URLs
  className?: string;      // optional outer sizing
  width?: number;          // optional fixed width
  height?: number;         // optional fixed height
};

export default function ScratchCTA({
  revealHref,
  className = "w-full max-w-3xl h-40 sm:h-44 md:h-48",
  width,
  height,
}: Props) {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    const wrap = wrapperRef.current;
    if (!c || !wrap) return;

    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = wrap.getBoundingClientRect();
    const w = Math.floor(width ?? rect.width);
    const h = Math.floor(height ?? rect.height);
    c.width = w;
    c.height = h;

    // Dark, near-opaque overlay
    const grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, "rgba(12,14,20,0.98)");
    grd.addColorStop(1, "rgba(28,32,44,0.98)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    // Subtle foil highlight
    const highlight = ctx.createLinearGradient(0, 0, 0, Math.max(20, h * 0.12));
    highlight.addColorStop(0, "rgba(255,255,255,0.10)");
    highlight.addColorStop(1, "rgba(255,255,255,0.00)");
    ctx.fillStyle = highlight;
    ctx.fillRect(0, 0, w, Math.max(20, h * 0.12));

    // Instruction text on the overlay
    ctx.font = `${Math.max(16, Math.floor(h * 0.18))}px ui-sans-serif, system-ui`;
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch to reveal", w / 2, h / 2);

    // Erase blending
    let down = false;
    const eraseRadius = Math.max(16, Math.floor(Math.min(w, h) * 0.06));

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, eraseRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    };

    const getXY = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onDown = (e: PointerEvent) => {
      down = true;
      const { x, y } = getXY(e);
      scratch(x, y);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const { x, y } = getXY(e);
      scratch(x, y);
    };
    const onUp = () => {
      down = false;
      // when first fully revealed, fade overlay
      setRevealed(true);
      c.style.transition = "opacity 300ms ease";
      c.style.opacity = "0";
      setTimeout(() => (c.style.display = "none"), 320);
    };

    c.addEventListener("pointerdown", onDown);
    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerup", onUp);
    c.addEventListener("pointercancel", onUp);

    return () => {
      c.removeEventListener("pointerdown", onDown);
      c.removeEventListener("pointermove", onMove);
      c.removeEventListener("pointerup", onUp);
      c.removeEventListener("pointercancel", onUp);
    };
  }, [width, height]);

  const handleRevealClick = () => {
    try {
      if (/^https?:\/\//i.test(revealHref)) {
        window.location.href = revealHref;
      } else {
        navigate(revealHref);
      }
    } catch {
      window.location.href = revealHref;
    }
  };

  return (
    <div className="px-4">
      <div
        ref={wrapperRef}
        className={`relative ${className}`}
        role="button"
        tabIndex={0}
        onClick={() => !revealed && handleRevealClick()}
        onKeyDown={(e) => {
          if (!revealed && (e.key === "Enter" || e.key === " ")) handleRevealClick();
        }}
      >
        {/* Content revealed underneath */}
        {revealed ? (
          <button
            type="button"
            onClick={handleRevealClick}
            className="absolute inset-0 m-auto h-12 w-48 rounded-full bg-emerald-500/90 text-white font-medium shadow-lg backdrop-blur glass-cta"
          >
            Go
          </button>
        ) : (
          <>
            {/* Always-visible label until reveal */}
            <div
              data-testid="scratch-label"
              className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
            >
              <span className="text-white/90 text-base sm:text-lg font-medium tracking-wide">
                Scratch to reveal
              </span>
            </div>
          </>
        )}

        {/* overlay to scratch */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none cursor-pointer"
          role="img"
          aria-label="Scratch to reveal your priority link"
          style={{ display: revealed ? "none" : "block" }}
        />
      </div>
    </div>
  );
}
