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
  const nav = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const radius = 28;

  const drawOverlay = () => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = typeof window !== "undefined" && window.devicePixelRatio ? window.devicePixelRatio : 1;

    if (width) c.style.width = `${width}px`;
    if (height) c.style.height = `${height}px`;

    const rect = c.getBoundingClientRect();
    c.width = Math.max(1, Math.round(rect.width * dpr));
    c.height = Math.max(1, Math.round(rect.height * dpr));

    const ctx = c.getContext("2d");
    if (!ctx) return;
    (ctx as any).resetTransform?.();
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

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

    // Hint text
    ctx.fillStyle = "rgba(255,255,255,.75)";
    ctx.font = "600 14px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch to reveal", w / 2, h / 2);
  };

  useEffect(() => {
    drawOverlay();
    const ro = new ResizeObserver(() => {
      if (!revealed) drawOverlay();
    });
    const c = canvasRef.current;
    if (c) ro.observe(c);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, width, height]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || revealed) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let down = false;

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    };

    const pos = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const onDown = (e: PointerEvent) => {
      down = true;
      c.setPointerCapture(e.pointerId);
      const { x, y } = pos(e);
      scratch(x, y);
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const { x, y } = pos(e);
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
  }, [revealed]);

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setRevealed(true);
      const c = canvasRef.current;
      if (c) {
        c.style.transition = "opacity 300ms ease";
        c.style.opacity = "0";
        setTimeout(() => (c.style.display = "none"), 320);
      }
    }
  };

  const go = () => {
    if (/^https?:\/\//i.test(revealHref)) {
      window.location.href = revealHref;
    } else {
      nav(revealHref);
    }
  };

  const styleInline: React.CSSProperties =
    width || height ? { width: width ? `${width}px` : undefined, height: height ? `${height}px` : undefined } : {};

  return (
    <div
      className={`relative rounded-xl bg-white text-neutral-900 shadow-lg ring-1 ring-black/10 overflow-hidden ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Scratch to reveal your priority link"
      style={styleInline}
    >
      {/* revealed content: ONLY the glowing button */}
      <div className="absolute inset-0 grid place-items-center p-4">
        {revealed && (
          <>
            {/* local styles for the glow */}
            <style>{`
              @keyframes crazyGlow {
                0% { box-shadow: 0 0 10px rgba(0,0,0,0.5), 0 0 20px rgba(16,185,129,0.35), 0 0 40px rgba(59,130,246,0.35); transform: scale(1); }
                50% { box-shadow: 0 0 24px rgba(0,0,0,0.7), 0 0 60px rgba(16,185,129,0.55), 0 0 90px rgba(59,130,246,0.55); transform: scale(1.015); }
                100% { box-shadow: 0 0 10px rgba(0,0,0,0.5), 0 0 20px rgba(16,185,129,0.35), 0 0 40px rgba(59,130,246,0.35); transform: scale(1); }
              }
              .glow-crazy {
                animation: crazyGlow 1.2s ease-in-out infinite;
              }
            `}</style>
            <button
              onClick={go}
              className="glow-crazy rounded-md bg-neutral-900 text-white px-6 py-3 text-base md:text-lg font-semibold"
            >
              Get Free Demo
            </button>
          </>
        )}
      </div>

      {/* overlay to scratch */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none cursor-pointer"
        style={{ display: revealed ? "none" : "block" }}
      />
    </div>
  );
}
