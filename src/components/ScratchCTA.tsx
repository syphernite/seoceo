// src/components/ScratchCTA.tsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
  revealHref: string;
  className?: string;
  width?: number;
  height?: number;
  revealLabel?: string;
};

export default function ScratchCTA({
  revealHref,
  className = "w-full max-w-2xl h-40 sm:h-44 md:h-48",
  width,
  height,
  revealLabel,
}: Props) {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  const paintCover = () => {
    const c = canvasRef.current;
    const wrap = wrapRef.current;
    if (!c || !wrap) return;

    const dpr = window.devicePixelRatio || 1;
    const w = width ?? Math.floor(wrap.clientWidth);
    const h = height ?? Math.floor(wrap.clientHeight);

    c.style.width = w + "px";
    c.style.height = h + "px";
    c.width = w * dpr;
    c.height = h * dpr;

    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, w - 2, h - 2);

    ctx.fillStyle = "rgba(255,255,255,0.85)";
    const fs = Math.max(14, Math.min(28, Math.floor(w / 18)));
    ctx.font = `600 ${fs}px system-ui, -apple-system, Segoe UI, Roboto`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch to reveal", w / 2, h / 2);
  };

  useEffect(() => {
    paintCover();
    const onResize = () => {
      if (!revealed) paintCover();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let drawing = false;

    const scratchAt = (x: number, y: number) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = 36;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.01, y + 0.01);
      ctx.stroke();
    };

    const pointerPos = (e: PointerEvent) => {
      const rect = c.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onDown = (e: PointerEvent) => {
      drawing = true;
      c.setPointerCapture(e.pointerId);
      const { x, y } = pointerPos(e);
      scratchAt(x, y);
      e.preventDefault();
    };

    const onMove = (e: PointerEvent) => {
      if (!drawing) return;
      const { x, y } = pointerPos(e);
      scratchAt(x, y);
      e.preventDefault();
    };

    const onUp = (e: PointerEvent) => {
      drawing = false;
      try { c.releasePointerCapture(e.pointerId); } catch {}
      // immediately reveal once user stops scratching
      setRevealed(true);
    };

    c.addEventListener("pointerdown", onDown, { passive: false });
    c.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp, { passive: false });

    return () => {
      c.removeEventListener("pointerdown", onDown);
      c.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [revealed]);

  const go = () => {
    try {
      const url = new URL(revealHref, window.location.href);
      if (url.origin === window.location.origin) {
        navigate(url.pathname + url.search + url.hash);
      } else {
        window.location.href = url.toString();
      }
    } catch {
      navigate(revealHref);
    }
  };

  return (
    <div className={className}>
      <div
        ref={wrapRef}
        className="relative mx-auto w-full h-full rounded-xl border border-black/10 bg-white"
      >
        {revealed && (
          <div className="absolute inset-0 grid place-items-center">
            <button
              onClick={go}
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.8)] hover:shadow-[0_0_36px_rgba(16,185,129,0.9)] transition-shadow"
            >
              {revealLabel ?? "Next"}
            </button>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none cursor-pointer rounded-xl"
          role="img"
          aria-label="Scratch to reveal"
          style={{ display: revealed ? "none" : "block" }}
        />
      </div>
    </div>
  );
}
