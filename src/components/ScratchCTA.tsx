// src/components/ScratchCTA.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  code?: string;          // optional voucher/label to reveal
  revealHref: string;     // where to send the user
  revealLabel?: string;   // button label
  className?: string;     // for outer sizing
};

export default function ScratchCTA({
  code = "UNLOCKED",
  revealHref,
  revealLabel = "Continue",
  className = "w-full max-w-3xl h-40 sm:h-44 md:h-48",
}: Props) {
  const nav = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const radius = 28;

  const drawOverlay = () => {
    const c = canvasRef.current;
    if (!c) return;
    const dpr = typeof window !== "undefined" && window.devicePixelRatio ? window.devicePixelRatio : 1;

    const rect = c.getBoundingClientRect();
    c.width = Math.max(1, Math.round(rect.width * dpr));
    c.height = Math.max(1, Math.round(rect.height * dpr));

    const ctx = c.getContext("2d");
    if (!ctx) return;
    if ((ctx as any).resetTransform) (ctx as any).resetTransform();
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    const grd = ctx.createLinearGradient(0, 0, w, h);
    grd.addColorStop(0, "rgba(255,255,255,0.92)");
    grd.addColorStop(1, "rgba(210,210,210,0.92)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "rgba(0,0,0,.6)";
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
  }, [revealed]);

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

    const measureAccurate = () => {
      const img = ctx.getImageData(0, 0, c.width, c.height).data;
      let cleared = 0;
      // accurate count of cleared alpha pixels
      for (let i = 3; i < img.length; i += 4) {
        if (img[i] === 0) cleared++;
      }
      const p = cleared / (img.length / 4);
      setProgress(p);
      if (p >= 0.5) {
        setRevealed(true);
        c.style.transition = "opacity 300ms ease";
        c.style.opacity = "0";
        setTimeout(() => (c.style.display = "none"), 320);
      }
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
      measureAccurate();
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

  return (
    <div
      className={`relative rounded-xl bg-white text-neutral-900 shadow-lg ring-1 ring-black/10 overflow-hidden ${className}`}
      role="button"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Scratch to reveal your priority link"
    >
      <div className="absolute inset-0 grid place-items-center p-4">
        <div className="text-center">
          <p className="text-sm text-neutral-500">Bonus unlocked</p>
          <div className="mt-1 text-2xl font-semibold tracking-tight">{code}</div>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="rounded-md px-3 py-2 text-sm font-medium ring-1 ring-neutral-300 hover:bg-neutral-50"
            >
              Copy code
            </button>
          <button
              onClick={() => nav(revealHref)}
              className="rounded-md bg-neutral-900 text-white px-4 py-2 text-sm font-medium hover:bg-neutral-800"
            >
              {revealLabel}
            </button>
          </div>

          {!revealed && (
            <p className="mt-3 text-xs text-neutral-500">
              {Math.round(progress * 100)}% revealed
            </p>
          )}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full touch-none cursor-pointer"
        style={{ display: revealed ? "none" : "block" }}
      />
    </div>
  );
}
